import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { useLocation } from "wouter";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocationQuery] = useState("");
  const [, setRoute] = useLocation();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (location) params.set("location", location);
    setRoute(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search internships, companies, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 py-3 text-lg border-gray-300 focus:border-gray-500"
          />
        </div>
        <div className="relative sm:w-64">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocationQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 py-3 text-lg border-gray-300 focus:border-gray-500"
          />
        </div>
        <Button 
          onClick={handleSearch}
          size="lg"
          className="px-8 py-3 text-lg font-semibold bg-gray-700 hover:bg-gray-800"
        >
          Search
        </Button>
      </div>
    </div>
  );
}