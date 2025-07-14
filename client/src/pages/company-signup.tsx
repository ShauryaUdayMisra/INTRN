import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Simplified 3-step form schema
const companySignupSchema = z.object({
  // Step 1: Basic Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  website: z.string().url("Please enter a valid website URL").min(1, "Website is required"),
  
  // Step 2: Company Details
  contactName: z.string().min(2, "Contact name is required"),
  contactTitle: z.string().min(2, "Contact title is required"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(2, "Company location is required"),
  description: z.string().min(1, "Please provide an internship description"),
  
  // Step 3: Internship Details
  workArrangement: z.string().min(1, "Please select work arrangement"),
  internshipDuration: z.string().min(1, "Please select internship duration"),
  technicalSkills: z.string().min(1, "Please specify technical skills required"),
  otherSkills: z.string().optional(),
  
  // Agreement
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CompanySignupForm = z.infer<typeof companySignupSchema>;

const STEPS = [
  { id: 1, title: "Basic Information", icon: Building2 },
  { id: 2, title: "Company Details", icon: Users },
  { id: 3, title: "Internship Program", icon: CheckCircle },
];

const TECHNICAL_SKILLS = [
  "Social Media", "Marketing", "Design", "Content Writing", "Customer Service", 
  "Data Entry", "Microsoft Office", "Google Workspace", "Photography", 
  "Video Editing", "Canva Design", "Basic Programming", "Web Development"
];

const LOCATIONS = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Pune", "Hyderabad", 
  "Kolkata", "Ahmedabad", "Dhaka", "Karachi", "Lahore", "Colombo"
];

export default function CompanySignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CompanySignupForm>({
    resolver: zodResolver(companySignupSchema),
    mode: "onChange",
    defaultValues: {
      technicalSkills: "",
      otherSkills: "",
      termsAccepted: false,
    },
  });

  // Clear all form fields on component mount to prevent autofill
  useEffect(() => {
    // Clear all input fields
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input: any) => {
      if (input.type !== 'submit' && input.type !== 'button') {
        input.value = '';
        input.defaultValue = '';
        if (input.tagName === 'SELECT') {
          input.selectedIndex = 0;
        }
      }
    });
    
    // Reset form to ensure controlled components are cleared
    form.reset();
  }, [form]);

  const signupMutation = useMutation({
    mutationFn: async (data: CompanySignupForm) => {
      const registrationData = {
        ...data,
        role: "company",
        profileComplete: false,
        username: data.email,
      };
      const response = await apiRequest("POST", "/api/register", registrationData);
      return response.json();
    },
    onSuccess: (user) => {
      // Update the auth context with the newly created user
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
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
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      signupMutation.mutate(data);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                {...form.register("companyName")}
                placeholder="Your company name"
                autoComplete="new-organization"
                name="step1_biz_entity_xyz123"
                id="step1-biz-entity"
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
                autoComplete="new-email-address"
                name="step1_contact_addr_abc789"
                id="step1-contact-addr"
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
                autoComplete="new-password-primary"
                name="step1_secret_key_def456"
                id="step1-secret-key"
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
                autoComplete="new-password-confirm"
                name="step1_verify_key_ghi789"
                id="step1-verify-key"
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="website">Website (Required)</Label>
              <Input
                {...form.register("website")}
                placeholder="Your company website"
                autoComplete="new-url"
                name="step1_web_portal_jkl012"
                id="step1-web-portal"
              />
              {form.formState.errors.website && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.website.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="contactName">Contact Person Name *</Label>
              <Input
                {...form.register("contactName")}
                placeholder="Full name of contact person"
                autoComplete="new-name"
                name="step2_rep_person_mno345"
                id="step2-rep-person"
              />
              {form.formState.errors.contactName && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactTitle">Contact Person Title *</Label>
              <Input
                {...form.register("contactTitle")}
                placeholder="e.g. HR Manager, Founder, etc."
                autoComplete="new-organization-title"
                name="step2_job_role_pqr678"
                id="step2-job-role"
              />
              {form.formState.errors.contactTitle && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactTitle.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                {...form.register("phoneNumber")}
                placeholder="Your phone number"
                autoComplete="new-tel"
                name="step2_phone_digits_stu901"
                id="step2-phone-digits"
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Company Location *</Label>
              <Input
                {...form.register("location")}
                placeholder="Your company location"
                autoComplete="new-address-level2"
                name="step2_office_addr_vwx234"
                id="step2-office-addr"
              />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="internship-desc">Internship Description *</Label>
              <Textarea
                {...form.register("description")}
                placeholder="Describe the internship opportunity and what students will learn"
                rows={4}
                autoComplete="new-description"
                name="step2_program_desc_yza567"
                id="step2-program-desc"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="workArrangement">Work Arrangement *</Label>
              <Select onValueChange={(value) => form.setValue("workArrangement", value)}>
                <SelectTrigger autoComplete="new-select-option" name="step3_work_type_bcd890" id="step3-work-type">
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
                <SelectTrigger autoComplete="new-duration" name="step3_time_span_efg123" id="step3-time-span">
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
              <Textarea
                {...form.register("technicalSkills")}
                placeholder="Please specify the technical skills required for internships (e.g., Social Media, Marketing, Design, Content Writing, etc.)"
                rows={3}
                autoComplete="new-skills"
                name="step3_tech_abilities_hij456"
                id="step3-tech-abilities"
              />
              {form.formState.errors.technicalSkills && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.technicalSkills.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="otherSkills">Other Skills (Optional)</Label>
              <Textarea
                {...form.register("otherSkills")}
                placeholder="Any other skills or requirements not mentioned above..."
                rows={2}
                autoComplete="new-other-skills"
                name="step3_extra_needs_klm789"
                id="step3-extra-needs"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={form.watch("termsAccepted")}
                onCheckedChange={(checked) => form.setValue("termsAccepted", !!checked)}
              />
              <Label className="text-sm">
                I accept the terms and conditions and confirm that all information provided is accurate
              </Label>
            </div>
            {form.formState.errors.termsAccepted && (
              <p className="text-red-500 text-sm">{form.formState.errors.termsAccepted.message}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-black">Company Registration</CardTitle>
            <p className="text-black mt-2">Join our platform and connect with talented high school students</p>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between mt-2">
                {STEPS.map((step) => (
                  <div key={step.id} className={`flex flex-col items-center ${currentStep >= step.id ? 'text-primary' : 'text-gray-400'}`}>
                    <step.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
              {/* Hidden dummy fields to confuse autofill */}
              <input type="text" style={{display: 'none'}} autoComplete="username" tabIndex={-1} />
              <input type="password" style={{display: 'none'}} autoComplete="current-password" tabIndex={-1} />
              <input type="email" style={{display: 'none'}} autoComplete="email" tabIndex={-1} />
              
              {renderStepContent()}

              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={goToNextStep}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {signupMutation.isPending ? "Creating Account..." : "Complete Registration"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}