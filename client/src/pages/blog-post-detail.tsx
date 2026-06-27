import { useSeo } from "@/hooks/use-seo";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { HamburgerNavigation } from "@/components/hamburger-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { format } from "date-fns";

function renderMarkdown(content: string): string {
  const lines = content.split("\n");
  const html: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { html.push("</ul>"); inUl = false; }
    if (inOl) { html.push("</ol>"); inOl = false; }
  };

  const inlineFormat = (text: string): string =>
    text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      closeList();
      continue;
    }

    if (/^#{1}\s/.test(trimmed)) {
      closeList();
      html.push(`<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-3">${inlineFormat(trimmed.replace(/^#\s+/, ""))}</h2>`);
      continue;
    }

    if (/^#{2}\s/.test(trimmed)) {
      closeList();
      html.push(`<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-3">${inlineFormat(trimmed.replace(/^#{2}\s+/, ""))}</h2>`);
      continue;
    }

    if (/^#{3}\s/.test(trimmed)) {
      closeList();
      html.push(`<h3 class="text-xl font-semibold text-gray-800 mt-6 mb-2">${inlineFormat(trimmed.replace(/^#{3}\s+/, ""))}</h3>`);
      continue;
    }

    if (/^#{4,}\s/.test(trimmed)) {
      closeList();
      html.push(`<h4 class="text-lg font-semibold text-gray-800 mt-4 mb-2">${inlineFormat(trimmed.replace(/^#{4,}\s+/, ""))}</h4>`);
      continue;
    }

    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (inUl) { html.push("</ul>"); inUl = false; }
      if (!inOl) { html.push('<ol class="list-decimal list-outside ml-6 space-y-1 my-3">'); inOl = true; }
      html.push(`<li class="text-gray-700">${inlineFormat(olMatch[2])}</li>`);
      continue;
    }

    if (/^[-*]\s/.test(trimmed)) {
      if (inOl) { html.push("</ol>"); inOl = false; }
      if (!inUl) { html.push('<ul class="list-disc list-outside ml-6 space-y-1 my-3">'); inUl = true; }
      html.push(`<li class="text-gray-700">${inlineFormat(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p class="text-gray-700 leading-relaxed my-3">${inlineFormat(trimmed)}</p>`);
  }

  closeList();
  return html.join("\n");
}

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error("Blog post not found");
      }
      return response.json();
    },
  });

  useSeo({
    title: post ? `${post.title} — INTRN Blog` : "INTRN Blog",
    description: post?.excerpt ?? "Career advice for high school students on INTRN.",
    ogType: "article",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HamburgerNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HamburgerNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
              <p className="text-gray-600 mb-6">
                The blog post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => setLocation("/blog")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://intrn.app/blog/${post.slug}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt,
    dateModified: post.updatedAt ?? post.createdAt,
    articleSection: post.category,
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : post.tags,
    author: { "@type": "Organization", name: "INTRN Editorial Team" },
    publisher: { "@type": "Organization", name: "INTRN" },
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HamburgerNavigation />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => setLocation("/blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Category */}
            {post.category && (
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>INTRN Editorial Team</span>
              </div>
              
              {post.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
            </div>

            {/* Content — rendered as semantic HTML from markdown */}
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles CTA */}
        <div className="mt-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            Explore More Career Insights
          </h3>
          <p className="text-gray-200 mb-4">
            Discover more articles to help you succeed in your internship journey
          </p>
          <Button 
            className="bg-white text-gray-800 hover:bg-gray-100"
            onClick={() => setLocation("/blog")}
          >
            View All Articles
          </Button>
        </div>
      </div>
    </div>
  );
}
