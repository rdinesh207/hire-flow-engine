
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { applicantsService } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/ui/loading-screen";
// Use type-only import to resolve the naming conflict
import type { ApplicantProfile as ApplicantProfileType } from "@/types";
import { FileText, User, Briefcase, GraduationCap, Github, Globe, Code } from "lucide-react";

const ApplicantProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ApplicantProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (user) {
          // For demo purposes, fetching a sample profile
          const profileData = await applicantsService.getApplicant("applicant-1");
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <LoadingScreen />;

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <User className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Profile Not Found</h2>
          <p className="text-gray-500 mb-4">We couldn't find your profile information.</p>
          <Button>Create Profile</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-gray-500">{profile.lastPosition}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Download Resume
            </Button>
            <Button>
              Edit Profile
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Statement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{profile.personalStatement}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Experience</span>
                      <span className="font-medium">{profile.yearsOfExperience} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Country of Origin</span>
                      <span className="font-medium">{profile.countryOfOrigin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Work Authorization</span>
                      <span className="font-medium">{profile.workAuthorization}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.workExperience.flatMap(exp => exp.skills).filter((value, index, self) => self.indexOf(value) === index).map((skill, idx) => (
                      <Badge key={idx} className="bg-recruitment-primary/10 text-recruitment-primary hover:bg-recruitment-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Links & Portfolios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profile.urls.map((url, idx) => (
                    <Button key={idx} variant="outline" size="sm" asChild>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        {url.includes('github') ? <Github className="mr-2 h-4 w-4" /> : 
                         url.includes('linkedin') ? <Briefcase className="mr-2 h-4 w-4" /> : 
                         <Globe className="mr-2 h-4 w-4" />}
                        {url.includes('github') ? 'GitHub' : 
                         url.includes('linkedin') ? 'LinkedIn' : 
                         'Website'}
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {profile.workExperience.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 pb-6 border-l border-gray-200 last:border-0 last:pb-0">
                    <div className="absolute -left-3 top-0">
                      <div className="bg-recruitment-primary text-white p-1.5 rounded-full">
                        <Briefcase className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    <h4 className="text-md text-gray-700 mb-1">{exp.company}</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                      {exp.endDate ? 
                        ` ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 
                        ' Present'}
                    </p>
                    <p className="text-gray-700 whitespace-pre-line mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, skillIdx) => (
                        <Badge key={skillIdx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="relative pl-8 pb-6 border-l border-gray-200 last:border-0 last:pb-0">
                    <div className="absolute -left-3 top-0">
                      <div className="bg-recruitment-primary text-white p-1.5 rounded-full">
                        <GraduationCap className="h-4 w-4" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">{edu.degree} in {edu.field}</h3>
                    <h4 className="text-md text-gray-700 mb-1">{edu.institution}</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                      {edu.endDate ? 
                        ` ${new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 
                        ' Present'}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.projects.map((project, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-recruitment-primary text-white p-4 flex items-center justify-between">
                        <h3 className="font-semibold">{project.name}</h3>
                        {project.url && (
                          <Button size="sm" variant="secondary" asChild className="h-8">
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              View Project
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, techIdx) => (
                            <Badge key={techIdx} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ApplicantProfile;
