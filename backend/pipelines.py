
import os
import json
import fitz  # PyMuPDF for PDF processing
from typing import Dict, List, Any, Optional
import pinecone
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_vertexai import VertexAI, VertexAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.docstore.document import Document
from pydantic import BaseModel
import uuid

# Setup API keys from environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENVIRONMENT = os.getenv("PINECONE_ENVIRONMENT", "us-west4-gcp")

# Initialize Pinecone
pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT)

# Initialize LLM and embeddings
llm = VertexAI(model_name="gemini-pro", temperature=0)
embeddings = VertexAIEmbeddings(model_name="gemini-embedding-exp-03-07")

# Ensure indexes exist
def ensure_pinecone_indexes():
    """Create Pinecone indexes if they don't exist."""
    current_indexes = pinecone.list_indexes()
    
    if "jobs-index" not in current_indexes:
        pinecone.create_index(
            name="jobs-index",
            dimension=768,  # Dimension of the embedding model
            metric="cosine"
        )
    
    if "apps-index" not in current_indexes:
        pinecone.create_index(
            name="apps-index",
            dimension=768,  # Dimension of the embedding model
            metric="cosine"
        )

# Document parsing
def parse_job_description(text: str) -> Dict[str, Any]:
    """Parse job description text using LLM."""
    prompt = f"""
    Extract the following information from this job description in JSON format:
    
    - title (string): The job title
    - company (string): Company name
    - description (string): Full job description
    - country (string): Country of job location
    - date (string): Posting date in YYYY-MM-DD format if available, otherwise use today's date
    - sponsorship (boolean): Whether the job offers visa sponsorship
    - minYearsExperience (number): Minimum years of experience required
    - minEducation (string): Minimum education level (e.g. "Bachelor's", "Master's", "PhD", "None")
    - positionLevel (string): Job level (e.g. "Entry-level", "Mid-level", "Senior", "Lead", "Executive")
    - keywords (array of strings): Important skills or keywords from the description
    - recruiterId (string): Use "recruiter-1" as placeholder
    - recruiterName (string): Use "Recruitment Team" as placeholder
    
    Job Description:
    {text}
    
    Respond with ONLY the JSON object with no additional text.
    """
    
    response = llm.invoke(prompt)
    try:
        result = json.loads(response)
        # Add default ID
        result["id"] = f"job-{uuid.uuid4()}"
        return result
    except json.JSONDecodeError:
        # Fallback with minimal info if parsing fails
        return {
            "id": f"job-{uuid.uuid4()}",
            "title": "Unknown Position",
            "company": "Unknown Company",
            "description": text[:500],
            "country": "Unknown",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "sponsorship": False,
            "minYearsExperience": 0,
            "minEducation": "None",
            "positionLevel": "Not Specified",
            "keywords": [],
            "recruiterId": "recruiter-1",
            "recruiterName": "Recruitment Team"
        }

def parse_resume(pdf_path: str) -> Dict[str, Any]:
    """Extract text from PDF and parse resume using LLM."""
    # Extract text from PDF
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
    except Exception as e:
        return {"error": f"Failed to extract text from PDF: {str(e)}"}
    
    # Parse resume with LLM
    prompt = f"""
    Extract the following information from this resume in JSON format:
    
    - name (string): Full name of the applicant
    - workAuthorization (string): Work authorization status if mentioned
    - yearsOfExperience (number): Total years of professional experience
    - countryOfOrigin (string): Country of origin if mentioned
    - dateOfBirth (string, optional): DOB in YYYY-MM-DD format if mentioned
    - address (string, optional): Address if mentioned
    - personalStatement (string): Summary or objective statement
    - resumeFileType (string): Use "PDF"
    - workExperience (array): List of work experiences, each with:
        - company (string): Company name
        - title (string): Job title
        - startDate (string): Start date (YYYY-MM format)
        - endDate (string, optional): End date (YYYY-MM format) or "Present"
        - description (string): Job description
        - skills (array of strings): Skills used in this role
    - education (array): List of education, each with:
        - institution (string): School/university name
        - degree (string): Degree type
        - field (string): Field of study
        - startDate (string): Start date (YYYY-MM format)
        - endDate (string, optional): End date (YYYY-MM format)
    - lastPosition (string): Most recent job title
    - lastPositionLevel (string): Level of most recent position (e.g., "Entry", "Mid", "Senior")
    - urls (array of strings, optional): Professional URLs (LinkedIn, GitHub, etc.)
    - projects (array, optional): List of projects, each with:
        - name (string): Project name
        - description (string): Project description
        - url (string, optional): Project URL
        - technologies (array of strings): Technologies used
    
    Resume text:
    {text[:4000]}  # Limit text length to avoid token limits
    
    Respond with ONLY the JSON object with no additional text.
    """
    
    response = llm.invoke(prompt)
    try:
        result = json.loads(response)
        # Add default ID
        result["id"] = f"applicant-{uuid.uuid4()}"
        return result
    except json.JSONDecodeError:
        # Fallback with minimal info if parsing fails
        return {
            "id": f"applicant-{uuid.uuid4()}",
            "name": "Unknown Applicant",
            "workAuthorization": "Not Specified",
            "yearsOfExperience": 0,
            "countryOfOrigin": "Unknown",
            "personalStatement": text[:200] if text else "No information provided",
            "resumeFileType": "PDF",
            "workExperience": [],
            "education": [],
            "lastPosition": "Not Specified",
            "lastPositionLevel": "Not Specified",
        }

