import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { applicantsService } from "@/services/api";
import { JobListing, MatchResult } from "@/types";
import { ArrowRight, FileText, Search, ListFilter, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ApplicantDashboard = () => {
  const { user } = useAuth();
  const [matchedJobs, setMatchedJobs] = useState<MatchResult<JobListing>[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        
        const matches = await applicantsService.searchJobs(user.id);
        setMatchedJobs(matches);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch matching jobs. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
              <p className="text-gray-500">Here are jobs that match your profile today.</p>
            </div>
          </div>
        </section>

        {/* Insights Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Match Quality</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Average match score with recommended jobs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Matches</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{matchedJobs.length}</div>
              <p className="text-xs text-muted-foreground">New job matches in the last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Strength</CardTitle>
              <ListFilter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold">Good</div>
                <div className="text-sm text-muted-foreground">75%</div>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">Add more project details to improve</p>
            </CardContent>
          </Card>
        </section>

        {/* Top Job Matches */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Top Job Matches</h2>
            <Button variant="link" asChild>
              <Link to="/applicant/jobs">
                See all jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {matchedJobs.map((match) => (
              <Card key={match.item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Link to={`/applicant/jobs/${match.item.id}`} className="hover:text-recruitment-secondary transition-colors">
                            {match.item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">{match.item.company} • {match.item.country}</p>
                      </div>
                      <Badge className={`bg-${Math.round(match.score * 100) >= 80 ? 'green' : 'amber'}-500`}>
                        {Math.round(match.score * 100)}% Match
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm">{match.item.description}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Why you match:</h4>
                      <div className="space-y-2">
                        {match.highlights?.map((highlight, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                            <span className="text-sm">
                              <span className="font-medium">{highlight.field}: </span>
                              {highlight.matches.join(", ")}
                            </span>
                          </div>
                        ))}
                        <div className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-sm">
                            <span className="font-medium">Experience: </span>
                            Their minimum requirement ({match.item.minYearsExperience} years) matches your profile
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
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

            {matchedJobs.length === 0 && !loading && (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Search className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">No job matches found yet</p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link to="/applicant/jobs">
                        Browse Jobs
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/applicant/profile">
                        Update Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Skills Improvement */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Skills Gap Analysis</CardTitle>
              <CardDescription>
                Based on top jobs in your field, here are skills to consider developing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Docker</span>
                  <span className="text-sm font-medium">High demand</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">TypeScript</span>
                  <span className="text-sm font-medium">High demand</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">AWS</span>
                  <span className="text-sm font-medium">Medium demand</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">GraphQL</span>
                  <span className="text-sm font-medium">Medium demand</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              
              <div className="pt-4">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/applicant/compare">
                    Compare Your Skills With Peers
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ApplicantDashboard;
