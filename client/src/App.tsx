import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import SearchPage from "@/pages/search-page";
import BlogPage from "@/pages/blog-page";
import BlogPostDetail from "@/pages/blog-post-detail";
import AdminPage from "@/pages/admin-page";
import AdminBackend from "@/pages/admin-backend";
import StudentOnboarding from "@/pages/student-onboarding";
import CompanyApplication from "@/pages/company-application";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={() => <PageTransition><HomePage /></PageTransition>} />
        <Route path="/auth" component={() => <PageTransition><AuthPage /></PageTransition>} />
        <ProtectedRoute path="/dashboard" component={() => <PageTransition><DashboardPage /></PageTransition>} />
        <ProtectedRoute path="/search" component={() => <PageTransition><SearchPage /></PageTransition>} />
        <Route path="/blog/:slug" component={() => <PageTransition><BlogPostDetail /></PageTransition>} />
        <Route path="/blog" component={() => <PageTransition><BlogPage /></PageTransition>} />
        <ProtectedRoute path="/admin" component={() => <PageTransition><AdminPage /></PageTransition>} />
        <Route path="/admin-backend" component={() => <PageTransition><AdminBackend /></PageTransition>} />
        <ProtectedRoute path="/student-onboarding" component={() => <PageTransition><StudentOnboarding /></PageTransition>} />
        <ProtectedRoute path="/company-application" component={() => <PageTransition><CompanyApplication /></PageTransition>} />
        <Route component={() => <PageTransition><NotFound /></PageTransition>} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
