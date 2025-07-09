import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function CompanyApplicationStatus() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user || user.role !== "company") {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black mb-4">
            Application Under Review
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your interest in partnering with INTRN!
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Your Application Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">Under Review</h3>
                  <p className="text-yellow-700 text-sm">
                    Your company application is being reviewed by our team. This process may take up to 48 hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>We review all applications carefully to ensure the best experience for our high school students.</p>
              <p>You'll receive an email notification once your application has been approved and you can start posting internship opportunities.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>While You Wait</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Explore our blog to learn more about creating successful internship programs for high school students.
            </p>
            <Button 
              onClick={() => setLocation("/blog")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Read Our Blog
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Questions? Contact us at{" "}
            <a href="mailto:intrnxyz@gmail.com" className="text-primary hover:underline">
              intrnxyz@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}