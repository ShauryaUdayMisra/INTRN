import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Briefcase, DollarSign, Clock, X } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    location: string;
    type: string;
    skills: string[];
  };
  onFiltersChange: (filters: any) => void;
}

export default function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const internshipTypes = [
    { value: "remote", label: "Remote" },
    { value: "onsite", label: "On-site" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const popularSkills = [
    "Social Media", "Marketing", "Design", "Content Writing", "Customer Service",
    "Data Entry", "Microsoft Office", "Google Workspace", "Photography", "Video Editing",
    "Canva Design", "HTML/CSS", "WordPress", "Sales", "Basic Coding",
    "JavaScript", "Python", "UI/UX Design"
  ];

  const popularLocations = [
    "Mumbai, India", "Delhi, India", "Bangalore, India", "Chennai, India",
    "Pune, India", "Hyderabad, India", "Kolkata, India", "Ahmedabad, India",
    "Dhaka, Bangladesh", "Karachi, Pakistan", "Lahore, Pakistan", "Colombo, Sri Lanka"
  ];

  const handleLocationChange = (location: string) => {
    onFiltersChange({ ...filters, location });
  };

  const handleTypeChange = (type: string) => {
    onFiltersChange({ ...filters, type });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const handleClearFilters = () => {
    onFiltersChange({ location: "", type: "", skills: [] });
  };

  const hasActiveFilters = filters.location || filters.type || filters.skills.length > 0;

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Location Filter */}
        <div>
          <Label className="text-sm font-medium flex items-center mb-3">
            <MapPin className="mr-2 h-4 w-4 text-primary" />
            Location
          </Label>
          <Input
            placeholder="Enter city or 'remote'"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="mb-2"
          />
          <div className="space-y-1">
            <p className="text-xs text-gray-500 mb-2">Popular locations:</p>
            {popularLocations.slice(0, 4).map((location) => (
              <Button
                key={location}
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs text-gray-600 hover:text-primary justify-start w-full"
                onClick={() => handleLocationChange(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Internship Type Filter */}
        <div>
          <Label className="text-sm font-medium flex items-center mb-3">
            <Briefcase className="mr-2 h-4 w-4 text-primary" />
            Work Type
          </Label>
          <Select value={filters.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select work type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {internshipTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Skills Filter */}
        <div>
          <Label className="text-sm font-medium flex items-center mb-3">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            Skills & Technologies
          </Label>
          
          {/* Selected Skills */}
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {filters.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="default"
                  className="text-xs px-2 py-1 cursor-pointer hover:bg-primary/80"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          {/* Skill Checkboxes */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {popularSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={filters.skills.includes(skill)}
                  onCheckedChange={() => handleSkillToggle(skill)}
                />
                <Label
                  htmlFor={skill}
                  className="text-sm text-gray-700 cursor-pointer flex-1"
                >
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Salary Range */}
        <div>
          <Label className="text-sm font-medium flex items-center mb-3">
            <DollarSign className="mr-2 h-4 w-4 text-primary" />
            Salary Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Min" type="number" />
            <Input placeholder="Max" type="number" />
          </div>
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500 mb-2">Common ranges:</p>
            {["$3,000+", "$5,000+", "$7,000+", "$10,000+"].map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-xs text-gray-600 hover:text-primary justify-start w-full"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Duration Filter */}
        <div>
          <Label className="text-sm font-medium flex items-center mb-3">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            Duration
          </Label>
          <div className="space-y-2">
            {["8 weeks", "10 weeks", "12 weeks", "16 weeks", "Summer", "Full-time"].map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox id={duration} />
                <Label
                  htmlFor={duration}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {duration}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
