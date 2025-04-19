
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, JSON, Float, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    url = Column(String, nullable=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    description = Column(Text)
    country = Column(String)
    date = Column(String)
    sponsorship = Column(Boolean, default=False)
    min_years_experience = Column(Integer)
    min_education = Column(String)
    position_level = Column(String)
    keywords = Column(JSON)  # Store as JSON array
    recruiter_id = Column(String, index=True)
    recruiter_name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Vector embeddings are stored in Pinecone, not in SQLite

class Applicant(Base):
    __tablename__ = "applicants"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    work_authorization = Column(String)
    years_of_experience = Column(Integer)
    country_of_origin = Column(String)
    date_of_birth = Column(String, nullable=True)
    address = Column(String, nullable=True)
    personal_statement = Column(Text)
    resume_file_type = Column(String)
    work_experience = Column(JSON)  # Store as JSON array
    education = Column(JSON)  # Store as JSON array
    last_position = Column(String)
    last_position_level = Column(String)
    urls = Column(JSON, nullable=True)  # Store as JSON array
    projects = Column(JSON, nullable=True)  # Store as JSON array
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class ComparisonResult(Base):
    __tablename__ = "comparison_results"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    peer_id = Column(String, index=True)
    similarity_score = Column(Float)
    skill_gaps = Column(JSON)  # Store as JSON array
    recommendations = Column(JSON)  # Store as JSON array
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
