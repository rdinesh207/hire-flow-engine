
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import RecruiterJobs from "./pages/recruiter/Jobs";
import RecruiterJob from "./pages/recruiter/Job";
import RecruiterCandidates from "./pages/recruiter/Candidates";
import RecruiterCandidate from "./pages/recruiter/Candidate";
import ApplicantDashboard from "./pages/applicant/Dashboard";
import ApplicantJobs from "./pages/applicant/Jobs";
import ApplicantJob from "./pages/applicant/Job";
import ApplicantCompare from "./pages/applicant/Compare";
import ApplicantProfile from "./pages/applicant/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Recruiter routes */}
            <Route path="/recruiter" element={
              <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/jobs" element={
              <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                <RecruiterJobs />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/jobs/:id" element={
              <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                <RecruiterJob />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/candidates" element={
              <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                <RecruiterCandidates />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/candidates/:id" element={
              <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                <RecruiterCandidate />
              </ProtectedRoute>
            } />
            
            {/* Applicant routes */}
            <Route path="/applicant" element={
              <ProtectedRoute allowedRoles={['applicant', 'admin']}>
                <ApplicantDashboard />
              </ProtectedRoute>
            } />
            <Route path="/applicant/jobs" element={
              <ProtectedRoute allowedRoles={['applicant', 'admin']}>
                <ApplicantJobs />
              </ProtectedRoute>
            } />
            <Route path="/applicant/jobs/:id" element={
              <ProtectedRoute allowedRoles={['applicant', 'admin']}>
                <ApplicantJob />
              </ProtectedRoute>
            } />
            <Route path="/applicant/compare" element={
              <ProtectedRoute allowedRoles={['applicant', 'admin']}>
                <ApplicantCompare />
              </ProtectedRoute>
            } />
            <Route path="/applicant/profile" element={
              <ProtectedRoute allowedRoles={['applicant', 'admin']}>
                <ApplicantProfile />
              </ProtectedRoute>
            } />
            
            {/* Redirect based on user role */}
            <Route path="/dashboard" element={<Navigate to="/applicant" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
