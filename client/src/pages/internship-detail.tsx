import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Building, 
  Globe, 
  Brain,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  GraduationCap
} from "lucide-react";
import rippleImage from "@assets/download (1)_1753000655307.png";

type Internship = {
  id: number;
  companyId: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  duration: string;
  skills: string[];
  applicationDeadline: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
};

type Company = {
  id: number;
  companyName: string;
  companyField: string;
  location: string;
  website: string;
};

export default function InternshipDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: internship, isLoading } = useQuery<Internship>({
    queryKey: [`/api/internships/${id}`],
  });

  const { data: company } = useQuery<Company>({
    queryKey: [`/api/users/${internship?.companyId}`],
    enabled: !!internship?.companyId,
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!internship) throw new Error("No internship found");
      if (!user) throw new Error("User not authenticated");
      return apiRequest(`/api/applications`, {
        method: "POST",
        body: {
          internshipId: internship.id,
          coverLetter: "Application submitted through INTRN platform",
          resume: "Available upon request",
          status: "pending"
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted and the INTRN team will get back to you.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setLocation("/application-success");
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Internship Not Found</h1>
          <Button onClick={() => setLocation("/search")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    if (!user) {
      setLocation("/auth?tab=register");
      return;
    }
    applyMutation.mutate();
  };

  // Check if this is the Ripples of Hope internship to show the special image
  const isRipplesOfHope = internship.title.includes("Research Intern - Social Impact");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/search")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Internships
          </Button>
          
          <div className="flex items-start gap-6">
            {/* Company Logo/Image */}
            <div className="flex-shrink-0">
              {isRipplesOfHope ? (
                <img 
                  src={rippleImage} 
                  alt="Ripples of Hope" 
                  className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Building className="w-10 h-10 text-primary" />
                </div>
              )}
            </div>
            
            {/* Title and Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
              <div className="flex items-center gap-4 text-lg text-gray-600 mb-4">
                <span className="font-medium">{company?.companyName || "Company"}</span>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {internship.location}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {internship.type === "remote" ? "Remote" : 
                   internship.type === "onsite" ? "On-site" : "Hybrid"}
                </Badge>
                <Badge variant="outline">{internship.duration}</Badge>
                <Badge variant="outline">{company?.companyField || "General"}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  About This Internship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {internship.description}
                </p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Requirements & Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {internship.requirements}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills?.map((skill, index) => (
                      <Badge key={index} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            {company && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" />
                    About {company.companyName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <span className="font-medium mr-2">Industry:</span>
                      {company.companyField}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="font-medium mr-2">Location:</span>
                      {company.location}
                    </div>
                    {company.website && (
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <span className="font-medium mr-2">Website:</span>
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          https://ripplesofhope.in/
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Apply Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={handleApply}
                  className="w-full mb-4"
                  size="lg"
                  disabled={applyMutation.isPending}
                >
                  {applyMutation.isPending ? "Submitting..." : "Sign Up for Internship"}
                </Button>
                
                {!user && (
                  <p className="text-sm text-gray-600 text-center">
                    You need to create an account to apply
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Key Details */}
            <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Duration</p>
                    <p className="text-gray-600">{internship.duration}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Location</p>
                    <p className="text-gray-600">{internship.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Type</p>
                    <p className="text-gray-600 capitalize">{internship.type}</p>
                  </div>
                </div>

                {internship.applicationDeadline && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Application Deadline</p>
                      <p className="text-gray-600">
                        {new Date(internship.applicationDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {internship.startDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Start Date</p>
                      <p className="text-gray-600">
                        {new Date(internship.startDate).toLocaleDateString()}
                      </p>
                    </div>
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