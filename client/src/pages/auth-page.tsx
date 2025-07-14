import { useState, useEffect } from "react";
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
import { GraduationCap, Building, Users, TrendingUp, Award, Globe } from "lucide-react";
import SocialLogin from "@/components/social-login";

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

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");
  
  // Check if this is a Replit Auth demo
  const isReplitDemo = new URLSearchParams(window.location.search).get("demo") === "replit";

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

  useEffect(() => {
    if (user) {
      // Use setTimeout to avoid state updates during render
      setTimeout(() => {
        setLocation("/dashboard");
      }, 0);
    }
  }, [user, setLocation]);

  const onLogin = (data: LoginForm) => {
    // Send email as username to backend for compatibility
    loginMutation.mutate({ username: data.email, password: data.password });
  };

  const onRegister = (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    // Use email as username and add required fields
    registerMutation.mutate({ 
      ...registerData, 
      username: registerData.email, // Use email as username
      role: "student" 
    });
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your account to access your internship journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" autoComplete="off">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        {...loginForm.register("email")}
                        placeholder="Enter email"
                        autoComplete="off"
                        name="login_email_no_autofill"
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {loginForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        {...loginForm.register("password")}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        name="login_password_no_autofill"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <SocialLogin />
                  </div>
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
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4" autoComplete="off">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          {...registerForm.register("firstName")}
                          placeholder="First name"
                          autoComplete="off"
                          name="first_name_no_autofill"
                        />
                        {registerForm.formState.errors.firstName && (
                          <p className="text-sm text-red-500 mt-1">
                            {registerForm.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          {...registerForm.register("lastName")}
                          placeholder="Last name"
                          autoComplete="off"
                          name="last_name_no_autofill"
                        />
                        {registerForm.formState.errors.lastName && (
                          <p className="text-sm text-red-500 mt-1">
                            {registerForm.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...registerForm.register("email")}
                        placeholder="Enter email"
                        autoComplete="off"
                        name="register_email_no_autofill"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          {...registerForm.register("password")}
                          placeholder="Create password"
                          autoComplete="new-password"
                          name="register_password_no_autofill"
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
                          autoComplete="new-password"
                          name="confirm_password_no_autofill"
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
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    <SocialLogin />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column - Hero Section */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <GraduationCap className="w-20 h-20 mx-auto mb-6 text-primary-100" />
            <h2 className="text-4xl font-bold mb-4">Welcome to intrn</h2>
            <p className="text-xl text-primary-100">
              South Asia's premier platform connecting talented students with innovative companies
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary-200" />
              <div className="text-center">
                <p className="text-sm text-primary-200">For Students</p>
                <p className="text-xs text-primary-300">Find internships that match your skills and interests</p>
              </div>
            </div>
            <div className="text-center">
              <Building className="w-8 h-8 mx-auto mb-2 text-primary-200" />
              <div className="text-center">
                <p className="text-sm text-primary-200">For Companies</p>
                <p className="text-xs text-primary-300">Discover and recruit top talent from across South Asia</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <TrendingUp className="w-6 h-6 mx-auto mb-1 text-primary-300" />
              <p className="text-2xl font-bold">10,000+</p>
              <p className="text-xs text-primary-300">Students</p>
            </div>
            <div>
              <Award className="w-6 h-6 mx-auto mb-1 text-primary-300" />
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-primary-300">Companies</p>
            </div>
            <div>
              <Globe className="w-6 h-6 mx-auto mb-1 text-primary-300" />
              <p className="text-2xl font-bold">95%</p>
              <p className="text-xs text-primary-300">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}