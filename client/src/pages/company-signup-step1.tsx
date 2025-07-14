import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Building2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

const step1Schema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  website: z.string().min(1, "Website is required").refine((url) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  }, "Please enter a valid website URL"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Step1Form = z.infer<typeof step1Schema>;

export default function CompanySignupStep1() {
  const [, setLocation] = useLocation();

  const form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
  });

  const onSubmit = (data: Step1Form) => {
    console.log('Form submission data:', data);
    console.log('Form errors:', form.formState.errors);
    
    // Store data in sessionStorage and move to next step
    sessionStorage.setItem('companySignupStep1', JSON.stringify(data));
    setLocation('/company-signup-step2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-black">Company Registration</CardTitle>
            <p className="text-black mt-2">Step 1: Basic Information</p>
            
            <div className="mt-6">
              <Progress value={33} className="h-3" />
              <div className="flex justify-between mt-2">
                <div className="flex flex-col items-center text-primary">
                  <Building2 className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Basic Info</span>
                </div>
                <div className="flex flex-col items-center text-gray-400">
                  <Building2 className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Details</span>
                </div>
                <div className="flex flex-col items-center text-gray-400">
                  <Building2 className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Program</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    {...form.register("companyName")}
                    placeholder="Your company name"
                    autoComplete="off"
                    name="comp_name_step1"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    {...form.register("email")}
                    type="email"
                    placeholder="Your email address"
                    autoComplete="off"
                    name="comp_email_step1"
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
                    autoComplete="new-password"
                    name="comp_password_step1"
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
                    autoComplete="new-password"
                    name="comp_confirm_step1"
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="website">Website *</Label>
                  <Input
                    {...form.register("website")}
                    placeholder="Your company website"
                    autoComplete="off"
                    name="comp_website_step1"
                  />
                  {form.formState.errors.website && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.website.message}</p>
                  )}
                </div>
              </div>

              {/* Debug info - remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
                  <div>Form Valid: {form.formState.isValid ? 'Yes' : 'No'}</div>
                  <div>Errors: {JSON.stringify(form.formState.errors, null, 2)}</div>
                  <div>Values: {JSON.stringify(form.getValues(), null, 2)}</div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/')}
                  className="flex items-center space-x-2"
                >
                  <span>Cancel</span>
                </Button>

                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}