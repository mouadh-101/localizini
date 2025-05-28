"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlaceCard } from "@/components/place-card"
import { cn } from "@/lib/utils"
import { MapOff, AlertTriangle } from "lucide-react" 
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton
import { Place } from "@/app/page"; // Import Place type from page.tsx (adjust path if moved)

// Skeleton component for PlaceCard
function PlaceCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-soft-md border border-brand-accent-medium/20 overflow-hidden">
      <Skeleton className="w-full h-40 bg-brand-accent-medium/20" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-6 w-3/4 bg-brand-accent-medium/20" />
        <Skeleton className="h-4 w-full bg-brand-accent-medium/20" />
        <Skeleton className="h-4 w-5/6 bg-brand-accent-medium/20" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-1/4 bg-brand-accent-medium/20" />
          <Skeleton className="h-5 w-1/4 bg-brand-accent-medium/20" />
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          <Skeleton className="h-5 w-16 bg-brand-accent-medium/20 rounded-md" />
          <Skeleton className="h-5 w-20 bg-brand-accent-medium/20 rounded-md" />
          <Skeleton className="h-5 w-12 bg-brand-accent-medium/20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

interface PlaceCardListProps {
  places: Place[]; // Use imported Place type
  onPlaceSelect: (place: Place) => void; // Use imported Place type
  selectedPlace?: Place | null; // Use imported Place type
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

export function PlaceCardList({ 
  places, 
  onPlaceSelect, 
  selectedPlace, 
  className, 
  isLoading, 
  error 
}: PlaceCardListProps) {
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, index) => ( // Render 3 skeletons
            <PlaceCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12 text-red-600 flex flex-col items-center space-y-2">
          <AlertTriangle className="h-12 w-12 text-red-500/70" />
          <p className="font-medium text-lg">Error loading places</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (places.length === 0) {
      return (
        <div className="text-center py-12 text-brand-accent-dark flex flex-col items-center space-y-2">
          <MapOff className="h-12 w-12 text-brand-accent-dark/70" />
          <p className="font-medium text-lg">No amazing places found...</p>
          <p className="text-sm">Try adjusting your filters or exploring a new area!</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-4">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isSelected={selectedPlace?.id === place.id}
            onClick={() => onPlaceSelect(place)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("bg-brand-background flex flex-col h-full", className)}> {/* Ensure h-full for ScrollArea */}
      <div className="p-4 border-b border-brand-accent-medium/50">
        <h2 className="text-lg font-semibold text-brand-text">
          {isLoading ? "Loading places..." : error ? "Error" : `${places.length} ${places.length === 1 ? "place" : "places"} found`}
        </h2>
      </div>
      <ScrollArea className="flex-1"> {/* Allow ScrollArea to take remaining height */}
        {renderContent()}
      </ScrollArea>
    </div>
  )
}
