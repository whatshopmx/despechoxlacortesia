"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Card as CardType } from "@/lib/card-generator-pipeline-enhanced"

interface EmotionalCardProps {
  card: CardType
  onComplete?: () => void
  isPreview?: boolean
  hideButton?: boolean // Nuevo prop para ocultar el botón
}

export function EmotionalCard({ card, onComplete, isPreview = false, hideButton = false }: EmotionalCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
        <CardTitle className="text-2xl">{card.card_title}</CardTitle>
        <CardDescription className="text-white/80">
          {card.brand_sponsor ? `Patrocinado por ${card.brand_sponsor.name}` : "La Lotería del Despecho™"}
        </CardDescription>
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
            <p className="text-gray-700">{card.reward}</p>
          </div>

          {card.spotify_song && (
            <div>
              <h3 className="font-semibold text-lg">Canción Recomendada:</h3>
              <p className="text-gray-700">
                {card.spotify_song.title} - {card.spotify_song.artist}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <div className="text-sm text-gray-500">Intensidad: {card.emotional_tier}</div>
          <div className="text-sm text-gray-500">#{card.theme_tag}</div>
        </div>

        {!isPreview && !hideButton && onComplete && (
          <Button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            Completar Reto
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
