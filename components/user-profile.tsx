"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, Star, Settings, MessageCircle, CalendarDays, Loader2 } from "lucide-react" // Added CalendarDays, Loader2
import { useAuth } from "@/contexts/AuthContext" // Import useAuth
import { Skeleton } from "@/components/ui/skeleton" // Import Skeleton

interface UserProfileProps {
  // user prop removed, will use auth.user from context
  onBack: () => void;
}

const visitedPlaces = [ // TODO: Replace with actual data fetching in a future task
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

function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full bg-brand-accent-medium/20" />
        <Skeleton className="h-8 w-32 bg-brand-accent-medium/20" />
      </div>
      <Card className="bg-white rounded-2xl shadow-soft-lg border border-brand-accent-medium/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <Skeleton className="h-24 w-24 rounded-full bg-brand-accent-medium/20 mb-4 sm:mb-0" />
            <div className="flex-1 text-center sm:text-left space-y-2">
              <Skeleton className="h-7 w-48 bg-brand-accent-medium/20" />
              <Skeleton className="h-5 w-64 bg-brand-accent-medium/20" />
              <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3">
                <Skeleton className="h-5 w-24 bg-brand-accent-medium/20" />
                <Skeleton className="h-5 w-20 bg-brand-accent-medium/20" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 bg-brand-accent-medium/20 rounded-lg mt-4 sm:mt-0" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-brand-accent-medium/10 p-5 rounded-xl text-center border-none shadow-soft-sm">
            <CardContent className="p-0 space-y-1">
              <Skeleton className="h-8 w-12 mx-auto bg-brand-accent-medium/30" />
              <Skeleton className="h-5 w-28 mx-auto bg-brand-accent-medium/30" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Skeletons for Visited Places and Settings can be added if desired for more complete loading state */}
       <Card className="bg-white rounded-2xl shadow-soft-lg border border-brand-accent-medium/20">
        <CardHeader className="p-5 border-b border-brand-accent-medium/20">
          <Skeleton className="h-6 w-40 bg-brand-accent-medium/20" />
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <Skeleton className="h-16 w-full bg-brand-accent-medium/20 rounded-xl" />
          <Skeleton className="h-16 w-full bg-brand-accent-medium/20 rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user, isLoading: authIsLoading } = useAuth(); // Use isLoading from auth context

  // This isLoading is for initial auth check. Data specific loading can be added for visited places etc.
  if (authIsLoading && !user) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 sm:p-8 text-center">
        <h1 className="text-2xl font-semibold text-brand-primary mb-4">Profile</h1>
        <p className="text-brand-text">Please log in to view your profile.</p>
        {/* Optionally, add a login button here that calls onAuthClick from app/page.tsx if needed */}
      </div>
    );
  }
  
  // Use user data from context
  const discoveryStreak = user.discoveryStreak || 0;
  const visitedPlacesCount = user.visitedPlacesCount || 0;
  const reviewsCount = user.reviewsCount || 0;
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';


  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8"> 
      {/* Header */}
      <div className="flex items-center space-x-3"> 
        <Button variant="ghost" onClick={onBack} className="p-2 rounded-full text-brand-primary hover:bg-brand-accent-medium/20">
          <ArrowLeft className="h-6 w-6" /> 
        </Button>
        <h1 className="text-3xl font-bold text-brand-primary">Profile</h1> 
      </div>

      {/* Profile Info */}
      <Card className="bg-white rounded-2xl shadow-soft-lg border border-brand-accent-medium/20"> 
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
            <Avatar className="h-24 w-24 ring-4 ring-brand-secondary ring-offset-2 ring-offset-white mb-4 sm:mb-0"> 
              <AvatarImage src={user.avatarUrl || "/placeholder-user.jpg"} /> {/* Use user.avatarUrl */}
              <AvatarFallback className="bg-brand-primary text-white text-3xl"> 
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-brand-primary">{user.name}</h2> 
              <p className="text-brand-text text-sm">{user.email}</p> 
              <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3 text-sm text-brand-text"> 
                <div className="flex items-center space-x-1">
                  <CalendarDays className="h-4 w-4 text-brand-accent-dark" /> {/* Joined Date */}
                  <span>Joined {joinDate}</span>
                </div>
                {/* Example of other stats if available directly on user object from context */}
                {/* <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-brand-accent-dark" /> 
                  <span>{visitedPlacesCount} places visited</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4 text-brand-accent-dark" /> 
                  <span>{reviewsCount} reviews</span> 
                </div> */}
              </div>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0 border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-lg text-sm px-4 py-2 shadow-soft-sm"> 
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> 
        <Card className="bg-brand-accent-medium/10 p-5 rounded-xl text-center border-none shadow-soft-sm"> 
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-brand-primary">{discoveryStreak}</div>
              <div className="text-sm text-brand-text mt-1">Day Streak 🔥</div>
            </CardContent>
        </Card>
        <Card className="bg-brand-accent-medium/10 p-5 rounded-xl text-center border-none shadow-soft-sm"> 
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-brand-primary">{visitedPlacesCount}</div> {/* Use user.visitedPlacesCount */}
              <div className="text-sm text-brand-text mt-1">Places Visited</div>
            </CardContent>
        </Card>
        <Card className="bg-brand-accent-medium/10 p-5 rounded-xl text-center border-none shadow-soft-sm"> 
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-brand-primary">{reviewsCount}</div> {/* Use user.reviewsCount */}
              <div className="text-sm text-brand-text mt-1">Reviews Written</div>
            </CardContent>
        </Card>
      </div>

      {/* Visited Places - TODO: Fetch real data or use data from user object if available */}
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
