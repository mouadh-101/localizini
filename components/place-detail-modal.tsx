"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, MapPin, Clock, MessageCircle, Share, Bookmark, Users, XIcon, ImageOff, AlertTriangle, Loader2 } from "lucide-react" 
import { useState, useEffect, useCallback } from "react" 
import { useAuth } from "@/contexts/AuthContext"; 
import apiClient from "@/lib/api"; 
import { Place } from "@/app/page"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { toast } from "sonner"; // Import toast

// Define Comment interface
export interface Comment {
  id: string;
  user: { // Assuming user object is nested; adjust if flat
    id: string;
    name: string;
    avatarUrl?: string;
  };
  text: string;
  rating: number;
  createdAt: string; // Or Date object, adjust based on API
}

// Skeleton for individual comment
function CommentSkeleton() {
  return (
    <div className="flex space-x-3 py-3 border-b border-brand-accent-medium/30">
      <Skeleton className="h-8 w-8 rounded-full bg-brand-accent-medium/20" />
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 bg-brand-accent-medium/20" />
          <Skeleton className="h-3 w-16 bg-brand-accent-medium/20" />
        </div>
        <Skeleton className="h-4 w-12 bg-brand-accent-medium/20" /> {/* For stars */}
        <Skeleton className="h-12 w-full bg-brand-accent-medium/20" /> {/* Comment text */}
      </div>
    </div>
  );
}


interface PlaceDetailModalProps {
  place: Place; 
  isOpen: boolean;
  onClose: () => void;
  onJoinChat: () => void; 
  onAuthRequired: () => void; 
}

