import { useAuth } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { User, Internship, Application, BlogPost } from "@shared/schema";
import { Users, Building, BookOpen, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { Redirect } from "wouter";

export default function AdminPage() {
  const { user } = useAuth();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  const { data: internships = [] } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
    enabled: user?.role === "admin",
  });

  const { data: applications = [] } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
    enabled: user?.role === "admin",
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    enabled: user?.role === "admin",
  });

  if (!user || user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  const stats = {
    totalUsers: users.length,
    totalStudents: users.filter(u => u.role === "student").length,
    totalCompanies: users.filter(u => u.role === "company").length,
    totalInternships: internships.length,
    activeInternships: internships.filter(i => i.isActive).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.status === "pending").length,
    totalBlogPosts: blogPosts.length,
    publishedPosts: blogPosts.filter(p => p.published).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, internships, applications, and content across the platform.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{stats.totalInternships}</p>
                  <p className="text-gray-600">Internships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                  <p className="text-gray-600">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{stats.totalBlogPosts}</p>
                  <p className="text-gray-600">Blog Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Students Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Accounts ({users.filter(u => u.role === "student").length})
                </CardTitle>
                <CardDescription>
                  View detailed student profiles including onboarding information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === "student").map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge variant="outline">Student</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Password</p>
                          <p className="text-sm text-gray-900 font-mono">{(user as any).actualPassword || "Not available"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Location</p>
                          <p>{user.location || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">University</p>
                          <p>{user.university || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Graduation Year</p>
                          <p>{user.graduationYear || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Profile Complete</p>
                          <p>{user.profileComplete ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Joined</p>
                          <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                        </div>
                      </div>
                      
                      {user.skills && user.skills.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700 mb-2">Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {user.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {user.bio && (
                        <div>
                          <p className="font-medium text-gray-700">Bio</p>
                          <p className="text-sm text-gray-600">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {users.filter(u => u.role === "student").length === 0 && (
                    <p className="text-center text-gray-500 py-8">No student accounts found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Companies Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Company Accounts ({users.filter(u => u.role === "company").length})
                </CardTitle>
                <CardDescription>
                  View company account details and approval status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === "company").map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.companyName && <p className="text-sm font-medium text-primary">{user.companyName}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">Company</Badge>
                          <Badge variant={user.isApproved ? 'default' : 'destructive'}>
                            {user.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Password</p>
                          <p className="text-sm text-gray-900 font-mono">{(user as any).actualPassword || "Not available"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Website</p>
                          <p>{user.website || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Location</p>
                          <p>{user.location || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Company Field</p>
                          <p>{user.companyField || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Profile Complete</p>
                          <p>{user.profileComplete ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Joined</p>
                          <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                        </div>
                      </div>
                      
                      {user.bio && (
                        <div>
                          <p className="font-medium text-gray-700">Company Description</p>
                          <p className="text-sm text-gray-600">{user.bio}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {users.filter(u => u.role === "company").length === 0 && (
                    <p className="text-center text-gray-500 py-8">No company accounts found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Admin Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Admin Accounts ({users.filter(u => u.role === "admin").length})
                </CardTitle>
                <CardDescription>
                  Platform administrators with full access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.filter(u => u.role === "admin").map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3 bg-amber-50 border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-lg">{user.firstName || user.username} {user.lastName}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge variant="default">Admin</Badge>
                      </div>
                      
                      <div className="text-sm">
                        <p className="font-medium text-gray-700">Username: {user.username}</p>
                        <p className="text-xs text-gray-500">Access Level: Full Platform Control</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internships" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Internship Management</h2>
              <div className="flex gap-2">
                <Badge variant="default">{stats.activeInternships} Active</Badge>
                <Badge variant="secondary">{stats.totalInternships - stats.activeInternships} Inactive</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              {internships.map((internship) => (
                <Card key={internship.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{internship.title}</h3>
                        <p className="text-gray-600">{internship.location}</p>
                        <p className="text-sm text-gray-500">
                          Posted {new Date(internship.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={internship.isActive ? "default" : "secondary"}>
                          {internship.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Application Management</h2>
              <div className="flex gap-2">
                <Badge variant="default">{stats.pendingApplications} Pending</Badge>
                <Badge variant="secondary">
                  {stats.totalApplications - stats.pendingApplications} Processed
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          Application #{application.id}
                        </h3>
                        <p className="text-gray-600">
                          Student ID: {application.studentId} → Internship ID: {application.internshipId}
                        </p>
                        <p className="text-sm text-gray-500">
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          application.status === "accepted" ? "default" :
                          application.status === "rejected" ? "destructive" :
                          "secondary"
                        }>
                          {application.status}
                        </Badge>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Blog Management</h2>
              <div className="flex gap-2">
                <Badge variant="default">{stats.publishedPosts} Published</Badge>
                <Badge variant="secondary">{stats.totalBlogPosts - stats.publishedPosts} Drafts</Badge>
                <Button>Create New Post</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-gray-600">{post.category}</p>
                        <p className="text-sm text-gray-500">
                          Created {new Date(post.createdAt).toLocaleDateString()}
                          {post.publishedAt && ` • Published ${new Date(post.publishedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Growth Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>User Growth Rate</span>
                      <span className="text-green-500">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Application Success Rate</span>
                      <span className="text-blue-500">89%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Company Satisfaction</span>
                      <span className="text-purple-500">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    System Health
                  </CardTitle>
                  <CardDescription>Platform status and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Database Status</span>
                      <Badge variant="default">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Response Time</span>
                      <Badge variant="default">Fast</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Sessions</span>
                      <Badge variant="secondary">1,247</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
