import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/page-transition";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./lib/protected-route";

const LandingPage = lazy(() => import("@/pages/landing-page"));
const MobileAuth = lazy(() => import("@/pages/mobile-auth"));
const DashboardPage = lazy(() => import("@/pages/dashboard-simple"));
const SearchPage = lazy(() => import("@/pages/search-page"));
const BlogPage = lazy(() => import("@/pages/blog-page"));
const BlogPostDetail = lazy(() => import("@/pages/blog-post-detail"));
const InternshipDetail = lazy(() => import("@/pages/internship-detail"));
const ApplicationSuccess = lazy(() => import("@/pages/application-success"));
const AdminPage = lazy(() => import("@/pages/admin-page"));
const AdminBackend = lazy(() => import("@/pages/admin-backend"));
const CompanyApplication = lazy(() => import("@/pages/company-application"));
const CompanySignup = lazy(() => import("@/pages/company-signup"));
const CompanyInfo = lazy(() => import("@/pages/company-info"));
const CompanyThankYou = lazy(() => import("@/pages/company-thank-you"));
const CompanyStatus = lazy(() => import("@/pages/company-status"));
const CompanyApplicationStatus = lazy(() => import("@/pages/company-application-status"));
const CompanyDashboard = lazy(() => import("@/pages/company-dashboard"));
const PlatformStatus = lazy(() => import("@/pages/platform-status"));
const OAuthSetup = lazy(() => import("@/pages/oauth-setup"));
const HelpPage = lazy(() => import("@/pages/help-page"));
const NotFound = lazy(() => import("@/pages/not-found"));
const HomePage = lazy(() => import("@/pages/home-page"));

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={null}>
        <Switch key={location}>
          <Route path="/" component={() => <PageTransition><LandingPage /></PageTransition>} />
          <Route path="/auth" component={() => <PageTransition><MobileAuth /></PageTransition>} />
          <Route path="/company-info" component={() => <PageTransition><CompanyInfo /></PageTransition>} />
          <Route path="/company-signup" component={() => <PageTransition><CompanySignup /></PageTransition>} />
          <Route path="/company-thank-you" component={() => <PageTransition><CompanyThankYou /></PageTransition>} />
          <ProtectedRoute path="/company-status" component={() => <PageTransition><CompanyStatus /></PageTransition>} />
          <ProtectedRoute path="/company-application-status" component={() => <PageTransition><CompanyApplicationStatus /></PageTransition>} />
          <ProtectedRoute path="/company-dashboard" component={() => <PageTransition><CompanyDashboard /></PageTransition>} />
          <ProtectedRoute path="/dashboard" component={() => <PageTransition><DashboardPage /></PageTransition>} />
          <Route path="/search" component={() => <PageTransition><SearchPage /></PageTransition>} />
          <Route path="/blog/:slug" component={() => <PageTransition><BlogPostDetail /></PageTransition>} />
          <Route path="/blog" component={() => <PageTransition><BlogPage /></PageTransition>} />
          <Route path="/internship/:id" component={() => <PageTransition><InternshipDetail /></PageTransition>} />
          <Route path="/application-success" component={() => <PageTransition><ApplicationSuccess /></PageTransition>} />
          <ProtectedRoute path="/admin" component={() => <PageTransition><AdminPage /></PageTransition>} />
          <Route path="/admin-backend" component={() => <PageTransition><AdminBackend /></PageTransition>} />
          <Route path="/status" component={() => <PageTransition><PlatformStatus /></PageTransition>} />
          <Route path="/oauth-setup" component={() => <PageTransition><OAuthSetup /></PageTransition>} />
          <Route path="/help" component={() => <PageTransition><HelpPage /></PageTransition>} />
          <ProtectedRoute path="/company-application" component={() => <PageTransition><CompanyApplication /></PageTransition>} />
          <Route component={() => <PageTransition><NotFound /></PageTransition>} />
        </Switch>
      </Suspense>
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