export function PlaceDetailModal({ place, isOpen, onClose, onJoinChat, onAuthRequired }: PlaceDetailModalProps) {
  const { user } = useAuth(); 
  const [newCommentText, setNewCommentText] = useState(""); // Renamed from newReview
  const [newRating, setNewRating] = useState(5); // Renamed from rating

  const [detailedPlaceData, setDetailedPlaceData] = useState<Place | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [isPostingComment, setIsPostingComment] = useState(false);

  const fetchPlaceDetails = useCallback(async (placeId: string) => {
    setIsLoadingDetails(true);
    setDetailsError(null);
    try {
      const response = await apiClient.get(`/places/${placeId}`);
      setDetailedPlaceData(response.data.place || response.data);
    } catch (error) {
      console.error("Failed to fetch place details:", error);
      setDetailsError("Could not load place details. Please try again.");
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  const fetchComments = useCallback(async (placeId: string) => {
    setIsLoadingComments(true);
    setCommentsError(null);
    try {
      const response = await apiClient.get(`/places/${placeId}/comments`);
      // Assuming API returns { comments: Comment[] } or Comment[]
      setComments(response.data.comments || response.data || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setCommentsError("Could not load comments.");
      setComments([]); // Clear comments on error
    } finally {
      setIsLoadingComments(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && place?.id) {
      fetchPlaceDetails(place.id);
      fetchComments(place.id); // Fetch comments when modal opens or place changes
    } else if (!isOpen) {
      // Reset states when modal closes to ensure fresh data next time
      setDetailedPlaceData(null);
      setComments([]);
      setNewCommentText("");
      setNewRating(5);
      setDetailsError(null);
      setCommentsError(null);
    }
  }, [isOpen, place?.id, fetchPlaceDetails, fetchComments]);
  
  const currentPlace = detailedPlaceData || place;

  const handleJoinChatClick = () => {
    if (!user) {
      onAuthRequired(); 
    } else {
      onJoinChat(); 
    }
  };

  const handlePostComment = async () => { // Renamed and made async
    if (!user) {
      onAuthRequired(); 
      return;
    }
    if (!newCommentText.trim()) return;

    setIsPostingComment(true);
    setCommentsError(null); // Clear previous comment errors
    try {
      // Use currentPlace.id which could be from initial prop or detailed fetch
      const response = await apiClient.post(`/places/${currentPlace.id}/comments`, { 
        text: newCommentText, 
        rating: newRating 
      });
      // Option 1: Re-fetch all comments
      fetchComments(currentPlace.id); 
      // Option 2 (Optimistic update, more complex):
      // setComments(prevComments => [response.data.comment || response.data, ...prevComments]); // Example of optimistic update
      setNewCommentText("");
      setNewRating(5);
      toast.success("Comment posted successfully!");
    } catch (error: any) {
      console.error("Failed to post comment:", error);
      const apiErrorMessage = error.response?.data?.message || "Failed to post comment. Please try again.";
      setCommentsError(apiErrorMessage); // Keep inline error for context, or create a specific postCommentError state
      toast.error("Failed to post comment", { description: apiErrorMessage });
    } finally {
      setIsPostingComment(false);
    }
  };

      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-brand-background rounded-2xl shadow-soft-xl border-none overflow-hidden">
        <DialogClose className="absolute right-4 top-4 z-10 text-brand-text hover:text-brand-primary hover:bg-brand-accent-medium/20 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-background">
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="relative">
          <img
            src={place.image || "/placeholder.svg"}
            alt={currentPlace.name}
            className="w-full h-60 object-cover" 
          />
          {isLoadingDetails && <Skeleton className="absolute inset-0 w-full h-60 bg-brand-accent-medium/30" />}
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
            {detailsError && (
              <div className="text-center py-10 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-2" />
                <p className="font-semibold">Error</p>
                <p className="text-sm">{detailsError}</p>
              </div>
            )}

            <DialogHeader className="pt-0"> 
              <DialogTitle className="text-2xl font-semibold text-brand-primary">
                {isLoadingDetails && !detailedPlaceData ? <Skeleton className="h-8 w-3/4 bg-brand-accent-medium/30" /> : currentPlace.name}
              </DialogTitle>
              <div className="flex items-center space-x-4 text-sm text-brand-text">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-brand-secondary text-brand-secondary" />
                  {isLoadingDetails && !detailedPlaceData ? <Skeleton className="h-4 w-12 bg-brand-accent-medium/30" /> : <>
                    <span className="font-medium">{currentPlace.rating}</span>
                  {/* Use comments.length if reviews are primarily managed by the new comments state */}
                  <span className="text-brand-accent-dark">({(isLoadingComments ? "..." : comments.length) || currentPlace.reviews?.length || 0} reviews)</span>
                  </>}
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-brand-accent-dark" />
                  {isLoadingDetails && !detailedPlaceData ? <Skeleton className="h-4 w-20 bg-brand-accent-medium/30" /> : 
                    (currentPlace.distance ? <span>{currentPlace.distance} km away</span> : <span className="text-brand-accent-dark">Distance N/A</span>)
                  }
                </div>
              </div>
            </DialogHeader>

            {isLoadingDetails && !detailedPlaceData ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full bg-brand-accent-medium/30" /> {/* Description */}
                <Skeleton className="h-6 w-1/2 bg-brand-accent-medium/30" /> {/* Hours */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20 bg-brand-accent-medium/30 rounded-md" />
                  <Skeleton className="h-6 w-24 bg-brand-accent-medium/30 rounded-md" />
                  <Skeleton className="h-6 w-16 bg-brand-accent-medium/30 rounded-md" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-brand-text leading-relaxed">{currentPlace.description}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-brand-accent-dark" />
                  <span className="text-brand-text">{currentPlace.hours || "Hours not available"}</span>
                  {currentPlace.isOpen !== undefined && <Badge className={`${currentPlace.isOpen ? "bg-brand-secondary text-brand-text" : "bg-gray-400 text-white"} rounded-md`}>{currentPlace.isOpen ? "Open" : "Closed"}</Badge>}
                </div>
                {currentPlace.tags && currentPlace.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentPlace.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-brand-accent-medium/20 text-brand-accent-dark rounded-md text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Chat Section - remains mostly the same, uses initial place.name for title */}
            <div className="border-t border-brand-accent-medium/30 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-brand-primary flex items-center">
                  <Users className="h-5 w-5 mr-2 text-brand-primary" />
                  Community Chat
                </h3>
                <Badge variant="outline" className="border-brand-accent-medium text-brand-accent-dark rounded-md">3 online</Badge>
              </div>
              <Button 
                onClick={handleJoinChatClick} 
                className="w-full bg-brand-primary text-primary-foreground hover:bg-brand-accent-dark rounded-lg text-sm py-3"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {user ? "Join Chat Room" : "Login to Chat"}
              </Button>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-brand-accent-medium/30 pt-6">
              <h3 className="text-xl font-semibold text-brand-primary mb-4">User Reviews</h3>

              {user ? ( // Show review form only if user is logged in
                <div className="space-y-3 mb-6 p-4 bg-brand-background/50 border border-brand-accent-medium/30 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-brand-text">Your rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setNewRating(star)} className="focus:outline-none">
                          <Star
                            className={`h-5 w-5 transition-colors ${star <= newRating ? "fill-brand-secondary text-brand-secondary" : "text-brand-accent-medium/50 hover:text-brand-secondary"}`}
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
                    onClick={handlePostComment}
                    disabled={!newCommentText.trim() || isPostingComment}
                    className="bg-brand-primary text-primary-foreground hover:bg-brand-accent-dark rounded-lg text-sm py-3 px-4 disabled:opacity-70"
                  >
                    {isPostingComment ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {isPostingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              )}
              {/* Display posting error specifically for comments, if not handled by toast or if toast is dismissed */}
              {commentsError && isPostingComment && ( // Only show if error happened during current posting attempt
                <p className="text-xs text-red-600 mt-1">{commentsError}</p>
              )}
            </div>
          )}

          {/* Display Comments List */}
          <div className="space-y-4">
            {isLoadingComments && (
              <>
                <CommentSkeleton />
                <CommentSkeleton />
                <CommentSkeleton />
              </>
            )}
            
            {/* General error for loading comments, not for posting */}
            {!isLoadingComments && commentsError && !isPostingComment && ( 
               <div className="text-center py-6 text-red-500 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="mx-auto h-8 w-8 text-red-400 mb-1" />
                  <p className="text-sm">{commentsError}</p>
                </div>
            )}
            {!isLoadingComments && !commentsError && comments.length > 0 && (
              comments.map((comment: Comment) => (
                <div key={comment.id} className="flex space-x-3 border-b border-brand-accent-medium/30 pb-4 last:border-b-0">
                   <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatarUrl || "/placeholder-user.jpg"} />
                    <AvatarFallback className="bg-brand-accent-medium/30 text-brand-text text-xs">
                      {comment.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-brand-text text-sm">{comment.user.name || "Anonymous"}</span>
                      <span className="text-xs text-brand-accent-dark">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < comment.rating ? "fill-brand-secondary text-brand-secondary" : "fill-brand-accent-medium/30 text-brand-accent-medium/30"}`}
                        />
                      ))}
                    </div>
                    <p className="text-brand-text text-sm leading-relaxed pt-1">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
            {!isLoadingComments && !commentsError && comments.length === 0 && (
              <>
                {user && (
                  <p className="text-brand-accent-dark text-center py-4 text-sm">
                    Be the first to share your experience!
                  </p>
                )}
                {!user && (
                  <p className="text-brand-accent-dark text-center py-4 text-sm">
                    No reviews yet. <button onClick={onAuthRequired} className="text-brand-primary hover:underline font-medium">Login to be the first!</button>
                  </p>
                )}
              </>
            )}
             {/* Message for logged-out users if reviews exist but they can't add one yet */}
            {!isLoadingComments && !commentsError && comments.length > 0 && !user && (
               <p className="text-brand-accent-dark text-center py-2 text-sm border-t border-brand-accent-medium/30 mt-4">
                <button onClick={onAuthRequired} className="text-brand-primary hover:underline font-medium">Login</button> to add your review.
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
