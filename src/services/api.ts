
import {
  ApplicantProfile,
  JobListing,
  MatchResult,
  RAGSummary,
  SearchFilters,
  ComparisonResult,
  HeatmapData,
  User
} from '../types';

// This is a mock API service that simulates what the real FastAPI backend would do
// In a real implementation, these would make actual HTTP requests to the backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
import { jobListings } from './mockData/jobs';
import { applicantProfiles } from './mockData/applicants';
import { users } from './mockData/users';

// Mock authentication
export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(800);
    const user = users.find(u => u.email === email);
    if (user) {
      // In a real app, we would validate the password here
      return user;
    }
    return null;
  },
  
  register: async (name: string, email: string, password: string, role: 'recruiter' | 'applicant'): Promise<User | null> => {
    await delay(800);
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
    };
    return newUser;
  },

  getCurrentUser: async (): Promise<User | null> => {
    // In a real app, we would validate the session/token here
    await delay(300);
    return users[0];
  },

  logout: async (): Promise<void> => {
    await delay(300);
    // In a real app, we would invalidate the session/token here
  }
};

// Jobs API
export const jobsService = {
  getJobs: async (): Promise<JobListing[]> => {
    await delay(800);
    return jobListings;
  },
  
  getJob: async (id: string): Promise<JobListing | null> => {
    await delay(600);
    return jobListings.find(job => job.id === id) || null;
  },
  
  createJob: async (job: Omit<JobListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobListing> => {
    await delay(1000);
    const newJob: JobListing = {
      ...job,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newJob;
  },
  
  uploadJobDescription: async (file: File): Promise<{jobData: Partial<JobListing>}> => {
    await delay(1500); // Simulating parsing and embedding
    return {
      jobData: {
        title: "Software Engineer",
        company: "TechFirm Inc",
        description: "We are looking for a skilled software engineer...",
        country: "United States",
        positionLevel: "Mid-level",
        keywords: ["JavaScript", "React", "Node.js"],
        minYearsExperience: 3,
        minEducation: "Bachelor's",
        sponsorship: true
      }
    };
  },

  searchCandidates: async (jobId: string, filters?: SearchFilters): Promise<MatchResult<ApplicantProfile>[]> => {
    await delay(1200); // Simulating vector search
    
    // In a real app, this would query Pinecone for vector similarity
    const results: MatchResult<ApplicantProfile>[] = applicantProfiles
      .map(profile => ({
        item: profile,
        score: Math.random() * 0.5 + 0.5, // Random scores between 0.5 and 1.0
        highlights: [
          {
            field: "skills",
            matches: ["JavaScript", "React"]
          }
        ]
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    return results;
  },

  getJobRAGSummary: async (jobId: string): Promise<RAGSummary> => {
    await delay(1500); // Simulating RAG processing
    return {
      id: `summary-${jobId}`,
      summary: "This position requires a solid background in full-stack development with emphasis on modern JavaScript frameworks.",
      insights: [
        "TypeScript experience is highly valued",
        "Remote work is possible with occasional on-site meetings",
        "Team collaboration skills are emphasized alongside technical skills"
      ],
      createdAt: new Date().toISOString()
    };
  }
};

// Applicants API
export const applicantsService = {
  getApplicants: async (): Promise<ApplicantProfile[]> => {
    await delay(800);
    return applicantProfiles;
  },
  
  getApplicant: async (id: string): Promise<ApplicantProfile | null> => {
    await delay(600);
    return applicantProfiles.find(applicant => applicant.id === id) || null;
  },
  
  createApplicant: async (applicant: Omit<ApplicantProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApplicantProfile> => {
    await delay(1000);
    const newApplicant: ApplicantProfile = {
      ...applicant,
      id: `applicant-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newApplicant;
  },
  
  uploadResume: async (file: File): Promise<{applicantData: Partial<ApplicantProfile>}> => {
    await delay(1500); // Simulating parsing and embedding
    return {
      applicantData: {
        name: "Alex Johnson",
        workAuthorization: "US Citizen",
        yearsOfExperience: 5,
        countryOfOrigin: "United States",
        personalStatement: "Experienced software engineer with a passion for...",
        lastPosition: "Senior Software Engineer",
        lastPositionLevel: "Senior",
        workExperience: [
          {
            company: "Tech Solutions Inc",
            title: "Senior Software Engineer",
            startDate: "2020-06-01",
            description: "Led development of cloud-based applications",
            skills: ["JavaScript", "React", "Node.js", "AWS"]
          }
        ],
        education: [
          {
            institution: "University of Technology",
            degree: "Bachelor's",
            field: "Computer Science",
            startDate: "2012-09-01",
            endDate: "2016-05-30"
          }
        ]
      }
    };
  },

  searchJobs: async (applicantId: string, filters?: SearchFilters): Promise<MatchResult<JobListing>[]> => {
    await delay(1200); // Simulating vector search
    
    // In a real app, this would query Pinecone for vector similarity
    const results: MatchResult<JobListing>[] = jobListings
      .map(job => ({
        item: job,
        score: Math.random() * 0.5 + 0.5, // Random scores between 0.5 and 1.0
        highlights: [
          {
            field: "keywords",
            matches: ["JavaScript", "React"]
          }
        ]
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    return results;
  },

  getApplicantRAGSummary: async (applicantId: string): Promise<RAGSummary> => {
    await delay(1500); // Simulating RAG processing
    return {
      id: `summary-${applicantId}`,
      summary: "This candidate has strong experience in web development with a focus on React and Node.js.",
      insights: [
        "Has worked on similar projects in the past",
        "Experience with cloud platforms matches job requirements",
        "Has leadership experience that could be valuable for the team"
      ],
      createdAt: new Date().toISOString()
    };
  },
  
  compareWithPeers: async (applicantId: string, peerIds: string[]): Promise<ComparisonResult[]> => {
    await delay(1800); // Simulating vector comparison and LLM processing
    
    return peerIds.map(peerId => ({
      id: `comparison-${Date.now()}-${peerId}`,
      userId: applicantId,
      peerId,
      similarityScore: Math.random() * 0.6 + 0.4, // Random scores between 0.4 and 1.0
      skillGaps: [
        "Cloud infrastructure experience",
        "Team leadership",
        "System design"
      ],
      recommendations: [
        "Consider obtaining AWS certifications",
        "Take on more leadership roles in current projects",
        "Practice system design interview questions"
      ],
      createdAt: new Date().toISOString()
    }));
  },
  
  getComparisonHeatmap: async (applicantId: string, peerIds: string[]): Promise<HeatmapData[]> => {
    await delay(1500);
    
    const skills = ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker", "SQL", "System Design", "Algorithm", "Testing"];
    
    const heatmapData: HeatmapData[] = [];
    
    for (const skill of skills) {
      for (const peerId of [...peerIds, applicantId]) {
        heatmapData.push({
          x: skill,
          y: peerId === applicantId ? "You" : `Peer ${peerIds.indexOf(peerId) + 1}`,
          value: Math.random() * 0.7 + 0.3 // Random values between 0.3 and 1.0
        });
      }
    }
    
    return heatmapData;
  }
};
