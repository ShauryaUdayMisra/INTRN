import Navigation from "@/components/navigation";
import BlogPostCard from "@/components/blog-post-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Search, BookOpen } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function BlogPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const categories = [...new Set(blogPosts.map(post => post.category).filter(Boolean))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory && post.published;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Insights & Advice</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guidance, industry insights, and success stories to help you navigate your internship journey.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                      alt="Featured article"
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center mb-3">
                      <Badge>{filteredPosts[0].category}</Badge>
                      <span className="text-gray-500 text-sm ml-4">
                        {new Date(filteredPosts[0].createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {filteredPosts[0].title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {filteredPosts[0].excerpt}
                    </p>
                    <Button>Read Full Article</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Blog Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or browse different categories.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(1).map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-primary to-secondary-500 text-white">
            <CardContent className="p-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Get the latest career advice, industry insights, and internship opportunities delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white text-gray-900"
                />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
