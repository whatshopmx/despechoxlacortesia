"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Paperclip, Mic, ImageIcon, MoreVertical, Check, CheckCheck } from "lucide-react"
import { motion } from "framer-motion"

interface ChatToxicoProps {
  initialMessage?: string
  aiResponse?: string
  onSendMessage?: (message: string) => void
  userAvatar?: string
  exAvatar?: string
  userName?: string
  exName?: string
}

export function ChatToxico({
  initialMessage = "¿Por qué me dejaste en visto?",
  aiResponse = "Porque tu perfil es un museo del cringe. 🚮",
  onSendMessage,
  userAvatar = "/placeholder.svg?height=40&width=40",
  exAvatar = "/placeholder.svg?height=40&width=40&text=Ex",
  userName = "Tú",
  exName = "Ex Tóxico",
}: ChatToxicoProps) {
  const [messages, setMessages] = useState([
    { id: 1, text: initialMessage, sender: "user", time: "22:45", status: "read" },
    { id: 2, text: aiResponse, sender: "ex", time: "22:47", status: "sent" },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    }

    setMessages([...messages, newMsg])
    setNewMessage("")

    if (onSendMessage) {
      onSendMessage(newMessage)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <Check className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-lg">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={exAvatar || "/placeholder.svg"} alt={exName} />
            <AvatarFallback className="bg-pink-300 text-pink-800">{exName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-white">{exName}</h3>
            <p className="text-xs text-white/70">Última conexión: En tu mente</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Chat messages */}
      <CardContent className="p-0">
        <div className="bg-[url('/placeholder.svg?height=500&width=500&text=Chat+Background')] bg-cover bg-center min-h-[350px] p-4 flex flex-col gap-3">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-purple-100 text-purple-900 rounded-tr-none"
                    : "bg-white text-gray-800 rounded-tl-none"
                }`}
              >
                <p className="break-words">{message.text}</p>
                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-xs text-gray-500">{message.time}</span>
                  {message.sender === "user" && getStatusIcon(message.status)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-2 bg-gray-50 border-t flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Escribe un mensaje..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="text-gray-500">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="icon"
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
