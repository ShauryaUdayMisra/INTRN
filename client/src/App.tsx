import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import SimpleAuth from "@/pages/simple-auth";
import DashboardPage from "@/pages/dashboard-simple";
import SearchPage from "@/pages/search-page";
import BlogPage from "@/pages/blog-page";
import BlogPostDetail from "@/pages/blog-post-detail";
import AdminPage from "@/pages/admin-page";
import AdminBackend from "@/pages/admin-backend";
import StudentOnboarding from "@/pages/student-onboarding";
import CompanyApplication from "@/pages/company-application";
import CompanySignup from "@/pages/company-signup";
import CompanyInfo from "@/pages/company-info";
import CompanyThankYou from "@/pages/company-thank-you";
import CompanyStatus from "@/pages/company-status";
import PlatformStatus from "@/pages/platform-status";
import OAuthSetup from "@/pages/oauth-setup";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={() => <PageTransition><LandingPage /></PageTransition>} />
        <Route path="/home" component={() => <PageTransition><HomePage /></PageTransition>} />
        <Route path="/auth" component={() => <PageTransition><SimpleAuth /></PageTransition>} />
        <Route path="/company-info" component={() => <PageTransition><CompanyInfo /></PageTransition>} />
        <Route path="/company-signup" component={() => <PageTransition><CompanySignup /></PageTransition>} />
        <Route path="/company-thank-you" component={() => <PageTransition><CompanyThankYou /></PageTransition>} />
        <ProtectedRoute path="/company-status" component={() => <PageTransition><CompanyStatus /></PageTransition>} />
        <ProtectedRoute path="/dashboard" component={() => <PageTransition><DashboardPage /></PageTransition>} />
        <ProtectedRoute path="/search" component={() => <PageTransition><SearchPage /></PageTransition>} />
        <Route path="/blog/:slug" component={() => <PageTransition><BlogPostDetail /></PageTransition>} />
        <Route path="/blog" component={() => <PageTransition><BlogPage /></PageTransition>} />
        <ProtectedRoute path="/admin" component={() => <PageTransition><AdminPage /></PageTransition>} />
        <Route path="/admin-backend" component={() => <PageTransition><AdminBackend /></PageTransition>} />
        <Route path="/status" component={() => <PageTransition><PlatformStatus /></PageTransition>} />
        <Route path="/oauth-setup" component={() => <PageTransition><OAuthSetup /></PageTransition>} />
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
