
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { applicantsService } from "@/services/api";
import { ApplicantProfile, RAGSummary } from "@/types";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  CheckCircle, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  FolderClosed 
} from "lucide-react";

const formatDateRange = (startDate: string, endDate?: string) => {
  const start = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  if (!endDate) return `${start} - Present`;
  const end = new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  return `${start} - ${end}`;
};

const RecruiterCandidate = () => {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<ApplicantProfile | null>(null);
  const [candidateSummary, setCandidateSummary] = useState<RAGSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setLoading(true);
        if (id) {
          const candidateData = await applicantsService.getApplicant(id);
          setCandidate(candidateData);

          if (candidateData) {
            // Fetch RAG summary for this candidate
            const summary = await applicantsService.getApplicantRAGSummary(id);
            setCandidateSummary(summary);
          }
        }
      } catch (error) {
        console.error("Error fetching candidate data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-recruitment-primary mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading candidate profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!candidate) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <User className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Candidate Not Found</h2>
          <p className="text-gray-500 mb-4">The candidate profile you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/recruiter/candidates">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Candidates
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
            <Link to="/recruiter/candidates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Candidates
            </Link>
          </Button>
        </div>

        {/* Candidate Overview */}
        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="p-0">
            <div className="bg-recruitment-primary text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{candidate.name}</h1>
                  <p className="text-gray-100">{candidate.lastPosition} • {candidate.lastPositionLevel} Level</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{candidate.yearsOfExperience} years experience</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{candidate.countryOfOrigin}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className="bg-recruitment-light text-recruitment-primary">
                        {candidate.workAuthorization}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 border-white/20">
                    Export Profile
                  </Button>
                  <Button size="sm" className="bg-white text-recruitment-primary hover:bg-white/90">
                    Contact Candidate
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="profile" className="p-6">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Personal Statement</h2>
                  <p className="whitespace-pre-line">{candidate.personalStatement}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Details</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span className="font-medium">Location:</span>
                        <span className="ml-2">{candidate.address || candidate.countryOfOrigin}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2">{candidate.yearsOfExperience} years</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span className="font-medium">Current Position:</span>
                        <span className="ml-2">{candidate.lastPosition}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span className="font-medium">Level:</span>
                        <span className="ml-2">{candidate.lastPositionLevel}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-1 text-recruitment-primary">•</span>
                        <span className="font-medium">Work Authorization:</span>
                        <span className="ml-2">{candidate.workAuthorization}</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Links & Profiles</h3>
                    {candidate.urls.length > 0 ? (
                      <ul className="space-y-3">
                        {candidate.urls.map((url, index) => (
                          <li key={index} className="flex items-center">
                            <ExternalLink className="h-4 w-4 mr-2 text-recruitment-primary" />
                            <a 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-recruitment-secondary hover:underline"
                            >
                              {url.replace(/^https?:\/\/(www\.)?/, '')}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No external profiles provided</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Skills Summary</h3>
                  <div className="space-y-3">
                    {candidate.workExperience.flatMap(exp => exp.skills).filter((value, index, self) => self.indexOf(value) === index).map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{skill}</span>
                          <span className="text-sm font-medium">Advanced</span>
                        </div>
                        <Progress value={75 + Math.random() * 25} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
                
                {candidate.workExperience.length > 0 ? (
                  <div className="space-y-8">
                    {candidate.workExperience.map((experience, index) => (
                      <div key={index} className="relative">
                        {index < candidate.workExperience.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                        <div className="flex gap-6">
                          <div className="w-6 h-6 rounded-full bg-recruitment-primary flex items-center justify-center text-white flex-shrink-0 mt-1 z-10">
                            <Briefcase className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{experience.title}</h3>
                            <p className="text-recruitment-secondary font-medium">{experience.company}</p>
                            <p className="text-sm text-gray-500 mb-3">
                              {formatDateRange(experience.startDate, experience.endDate)}
                            </p>
                            <p className="mb-3">{experience.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {experience.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Briefcase className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No work experience information available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Education</h2>
                
                {candidate.education.length > 0 ? (
                  <div className="space-y-8">
                    {candidate.education.map((education, index) => (
                      <div key={index} className="relative">
                        {index < candidate.education.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                        )}
                        <div className="flex gap-6">
                          <div className="w-6 h-6 rounded-full bg-recruitment-primary flex items-center justify-center text-white flex-shrink-0 mt-1 z-10">
                            <GraduationCap className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">{education.degree} in {education.field}</h3>
                            <p className="text-recruitment-secondary font-medium">{education.institution}</p>
                            <p className="text-sm text-gray-500">
                              {formatDateRange(education.startDate, education.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <GraduationCap className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No education information available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                
                {candidate.projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidate.projects.map((project, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>{project.name}</span>
                            {project.url && (
                              <a 
                                href={project.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-recruitment-secondary hover:text-recruitment-secondary/80"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p>{project.description}</p>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Technologies:</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="bg-gray-100">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <FolderClosed className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No project information available</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                {candidateSummary ? (
                  <>
                    <div>
                      <h2 className="text-xl font-semibold mb-4">AI-Generated Insights</h2>
                      <Card className="bg-gray-50">
                        <CardContent className="p-6">
                          <p className="italic text-gray-600">{candidateSummary.summary}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Key Points</h3>
                      <ul className="space-y-2">
                        {candidateSummary.insights.map((insight, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 mt-1 text-recruitment-secondary">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Fit Analysis</h3>
                      <Card>
                        <CardContent className="p-6 space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Technical skills match</span>
                              <span className="text-sm font-medium">High</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Experience level match</span>
                              <span className="text-sm font-medium">Medium</span>
                            </div>
                            <Progress value={68} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium">Overall fit score</span>
                              <span className="text-sm font-medium">76%</span>
                            </div>
                            <Progress value={76} className="h-2" />
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
                              <span>Consider this candidate for Senior Developer positions requiring React and Node.js expertise.</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span>The candidate has relevant project experience that aligns well with your current job openings.</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span>Recommended for roles requiring strong technical background and leadership experience.</span>
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
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
                      <p className="text-gray-500 text-center mb-4 max-w-md">
                        We haven't generated insights for this candidate yet. Insights provide AI-powered analysis of the candidate's profile.
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

export default RecruiterCandidate;
