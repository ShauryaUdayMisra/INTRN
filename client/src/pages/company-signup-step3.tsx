import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect } from "react";

const step3Schema = z.object({
  workArrangement: z.string().min(1, "Please select work arrangement"),
  internshipDuration: z.string().min(1, "Please select internship duration"),
  technicalSkills: z.string().min(1, "Please specify technical skills required"),
  otherSkills: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
});

type Step3Form = z.infer<typeof step3Schema>;

export default function CompanySignupStep3() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    mode: "onChange",
  });

  useEffect(() => {
    // Check if previous steps data exist
    const step1Data = sessionStorage.getItem('companySignupStep1');
    const step2Data = sessionStorage.getItem('companySignupStep2');
    if (!step1Data || !step2Data) {
      setLocation('/company-signup-step1');
    }
  }, [setLocation]);

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("/api/companies/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      // Clear stored data
      sessionStorage.removeItem('companySignupStep1');
      sessionStorage.removeItem('companySignupStep2');
      
      toast({
        title: "Registration Successful!",
        description: "Your company registration has been submitted for review.",
      });
      
      // Redirect to thank you page
      setLocation('/company-thank-you');
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error?.message || "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Step3Form) => {
    // Combine all steps data
    const step1Data = JSON.parse(sessionStorage.getItem('companySignupStep1') || '{}');
    const step2Data = JSON.parse(sessionStorage.getItem('companySignupStep2') || '{}');
    
    const completeData = {
      ...step1Data,
      ...step2Data,
      ...data,
    };

    signupMutation.mutate(completeData);
  };

  const goBack = () => {
    setLocation('/company-signup-step2');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-black">Company Registration</CardTitle>
            <p className="text-black mt-2">Step 3: Internship Program</p>
            
            <div className="mt-6">
              <Progress value={100} className="h-3" />
              <div className="flex justify-between mt-2">
                <div className="flex flex-col items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Basic Info</span>
                </div>
                <div className="flex flex-col items-center text-green-600">
                  <CheckCircle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Details</span>
                </div>
                <div className="flex flex-col items-center text-primary">
                  <CheckCircle className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Program</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="workArrangement">Work Arrangement *</Label>
                  <Select onValueChange={(value) => form.setValue("workArrangement", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work arrangement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.workArrangement && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.workArrangement.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="internshipDuration">Internship Duration *</Label>
                  <Select onValueChange={(value) => form.setValue("internshipDuration", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="2-months">2 Months</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.internshipDuration && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.internshipDuration.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="technicalSkills">Technical Skills Required *</Label>
                  <Input
                    {...form.register("technicalSkills")}
                    placeholder="e.g. Social Media, Marketing, Design, Content Writing"
                    autoComplete="off"
                    name="tech_skills_step3"
                  />
                  {form.formState.errors.technicalSkills && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.technicalSkills.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="otherSkills">Other Skills (Optional)</Label>
                  <Input
                    {...form.register("otherSkills")}
                    placeholder="Any additional skills or requirements"
                    autoComplete="off"
                    name="other_skills_step3"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={form.watch("termsAccepted")}
                    onCheckedChange={(checked) => form.setValue("termsAccepted", !!checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and confirm that all information provided is accurate.
                  </Label>
                </div>
                {form.formState.errors.termsAccepted && (
                  <p className="text-red-500 text-sm">{form.formState.errors.termsAccepted.message}</p>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Complete Registration"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}