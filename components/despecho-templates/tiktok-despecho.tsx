"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark, Music, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface TikTokDespechoProps {
  mainText?: string
  caption?: string
  comments?: { user: string; text: string; avatar?: string; likes?: number }[]
  userName?: string
  userAvatar?: string
  songName?: string
  onGenerate?: (text: string, caption: string) => void
  onShare?: () => void
}

export function TikTokDespecho({
  mainText = "Cuando revisas su último visto...",
  caption = "y es tu mejor amigo 🕵️‍♂️ #DespechoCheck #AlgoritmoSabeLoQueSiento",
  comments = [
    {
      user: "usuario_despechado",
      text: "El algoritmo sabiendo que estás triste 💔",
      avatar: "/placeholder.svg?height=32&width=32&text=UD",
      likes: 245,
    },
    {
      user: "terapia_necesaria",
      text: "Esto es tan yo que duele 💀",
      avatar: "/placeholder.svg?height=32&width=32&text=TN",
      likes: 128,
    },
  ],
  userName = "corazon.roto.oficial",
  userAvatar = "/placeholder.svg?height=40&width=40&text=CR",
  songName = "Hawái - Maluma",
  onGenerate,
  onShare,
}: TikTokDespechoProps) {
  const [tiktokText, setTiktokText] = useState(mainText)
  const [tiktokCaption, setTiktokCaption] = useState(caption)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(1452)
  const [commentCount, setCommentCount] = useState(comments.length)
  const [shareCount, setShareCount] = useState(342)
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(89)

  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleClick = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }

    const videoElement = document.getElementById("tiktok-video-container")
    if (videoElement) {
      videoElement.addEventListener("click", handleClick)
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("click", handleClick)
      }
    }
  }, [isPlaying])

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      if (onGenerate) {
        onGenerate(tiktokText, tiktokCaption)
      }
    }, 1000)
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    }
    setShareCount(shareCount + 1)
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    setBookmarkCount(bookmarked ? bookmarkCount - 1 : bookmarkCount + 1)
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-0 shadow-lg">
      <CardContent className="p-0">
        <div className="relative bg-black h-[600px]">
          {/* Video container */}
          <div id="tiktok-video-container" className="absolute inset-0 flex items-center justify-center cursor-pointer">
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              poster="/placeholder.svg?height=600&width=400&text=TikTok+Video"
              className="h-full w-full object-cover"
            >
              <source src="#" type="video/mp4" />
            </video>

            {/* Text overlay */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold text-white text-shadow-lg mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {tiktokText}
              </motion.h2>

              <motion.h3
                className="text-2xl font-bold text-white text-shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {tiktokCaption.split("#")[0]}
              </motion.h3>
            </motion.div>

            {/* Play/Pause indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="h-0 w-0 border-t-8 border-b-8 border-l-16 border-t-transparent border-b-transparent border-l-white ml-1"></div>
                </div>
              </div>
            )}
          </div>

          {/* Right side buttons */}
          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-black/20 text-white"
                onClick={handleLike}
              >
                <Heart className={`h-7 w-7 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <span className="text-white text-xs mt-1">{likeCount}</span>
            </div>

            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black/20 text-white">
                <MessageCircle className="h-7 w-7" />
              </Button>
              <span className="text-white text-xs mt-1">{commentCount}</span>
            </div>

            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-black/20 text-white"
                onClick={handleBookmark}
              >
                <Bookmark className={`h-7 w-7 ${bookmarked ? "fill-white" : ""}`} />
              </Button>
              <span className="text-white text-xs mt-1">{bookmarkCount}</span>
            </div>

            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-black/20 text-white"
                onClick={handleShare}
              >
                <Share2 className="h-7 w-7" />
              </Button>
              <span className="text-white text-xs mt-1">{shareCount}</span>
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute left-3 right-16 bottom-3 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                <AvatarFallback>{userName[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold">@{userName}</span>
            </div>

            <p className="text-sm mb-2 line-clamp-2">{tiktokCaption}</p>

            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs whitespace-nowrap animate-marquee">{songName} · Sonido original</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex flex-col gap-3">
        <div>
          <label htmlFor="tiktokText" className="block text-sm font-medium text-gray-700 mb-1">
            Texto Principal
          </label>
          <Input
            id="tiktokText"
            value={tiktokText}
            onChange={(e) => setTiktokText(e.target.value)}
            placeholder="Texto principal del TikTok"
          />
        </div>

        <div>
          <label htmlFor="tiktokCaption" className="block text-sm font-medium text-gray-700 mb-1">
            Caption y Hashtags
          </label>
          <Input
            id="tiktokCaption"
            value={tiktokCaption}
            onChange={(e) => setTiktokCaption(e.target.value)}
            placeholder="Caption y hashtags"
          />
        </div>

        <Button
          onClick={handleGenerate}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            "Generar TikTok"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
