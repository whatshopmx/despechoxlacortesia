"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, X, Star, MessageCircle, RefreshCw, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface PerfilCitasProps {
  bio?: string
  interests?: string[]
  userName?: string
  userAge?: number
  userAvatar?: string
  onGenerate?: (bio: string) => void
  onShare?: () => void
}

export function PerfilCitas({
  bio = "Busco alguien que no me ghostee... o al menos que sea creativo al hacerlo 🎭",
  interests = ["Llorar en el baño con Bad Bunny", "Coleccionar red flags", "Analizar mensajes", "Terapia pendiente"],
  userName = "Corazón Despechado",
  userAge = 25,
  userAvatar = "/placeholder.svg?height=400&width=400&text=Perfil",
  onGenerate,
  onShare,
}: PerfilCitasProps) {
  const [profileBio, setProfileBio] = useState(bio)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showBadge, setShowBadge] = useState(true)

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      if (onGenerate) {
        onGenerate(profileBio)
      }
    }, 1000)
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img src={userAvatar || "/placeholder.svg"} alt="Perfil" className="w-full aspect-square object-cover" />

          {showBadge && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="absolute top-4 right-4"
            >
              <Badge className="bg-red-500 text-white px-3 py-1 text-sm font-bold flex items-center gap-1">
                🚩 Red Flag
                <button
                  onClick={() => setShowBadge(false)}
                  className="ml-1 h-4 w-4 rounded-full bg-white/20 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </motion.div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <h2 className="text-2xl font-bold">
              {userName}, {userAge}
            </h2>
            <p className="text-sm opacity-80">A 2km de distancia</p>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">Sobre mí</h3>
          <p className="text-gray-700 mb-4">{profileBio}</p>

          <h3 className="font-semibold text-lg mb-2">Intereses</h3>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <div className="border-t p-4">
        <div className="flex justify-between gap-4 mb-4">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-gray-300 text-red-500">
            <X className="h-8 w-8" />
          </Button>

          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-gray-300 text-blue-500">
            <Star className="h-8 w-8" />
          </Button>

          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-gray-300 text-green-500">
            <Heart className="h-8 w-8" />
          </Button>

          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-gray-300 text-purple-500">
            <MessageCircle className="h-8 w-8" />
          </Button>
        </div>

        <div>
          <label htmlFor="profileBio" className="block text-sm font-medium text-gray-700 mb-1">
            Editar Bio
          </label>
          <Textarea
            id="profileBio"
            value={profileBio}
            onChange={(e) => setProfileBio(e.target.value)}
            placeholder="Escribe una bio creativa..."
            className="mb-3"
            rows={3}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                "Generar Bio"
              )}
            </Button>

            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
