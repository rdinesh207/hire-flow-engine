
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ApplicantProfile } from "@/types";
import { User, Briefcase, GraduationCap, FileText, Plus, ExternalLink } from "lucide-react";

// Mock profile data
const mockProfile: ApplicantProfile = {
  id: "applicant-1",
  name: "Emily Chen",
  workAuthorization: "US Citizen",
  yearsOfExperience: 6,
  countryOfOrigin: "United States",
  dateOfBirth: "1990-03-15",
  address: "123 Tech Ave, San Francisco, CA",
  personalStatement: "Experienced frontend developer with a passion for creating intuitive user interfaces. I specialize in React and modern JavaScript frameworks, with a focus on accessibility and performance optimization.",
  resumeFileType: "pdf",
  workExperience: [
    {
      company: "WebTech Solutions",
      title: "Senior Frontend Developer",
      startDate: "2020-02-01",
      endDate: undefined,
      description: "Leading frontend development for an e-commerce platform. Implemented state management with Redux, migrated codebase to TypeScript, and improved performance by 40%.",
      skills: ["React", "Redux", "TypeScript", "Webpack", "Jest"]
    },
    {
      company: "Digital Innovations",
      title: "Frontend Developer",
      startDate: "2017-05-15",
      endDate: "2020-01-15",
      description: "Developed responsive web applications using React and collaborated with designers to implement UI components.",
      skills: ["React", "JavaScript", "CSS", "HTML", "Responsive Design"]
    }
  ],
  education: [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor's",
      field: "Computer Science",
      startDate: "2013-09-01",
      endDate: "2017-05-30"
    }
  ],
  lastPosition: "Senior Frontend Developer",
  lastPositionLevel: "Senior",
  urls: [
    "https://github.com/emilychen",
    "https://linkedin.com/in/emilychen",
    "https://emilychen.dev"
  ],
  projects: [
    {
      name: "E-commerce UI Library",
      description: "A reusable component library built with React and Styled Components for e-commerce applications.",
      url: "https://github.com/emilychen/ecommerce-ui",
      technologies: ["React", "Styled Components", "Storybook", "TypeScript"]
    }
  ],
  createdAt: "2023-04-10T08:30:00Z",
  updatedAt: "2023-04-10T08:30:00Z"
};

