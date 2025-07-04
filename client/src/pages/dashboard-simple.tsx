import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Application } from "@shared/schema";
import { BookOpen, Users, Star, TrendingUp } from "lucide-react";

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
            {/* Four Main Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/blog"}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <BookOpen className="w-6 h-6 mr-2 text-primary" />
                    Blog
                  </CardTitle>
                  <CardDescription className="text-black">Read career advice and industry insights</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/search"}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                    Browse Internships
                  </CardTitle>
                  <CardDescription className="text-black">Find and apply to internships</CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => window.location.href = "/student-onboarding"}>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Users className="w-6 h-6 mr-2 text-primary" />
                    Edit Profile
                  </CardTitle>
                  <CardDescription className="text-black">Update experience and skills</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <Star className="w-6 h-6 mr-2 text-primary" />
                    Previous Internships
                  </CardTitle>
                  <CardDescription className="text-black">View completed internships</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-black">
                    {applications.filter(a => a.status === "accepted").length > 0 ? (
                      <p>{applications.filter(a => a.status === "accepted").length} completed internships</p>
                    ) : (
                      <p>No completed internships yet</p>
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