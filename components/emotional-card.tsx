"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Music,
  Award,
  Heart,
  ThumbsUp,
  Laugh,
  Smile,
  Sparkles,
  Camera,
  Mic,
  Users,
  MessageSquare,
  UserPlus,
  User,
} from "lucide-react"
import type { EmotionalCardModel } from "@/lib/card-models"

interface EmotionalCardProps {
  card: EmotionalCardModel
  onComplete?: () => void
  isPreview?: boolean
  hideButton?: boolean
  showReactions?: boolean
  onReaction?: (type: string) => void
  verificationType?: "self" | "group" | "ai" | "photo" | "audio" | "none"
}

export function EmotionalCard({
  card,
  onComplete,
  isPreview = false,
  hideButton = false,
  showReactions = false,
  onReaction,
  verificationType = "none",
}: EmotionalCardProps) {
  const [showAiHelp, setShowAiHelp] = useState(false)

  // Determinar el color de fondo basado en el género
  const getGradientByGenre = () => {
    switch (card.genre_tag) {
      case "Reggaetón Sad":
        return "from-pink-500 to-purple-500"
      case "Cumbia del Olvido":
        return "from-blue-500 to-teal-500"
      case "Corridos del Alma":
        return "from-red-500 to-orange-500"
      case "Terapia Express":
        return "from-green-500 to-emerald-500"
      default:
        return "from-pink-500 to-purple-500"
    }
  }

  // Determinar el icono basado en el nivel de caos
  const getChaosIcon = () => {
    switch (card.emotional_tier) {
      case "mild":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Suave
          </Badge>
        )
      case "intense":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Intenso
          </Badge>
        )
      case "chaotic":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Caótico
          </Badge>
        )
      default:
        return <Badge variant="outline">Normal</Badge>
    }
  }

  // Determinar el icono de verificación
  const getVerificationIcon = () => {
    switch (verificationType) {
      case "photo":
        return <Camera className="h-4 w-4 mr-1" />
      case "audio":
        return <Mic className="h-4 w-4 mr-1" />
      case "group":
        return <Users className="h-4 w-4 mr-1" />
      case "self":
        return <MessageSquare className="h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  // Determinar el texto de verificación
  const getVerificationText = () => {
    switch (verificationType) {
      case "photo":
        return "Verificación por foto"
      case "audio":
        return "Verificación por audio"
      case "group":
        return "Verificación grupal"
      case "self":
        return "Verificación por texto"
      default:
        return null
    }
  }

  // Obtener icono y texto del tipo de reto
  const getChallengeTypeInfo = () => {
    switch (card.challenge_type) {
      case "individual":
        return {
          icon: <User className="h-4 w-4 mr-1" />,
          text: "Reto individual",
          color: "bg-blue-100 text-blue-800",
        }
      case "duet":
        return {
          icon: <UserPlus className="h-4 w-4 mr-1" />,
          text: "Reto en dueto",
          color: "bg-purple-100 text-purple-800",
        }
      case "group":
        return {
          icon: <Users className="h-4 w-4 mr-1" />,
          text: "Reto grupal",
          color: "bg-green-100 text-green-800",
        }
      default:
        return {
          icon: <User className="h-4 w-4 mr-1" />,
          text: "Reto individual",
          color: "bg-blue-100 text-blue-800",
        }
    }
  }

  const challengeTypeInfo = getChallengeTypeInfo()

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className={`bg-gradient-to-r ${getGradientByGenre()} text-white`}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl">{card.card_title}</CardTitle>
          {getChaosIcon()}
        </div>
        <CardDescription className="text-white/80">
          {card.narrative_voice || "La Lotería del Despecho™"}
        </CardDescription>

        <div className="flex flex-wrap gap-2 mt-2">
          {/* Badge para el tipo de reto */}
          <Badge variant="secondary" className={`bg-white/20 text-white`}>
            {challengeTypeInfo.icon}
            {challengeTypeInfo.text}
          </Badge>

          {/* Badge para tipo de verificación */}
          {verificationType !== "none" && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              {getVerificationIcon()}
              {getVerificationText()}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">El Reto:</h3>
            <p className="text-gray-700">{card.challenge}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">Trigger Social:</h3>
            <p className="text-gray-700">{card.social_trigger}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded-md">
            <h3 className="font-semibold text-lg">Recompensa:</h3>
            <p className="text-gray-700">{typeof card.reward === "string" ? card.reward : card.reward.descripcion}</p>
            {card.sticker_integration && (
              <div className="mt-2 text-sm text-purple-700">
                <Sparkles className="inline-block h-4 w-4 mr-1" />
                {card.sticker_integration}
              </div>
            )}
          </div>

          {card.spotify_song && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
              <Music className="h-10 w-10 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Canción Recomendada:</h3>
                <p className="text-gray-700">
                  {card.spotify_song.title} - {card.spotify_song.artist}
                </p>
                <a
                  href={card.spotify_song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-green-600 hover:underline"
                >
                  Escuchar en Spotify
                </a>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <div className="text-sm text-gray-500">Intensidad: {card.emotional_tier}</div>
          <div className="text-sm text-gray-500">#{card.genre_tag}</div>
        </div>

        {showReactions && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onReaction && onReaction("heart")}>
              <Heart className="h-4 w-4 text-red-500" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onReaction && onReaction("thumbsUp")}>
              <ThumbsUp className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onReaction && onReaction("laugh")}>
              <Laugh className="h-4 w-4 text-yellow-500" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onReaction && onReaction("wow")}>
              <Smile className="h-4 w-4 text-purple-500" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onReaction && onReaction("applause")}>
              <Award className="h-4 w-4 text-green-500" />
            </Button>
          </div>
        )}

        {!isPreview && !hideButton && onComplete && (
          <Button onClick={onComplete} className={`w-full bg-gradient-to-r ${getGradientByGenre()} hover:opacity-90`}>
            Completar Reto
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
