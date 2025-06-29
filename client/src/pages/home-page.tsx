import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Internship, BlogPost } from "@shared/schema";
import InternshipCard from "@/components/internship-card";
import BlogPostCard from "@/components/blog-post-card";
import SearchBar from "@/components/search-bar";
import { GraduationCap, Building, Search, MapPin, Clock, DollarSign, Quote } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: featuredInternships = [] } = useQuery<Internship[]>({
    queryKey: ["/api/internships"],
  });

  const { data: blogPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const handleStudentSignup = () => {
    setLocation("/auth?role=student");
  };

  const handleCompanySignup = () => {
    setLocation("/auth?role=company");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/search");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-100 via-gray-50 to-white py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gray-400 rounded-full blur-xl"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-gray-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gray-300 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gray-600 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-black tracking-tight text-gray-800 mb-4 leading-none">
                INTRN
              </h1>
              <p className="text-2xl sm:text-3xl text-gray-600 font-semibold tracking-wide">
                Bridging Dreams with Opportunities
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              India's Premier Platform for
              <span className="text-gray-600"> High School Internships</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Bridge the gap in internship opportunities! Connect with verified companies across India and gain real-world experience while building your future career.
            </p>

            {/* Dual Role CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gray-700 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={handleStudentSignup}
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                I'm a Student
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-gray-600 text-gray-700 hover:border-gray-700 hover:bg-gray-50"
                onClick={handleCompanySignup}
              >
                <Building className="mr-2 h-5 w-5" />
                I'm a Company
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700">1,200+</div>
                <div className="text-gray-500">High School Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700">85+</div>
                <div className="text-gray-500">Verified Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700">350+</div>
                <div className="text-gray-500">Successful Placements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-700">96%</div>
                <div className="text-gray-500">Safety Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-gray-50 py-16 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl border-gray-200 bg-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Find Your Perfect Internship</h2>
              <SearchBar />

              <div className="mt-6">
                <span className="text-sm text-gray-600 mr-4">Popular searches:</span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300 transition-colors bg-gray-200 text-gray-700">Technology</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300 transition-colors bg-gray-200 text-gray-700">Marketing</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300 transition-colors bg-gray-200 text-gray-700">Finance</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300 transition-colors bg-gray-200 text-gray-700">Design</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-300 transition-colors bg-gray-200 text-gray-700">Business</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Internships</h2>
            <p className="text-xl text-gray-600">Hand-picked opportunities from verified companies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInternships.slice(0, 3).map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={() => setLocation("/search")}>
              View All Internships
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How INTRN Works</h2>
            <p className="text-xl text-gray-600">Simple steps to start your internship journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-300 transition-colors">
                <GraduationCap className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">1. Choose Your Interests</h3>
              <p className="text-gray-600">Select which areas you want to work in and how long you want to work. We'll match you with relevant opportunities.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-300 transition-colors">
                <Search className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">2. Get Connected</h3>
              <p className="text-gray-600">INTRN connects you with verified companies offering internships in your areas of interest.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-300 transition-colors">
                <Building className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">3. Earn Certificate</h3>
              <p className="text-gray-600">Complete your internship, gain valuable experience, and receive a certificate. Both you and the company rate each other.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Career Insights</h2>
            <p className="text-xl text-gray-600">Expert advice to help you succeed in your internship journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button onClick={() => setLocation("/blog")}>
              Read More Articles
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Company Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Companies</h2>
            <p className="text-xl text-gray-600">Join hundreds of companies finding their next generation of talent</p>
          </div>

          {/* Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center mb-16 opacity-60">
            {["GOOGLE", "APPLE", "META", "NETFLIX", "UBER", "AIRBNB"].map((company) => (
              <div key={company} className="text-center">
                <div className="h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 font-bold text-lg">
                  {company}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                content: "Intrn has revolutionized how we find and hire interns. The quality of candidates has been exceptional, and the platform makes the entire process seamless.",
                author: "Jessica Davis",
                title: "VP of Engineering, TechCorp",
                initials: "JD"
              },
              {
                content: "The diversity and talent pool on Intrn is unmatched. We've hired some of our best full-time employees who started as interns through this platform.",
                author: "Robert Thompson", 
                title: "HR Manager, Innovation Labs",
                initials: "RT"
              },
              {
                content: "As a startup, finding talented interns quickly is crucial. Intrn's filtering system helped us find exactly the skills we needed in record time.",
                author: "Alex Liu",
                title: "CEO, StartupXYZ",
                initials: "AL"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 border border-gray-100">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <Quote className="h-8 w-8 text-primary mb-4" />
                    <p className="text-gray-700">{testimonial.content}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary font-semibold">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.author}</p>
                      <p className="text-gray-600 text-sm">{testimonial.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-700 to-gray-800 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Internship Journey?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands of high school students and companies already using INTRN to build successful careers and teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-white text-gray-800 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={handleStudentSignup}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Join as Student
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gray-600 hover:bg-gray-500 text-white border-2 border-gray-600 hover:border-gray-500"
              onClick={handleCompanySignup}
            >
              <Building className="mr-2 h-5 w-5" />
              Join as Company
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-white">INTRN</span>
              </div>
              <p className="text-gray-400 mb-4">
                Bridging the gap in internship opportunities for high school students across India, connecting them with verified companies.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Students</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Browse Internships</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Create Profile</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Resume Builder</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Career Advice</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">For Companies</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Post Internships</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Find Talent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Recruiting Solutions</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">© 2025 INTRN. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
