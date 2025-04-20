
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { applicantsService } from "@/services/api";
import { MatchResult, JobListing } from "@/types";
import { Search, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const ApplicantJobs = () => {
  const [matchedJobs, setMatchedJobs] = useState<MatchResult<JobListing>[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!user?.id) {
          toast({
            title: "No user found",
            description: "Please login or register first",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        
        const jobMatches = await applicantsService.searchJobs(user.id);
        setMatchedJobs(jobMatches);
      } catch (error) {
        console.error("Error fetching job matches:", error);
        toast({
          title: "Error",
          description: "Failed to fetch job matches. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  // Filter jobs based on search term
  const filteredJobs = searchTerm.trim() 
    ? matchedJobs.filter(job => 
        job.item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.item.keywords.some(kw => kw.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : matchedJobs;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Find Jobs</h1>
            <p className="text-gray-500">Discover job opportunities that match your skills and experience</p>
          </div>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search jobs by title, company, or keywords..."
                className="flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={() => setSearchTerm("")}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-recruitment-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((match) => (
              <Card key={match.item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Link to={`/applicant/jobs/${match.item.id}`} className="hover:text-recruitment-secondary transition-colors">
                            {match.item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">{match.item.company} • {match.item.country}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={`bg-${Math.round(match.score * 100) >= 80 ? 'green' : 'amber'}-500`}>
                          {Math.round(match.score * 100)}% Match
                        </Badge>
                        <div className="mt-1">
                          <Progress value={match.score * 100} className="w-24 h-2" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{match.item.description}</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Experience Required:</span>
                        <span>{match.item.minYearsExperience}+ years</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Education:</span>
                        <span>{match.item.minEducation}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {match.item.keywords.slice(0, 3).map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-100">
                          {keyword}
                        </Badge>
                      ))}
                      {match.item.keywords.length > 3 && (
                        <Badge variant="outline" className="bg-gray-100">
                          +{match.item.keywords.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Posted on {new Date(match.item.date).toLocaleDateString()}
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/applicant/jobs/${match.item.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredJobs.length === 0 && (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">No matching jobs found</p>
                  <Button asChild>
                    <Link to="/applicant/profile">
                      Update Your Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicantJobs;
