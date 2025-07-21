import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Application } from "@shared/schema";
import { BookOpen, Users, Star, TrendingUp, HelpCircle, Search, FileText, Settings } from "lucide-react";
import { useEffect } from "react";

export default function DashboardSimple() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  // Use useEffect to handle redirects to avoid state update during render
  useEffect(() => {
    if (user && user.role === "company" && !user.isApproved) {
      setLocation("/company-application-status");
    }
  }, [user, setLocation]);

  if (!user) return null;

  // Early return for companies that aren't approved
  if (user.role === "company" && !user.isApproved) {
    return null;
  }

  // Check if this is Ripples of Hope company
  const isRipplesOfHope = user.email === "Sameer.walia@ripplesofhope.in";

  // Company Dashboard for approved companies
  if (user.role === "company" && user.isApproved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-8">Company Dashboard</h1>
            
            {/* Success Message */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Thank You for Signing Up!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your internship is now live on our platform and students can browse and apply.
              </p>
            </div>

            {/* Internship Status for Ripples of Hope */}
            {isRipplesOfHope && (
              <Card className="mb-8 border-primary-200 bg-primary-50">
                <CardHeader>
                  <CardTitle className="text-primary-800">Your Live Internship</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-primary-900">Research Intern - Social Impact</h3>
                    <p className="text-primary-700">
                      Research the impact of sports on marriage choices of adolescent girls in underprivileged communities in rural North India.
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-primary-600">
                      <span className="bg-primary-100 px-2 py-1 rounded">Remote + Travel</span>
                      <span>Duration: 7-28 days</span>
                      <span>Location: UP, Bihar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Main Dashboard Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/search")}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Search className="w-6 h-6 mr-2 text-primary" />
                    Browse Internships
                  </CardTitle>
                  <CardDescription className="text-black">Explore other internship opportunities on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">See what other companies are offering and stay updated with trends</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/blog")}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <BookOpen className="w-6 h-6 mr-2 text-primary" />
                    Read Our Blog
                  </CardTitle>
                  <CardDescription className="text-black">Career insights, industry trends, and success stories</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Stay updated with the latest in internships and career development</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation("/help")}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <HelpCircle className="w-6 h-6 mr-2 text-primary" />
                    Help & Support
                  </CardTitle>
                  <CardDescription className="text-black">Get assistance and learn how to optimize your listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Access guides, FAQs, and contact support for any questions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">Student Dashboard</h1>
          
          <div className="space-y-8">
            {/* Main Dashboard Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/search"}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Search className="w-6 h-6 mr-2 text-primary" />
                    Available Internships
                  </CardTitle>
                  <CardDescription className="text-black">Discover and apply to new internship opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Browse through verified internship opportunities from top companies</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/student-onboarding"}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Settings className="w-6 h-6 mr-2 text-primary" />
                    Edit Profile
                  </CardTitle>
                  <CardDescription className="text-black">Update your skills, experience, and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Keep your profile updated to get better internship matches</p>
                </CardContent>
              </Card>



              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/help"}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <HelpCircle className="w-6 h-6 mr-2 text-primary" />
                    Help & Support
                  </CardTitle>
                  <CardDescription className="text-black">Get assistance and learn how to use the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Contact us at intrnxyz@gmail.com for support</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Star className="w-6 h-6 mr-2 text-primary" />
                    My Applications
                  </CardTitle>
                  <CardDescription className="text-black">Track your internship applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-black">
                    {applications.length > 0 ? (
                      <p>{applications.length} total applications submitted</p>
                    ) : (
                      <p>No applications yet. Start browsing internships!</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                    Progress
                  </CardTitle>
                  <CardDescription className="text-black">Your internship journey so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-black">
                    {applications.filter(a => a.status === "accepted").length > 0 ? (
                      <p>{applications.filter(a => a.status === "accepted").length} completed internships</p>
                    ) : (
                      <p>Start your first internship application today!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-black">Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-black">No applications yet. Start by browsing internships!</p>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-black">Application #{application.id}</h4>
                          <p className="text-sm text-black">Applied on {new Date(application.appliedAt || new Date()).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={application.status === "accepted" ? "default" : "secondary"}>
                          {application.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}