"use client"

import type React from "react"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users, XIcon, Loader2, WifiOff } from "lucide-react" // Added Loader2, WifiOff
import { useState, useEffect, useRef } from "react" // Added useEffect, useRef
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Place } from "@/app/page"; // Assuming Place type is exported from app/page.tsx
import { User } from "@/contexts/AuthContext"; // Assuming User type is exported from AuthContext

// Hardcoded SOCKET_URL for now due to .env.local issues
const SOCKET_URL = 'http://localhost:3001'; 

interface ChatMessageUser {
  id: string;
  name: string;
  avatarUrl?: string;
}
export interface ChatMessage { // Exporting ChatMessage interface
  id: string;
  user: ChatMessageUser;
  text: string; // Changed from 'message' to 'text' to align with typical backend
  timestamp: string; // Or Date object
  roomId: string; // To ensure message is for this room
  // isOwn is determined on client-side
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place; // Use Place type
  // user prop removed, using from useAuth
}

export function ChatModal({ isOpen, onClose, place }: ChatModalProps) {
  const { user, token } = useAuth(); // Get user and token from AuthContext
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false); // New state for send button
  const scrollAreaRef = useRef<HTMLDivElement>(null); // For auto-scrolling

  useEffect(() => {
    if (isOpen && place?.id && user && token) {
      // Using hardcoded URL due to .env.local issues
      const newSocket = io(SOCKET_URL, {
        query: { token }, // Send token for authentication
        transports: ['websocket'] // Prefer websocket
      });
      setSocket(newSocket);
      setChatError(null); // Clear previous errors

      newSocket.on('connect', () => {
        console.log('Chat socket connected:', newSocket.id);
        setIsConnected(true);
        setChatError(null);
        newSocket.emit('joinRoom', { roomId: place.id });
        // Request past messages for the room
        newSocket.emit('requestPastMessages', { roomId: place.id }); 
      });

      newSocket.on('loadInitialMessages', (initialMessages: ChatMessage[]) => {
        console.log('Received initial messages:', initialMessages);
        setMessages(initialMessages.filter(msg => msg.roomId === place.id));
      });
      
      newSocket.on('newMessageFromServer', (message: ChatMessage) => {
        console.log('Received new message from server:', message);
        if (message.roomId === place.id) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Chat socket disconnected:', reason);
        setIsConnected(false);
        if (reason !== 'io client disconnect') { // Don't show error if disconnected manually
          setChatError('Disconnected from chat. Reconnecting...');
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Chat socket connection error:', error);
        setIsConnected(false);
        setChatError(`Connection failed: ${error.message}. Please try again later.`);
      });
      
      newSocket.on('chatError', (errorMessage: string) => {
        console.error('Chat Error from server:', errorMessage);
        setChatError(errorMessage);
      });


      return () => {
        console.log('Cleaning up chat socket for place:', place.id);
        newSocket.emit('leaveRoom', { roomId: place.id });
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setMessages([]); // Clear messages when modal closes or changes place
      };
    } else if (!isOpen && socket) {
        // Ensure socket is disconnected if modal is closed but socket somehow still exists
        socket.disconnect();
        setSocket(null);
    }
  }, [isOpen, place?.id, token, user]); // user dependency to re-init if user changes

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);


  const handleSendMessage = async () => { // Made async for potential await if socket.emit had callback
    if (!newMessage.trim() || !socket || !isConnected || !user || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      const messagePayload = {
        roomId: place.id,
        text: newMessage,
      };
      
      // Emit and wait for ack if backend is set up for it (example, not standard)
      // await new Promise((resolve, reject) => {
      //   socket.emit('sendMessageToServer', messagePayload, (ack: any) => {
      //     if (ack?.error) reject(ack.error);
      //     else resolve(ack);
      //   });
      // });
      socket.emit('sendMessageToServer', messagePayload); // Fire and forget for now

      // Optimistic update can be done here before or after emit depending on desired UX
      // For simplicity, we'll rely on newMessageFromServer event from backend to add the message
      setNewMessage(""); 
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally set a temporary error state for sending, or use toast
      // setChatError("Failed to send message. Please try again."); 
      // toast.error("Failed to send message", { description: "Please try again." });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[calc(100vh-4rem)] sm:h-[600px] flex flex-col p-0 bg-brand-background rounded-2xl shadow-soft-lg border-none overflow-hidden">
        <DialogClose className="absolute right-3 top-3 z-10 text-brand-text hover:text-brand-primary hover:bg-brand-accent-medium/20 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-background">
          <XIcon className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="p-4 border-b border-brand-accent-medium/30">
          <DialogTitle className="text-brand-primary text-lg font-semibold flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-brand-primary" /> {/* Icon color updated */}
              {place.name}
            </div>
            <Badge className="bg-brand-accent-medium/20 text-brand-accent-dark rounded-md text-xs"> {/* Badge style updated */}
              3 online
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 bg-brand-background"> {/* Explicit bg for content area */}
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end max-w-[80%] ${msg.isOwn ? "flex-row-reverse space-x-reverse space-x-2" : "flex-row space-x-2"}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className={`text-xs ${msg.isOwn ? "bg-brand-secondary text-brand-text" : "bg-brand-accent-medium/30 text-brand-text"}`}> {/* Updated fallback */}
                      {msg.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`space-y-1 ${msg.isOwn ? "text-right" : "text-left"}`}>
                    <div className={`flex items-center space-x-2 ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      <span className="text-xs font-semibold text-brand-text">{msg.isOwn ? "You" : msg.user.name}</span> {/* Username color */}
                      <span className="text-xs text-brand-accent-dark">{msg.timestamp}</span> {/* Timestamp color */}
                    </div>
                    <div
                      className={`inline-block px-3.5 py-2.5 rounded-xl text-sm leading-snug ${ // Adjusted padding & leading
                        msg.isOwn 
                          ? "bg-brand-primary text-white rounded-br-none shadow-soft-sm" // Own message style
                          : "bg-white border border-brand-accent-medium/30 text-brand-text rounded-bl-none shadow-soft-xs" // Other's message style
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-brand-accent-medium/30 bg-brand-background"> {/* Explicit bg for footer */}
          <div className="flex space-x-2 items-center">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-brand-accent-medium focus:border-brand-primary focus:ring-brand-primary bg-white rounded-lg text-sm h-10" /* Updated input style */
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected || isSendingMessage}
              className="bg-brand-primary text-white hover:bg-brand-accent-dark rounded-lg w-10 h-10 p-0 flex items-center justify-center shadow-soft-sm disabled:opacity-70" 
              aria-label="Send message"
            >
              {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-brand-accent-dark mt-2 text-center">Be respectful and follow community guidelines</p> 
        </div>
      </DialogContent>
    </Dialog>
  )
}
