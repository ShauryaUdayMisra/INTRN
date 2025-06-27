import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
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
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/search" component={SearchPage} />
      <Route path="/blog/:slug" component={BlogPostDetail} />
      <Route path="/blog" component={BlogPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route path="/admin-backend" component={AdminBackend} />
      <ProtectedRoute path="/student-onboarding" component={StudentOnboarding} />
      <ProtectedRoute path="/company-application" component={CompanyApplication} />
      <Route component={NotFound} />
    </Switch>
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
