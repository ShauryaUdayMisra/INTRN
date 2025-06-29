import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Redirect } from "wouter";
import { User, Internship, Application, BlogPost, CompanyRequest } from "@shared/schema";
import { Building, GraduationCap, Users, Clock, Edit, Trash2, Eye, Plus, UserCheck, UserX, BarChart3, FileText, Settings } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminBackend() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);

  // Check if user is one of the special admin accounts
  const isSpecialAdmin = user && ['admin1', 'admin2', 'admin3'].includes(user.username);

  // Data queries
  const { data: companies = [], isLoading: companiesLoading, refetch: refetchCompanies } = useQuery<User[]>({
    queryKey: ["/api/admin/companies"],
    enabled: !!isSpecialAdmin,
  });

  const { data: students = [], isLoading: studentsLoading, refetch: refetchStudents } = useQuery<User[]>({
    queryKey: ["/api/admin/students"],
    enabled: !!isSpecialAdmin,
  });

  const { data: pendingSignups = [], isLoading: pendingLoading, refetch: refetchPending } = useQuery<User[]>({
    queryKey: ["/api/admin/pending-signups"],
    enabled: !!isSpecialAdmin,
  });

  const { data: internships = [], refetch: refetchInternships } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
    enabled: !!isSpecialAdmin,
  });

  const { data: applications = [], refetch: refetchApplications } = useQuery<Application[]>({
    queryKey: ["/api/admin/applications"],
    enabled: !!isSpecialAdmin,
  });

  const { data: blogPosts = [], refetch: refetchBlogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    enabled: !!isSpecialAdmin,
  });

  const { data: companyRequests = [], refetch: refetchCompanyRequests } = useQuery<CompanyRequest[]>({
    queryKey: ["/api/admin/company-requests"],
    enabled: !!isSpecialAdmin,
  });

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<User> }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "User updated successfully" });
      refetchCompanies();
      refetchStudents();
      refetchPending();
      setEditingUser(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      toast({ title: "User deleted successfully" });
      refetchCompanies();
      refetchStudents();
      refetchPending();
    },
  });

  const updateInternshipMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Internship> }) => {
      const res = await apiRequest("PATCH", `/api/admin/internships/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Internship updated successfully" });
      refetchInternships();
      setEditingInternship(null);
    },
  });

  const deleteInternshipMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/internships/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Internship deleted successfully" });
      refetchInternships();
    },
  });

  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/applications/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Application status updated" });
      refetchApplications();
    },
  });

  const updateCompanyRequestMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: number; status: string; adminNotes?: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/company-requests/${id}`, { status, adminNotes, reviewedBy: user?.id });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Company request updated" });
      refetchCompanyRequests();
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user || !isSpecialAdmin) {
    return <Redirect to="/auth" />;
  }

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Backend</h1>
          <p className="text-gray-600">
            Logged in as: <span className="font-semibold">{user.username}</span>
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
              <Building className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{companies.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{students.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Signups</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{pendingSignups.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Views */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{companies.length + students.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Internships</CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{internships.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Applications</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogPosts.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="flex gap-2">
                <Badge variant="secondary">Companies: {companies.length}</Badge>
                <Badge variant="secondary">Students: {students.length}</Badge>
                <Badge variant="destructive">Pending: {pendingSignups.length}</Badge>
              </div>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...companies, ...students, ...pendingSignups].map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.companyName || user.username}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'company' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.profileComplete ? 'default' : 'outline'}>
                          {user.profileComplete ? 'Active' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <Input defaultValue={user.email} />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Role</label>
                                  <Select defaultValue={user.role}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="student">Student</SelectItem>
                                      <SelectItem value="company">Company</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button onClick={() => updateUserMutation.mutate({ id: user.id, updates: { profileComplete: true } })}>
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteUserMutation.mutate(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Internships Tab */}
          <TabsContent value="internships" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Internship Management</h3>
              <Badge variant="secondary">Total: {internships.length}</Badge>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {internships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">{internship.title}</TableCell>
                      <TableCell>Company ID: {internship.companyId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{internship.type}</Badge>
                      </TableCell>
                      <TableCell>{internship.location}</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteInternshipMutation.mutate(internship.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Application Management</h3>
              <Badge variant="secondary">Total: {applications.length}</Badge>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Internship</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">Student #{application.studentId}</TableCell>
                      <TableCell>Internship #{application.internshipId}</TableCell>
                      <TableCell>
                        <Badge variant={
                          application.status === 'accepted' ? 'default' : 
                          application.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {application.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(application.appliedAt)}</TableCell>
                      <TableCell>
                        <Select 
                          defaultValue={application.status || undefined} 
                          onValueChange={(status) => updateApplicationStatusMutation.mutate({ id: application.id, status })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Blog Management</h3>
              <Badge variant="secondary">Total: {blogPosts.length}</Badge>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>Author #{post.authorId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.published ? 'default' : 'secondary'}>
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(post.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Company Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Company Request Management</h3>
              <Badge variant="secondary">Total: {companyRequests.length}</Badge>
            </div>
            
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.companyName}</TableCell>
                      <TableCell>{request.description}</TableCell>
                      <TableCell>
                        <Badge variant={
                          request.status === 'approved' ? 'default' : 
                          request.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(request.submittedAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateCompanyRequestMutation.mutate({ 
                              id: request.id, 
                              status: 'approved',
                              adminNotes: 'Approved by admin'
                            })}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => updateCompanyRequestMutation.mutate({ 
                              id: request.id, 
                              status: 'rejected',
                              adminNotes: 'Rejected by admin'
                            })}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="space-y-4">
              {pendingLoading ? (
                <div className="text-center py-8 text-gray-500">Loading pending signups...</div>
              ) : pendingSignups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No pending signups.</div>
              ) : (
                pendingSignups.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {user.role === 'company' 
                                ? (user.companyName || user.username)
                                : (user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.username)}
                            </h3>
                            <Badge variant="outline">
                              {user.role === 'company' ? 'Company' : 'Student'}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Signed up: {formatDate(user.createdAt)}</span>
                            {user.location && <span>Location: {user.location}</span>}
                          </div>
                        </div>
                        <Badge variant="secondary">Profile Incomplete</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}