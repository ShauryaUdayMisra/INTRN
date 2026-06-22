import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Internship, BlogPost } from "@shared/schema";
import {
  Users, Building, FileText, GraduationCap, Shield, LogOut, Home,
  Search, BookOpen, Briefcase, TrendingUp, CheckCircle, Clock, XCircle,
  ChevronDown, ChevronRight, Download,
} from "lucide-react";
import { Redirect, Link } from "wouter";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";

interface ApplicationDetail {
  id: number;
  status: string;
  adminStatus?: string;
  appliedAt: string;
  coverLetter?: string;
  studentId: number;
  internshipId: number;
  studentFirstName?: string;
  studentLastName?: string;
  studentEmail?: string;
  studentLocation?: string;
  studentSkills?: string[];
  studentBio?: string;
  studentGrade?: string;
  studentSchoolName?: string;
  studentUniversity?: string;
  studentGraduationYear?: string;
  internshipTitle?: string;
  internshipLocation?: string;
  internshipType?: string;
  companyId: number;
  company?: {
    companyName?: string;
    companyEmail?: string;
    companyField?: string;
    companyLocation?: string;
  };
}

const CHART_COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#7c3aed", "#6d28d9", "#9333ea", "#a855f7", "#d8b4fe"];
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  reviewed: "#3b82f6",
  accepted: "#22c55e",
  rejected: "#ef4444",
};

function statusBadge(status: string) {
  switch (status) {
    case "accepted":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Accepted</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
    case "reviewed":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Reviewed</Badge>;
    default:
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
  }
}

