import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@shared/schema";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [, setLocation] = useLocation();
  
  const handleReadMore = () => {
    console.log("Navigate to blog post:", post.slug);
    setLocation(`/blog/${post.slug}`);
  };

  return (
    <Card className="bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* White thumbnail with purple text and outline */}
      <div className="relative h-48 bg-white border-2 border-primary overflow-hidden flex items-center justify-center p-6">
        <h3 className="text-primary text-xl font-bold text-center leading-tight group-hover:scale-105 transition-transform duration-300">
          {post.title}
        </h3>
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
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
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
