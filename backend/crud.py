
from sqlalchemy.orm import Session
import uuid
from datetime import datetime
from . import models, schemas

# Job operations
def get_job(db: Session, job_id: str):
    return db.query(models.Job).filter(models.Job.id == job_id).first()

def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()

def create_job(db: Session, job: schemas.JobCreate):
    job_id = f"job-{uuid.uuid4()}"
    db_job = models.Job(
        id=job_id,
        **job.dict(exclude_unset=True),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def update_job(db: Session, job_id: str, job_data: dict):
    db_job = get_job(db, job_id)
    if db_job:
        for key, value in job_data.items():
            setattr(db_job, key, value)
        db_job.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_job)
    return db_job

# Applicant operations
def get_applicant(db: Session, applicant_id: str):
    return db.query(models.Applicant).filter(models.Applicant.id == applicant_id).first()

def get_applicants(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Applicant).offset(skip).limit(limit).all()

def create_applicant(db: Session, applicant: schemas.ApplicantCreate):
    applicant_id = f"applicant-{uuid.uuid4()}"
    db_applicant = models.Applicant(
        id=applicant_id,
        **applicant.dict(exclude_unset=True),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

def update_applicant(db: Session, applicant_id: str, applicant_data: dict):
    db_applicant = get_applicant(db, applicant_id)
    if db_applicant:
        for key, value in applicant_data.items():
            setattr(db_applicant, key, value)
        db_applicant.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_applicant)
    return db_applicant

# Comparison operations
def get_comparison(db: Session, comparison_id: str):
    return db.query(models.ComparisonResult).filter(models.ComparisonResult.id == comparison_id).first()

def get_comparisons_for_user(db: Session, user_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.ComparisonResult).filter(
        models.ComparisonResult.user_id == user_id
    ).offset(skip).limit(limit).all()

def create_comparison(db: Session, comparison: schemas.ComparisonResultCreate):
    comparison_id = f"comparison-{uuid.uuid4()}"
    db_comparison = models.ComparisonResult(
        id=comparison_id,
        **comparison.dict(exclude_unset=True),
        created_at=datetime.utcnow()
    )
    db.add(db_comparison)
    db.commit()
    db.refresh(db_comparison)
    return db_comparison
