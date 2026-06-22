import { useSeo } from "@/hooks/use-seo";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  useSeo({ title: "Page Not Found — INTRN", noIndex: true });
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <GraduationCap className="h-16 w-16 text-purple-300 mb-6" />
      <h1 className="text-8xl font-bold text-purple-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">Page not found</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Oops — we couldn't find that page. It may have moved or the link might be wrong.
      </p>
      <Link to="/">
        <Button className="bg-purple-600 hover:bg-purple-700 px-8">Back to Home</Button>
      </Link>
    </div>
  );
}
