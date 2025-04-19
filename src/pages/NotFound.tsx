
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import { FileSearch } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <FileSearch className="h-24 w-24 text-gray-300 mb-4" />
        <h1 className="text-4xl font-bold mb-2 text-recruitment-primary">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! We couldn't find that page</p>
        <p className="text-gray-500 max-w-md text-center mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/">
              Return to Home
            </Link>
          </Button>
          {user && (
            <Button variant="outline" asChild>
              <Link to={user.role === 'recruiter' ? '/recruiter' : '/applicant'}>
                Go to Dashboard
              </Link>
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
