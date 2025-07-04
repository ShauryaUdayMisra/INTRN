import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Search, BookOpen, HelpCircle, User, LogOut, Settings, Home } from "lucide-react";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: "/search", label: "Browse Internships", icon: Search },
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/help", label: "Help", icon: HelpCircle },
  ];

  const userNavItems = user ? [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    ...navItems,
  ] : navItems;

  if (user?.role === "admin") {
    userNavItems.push({ href: "/admin", label: "Admin", icon: Settings });
    
    // Special backend access for admin1, admin2, admin3
    if (['admin1', 'admin2', 'admin3'].includes(user.username)) {
      userNavItems.push({ href: "/admin-backend", label: "Backend", icon: User });
    }
  }

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {userNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`${
            mobile
              ? "block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              : "text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
          } ${location === item.href ? "text-gray-900 font-semibold" : ""}`}
          onClick={onItemClick}
        >
          {mobile && <item.icon className="inline mr-2 h-4 w-4" />}
          {item.label}
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">i</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">intrn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLinks />
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.firstName ? user.firstName[0] : 
                         user.companyName ? user.companyName[0] : 
                         user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.companyName || user.username}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="text-gray-700 hover:text-primary" onClick={() => setLocation("/auth")}>
                  Sign In
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6" onClick={() => setLocation("/auth?tab=register")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-8">
                    <span className="text-2xl font-bold text-gray-800">INTRN</span>
                  </div>

                  <nav className="flex-1">
                    <div className="space-y-1">
                      <NavLinks mobile onItemClick={() => setMobileMenuOpen(false)} />
                    </div>
                  </nav>

                  {/* Mobile Auth Section */}
                  <div className="border-t pt-4 mt-auto">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 px-3 py-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {user.firstName ? user.firstName[0] : 
                               user.companyName ? user.companyName[0] : 
                               user.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.firstName && user.lastName 
                                ? `${user.firstName} ${user.lastName}` 
                                : user.companyName || user.username}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                              setLocation("/profile");
                              setMobileMenuOpen(false);
                            }}
                          >
                            <User className="mr-2 h-4 w-4" />
                            Profile
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start"
                            onClick={() => {
                              setLocation("/settings");
                              setMobileMenuOpen(false);
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => {
                            setLocation("/auth");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Sign In
                        </Button>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                          onClick={() => {
                            setLocation("/auth?tab=register");
                            setMobileMenuOpen(false);
                          }}
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
