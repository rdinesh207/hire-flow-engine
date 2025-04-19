
// Common types
export type UserRole = 'recruiter' | 'applicant' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  avatar?: string;
}

// Job-related types
export interface JobListing {
  id: string;
  url?: string;
  title: string;
  company: string;
  description: string;
  country: string;
  date: string;
  sponsorship: boolean;
  minYearsExperience: number;
  minEducation: string;
  positionLevel: string;
  keywords: string[];
  recruiterId: string;
  recruiterName: string;
  createdAt: string;
  updatedAt: string;
}

// Applicant-related types
export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  technologies: string[];
}

export interface ApplicantProfile {
  id: string;
  name: string;
  workAuthorization: string;
  yearsOfExperience: number;
  countryOfOrigin: string;
  dateOfBirth?: string;
  address?: string;
  personalStatement: string;
  resumeFileType: string;
  workExperience: WorkExperience[];
  education: Education[];
  lastPosition: string;
  lastPositionLevel: string;
  urls: string[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

// Search-related types
export interface SearchFilters {
  keywords?: string[];
  minYearsExperience?: number;
  maxYearsExperience?: number;
  education?: string[];
  country?: string[];
  positionLevel?: string[];
  sponsorship?: boolean;
}

export interface MatchResult<T> {
  item: T;
  score: number;
  highlights?: {
    field: string;
    matches: string[];
  }[];
}

// RAG-related types
export interface RAGSummary {
  id: string;
  summary: string;
  insights: string[];
  createdAt: string;
}

// Comparison-related types
export interface ComparisonResult {
  id: string;
  userId: string;
  peerId: string;
  similarityScore: number;
  skillGaps: string[];
  recommendations: string[];
  createdAt: string;
}

export interface HeatmapData {
  x: string;
  y: string;
  value: number;
}
