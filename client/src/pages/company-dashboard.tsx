import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, BookOpen, Search, Users, Globe } from "lucide-react";
import { useEffect } from "react";

export default function CompanyDashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "company")) {
      setLocation("/auth?tab=login");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.role !== "company") {
    return null;
  }

  // Check if this is Ripples of Hope company
  const isRipplesOfHope = user.email === "Sameer.walia@ripplesofhope.in";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-primary mr-3" />
              <span className="text-2xl font-bold text-gray-900">intrn</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/auth?logout=true")}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Signing Up!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We have processed your application and your internship is now live on our platform.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Application Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Your company profile and internship listing have been approved and are now visible to students on our platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">
                We will email you immediately when students register for your internship opportunity.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Internship Status */}
        {isRipplesOfHope && (
          <Card className="mb-12 border-primary-200 bg-primary-50">
            <CardHeader>
              <CardTitle className="text-primary-800">Your Live Internship</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h3 className="font-semibold text-primary-900">Research Intern - Social Impact</h3>
                <p className="text-primary-700">
                  Research the impact of sports on marriage choices of adolescent girls in underprivileged communities in rural North India.
                </p>
                <div className="flex items-center space-x-4 text-sm text-primary-600">
                  <span className="bg-primary-100 px-2 py-1 rounded">Remote + Travel</span>
                  <span>Duration: 7-28 days</span>
                  <span>Location: UP, Bihar</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setLocation("/blog")}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Read Our Blog</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with career advice, industry insights, and success stories from our community.
              </p>
              <Button variant="outline" className="w-full">
                Explore Blog
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setLocation("/search")}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Explore Internships</h3>
              <p className="text-gray-600 mb-4">
                Browse other internship opportunities and see what's available on our platform.
              </p>
              <Button variant="outline" className="w-full">
                Browse Internships
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What Happens Next?</h3>
              <div className="space-y-2 text-gray-600 max-w-2xl mx-auto">
                <p>• Students can now view and apply to your internship</p>
                <p>• You'll receive email notifications for each application</p>
                <p>• Applications include student profiles and cover letters</p>
                <p>• You can review and respond to applications directly</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}