
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { applicantsService } from "@/services/api";
import { ApplicantProfile } from "@/types";
import { Search, Users } from "lucide-react";

const RecruiterCandidates = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');
  
  const [candidates, setCandidates] = useState<ApplicantProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesData = await applicantsService.getApplicants();
        setCandidates(candidatesData);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Candidate Search</h1>
            <p className="text-gray-500">Find the right candidates for your positions</p>
          </div>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Search candidates by name, skills, or experience..."
                className="flex-1"
              />
              <Button>
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
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">
                          <Link to={`/recruiter/candidates/${candidate.id}`} className="hover:text-recruitment-secondary transition-colors">
                            {candidate.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500">{candidate.lastPosition} • {candidate.countryOfOrigin}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className="bg-green-500">
                          {Math.floor(Math.random() * 15) + 75}% Match
                        </Badge>
                        <div className="mt-1">
                          <Progress value={Math.floor(Math.random() * 15) + 75} className="w-24 h-2" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{candidate.personalStatement}</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Experience:</span>
                        <span>{candidate.yearsOfExperience} years</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Education:</span>
                        <span>{candidate.education[0]?.degree || "N/A"}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidate.workExperience[0]?.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="bg-gray-100">
                          {skill}
                        </Badge>
                      ))}
                      {(candidate.workExperience[0]?.skills.length || 0) > 3 && (
                        <Badge variant="outline" className="bg-gray-100">
                          +{(candidate.workExperience[0]?.skills.length || 0) - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {candidate.workAuthorization}
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/recruiter/candidates/${candidate.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {candidates.length === 0 && (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <Users className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">No candidates found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterCandidates;
