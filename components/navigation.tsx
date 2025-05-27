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
    <nav className="bg-white/80 backdrop-blur-xl border-b border-teal-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
              Localizini
            </span>
            <div className="text-xs text-teal-600 font-medium">Discover • Connect • Explore 🌊</div>
          </div>
        </motion.div>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* User Level Badge */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-secondary to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                <Crown className="h-3 w-3" />
                <span>Explorer Lv.{Math.floor(discoveryStreak / 3) + 1}</span>
              </motion.div>

              {/* Streak Counter */}
              {discoveryStreak > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="hidden sm:flex items-center space-x-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                >
                  <Zap className="h-3 w-3" />
                  <span>{discoveryStreak} days</span>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 hover:bg-teal-50"
                >
                  <Avatar className="h-8 w-8 ring-2 ring-teal-200">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-[#032539] font-medium">{user.name}</span>
                </Button>
              </motion.div>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg"
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
