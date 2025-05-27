"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, Star, Settings, MessageCircle } from "lucide-react"

interface UserProfileProps {
  user: any
  onBack: () => void
}

const visitedPlaces = [
  {
    id: "1",
    name: "Brew & Beans Coffee",
    category: "cafe",
    visitDate: "2024-01-15",
    rating: 5,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "The Jazz Corner",
    category: "bar",
    visitDate: "2024-01-10",
    rating: 4,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function UserProfile({ user, onBack }: UserProfileProps) {
  // Mock discovery streak for display if not part of user prop
  const discoveryStreak = user?.discoveryStreak || 5; // Example value

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8"> {/* Increased padding and spacing */}
      {/* Header */}
      <div className="flex items-center space-x-3"> {/* Reduced space for tighter back button */}
        <Button variant="ghost" onClick={onBack} className="p-2 rounded-full text-brand-primary hover:bg-brand-accent-medium/20">
          <ArrowLeft className="h-6 w-6" /> {/* Slightly larger icon */}
        </Button>
        <h1 className="text-3xl font-bold text-brand-primary">Profile</h1> {/* Updated styling */}
      </div>

      {/* Profile Info */}
      <Card className="bg-white rounded-2xl shadow-soft-lg border border-brand-accent-medium/20"> {/* Updated card styling */}
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <Avatar className="h-24 w-24 ring-4 ring-brand-secondary ring-offset-2 ring-offset-white mb-4 sm:mb-0"> {/* Updated avatar styling */}
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-brand-primary text-white text-3xl"> {/* Updated fallback styling */}
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-brand-primary">{user?.name || "Anonymous Explorer"}</h2> {/* Updated styling */}
              <p className="text-brand-text text-sm">{user?.email || "explorer@localizini.app"}</p> {/* Updated styling */}
              <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3 text-sm text-brand-text"> {/* Updated styling */}
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-brand-accent-dark" /> {/* Updated icon color */}
                  <span>{visitedPlaces.length} places visited</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4 text-brand-accent-dark" /> {/* Updated icon color */}
                  <span>12 reviews</span> {/* Mocked value */}
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0 border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-lg text-sm px-4 py-2 shadow-soft-sm"> {/* Updated styling */}
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Increased gap */}
        {/* Discovery Streak Stat - Added as per brief */}
        <Card className="bg-brand-accent-medium/10 p-5 rounded-xl text-center border-none shadow-soft-sm"> {/* Updated styling */}
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-brand-primary">{discoveryStreak}</div>
              <div className="text-sm text-brand-text mt-1">Day Streak 🔥</div>
            </CardContent>
        </Card>
        <Card className="bg-brand-accent-medium/10 p-5 rounded-xl text-center border-none shadow-soft-sm"> {/* Updated styling */}
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-brand-primary">{visitedPlaces.length}</div>
              <div className="text-sm text-brand-text mt-1">Places Visited</div>
            </CardContent>
        </Card>
        <Card className="bg-brand-accent-medium/10 p-5 rounded-xl text-center border-none shadow-soft-sm"> {/* Updated styling */}
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-brand-primary">12</div> {/* Mocked value */}
              <div className="text-sm text-brand-text mt-1">Reviews Written</div>
            </CardContent>
        </Card>
        {/* Saved Places stat can be added if needed, current code has 3 stats */}
      </div>

      {/* Visited Places */}
      <Card className="bg-white rounded-2xl shadow-soft-lg border border-brand-accent-medium/20"> {/* Updated card styling */}
        <CardHeader className="p-5 border-b border-brand-accent-medium/20"> {/* Added border, adjusted padding */}
          <CardTitle className="text-brand-primary text-xl font-semibold flex items-center"> {/* Updated styling */}
            <MapPin className="h-5 w-5 mr-2 text-brand-primary" /> {/* Updated icon color */}
            Recently Visited
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          {visitedPlaces.length > 0 ? (
            <div className="space-y-4">
              {visitedPlaces.map((place) => (
                <div key={place.id} className="flex items-center space-x-4 p-3 rounded-xl border border-brand-accent-medium/30 hover:shadow-soft-md transition-shadow bg-brand-background/50"> {/* Updated item styling */}
                  <img
                    src={place.image || "/placeholder.svg"}
                    alt={place.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-primary">{place.name}</h3> {/* Updated styling */}
                    <p className="text-sm text-brand-text">Visited on {place.visitDate}</p> {/* Updated styling */}
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="h-4 w-4 fill-brand-secondary text-brand-secondary" /> {/* Updated styling */}
                      <span className="text-sm font-medium text-brand-text">{place.rating}</span> {/* Updated styling */}
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize bg-brand-accent-medium/20 text-brand-accent-dark rounded-md text-xs"> {/* Updated styling */}
                    {place.category}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-brand-text py-4">No places visited yet. Time to explore!</p>
          )}
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-white rounded-2xl shadow-soft-lg border border-brand-accent-medium/20"> {/* Updated card styling */}
        <CardHeader className="p-5 border-b border-brand-accent-medium/20"> {/* Added border, adjusted padding */}
          <CardTitle className="text-brand-primary text-xl font-semibold flex items-center"> {/* Updated styling */}
            <Settings className="h-5 w-5 mr-2 text-brand-primary" /> {/* Updated icon color */}
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5"> {/* Adjusted padding and spacing */}
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-brand-text font-medium text-sm"> {/* Updated styling */}
              Push Notifications
              <p className="text-xs text-brand-accent-dark mt-0.5">Get updates on new places and community activity.</p> {/* Added description */}
            </Label>
            <Switch id="notifications" defaultChecked /> {/* Switch will use brand colors if ui/switch is updated */}
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="location" className="text-brand-text font-medium text-sm"> {/* Updated styling */}
              Location Services
              <p className="text-xs text-brand-accent-dark mt-0.5">Allow Localizini to suggest nearby places.</p> {/* Added description */}
            </Label>
            <Switch id="location" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing" className="text-brand-text font-medium text-sm"> {/* Updated styling */}
              Marketing Emails
              <p className="text-xs text-brand-accent-dark mt-0.5">Receive occasional news and promotional offers.</p> {/* Added description */}
            </Label>
            <Switch id="marketing" />
          </div>
          {/* Added Data Export and Privacy Policy buttons as per brief */}
          <div className="pt-4 border-t border-brand-accent-medium/20 space-y-3">
             <Button variant="outline" className="w-full justify-start text-left border-brand-accent-medium text-brand-text hover:bg-brand-accent-medium/20 rounded-lg text-sm">
                Export My Data
             </Button>
             <Button variant="outline" className="w-full justify-start text-left border-brand-accent-medium text-brand-text hover:bg-brand-accent-medium/20 rounded-lg text-sm">
                Privacy Policy
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
