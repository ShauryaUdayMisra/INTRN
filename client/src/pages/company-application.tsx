import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Building, Shield, FileText, MapPin, Globe, AlertTriangle } from "lucide-react";

const companyApplicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyField: z.string().min(1, "Please select a field"),
  internshipType: z.string().min(1, "Please select internship type"),
  description: z.string().min(1, "Please provide a project description"),
  website: z.string().url("Please enter a valid website URL").min(1, "Website is required"),
  location: z.string().min(1, "Location is required"),
  technicalSkills: z.string().min(1, "Please specify technical skills required"),
  otherSkills: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
});

type CompanyApplicationForm = z.infer<typeof companyApplicationSchema>;

const companyFields = [
  "Technology & Software",
  "Digital Marketing",
  "Agriculture & Sustainability",
  "Finance & Banking",
  "Healthcare & Medical",
  "Education & E-learning",
  "Manufacturing & Engineering",
  "Design & Creative",
  "Tourism & Hospitality",
  "Social Impact & NGO",
  "Media & Entertainment",
  "Retail & E-commerce",
  "Consulting & Services",
  "Food & Beverage",
  "Real Estate & Construction",
  "Other"
];

export default function CompanyApplication() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CompanyApplicationForm>({
    resolver: zodResolver(companyApplicationSchema),
    defaultValues: {
      companyName: "",
      companyField: "",
      internshipType: "",
      description: "",
      website: "",
      location: "",
      technicalSkills: "",
      otherSkills: "",
      termsAccepted: false,
    },
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async (data: CompanyApplicationForm) => {
      const response = await apiRequest("POST", "/api/company-application", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Your company application has been submitted for admin review. You'll be notified once approved.",
      });
      setLocation("/company-application-status");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanyApplicationForm) => {
    submitApplicationMutation.mutate(data);
  };

  if (!user || user.role !== "company") {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Company Application
          </h1>
          <p className="text-xl text-gray-600">
            Apply to become a verified company partner on INTRN
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" autoComplete="off">
            {/* Hidden dummy fields to confuse autofill */}
            <input type="text" name="fake_email_comp_app" autoComplete="off" style={{display: 'none'}} tabIndex={-1} />
            <input type="password" name="fake_password_comp_app" autoComplete="off" style={{display: 'none'}} tabIndex={-1} />
            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-gray-600" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your company name" autoComplete="off" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="companyField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry/Field</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companyFields.map((fieldOption) => (
                            <SelectItem key={fieldOption} value={fieldOption}>
                              {fieldOption}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the internship project you are offering to high school students..."
                          className="min-h-[120px]"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Website (Required)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your website URL" autoComplete="off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your company location" autoComplete="off" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Internship Type */}
            <Card>
              <CardHeader>
                <CardTitle>Internship Offering</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="internshipType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>How will you conduct internships?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="online" id="online" />
                            <FormLabel htmlFor="online">Online (Remote work)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="offline" id="offline" />
                            <FormLabel htmlFor="offline">Offline (In-person at office)</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="hybrid" id="hybrid" />
                            <FormLabel htmlFor="hybrid">Hybrid (Mix of online and offline)</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Technical Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="technicalSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What technical skills do you need for this internship?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please specify the technical skills required for this internship (e.g., Python, JavaScript, Marketing, Design, Content Writing, etc.)"
                          className="min-h-[100px]"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherSkills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Skills (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any other skills or requirements not mentioned above..."
                          className="min-h-[80px]"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Student Safety & Rights</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• No exploitation or unpaid overtime work</li>
                        <li>• Provide proper mentorship and learning opportunities</li>
                        <li>• Maintain a safe and respectful work environment</li>
                        <li>• Respect student academic commitments and schedules</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Company Obligations</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Provide clear internship guidelines and expectations</li>
                        <li>• Offer certificates of completion for successful interns</li>
                        <li>• Respond to student applications within 1 week</li>
                        <li>• Report any issues to INTRN platform administrators</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Platform Guidelines</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• All company information must be accurate and verified</li>
                        <li>• INTRN reserves the right to suspend accounts for violations</li>
                        <li>• Companies must comply with local labor laws</li>
                        <li>• Zero tolerance for harassment or discrimination</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          I agree to the terms and conditions above
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          By checking this box, you confirm that your company will adhere to all safety and ethical guidelines for student internships.
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gray-700 hover:bg-gray-800"
                disabled={submitApplicationMutation.isPending}
              >
                {submitApplicationMutation.isPending ? "Submitting Application..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}