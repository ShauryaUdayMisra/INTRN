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
import { MapPin, Clock, Heart, Edit, Eye } from "lucide-react";
import { useState } from "react";
import { getInternshipImage, getTitleGradient } from "@/lib/internship-images";

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
    if (isFilled) {
      setShowFilledDialog(true);
      return;
    }

    if (!user) {
      setLocation("/auth?tab=register");
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

  const internshipImage = getInternshipImage(internship.title);
  const gradient = getTitleGradient(internship.title);

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
      className={`group bg-white hover:shadow-xl transform hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 hover:border-primary/30 cursor-pointer overflow-hidden flex flex-col h-full ${isFilled ? "opacity-60 grayscale" : ""}`}
      onClick={handleCardClick}
    >
      {/* Image banner */}
      <div className="relative h-36 w-full overflow-hidden">
        {internshipImage ? (
          <img
            src={internshipImage}
            alt={internship.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-white text-4xl font-bold">
              {internship.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur text-green-700 hover:bg-white text-xs font-semibold shadow-sm">
          ● Online
        </Badge>
        {user?.role === "student" && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-gray-500 hover:text-red-500 shadow-sm ${
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

      <CardContent className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-lg leading-snug mb-3 line-clamp-2">
          {internship.title}
        </h3>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{internship.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
            <span>{internship.duration}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {internship.createdAt ? `Posted ${new Date(internship.createdAt).toLocaleDateString()}` : ""}
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply();
                }}
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
