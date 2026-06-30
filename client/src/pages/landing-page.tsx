import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { HamburgerNavigation } from "@/components/hamburger-navigation";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ArrowRight, Sparkles, GraduationCap, Briefcase, BookOpen, Rocket, Building, Clock, MapPin } from "lucide-react";
import { getInternshipImage, getTitleGradient, isLogoImage } from "@/lib/internship-images";

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

function StatCounter({ value, label, suffix = "+" }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || value === 0) return;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 1500 / steps);
    return () => clearInterval(timer);
  }, [hasStarted, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{count}{suffix}</div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats } = useQuery<{ students: number; companies: number; applications: number; internships: number }>({
    queryKey: ["/api/stats"],
  });

  const { data: internships } = useQuery<any[]>({
    queryKey: ["/api/internships"],
  });
  const previewInternships = (() => {
    const preferredCompanies = ["chandrani pearls", "bir terraces", "ripples of hope"];
    const all = internships ?? [];
    const companyOf = (i: any) => (i.description ?? "").split("\n")[0].trim().toLowerCase();
    const picked: any[] = [];
    for (const name of preferredCompanies) {
      const match = all.find((i) => companyOf(i) === name);
      if (match) picked.push(match);
    }
    return picked;
  })();

  useSeo({
    title: "INTRN — Internships for Highschoolers",
    description: "Find meaningful internship opportunities designed for high school students across South Asia. Gain real-world experience, build skills, and launch your career early.",
    canonical: "https://intrn.replit.app/",
    ogTitle: "INTRN — Internships for Highschoolers",
    ogDescription: "The leading platform connecting high school students with internship opportunities. Real experience, real learning.",
  });

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
      <HamburgerNavigation />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <button 
              onClick={() => {
                if (window.hamburgerToggle) {
                  window.hamburgerToggle();
                }
              }}
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <DiplomaIcon className="w-8 h-8 text-black" />
              <span className="text-3xl font-bold text-black">intrn</span>
            </button>
            {!user ? (
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost"
                  onClick={() => setLocation("/auth")}
                  className="text-gray-700 hover:text-primary px-4 py-2 font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => setLocation("/auth?tab=register")}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Button>
              </div>
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
            <Link
              href="/auth?tab=register"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              For Highschoolers
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              href="/company-info"
              className="w-full sm:w-auto inline-flex items-center justify-center text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
            >
              For Companies
            </Link>
          </div>
        </div>



        {/* Live Impact Counter */}
        <div className="mb-24">
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-primary-100">
            <p className="text-center text-xs font-semibold text-primary uppercase tracking-widest mb-10">Live Platform Stats</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              <StatCounter value={stats?.students ?? 0} label="Students Registered" />
              <StatCounter value={stats?.applications ?? 0} label="Applications Submitted" />
              <StatCounter value={stats?.internships ?? 0} suffix="" label="Live Internships" />
              <StatCounter value={stats?.companies ?? 0} label="Partner Companies" />
            </div>
          </div>
        </div>

        {/* Features - Clean and Minimalist */}
        <div className="bg-white rounded-3xl px-10 py-14 mb-24 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-all duration-300">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Gain Real Experience</h3>
              <p className="text-gray-600 leading-relaxed">
                Work on meaningful projects, learn from professionals, and build skills for your future career.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-all duration-300">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Learn New Skills</h3>
              <p className="text-gray-600 leading-relaxed">
                Develop valuable workplace skills, work with mentors, and discover career paths that interest you.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-all duration-300">
                <Rocket className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Build Your Future</h3>
              <p className="text-gray-600 leading-relaxed">
                Create a strong resume, gain references, and build connections that help you succeed in college and career.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Internships - Preview Section */}
        <div className="mb-24">
          <div className="bg-primary/5 rounded-3xl px-10 py-14">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Real Internship Opportunities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join high schoolers working on meaningful projects at real organisations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {previewInternships.map((internship: any) => {
                const image = getInternshipImage(internship.title);
                const gradient = getTitleGradient(internship.title);
                const isLogo = isLogoImage(internship.title);
                return (
                  <Link
                    key={internship.id}
                    href={`/internship/${internship.id}`}
                    className="group block hover:shadow-xl transition-all duration-300 cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-primary/30 bg-white"
                  >
                    <div className="relative h-36 overflow-hidden">
                      {image ? (
                        <img src={image} alt={internship.title} className={`h-full w-full group-hover:scale-105 transition-transform duration-500 ${isLogo ? "object-contain bg-white p-4" : "object-cover"}`} loading="lazy" decoding="async" width="400" height="144" />
                      ) : (
                        <div className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                          <Building className="w-12 h-12 text-white/60" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 line-clamp-1 text-sm">{internship.description.split('\n')[0]}</h3>
                      <p className="text-gray-600 text-xs line-clamp-1 mt-0.5 mb-2">{internship.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {internship.location || "Online"}
                        </span>
                        {internship.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {internship.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2 mb-4">{internship.description.split('\n').slice(3).join(' ').trimStart()}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary text-sm font-semibold">Apply Now</span>
                        <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/search"
                className="inline-flex items-center border border-primary text-primary hover:bg-primary hover:text-white px-8 py-2.5 rounded-xl font-medium transition-all"
              >
                View All {stats?.internships ?? 9} Internships
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
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
            Join {stats?.students ?? 41}+ students and {stats?.companies ?? 13}+ companies building the next generation of talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/auth?tab=register"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-xl px-12 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              I'm a Highschooler
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <Link
              href="/company-info"
              className="inline-flex items-center justify-center text-xl px-12 py-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              I'm a Company
              <Sparkles className="ml-3 h-6 w-6" />
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link
              href="/auth?tab=login"
              className="inline-flex items-center justify-center text-primary hover:bg-primary/10 text-lg px-8 py-2 rounded-xl font-medium"
            >
              Sign In
            </Link>
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
              <p className="text-black">&copy; 2026 INTRN. Built for high school students.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}