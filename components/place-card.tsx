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
  const vibeEmoji = vibeEmojis[place.vibe as keyof typeof vibeEmojis] || "✨" // Updated default emoji

  return (
    // Removed outer motion.div for hover animation, will be handled by Card's hover state
    <Card
      className={cn(
        "cursor-pointer transition-shadow duration-300 border overflow-hidden bg-white rounded-2xl shadow-soft-md hover:shadow-soft-lg",
        isSelected
          ? "ring-2 ring-brand-primary ring-offset-2 ring-offset-brand-background border-transparent" // Use transparent border when ring is active
          : "border-brand-accent-medium/30",
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative">
          <img src={place.image || "/placeholder.svg"} alt={place.name} className="w-full h-40 object-cover rounded-t-2xl" /> {/* Reduced height, added rounded-t-2xl */}

          {/* Gradient Overlay for better text visibility on image if needed - kept subtle */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-2xl" />

          {/* Like Button */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute top-2 right-2"> {/* Adjusted position */}
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/70 backdrop-blur-sm hover:bg-white text-brand-text hover:text-red-500 shadow-soft-sm rounded-full w-8 h-8" // Smaller button
              onClick={(e) => {
                e.stopPropagation()
                setIsLiked(!isLiked)
              }}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
            </Button>
          </motion.div>

          {/* Status Badges */}
          <div className="absolute bottom-2 left-2 flex space-x-2"> {/* Adjusted position */}
            {place.isOpen && (
              <Badge className="bg-brand-secondary text-brand-text shadow-soft-sm rounded-md text-xs px-2 py-1"> {/* Updated style */}
                <Zap className="h-3 w-3 mr-1" />
                Open
              </Badge>
            )}
            <Badge className="bg-brand-background/80 backdrop-blur-sm text-brand-primary shadow-soft-sm rounded-md text-xs px-2 py-1"> {/* Updated style */}
              {vibeEmoji} {place.vibe}
            </Badge>
          </div>

          {/* Hot Badge */}
          {place.rating >= 4.5 && (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }} // Subtle animation
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
              className="absolute top-2 left-2" // Adjusted position
            >
              <Badge className="bg-brand-secondary text-brand-text shadow-soft-sm rounded-md text-xs px-2 py-1">🔥 Hot</Badge> {/* Updated style */}
            </motion.div>
          )}
        </div>

        <div className="p-4 space-y-2"> {/* Reduced space-y */}
          <div>
            <h3 className="font-semibold text-brand-primary text-lg leading-tight truncate">{place.name}</h3> {/* Truncate for long names */}
            <p className="text-brand-text text-sm mt-0.5 line-clamp-2">{place.description}</p> {/* Reduced margin-top */}
          </div>

          {/* Fun Fact Removed */}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-brand-secondary text-brand-secondary" /> {/* Updated color */}
                <span className="font-medium text-brand-text">{place.rating}</span> {/* Updated color */}
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-brand-accent-dark" /> {/* Updated color */}
                <span className="text-brand-text text-sm">{place.distance}km</span> {/* Updated color */}
              </div>
            </div>
            {place.hours && ( // Conditionally render hours
              <div className="flex items-center space-x-1 text-brand-accent-dark"> {/* Updated color */}
                <Clock className="h-3 w-3" /> {/* Smaller icon */}
                <span className="text-xs font-medium">{place.hours}</span>
              </div>
            )}
          </div>

          {place.tags && place.tags.length > 0 && ( // Conditionally render tags section
            <div className="flex flex-wrap gap-1 pt-1"> {/* Added pt-1 */}
              {place.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-brand-accent-medium/20 text-brand-accent-dark hover:bg-brand-accent-medium/30 rounded-md px-2 py-0.5"> {/* Updated style */}
                  {tag}
                </Badge>
              ))}
              {place.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-200 text-gray-700 rounded-md px-2 py-0.5"> {/* Kept for "more" tag */}
                  +{place.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Online Users & Dive In Removed */}
        </div>
      </CardContent>
    </Card>
  )
}
