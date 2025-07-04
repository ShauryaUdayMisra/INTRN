import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Internship, Application, Favorite } from "@shared/schema";
import InternshipCard from "@/components/internship-card";
import { Plus, BookOpen, Users, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: internships = [] } = useQuery<Internship[]>({
    queryKey: user?.role === "company" ? ["/api/my-internships"] : ["/api/internships"],
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ["/api/favorites"],
    enabled: user?.role === "student",
  });

  const createInternshipMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/internships", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-internships"] });
      toast({
        title: "Success",
        description: "Internship created successfully",
      });
    },
  });

  if (!user) return null;

  const renderStudentDashboard = () => (
    <>
      <div className="space-y-8">
        {/* Student Dashboard - Four Sections Only */}
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
                    <p className="text-sm text-black">Applied on {new Date(application.createdAt).toLocaleDateString()}</p>
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

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Internships</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Internships</h2>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <h2 className="text-2xl font-bold">My Applications</h2>
          
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Application #{application.id}</h3>
                      <p className="text-gray-600">Applied on {new Date(application.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={
                      application.status === "accepted" ? "default" :
                      application.status === "rejected" ? "destructive" :
                      "secondary"
                    }>
                      {application.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <h2 className="text-2xl font-bold">Favorite Internships</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => {
              const internship = internships.find(i => i.id === favorite.internshipId);
              return internship ? <InternshipCard key={favorite.id} internship={internship} /> : null;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderCompanyDashboard = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{internships.length}</p>
                <p className="text-gray-600">Posted Internships</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-gray-600">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">
                  {internships.filter(i => i.isActive).length}
                </p>
                <p className="text-gray-600">Active Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-gray-600">Company Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="internships" className="space-y-6">
        <TabsList>
          <TabsTrigger value="internships">My Internships</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="internships" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Internships</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post New Internship
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} showManage />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <h2 className="text-2xl font-bold">Applications Received</h2>
          
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Application from Student #{application.studentId}</h3>
                      <p className="text-gray-600">Applied on {new Date(application.appliedAt).toLocaleDateString()}</p>
                      {application.coverLetter && (
                        <p className="text-sm text-gray-700 mt-2">{application.coverLetter}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View Profile</Button>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>Applications received over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Skills Requested</CardTitle>
                <CardDescription>Most sought-after skills in your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Skills analysis coming soon...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || user.companyName || user.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === "student" 
              ? "Discover amazing internship opportunities and manage your applications."
              : "Manage your internship listings and connect with talented students."
            }
          </p>
        </div>

        {user.role === "student" ? renderStudentDashboard() : renderCompanyDashboard()}
      </div>
    </div>
  );
}
