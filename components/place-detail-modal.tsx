"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, MapPin, Clock, MessageCircle, Share, Bookmark, Users } from "lucide-react"
import { useState } from "react"

interface PlaceDetailModalProps {
  place: any
  isOpen: boolean
  onClose: () => void
  onJoinChat: () => void
  user?: any
}

export function PlaceDetailModal({ place, isOpen, onClose, onJoinChat, user }: PlaceDetailModalProps) {
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(5)

  const handleSubmitReview = () => {
    if (!user) return
    // Handle review submission
    setNewReview("")
    setRating(5)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <div className="relative">
          <img
            src={place.image || "/placeholder.svg"}
            alt={place.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="bg-white/80 hover:bg-white">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl text-[#032539]">{place.name}</DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-[#FA991C] text-[#FA991C]" />
                  <span className="font-medium">{place.rating}</span>
                  <span>({place.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{place.distance} km away</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-gray-700">{place.description}</p>

              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{place.hours}</span>
                {place.isOpen && <Badge className="bg-green-500 hover:bg-green-500">Open</Badge>}
              </div>

              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Chat Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#032539] flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Chat with visitors
                </h3>
                <Badge variant="outline">3 online</Badge>
              </div>
              <Button onClick={onJoinChat} className="w-full bg-[#1C768F] hover:bg-[#1C768F]/90">
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Chat Room
              </Button>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-[#032539] mb-4">Reviews</h3>

              {user && (
                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Your rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                          <Star
                            className={`h-4 w-4 ${star <= rating ? "fill-[#FA991C] text-[#FA991C]" : "text-gray-300"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Share your experience..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="resize-none"
                  />
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!newReview.trim()}
                    className="bg-[#FA991C] hover:bg-[#FA991C]/90"
                  >
                    Post Review
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {place.reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#032539]">{review.user}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating ? "fill-[#FA991C] text-[#FA991C]" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))}

                {place.reviews.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No reviews yet. Be the first to share your experience!
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
