"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog" // Added DialogClose
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { Mail, Lock, User, Chrome, XIcon, Loader2 } from "lucide-react" // Added XIcon and Loader2
import { useAuth, User as AuthUser } from "@/contexts/AuthContext"; // Import useAuth and User type
import apiClient from "@/lib/api"; // Import apiClient

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  // onLogin prop is removed as we'll use the context's login
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const auth = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError(null);

    try {
      let response;
      if (isSignUp) {
        response = await apiClient.post('/auth/signup', { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        });
      } else {
        response = await apiClient.post('/auth/login', { 
          email: formData.email, 
          password: formData.password 
        });
      }
      
      // Assuming API returns { accessToken: string, user: User }
      // Adjust if your API returns user details under a different key, e.g. response.data directly
      const userData = response.data.user || response.data; // Adapt as needed
      auth.login(response.data.accessToken, userData as AuthUser); 

      setFormData({ name: "", email: "", password: "" }); // Reset form
      onClose(); // Close modal on success
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setApiError(error.response.data.message);
      } else if (error.message) {
        setApiError(error.message);
      } else {
        setApiError("An unexpected error occurred. Please try again.");
      }
      console.error("Auth error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google authentication - will be replaced in a future step
    // For now, let's simulate a successful login for testing UI flow
    const mockUser: AuthUser = {
      id: "google-mock-1",
      name: "Google User",
      email: "google@example.com",
      // avatarUrl: "/placeholder-user.jpg" // Example avatar
    };
    auth.login("mock-google-token", mockUser);
    onClose();
  };

  // Reset error when switching between sign-in/sign-up
  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setApiError(null);
    setFormData({ name: "", email: "", password: "" }); // Reset form on mode toggle
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-brand-background rounded-2xl shadow-soft-lg border-none p-8">
        <DialogClose className="absolute right-5 top-5 text-brand-text hover:text-brand-primary hover:bg-brand-accent-medium/20 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-background">
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="mb-4"> {/* Added margin bottom to header for spacing */}
          <DialogTitle className="text-2xl font-semibold text-center text-brand-primary"> {/* Updated styling */}
            {isSignUp ? "Join Localizini" : "Welcome Back"}
          </DialogTitle>
          {/* Optional: Add DialogDescription here if needed */}
          {/* <DialogDescription className="text-center text-brand-text text-sm mt-1">
            Access your discoveries and contribute to the community.
          </DialogDescription> */}
        </DialogHeader>

        <div className="space-y-6">
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 bg-white border-brand-accent-medium text-brand-text hover:bg-brand-accent-medium/20 shadow-soft-sm rounded-lg text-sm" // Updated styling
          >
            <Chrome className="h-5 w-5 mr-3 text-brand-primary" /> {/* Icon color */}
            Continue with Google
          </Button>

          <div className="relative my-6"> {/* Added my-6 for more spacing */}
            <Separator className="border-brand-accent-medium/50" /> {/* Updated line color */}
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-background px-3 text-xs font-medium text-brand-accent-dark"> {/* Updated text & bg color */}
              OR CONTINUE WITH EMAIL
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-brand-text text-sm font-medium">Full Name</Label> {/* Updated styling */}
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-accent-dark" /> {/* Updated color & position */}
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 border-brand-accent-medium focus:border-brand-primary focus:ring-brand-primary bg-brand-background/80 rounded-lg text-sm" // Updated styling
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-text text-sm font-medium">Email</Label> {/* Updated styling */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-accent-dark" /> {/* Updated color & position */}
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 border-brand-accent-medium focus:border-brand-primary focus:ring-brand-primary bg-brand-background/80 rounded-lg text-sm" // Updated styling
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-text text-sm font-medium">Password</Label> {/* Updated styling */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-accent-dark" /> {/* Updated color & position */}
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 border-brand-accent-medium focus:border-brand-primary focus:ring-brand-primary bg-brand-background/80 rounded-lg text-sm" // Updated styling
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-brand-primary text-primary-foreground hover:bg-brand-accent-dark rounded-lg text-sm py-2.5 shadow-soft-sm disabled:opacity-70 flex items-center justify-center" // Added flex items-center justify-center
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>
          
          {apiError && (
            <p className="text-center text-sm text-red-600 bg-red-100 border border-red-400 p-2.5 rounded-lg">
              {apiError}
            </p>
          )}

          <div className="text-center pt-2"> {/* Added pt-2 for spacing */}
            <button onClick={toggleAuthMode} className="text-sm text-brand-primary hover:underline focus:outline-none">
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
