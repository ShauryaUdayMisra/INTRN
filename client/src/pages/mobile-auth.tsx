import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Building, ArrowLeft } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function MobileAuth() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  
  // Get tab from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get("tab") || "login";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate({ username: data.email, password: data.password });
  };

  const onRegister = (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    const registrationPayload = {
      ...registerData,
      username: registerData.email,
      role: "student" as const,
      location: "India",
      bio: "",
      profileComplete: false,
      skills: [],
      university: "",
      graduationYear: new Date().getFullYear() + 1,
      fieldOfStudy: "",
      hobbies: ""
    };
    registerMutation.mutate(registrationPayload);
  };

  if (user) {
    setTimeout(() => {
      if (user.role === "company") {
        setLocation("/company-dashboard");
      } else {
        setLocation("/dashboard");
      }
    }, 0);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      {/* Mobile-First Design */}
      <div className="min-h-screen flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">intrn</h1>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-8">
          <div className="w-full max-w-md">
            {/* Hero Text - Mobile Friendly */}
            <div className="text-center mb-6 lg:hidden">
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Connect. Learn. Grow.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs text-gray-600">For Students</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs text-gray-600">For Companies</p>
                </div>
              </div>
            </div>

            {/* Authentication Forms */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-sm sm:text-base py-3">Sign In</TabsTrigger>
                <TabsTrigger value="register" className="text-sm sm:text-base py-3">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600">
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...loginForm.register("email")}
                          placeholder="Enter your email"
                          className="h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
                        />
                        {loginForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {loginForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          {...loginForm.register("password")}
                          placeholder="Enter your password"
                          className="h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {loginForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-lg mt-6"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing In..." : "Sign In"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl sm:text-2xl">Create Account</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600">
                      Join thousands of students and companies on intrn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                          <Input
                            id="firstName"
                            {...registerForm.register("firstName")}
                            placeholder="First name"
                            className="h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
                          />
                          {registerForm.formState.errors.firstName && (
                            <p className="text-sm text-red-500 mt-1">
                              {registerForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                          <Input
                            id="lastName"
                            {...registerForm.register("lastName")}
                            placeholder="Last name"
                            className="h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
                          />
                          {registerForm.formState.errors.lastName && (
                            <p className="text-sm text-red-500 mt-1">
                              {registerForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registerEmail" className="text-sm font-medium text-gray-700">Email</Label>
                        <Input
                          id="registerEmail"
                          type="email"
                          {...registerForm.register("email")}
                          placeholder="Enter your email"
                          className="h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="registerPassword" className="text-sm font-medium text-gray-700">Password</Label>
                          <Input
                            id="registerPassword"
                            type="password"
                            {...registerForm.register("password")}
                            placeholder="Create password (6+ characters)"
                            className="h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
                          />
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                              {registerForm.formState.errors.password.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            {...registerForm.register("confirmPassword")}
                            placeholder="Confirm your password"
                            className="h-12 text-base border-gray-300 focus:border-primary focus:ring-primary"
                          />
                          {registerForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">
                              {registerForm.formState.errors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-lg mt-6"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Desktop Hero Section - Hidden on mobile */}
        <div className="hidden lg:block fixed right-0 top-0 w-1/2 h-full bg-gradient-to-br from-primary to-primary/80">
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-white text-center max-w-lg">
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">Welcome to intrn</h2>
              <p className="text-lg xl:text-xl mb-8">
                South Asia's premier platform connecting talented students with innovative companies
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <GraduationCap className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">For Students</h3>
                  <p className="text-sm text-white/90">Find internships that match your skills</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Building className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold mb-2">For Companies</h3>
                  <p className="text-sm text-white/90">Discover top talent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}