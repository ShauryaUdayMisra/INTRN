import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, any>;
};

type LoginData = {
  username: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      // Redirect based on user role after successful login
      if (user.role === "company") {
        window.location.href = "/company-dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: any) => {
      console.log("Frontend registration attempt:", credentials);
      try {
        const res = await apiRequest("POST", "/api/register", credentials);
        const user = await res.json();
        console.log("Registration response:", user);
        return user;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },
    onSuccess: (user: SelectUser) => {
      console.log("Registration successful, setting user data:", user);
      
      // Update query cache properly
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Use requestAnimationFrame to ensure state updates happen after render
      requestAnimationFrame(() => {
        if (user.role === "student" && !user.profileComplete) {
          window.location.href = "/student-onboarding";
        } else if (user.role === "company" && !user.profileComplete) {
          window.location.href = "/company-application";
        } else {
          // For completed profiles, redirect based on role
          if (user.role === "company") {
            window.location.href = "/company-dashboard";
          } else {
            window.location.href = "/dashboard";
          }
        }
      });
    },
    onError: (error: Error) => {
      console.error("Registration mutation error:", error);
      
      // Check if error indicates email already exists
      if (error.message.includes("email already exists") || error.message.includes("Please sign in instead")) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please use the sign in tab instead.",
          variant: "destructive",
        });
        // Switch to sign in tab instead of redirecting
        setTimeout(() => {
          const signInTab = document.querySelector('[data-value="login"]') as HTMLElement;
          if (signInTab) {
            signInTab.click();
          }
        }, 1000);
      } else {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      // Clear all cached data first
      queryClient.setQueryData(["/api/user"], null);
      queryClient.clear();
      // Navigate to root and force refresh
      window.location.href = "/";
    },
    onError: (error: Error) => {
      // Clear all cached data even on error
      queryClient.setQueryData(["/api/user"], null);
      queryClient.clear();
      // Navigate to root even on error
      window.location.href = "/";
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
