"use client"

import { useState } from "react"
import { MapView } from "@/components/map-view"
import { FilterSidebar } from "@/components/filter-sidebar"
import { PlaceCardList } from "@/components/place-card-list"
import { PlaceDetailModal } from "@/components/place-detail-modal"
import { AuthModal } from "@/components/auth-modal"
import { Navigation } from "@/components/navigation"
import { ChatModal } from "@/components/chat-modal"
import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import { Filter, X, Sparkles, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock data for places with more fun elements
const mockPlaces = [
  {
    id: "1",
    name: "Brew & Beans Coffee ☕",
    category: "cafe",
    rating: 4.5,
    distance: 0.2,
    image: "/placeholder.svg?height=200&width=300",
    description: "Cozy coffee shop with artisanal brews and homemade pastries. Free WiFi and cute cats! 🐱",
    address: "123 Main St",
    hours: "Open until 9 PM",
    tags: ["coffee", "pastries", "wifi", "cat-friendly"],
    coordinates: { lat: 40.7128, lng: -74.006 },
    isOpen: true,
    vibe: "cozy",
    funFact: "They have a resident cat named Espresso! 🐾",
    reviews: [
      {
        id: "1",
        user: "Sarah M.",
        rating: 5,
        comment: "Amazing coffee and Espresso the cat is adorable! 😻",
        date: "2024-01-15",
      },
      {
        id: "2",
        user: "Mike R.",
        rating: 4,
        comment: "Great atmosphere for working. The cat approved my laptop setup! 💻",
        date: "2024-01-14",
      },
    ],
  },
  {
    id: "2",
    name: "The Jazz Corner 🎷",
    category: "bar",
    rating: 4.8,
    distance: 0.5,
    image: "/placeholder.svg?height=200&width=300",
    description: "Intimate jazz bar with live music every weekend. Cocktails that hit different notes! 🎵",
    address: "456 Music Ave",
    hours: "Open until 2 AM",
    tags: ["jazz", "cocktails", "live music", "date night"],
    coordinates: { lat: 40.7589, lng: -73.9851 },
    isOpen: true,
    vibe: "romantic",
    funFact: "The bartender can play saxophone while mixing drinks! 🎺",
    reviews: [
      {
        id: "3",
        user: "Emma L.",
        rating: 5,
        comment: "Best jazz venue in the city! The saxophone cocktail show is WILD! 🔥",
        date: "2024-01-16",
      },
    ],
  },
  {
    id: "3",
    name: "Grand Plaza Hotel 🏨",
    category: "hotel",
    rating: 4.2,
    distance: 1.2,
    image: "/placeholder.svg?height=200&width=300",
    description: "Luxury hotel in the heart of downtown. Rooftop pool with city views! 🏙️",
    address: "789 Downtown Blvd",
    hours: "24/7",
    tags: ["luxury", "downtown", "business", "rooftop"],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    isOpen: true,
    vibe: "luxurious",
    funFact: "The elevator plays different music based on your floor destination! 🎶",
    reviews: [],
  },
  {
    id: "4",
    name: "Ocean Waves Club 🌊",
    category: "music",
    rating: 4.6,
    distance: 0.8,
    image: "/placeholder.svg?height=200&width=300",
    description: "Beachside club with ocean vibes! Where the waves meet the beats! 🏄‍♀️",
    address: "321 Seaside Avenue",
    hours: "Open until 4 AM",
    tags: ["electronic", "dancing", "ocean", "party"],
    coordinates: { lat: 40.7614, lng: -73.9776 },
    isOpen: true,
    vibe: "electric",
    funFact: "The dance floor has real sand and the ceiling projects ocean waves! 🌊",
    reviews: [
      { id: "4", user: "DJ Alex", rating: 5, comment: "The ocean vibes are INCREDIBLE! 🌊💙", date: "2024-01-17" },
    ],
  },
]

export default function HomePage() {
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [discoveryStreak, setDiscoveryStreak] = useState(3)
  const [showCelebration, setShowCelebration] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    openNow: false,
    distance: 5,
    rating: 0,
    search: "",
    vibe: "all",
  })

  const filteredPlaces = mockPlaces.filter((place) => {
    if (filters.category !== "all" && place.category !== filters.category) return false
    if (filters.openNow && !place.isOpen) return false
    if (place.distance > filters.distance) return false
    if (place.rating < filters.rating) return false
    if (filters.search && !place.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.vibe !== "all" && place.vibe !== filters.vibe) return false
    return true
  })

  const handlePlaceSelect = (place: any) => {
    setSelectedPlace(place)
    // Trigger celebration for discovering new places
    if (Math.random() > 0.7) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  const handleJoinChat = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setShowChat(true)
  }

  const handleLogin = (userData: any) => {
    setUser(userData)
    setShowAuth(false)
    setDiscoveryStreak(discoveryStreak + 1)
  }

  if (showProfile) {
    return (
      <div className="min-h-screen bg-brand-background">
        <Navigation
          user={user}
          onAuthClick={() => setShowAuth(true)}
          onProfileClick={() => setShowProfile(false)}
          discoveryStreak={discoveryStreak}
        />
        <UserProfile user={user} onBack={() => setShowProfile(false)} discoveryStreak={discoveryStreak} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-background relative overflow-hidden">
      {/* Floating background elements removed */}

      <Navigation
        user={user}
        onAuthClick={() => setShowAuth(true)}
        onProfileClick={() => setShowProfile(true)}
        discoveryStreak={discoveryStreak}
      />

      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onFiltersChange={setFilters} className="w-80" />
        </div>

        {/* Mobile Filter Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-y-0 left-0 w-80 bg-brand-background/95 backdrop-blur-xl"
              >
              <div className="flex items-center justify-between p-4 border-b border-brand-accent-medium">
                <h2 className="text-lg font-semibold text-brand-text flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-brand-secondary" />
                    Discovery Filters
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <FilterSidebar filters={filters} onFiltersChange={setFilters} className="h-full" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Map View */}
          <div className="flex-1 relative">
            <MapView places={filteredPlaces} onPlaceSelect={handlePlaceSelect} selectedPlace={selectedPlace} />

            {/* Mobile Filter Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden absolute top-4 left-4"
            >
              <Button
                className="bg-brand-background/90 backdrop-blur-xl text-brand-text hover:bg-brand-background shadow-soft-md border border-brand-accent-medium rounded-lg" // Added rounded-lg
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4 mr-2 text-brand-primary" />
                Discover ✨
              </Button>
            </motion.div>

            {/* Discovery Streak */}
            {discoveryStreak > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute top-4 right-4 bg-gradient-to-r from-brand-primary to-brand-accent-dark text-white px-4 py-2 rounded-full shadow-soft-lg"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">{discoveryStreak} day streak! ✨</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Place Cards - Desktop */}
          <div className="hidden lg:block w-96 border-l border-brand-accent-medium">
            <PlaceCardList places={filteredPlaces} onPlaceSelect={handlePlaceSelect} selectedPlace={selectedPlace} />
          </div>
        </div>

        {/* Mobile Place Cards */}
        <div className="lg:hidden">
          <PlaceCardList
            places={filteredPlaces}
            onPlaceSelect={handlePlaceSelect}
            selectedPlace={selectedPlace}
            className="absolute bottom-0 left-0 right-0 max-h-[40vh]"
          />
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 1, repeat: 2 }} className="text-6xl">
              🎉
            </motion.div>
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="absolute text-2xl font-bold text-brand-primary bg-brand-background/90 backdrop-blur-xl px-6 py-3 rounded-full shadow-soft-xl"
            >
              New Discovery! 🎉
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          isOpen={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onJoinChat={handleJoinChat}
          user={user}
        />
      )}

      {showAuth && <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onLogin={handleLogin} />}

      {showChat && selectedPlace && (
        <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} place={selectedPlace} user={user} />
      )}
    </div>
  )
}
