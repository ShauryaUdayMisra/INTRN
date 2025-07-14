import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Users, ArrowLeft, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

const step2Schema = z.object({
  contactName: z.string().min(2, "Contact name is required"),
  contactTitle: z.string().min(2, "Contact title is required"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().min(2, "Company location is required"),
  description: z.string().min(1, "Please provide an internship description"),
});

type Step2Form = z.infer<typeof step2Schema>;

export default function CompanySignupStep2() {
  const [, setLocation] = useLocation();

  const form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
  });

  useEffect(() => {
    // Check if step 1 data exists
    const step1Data = sessionStorage.getItem('companySignupStep1');
    if (!step1Data) {
      setLocation('/company-signup-step1');
    }
  }, [setLocation]);

  const onSubmit = (data: Step2Form) => {
    // Store data in sessionStorage and move to next step
    sessionStorage.setItem('companySignupStep2', JSON.stringify(data));
    setLocation('/company-signup-step3');
  };

  const goBack = () => {
    setLocation('/company-signup-step1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-black">Company Registration</CardTitle>
            <p className="text-black mt-2">Step 2: Company Details</p>
            
            <div className="mt-6">
              <Progress value={66} className="h-3" />
              <div className="flex justify-between mt-2">
                <div className="flex flex-col items-center text-green-600">
                  <Users className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Basic Info</span>
                </div>
                <div className="flex flex-col items-center text-primary">
                  <Users className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Details</span>
                </div>
                <div className="flex flex-col items-center text-gray-400">
                  <Users className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">Program</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="contactName">Contact Person Name *</Label>
                  <Input
                    {...form.register("contactName")}
                    placeholder="Full name of contact person"
                    autoComplete="off"
                    name="contact_name_step2"
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
                    autoComplete="off"
                    name="contact_title_step2"
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
                    autoComplete="off"
                    name="phone_number_step2"
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
                    autoComplete="off"
                    name="company_location_step2"
                  />
                  {form.formState.errors.location && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Internship Description *</Label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Brief description of the internship opportunities you offer"
                    rows={4}
                    autoComplete="off"
                    name="internship_desc_step2"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                  )}
                </div>
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
                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90"
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