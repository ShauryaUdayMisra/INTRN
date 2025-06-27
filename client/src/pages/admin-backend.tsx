import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Redirect } from "wouter";
import { User } from "@shared/schema";
import { Building, GraduationCap, Users, Clock } from "lucide-react";

export default function AdminBackend() {
  const { user, isLoading: authLoading } = useAuth();

  // Check if user is one of the special admin accounts
  const isSpecialAdmin = user && ['admin1', 'admin2', 'admin3'].includes(user.username);

  const { data: companies = [], isLoading: companiesLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/companies"],
    enabled: !!isSpecialAdmin,
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/students"],
    enabled: !!isSpecialAdmin,
  });

  const { data: pendingSignups = [], isLoading: pendingLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/pending-signups"],
    enabled: !!isSpecialAdmin,
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

  const formatDate = (dateString: string) => {
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
        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
            <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingSignups.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-4">
            <div className="space-y-4">
              {companiesLoading ? (
                <div className="text-center py-8 text-gray-500">Loading companies...</div>
              ) : companies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No companies registered yet.</div>
              ) : (
                companies.map((company) => (
                  <Card key={company.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {company.companyName || company.username}
                          </h3>
                          <p className="text-gray-600">{company.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Joined: {formatDate(company.createdAt)}</span>
                            {company.location && <span>Location: {company.location}</span>}
                            {company.website && (
                              <a 
                                href={company.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Website
                              </a>
                            )}
                          </div>
                          {company.bio && (
                            <p className="text-gray-600 text-sm mt-2">{company.bio}</p>
                          )}
                        </div>
                        <Badge variant={company.profileComplete ? "default" : "secondary"}>
                          {company.profileComplete ? "Complete" : "Incomplete"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="space-y-4">
              {studentsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No students registered yet.</div>
              ) : (
                students.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {student.firstName && student.lastName 
                              ? `${student.firstName} ${student.lastName}` 
                              : student.username}
                          </h3>
                          <p className="text-gray-600">{student.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Joined: {formatDate(student.createdAt)}</span>
                            {student.location && <span>Location: {student.location}</span>}
                          </div>
                          {student.skills && student.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {student.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {student.bio && (
                            <p className="text-gray-600 text-sm mt-2">{student.bio}</p>
                          )}
                        </div>
                        <Badge variant={student.profileComplete ? "default" : "secondary"}>
                          {student.profileComplete ? "Complete" : "Incomplete"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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