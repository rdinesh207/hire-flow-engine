
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import datetime

# Job schemas
class JobBase(BaseModel):
    url: Optional[str] = None
    title: str
    company: str
    description: str
    country: str
    date: str
    sponsorship: bool
    min_years_experience: int = Field(..., alias="minYearsExperience")
    min_education: str = Field(..., alias="minEducation")
    position_level: str = Field(..., alias="positionLevel")
    keywords: List[str]
    recruiter_id: str = Field(..., alias="recruiterId")
    recruiter_name: str = Field(..., alias="recruiterName")

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True

# Work Experience schema
class WorkExperience(BaseModel):
    company: str
    title: str
    start_date: str
    end_date: Optional[str] = None
    description: str
    skills: List[str]

# Education schema
class Education(BaseModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: Optional[str] = None

# Project schema
class Project(BaseModel):
    name: str
    description: str
    url: Optional[str] = None
    technologies: List[str]

# Applicant schemas
class ApplicantBase(BaseModel):
    name: str
    work_authorization: str = Field(..., alias="workAuthorization")
    years_of_experience: int = Field(..., alias="yearsOfExperience")
    country_of_origin: str = Field(..., alias="countryOfOrigin")
    date_of_birth: Optional[str] = Field(None, alias="dateOfBirth")
    address: Optional[str] = None
    personal_statement: str = Field(..., alias="personalStatement")
    resume_file_type: str = Field(..., alias="resumeFileType")
    work_experience: List[WorkExperience] = Field(..., alias="workExperience")
    education: List[Education]
    last_position: str = Field(..., alias="lastPosition")
    last_position_level: str = Field(..., alias="lastPositionLevel")
    urls: Optional[List[str]] = None
    projects: Optional[List[Project]] = None

class ApplicantCreate(ApplicantBase):
    pass

class Applicant(ApplicantBase):
    id: str
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        orm_mode = True

# Match result schema
class MatchHighlight(BaseModel):
    field: str
    matches: List[str]

class MatchResult(BaseModel):
    item: Any  # Can be Job or Applicant
    score: float
    highlights: Optional[List[MatchHighlight]] = None

# RAG summary schema
class RAGSummary(BaseModel):
    id: str
    summary: str
    insights: List[str]
    created_at: datetime.datetime

# Comparison result schema
class ComparisonResultBase(BaseModel):
    user_id: str = Field(..., alias="userId")
    peer_id: str = Field(..., alias="peerId")
    similarity_score: float = Field(..., alias="similarityScore")
    skill_gaps: List[str] = Field(..., alias="skillGaps")
    recommendations: List[str]

class ComparisonResultCreate(ComparisonResultBase):
    pass

class ComparisonResult(ComparisonResultBase):
    id: str
    created_at: datetime.datetime

    class Config:
        orm_mode = True

# Heatmap data schema
class HeatmapData(BaseModel):
    x: str
    y: str
    value: float

# File upload schemas
class JobUploadResponse(BaseModel):
    job_data: Dict[str, Any] = Field(..., alias="jobData")

class ApplicantUploadResponse(BaseModel):
    applicant_data: Dict[str, Any] = Field(..., alias="applicantData")

# Search filter schema
class SearchFilters(BaseModel):
    keywords: Optional[List[str]] = None
    min_years_experience: Optional[int] = Field(None, alias="minYearsExperience")
    max_years_experience: Optional[int] = Field(None, alias="maxYearsExperience")
    education: Optional[List[str]] = None
    country: Optional[List[str]] = None
    position_level: Optional[List[str]] = Field(None, alias="positionLevel")
    sponsorship: Optional[bool] = None
