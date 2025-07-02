import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Users, Building, TrendingUp, Globe } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/home");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">INTRN</span>
            </div>
            <Button 
              onClick={() => setLocation("/auth")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with Your Future
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The leading internship platform for South Asia. Join thousands of students 
            finding their dream internships with top companies across India and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
              onClick={() => setLocation("/auth")}
            >
              Find Internships <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => setLocation("/company-signup")}
            >
              I'm a Company
            </Button>
          </div>
          <div className="mt-4">
            <Button 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-700"
              onClick={() => window.location.href = "/api/login"}
            >
              Sign in with Replit →
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Active Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Partner Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2K+</div>
            <div className="text-gray-600">Internships Posted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>For Students</CardTitle>
              <CardDescription>
                Discover internships that match your skills and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Personalized internship recommendations</li>
                <li>Direct applications to top companies</li>
                <li>Career guidance and mentorship</li>
                <li>Skill development resources</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>For Companies</CardTitle>
              <CardDescription>
                Find talented interns from top universities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Access to verified student profiles</li>
                <li>Streamlined application management</li>
                <li>University partnership programs</li>
                <li>Analytics and reporting tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Proven Results</CardTitle>
              <CardDescription>
                Join the success stories of our community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>90% internship completion rate</li>
                <li>75% conversion to full-time offers</li>
                <li>Average 40% salary increase</li>
                <li>Industry-leading satisfaction scores</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* South Asia Focus */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-16">
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Built for South Asia
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-6">
            We understand the unique challenges and opportunities in the South Asian job market. 
            Our platform is specifically designed to connect students from India, Pakistan, Bangladesh, 
            and Sri Lanka with relevant internship opportunities.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Local Partnerships</h3>
              <p className="text-sm text-gray-600">Exclusive partnerships with top universities and companies</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Cultural Understanding</h3>
              <p className="text-sm text-gray-600">Platform designed with regional preferences in mind</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Local Support</h3>
              <p className="text-sm text-gray-600">Dedicated support team available in local time zones</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of students and hundreds of companies already using INTRN.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-4"
            onClick={() => setLocation("/auth")}
          >
            Sign Up Now <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="text-2xl font-bold">INTRN</span>
              </div>
              <p className="text-gray-400">
                Connecting South Asian talent with global opportunities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Students</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Find Internships</li>
                <li>Career Resources</li>
                <li>Success Stories</li>
                <li>Help Center</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Post Internships</li>
                <li>Find Talent</li>
                <li>Pricing</li>
                <li>Enterprise</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 INTRN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}