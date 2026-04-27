import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { CompanyRequest } from "@shared/schema";

export default function CompanyStatus() {
  const { user } = useAuth();
  
  const { data: companyRequests = [], isLoading } = useQuery<CompanyRequest[]>({
    queryKey: ["/api/company-requests/my"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8">Application Status</h1>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-black">Loading your applications...</div>
            </div>
          ) : companyRequests.length === 0 ? (
            <div className="space-y-6">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    <CardTitle className="text-xl text-yellow-800">Application Under Review</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-yellow-700">
                      Thank you for signing up! Your company application is currently being reviewed by our team.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Complete your company details in the external form (if you haven't already)</li>
                        <li>• Our team will review your submission within 48 hours</li>
                        <li>• You'll receive an email notification once approved</li>
                        <li>• After approval, you can start posting internship opportunities</li>
                      </ul>
                    </div>
                    <p className="text-yellow-600 text-sm">
                      Expected review time: 24-48 hours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {companyRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-black">{request.companyName}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status ?? "pending")}
                        <Badge className={getStatusColor(request.status ?? "pending")}>
                          {request.status ?? "pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-black mb-2">Company Details</h4>
                        <p className="text-black"><strong>Field:</strong> {request.companyField}</p>
                        <p className="text-black"><strong>Internship Type:</strong> {request.internshipType}</p>
                        <p className="text-black"><strong>Location:</strong> {request.location}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-2">Application Info</h4>
                        {request.submittedAt && (
                          <p className="text-black"><strong>Submitted:</strong> {new Date(request.submittedAt).toLocaleDateString()}</p>
                        )}
                        {request.reviewedAt && (
                          <p className="text-black"><strong>Reviewed:</strong> {new Date(request.reviewedAt).toLocaleDateString()}</p>
                        )}
                        {request.adminNotes && (
                          <p className="text-black"><strong>Notes:</strong> {request.adminNotes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}