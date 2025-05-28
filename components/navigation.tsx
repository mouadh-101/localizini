"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Sparkles, Zap, Crown } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { LogOut } from "lucide-react"; // For Logout button

interface NavigationProps {
  // user prop is removed, will use auth.user from context
  onAuthClick: () => void; // To open AuthModal
  onProfileClick: () => void; // To open UserProfile page
  // discoveryStreak prop is removed, will use auth.user.discoveryStreak
}

export function Navigation({ onAuthClick, onProfileClick }: NavigationProps) {
  const { user, logout, isLoading } = useAuth();
  const discoveryStreak = user?.discoveryStreak || 0; // Get streak from auth user or default to 0

  // If still loading initial auth state, can render a placeholder or nothing
  if (isLoading) {
    return (
      <nav className="bg-brand-background/80 backdrop-blur-xl border-b border-brand-accent-medium px-4 py-3 sticky top-0 z-40 shadow-soft-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto h-10">
          {/* Optional: Skeleton loader for nav */}
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-brand-background/80 backdrop-blur-xl border-b border-brand-accent-medium px-4 py-3 sticky top-0 z-40 shadow-soft-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center shadow-soft-md">
            <MapPin className="h-6 w-6 text-white" /> {/* Assuming white is primary-foreground for brand-primary */}
          </div>
          <div>
            <span className="text-xl font-bold text-brand-primary">
              Localizini
            </span>
            <div className="text-xs text-brand-accent-dark font-medium">Discover • Connect • Explore ✨</div>
          </div>
        </motion.div>

        <div className="flex items-center space-x-2 sm:space-x-3"> {/* Adjusted spacing for mobile */}
          {user ? (
            <div className="flex items-center space-x-2 sm:space-x-3"> {/* Adjusted spacing for mobile */}
              {/* User Level Badge */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="hidden sm:flex items-center space-x-1 bg-brand-secondary text-brand-text px-3 py-1 rounded-full text-xs font-bold shadow-soft-sm"
              >
                <Crown className="h-3 w-3" />
                <span>Explorer Lv.{Math.floor(discoveryStreak / 3) + 1}</span>
              </motion.div>

              {/* Streak Counter */}
              {discoveryStreak > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="hidden sm:flex items-center space-x-1 bg-brand-accent-medium text-white px-3 py-1 rounded-full text-xs font-bold shadow-soft-sm"
                >
                  <Zap className="h-3 w-3" />
                  <span>{discoveryStreak} days</span>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 hover:bg-brand-accent-medium/20"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-brand-secondary">
                    <AvatarImage src={user.avatarUrl || "/placeholder-user.jpg"} /> {/* Use avatarUrl from context user */}
                    <AvatarFallback className="bg-brand-primary text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-brand-text font-medium">{user.name}</span>
                </Button>
              </motion.div>

              {/* Logout Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="text-brand-text hover:bg-brand-accent-medium/20 p-2 rounded-lg"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onAuthClick}
                className="bg-brand-primary hover:bg-brand-accent-dark text-white shadow-soft-sm rounded-lg" 
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Join the Adventure!
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  )
}