const ApplicantProfile = () => {
  const [profile, setProfile] = useState<ApplicantProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-gray-500">Manage your professional information</p>
          </div>
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="resume">Resume</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={profile.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="work-auth">Work Authorization</Label>
                      <Input id="work-auth" defaultValue={profile.workAuthorization} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input id="experience" type="number" defaultValue={profile.yearsOfExperience} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country of Origin</Label>
                      <Input id="country" defaultValue={profile.countryOfOrigin} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" defaultValue={profile.dateOfBirth} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue={profile.address} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="statement">Personal Statement</Label>
                      <Textarea 
                        id="statement" 
                        defaultValue={profile.personalStatement}
                        rows={5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p>{profile.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Work Authorization</h3>
                        <p>{profile.workAuthorization}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Years of Experience</h3>
                        <p>{profile.yearsOfExperience}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Country of Origin</h3>
                        <p>{profile.countryOfOrigin}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                        <p>{new Date(profile.dateOfBirth || "").toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <p>{profile.address}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Statement</h3>
                      <p className="whitespace-pre-line">{profile.personalStatement}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>External Links</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {profile.urls.map((url, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input defaultValue={url} className="flex-1" />
                        <Button variant="outline" size="icon">
                          <User className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profile.urls.map((url, idx) => (
                      <div key={idx} className="flex items-center">
                        <ExternalLink className="h-4 w-4 mr-2 text-recruitment-primary" />
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-recruitment-secondary hover:underline"
                        >
                          {url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      </div>
                    ))}
                    {profile.urls.length === 0 && (
                      <p className="text-gray-500">No external links provided</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-8">
                    {profile.workExperience.map((experience, idx) => (
                      <div key={idx} className="space-y-4 pt-4 first:pt-0 border-t first:border-t-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`company-${idx}`}>Company</Label>
                            <Input id={`company-${idx}`} defaultValue={experience.company} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`title-${idx}`}>Job Title</Label>
                            <Input id={`title-${idx}`} defaultValue={experience.title} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`start-date-${idx}`}>Start Date</Label>
                            <Input id={`start-date-${idx}`} type="date" defaultValue={experience.startDate.split('T')[0]} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`end-date-${idx}`}>End Date (leave blank if current)</Label>
                            <Input id={`end-date-${idx}`} type="date" defaultValue={experience.endDate?.split('T')[0]} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`description-${idx}`}>Description</Label>
                          <Textarea 
                            id={`description-${idx}`} 
                            defaultValue={experience.description}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`skills-${idx}`}>Skills (comma separated)</Label>
                          <Input id={`skills-${idx}`} defaultValue={experience.skills.join(', ')} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {profile.workExperience.map((experience, idx) => (
                      <div key={idx} className="relative">
                        {idx < profile.workExperience.length - 1 && (
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
                              {new Date(experience.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {
                                experience.endDate 
                                  ? new Date(experience.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                                  : 'Present'
                              }
                            </p>
                            <p className="mb-3">{experience.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {experience.skills.map((skill, skillIdx) => (
                                <Badge key={skillIdx} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-8">
                    {profile.education.map((education, idx) => (
                      <div key={idx} className="space-y-4 pt-4 first:pt-0 border-t first:border-t-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`institution-${idx}`}>Institution</Label>
                            <Input id={`institution-${idx}`} defaultValue={education.institution} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`degree-${idx}`}>Degree</Label>
                            <Input id={`degree-${idx}`} defaultValue={education.degree} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`field-${idx}`}>Field of Study</Label>
                            <Input id={`field-${idx}`} defaultValue={education.field} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`ed-start-date-${idx}`}>Start Date</Label>
                            <Input id={`ed-start-date-${idx}`} type="date" defaultValue={education.startDate.split('T')[0]} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`ed-end-date-${idx}`}>End Date</Label>
                            <Input id={`ed-end-date-${idx}`} type="date" defaultValue={education.endDate?.split('T')[0]} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {profile.education.map((education, idx) => (
                      <div key={idx} className="relative">
                        {idx < profile.education.length - 1 && (
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
                              {new Date(education.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {
                                education.endDate 
                                  ? new Date(education.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                                  : 'Present'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-8">
                    {profile.projects.map((project, idx) => (
                      <div key={idx} className="space-y-4 pt-4 first:pt-0 border-t first:border-t-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`project-name-${idx}`}>Project Name</Label>
                            <Input id={`project-name-${idx}`} defaultValue={project.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`project-url-${idx}`}>Project URL</Label>
                            <Input id={`project-url-${idx}`} defaultValue={project.url} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-desc-${idx}`}>Description</Label>
                          <Textarea 
                            id={`project-desc-${idx}`} 
                            defaultValue={project.description}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-tech-${idx}`}>Technologies (comma separated)</Label>
                          <Input id={`project-tech-${idx}`} defaultValue={project.technologies.join(', ')} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profile.projects.map((project, idx) => (
                      <Card key={idx}>
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
                              {project.technologies.map((tech, techIdx) => (
                                <Badge key={techIdx} variant="outline" className="bg-gray-100">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-recruitment-primary mr-3" />
                      <div>
                        <p className="font-medium">Emily_Chen_Resume.pdf</p>
                        <p className="text-sm text-gray-500">Uploaded on April 10, 2023</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Download</Button>
                      {isEditing && <Button variant="outline" size="sm">Replace</Button>}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="border-2 border-dashed rounded-md p-6 text-center">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Drag and drop a new resume file, or
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">
                        Supported formats: PDF, DOCX, RTF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ApplicantProfile;
