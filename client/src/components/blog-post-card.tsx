import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@shared/schema";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
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

          <div className="flex items-center justify-end">
            <span className="text-primary text-sm font-medium flex items-center gap-1">
              Read More
              <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
