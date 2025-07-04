import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, BookOpen } from "lucide-react";

export default function CompanyThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-black">Application Submitted!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-black leading-relaxed">
            Your application has been processed. The intrn team will get back to you shortly. 
            We are grateful for your support.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
              <Link href="/company-status">
                <FileText className="w-4 h-4 mr-2" />
                View Application Status
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/blog">
                <BookOpen className="w-4 h-4 mr-2" />
                Access Blog
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}