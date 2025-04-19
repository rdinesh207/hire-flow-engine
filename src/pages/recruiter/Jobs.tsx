
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { jobsService } from "@/services/api";
import { JobListing } from "@/types";
import { Plus, FileText } from "lucide-react";

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await jobsService.getJobs();
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Your Job Listings</h1>
            <p className="text-gray-500">Manage and track your active job postings</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-recruitment-primary"></div>
          </div>
        ) : (
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
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/recruiter/candidates?jobId=${job.id}`}>
                          View Matches
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/recruiter/jobs/${job.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {jobs.length === 0 && (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 mb-4">You haven't posted any jobs yet</p>
                  <Button>
                    Post a Job
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

export default RecruiterJobs;
