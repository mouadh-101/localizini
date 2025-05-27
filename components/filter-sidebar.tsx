"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Coffee, Wine, Hotel, Music, MapPin, Sparkles, Heart, Zap, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface FilterSidebarProps {
  filters: any
  onFiltersChange: (filters: any) => void
  className?: string
}

const categories = [
  { id: "all", label: "All Places", icon: MapPin, emoji: "🌊" },
  { id: "cafe", label: "Cafés", icon: Coffee, emoji: "☕" },
  { id: "bar", label: "Bars", icon: Wine, emoji: "🍷" },
  { id: "hotel", label: "Hotels", icon: Hotel, emoji: "🏨" },
  { id: "music", label: "Music Venues", icon: Music, emoji: "🎵" },
]

const vibes = [
  { id: "all", label: "Any Vibe", emoji: "🌊" },
  { id: "cozy", label: "Cozy", emoji: "🔥" },
  { id: "romantic", label: "Romantic", emoji: "💕" },
  { id: "luxurious", label: "Luxurious", emoji: "👑" },
  { id: "electric", label: "Electric", emoji: "⚡" },
]

export function FilterSidebar({ filters, onFiltersChange, className }: FilterSidebarProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className={cn("bg-white/95 backdrop-blur-xl border-r border-teal-200 p-6 overflow-y-auto", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-2xl mb-2"
          >
            🌊
          </motion.div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Discovery Filters
          </h2>
          <p className="text-xs text-teal-600 mt-1">Find your perfect ocean vibe!</p>
        </div>

        {/* Search */}
        <motion.div className="space-y-2" whileHover={{ scale: 1.02 }}>
          <Label htmlFor="search" className="text-[#032539] font-medium flex items-center">
            <Search className="h-4 w-4 mr-2 text-teal-500" />
            Search Ocean
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-400" />
            <Input
              id="search"
              placeholder="What's calling you? 🌊"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 border-teal-200 focus:border-teal-400 focus:ring-teal-400 bg-white/80"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-[#032539] font-medium flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-teal-500" />
            Category
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={filters.category === category.id ? "default" : "outline"}
                    className={cn(
                      "justify-start h-auto p-3 text-left w-full transition-all duration-200",
                      filters.category === category.id
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg"
                        : "border-teal-200 hover:bg-teal-50 text-[#032539] hover:border-teal-300",
                    )}
                    onClick={() => updateFilter("category", category.id)}
                  >
                    <span className="text-lg mr-3">{category.emoji}</span>
                    <IconComponent className="h-4 w-4 mr-3" />
                    {category.label}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Vibe Filter */}
        <div className="space-y-3">
          <Label className="text-[#032539] font-medium flex items-center">
            <Heart className="h-4 w-4 mr-2 text-teal-500" />
            Vibe Check
          </Label>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe) => (
              <motion.div key={vibe.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge
                  variant={filters.vibe === vibe.id ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    filters.vibe === vibe.id
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                      : "border-teal-200 hover:bg-teal-50 text-teal-600",
                  )}
                  onClick={() => updateFilter("vibe", vibe.id)}
                >
                  <span className="mr-1">{vibe.emoji}</span>
                  {vibe.label}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Open Now */}
        <motion.div
          className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
          whileHover={{ scale: 1.02 }}
        >
          <Label htmlFor="open-now" className="text-[#032539] font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-green-500" />
            Open Right Now
          </Label>
          <Switch
            id="open-now"
            checked={filters.openNow}
            onCheckedChange={(checked) => updateFilter("openNow", checked)}
          />
        </motion.div>

        {/* Distance */}
        <motion.div className="space-y-3" whileHover={{ scale: 1.02 }}>
          <Label className="text-[#032539] font-medium flex items-center justify-between">
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-teal-500" />
              Distance
            </span>
            <Badge variant="outline" className="bg-teal-50 text-teal-600 border-teal-200">
              {filters.distance} km
            </Badge>
          </Label>
          <div className="px-3">
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => updateFilter("distance", value[0])}
              max={10}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-teal-500 mt-1">
              <span>0.1km</span>
              <span>10km</span>
            </div>
          </div>
        </motion.div>

        {/* Rating */}
        <motion.div className="space-y-3" whileHover={{ scale: 1.02 }}>
          <Label className="text-[#032539] font-medium flex items-center justify-between">
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-secondary" />
              Minimum Rating
            </span>
            <Badge variant="outline" className="bg-orange-50 text-secondary border-orange-200">
              {filters.rating > 0 ? `${filters.rating}+ ⭐` : "Any ⭐"}
            </Badge>
          </Label>
          <div className="px-3">
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => updateFilter("rating", value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-teal-500 mt-1">
              <span>Any</span>
              <span>5⭐</span>
            </div>
          </div>
        </motion.div>

        {/* Clear Filters */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="w-full border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300"
            onClick={() =>
              onFiltersChange({
                category: "all",
                openNow: false,
                distance: 5,
                rating: 0,
                search: "",
                vibe: "all",
              })
            }
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Reset Ocean 🌊
          </Button>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium text-teal-900">Ocean Mode</div>
            <div className="text-xs text-teal-600 mt-1">{Math.floor(Math.random() * 50) + 10} wave riders nearby!</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
