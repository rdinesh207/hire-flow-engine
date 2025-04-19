
// Original mock API service that will now call our FastAPI backend
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

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data for development when backend is not available
import { jobListings } from './mockData/jobs';
import { applicantProfiles } from './mockData/applicants';
import { users } from './mockData/users';

// Helper function to determine if we should use mock data
const useMockData = () => {
  // Check if API is reachable - in a real app you would have a more robust check
  // For now, we'll always try to use the real API and fall back to mock data
  return false;
};

// Mock authentication
export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // In a real app, we would call the authentication API
    // For now, we're using mock data
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(800);
    const user = users.find(u => u.email === email);
    if (user) {
      // In a real app, we would validate the password here
      return user;
    }
    return null;
  },
  
  register: async (name: string, email: string, password: string, role: 'recruiter' | 'applicant'): Promise<User | null> => {
    // In a real app, we would call the registration API
    // For now, we're using mock data
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
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
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300);
    return users[0];
  },

  logout: async (): Promise<void> => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(300);
    // In a real app, we would invalidate the session/token here
  }
};

// Jobs API
export const jobsService = {
  getJobs: async (): Promise<JobListing[]> => {
    if (useMockData()) {
      return new Promise(resolve => setTimeout(() => resolve(jobListings), 800));
    }
    
    try {
      const response = await fetch(`${API_URL}/jobs/`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return jobListings; // Fallback to mock data
    }
  },
  
  getJob: async (id: string): Promise<JobListing | null> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve(jobListings.find(job => job.id === id) || null), 600)
      );
    }
    
    try {
      const response = await fetch(`${API_URL}/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      return await response.json();
    } catch (error) {
      console.error('Error fetching job:', error);
      return jobListings.find(job => job.id === id) || null; // Fallback to mock data
    }
  },
  
  createJob: async (job: Omit<JobListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobListing> => {
    if (useMockData()) {
      const newJob: JobListing = {
        ...job,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return new Promise(resolve => setTimeout(() => resolve(newJob), 1000));
    }
    
    try {
      const response = await fetch(`${API_URL}/jobs/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      if (!response.ok) throw new Error('Failed to create job');
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
      // Fallback
      return {
        ...job,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  uploadJobDescription: async (file: File): Promise<{jobData: Partial<JobListing>}> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve({
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
        }), 1500)
      );
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/jobs/parse`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to parse job description');
      return await response.json();
    } catch (error) {
      console.error('Error parsing job description:', error);
      // Fallback
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
    }
  },

  searchCandidates: async (jobId: string, filters?: SearchFilters): Promise<MatchResult<ApplicantProfile>[]> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve(
          applicantProfiles
            .map(profile => ({
              item: profile,
              score: Math.random() * 0.5 + 0.5,
              highlights: [{ field: "skills", matches: ["JavaScript", "React"] }]
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
        ), 1200)
      );
    }
    
    try {
      let url = `${API_URL}/search/applicants-for-job/${jobId}`;
      
      // Add filters if provided
      if (filters) {
        const params = new URLSearchParams();
        if (filters.keywords) params.append('keywords', filters.keywords.join(','));
        if (filters.minYearsExperience) params.append('min_years_experience', filters.minYearsExperience.toString());
        if (filters.education) params.append('education', filters.education.join(','));
        // Add other filters similarly
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to search candidates');
      return await response.json();
    } catch (error) {
      console.error('Error searching candidates:', error);
      // Fallback to mock data
      return applicantProfiles
        .map(profile => ({
          item: profile,
          score: Math.random() * 0.5 + 0.5,
          highlights: [{ field: "skills", matches: ["JavaScript", "React"] }]
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }
  },

  getJobRAGSummary: async (jobId: string): Promise<RAGSummary> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve({
          id: `summary-${jobId}`,
          summary: "This position requires a solid background in full-stack development with emphasis on modern JavaScript frameworks.",
          insights: [
            "TypeScript experience is highly valued",
            "Remote work is possible with occasional on-site meetings",
            "Team collaboration skills are emphasized alongside technical skills"
          ],
          createdAt: new Date().toISOString()
        }), 1500)
      );
    }
    
    try {
      const response = await fetch(`${API_URL}/rag/job/${jobId}`);
      if (!response.ok) throw new Error('Failed to get job RAG summary');
      return await response.json();
    } catch (error) {
      console.error('Error getting job RAG summary:', error);
      // Fallback
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
  }
};

// Applicants API
export const applicantsService = {
  getApplicants: async (): Promise<ApplicantProfile[]> => {
    if (useMockData()) {
      return new Promise(resolve => setTimeout(() => resolve(applicantProfiles), 800));
    }
    
    try {
      const response = await fetch(`${API_URL}/applicants/`);
      if (!response.ok) throw new Error('Failed to fetch applicants');
      return await response.json();
    } catch (error) {
      console.error('Error fetching applicants:', error);
      return applicantProfiles; // Fallback to mock data
    }
  },
  
  getApplicant: async (id: string): Promise<ApplicantProfile | null> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve(applicantProfiles.find(applicant => applicant.id === id) || null), 600)
      );
    }
    
    try {
      const response = await fetch(`${API_URL}/applicants/${id}`);
      if (!response.ok) throw new Error('Failed to fetch applicant');
      return await response.json();
    } catch (error) {
      console.error('Error fetching applicant:', error);
      return applicantProfiles.find(applicant => applicant.id === id) || null; // Fallback
    }
  },
  
  createApplicant: async (applicant: Omit<ApplicantProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApplicantProfile> => {
    if (useMockData()) {
      const newApplicant: ApplicantProfile = {
        ...applicant,
        id: `applicant-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return new Promise(resolve => setTimeout(() => resolve(newApplicant), 1000));
    }
    
    try {
      const response = await fetch(`${API_URL}/applicants/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicant)
      });
      if (!response.ok) throw new Error('Failed to create applicant');
      return await response.json();
    } catch (error) {
      console.error('Error creating applicant:', error);
      // Fallback
      return {
        ...applicant,
        id: `applicant-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  },
  
  uploadResume: async (file: File): Promise<{applicantData: Partial<ApplicantProfile>}> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve({
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
        }), 1500)
      );
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/applicants/parse`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Failed to parse resume');
      return await response.json();
    } catch (error) {
      console.error('Error parsing resume:', error);
      // Fallback
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
    }
  },

  searchJobs: async (applicantId: string, filters?: SearchFilters): Promise<MatchResult<JobListing>[]> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve(
          jobListings
            .map(job => ({
              item: job,
              score: Math.random() * 0.5 + 0.5,
              highlights: [{ field: "keywords", matches: ["JavaScript", "React"] }]
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
        ), 1200)
      );
    }
    
    try {
      let url = `${API_URL}/search/jobs-for-applicant/${applicantId}`;
      
      // Add filters if provided
      if (filters) {
        const params = new URLSearchParams();
        if (filters.keywords) params.append('keywords', filters.keywords.join(','));
        if (filters.minYearsExperience) params.append('min_years_experience', filters.minYearsExperience.toString());
        if (filters.education) params.append('education', filters.education.join(','));
        // Add other filters similarly
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to search jobs');
      return await response.json();
    } catch (error) {
      console.error('Error searching jobs:', error);
      // Fallback to mock data
      return jobListings
        .map(job => ({
          item: job,
          score: Math.random() * 0.5 + 0.5,
          highlights: [{ field: "keywords", matches: ["JavaScript", "React"] }]
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    }
  },

  getApplicantRAGSummary: async (applicantId: string): Promise<RAGSummary> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve({
          id: `summary-${applicantId}`,
          summary: "This candidate has strong experience in web development with a focus on React and Node.js.",
          insights: [
            "Has worked on similar projects in the past",
            "Experience with cloud platforms matches job requirements",
            "Has leadership experience that could be valuable for the team"
          ],
          createdAt: new Date().toISOString()
        }), 1500)
      );
    }
    
    try {
      const response = await fetch(`${API_URL}/rag/applicant/${applicantId}`);
      if (!response.ok) throw new Error('Failed to get applicant RAG summary');
      return await response.json();
    } catch (error) {
      console.error('Error getting applicant RAG summary:', error);
      // Fallback
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
    }
  },
  
  compareWithPeers: async (applicantId: string, peerIds: string[]): Promise<ComparisonResult[]> => {
    if (useMockData()) {
      return new Promise(resolve => 
        setTimeout(() => resolve(
          peerIds.map(peerId => ({
            id: `comparison-${Date.now()}-${peerId}`,
            userId: applicantId,
            peerId,
            similarityScore: Math.random() * 0.6 + 0.4,
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
          }))
        ), 1800)
      );
    }
    
    try {
      const results: ComparisonResult[] = [];
      
      // Call comparison endpoint for each peer
      for (const peerId of peerIds) {
        const response = await fetch(`${API_URL}/compare/${applicantId}/${peerId}`);
        if (!response.ok) throw new Error(`Failed to compare with peer ${peerId}`);
        const result = await response.json();
        results.push(result);
      }
      
      return results;
    } catch (error) {
      console.error('Error comparing with peers:', error);
      // Fallback
      return peerIds.map(peerId => ({
        id: `comparison-${Date.now()}-${peerId}`,
        userId: applicantId,
        peerId,
        similarityScore: Math.random() * 0.6 + 0.4,
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
    }
  },
  
  getComparisonHeatmap: async (applicantId: string, peerIds: string[]): Promise<HeatmapData[]> => {
    if (useMockData()) {
      const skills = ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker", "SQL", "System Design", "Algorithm", "Testing"];
      const heatmapData: HeatmapData[] = [];
      
      for (const skill of skills) {
        for (const peerId of [...peerIds, applicantId]) {
          heatmapData.push({
            x: skill,
            y: peerId === applicantId ? "You" : `Peer ${peerIds.indexOf(peerId) + 1}`,
            value: Math.random() * 0.7 + 0.3
          });
        }
      }
      
      return new Promise(resolve => setTimeout(() => resolve(heatmapData), 1500));
    }
    
    try {
      const params = new URLSearchParams();
      peerIds.forEach(id => params.append('peer_ids', id));
      
      const response = await fetch(`${API_URL}/compare/heatmap/${applicantId}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to get comparison heatmap');
      return await response.json();
    } catch (error) {
      console.error('Error getting comparison heatmap:', error);
      // Fallback
      const skills = ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "Docker", "SQL", "System Design", "Algorithm", "Testing"];
      const heatmapData: HeatmapData[] = [];
      
      for (const skill of skills) {
        for (const peerId of [...peerIds, applicantId]) {
          heatmapData.push({
            x: skill,
            y: peerId === applicantId ? "You" : `Peer ${peerIds.indexOf(peerId) + 1}`,
            value: Math.random() * 0.7 + 0.3
          });
        }
      }
      
      return heatmapData;
    }
  }
};
