
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { applicantsService } from "@/services/api";
import { ApplicantProfile, HeatmapData, ComparisonResult } from "@/types";
import { User, Users, CheckCircle, ArrowRight } from "lucide-react";
import * as React from "react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

// Custom heatmap component
const Heatmap = ({ data }: { data: HeatmapData[] }) => {
  const skills = Array.from(new Set(data.map(d => d.x)));
  const peers = Array.from(new Set(data.map(d => d.y)));
  
  const getColor = (value: number) => {
    // Color gradient from light blue to dark blue
    if (value >= 0.9) return "#1A365D"; // Very dark blue
    if (value >= 0.7) return "#2B6CB0"; // Dark blue
    if (value >= 0.5) return "#4299E1"; // Medium blue
    if (value >= 0.3) return "#90CDF4"; // Light blue
    return "#EBF8FF"; // Very light blue
  };
  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        <div className="grid" style={{ gridTemplateColumns: `auto ${peers.map(() => "1fr").join(" ")}` }}>
          {/* Header row */}
          <div className="p-2 font-medium"></div>
          {peers.map(peer => (
            <div key={peer} className="p-2 text-center font-medium">{peer}</div>
          ))}
          
          {/* Data rows */}
          {skills.map(skill => (
            <React.Fragment key={skill}>
              <div className="p-2 font-medium">{skill}</div>
              {peers.map(peer => {
                const match = data.find(d => d.x === skill && d.y === peer);
                const value = match ? match.value : 0;
                
                return (
                  <div key={`${skill}-${peer}`} className="p-2 text-center">
                    <div 
                      className="h-10 w-full rounded flex items-center justify-center text-sm font-medium"
                      style={{ 
                        backgroundColor: getColor(value),
                        color: value > 0.6 ? "white" : "black"
                      }}
                    >
                      {Math.round(value * 100)}%
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const ApplicantCompare = () => {
  const [peers, setPeers] = useState<ApplicantProfile[]>([]);
  const [selectedPeers, setSelectedPeers] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    const fetchPeers = async () => {
      try {
        // Fetch all applicants as potential peers
        const applicantsData = await applicantsService.getApplicants();
        // Exclude the current user (using a mock ID for demo)
        const currentUserId = "applicant-1";
        const peersList = applicantsData.filter(a => a.id !== currentUserId);
        setPeers(peersList);
      } catch (error) {
        console.error("Error fetching peers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPeers();
  }, []);

  const handleTogglePeer = (peerId: string) => {
    setSelectedPeers(prev => 
      prev.includes(peerId) 
        ? prev.filter(id => id !== peerId)
        : [...prev, peerId]
    );
  };

  const handleCompare = async () => {
    if (selectedPeers.length === 0) return;
    
    try {
      setComparing(true);
      // Mock user ID for demo
      const currentUserId = "applicant-1";
      
      // Get comparison results
      const results = await applicantsService.compareWithPeers(currentUserId, selectedPeers);
      setComparisonResults(results);
      
      // Get heatmap data
      const heatmap = await applicantsService.getComparisonHeatmap(currentUserId, selectedPeers);
      setHeatmapData(heatmap);
    } catch (error) {
      console.error("Error comparing peers:", error);
    } finally {
      setComparing(false);
    }
  };

  // Prepare data for charts
  const prepareSkillsComparisonData = () => {
    if (!heatmapData.length) return [];

    const skills = Array.from(new Set(heatmapData.map(d => d.x)));
    const peers = Array.from(new Set(heatmapData.map(d => d.y)));
    
    return skills.map(skill => {
      const skillData: { [key: string]: any } = { skill };
      
      peers.forEach(peer => {
        const match = heatmapData.find(d => d.x === skill && d.y === peer);
        skillData[peer] = match ? Math.round(match.value * 100) : 0;
      });
      
      return skillData;
    });
  };

  const prepareRadarChartData = () => {
    if (!heatmapData.length) return [];

    const skills = Array.from(new Set(heatmapData.map(d => d.x)));
    
    return skills.map(skill => {
      const youData = heatmapData.find(d => d.x === skill && d.y === "You");
      
      return {
        subject: skill,
        You: youData ? Math.round(youData.value * 100) : 0,
        Average: Math.round(
          heatmapData
            .filter(d => d.x === skill && d.y !== "You")
            .reduce((sum, d) => sum + d.value, 0) / 
            (heatmapData.filter(d => d.x === skill && d.y !== "You").length || 1) * 100
        )
      };
    });
  };

  const skillComparisonData = prepareSkillsComparisonData();
  const radarChartData = prepareRadarChartData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Skills Comparison</h1>
          <p className="text-gray-500">Compare your skills with other professionals in your field</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Select Peers to Compare With</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-recruitment-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {peers.map((peer) => (
                    <div key={peer.id} className="flex items-start space-x-3 border p-3 rounded-md">
                      <Checkbox 
                        id={peer.id} 
                        checked={selectedPeers.includes(peer.id)}
                        onCheckedChange={() => handleTogglePeer(peer.id)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor={peer.id} className="font-medium cursor-pointer">
                          {peer.name}
                        </Label>
                        <p className="text-sm text-gray-500">{peer.lastPosition}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {peer.workExperience[0]?.skills.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {peer.workExperience[0]?.skills.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{peer.workExperience[0].skills.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCompare} 
                    disabled={selectedPeers.length === 0 || comparing}
                  >
                    {comparing ? "Comparing..." : "Compare Skills"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {comparisonResults.length > 0 && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  {heatmapData.length > 0 ? (
                    <Heatmap data={heatmapData} />
                  ) : (
                    <div className="flex justify-center py-10">
                      <p className="text-gray-500">No heatmap data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skill Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={radarChartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          name="You"
                          dataKey="You"
                          stroke="#1A365D"
                          fill="#1A365D"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Peer Average"
                          dataKey="Average"
                          stroke="#4299E1"
                          fill="#4299E1"
                          fillOpacity={0.4}
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comparisonResults.map((result, index) => (
                  <Card key={result.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Peer Comparison {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Similarity Score</span>
                          <span className="text-sm font-medium">{Math.round(result.similarityScore * 100)}%</span>
                        </div>
                        <Progress value={result.similarityScore * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Key Skill Gaps:</h4>
                        <ul className="space-y-1">
                          {result.skillGaps.map((gap, idx) => (
                            <li key={idx} className="text-sm flex gap-2">
                              <span className="text-recruitment-secondary">•</span>
                              <span>{gap}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills Comparison Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={skillComparisonData}
                        margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis type="category" dataKey="skill" width={100} />
                        <Tooltip />
                        <Legend />
                        {Array.from(new Set(heatmapData.map(d => d.y))).map((peer, index) => (
                          <Bar 
                            key={peer} 
                            dataKey={peer} 
                            fill={index === 0 ? "#1A365D" : `#${(4299 + index * 1000).toString(16)}E1`} 
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(new Set(heatmapData.map(d => d.x))).map(skill => (
                  <Card key={skill}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{skill}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Array.from(new Set(heatmapData.map(d => d.y))).map(peer => {
                        const matchData = heatmapData.find(d => d.x === skill && d.y === peer);
                        const value = matchData ? matchData.value * 100 : 0;
                        
                        return (
                          <div key={`${skill}-${peer}`}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{peer}</span>
                              <span className="text-sm font-medium">{Math.round(value)}%</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Development Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {comparisonResults.flatMap(result => result.recommendations).filter((value, index, self) => self.indexOf(value) === index).map((recommendation, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">{recommendation}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Improving in this area will increase your match score for related positions.
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-1">Docker Fundamentals</h3>
                      <p className="text-sm text-gray-500 mb-2">Learn containerization with Docker</p>
                      <Badge className="bg-green-100 text-green-800">Free Course</Badge>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-1">AWS Certified Developer</h3>
                      <p className="text-sm text-gray-500 mb-2">Comprehensive AWS cloud training</p>
                      <Badge className="bg-blue-100 text-blue-800">Certification</Badge>
                    </div>
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-1">Advanced TypeScript</h3>
                      <p className="text-sm text-gray-500 mb-2">Master TypeScript for enterprise applications</p>
                      <Badge className="bg-purple-100 text-purple-800">Intermediate</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-2">
                      View More Resources
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Skills Gap Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="font-medium mb-3">Top Skills to Develop</h3>
                    {comparisonResults.flatMap(result => result.skillGaps).filter((value, index, self) => self.indexOf(value) === index).slice(0, 3).map((skill, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{skill}</span>
                          <span className="text-sm font-medium">High Impact</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          This skill appears in 80% of matched job postings
                        </p>
                      </div>
                    ))}
                    <Button className="w-full mt-2">
                      Get Personalized Learning Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {peers.length > 0 && comparisonResults.length === 0 && (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Compare Your Skills</h3>
              <p className="text-gray-500 text-center mb-4 max-w-md">
                Select peers from the list above and click "Compare Skills" to see how your skills stack up against others in your field.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ApplicantCompare;
