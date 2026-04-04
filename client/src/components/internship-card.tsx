import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Internship } from "@shared/schema";
import { useLocation } from "wouter";
import { MapPin, Clock, DollarSign, Heart, Building, Edit, Eye } from "lucide-react";
import { useState } from "react";

const FILLED_INTERNSHIP_ID = 239;

interface InternshipCardProps {
  internship: Internship;
  showManage?: boolean;
}

export default function InternshipCard({ internship, showManage = false }: InternshipCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFilledDialog, setShowFilledDialog] = useState(false);

  const isFilled = internship.id === FILLED_INTERNSHIP_ID;

  const applyMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/applications", {
        internshipId: internship.id,
        coverLetter: "I am very interested in this internship opportunity.",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${internship.id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { internshipId: internship.id });
      }
    },
    onSuccess: () => {
      setIsFavorite(!isFavorite);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite 
          ? "Internship removed from your favorites" 
          : "Internship added to your favorites",
      });
    },
  });

  const handleApply = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to apply for internships",
        variant: "destructive",
      });
      return;
    }
    
    if (user.role !== "student") {
      toast({
        title: "Student account required",
        description: "Only student accounts can apply for internships",
        variant: "destructive",
      });
      return;
    }

    applyMutation.mutate();
  };

  const handleToggleFavorite = () => {
    if (!user || user.role !== "student") {
      toast({
        title: "Student account required",
        description: "Only students can save favorites",
        variant: "destructive",
      });
      return;
    }

    favoriteMutation.mutate();
  };

  // Generate company logo placeholder
  const getCompanyInitial = () => {
    // This would typically come from company data
    return "C";
  };

  const handleCardClick = () => {
    if (isFilled) {
      setShowFilledDialog(true);
      return;
    }
    setLocation(`/internship/${internship.id}`);
  };

  return (
    <>
    <Dialog open={showFilledDialog} onOpenChange={setShowFilledDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Position Already Filled</DialogTitle>
          <DialogDescription>
            This internship position has already been filled. Please explore other opportunities available on the platform.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
    <Card 
      className={`bg-white hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-primary/20 cursor-pointer ${isFilled ? "opacity-50 grayscale" : ""}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold">
              {getCompanyInitial()}
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{internship.title}</h3>
            </div>
          </div>
          {user?.role === "student" && (
            <Button
              variant="ghost"
              size="icon"
              className={`text-gray-400 hover:text-red-500 transition-colors ${
                isFavorite ? "text-red-500" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleFavorite();
              }}
              disabled={favoriteMutation.isPending}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>
        
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            <span>{internship.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            <span>{internship.duration}</span>
          </div>
          {internship.salary && (
            <div className="flex items-center text-gray-600 text-sm">
              <DollarSign className="mr-2 h-4 w-4 text-primary" />
              <span>{internship.salary}</span>
            </div>
          )}
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {internship.description}
        </p>

        {internship.skills && internship.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {internship.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {internship.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{internship.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Posted {new Date(internship.createdAt).toLocaleDateString()}
          </span>
          
          <div className="flex gap-2">
            {showManage ? (
              <>
                <Button size="sm" variant="outline">
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={handleApply}
                disabled={applyMutation.isPending}
              >
                {applyMutation.isPending ? "Applying..." : "Apply Now"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
