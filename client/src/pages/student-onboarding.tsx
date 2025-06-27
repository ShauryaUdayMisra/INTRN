import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, Code, Briefcase, Palette, Camera, Users, Music, BookOpen, GamepadIcon, MapPin } from "lucide-react";

const onboardingSchema = z.object({
  hobbies: z.array(z.string()).min(1, "Please select at least one hobby"),
  interestedFields: z.array(z.string()).min(1, "Please select at least one field of interest"),
  internshipDuration: z.string().min(1, "Please select internship duration"),
  preferredCompanies: z.array(z.string()).min(1, "Please select at least one company"),
  location: z.string().min(1, "Please enter your location"),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const hobbiesOptions = [
  { id: "coding", label: "Coding & Programming", icon: Code },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "music", label: "Music & Arts", icon: Music },
  { id: "sports", label: "Sports & Fitness", icon: Heart },
  { id: "reading", label: "Reading & Writing", icon: BookOpen },
  { id: "gaming", label: "Gaming", icon: GamepadIcon },
  { id: "socialwork", label: "Social Work", icon: Users },
  { id: "design", label: "Design & Creative", icon: Palette },
];

const fieldsOptions = [
  "Technology & Software",
  "Digital Marketing",
  "Content Creation",
  "Business & Finance",
  "Design & Creative",
  "Agriculture & Sustainability",
  "Healthcare & Medical",
  "Education & Teaching",
  "Tourism & Hospitality",
  "Manufacturing & Engineering",
  "Social Impact & NGO",
  "Media & Entertainment"
];

const companiesOptions = [
  { name: "TechCorp Solutions", field: "Technology", type: "Online" },
  { name: "Green Agri Innovations", field: "Agriculture", type: "Offline" },
  { name: "Creative Studios Mumbai", field: "Design", type: "Hybrid" },
  { name: "FinanceFirst", field: "Finance", type: "Online" },
  { name: "EduTech Learning", field: "Education", type: "Online" },
  { name: "MedCare Health", field: "Healthcare", type: "Offline" },
  { name: "Social Impact India", field: "NGO", type: "Hybrid" },
  { name: "Digital Marketing Pro", field: "Marketing", type: "Online" },
  { name: "Bangalore Engineering Co", field: "Engineering", type: "Offline" },
  { name: "Tourism India Ltd", field: "Tourism", type: "Hybrid" },
];

export default function StudentOnboarding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      hobbies: [],
      interestedFields: [],
      internshipDuration: "",
      preferredCompanies: [],
      location: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: OnboardingForm) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile Updated!",
        description: "Welcome to INTRN! You can now explore internships.",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OnboardingForm) => {
    updateProfileMutation.mutate(data);
  };

  if (!user || user.role !== "student") {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to INTRN!
          </h1>
          <p className="text-xl text-gray-600">
            Let's personalize your internship journey by learning more about you
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Hobbies Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-gray-600" />
                  What are your hobbies and interests?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="hobbies"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {hobbiesOptions.map((hobby) => (
                          <FormField
                            key={hobby.id}
                            control={form.control}
                            name="hobbies"
                            render={({ field }) => {
                              const Icon = hobby.icon;
                              return (
                                <FormItem
                                  key={hobby.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(hobby.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, hobby.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== hobby.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                                    <Icon className="h-4 w-4" />
                                    {hobby.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Fields of Interest Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-gray-600" />
                  Which fields interest you for internships?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="interestedFields"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {fieldsOptions.map((field) => (
                          <FormField
                            key={field}
                            control={form.control}
                            name="interestedFields"
                            render={({ field: formField }) => {
                              return (
                                <FormItem
                                  key={field}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={formField.value?.includes(field)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? formField.onChange([...formField.value, field])
                                          : formField.onChange(
                                              formField.value?.filter(
                                                (value) => value !== field
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal cursor-pointer">
                                    {field}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Duration Section */}
            <Card>
              <CardHeader>
                <CardTitle>How long would you like to intern?</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="internshipDuration"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-3-months" id="1-3-months" />
                            <FormLabel htmlFor="1-3-months">1-3 months</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3-6-months" id="3-6-months" />
                            <FormLabel htmlFor="3-6-months">3-6 months</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6-plus-months" id="6-plus-months" />
                            <FormLabel htmlFor="6-plus-months">6+ months</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Company Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Which companies interest you?</CardTitle>
                <p className="text-sm text-gray-600">Select companies you'd like to work with</p>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="preferredCompanies"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {companiesOptions.map((company) => (
                          <FormField
                            key={company.name}
                            control={form.control}
                            name="preferredCompanies"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={company.name}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(company.name)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, company.name])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== company.name
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex-1">
                                    <FormLabel className="text-sm font-medium cursor-pointer">
                                      {company.name}
                                    </FormLabel>
                                    <div className="flex gap-2 mt-1">
                                      <Badge variant="secondary" className="text-xs">
                                        {company.field}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {company.type}
                                      </Badge>
                                    </div>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  What's your location?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="e.g., Mumbai, Maharashtra"
                          {...field}
                        />
                      </FormControl>
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
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Setting up your profile..." : "Complete Setup"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}