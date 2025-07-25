import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { User, LogOut, Menu, X, BookOpen, Search, Settings, HelpCircle, Shield, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Extend Window interface for hamburger toggle
declare global {
  interface Window {
    hamburgerToggle?: () => void;
  }
}

// INTRN Logo component - Pillar/Column style from landing page
const DiplomaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    {/* Rolled diploma/scroll */}
    <path d="M3 4h18v2L19 8v8l2 2v2H3v-2l2-2V8L3 6V4z"/>
    <path d="M6 8h12v8H6V8z"/>
    {/* Ribbon/tie */}
    <path d="M11 16h2v4l-1-1-1 1v-4z"/>
    {/* Seal/emblem */}
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

interface HamburgerNavigationProps {
  onToggleFromLogo?: () => void;
}

export function HamburgerNavigation(props: HamburgerNavigationProps = {}) {
  const { onToggleFromLogo } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user } = useQuery<any>({
    queryKey: ["/api/user"],
  });

  const handleLogout = async () => {
    try {
      await apiRequest("/api/logout", { method: "POST" });
      queryClient.clear();
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Scroll detection for hamburger visibility
  useEffect(() => {
    const isLandingPage = location === "/";
    
    if (!isLandingPage) {
      // Show hamburger immediately on all non-landing pages
      setShowHamburger(true);
      return;
    }

    // Landing page: only show on scroll
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Show hamburger when scrolled down at least 100px
      // Hide when scrolling up towards the logo (within 50px of top)
      if (currentScrollY > 100 && currentScrollY > 50) {
        setShowHamburger(true);
      } else if (currentScrollY < 50) {
        setShowHamburger(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  // Expose toggle function to parent component
  useEffect(() => {
    if (onToggleFromLogo) {
      window.hamburgerToggle = toggleMenu;
    }
    return () => {
      if (window.hamburgerToggle) {
        delete window.hamburgerToggle;
      }
    };
  }, [onToggleFromLogo]);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: GraduationCap, show: user },
    { label: "Browse Internships", path: "/search", icon: Search, show: true },
    { label: "Blog", path: "/blog", icon: BookOpen, show: true },
    { label: "Admin Panel", path: "/admin", icon: Shield, show: user?.role === "admin" },
    { label: "Help & Support", path: "/help", icon: HelpCircle, show: true },
  ];

  return (
    <>
      {/* Hamburger Button - Always visible except on landing page (scroll-based) */}
      {showHamburger && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-10 h-10 bg-transparent hover:bg-transparent transition-all duration-300"
          >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {/* Hamburger Lines */}
            <div className={`absolute transition-all duration-300 ${isHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}>
              <div className="space-y-1.5">
                <div className="w-5 h-0.5 bg-purple-600 rounded-full"></div>
                <div className="w-5 h-0.5 bg-purple-600 rounded-full"></div>
                <div className="w-5 h-0.5 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            
            {/* INTRN Logo */}
            <div className={`absolute transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
              <DiplomaIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          </Button>
        </div>
      )}

      {/* Profile Button - Top Right */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10 bg-transparent hover:bg-transparent transition-all duration-300">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-gray-300 text-gray-700 font-semibold text-sm">
                    {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuItem onClick={() => setLocation("/profile")} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 ml-8">
              <DiplomaIcon className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">intrn</span>
            </div>
            <Button variant="ghost" size="icon" onClick={closeMenu} className="w-8 h-8">
              <X className="w-5 h-5" />
            </Button>
          </div>
          {user && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="text-xs text-purple-600 font-medium mt-1 capitalize">{user.role}</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            if (!item.show) return null;
            
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  closeMenu();
                  setLocation(item.path);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-purple-100 text-purple-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {!user ? (
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  closeMenu();
                  window.location.href = "/auth?tab=login";
                }}
              >
                Sign In
              </Button>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => {
                  closeMenu();
                  window.location.href = "/auth?tab=register";
                }}
              >
                Get Started
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </>
  );
}