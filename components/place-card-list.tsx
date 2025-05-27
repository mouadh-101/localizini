"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlaceCard } from "@/components/place-card"
import { cn } from "@/lib/utils"
import { MapOff } from "lucide-react" // Added icon for no results

interface PlaceCardListProps {
  places: any[]
  onPlaceSelect: (place: any) => void
  selectedPlace?: any
  className?: string
}

export function PlaceCardList({ places, onPlaceSelect, selectedPlace, className }: PlaceCardListProps) {
  return (
    <div className={cn("bg-brand-background", className)}> {/* Updated background */}
      <div className="p-4 border-b border-brand-accent-medium/50"> {/* Updated border and text color */}
        <h2 className="text-lg font-semibold text-brand-text">
          {places.length} {places.length === 1 ? "place" : "places"} found
        </h2>
      </div>

      <ScrollArea className="h-full"> {/* Assuming h-full is appropriate for the layout */}
        <div className="p-4 space-y-4">
          {places.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              isSelected={selectedPlace?.id === place.id}
              onClick={() => onPlaceSelect(place)}
            />
          ))}

          {places.length === 0 && (
            <div className="text-center py-12 text-brand-accent-dark flex flex-col items-center space-y-2"> {/* Updated text color, padding, and layout */}
              <MapOff className="h-12 w-12 text-brand-accent-dark/70" /> {/* Added icon */}
              <p className="font-medium text-lg">No amazing places found...</p>
              <p className="text-sm">Try adjusting your filters or exploring a new area!</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
