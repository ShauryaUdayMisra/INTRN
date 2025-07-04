import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { GraduationCap, Building, Users, TrendingUp, Award, Globe } from "lucide-react";
import SocialLogin from "@/components/social-login";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
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

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  
  // Check if this is a Replit Auth demo
  const isReplitDemo = new URLSearchParams(window.location.search).get("demo") === "replit";
  
  useEffect(() => {
    if (isReplitDemo) {
      // Show demo message and clear URL parameter
      setTimeout(() => {
        window.history.replaceState({}, '', '/auth');
      }, 100);
    }
  }, [isReplitDemo]);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    if (role === "student" || role === "company") {
      registerForm.setValue("role", role);
      setActiveTab("register");
    }
  }, [registerForm]);

  const onLogin = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    // Default new users to student role for simplified signup
    registerMutation.mutate({ ...registerData, role: "student" });
  };

  if (user) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100">
      {/* Left Column - Forms */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">intrn</h1>
            </div>
            <p className="text-gray-600">Connect. Learn. Grow.</p>
            
            {isReplitDemo && (
              <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg text-blue-800 text-sm">
                <p><strong>Replit Auth Demo:</strong> This feature redirects here to show the integration capability. Use the regular sign-in below to access the platform.</p>
              </div>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...loginForm.register("username")}
                        placeholder="Enter your username"
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-sm text-red-500 mt-1">
                          {loginForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...loginForm.register("password")}
                        placeholder="Enter your password"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                  
                  <SocialLogin />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Join thousands of students and companies on intrn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <div>
                      <Label htmlFor="role">I am a</Label>
                      <Select
                        value={watchRole}
                        onValueChange={(value) => registerForm.setValue("role", value as "student" | "company")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          {...registerForm.register("username")}
                          placeholder="Choose username"
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-sm text-red-500 mt-1">
                            {registerForm.formState.errors.username.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...registerForm.register("email")}
                          placeholder="Enter email"
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {registerForm.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {watchRole === "student" ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...registerForm.register("firstName")}
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...registerForm.register("lastName")}
                            placeholder="Last name"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          {...registerForm.register("companyName")}
                          placeholder="Enter company name"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          {...registerForm.register("password")}
                          placeholder="Create password"
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {registerForm.formState.errors.password.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          {...registerForm.register("confirmPassword")}
                          placeholder="Confirm password"
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
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                  
                  <SocialLogin />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column - Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-primary to-secondary-500 flex items-center justify-center p-8 text-white">
        <div className="max-w-lg text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              {watchRole === "company" ? (
                <Building className="h-10 w-10" />
              ) : (
                <GraduationCap className="h-10 w-10" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-4">
              {watchRole === "company" 
                ? "Find Your Next Star Intern" 
                : "Launch Your Career Journey"
              }
            </h2>
            <p className="text-xl opacity-90 mb-8">
              {watchRole === "company"
                ? "Connect with talented students ready to make an impact at your company."
                : "Discover meaningful internships at top companies and kickstart your professional journey."
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">12,500+</div>
              <div className="text-sm opacity-80">
                {watchRole === "company" ? "Talented Students" : "Students Connected"}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <Building className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">850+</div>
              <div className="text-sm opacity-80">
                {watchRole === "company" ? "Partner Companies" : "Top Companies"}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm opacity-80">Success Rate</div>
            </div>

            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                <Award className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold">3,200+</div>
              <div className="text-sm opacity-80">
                {watchRole === "company" ? "Successful Hires" : "Opportunities"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
