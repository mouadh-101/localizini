"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { PlaceCard } from "@/components/place-card"
import { cn } from "@/lib/utils"

interface PlaceCardListProps {
  places: any[]
  onPlaceSelect: (place: any) => void
  selectedPlace?: any
  className?: string
}

export function PlaceCardList({ places, onPlaceSelect, selectedPlace, className }: PlaceCardListProps) {
  return (
    <div className={cn("bg-white", className)}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#032539]">{places.length} places found</h2>
      </div>

      <ScrollArea className="h-full">
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
            <div className="text-center py-8 text-gray-500">
              <p>No places found matching your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
