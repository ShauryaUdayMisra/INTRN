import { HamburgerNavigation } from "@/components/hamburger-navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Mail, Phone, MessageCircle, Book, User, Search } from "lucide-react";

export default function HelpPage() {
  const handleEmailSupport = () => {
    window.location.href = "mailto:intrnxyz@gmail.com";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <HamburgerNavigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black mb-4">Help & Support</h1>
            <p className="text-lg text-gray-600">Get the assistance you need to make the most of your internship journey</p>
          </div>

          {/* Contact Support Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Mail className="w-6 h-6 mr-2 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>Need help? Our team is here to assist you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  For any questions, technical issues, or assistance with your internship applications, 
                  please contact our support team:
                </p>
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span className="font-medium text-black">intrnxyz@gmail.com</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    We typically respond within 24 hours during business days
                  </p>
                </div>
                <Button onClick={handleEmailSupport} className="w-full sm:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <User className="w-5 h-5 mr-2 text-primary" />
                  For Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">How do I apply for internships?</h4>
                    <p className="text-sm text-gray-600">Browse available internships, click on ones that interest you, and submit your application with a cover letter.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">How do I update my profile?</h4>
                    <p className="text-sm text-gray-600">Go to "Edit Profile" from your dashboard to update your skills, experience, and preferences.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">How do I track my applications?</h4>
                    <p className="text-sm text-gray-600">Check your dashboard's "My Applications" section to see the status of all your applications.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Search className="w-5 h-5 mr-2 text-primary" />
                  For Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-black">How do I post an internship?</h4>
                    <p className="text-sm text-gray-600">Register as a company, complete your profile, and use the "Post Internship" feature from your dashboard.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">How do I review applications?</h4>
                    <p className="text-sm text-gray-600">Access your company dashboard to view and manage all applications for your internship postings.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-black">How do I verify my company?</h4>
                    <p className="text-sm text-gray-600">Complete the company application process with accurate information. Our team will review and verify your account.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Book className="w-5 h-5 mr-2 text-primary" />
                Quick Help
              </CardTitle>
              <CardDescription>Common issues and solutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Login Issues</h4>
                  <p className="text-sm text-gray-600 mb-3">Can't access your account? Try resetting your password or contact support.</p>
                  <Button variant="outline" size="sm" onClick={handleEmailSupport}>
                    Get Help
                  </Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Application Status</h4>
                  <p className="text-sm text-gray-600 mb-3">Questions about your application status? Check your dashboard or contact us.</p>
                  <Button variant="outline" size="sm" onClick={handleEmailSupport}>
                    Ask Support
                  </Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Profile Issues</h4>
                  <p className="text-sm text-gray-600 mb-3">Need help updating your profile or adding skills? We're here to help.</p>
                  <Button variant="outline" size="sm" onClick={handleEmailSupport}>
                    Contact Us
                  </Button>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-black mb-2">Technical Problems</h4>
                  <p className="text-sm text-gray-600 mb-3">Experiencing bugs or technical issues? Report them to our team.</p>
                  <Button variant="outline" size="sm" onClick={handleEmailSupport}>
                    Report Issue
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Tips */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-700">Complete your profile with detailed skills and experience to attract more opportunities</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-700">Write personalized cover letters for each application to stand out</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-700">Check the blog section regularly for career advice and industry insights</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-700">Follow up professionally on your applications when appropriate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}