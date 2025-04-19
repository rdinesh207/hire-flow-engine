
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { jobsService } from "@/services/api";
import { JobListing, MatchResult, ApplicantProfile, RAGSummary } from "@/types";
import { FileText, Calendar, MapPin, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const RecruiterJob = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobListing | null>(null);
  const [candidates, setCandidates] = useState<MatchResult<ApplicantProfile>[]>([]);
  const [jobSummary, setJobSummary] = useState<RAGSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        if (id) {
          const jobData = await jobsService.getJob(id);
          setJob(jobData);

          if (jobData) {
            // Fetch candidates that match this job
            const matchedCandidates = await jobsService.searchCandidates(id);
            setCandidates(matchedCandidates);

            // Fetch RAG summary for this job
            const summary = await jobsService.getJobRAGSummary(id);
            setJobSummary(summary);
          }
        }
      } catch (error) {
        console.error("Error fetching job data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-recruitment-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading job details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/recruiter/jobs">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link to="/recruiter/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        {/* Job Overview */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="p-0">
            <div className="bg-recruitment-primary text-white p-6 relative">
              <Badge className="absolute top-6 right-6 bg-recruitment-secondary">
                {job.positionLevel}
              </Badge>
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center">
                  <span className="font-semibold">{job.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.country}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted on {new Date(job.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="details" className="p-6">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Job Details</TabsTrigger>
                <TabsTrigger value="candidates">
                  Matching Candidates ({candidates.length})
                </TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span>Minimum {job.minYearsExperience} years of experience</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span>Minimum education: {job.minEducation}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span>{job.sponsorship ? "Visa sponsorship available" : "No visa sponsorship available"}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Skills & Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Recruiter Information</h3>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-recruitment-primary text-white">
                        {job.recruiterName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{job.recruiterName}</p>
                      <p className="text-sm text-gray-500">Primary Recruiter</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  {job.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        View Original Posting
                      </a>
                    </Button>
                  )}
                  <Button>Edit Job</Button>
                </div>
              </TabsContent>

              <TabsContent value="candidates" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Matching Candidates</h2>
                  <Button asChild>
                    <Link to="/recruiter/candidates">
                      Search More Candidates
                    </Link>
                  </Button>
                </div>

                {candidates.length > 0 ? (
                  <div className="space-y-4">
                    {candidates.map((match) => (
                      <Card key={match.item.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-6">
                            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
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
                              <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center mb-1">
                                    <span className="text-sm font-semibold mr-2">Match Score:</span>
                                    <Badge className={`bg-${Math.round(match.score * 100) >= 80 ? 'green' : 'amber'}-500`}>
                                      {Math.round(match.score * 100)}%
                                    </Badge>
                                  </div>
                                  <Progress value={match.score * 100} className="w-32 h-2" />
                                </div>
                                <Button size="sm" asChild>
                                  <Link to={`/recruiter/candidates/${match.item.id}`}>
                                    View Profile
                                  </Link>
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Key Matches:</h4>
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
                                    {match.item.yearsOfExperience} years ({match.item.yearsOfExperience >= job.minYearsExperience ? 'Meets' : 'Below'} requirement)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Matching Candidates Yet</h3>
                      <p className="text-gray-500 text-center mb-4 max-w-md">
                        We haven't found any candidates that match this job position yet. Try adjusting the job requirements or search for candidates manually.
                      </p>
                      <Button asChild>
                        <Link to="/recruiter/candidates">
                          Search Candidates
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {jobSummary ? (
                  <>
                    <div>
                      <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
                      <Card className="bg-gray-50">
                        <CardContent className="p-6">
                          <p className="italic text-gray-600">{jobSummary.summary}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Key Points</h3>
                      <ul className="space-y-2">
                        {jobSummary.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1 text-recruitment-secondary">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Job Market Analysis</h3>
                      <Card>
                        <CardContent className="p-6 space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Demand for this position</span>
                              <span className="text-sm font-medium">High</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Candidate availability</span>
                              <span className="text-sm font-medium">Medium</span>
                            </div>
                            <Progress value={58} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Average time to fill</span>
                              <span className="text-sm font-medium">42 days</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Recommendations</h3>
                      <Card>
                        <CardContent className="p-6">
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span>Consider adding "Typescript" to the required skills to better match with available candidates.</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span>Highlight remote work options to increase the application rate by approximately 30%.</span>
                            </li>
                            <li className="flex items-start">
                              <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                              <span>The minimum experience requirement might be limiting your candidate pool. Consider reducing it if possible.</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </>
                ) : (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <div className="rounded-full bg-gray-100 p-3 mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
                      <p className="text-gray-500 text-center mb-4 max-w-md">
                        We haven't generated insights for this job yet. Insights provide AI-powered analysis of your job posting and market conditions.
                      </p>
                      <Button>
                        Generate Insights
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterJob;
