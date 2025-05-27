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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog" // Added DialogClose
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// ... other imports
import { Star, MapPin, Clock, MessageCircle, Share, Bookmark, Users, XIcon } from "lucide-react" // Added XIcon
import { useState } from "react"

// ... interface
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-brand-background rounded-2xl shadow-soft-xl border-none overflow-hidden"> {/* Added overflow-hidden */}
        <DialogClose className="absolute right-4 top-4 z-10 text-brand-text hover:text-brand-primary hover:bg-brand-accent-medium/20 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-background">
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="relative">
          <img
            src={place.image || "/placeholder.svg"}
            alt={place.name}
            className="w-full h-60 object-cover" // Removed rounded-t-2xl as DialogContent is overflow-hidden with rounded-2xl
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <Button variant="outline" size="icon" className="bg-brand-background/70 backdrop-blur-sm hover:bg-brand-background text-brand-text shadow-soft-sm rounded-full w-9 h-9 border-brand-accent-medium/30 hover:border-brand-accent-medium">
              <Share className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-brand-background/70 backdrop-blur-sm hover:bg-brand-background text-brand-text shadow-soft-sm rounded-full w-9 h-9 border-brand-accent-medium/30 hover:border-brand-accent-medium">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[calc(90vh-theme(spacing.60)-theme(spacing.10))]"> {/* Adjusted max-h to account for close button area if header is very short */}
          <div className="p-6 space-y-6">
            <DialogHeader className="pt-0"> {/* Removed default pt from header if DialogContent has p-0 and this div has p-6 */}
              <DialogTitle className="text-2xl font-semibold text-brand-primary">{place.name}</DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-brand-text">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-brand-secondary text-brand-secondary" />
                  <span className="font-medium">{place.rating}</span>
                  <span className="text-brand-accent-dark">({place.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-brand-accent-dark" />
                  <span className="text-brand-text">{place.distance} km away</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-brand-text leading-relaxed">{place.description}</p>

              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-brand-accent-dark" />
                <span className="text-brand-text">{place.hours}</span>
                {place.isOpen && <Badge className="bg-brand-secondary text-brand-text rounded-md">Open</Badge>}
              </div>

              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="bg-brand-accent-medium/20 text-brand-accent-dark rounded-md text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Chat Section */}
            <div className="border-t border-brand-accent-medium/30 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-brand-primary flex items-center">
                  <Users className="h-5 w-5 mr-2 text-brand-primary" />
                  Community Chat
                </h3>
                <Badge variant="outline" className="border-brand-accent-medium text-brand-accent-dark rounded-md">3 online</Badge>
              </div>
              <Button onClick={onJoinChat} className="w-full bg-brand-primary text-primary-foreground hover:bg-brand-accent-dark rounded-lg text-sm py-3">
                <MessageCircle className="h-4 w-4 mr-2" />
                Join Chat Room
              </Button>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-brand-accent-medium/30 pt-6">
              <h3 className="text-xl font-semibold text-brand-primary mb-4">User Reviews</h3>

              {user && (
                <div className="space-y-3 mb-6 p-4 bg-brand-background/50 border border-brand-accent-medium/30 rounded-xl"> {/* Changed bg and added border */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-brand-text">Your rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
                          <Star
                            className={`h-5 w-5 transition-colors ${star <= rating ? "fill-brand-secondary text-brand-secondary" : "text-brand-accent-medium/50 hover:text-brand-secondary"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Share your experience..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="resize-none border-brand-accent-medium focus:border-brand-primary focus:ring-brand-primary bg-brand-background/80 rounded-lg text-sm"
                  />
                  <Button
                    onClick={handleSubmitReview}
                    disabled={!newReview.trim()}
                    className="bg-brand-primary text-primary-foreground hover:bg-brand-accent-dark rounded-lg text-sm py-3 px-4" // Added py-3 and px-4 for consistent padding
                  >
                    Post Review
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                {place.reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-brand-accent-medium/30 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-brand-text">{review.user}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${ // Slightly larger review stars
                                star <= review.rating ? "fill-brand-secondary text-brand-secondary" : "text-brand-accent-medium/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-brand-accent-dark">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-brand-text text-sm leading-relaxed">{review.comment}</p>
                  </div>
                ))}

                {place.reviews.length === 0 && (
                  <p className="text-brand-accent-dark text-center py-4 text-sm">
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
