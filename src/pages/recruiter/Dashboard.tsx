
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { jobsService } from "@/services/api";
import { JobListing, ApplicantProfile, MatchResult } from "@/types";
import { ArrowRight, FileText, Search, Users } from "lucide-react";

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [latestMatches, setLatestMatches] = useState<MatchResult<ApplicantProfile>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch jobs created by this recruiter
        const jobsData = await jobsService.getJobs();
        setJobs(jobsData.slice(0, 3)); // Just display a few for the dashboard
        
        // Simulate getting some recommended candidates
        if (jobsData.length > 0) {
          const matches = await jobsService.searchCandidates(jobsData[0].id);
          setLatestMatches(matches.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-recruitment-primary text-white text-lg">
                {user?.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
              <p className="text-gray-500">Here's what's happening with your job listings today.</p>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobs.length}</div>
              <p className="text-xs text-muted-foreground">Job listings currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidate Matches</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestMatches.length}</div>
              <p className="text-xs text-muted-foreground">Top candidates matched to your jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Search Activity</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Candidate searches performed this week</p>
            </CardContent>
          </Card>
        </section>

        {/* Recent Jobs */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Job Listings</h2>
            <Button variant="link" asChild>
              <Link to="/recruiter/jobs">
                View all jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Link to={`/recruiter/jobs/${job.id}`} className="hover:text-recruitment-secondary transition-colors">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">{job.company} • {job.country}</p>
                      </div>
                      <Badge className="bg-recruitment-secondary">{job.positionLevel}</Badge>
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{job.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.keywords.slice(0, 3).map((keyword, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-100">
                          {keyword}
                        </Badge>
                      ))}
                      {job.keywords.length > 3 && (
                        <Badge variant="outline" className="bg-gray-100">
                          +{job.keywords.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Posted on {new Date(job.date).toLocaleDateString()}
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/recruiter/jobs/${job.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {jobs.length === 0 && !loading && (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">You haven't posted any jobs yet</p>
                  <Button asChild>
                    <Link to="/recruiter/jobs">
                      Post a new job
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Top Candidates */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Top Matching Candidates</h2>
            <Button variant="link" asChild>
              <Link to="/recruiter/candidates">
                View all candidates
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestMatches.map((match) => (
              <Card key={match.item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-recruitment-primary text-white">
                          {match.item.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          <Link to={`/recruiter/candidates/${match.item.id}`} className="hover:text-recruitment-secondary transition-colors">
                            {match.item.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">{match.item.lastPosition}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">
                      {Math.round(match.score * 100)}% Match
                    </Badge>
                  </div>
                  <div className="mt-3 text-sm line-clamp-2">
                    {match.item.personalStatement}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {match.item.yearsOfExperience} years experience
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/recruiter/candidates/${match.item.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {latestMatches.length === 0 && !loading && (
              <Card className="col-span-2 bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Users className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">No candidate matches found yet</p>
                  <Button asChild>
                    <Link to="/recruiter/candidates">
                      Search candidates
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
