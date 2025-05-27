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
    <div className={cn("bg-brand-background border-r border-brand-accent-medium p-6 overflow-y-auto", className)}>
      <div className="space-y-8"> {/* Increased spacing */}
        {/* Header */}
        <div className="text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror" }}
            className="text-3xl mb-2" // Slightly larger emoji
          >
            ✨
          </motion.div>
          <h2 className="text-xl font-bold text-brand-primary"> {/* Updated color & size */}
            Discovery Filters
          </h2>
          <p className="text-sm text-brand-accent-dark mt-1">Find your perfect vibe!</p> {/* Updated color & size */}
        </div>

        {/* Search */}
        <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
          <Label htmlFor="search" className="text-brand-text font-medium flex items-center text-sm"> {/* Updated color & size */}
            <Search className="h-4 w-4 mr-2 text-brand-primary" /> {/* Updated color */}
            Search Places
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-accent-medium" /> {/* Updated color */}
            <Input
              id="search"
              placeholder="What are you looking for?"
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10 border-brand-accent-medium focus:border-brand-primary focus:ring-brand-primary bg-brand-background/80 rounded-lg text-sm" /* Updated styles & size */
            />
          </div>
        </motion.div>

        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-brand-text font-medium flex items-center text-sm"> {/* Updated color & size */}
            <Sparkles className="h-4 w-4 mr-2 text-brand-primary" /> {/* Updated color */}
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
                  transition={{ delay: index * 0.05 }} // Faster animation
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={filters.category === category.id ? "default" : "outline"}
                    className={cn(
                      "justify-start h-auto p-3 text-left w-full transition-all duration-200 rounded-lg text-sm", // Added rounded-lg, updated size
                      filters.category === category.id
                        ? "bg-brand-primary hover:bg-brand-accent-dark text-white shadow-soft-sm" // Updated selected style
                        : "border-brand-accent-medium hover:bg-brand-accent-medium/20 text-brand-text hover:border-brand-accent-dark", // Updated unselected style
                    )}
                    onClick={() => updateFilter("category", category.id)}
                  >
                    <span className="text-lg mr-3">{category.emoji}</span>
                    {/* Icon color in button will be handled by text-white or text-brand-text based on selection state */}
                    <IconComponent className={cn("h-4 w-4 mr-3", filters.category === category.id ? "text-white" : "text-brand-primary")} /> 
                    {category.label}
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Vibe Filter */}
        <div className="space-y-3">
          <Label className="text-brand-text font-medium flex items-center text-sm"> {/* Updated color & size */}
            <Heart className="h-4 w-4 mr-2 text-brand-primary" /> {/* Updated color */}
            Vibe Check
          </Label>
          <div className="flex flex-wrap gap-2">
            {vibes.map((vibe) => (
              <motion.div key={vibe.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge
                  variant={filters.vibe === vibe.id ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-lg text-sm", // Added rounded-lg, updated size
                    filters.vibe === vibe.id
                      ? "bg-brand-primary hover:bg-brand-accent-dark text-white" // Updated selected style
                      : "border-brand-accent-medium hover:bg-brand-accent-medium/20 text-brand-accent-dark", // Updated unselected style
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
          className="flex items-center justify-between p-3 rounded-xl bg-brand-accent-medium/10 border border-brand-accent-medium/30" /* Updated styles */
          whileHover={{ scale: 1.01 }}
        >
          <Label htmlFor="open-now" className="text-brand-text font-medium flex items-center text-sm"> {/* Updated color & size */}
            <Zap className="h-4 w-4 mr-2 text-brand-primary" /> {/* Updated color */}
            Open Right Now
          </Label>
          <Switch
            id="open-now"
            checked={filters.openNow}
            onCheckedChange={(checked) => updateFilter("openNow", checked)}
            // Switch should use brand colors from its own UI component styling (assuming ui/switch is updated or uses CSS vars)
          />
        </motion.div>

        {/* Distance */}
        <motion.div className="space-y-3" whileHover={{ scale: 1.01 }}>
          <Label className="text-brand-text font-medium flex items-center justify-between text-sm"> {/* Updated color & size */}
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-brand-primary" /> {/* Updated color */}
              Distance
            </span>
            <Badge variant="outline" className="bg-brand-accent-medium/20 text-brand-accent-dark border-brand-accent-medium rounded-md text-xs"> {/* Updated styles & size */}
              {filters.distance} km
            </Badge>
          </Label>
          <div className="px-1"> {/* Reduced padding for slider track */}
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => updateFilter("distance", value[0])}
              max={10}
              min={0.1}
              step={0.1}
              className="w-full" // Slider should use brand colors from its own UI component styling
            />
            <div className="flex justify-between text-xs text-brand-accent-dark mt-1"> {/* Updated color */}
              <span>0.1km</span>
              <span>10km</span>
            </div>
          </div>
        </motion.div>

        {/* Rating */}
        <motion.div className="space-y-3" whileHover={{ scale: 1.01 }}>
          <Label className="text-brand-text font-medium flex items-center justify-between text-sm"> {/* Updated color & size */}
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-brand-secondary" /> {/* Updated color */}
              Minimum Rating
            </span>
            <Badge variant="outline" className="bg-brand-secondary/20 text-brand-secondary border-brand-secondary/50 rounded-md text-xs"> {/* Updated styles & size */}
              {filters.rating > 0 ? `${filters.rating}+ ⭐` : "Any ⭐"}
            </Badge>
          </Label>
          <div className="px-1"> {/* Reduced padding for slider track */}
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => updateFilter("rating", value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full" // Slider should use brand colors from its own UI component styling
            />
            <div className="flex justify-between text-xs text-brand-accent-dark mt-1"> {/* Updated color */}
              <span>Any</span>
              <span>5⭐</span>
            </div>
          </div>
        </motion.div>

        {/* Clear Filters */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="w-full border-brand-accent-medium text-brand-accent-dark hover:bg-brand-accent-medium/20 hover:border-brand-accent-dark rounded-lg text-sm shadow-soft-sm" /* Updated styles & size */
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
            Reset Filters ✨
          </Button>
        </motion.div>

        {/* Fun Stats Removed */}
      </div>
    </div>
  )
}
