
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { jobsService, applicantsService } from "@/services/api";
import { JobListing, RAGSummary } from "@/types";
import { FileText, Calendar, MapPin, CheckCircle, XCircle, ArrowLeft, ExternalLink, BriefcaseBusiness } from "lucide-react";

const ApplicantJob = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobListing | null>(null);
  const [jobSummary, setJobSummary] = useState<RAGSummary | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        if (id) {
          const jobData = await jobsService.getJob(id);
          setJob(jobData);

          if (jobData) {
            // Fetch RAG summary for this job
            const summary = await jobsService.getJobRAGSummary(id);
            setJobSummary(summary);

            // Fetch applicant's jobs to get match score
            // Using a static ID for demo purposes
            const applicantId = "applicant-1";
            const matches = await applicantsService.searchJobs(applicantId);
            const thisJobMatch = matches.find(match => match.item.id === id);
            if (thisJobMatch) {
              setMatchScore(thisJobMatch.score);
            }
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
            <Link to="/applicant/jobs">
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
            <Link to="/applicant/jobs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>

        {/* Job Overview */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="p-0">
            <div className="bg-recruitment-primary text-white p-6 relative">
              <div className="absolute top-6 right-6 flex gap-2">
                <Badge className="bg-recruitment-secondary">
                  {job.positionLevel}
                </Badge>
                {matchScore !== null && (
                  <Badge className={`bg-${Math.round(matchScore * 100) >= 80 ? 'green' : 'amber'}-500`}>
                    {Math.round(matchScore * 100)}% Match
                  </Badge>
                )}
              </div>
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
                <TabsTrigger value="match">Match Analysis</TabsTrigger>
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

                <div className="pt-4 border-t flex gap-3">
                  <Button className="flex-1">Apply Now</Button>
                  {job.url && (
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        View Original Posting
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="match" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Your Match Analysis</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <svg className="w-24 h-24">
                              <circle
                                className="text-gray-200"
                                strokeWidth="6"
                                stroke="currentColor"
                                fill="transparent"
                                r="36"
                                cx="48"
                                cy="48"
                              />
                              <circle
                                className="text-green-500"
                                strokeWidth="6"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="36"
                                cx="48"
                                cy="48"
                                strokeDasharray="226.08"
                                strokeDashoffset={(1 - (matchScore || 0.75)) * 226.08}
                              />
                            </svg>
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                              {matchScore ? Math.round(matchScore * 100) : 75}%
                            </span>
                          </div>
                          <p className="mt-4 font-medium text-center">Overall Match</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardContent className="pt-6 space-y-4">
                        <h3 className="text-lg font-medium">Match Breakdown</h3>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Skills Match</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Experience Level</span>
                            <span className="text-sm font-medium">90%</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Education Requirements</span>
                            <span className="text-sm font-medium">100%</span>
                          </div>
                          <Progress value={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Location Compatibility</span>
                            <span className="text-sm font-medium">60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-3">Matching Strengths</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Your experience with React and Node.js directly matches the job requirements.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Your education level exceeds the minimum requirements for this position.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>Your years of experience ({6} years) exceed the job's minimum requirement ({job.minYearsExperience} years).</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-3">Areas to Emphasize</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <XCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <span>Consider emphasizing your experience with cloud services like AWS to strengthen your application.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <span>If you have Docker experience, highlight it prominently as it's mentioned in the job description.</span>
                      </li>
                      <li className="flex items-start">
                        <XCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                        <span>Detail any experience leading teams to address the leadership aspects of this role.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="pt-4 border-t flex justify-between">
                  <Button variant="outline" asChild>
                    <Link to="/applicant/compare">
                      Compare With Peers
                    </Link>
                  </Button>
                  <Button>Apply Now</Button>
                </div>
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
                      <h3 className="text-lg font-medium mb-3">Company Analysis</h3>
                      <Card>
                        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <BriefcaseBusiness className="h-5 w-5 text-recruitment-primary" />
                              <div>
                                <h4 className="font-medium">Company Size</h4>
                                <p className="text-sm text-gray-500">500-1000 employees</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-recruitment-primary" />
                              <div>
                                <h4 className="font-medium">Founded</h4>
                                <p className="text-sm text-gray-500">2010</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-recruitment-primary" />
                              <div>
                                <h4 className="font-medium">Headquarters</h4>
                                <p className="text-sm text-gray-500">{job.country}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Industry Reputation</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {job.company} is known for its innovative approach to technology solutions and has been growing steadily in the {job.keywords[0]} sector.
                            </p>
                            <h4 className="font-medium mb-2">Work Culture</h4>
                            <p className="text-sm text-gray-600">
                              Employee reviews highlight a collaborative environment with good work-life balance and opportunities for professional growth.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Salary Insights</h3>
                      <Card>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                              <p className="text-sm text-gray-500">Low Range</p>
                              <p className="text-xl font-bold">$85,000</p>
                            </div>
                            <div className="text-center border-x border-gray-200">
                              <p className="text-sm text-gray-500">Average</p>
                              <p className="text-2xl font-bold text-recruitment-primary">$105,000</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-500">High Range</p>
                              <p className="text-xl font-bold">$125,000</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600">
                              Salary data is based on aggregated information for similar positions in this location. Actual compensation may vary.
                            </p>
                          </div>
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
                        We haven't generated insights for this job yet. Insights provide AI-powered analysis of the job posting and company.
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

export default ApplicantJob;
