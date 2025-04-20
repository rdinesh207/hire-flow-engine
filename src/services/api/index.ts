
import axios from 'axios';
import { JobListing, ApplicantProfile, MatchResult, ComparisonResult, HeatmapData, RAGSummary } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Jobs
export const jobsService = {
  async getJobs() {
    const response = await apiClient.get<JobListing[]>('/jobs/');
    return response.data;
  },

  async getJob(id: string) {
    const response = await apiClient.get<JobListing>(`/jobs/${id}`);
    return response.data;
  },

  async parseJob(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/jobs/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async searchApplicants(jobId: string) {
    const response = await apiClient.get<MatchResult<ApplicantProfile>[]>(`/search/applicants-for-job/${jobId}`);
    return response.data;
  },

  async getJobRAGSummary(jobId: string) {
    const response = await apiClient.get<RAGSummary>(`/rag/job/${jobId}`);
    return response.data;
  }
};

// Applicants
export const applicantsService = {
  async getApplicants() {
    const response = await apiClient.get<ApplicantProfile[]>('/applicants/');
    return response.data;
  },

  async getApplicant(id: string) {
    const response = await apiClient.get<ApplicantProfile>(`/applicants/${id}`);
    return response.data;
  },

  async parseResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/applicants/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async searchJobs(applicantId: string) {
    const response = await apiClient.get<MatchResult<JobListing>[]>(`/search/jobs-for-applicant/${applicantId}`);
    return response.data;
  },

  async compareWithPeers(applicantId: string, peerIds: string[]) {
    const results: ComparisonResult[] = [];
    
    for (const peerId of peerIds) {
      const response = await apiClient.get<ComparisonResult>(`/compare/${applicantId}/${peerId}`);
      results.push(response.data);
    }
    
    return results;
  },

  async getComparisonHeatmap(applicantId: string, peerIds: string[]) {
    const queryParams = peerIds.map(id => `peer_ids=${id}`).join('&');
    const response = await apiClient.get<HeatmapData[]>(`/compare/heatmap/${applicantId}?${queryParams}`);
    return response.data;
  },

  async getApplicantRAGSummary(applicantId: string) {
    const response = await apiClient.get<RAGSummary>(`/rag/applicant/${applicantId}`);
    return response.data;
  }
};

export default {
  jobs: jobsService,
  applicants: applicantsService,
};
