"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog" // Added DialogClose
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users, XIcon } from "lucide-react" // Added XIcon
import { useState } from "react"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  place: any
  user: any
}

const mockMessages = [
  {
    id: "1",
    user: { name: "Sarah M.", avatar: "/placeholder.svg?height=32&width=32" },
    message: "Just arrived! The coffee here is amazing ☕",
    timestamp: "2 min ago",
    isOwn: false,
  },
  {
    id: "2",
    user: { name: "Mike R.", avatar: "/placeholder.svg?height=32&width=32" },
    message: "Anyone know if they have WiFi?",
    timestamp: "5 min ago",
    isOwn: false,
  },
  {
    id: "3",
    user: { name: "Emma L.", avatar: "/placeholder.svg?height=32&width=32" },
    message: 'Yes! Password is "coffee123"',
    timestamp: "4 min ago",
    isOwn: false,
  },
]

export function ChatModal({ isOpen, onClose, place, user }: ChatModalProps) {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      user: user,
      message: newMessage,
      timestamp: "now",
      isOwn: true,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
              disabled={!newMessage.trim()}
              className="bg-brand-primary text-white hover:bg-brand-accent-dark rounded-lg w-10 h-10 p-0 flex items-center justify-center shadow-soft-sm" /* Updated send button style */
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-brand-accent-dark mt-2 text-center">Be respectful and follow community guidelines</p> {/* Updated footer text color */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
