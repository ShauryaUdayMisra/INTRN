import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Zap, Compass, TrendingUp, Sparkles, Brain, Award, Flame, Target } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <StudentIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">intrn</span>
            </div>
            <Button 
              onClick={() => setLocation("/auth")}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          {/* Modern Minimalist Logo */}
          <div className="flex items-center justify-center mb-12 group">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                <span className="text-4xl font-bold text-white">i</span>
              </div>
            </div>
            <div className="ml-6">
              <span className="text-6xl md:text-7xl font-bold text-black">
                intrn
              </span>
              <div className="flex items-center justify-center text-xs font-semibold text-black tracking-[0.2em] mt-1 uppercase">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  <path d="M19 7h-1V6c0-.55-.45-1-1-1s-1 .45-1 1v1h-1c-.55 0-1 .45-1 1s.45 1 1 1h1v1c0 .55.45 1 1 1s1-.45 1-1V9h1c.55 0 1-.45 1-1s-.45-1-1-1z"/>
                </svg>
                For Highschoolers
              </div>
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
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white text-lg px-10 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              onClick={() => setLocation("/auth")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
              onClick={() => setLocation("/company-signup")}
            >
              Hire Talent
            </Button>
          </div>
        </div>

        {/* Stats - Modern Minimalist */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-black mb-2">10K+</div>
            <div className="text-black font-medium">Active Builders</div>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-black mb-2">500+</div>
            <div className="text-black font-medium">Tech Companies</div>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-black mb-2">2K+</div>
            <div className="text-black font-medium">Live Projects</div>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-bold text-black mb-2">95%</div>
            <div className="text-black font-medium">Ship Rate</div>
          </div>
        </div>

        {/* Features - Clean and Minimalist */}
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          <div className="text-center group">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-primary-100 group-hover:shadow-xl transition-all duration-300">
              <Brain className="w-10 h-10 text-black" />
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
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white text-xl px-12 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => setLocation("/auth")}
          >
            Get Started Today
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </main>

      {/* Footer - Minimalist */}
      <footer className="bg-primary-900 text-white py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center mr-3">
                <StudentIcon className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-3xl font-bold">intrn</span>
            </div>
            <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto">
              Empowering the next generation of talent across South Asia
            </p>
            <div className="border-t border-primary-800 pt-8">
              <p className="text-primary-300">&copy; 2025 INTRN. Built for high school students.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}