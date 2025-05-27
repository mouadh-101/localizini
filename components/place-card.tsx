"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, Heart, Zap, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useState } from "react"

interface PlaceCardProps {
  place: any
  isSelected?: boolean
  onClick: () => void
}

const vibeEmojis = {
  cozy: "🔥",
  romantic: "💕",
  luxurious: "👑",
  electric: "⚡",
}

export function PlaceCard({ place, isSelected, onClick }: PlaceCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const vibeEmoji = vibeEmojis[place.vibe as keyof typeof vibeEmojis] || "🌊"

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300 border-2 overflow-hidden",
          isSelected
            ? "border-teal-400 shadow-xl shadow-teal-200/50 bg-gradient-to-br from-teal-50 to-cyan-50"
            : "border-teal-200 hover:border-teal-300 hover:shadow-lg shadow-md bg-white/80 backdrop-blur-sm",
        )}
        onClick={onClick}
      >
        <CardContent className="p-0">
          <div className="relative">
            <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-48 object-cover" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Like Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLiked(!isLiked)
                }}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
              </Button>
            </motion.div>

            {/* Status Badges */}
            <div className="absolute bottom-3 left-3 flex space-x-2">
              {place.isOpen && (
                <Badge className="bg-green-500 hover:bg-green-500 text-white shadow-lg">
                  <Zap className="h-3 w-3 mr-1" />
                  Open
                </Badge>
              )}
              <Badge className="bg-white/90 text-teal-600 shadow-lg">
                {vibeEmoji} {place.vibe}
              </Badge>
            </div>

            {/* Hot Badge */}
            {place.rating >= 4.5 && (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute top-3 left-3"
              >
                <Badge className="bg-gradient-to-r from-secondary to-orange-500 text-white shadow-lg">🔥 Hot</Badge>
              </motion.div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-[#032539] text-lg leading-tight">{place.name}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{place.description}</p>
            </div>

            {/* Fun Fact */}
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-xs text-teal-700 font-medium">💡 {place.funFact}</p>
            </motion.div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-secondary text-secondary" />
                  <span className="font-bold text-secondary">{place.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-teal-500" />
                  <span className="font-medium">{place.distance}km</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">{place.hours}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {place.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-teal-100 text-teal-700 hover:bg-teal-200">
                  {tag}
                </Badge>
              ))}
              {place.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  +{place.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Online Users */}
            <div className="flex items-center justify-between pt-2 border-t border-teal-100">
              <div className="flex items-center space-x-1 text-xs text-teal-600">
                <Users className="h-3 w-3" />
                <span>{Math.floor(Math.random() * 10) + 1} online</span>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-xs text-teal-500 font-medium"
              >
                Dive in! 🌊
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
