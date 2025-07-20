import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { CheckCircle, ArrowLeft, MessageCircle, Clock } from "lucide-react";

export default function ApplicationSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Application Submitted!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Your application has been successfully submitted. The INTRN team will review your application and get back to you soon.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-left">
                <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
                <p className="text-sm text-blue-700">
                  • We'll review your application within 2-3 business days
                  <br />
                  • You'll receive an email with next steps
                  <br />
                  • Check your application status in your dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setLocation("/dashboard")}
              className="w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setLocation("/search")}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse More Internships
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}