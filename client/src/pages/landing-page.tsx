import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Zap, Compass, Sparkles, Award, Flame, Target, GraduationCap, Globe } from "lucide-react";

// Custom Diploma Scroll Icon Component (based on attached image)
const DiplomaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    {/* Rolled diploma/scroll */}
    <path d="M3 4h18v2L19 8v8l2 2v2H3v-2l2-2V8L3 6V4z"/>
    <path d="M6 8h12v8H6V8z"/>
    {/* Ribbon/tie */}
    <path d="M11 16h2v4l-1-1-1 1v-4z"/>
    {/* Seal/emblem */}
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Auto-redirect logged-in users to appropriate dashboard using useEffect
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "company") {
        setLocation("/company-dashboard");
      } else {
        setLocation("/dashboard");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <DiplomaIcon className="w-8 h-8 text-black" />
              <span className="text-3xl font-bold text-black">intrn</span>
            </div>
            {!user ? (
              <Button 
                onClick={() => setLocation("/auth")}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Welcome, {user.firstName}!</span>
                <Button 
                  onClick={() => setLocation("/dashboard")}
                  variant="outline"
                  className="px-4 py-2 rounded-lg font-medium"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      await fetch("/api/logout", { method: "POST", credentials: "include" });
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.href = "/";
                    } catch (error) {
                      window.location.href = "/";
                    }
                  }}
                  variant="outline"
                  className="px-4 py-2 rounded-lg font-medium"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          {/* Modern Minimalist Logo */}
          <div className="flex items-center justify-center mb-12 group">
            <DiplomaIcon className="w-16 h-16 text-black transform group-hover:scale-110 transition-all duration-500" />
            <div className="ml-6">
              <span className="text-6xl md:text-7xl font-bold text-black">
                intrn
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-8 leading-tight">
            Internships for
            <br />
            <span className="text-black">
              Highschoolers
            </span>
          </h1>
          <p className="text-lg md:text-xl text-black mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Find meaningful internship opportunities designed for high school students. 
            Gain real-world experience and build your skills with professional mentorship.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 px-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              onClick={() => setLocation("/auth?tab=register")}
            >
              For Highschoolers
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              onClick={() => setLocation("/company-info")}
            >
              For Companies
            </Button>
          </div>
        </div>



        {/* Features - Clean and Minimalist */}
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          <div className="text-center group">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-primary-100 group-hover:shadow-xl transition-all duration-300">
              <Target className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">Gain Real Experience</h3>
            <p className="text-black leading-relaxed">
              Work on meaningful projects, learn from professionals, and build skills for your future career.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-primary-100 group-hover:shadow-xl transition-all duration-300">
              <Zap className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">Learn New Skills</h3>
            <p className="text-black leading-relaxed">
              Develop valuable workplace skills, work with mentors, and discover career paths that interest you.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-primary-100 group-hover:shadow-xl transition-all duration-300">
              <Award className="w-10 h-10 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">Build Your Future</h3>
            <p className="text-black leading-relaxed">
              Create a strong resume, gain references, and build connections that help you succeed in college and career.
            </p>
          </div>
        </div>

        {/* Featured Internships - Preview Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-6">Explore Real Internship Opportunities</h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Join high schoolers working on meaningful projects at top organizations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Ripples of Hope */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50" onClick={() => setLocation("/auth?tab=register")}>
              <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
                {/* Water ripple effect visual */}
                <div className="relative">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute inset-0 w-20 h-20 -m-2 border-2 border-blue-300 rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Social Impact</span>
                  <span className="text-gray-500 text-sm">Remote + Travel</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ripples of Hope</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Research the impact of sports on marriage choices of adolescent girls in underprivileged communities in rural North India. Field work opportunities in UP, Bihar...
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-primary font-semibold">Apply Now</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Prelude Novel Ventures */}
            <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50" onClick={() => setLocation("/auth?tab=register")}>
              <div className="relative h-48 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center overflow-hidden">
                {/* Event management visual */}
                <div className="relative">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 border-2 border-purple-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute inset-0 w-20 h-20 -m-2 border-2 border-purple-300 rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">Event Management</span>
                  <span className="text-gray-500 text-sm">Hybrid</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Prelude Novel Ventures</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Interns will be responsible for conducting research, collating relevant data, and preparing basic presentations to support the development of new event IPs...
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-primary font-semibold">Apply Now</span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section - Clean and Direct */}
        <div className="text-center bg-white rounded-3xl p-16 shadow-lg border border-primary-100">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Ready to Start Your
            <br />
            <span className="text-black">
              Future?
            </span>
          </h2>
          <p className="text-xl text-black mb-10 max-w-2xl mx-auto">
            Join thousands of students and companies building the next generation of talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white text-xl px-12 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setLocation("/auth?tab=register")}
            >
              I'm a Highschooler
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-xl px-12 py-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setLocation("/company-info")}
            >
              I'm a Company
              <Sparkles className="ml-3 h-6 w-6" />
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Button 
              variant="ghost" 
              className="text-primary hover:bg-primary/10 text-lg px-8 py-2 rounded-xl font-medium"
              onClick={() => setLocation("/auth?tab=login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </main>

      {/* Footer - Minimalist */}
      <footer className="bg-gray-100 py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <DiplomaIcon className="w-8 h-8 text-black mr-3" />
              <span className="text-3xl font-bold text-black">intrn</span>
            </div>
            <p className="text-black text-lg mb-8 max-w-2xl mx-auto">
              Empowering the next generation of talent across South Asia
            </p>
            <div className="border-t border-gray-300 pt-8">
              <p className="text-black">&copy; 2025 INTRN. Built for high school students.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}