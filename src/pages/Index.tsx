
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";

const Index = () => {
  const { user } = useAuth();

  if (user) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'recruiter' || user.role === 'admin') {
      return <Navigate to="/recruiter" />;
    } else if (user.role === 'applicant') {
      return <Navigate to="/applicant" />;
    }
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
};

export default Index;
