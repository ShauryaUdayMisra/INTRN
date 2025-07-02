import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, MapPin, Clock, FileText, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Multi-step form schema
const companySignupSchema = z.object({
  // Basic Company Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  foundedYear: z.number().min(1800).max(new Date().getFullYear()),
  
  // Contact Information
  contactName: z.string().min(2, "Contact name is required"),
  contactTitle: z.string().min(2, "Contact title is required"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  
  // Company Details
  industryType: z.string().min(1, "Please select an industry type"),
  companySize: z.string().min(1, "Please select company size"),
  location: z.string().min(2, "Company location is required"),
  description: z.string().min(50, "Please provide a detailed company description (minimum 50 characters)"),
  
  // Internship Program Details
  workArrangement: z.string().min(1, "Please select work arrangement"),
  internshipDuration: z.string().min(1, "Please select internship duration"),
  stipendRange: z.string().min(1, "Please select stipend range"),
  mentorshipProgram: z.boolean(),
  trainingProvided: z.boolean(),
  
  // Skills and Requirements
  technicalSkills: z.array(z.string()).min(1, "Please select at least one technical skill"),
  softSkills: z.array(z.string()).min(1, "Please select at least one soft skill"),
  educationLevel: z.string().min(1, "Please select minimum education level"),
  
  // Support and Resources
  dedicatedMentor: z.boolean(),
  structuredProgram: z.boolean(),
  certificateProvided: z.boolean(),
  networkingOpportunities: z.boolean(),
  
  // Verification Documents
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  companyRegistration: z.string().optional(),
  
  // Agreement
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  accurateInfoConfirmed: z.boolean().refine(val => val === true, "You must confirm the information is accurate"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CompanySignupForm = z.infer<typeof companySignupSchema>;

const STEPS = [
  { id: 1, title: "Basic Information", icon: Building2 },
  { id: 2, title: "Contact Details", icon: Users },
  { id: 3, title: "Company Profile", icon: FileText },
  { id: 4, title: "Internship Program", icon: Clock },
  { id: 5, title: "Requirements", icon: CheckCircle },
];

export default function CompanySignup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CompanySignupForm>({
    resolver: zodResolver(companySignupSchema),
    defaultValues: {
      technicalSkills: [],
      softSkills: [],
      mentorshipProgram: false,
      trainingProvided: false,
      dedicatedMentor: false,
      structuredProgram: false,
      certificateProvided: false,
      networkingOpportunities: false,
      termsAccepted: false,
      accurateInfoConfirmed: false,
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: CompanySignupForm) => {
      const registrationData = {
        ...data,
        role: "company",
        profileComplete: false,
        username: data.email, // Use email as username for companies
      };
      const response = await apiRequest("POST", "/api/register", registrationData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful!",
        description: "Your company registration has been submitted for review. You'll receive an email confirmation shortly.",
      });
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const progress = (currentStep / STEPS.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: CompanySignupForm) => {
    signupMutation.mutate(data);
  };

  const getFieldsForStep = (step: number): (keyof CompanySignupForm)[] => {
    switch (step) {
      case 1:
        return ["companyName", "email", "password", "confirmPassword", "website", "foundedYear"];
      case 2:
        return ["contactName", "contactTitle", "phoneNumber"];
      case 3:
        return ["industryType", "companySize", "location", "description"];
      case 4:
        return ["workArrangement", "internshipDuration", "stipendRange"];
      case 5:
        return ["technicalSkills", "softSkills", "educationLevel", "termsAccepted", "accurateInfoConfirmed"];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  {...form.register("companyName")}
                  placeholder="Enter your company name"
                />
                {form.formState.errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.companyName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="company@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="Create a strong password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...form.register("confirmPassword")}
                  placeholder="Confirm your password"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Company Website</Label>
                <Input
                  id="website"
                  {...form.register("website")}
                  placeholder="https://www.yourcompany.com"
                />
                {form.formState.errors.website && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.website.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="foundedYear">Founded Year *</Label>
                <Input
                  id="foundedYear"
                  type="number"
                  {...form.register("foundedYear", { valueAsNumber: true })}
                  placeholder="2020"
                />
                {form.formState.errors.foundedYear && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.foundedYear.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Primary Contact Name *</Label>
                <Input
                  id="contactName"
                  {...form.register("contactName")}
                  placeholder="John Smith"
                />
                {form.formState.errors.contactName && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.contactName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="contactTitle">Contact Title/Position *</Label>
                <Input
                  id="contactTitle"
                  {...form.register("contactTitle")}
                  placeholder="HR Manager, CEO, Recruiter"
                />
                {form.formState.errors.contactTitle && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.contactTitle.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                {...form.register("phoneNumber")}
                placeholder="+91 98765 43210"
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industryType">Industry Type *</Label>
                <Select onValueChange={(value) => form.setValue("industryType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology & Software</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare">Healthcare & Pharmaceuticals</SelectItem>
                    <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="education">Education & EdTech</SelectItem>
                    <SelectItem value="media">Media & Entertainment</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.industryType && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.industryType.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="companySize">Company Size *</Label>
                <Select onValueChange={(value) => form.setValue("companySize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                    <SelectItem value="small">Small (11-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                    <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.companySize && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.companySize.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Company Location *</Label>
              <Input
                id="location"
                {...form.register("location")}
                placeholder="Mumbai, India"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Company Description *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Tell us about your company, what you do, your mission, and what makes you unique..."
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Work Arrangement *</Label>
              <RadioGroup onValueChange={(value) => form.setValue("workArrangement", value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="onsite" id="onsite" />
                  <Label htmlFor="onsite">On-site (Office-based)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="remote" id="remote" />
                  <Label htmlFor="remote">Remote (Work from home)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hybrid" id="hybrid" />
                  <Label htmlFor="hybrid">Hybrid (Mix of office and remote)</Label>
                </div>
              </RadioGroup>
              {form.formState.errors.workArrangement && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.workArrangement.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="12-months">12 Months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="stipendRange">Monthly Stipend Range *</Label>
                <Select onValueChange={(value) => form.setValue("stipendRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stipend range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Unpaid (Certificate only)</SelectItem>
                    <SelectItem value="5000-10000">₹5,000 - ₹10,000</SelectItem>
                    <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                    <SelectItem value="20000-30000">₹20,000 - ₹30,000</SelectItem>
                    <SelectItem value="30000+">₹30,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Program Features</Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mentorshipProgram"
                    checked={form.watch("mentorshipProgram")}
                    onCheckedChange={(checked) => form.setValue("mentorshipProgram", checked as boolean)}
                  />
                  <Label htmlFor="mentorshipProgram">Dedicated mentorship program</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trainingProvided"
                    checked={form.watch("trainingProvided")}
                    onCheckedChange={(checked) => form.setValue("trainingProvided", checked as boolean)}
                  />
                  <Label htmlFor="trainingProvided">Structured training sessions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dedicatedMentor"
                    checked={form.watch("dedicatedMentor")}
                    onCheckedChange={(checked) => form.setValue("dedicatedMentor", checked as boolean)}
                  />
                  <Label htmlFor="dedicatedMentor">One-on-one mentor assigned</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="structuredProgram"
                    checked={form.watch("structuredProgram")}
                    onCheckedChange={(checked) => form.setValue("structuredProgram", checked as boolean)}
                  />
                  <Label htmlFor="structuredProgram">Structured learning path</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificateProvided"
                    checked={form.watch("certificateProvided")}
                    onCheckedChange={(checked) => form.setValue("certificateProvided", checked as boolean)}
                  />
                  <Label htmlFor="certificateProvided">Certificate of completion</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="networkingOpportunities"
                    checked={form.watch("networkingOpportunities")}
                    onCheckedChange={(checked) => form.setValue("networkingOpportunities", checked as boolean)}
                  />
                  <Label htmlFor="networkingOpportunities">Networking opportunities</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Technical Skills Required *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "HTML/CSS", "Machine Learning", "Data Analysis", "Mobile Development", "UI/UX Design", "Digital Marketing"].map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={form.watch("technicalSkills").includes(skill)}
                      onCheckedChange={(checked) => {
                        const current = form.getValues("technicalSkills");
                        if (checked) {
                          form.setValue("technicalSkills", [...current, skill]);
                        } else {
                          form.setValue("technicalSkills", current.filter(s => s !== skill));
                        }
                      }}
                    />
                    <Label htmlFor={skill} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
              {form.formState.errors.technicalSkills && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.technicalSkills.message}</p>
              )}
            </div>

            <div>
              <Label>Soft Skills Required *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {["Communication", "Teamwork", "Problem Solving", "Leadership", "Time Management", "Adaptability", "Critical Thinking", "Creativity", "Attention to Detail"].map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={form.watch("softSkills").includes(skill)}
                      onCheckedChange={(checked) => {
                        const current = form.getValues("softSkills");
                        if (checked) {
                          form.setValue("softSkills", [...current, skill]);
                        } else {
                          form.setValue("softSkills", current.filter(s => s !== skill));
                        }
                      }}
                    />
                    <Label htmlFor={skill} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
              {form.formState.errors.softSkills && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.softSkills.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="educationLevel">Minimum Education Level *</Label>
              <Select onValueChange={(value) => form.setValue("educationLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School (12th Grade)</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="any">Any Education Level</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={form.watch("termsAccepted")}
                  onCheckedChange={(checked) => form.setValue("termsAccepted", checked as boolean)}
                />
                <Label htmlFor="termsAccepted" className="text-sm">
                  I accept the Terms and Conditions and Privacy Policy *
                </Label>
              </div>
              {form.formState.errors.termsAccepted && (
                <p className="text-sm text-red-600">{form.formState.errors.termsAccepted.message}</p>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="accurateInfoConfirmed"
                  checked={form.watch("accurateInfoConfirmed")}
                  onCheckedChange={(checked) => form.setValue("accurateInfoConfirmed", checked as boolean)}
                />
                <Label htmlFor="accurateInfoConfirmed" className="text-sm">
                  I confirm that all information provided is accurate and complete *
                </Label>
              </div>
              {form.formState.errors.accurateInfoConfirmed && (
                <p className="text-sm text-red-600">{form.formState.errors.accurateInfoConfirmed.message}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Registration</h1>
          <p className="text-gray-600">Join INTRN to connect with talented interns from across South Asia</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    currentStep >= step.id ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep >= step.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <span className="text-xs mt-2 text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-4">
                  {currentStep < STEPS.length ? (
                    <Button type="button" onClick={nextStep}>
                      Next Step
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={signupMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {signupMutation.isPending ? "Submitting..." : "Complete Registration"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}