# Vector operations
def upsert_job_embedding(job_data: Dict[str, Any]):
    """Generate embedding for job and store in Pinecone."""
    # Create document from job data
    job_text = f"""
    Job Title: {job_data.get('title', '')}
    Company: {job_data.get('company', '')}
    Country: {job_data.get('country', '')}
    Experience Required: {job_data.get('minYearsExperience', '')} years
    Education Required: {job_data.get('minEducation', '')}
    Position Level: {job_data.get('positionLevel', '')}
    Keywords: {', '.join(job_data.get('keywords', []))}
    Description: {job_data.get('description', '')}
    """
    
    # Get embeddings for job
    job_embed = embeddings.embed_query(job_text)
    
    # Connect to Pinecone index
    index = pinecone.Index("jobs-index")
    
    # Create metadata
    metadata = {
        "id": job_data["id"],
        "title": job_data.get("title", ""),
        "company": job_data.get("company", ""),
        "country": job_data.get("country", ""),
        "min_years_experience": job_data.get("minYearsExperience", 0),
        "min_education": job_data.get("minEducation", ""),
        "position_level": job_data.get("positionLevel", ""),
        "keywords": ",".join(job_data.get("keywords", [])),
        "type": "job"
    }
    
    # Upsert to Pinecone
    index.upsert(
        vectors=[(job_data["id"], job_embed, metadata)],
        namespace="jobs"
    )
    
    return job_data["id"]

def upsert_applicant_embedding(applicant_data: Dict[str, Any]):
    """Generate embedding for applicant and store in Pinecone."""
    # Create document from applicant data
    # Extract skills from work experience
    all_skills = []
    for exp in applicant_data.get("workExperience", []):
        all_skills.extend(exp.get("skills", []))
    
    # Create text representation
    applicant_text = f"""
    Name: {applicant_data.get('name', '')}
    Years of Experience: {applicant_data.get('yearsOfExperience', '')}
    Last Position: {applicant_data.get('lastPosition', '')}
    Last Position Level: {applicant_data.get('lastPositionLevel', '')}
    Work Authorization: {applicant_data.get('workAuthorization', '')}
    Country of Origin: {applicant_data.get('countryOfOrigin', '')}
    Education: {', '.join([f"{edu.get('degree', '')} in {edu.get('field', '')} from {edu.get('institution', '')}" 
                           for edu in applicant_data.get('education', [])])}
    Skills: {', '.join(set(all_skills))}
    Statement: {applicant_data.get('personalStatement', '')}
    """
    
    # Get embeddings for applicant
    applicant_embed = embeddings.embed_query(applicant_text)
    
    # Connect to Pinecone index
    index = pinecone.Index("apps-index")
    
    # Create metadata
    metadata = {
        "id": applicant_data["id"],
        "name": applicant_data.get("name", ""),
        "years_experience": applicant_data.get("yearsOfExperience", 0),
        "last_position": applicant_data.get("lastPosition", ""),
        "last_position_level": applicant_data.get("lastPositionLevel", ""),
        "work_authorization": applicant_data.get("workAuthorization", ""),
        "skills": ",".join(set(all_skills)),
        "type": "applicant"
    }
    
    # Upsert to Pinecone
    index.upsert(
        vectors=[(applicant_data["id"], applicant_embed, metadata)],
        namespace="applicants"
    )
    
    return applicant_data["id"]

