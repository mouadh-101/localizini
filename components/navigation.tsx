"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Sparkles, Zap, Crown } from "lucide-react"
import { motion } from "framer-motion"

interface NavigationProps {
  user?: any
  onAuthClick: () => void
  onProfileClick: () => void
  discoveryStreak?: number
}

export function Navigation({ user, onAuthClick, onProfileClick, discoveryStreak = 0 }: NavigationProps) {
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

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
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
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-brand-primary text-white"> {/* Assuming white is primary-foreground */}
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-brand-text font-medium">{user.name}</span>
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onAuthClick}
                className="bg-brand-primary hover:bg-brand-accent-dark text-white shadow-soft-sm" /* Assuming white is primary-foreground */
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
