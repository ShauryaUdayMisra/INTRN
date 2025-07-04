import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Users, Building, TrendingUp, Globe, BookOpen, Trophy, Heart, Star } from "lucide-react";

// Custom Student Icon Component (based on attached image)
const StudentIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 15 L20 25 L20 35 L80 35 L80 25 Z" />
    <circle cx="50" cy="50" r="12" />
    <path d="M35 62 Q35 58 40 58 L60 58 Q65 58 65 62 L65 75 Q65 78 62 78 L38 78 Q35 78 35 75 Z" />
    <path d="M42 58 L42 50 Q42 45 50 45 Q58 45 58 50 L58 58" />
  </svg>
);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <StudentIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">intrn</span>
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
          {/* Enhanced INTRN Logo with Student Icon */}
          <div className="flex items-center justify-center mb-8 group">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500 border-2 border-white/20">
                <StudentIcon className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-3 h-3 text-yellow-700" />
              </div>
            </div>
            <div className="ml-6">
              <span className="text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-indigo-600 transition-all duration-500 drop-shadow-sm">
                intrn
              </span>
              <div className="text-sm font-medium text-purple-600 tracking-widest mt-2">
                FOR HIGHSCHOOLERS
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Internships for Highschoolers
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The leading internship platform for high school students in South Asia. Join thousands of 
            8th-12th grade students finding valuable learning experiences with top companies across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              onClick={() => setLocation("/auth")}
            >
              Find Internships <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={() => setLocation("/company-signup")}
            >
              I'm a Company
            </Button>
          </div>
          <div className="mt-4">
            <Button 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-700"
              onClick={() => setLocation("/auth?demo=replit")}
            >
              Sign in with Replit →
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative text-center p-6 bg-white rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">10K+</div>
              <div className="text-gray-600 font-medium text-sm">Active Students</div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative text-center p-6 bg-white rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-1">500+</div>
              <div className="text-gray-600 font-medium text-sm">Partner Companies</div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative text-center p-6 bg-white rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">2K+</div>
              <div className="text-gray-600 font-medium text-sm">Learning Opportunities</div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative text-center p-6 bg-white rounded-2xl border border-orange-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">95%</div>
              <div className="text-gray-600 font-medium text-sm">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="relative group text-center p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <StudentIcon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">For High Schoolers</CardTitle>
              <CardDescription className="text-gray-600 mt-3">
                Start your career journey early with meaningful learning experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-center"><Heart className="w-4 h-4 text-red-500 mr-2" /> Skill-building opportunities</li>
                <li className="flex items-center"><BookOpen className="w-4 h-4 text-blue-500 mr-2" /> Real-world experience</li>
                <li className="flex items-center"><Users className="w-4 h-4 text-green-500 mr-2" /> Mentorship programs</li>
                <li className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-2" /> Career exploration</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="relative group text-center p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Building className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">For Companies</CardTitle>
              <CardDescription className="text-gray-600 mt-3">
                Invest in the next generation of talent through meaningful mentorship
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-center"><Heart className="w-4 h-4 text-red-500 mr-2" /> Build future talent pipeline</li>
                <li className="flex items-center"><BookOpen className="w-4 h-4 text-blue-500 mr-2" /> Provide learning experiences</li>
                <li className="flex items-center"><Users className="w-4 h-4 text-green-500 mr-2" /> Mentor young minds</li>
                <li className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-2" /> Social impact initiatives</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="relative group text-center p-8 hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardHeader className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Learning Focused</CardTitle>
              <CardDescription className="text-gray-600 mt-3">
                Unpaid internships that prioritize skill development and growth
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <ul className="text-sm text-gray-600 space-y-3 text-left">
                <li className="flex items-center"><Heart className="w-4 h-4 text-red-500 mr-2" /> Skill-based learning</li>
                <li className="flex items-center"><BookOpen className="w-4 h-4 text-blue-500 mr-2" /> Real project experience</li>
                <li className="flex items-center"><Users className="w-4 h-4 text-green-500 mr-2" /> Industry mentorship</li>
                <li className="flex items-center"><Star className="w-4 h-4 text-yellow-500 mr-2" /> Certificate programs</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* High School Focus */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-12 mb-16 shadow-2xl border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Globe className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-yellow-700" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Designed for High School Students
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto mb-8 leading-relaxed">
              We understand that high school students need different opportunities than college students. 
              Our platform focuses on providing meaningful, unpaid learning experiences that help 8th-12th grade 
              students explore careers and build skills for their future.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Skill Development</h3>
                <p className="text-sm text-gray-600">Focus on building practical skills and gaining real-world experience</p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Mentorship</h3>
                <p className="text-sm text-gray-600">Connect with industry professionals who guide your learning journey</p>
              </div>
              <div className="text-center p-6 bg-white/50 rounded-xl backdrop-blur-sm">
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Career Exploration</h3>
                <p className="text-sm text-gray-600">Discover different career paths and find your passion early</p>
              </div>
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl px-16 py-6 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            onClick={() => setLocation("/auth")}
          >
            Sign Up Now <ArrowRight className="ml-3 h-6 w-6" />
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