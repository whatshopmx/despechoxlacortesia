"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from "lucide-react"
import { motion } from "framer-motion"

interface InstagramDespechadoProps {
  caption?: string
  comments?: { user: string; text: string; avatar?: string }[]
  imageUrl?: string
  userName?: string
  userAvatar?: string
  onAddComment?: (comment: string) => void
}

export function InstagramDespechado({
  caption = "Cuando bloqueas a alguien... y el algoritmo te lo sigue recomendando 😭 #DespechoTecnológico",
  comments = [
    { user: "terapia_urgente", text: "¿Y la terapia? 👀", avatar: "/placeholder.svg?height=32&width=32&text=T" },
    {
      user: "ex_detectado",
      text: "Mi psicólogo me dijo que deje de seguirte, pero aquí estoy 🤡",
      avatar: "/placeholder.svg?height=32&width=32&text=E",
    },
  ],
  imageUrl = "/placeholder.svg?height=500&width=500&text=Imagen+Despechada",
  userName = "corazon_roto_oficial",
  userAvatar = "/placeholder.svg?height=40&width=40&text=CR",
  onAddComment,
}: InstagramDespechadoProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(152)
  const [newComment, setNewComment] = useState("")
  const [allComments, setAllComments] = useState(comments)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      user: "tu_usuario",
      text: newComment,
      avatar: "/placeholder.svg?height=32&width=32&text=TU",
    }

    setAllComments([...allComments, comment])
    setNewComment("")

    if (onAddComment) {
      onAddComment(newComment)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border shadow-md">
      {/* Post header */}
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{userName}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post image */}
      <div className="relative">
        <img src={imageUrl || "/placeholder.svg"} alt="Post" className="w-full aspect-square object-cover" />
        {liked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <Heart className="h-20 w-20 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </div>

      {/* Post actions */}
      <CardContent className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleLike}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Comment">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Share">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleSave}
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Bookmark className={`h-6 w-6 ${saved ? "fill-black" : ""}`} />
          </Button>
        </div>

        <div className="mb-1">
          <p className="font-medium text-sm">{likeCount} likes</p>
          <p className="text-xs text-gray-500">Tu ex y 15 fantasmas más dieron like</p>
        </div>

        <div className="mb-2">
          <p className="text-sm">
            <span className="font-medium">{userName}</span> {caption}
          </p>
        </div>

        <div className="space-y-1 max-h-24 overflow-y-auto">
          {allComments.map((comment, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Avatar className="h-6 w-6">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.user} />
                <AvatarFallback>{comment.user[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm">
                <span className="font-medium">{comment.user}</span> {comment.text}
              </p>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <div className="flex items-center gap-2 w-full">
          <Avatar className="h-7 w-7">
            <AvatarImage src="/placeholder.svg?height=32&width=32&text=TU" alt="Tu usuario" />
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
          <Input
            placeholder="Añade un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            className="flex-1 h-9 text-sm"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" aria-label="Emoji">
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="text-blue-500 font-medium"
          >
            Publicar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
