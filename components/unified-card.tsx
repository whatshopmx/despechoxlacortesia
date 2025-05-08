"use client"

import type { UnifiedCard } from "@/lib/unified-card-model"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Camera, Mic, MessageSquare, Users, User, UserPlus } from "lucide-react"
import { motion } from "framer-motion"

interface UnifiedCardComponentProps {
  card: UnifiedCard
  isPreview?: boolean
  onAction?: (action: "complete" | "skip" | "share") => void
}

export function UnifiedCardComponent({ card, isPreview = false, onAction }: UnifiedCardComponentProps) {
  // Función para obtener el icono de verificación
  const getVerificationIcon = () => {
    switch (card.verification_type) {
      case "photo":
        return <Camera className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "group":
        return <Users className="h-4 w-4" />
      case "self":
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  // Función para obtener el icono de tipo de reto
  const getChallengeTypeIcon = () => {
    switch (card.challenge_type) {
      case "group":
        return <Users className="h-4 w-4" />
      case "duet":
        return <UserPlus className="h-4 w-4" />
      case "individual":
      default:
        return <User className="h-4 w-4" />
    }
  }

  // Función para obtener el color de fondo según la intensidad emocional
  const getBackgroundColor = () => {
    switch (card.emotional_tier) {
      case "mild":
        return "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200"
      case "intense":
        return "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
      case "chaotic":
        return "bg-gradient-to-br from-pink-50 to-red-50 border-pink-200"
      default:
        return "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
    }
  }

  // Función para obtener el color del título según la intensidad emocional
  const getTitleColor = () => {
    switch (card.emotional_tier) {
      case "mild":
        return "text-blue-700"
      case "intense":
        return "text-purple-700"
      case "chaotic":
        return "text-pink-700"
      default:
        return "text-gray-700"
    }
  }

  // Renderizar la versión de vista previa o completa
  if (isPreview) {
    return (
      <Card className={`overflow-hidden border ${getBackgroundColor()}`}>
        <CardHeader className="p-4 pb-2">
          <CardTitle className={`text-lg ${getTitleColor()}`}>{card.card_title}</CardTitle>
          <div className="flex flex-wrap gap-1 mt-1">
            <Badge variant="outline" className="flex items-center gap-1">
              {getChallengeTypeIcon()}
              {card.challenge_type.charAt(0).toUpperCase() + card.challenge_type.slice(1)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getVerificationIcon()}
              {card.verification_type.charAt(0).toUpperCase() + card.verification_type.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm">{card.challenge}</p>
          {card.spotify_song && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Music className="h-3 w-3" />
              <span>
                {card.spotify_song.title} - {card.spotify_song.artist}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className={`overflow-hidden border ${getBackgroundColor()}`}>
        <CardHeader className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <CardTitle className={`text-2xl ${getTitleColor()}`}>{card.card_title}</CardTitle>
            <div className="flex gap-1">
              <Badge variant="outline" className="flex items-center gap-1">
                {getChallengeTypeIcon()}
                {card.challenge_type.charAt(0).toUpperCase() + card.challenge_type.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge>{card.challenge_category}</Badge>
            <Badge variant="outline">{card.genre_tag}</Badge>
            {card.theme_tag && <Badge variant="outline">{card.theme_tag}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="bg-white bg-opacity-70 p-4 rounded-lg mb-4">
            <p className="text-lg font-medium">{card.challenge}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-1">Verificación</h3>
              <div className="flex items-center gap-1">
                {getVerificationIcon()}
                <span>{card.verification_type.charAt(0).toUpperCase() + card.verification_type.slice(1)}</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">Recompensa</h3>
              <p>
                {typeof card.reward === "string" ? card.reward : `${card.reward.descripcion} (${card.reward.valor})`}
              </p>
            </div>
          </div>

          {card.spotify_song && (
            <div className="mt-4 bg-green-50 p-3 rounded-lg flex items-center gap-3">
              <Music className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">{card.spotify_song.title}</p>
                <p className="text-sm text-gray-600">{card.spotify_song.artist}</p>
              </div>
            </div>
          )}
        </CardContent>
        {!isPreview && onAction && (
          <CardFooter className="p-6 pt-0 flex gap-2">
            <Button onClick={() => onAction("complete")} className="flex-1">
              Completar
            </Button>
            <Button variant="outline" onClick={() => onAction("skip")} className="flex-1">
              Saltar
            </Button>
            <Button variant="secondary" onClick={() => onAction("share")} className="flex-1">
              Compartir
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
