
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import LoadingScreen from '@/components/ui/loading-screen';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user role is not allowed, redirect to appropriate dashboard
  if (!allowedRoles.includes(user.role)) {
    if (user.role === 'recruiter') {
      return <Navigate to="/recruiter" replace />;
    } else if (user.role === 'applicant') {
      return <Navigate to="/applicant" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and authorized, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
