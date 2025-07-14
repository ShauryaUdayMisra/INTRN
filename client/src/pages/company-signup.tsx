import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, ExternalLink } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Simple email/password signup schema
const companySignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CompanySignupForm = z.infer<typeof companySignupSchema>;

export default function CompanySignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CompanySignupForm>({
    resolver: zodResolver(companySignupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Clear all form fields on component mount to prevent autofill
  useEffect(() => {
    // Aggressive field clearing
    const clearFields = () => {
      document.querySelectorAll("input").forEach(input => {
        if (input.type !== 'submit' && input.type !== 'button' && input.type !== 'hidden') {
          input.value = "";
          input.removeAttribute('value');
        }
      });
      document.querySelectorAll("textarea").forEach(textarea => {
        textarea.value = "";
        textarea.removeAttribute('value');
      });
      document.querySelectorAll("select").forEach(select => {
        select.selectedIndex = 0;
      });
    };
    
    clearFields();
    form.reset();
    
    // Set window.onload for additional clearing
    if (typeof window !== 'undefined') {
      window.onload = () => {
        document.querySelectorAll("input").forEach(input => input.value = "");
      };
    }
  }, [form]);

  const signupMutation = useMutation({
    mutationFn: async (data: CompanySignupForm) => {
      const registrationData = {
        email: data.email,
        password: data.password,
        role: "company",
        profileComplete: false,
        username: data.email,
        firstName: "Company", // Placeholder since we don't collect this anymore
        lastName: "User",     // Placeholder since we don't collect this anymore
      };
      const response = await apiRequest("POST", "/api/register", registrationData);
      return response.json();
    },
    onSuccess: (user) => {
      // Update the auth context with the newly created user
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Open Google Form in new tab
      window.open("https://forms.gle/2JHE82ZwarXYMGdE7", "_blank");
      
      // Redirect to thank you page
      setLocation("/company-thank-you");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanySignupForm) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-3">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">intrn</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join as a Company</h2>
          <p className="text-gray-600">Connect with talented high school students</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Company Registration
            </CardTitle>
            <CardDescription>
              Create your account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
              {/* Hidden dummy fields to confuse autofill */}
              <input type="text" name="dummy1" autoComplete="username" style={{position: 'absolute', top: '-1000px', left: '-1000px'}} />
              <input type="password" name="dummy2" autoComplete="new-password" style={{position: 'absolute', top: '-1000px', left: '-1000px'}} />
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="Enter your email address"
                  autoComplete="off"
                  name="x9k4m7q2"
                  id="x9k4m7q2"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  {...form.register("password")}
                  type="password"
                  placeholder="Choose a secure password"
                  autoComplete="off"
                  name="p8w3n5t1"
                  id="p8w3n5t1"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  {...form.register("confirmPassword")}
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="off"
                  name="h7v4x8z5"
                  id="h7v4x8z5"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={signupMutation.isPending}
              >
                {signupMutation.isPending ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            {/* Google Form Information */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Next Step: Company Details</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    After creating your account, you'll be redirected to fill out your company description and internship details.
                  </p>
                  <a 
                    href="https://forms.gle/2JHE82ZwarXYMGdE7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Preview the form <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <button 
              onClick={() => setLocation("/auth")}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}