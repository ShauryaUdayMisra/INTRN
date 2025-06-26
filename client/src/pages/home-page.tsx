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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-white py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-secondary-500 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connect Students with
              <span className="text-primary"> Dream Internships</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The modern platform where talented students discover meaningful internships and forward-thinking companies find their next generation of leaders.
            </p>

            {/* Dual Role CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={handleStudentSignup}
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                I'm a Student
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary"
                onClick={handleCompanySignup}
              >
                <Building className="mr-2 h-5 w-5" />
                I'm a Company
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">12,500+</div>
                <div className="text-gray-600">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">850+</div>
                <div className="text-gray-600">Partner Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">3,200+</div>
                <div className="text-gray-600">Internships Posted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">89%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-16 -mt-10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">Find Your Perfect Internship</h2>
              
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">What are you looking for?</label>
                  <Input placeholder="Job title, company, or keywords" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input placeholder="City, state, or remote" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                  <Button type="submit" className="w-full">
                    <Search className="mr-2 h-4 w-4" />Search
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <span className="text-sm text-gray-600 mr-4">Popular searches:</span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">Software Engineering</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">Marketing</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">Data Science</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">Design</Badge>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200 transition-colors">Finance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Internships</h2>
            <p className="text-xl text-gray-600">Hand-picked opportunities from top companies</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to find your dream internship</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Create Your Profile</h3>
              <p className="text-gray-600">Build a compelling profile showcasing your skills, experience, and career goals. Upload your resume and portfolio.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-secondary-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-500/20 transition-colors">
                <Search className="h-8 w-8 text-secondary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Browse & Apply</h3>
              <p className="text-gray-600">Search through thousands of internships from top companies. Filter by location, field, and duration to find perfect matches.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500/20 transition-colors">
                <Building className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Get Hired</h3>
              <p className="text-gray-600">Connect directly with hiring managers, schedule interviews, and land your dream internship. We'll support you throughout the process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Career Insights</h2>
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
      <section className="bg-gradient-to-r from-primary to-secondary-500 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Internship Journey?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students and companies already using Intrn to build successful careers and teams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              onClick={handleStudentSignup}
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Join as Student
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={handleCompanySignup}
            >
              <Building className="mr-2 h-5 w-5" />
              Post Internships
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
                <span className="text-2xl font-bold text-primary">intrn</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connecting talented students with meaningful internship opportunities at leading companies worldwide.
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
              <p className="text-gray-400 text-sm">© 2023 Intrn. All rights reserved.</p>
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
