import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function CompanyInfo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-black mb-4 sm:mb-6">
            Welcome to <span className="text-primary">INTRN</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-black max-w-2xl mx-auto px-4">
            — we're excited to have you on board.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 lg:p-12 mb-8 sm:mb-12">
          <div className="text-left mb-8 sm:mb-12">
            <p className="text-sm sm:text-base lg:text-lg text-black mb-4 sm:mb-6 leading-relaxed">
              You've just taken the first step toward hosting an intern who's smart, motivated, and ready to contribute. INTRN is a student-run platform built to connect companies like yours with high-performing high school students looking for real-world experience.
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-black mb-4 sm:mb-6 leading-relaxed">
              These are not your average interns. Our students are curious, capable, and eager to take on meaningful work — not just busywork. Whether you need help with research, marketing, content, product ideas, or design, there's a student out there ready to jump in.
            </p>
          </div>

          {/* Why Companies Choose INTRN */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-6 sm:mb-8">Why companies choose INTRN:</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-black text-sm sm:text-base lg:text-lg"><strong>Top talent</strong> – we handpick students who are serious about learning and working hard</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-black text-sm sm:text-base lg:text-lg"><strong>No HR hassle</strong> – the process is quick and smooth, with zero overhead</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-black text-sm sm:text-base lg:text-lg"><strong>Flexible internships</strong> – host remotely, in-person, or hybrid</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-black text-sm sm:text-base lg:text-lg"><strong>Real impact</strong> – students work on actual projects and deliver real results</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-black text-sm sm:text-base lg:text-lg"><strong>Build early loyalty</strong> – leave a lasting impression on future leaders</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
              You bring the project. We bring the talent.
            </p>
            <div className="border-t border-gray-300 my-6 sm:my-8 max-w-md mx-auto"></div>
          </div>

          {/* Steps */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-black mb-6 sm:mb-8">
              🚀 How to get started (it's super simple):
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0">
                  1
                </div>
                <p className="text-black text-sm sm:text-base lg:text-lg pt-1">Fill out a short form with your project idea (takes just a few minutes)</p>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0">
                  2
                </div>
                <p className="text-black text-sm sm:text-base lg:text-lg pt-1">We list your internship on our platform and promote it to our student network</p>
              </div>
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-lg flex-shrink-0">
                  3
                </div>
                <p className="text-black text-sm sm:text-base lg:text-lg pt-1">You choose from applicants and bring an intern on board</p>
              </div>
            </div>
          </div>

          <div className="text-left mb-8 sm:mb-12">
            <p className="text-sm sm:text-base lg:text-lg text-black leading-relaxed">
              Whether you're looking to mentor young talent, get a fresh perspective, or simply get help on a project, INTRN makes it easy. No long emails. No complicated onboarding. Just great students and real collaboration.
            </p>
          </div>

          {/* CTA Buttons - Mobile Responsive */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setLocation("/company-signup")}
              >
                start your journey
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => setLocation("/auth")}
              >
                sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}