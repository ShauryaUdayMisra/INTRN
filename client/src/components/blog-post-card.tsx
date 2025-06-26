import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@shared/schema";
import { Calendar, User, ArrowRight } from "lucide-react";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const handleReadMore = () => {
    // Navigate to full blog post - would implement routing here
    console.log("Navigate to blog post:", post.slug);
  };

  return (
    <Card className="bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Blog post image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary-500/10 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          {post.category && (
            <Badge 
              variant="secondary" 
              className={`text-xs font-medium ${
                post.category === "Career Tips" ? "bg-primary/10 text-primary" :
                post.category === "Industry Insights" ? "bg-secondary-500/10 text-secondary-500" :
                post.category === "Success Stories" ? "bg-green-500/10 text-green-600" :
                "bg-gray-100 text-gray-700"
              }`}
            >
              {post.category}
            </Badge>
          )}
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {post.excerpt || post.content.substring(0, 150) + "..."}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Author</p>
              <p className="text-xs text-gray-500">Career Expert</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReadMore}
            className="text-primary hover:text-primary/80"
          >
            Read More
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
