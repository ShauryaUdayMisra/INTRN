import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Application } from "@shared/schema";
import { BookOpen, Users, Star, TrendingUp, HelpCircle, Search, FileText, Settings } from "lucide-react";

export default function DashboardSimple() {
  const { user } = useAuth();

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  if (!user) return null;

  if (user.role !== "student") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-black mb-8">Dashboard</h1>
          <p className="text-black">Company dashboard features coming soon...</p>
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

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/blog"}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <BookOpen className="w-6 h-6 mr-2 text-primary" />
                    Blog & Resources
                  </CardTitle>
                  <CardDescription className="text-black">Career advice and industry insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Read expert articles on career development and internship success</p>
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