const ADMIN_STATUS_STYLES: Record<string, string> = {
  pending: "border-amber-300 text-amber-700 bg-amber-50",
  confirmed: "border-blue-300 text-blue-700 bg-blue-50",
  completed: "border-green-300 text-green-700 bg-green-50",
};

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appSearch, setAppSearch] = useState("");
  const [expandedStudents, setExpandedStudents] = useState<Record<number, boolean>>({});

  const toggleStudent = (id: number) =>
    setExpandedStudents((prev) => ({ ...prev, [id]: !prev[id] }));

  const adminStatusMutation = useMutation({
    mutationFn: async ({ id, adminStatus }: { id: number; adminStatus: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/applications/${id}/admin-status`, { adminStatus });
      return res.json();
    },
    onMutate: async ({ id, adminStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/admin/applications"] });
      const prev = queryClient.getQueryData<ApplicationDetail[]>(["/api/admin/applications"]);
      queryClient.setQueryData<ApplicationDetail[]>(["/api/admin/applications"], (old) =>
        (old || []).map((a) => (a.id === id ? { ...a, adminStatus } : a))
      );
      return { prev };
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(["/api/admin/applications"], context.prev);
      toast({ title: "Couldn't update status", description: "Please try again.", variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
    },
  });

  const isSpecialAdmin = user && ["admin1", "admin2", "admin3"].includes(user.username);

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!isSpecialAdmin,
  });

  const { data: internships = [], isLoading: internshipsLoading } = useQuery<Internship[]>({
    queryKey: ["/api/admin/internships"],
    enabled: !!isSpecialAdmin,
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery<ApplicationDetail[]>({
    queryKey: ["/api/admin/applications"],
    enabled: !!isSpecialAdmin,
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog"],
    enabled: !!isSpecialAdmin,
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      queryClient.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user || user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  if (!isSpecialAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600">You need special admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Contact system administrator for access.</p>
        </div>
      </div>
    );
  }

  const students = users.filter((u) => u.role === "student");
  const companies = users.filter((u) => u.role === "company");

  const stats = {
    totalStudents: students.length,
    totalCompanies: companies.length,
    totalInternships: internships.length,
    activeInternships: internships.filter((i) => i.isActive).length,
    totalApplications: applications.length,
    pendingApplications: applications.filter((a) => a.status === "pending").length,
    acceptedApplications: applications.filter((a) => a.status === "accepted").length,
    publishedPosts: blogPosts.filter((p) => p.published).length,
  };

  // ---- Analytics aggregations ----
  const statusData = ["pending", "reviewed", "accepted", "rejected"].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: applications.filter((a) => a.status === s).length,
  })).filter((d) => d.value > 0);

  const applicationsPerInternship = Object.values(
    applications.reduce((acc, a) => {
      const key = a.internshipTitle || "Unknown";
      if (!acc[key]) acc[key] = { name: key, applicants: 0 };
      acc[key].applicants += 1;
      return acc;
    }, {} as Record<string, { name: string; applicants: number }>)
  ).sort((a, b) => b.applicants - a.applicants);

  const applicationsPerCompany = Object.values(
    applications.reduce((acc, a) => {
      const key = a.company?.companyName || "Unknown";
      if (!acc[key]) acc[key] = { name: key, applicants: 0 };
      acc[key].applicants += 1;
      return acc;
    }, {} as Record<string, { name: string; applicants: number }>)
  ).sort((a, b) => b.applicants - a.applicants);

  const studentsByGrade = ["9th", "10th", "11th", "12th"].map((g) => ({
    name: g + " Grade",
    students: students.filter((s) => s.grade === g).length,
  }));

  // applicant count per student (engagement)
  const appsByStudent = applications.reduce((acc, a) => {
    acc[a.studentId] = (acc[a.studentId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const filteredApplications = applications.filter((a) => {
    if (!appSearch.trim()) return true;
    const q = appSearch.toLowerCase();
    return (
      `${a.studentFirstName} ${a.studentLastName}`.toLowerCase().includes(q) ||
      (a.studentEmail || "").toLowerCase().includes(q) ||
      (a.internshipTitle || "").toLowerCase().includes(q) ||
      (a.company?.companyName || "").toLowerCase().includes(q)
    );
  });

  // Group the filtered applications by student so each name appears once
  const groupedByStudent = Object.values(
    filteredApplications.reduce((acc, a) => {
      if (!acc[a.studentId]) {
        acc[a.studentId] = {
          studentId: a.studentId,
          name: `${a.studentFirstName || ""} ${a.studentLastName || ""}`.trim() || "Unknown student",
          email: a.studentEmail,
          grade: a.studentGrade,
          school: a.studentSchoolName,
          location: a.studentLocation,
          apps: [] as ApplicationDetail[],
        };
      }
      acc[a.studentId].apps.push(a);
      return acc;
    }, {} as Record<number, { studentId: number; name: string; email?: string; grade?: string; school?: string; location?: string; apps: ApplicationDetail[] }>)
  ).sort((a, b) => b.apps.length - a.apps.length || a.name.localeCompare(b.name));

  const exportApplicationsCsv = () => {
    const headers = ["Student", "Email", "Grade", "School", "Internship", "Company", "Applied", "Application Status", "Admin Status"];
    const rows = filteredApplications.map((a) => [
      `${a.studentFirstName || ""} ${a.studentLastName || ""}`.trim(),
      a.studentEmail || "",
      a.studentGrade || "",
      a.studentSchoolName || "",
      a.internshipTitle || "",
      a.company?.companyName || "",
      a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : "",
      a.status || "",
      a.adminStatus || "pending",
    ]);
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `intrn-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isLoading = usersLoading || internshipsLoading || appsLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dedicated admin top bar — always visible so admins can navigate */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-none">INTRN Admin</span>
              <p className="text-xs text-gray-500">Control Center</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/search">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Search className="w-4 h-4 mr-2" /> Internships
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <BookOpen className="w-4 h-4 mr-2" /> Blog
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Home className="w-4 h-4 mr-2" /> Main Site
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-semibold">
                  {user.firstName?.[0] || user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">{user.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
        {/* Mobile nav row */}
        <div className="md:hidden border-t border-gray-100 flex items-center justify-around px-2 py-1">
          <Link href="/search"><Button variant="ghost" size="sm" className="text-gray-600"><Search className="w-4 h-4" /></Button></Link>
          <Link href="/blog"><Button variant="ghost" size="sm" className="text-gray-600"><BookOpen className="w-4 h-4" /></Button></Link>
          <Link href="/"><Button variant="ghost" size="sm" className="text-gray-600"><Home className="w-4 h-4" /></Button></Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Full overview of students, companies, internships, and applications across the platform.
          </p>
        </div>

        {/* Top stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={GraduationCap} label="Students" value={stats.totalStudents} hint="Registered" color="text-purple-600" bg="bg-purple-50" />
          <StatCard icon={Building} label="Companies" value={stats.totalCompanies} hint="Partners" color="text-blue-600" bg="bg-blue-50" />
          <StatCard icon={Briefcase} label="Internships" value={stats.totalInternships} hint={`${stats.activeInternships} active`} color="text-green-600" bg="bg-green-50" />
          <StatCard icon={FileText} label="Applications" value={stats.totalApplications} hint={`${stats.pendingApplications} pending`} color="text-orange-600" bg="bg-orange-50" />
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="internships">Internships</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          {/* ---------------- ANALYTICS ---------------- */}
          <TabsContent value="analytics" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-20 text-gray-500">Loading analytics…</div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" /> Applications per Internship
                      </CardTitle>
                      <CardDescription>How many people applied to each role</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {applicationsPerInternship.length === 0 ? (
                        <EmptyChart />
                      ) : (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={applicationsPerInternship} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={150}
                              tick={{ fontSize: 11 }}
                              interval={0}
                              tickFormatter={(v: string) => (v.length > 20 ? v.slice(0, 19) + "…" : v)}
                            />
                            <Tooltip />
                            <Bar dataKey="applicants" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" /> Application Status
                      </CardTitle>
                      <CardDescription>Breakdown of where applications stand</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {statusData.length === 0 ? (
                        <EmptyChart />
                      ) : (
                        <ResponsiveContainer width="100%" height={320}>
                          <PieChart>
                            <Pie
                              data={statusData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              labelLine={false}
                              label={({ percent }) => (percent > 0.06 ? `${Math.round(percent * 100)}%` : "")}
                            >
                              {statusData.map((entry) => (
                                <Cell key={entry.name} fill={STATUS_COLORS[entry.name.toLowerCase()] || "#8b5cf6"} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-600" /> Applications per Company
                      </CardTitle>
                      <CardDescription>Which companies are getting the most interest</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {applicationsPerCompany.length === 0 ? (
                        <EmptyChart />
                      ) : (
                        <ResponsiveContainer width="100%" height={320}>
                          <BarChart data={applicationsPerCompany} layout="vertical" margin={{ left: 10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" allowDecimals={false} />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={150}
                              tick={{ fontSize: 11 }}
                              interval={0}
                              tickFormatter={(v: string) => (v.length > 20 ? v.slice(0, 19) + "…" : v)}
                            />
                            <Tooltip />
                            <Bar dataKey="applicants" fill="#a855f7" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-purple-600" /> Students by Grade
                      </CardTitle>
                      <CardDescription>Grade distribution of registered students</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={studentsByGrade} margin={{ left: 0, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                            {studentsByGrade.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* ---------------- APPLICATIONS ---------------- */}
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">Who's Applying to What</CardTitle>
                    <CardDescription>
                      {groupedByStudent.length} student{groupedByStudent.length !== 1 ? "s" : ""} · {stats.totalApplications} total applications — each student is listed once; click to expand
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportApplicationsCsv}
                    disabled={filteredApplications.length === 0}
                    className="shrink-0"
                  >
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                  </Button>
                </div>
                <div className="pt-2">
                  <Input
                    placeholder="Search by student, internship, or company…"
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {appsLoading ? (
                  <div className="text-center py-12 text-gray-500">Loading applications…</div>
                ) : groupedByStudent.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No applications found.</div>
                ) : (
                  <div className="space-y-3">
                    {groupedByStudent.map((g) => {
                      const open = !!expandedStudents[g.studentId];
                      return (
                        <div key={g.studentId} className="border border-gray-200 rounded-xl overflow-hidden">
                          {/* Student header row — name shown once */}
                          <button
                            type="button"
                            onClick={() => toggleStudent(g.studentId)}
                            className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-purple-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {open ? (
                                <ChevronDown className="w-4 h-4 text-purple-600 shrink-0" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                              )}
                              <Avatar className="w-10 h-10 shrink-0">
                                <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                                  {(g.name[0] || "?").toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">{g.name}</p>
                                <p className="text-sm text-gray-500 truncate">{g.email}</p>
                                <div className="flex flex-wrap gap-2 mt-0.5 text-xs text-gray-500">
                                  {g.grade && <span>{g.grade} Grade</span>}
                                  {g.school && <span>• {g.school}</span>}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="shrink-0">
                              {g.apps.length} application{g.apps.length !== 1 ? "s" : ""}
                            </Badge>
                          </button>

                          {/* Expanded list of everywhere this student applied */}
                          {open && (
                            <div className="border-t border-gray-100 divide-y divide-gray-100 bg-gray-50/40">
                              {g.apps.map((a) => (
                                <div key={a.id} className="p-4 flex flex-col gap-3">
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                    <div className="text-sm">
                                      <span className="text-gray-800 font-medium">
                                        <Briefcase className="w-3.5 h-3.5 inline mr-1 text-purple-500" />
                                        {a.internshipTitle || "—"}
                                      </span>
                                      <div className="text-gray-600 mt-1">
                                        <Building className="w-3.5 h-3.5 inline mr-1 text-blue-500" />
                                        {a.company?.companyName || "—"}
                                        {a.internshipLocation && (
                                          <span className="text-gray-400"> • {a.internshipLocation}</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-left sm:text-right shrink-0">
                                      {statusBadge(a.status || "pending")}
                                      <p className="text-xs text-gray-400 mt-1">
                                        {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : ""}
                                      </p>
                                    </div>
                                  </div>
                                  {/* Admin-only organisation status — never shown to students */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <span className="text-xs font-medium text-gray-500">Admin tracking:</span>
                                    <Select
                                      value={a.adminStatus || "pending"}
                                      onValueChange={(value) =>
                                        adminStatusMutation.mutate({ id: a.id, adminStatus: value })
                                      }
                                    >
                                      <SelectTrigger
                                        className={`h-7 w-[140px] text-xs font-medium ${ADMIN_STATUS_STYLES[a.adminStatus || "pending"]}`}
                                      >
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <span className="text-[11px] text-gray-400 hidden sm:inline">
                                      (only you can see this)
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- INTERNSHIPS ---------------- */}
          <TabsContent value="internships" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Internships & Applicant Counts</CardTitle>
                <CardDescription>{stats.totalInternships} internships on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {internships.map((i) => {
                    const count = applications.filter((a) => a.internshipId === i.id).length;
                    const companyName = companies.find((c) => c.id === i.companyId)?.companyName;
                    return (
                      <div key={i.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                        <div>
                          <p className="font-medium text-gray-900">{i.title}</p>
                          <p className="text-xs text-gray-500">
                            {companyName || "—"} • {i.location}
                            {!i.isActive && <span className="text-red-500"> • inactive</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-purple-700">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">{count}</span>
                          <span className="text-xs text-gray-500">applicant{count !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- STUDENTS ---------------- */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Students & Their Stats</CardTitle>
                <CardDescription>{students.length} registered students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {students.map((s) => (
                    <div key={s.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-purple-100 text-purple-700 text-sm font-semibold">
                            {(s.firstName?.[0] || s.username[0]).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {s.email}
                            {s.grade && <span> • {s.grade} Grade</span>}
                            {s.schoolName && <span> • {s.schoolName}</span>}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {appsByStudent[s.id] || 0} application{(appsByStudent[s.id] || 0) !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- COMPANIES ---------------- */}
          <TabsContent value="companies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Companies & Their Activity</CardTitle>
                <CardDescription>{companies.length} registered companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {companies.map((c) => {
                    const companyInternships = internships.filter((i) => i.companyId === c.id);
                    const applicantCount = applications.filter((a) => a.companyId === c.id).length;
                    return (
                      <div key={c.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                              {(c.companyName?.[0] || c.username[0]).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{c.companyName || c.username}</p>
                            <p className="text-xs text-gray-500">
                              {c.email}
                              {c.companyField && <span> • {c.companyField}</span>}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm shrink-0">
                          <span className="text-gray-600">
                            <Briefcase className="w-3.5 h-3.5 inline mr-1 text-green-500" />
                            {companyInternships.length}
                          </span>
                          <span className="text-gray-600">
                            <Users className="w-3.5 h-3.5 inline mr-1 text-purple-500" />
                            {applicantCount}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, hint, color, bg,
}: {
  icon: any; label: string; value: number; hint: string; color: string; bg: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
          <p className="text-sm font-medium text-gray-700 mt-1">{label}</p>
          <p className="text-xs text-gray-400">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="h-[320px] flex items-center justify-center text-gray-400 text-sm">
      No data yet
    </div>
  );
}
