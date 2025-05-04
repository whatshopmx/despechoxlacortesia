"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CoreEmotion, EmotionalIntensity } from "@/lib/brinda-emotional-engine"
import { generateBrindaCard } from "@/lib/card-generator-pipeline-enhanced"

export default function CardPreviewPage() {
  const [emotion, setEmotion] = useState<CoreEmotion>(CoreEmotion.DESPECHO)
  const [intensity, setIntensity] = useState<EmotionalIntensity>(EmotionalIntensity.MEDIUM)
  const [isBranded, setIsBranded] = useState(false)
  const [brandId, setBrandId] = useState("Don Julio")
  const [card, setCard] = useState(() => generateBrindaCard({ emotion, intensity, isBranded, brandId }))

  const regenerateCard = () => {
    setCard(generateBrindaCard({ emotion, intensity, isBranded, brandId }))
  }

  const handleEmotionChange = (value: string) => {
    setEmotion(value as CoreEmotion)
  }

  const handleIntensityChange = (value: number[]) => {
    setIntensity(value[0] as EmotionalIntensity)
  }

  const handleBrandedChange = (checked: boolean) => {
    setIsBranded(checked)
  }

  const handleBrandChange = (value: string) => {
    setBrandId(value)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Card Preview Generator</h1>
      <p className="text-gray-600 mb-8">
        Experiment with different emotional parameters to generate cards using the Brinda emotional engine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Emotional Parameters</h2>

            <div className="space-y-2">
              <Label htmlFor="emotion">Core Emotion</Label>
              <Select value={emotion} onValueChange={handleEmotionChange}>
                <SelectTrigger id="emotion">
                  <SelectValue placeholder="Select emotion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CoreEmotion.DESPECHO}>Despecho</SelectItem>
                  <SelectItem value={CoreEmotion.TRISTEZA}>Tristeza</SelectItem>
                  <SelectItem value={CoreEmotion.RABIA}>Rabia</SelectItem>
                  <SelectItem value={CoreEmotion.AUTOENGANO}>Autoengaño</SelectItem>
                  <SelectItem value={CoreEmotion.MISTICISMO}>Misticismo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Emotional Intensity: {intensity}</Label>
              <Slider value={[intensity]} min={1} max={5} step={1} onValueChange={handleIntensityChange} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Medium</span>
                <span>Intense</span>
                <span>Chaotic</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="branded" checked={isBranded} onCheckedChange={handleBrandedChange} />
              <Label htmlFor="branded">Branded Card</Label>
            </div>

            {isBranded && (
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select value={brandId} onValueChange={handleBrandChange}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Don Julio">Don Julio</SelectItem>
                    <SelectItem value="Tecate">Tecate</SelectItem>
                    <SelectItem value="Corona">Corona</SelectItem>
                    <SelectItem value="Bacardi">Bacardi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={regenerateCard} className="w-full">
              Generate New Card
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Generated Card</h2>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              <CardTitle className="text-2xl">{card.card_title}</CardTitle>
              <CardDescription className="text-white/80">
                {isBranded ? `Patrocinado por ${brandId}` : "La Lotería del Despecho™"}
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
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-gray-500">Intensidad: {card.emotional_tier}</div>
              <div className="text-sm text-gray-500">#{card.theme_tag}</div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
