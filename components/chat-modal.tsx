"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Users } from "lucide-react"
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
      <DialogContent className="max-w-md h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg text-[#032539] flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {place.name}
            </div>
            <Badge variant="outline" className="text-xs">
              3 online
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`flex max-w-[80%] ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="h-8 w-8 mx-2">
                    <AvatarImage src={msg.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-[#1C768F] text-white text-xs">
                      {msg.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`space-y-1 ${msg.isOwn ? "text-right" : "text-left"}`}>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-600">{msg.isOwn ? "You" : msg.user.name}</span>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                    <div
                      className={`inline-block px-3 py-2 rounded-2xl text-sm ${
                        msg.isOwn ? "bg-[#1C768F] text-white" : "bg-gray-100 text-gray-800"
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

        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-[#1C768F] hover:bg-[#1C768F]/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Be respectful and follow community guidelines</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
