import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/lib/api'; // Your API client

export interface User { // Exporting User interface
  id: string;
  name: string;
  email: string;
  avatarUrl?: string; 
  discoveryStreak?: number;
  createdAt?: string; // For join date
  visitedPlacesCount?: number;
  reviewsCount?: number;
  // Potentially: recentlyVisitedPlaces?: PlaceSummary[]; if fetched with profile
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; // For initial token validation / profile fetching
  login: (token: string, userData: User) => void;
  logout: () => void;
  // Optional: Add a function to update user data if profile editing is implemented
  // updateUser: (userData: Partial<User>) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on initial load
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      console.log("AuthContext: Found token in localStorage on init:", storedToken);
      setToken(storedToken);
      // Profile will be fetched by the next useEffect that depends on `token`
    } else {
      console.log("AuthContext: No token found in localStorage on init.");
      setIsLoading(false); // No token, so not loading user profile
    }
  }, []);
  
  // Effect to fetch user profile when token is set and user is not yet loaded
  useEffect(() => {
    if (token && !user) {
      console.log("AuthContext: Token found, user not set. Fetching profile...");
      setIsLoading(true);
      apiClient.get('/auth/profile') 
        .then(response => {
          // Assuming API response is { user: User } or just User
          const userData = response.data.user || response.data; 
          console.log("AuthContext: Profile fetched successfully:", userData);
          setUser(userData);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("AuthContext: Failed to fetch profile with token:", error);
          // Token might be invalid, so log out
          logout(); // This will clear token and user, and remove from localStorage
          setIsLoading(false);
        });
    } else if (!token) {
      // Ensure user is null if token is removed/nullified elsewhere
      setUser(null);
      setIsLoading(false); // Not loading if there's no token
    }
  }, [token]); // Removed 'user' from dependencies to avoid re-triggering on setUser


  const login = (newToken: string, userData: User) => {
    console.log("AuthContext: login called with token:", newToken, "and user data:", userData);
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
    setIsLoading(false); // Finished loading/login process
  };

  const logout = () => {
    console.log("AuthContext: logout called.");
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsLoading(false); // No user, so not loading
    // Optionally: Call a backend logout endpoint if it exists
    // apiClient.post('/auth/logout').catch(err => console.error("Logout API call failed", err));
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
