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
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-black">No company applications found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {companyRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-black">{request.companyName}</CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-black mb-2">Company Details</h4>
                        <p className="text-black"><strong>Industry:</strong> {request.industry}</p>
                        <p className="text-black"><strong>Size:</strong> {request.companySize}</p>
                        <p className="text-black"><strong>Location:</strong> {request.location}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-2">Application Info</h4>
                        <p className="text-black"><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
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