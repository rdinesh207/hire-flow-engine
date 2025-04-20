
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import tempfile
import shutil
import uuid
from typing import List, Optional
from datetime import datetime

from . import crud, models, schemas, pipelines
from .database import engine, get_db
from .kafka_worker import produce_message

# Create tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Recruitment Matching API",
    description="API for matching job seekers with job listings",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure Pinecone indexes exist on startup
@app.on_event("startup")
def startup_event():
    pipelines.ensure_pinecone_indexes()

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Recruitment Matching API is running"}

# Job endpoints
@app.get("/jobs/", response_model=List[schemas.Job])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = crud.get_jobs(db, skip=skip, limit=limit)
    return jobs

@app.get("/jobs/{job_id}", response_model=schemas.Job)
def read_job(job_id: str, db: Session = Depends(get_db)):
    db_job = crud.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job

@app.post("/jobs/parse", response_model=schemas.JobUploadResponse)
async def parse_job(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Create temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    try:
        # Save uploaded file to temp location
        with temp_file as f:
            shutil.copyfileobj(file.file, f)
        
        # Read the file content
        with open(temp_file.name, 'r') as f:
            content = f.read()
        
        # Parse job description
        job_data = pipelines.parse_job_description(content)
        
        # Save to database
        db_job = crud.create_job(db, schemas.JobCreate(**job_data))
        
        # Send to Kafka for async processing (embedding generation)
        background_tasks.add_task(
            produce_message,
            'generate-embedding',
            {'type': 'job', 'data': job_data}
        )
        
        return {"jobData": job_data}
    finally:
        # Clean up temp file
        os.unlink(temp_file.name)

# Applicant endpoints
@app.get("/applicants/", response_model=List[schemas.Applicant])
def read_applicants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applicants = crud.get_applicants(db, skip=skip, limit=limit)
    return applicants

@app.get("/applicants/{applicant_id}", response_model=schemas.Applicant)
def read_applicant(applicant_id: str, db: Session = Depends(get_db)):
    db_applicant = crud.get_applicant(db, applicant_id=applicant_id)
    if db_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return db_applicant

@app.post("/applicants/parse", response_model=schemas.ApplicantUploadResponse)
async def parse_applicant(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Validate file is PDF
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Create temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    try:
        # Save uploaded file to temp location
        with temp_file as f:
            shutil.copyfileobj(file.file, f)
        
        # Parse resume
        applicant_data = pipelines.parse_resume(temp_file.name)
        
        if "error" in applicant_data:
            raise HTTPException(status_code=400, detail=applicant_data["error"])
        
        # Save to database
        db_applicant = crud.create_applicant(db, schemas.ApplicantCreate(**applicant_data))
        
        # Send to Kafka for async processing (embedding generation)
        background_tasks.add_task(
            produce_message,
            'generate-embedding',
            {'type': 'applicant', 'data': applicant_data}
        )
        
        return {"applicantData": applicant_data}
    finally:
        # Clean up temp file
        os.unlink(temp_file.name)

# Search endpoints
@app.get("/search/jobs-for-applicant/{applicant_id}", response_model=List[schemas.MatchResult])
def search_jobs_for_applicant(
    applicant_id: str,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    # Verify applicant exists
    db_applicant = crud.get_applicant(db, applicant_id=applicant_id)
    if db_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Search for matching jobs
    matches = pipelines.search_jobs_for_applicant(applicant_id, top_k=limit)
    return matches

@app.get("/search/applicants-for-job/{job_id}", response_model=List[schemas.MatchResult])
def search_applicants_for_job(
    job_id: str,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    # Verify job exists
    db_job = crud.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Search for matching applicants
    matches = pipelines.search_applicants_for_job(job_id, top_k=limit)
    return matches

# Comparison endpoints
@app.get("/compare/{applicant_id_a}/{applicant_id_b}", response_model=schemas.ComparisonResult)
def compare_applicants(
    applicant_id_a: str,
    applicant_id_b: str,
    db: Session = Depends(get_db)
):
    # Verify both applicants exist
    db_applicant_a = crud.get_applicant(db, applicant_id=applicant_id_a)
    if db_applicant_a is None:
        raise HTTPException(status_code=404, detail="First applicant not found")
        
    db_applicant_b = crud.get_applicant(db, applicant_id=applicant_id_b)
    if db_applicant_b is None:
        raise HTTPException(status_code=404, detail="Second applicant not found")
    
    # Compare applicants
    comparison = pipelines.compare_applicants(applicant_id_a, applicant_id_b)
    
    # Save comparison to database
    if "error" not in comparison:
        db_comparison = crud.create_comparison(
            db, 
            schemas.ComparisonResultCreate(**comparison)
        )
    
    return comparison

@app.get("/compare/heatmap/{applicant_id}", response_model=List[schemas.HeatmapData])
def get_comparison_heatmap(
    applicant_id: str,
    peer_ids: List[str],
    db: Session = Depends(get_db)
):
    # Verify applicant exists
    db_applicant = crud.get_applicant(db, applicant_id=applicant_id)
    if db_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Generate heatmap data
    heatmap_data = pipelines.generate_comparison_heatmap(applicant_id, peer_ids)
    return heatmap_data

# RAG endpoints
@app.get("/rag/job/{job_id}", response_model=schemas.RAGSummary)
def get_job_rag_summary(
    job_id: str,
    db: Session = Depends(get_db)
):
    # Verify job exists
    db_job = crud.get_job(db, job_id=job_id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Generate RAG summary
    summary = pipelines.generate_job_rag_summary(job_id)
    return summary

@app.get("/rag/applicant/{applicant_id}", response_model=schemas.RAGSummary)
def get_applicant_rag_summary(
    applicant_id: str,
    db: Session = Depends(get_db)
):
    # Verify applicant exists
    db_applicant = crud.get_applicant(db, applicant_id=applicant_id)
    if db_applicant is None:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Generate RAG summary
    summary = pipelines.generate_applicant_rag_summary(applicant_id)
    return summary

# Run the server with: uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
