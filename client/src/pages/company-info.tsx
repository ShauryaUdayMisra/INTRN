import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function CompanyInfo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-black mb-6">
            Host an intern with <span className="text-primary">intrn</span>
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            intrn is a student-run platform connecting top high schoolers with real-world internships.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-6">
              smart, motivated high schoolers want to work with you.
            </h2>
            <p className="text-xl text-black">
              we make it easy to list a real project and get matched fast.
            </p>
          </div>

          {/* Why It Works */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-black mb-8 text-center">why it works</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-black text-lg">top students, no busywork</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-black text-lg">simple onboarding – no HR overhead</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-black text-lg">remote, hybrid, or in-person</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-black text-lg">great early brand + real impact</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <p className="text-2xl font-bold text-black">
              you bring the project. we bring the talent.
            </p>
            <div className="border-t border-gray-300 my-8 max-w-md mx-auto"></div>
          </div>

          {/* Steps */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-black mb-8 text-center">
              🚀 list in 3 quick steps
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <p className="text-black text-lg pt-1">fill the short form</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <p className="text-black text-lg pt-1">we list your project</p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <p className="text-black text-lg pt-1">students apply. you choose.</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white text-xl px-12 py-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => setLocation("/company-signup")}
            >
              start your journey
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}