# Search operations
def search_jobs_for_applicant(applicant_id: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """Find top matching jobs for an applicant."""
    # Get applicant data first
    applicant_index = pinecone.Index("apps-index")
    applicant_vectors = applicant_index.fetch(ids=[applicant_id], namespace="applicants")
    
    if not applicant_vectors.vectors:
        return []
    
    # Get the applicant vector
    applicant_vector = applicant_vectors.vectors[applicant_id].values
    
    # Search in jobs index
    job_index = pinecone.Index("jobs-index")
    search_results = job_index.query(
        vector=applicant_vector,
        top_k=top_k,
        namespace="jobs",
        include_metadata=True
    )
    
    # Format results
    matches = []
    for match in search_results.matches:
        matches.append({
            "item": {
                "id": match.id,
                **{k: v for k, v in match.metadata.items() if k != "id"}
            },
            "score": match.score,
            "highlights": [
                {
                    "field": "keywords",
                    "matches": match.metadata.get("keywords", "").split(",")[:3]
                }
            ]
        })
    
    return matches

def search_applicants_for_job(job_id: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """Find top matching applicants for a job."""
    # Get job data first
    job_index = pinecone.Index("jobs-index")
    job_vectors = job_index.fetch(ids=[job_id], namespace="jobs")
    
    if not job_vectors.vectors:
        return []
    
    # Get the job vector
    job_vector = job_vectors.vectors[job_id].values
    
    # Search in applicants index
    applicant_index = pinecone.Index("apps-index")
    search_results = applicant_index.query(
        vector=job_vector,
        top_k=top_k,
        namespace="applicants",
        include_metadata=True
    )
    
    # Format results
    matches = []
    for match in search_results.matches:
        matches.append({
            "item": {
                "id": match.id,
                **{k: v for k, v in match.metadata.items() if k != "id"}
            },
            "score": match.score,
            "highlights": [
                {
                    "field": "skills",
                    "matches": match.metadata.get("skills", "").split(",")[:3]
                }
            ]
        })
    
    return matches

def compare_applicants(applicant_id_a: str, applicant_id_b: str) -> Dict[str, Any]:
    """Compare two applicants and provide analysis."""
    # Get both applicant data
    applicant_index = pinecone.Index("apps-index")
    applicant_vectors = applicant_index.fetch(
        ids=[applicant_id_a, applicant_id_b], 
        namespace="applicants"
    )
    
    if len(applicant_vectors.vectors) < 2:
        return {
            "error": "One or both applicant IDs not found"
        }
    
    # Get the applicant vectors
    vector_a = applicant_vectors.vectors[applicant_id_a].values
    vector_b = applicant_vectors.vectors[applicant_id_b].values
    metadata_a = applicant_vectors.vectors[applicant_id_a].metadata
    metadata_b = applicant_vectors.vectors[applicant_id_b].metadata
    
    # Calculate cosine similarity
    import numpy as np
    similarity_score = np.dot(vector_a, vector_b) / (np.linalg.norm(vector_a) * np.linalg.norm(vector_b))
    
    # Generate comparison analysis with LLM
    skills_a = metadata_a.get("skills", "").split(",")
    skills_b = metadata_b.get("skills", "").split(",")
    
    prompt = f"""
    Compare these two applicant profiles and provide:
    1. A list of skill gaps that Applicant A has compared to Applicant B
    2. Specific recommendations for Applicant A to improve their profile
    
    Applicant A:
    - Name: {metadata_a.get("name", "Unknown")}
    - Experience: {metadata_a.get("years_experience", "0")} years
    - Position: {metadata_a.get("last_position", "Unknown")}
    - Level: {metadata_a.get("last_position_level", "Unknown")}
    - Skills: {", ".join(skills_a)}
    
    Applicant B:
    - Name: {metadata_b.get("name", "Unknown")}
    - Experience: {metadata_b.get("years_experience", "0")} years
    - Position: {metadata_b.get("last_position", "Unknown")}
    - Level: {metadata_b.get("last_position_level", "Unknown")}
    - Skills: {", ".join(skills_b)}
    
    Respond with JSON containing:
    {
      "skillGaps": ["list", "of", "skills", "that", "A", "lacks"],
      "recommendations": ["list", "of", "specific", "recommendations"]
    }
    """
    
    response = llm.invoke(prompt)
    try:
        analysis = json.loads(response)
    except json.JSONDecodeError:
        # Fallback if parsing fails
        analysis = {
            "skillGaps": [],
            "recommendations": []
        }
    
    return {
        "id": f"comparison-{uuid.uuid4()}",
        "userId": applicant_id_a,
        "peerId": applicant_id_b,
        "similarityScore": float(similarity_score),
        "skillGaps": analysis.get("skillGaps", []),
        "recommendations": analysis.get("recommendations", []),
        "createdAt": datetime.now().isoformat()
    }

# Generate RAG summary
def generate_job_rag_summary(job_id: str) -> Dict[str, Any]:
    """Generate a RAG summary for a job."""
    # Get job data
    job_index = pinecone.Index("jobs-index")
    job_vectors = job_index.fetch(ids=[job_id], namespace="jobs")
    
    if not job_vectors.vectors:
        return {
            "id": f"summary-{job_id}",
            "summary": "Job not found",
            "insights": [],
            "createdAt": datetime.now().isoformat()
        }
    
    metadata = job_vectors.vectors[job_id].metadata
    
    prompt = f"""
    Generate a comprehensive summary and key insights for this job:
    
    Job Title: {metadata.get("title", "")}
    Company: {metadata.get("company", "")}
    Country: {metadata.get("country", "")}
    Experience Required: {metadata.get("min_years_experience", "")} years
    Education Required: {metadata.get("min_education", "")}
    Position Level: {metadata.get("position_level", "")}
    Keywords: {metadata.get("keywords", "")}
    
    Respond with JSON containing:
    {{
      "summary": "A paragraph summarizing the job and its requirements",
      "insights": ["list", "of", "key", "insights", "about", "this", "position"]
    }}
    """
    
    response = llm.invoke(prompt)
    try:
        analysis = json.loads(response)
    except json.JSONDecodeError:
        # Fallback if parsing fails
        analysis = {
            "summary": f"This is a {metadata.get('position_level', '')} {metadata.get('title', '')} position at {metadata.get('company', '')}.",
            "insights": []
        }
    
    return {
        "id": f"summary-{job_id}",
        "summary": analysis.get("summary", ""),
        "insights": analysis.get("insights", []),
        "createdAt": datetime.now().isoformat()
    }

def generate_applicant_rag_summary(applicant_id: str) -> Dict[str, Any]:
    """Generate a RAG summary for an applicant."""
    # Get applicant data
    applicant_index = pinecone.Index("apps-index")
    applicant_vectors = applicant_index.fetch(ids=[applicant_id], namespace="applicants")
    
    if not applicant_vectors.vectors:
        return {
            "id": f"summary-{applicant_id}",
            "summary": "Applicant not found",
            "insights": [],
            "createdAt": datetime.now().isoformat()
        }
    
    metadata = applicant_vectors.vectors[applicant_id].metadata
    
    prompt = f"""
    Generate a comprehensive summary and key insights for this applicant:
    
    Name: {metadata.get("name", "")}
    Years of Experience: {metadata.get("years_experience", "")}
    Last Position: {metadata.get("last_position", "")}
    Last Position Level: {metadata.get("last_position_level", "")}
    Work Authorization: {metadata.get("work_authorization", "")}
    Skills: {metadata.get("skills", "")}
    
    Respond with JSON containing:
    {{
      "summary": "A paragraph summarizing the applicant's background and skills",
      "insights": ["list", "of", "key", "insights", "about", "this", "candidate"]
    }}
    """
    
    response = llm.invoke(prompt)
    try:
        analysis = json.loads(response)
    except json.JSONDecodeError:
        # Fallback if parsing fails
        analysis = {
            "summary": f"{metadata.get('name', 'This candidate')} has {metadata.get('years_experience', '0')} years of experience, most recently as a {metadata.get('last_position', 'professional')}.",
            "insights": []
        }
    
    return {
        "id": f"summary-{applicant_id}",
        "summary": analysis.get("summary", ""),
        "insights": analysis.get("insights", []),
        "createdAt": datetime.now().isoformat()
    }

# Generate heatmap data
def generate_comparison_heatmap(applicant_id: str, peer_ids: List[str]) -> List[Dict[str, Any]]:
    """Generate heatmap data for comparison."""
    # Get all applicants' data
    all_ids = [applicant_id] + peer_ids
    applicant_index = pinecone.Index("apps-index")
    all_vectors = applicant_index.fetch(ids=all_ids, namespace="applicants")
    
    if not all_vectors.vectors:
        return []
    
    # Get skills from all applicants
    all_skills = set()
    for id, vector_data in all_vectors.vectors.items():
        skills = vector_data.metadata.get("skills", "").split(",")
        all_skills.update([s for s in skills if s])
    
    # Limit to top 10 skills
    top_skills = list(all_skills)[:10]
    
    # Generate heatmap data
    heatmap_data = []
    for skill in top_skills:
        for idx, id in enumerate(all_ids):
            # Skip if applicant not found
            if id not in all_vectors.vectors:
                continue
                
            applicant_skills = all_vectors.vectors[id].metadata.get("skills", "").split(",")
            # Calculate skill strength (simple presence/absence for now)
            value = 0.8 if skill in applicant_skills else 0.3
            
            heatmap_data.append({
                "x": skill,
                "y": "You" if id == applicant_id else f"Peer {peer_ids.index(id) + 1}",
                "value": value
            })
    
    return heatmap_data
