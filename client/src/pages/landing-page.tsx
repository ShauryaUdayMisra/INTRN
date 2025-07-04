import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { 
  ArrowRight, 
  Users, 
  Building, 
  TrendingUp, 
  Globe, 
  BookOpen, 
  Trophy, 
  Heart, 
  Star,
  Lightbulb,
  Target,
  Rocket,
  MessageCircle,
  CheckCircle,
  Sparkles,
  Award,
  GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-200/25 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <StudentIcon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-yellow-700" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">intrn</span>
                <div className="text-xs text-gray-500 font-medium">for highschoolers</div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50 transition-all duration-300"
              onClick={() => setLocation("/auth")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              🎓 Designed specifically for high school students
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  first step
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
              </span>
              {" "}into the{" "}
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                professional world
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Connect with companies that care about your growth. Gain real experience. 
              Build skills that matter. All while you're still in high school.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setLocation("/auth")}
            >
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-6 rounded-2xl transition-all duration-300"
              onClick={() => setLocation("/search")}
            >
              Explore Internships
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>100% Free for Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Focus on Learning, Not Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>8th Grade & Above Welcome</span>
            </div>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                We Believe Every High Schooler Deserves a Chance
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                You don't need to wait until college to gain real-world experience. 
                Companies are looking for young, eager minds like yours to bring fresh perspectives and learn alongside their teams.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/30"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Your Passion</h3>
                <p className="text-gray-600">
                  Try different fields and discover what excites you before choosing your college major.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/30"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Build Real Connections</h3>
                <p className="text-gray-600">
                  Connect with mentors and professionals who can guide your career journey.
                </p>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white/60 rounded-2xl backdrop-blur-sm border border-white/30"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Get Ahead Early</h3>
                <p className="text-gray-600">
                  Build your resume and gain experience that will set you apart in college applications.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">2,500+</div>
              <div className="text-sm text-gray-600">Active Students</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">450+</div>
              <div className="text-sm text-gray-600">Partner Companies</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">85%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 border-none shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">3,200+</div>
              <div className="text-sm text-gray-600">Internships Completed</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* How It Works */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is simple. We've designed everything with high school students in mind.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative text-center p-8 bg-white/70 rounded-3xl shadow-lg border border-white/30 backdrop-blur-sm"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Tell us about your interests, skills, and what you want to learn. It takes just 5 minutes.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative text-center p-8 bg-white/70 rounded-3xl shadow-lg border border-white/30 backdrop-blur-sm"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find Perfect Matches</h3>
              <p className="text-gray-600">
                Browse internships that match your grade level, interests, and schedule.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="relative text-center p-8 bg-white/70 rounded-3xl shadow-lg border border-white/30 backdrop-blur-sm"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Learning</h3>
              <p className="text-gray-600">
                Begin your internship journey with companies that truly care about your development.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 text-white shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium mb-6 leading-relaxed">
                "I never thought I could work at a tech company as a 10th grader. 
                Intrn helped me find an internship where I learned coding and gained 
                confidence. Now I know exactly what I want to study in college!"
              </blockquote>
              <div className="text-lg opacity-90">
                — Priya S., 16 years old, Software Development Intern
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Professional Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of high school students who are already building their future. 
            Your dream internship is just one click away.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            onClick={() => setLocation("/auth")}
          >
            Join Intrn Today <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <div className="mt-8 text-sm text-gray-500">
            Free forever • No hidden fees • Built for high schoolers
          </div>
        </motion.div>
      </div>
    </div>
  );
}