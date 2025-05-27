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
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[#032539]">Profile</h1>
      </div>

      {/* Profile Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#1C768F] text-white text-xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#032539]">{user?.name || "User"}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{visitedPlaces.length} places visited</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>12 reviews</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="border-[#1C768F] text-[#1C768F]">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#1C768F]">{visitedPlaces.length}</div>
            <div className="text-sm text-gray-600">Places Visited</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-[#FA991C]">12</div>
            <div className="text-sm text-gray-600">Reviews Written</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Saved Places</div>
          </CardContent>
        </Card>
      </div>

      {/* Visited Places */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#032539] flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Recently Visited
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visitedPlaces.map((place) => (
              <div key={place.id} className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200">
                <img
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-[#032539]">{place.name}</h3>
                  <p className="text-sm text-gray-600">Visited on {place.visitDate}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 fill-[#FA991C] text-[#FA991C]" />
                    <span className="text-sm font-medium">{place.rating}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {place.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#032539] flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="text-[#032539]">
              Push Notifications
            </Label>
            <Switch id="notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="location" className="text-[#032539]">
              Location Services
            </Label>
            <Switch id="location" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing" className="text-[#032539]">
              Marketing Emails
            </Label>
            <Switch id="marketing" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
