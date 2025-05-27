"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Coffee, Wine, Hotel, Music, Zap, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MapViewProps {
  places: any[]
  onPlaceSelect: (place: any) => void
  selectedPlace?: any
}

const categoryIcons = {
  cafe: Coffee,
  bar: Wine,
  hotel: Hotel,
  music: Music,
}

const vibeColors = {
  cozy: "from-orange-400 to-red-400",
  romantic: "from-pink-400 to-rose-400",
  luxurious: "from-secondary to-orange-400",
  electric: "from-teal-400 to-cyan-400",
}

export function MapView({ places, onPlaceSelect, selectedPlace }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [hoveredPlace, setHoveredPlace] = useState<string | null>(null)
  const [pulseEffect, setPulseEffect] = useState<string | null>(null)

  const handlePlaceClick = (place: any) => {
    setPulseEffect(place.id)
    setTimeout(() => setPulseEffect(null), 600)
    onPlaceSelect(place)
  }

  return (
    <div
      ref={mapRef}
      className="w-full h-full bg-gradient-to-br from-teal-100 via-teal-200 to-cyan-200 relative overflow-hidden"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%2326A69A' fillOpacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      {/* Floating Ocean Elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-teal-400 rounded-full opacity-60"
        animate={{ y: [0, -20, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute top-3/4 right-1/3 w-3 h-3 bg-cyan-400 rounded-full opacity-60"
        animate={{ y: [0, 15, 0], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/6 w-2 h-2 bg-teal-300 rounded-full opacity-50"
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
      />

      {/* Map Pins */}
      {places.map((place, index) => {
        const IconComponent = categoryIcons[place.category as keyof typeof categoryIcons] || MapPin
        const isSelected = selectedPlace?.id === place.id
        const isHovered = hoveredPlace === place.id
        const isPulsing = pulseEffect === place.id
        const vibeGradient = vibeColors[place.vibe as keyof typeof vibeColors] || "from-teal-400 to-cyan-400"

        return (
          <motion.div
            key={place.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${30 + ((index * 15) % 60)}%`,
              top: `${40 + ((index * 10) % 40)}%`,
            }}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: isSelected ? 1.2 : isHovered ? 1.1 : 1,
              rotate: 0,
            }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 200,
              delay: index * 0.1,
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onHoverStart={() => setHoveredPlace(place.id)}
            onHoverEnd={() => setHoveredPlace(null)}
          >
            <Button
              variant="ghost"
              className={`relative p-3 rounded-2xl shadow-xl transition-all duration-300 border-2 ${
                isSelected
                  ? `bg-gradient-to-r ${vibeGradient} text-white border-white shadow-2xl`
                  : `bg-white/90 backdrop-blur-xl text-teal-600 border-teal-200 hover:bg-gradient-to-r hover:${vibeGradient} hover:text-white hover:border-white`
              }`}
              onClick={() => handlePlaceClick(place)}
            >
              <IconComponent className="h-5 w-5" />

              {/* Pulse Effect */}
              <AnimatePresence>
                {isPulsing && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 opacity-50"
                    initial={{ scale: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    exit={{ scale: 1, opacity: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                )}
              </AnimatePresence>

              {/* Rating Badge */}
              {place.rating >= 4.5 && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-xs"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  ⭐
                </motion.div>
              )}

              {/* Hover Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -50, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-teal-200 min-w-48 z-10"
                  >
                    <div className="text-sm font-semibold text-teal-900">{place.name}</div>
                    <div className="text-xs text-teal-600 mt-1">{place.funFact}</div>
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="flex items-center">
                        <span className="text-secondary">⭐</span>
                        <span className="text-xs ml-1 font-medium">{place.rating}</span>
                      </div>
                      <div className="text-xs text-teal-500">• {place.distance}km</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        )
      })}

      {/* User Location Pin */}
      <motion.div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: "50%", top: "50%" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="relative">
          <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full border-3 border-white shadow-xl flex items-center justify-center">
            <Heart className="h-3 w-3 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full opacity-30"
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      </motion.div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 backdrop-blur-xl shadow-xl border-teal-200 hover:bg-teal-50 text-teal-600"
          >
            +
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="outline"
            size="icon"
            className="bg-white/90 backdrop-blur-xl shadow-xl border-teal-200 hover:bg-teal-50 text-teal-600"
          >
            -
          </Button>
        </motion.div>
      </div>

      {/* Location Permission Banner */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl px-6 py-3 text-sm text-teal-900 border border-teal-200"
      >
        <div className="flex items-center space-x-2">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            🌊
          </motion.span>
          <span className="font-medium">Discovering ocean vibes near you</span>
          <Zap className="h-4 w-4 text-teal-500" />
        </div>
      </motion.div>
    </div>
  )
}
