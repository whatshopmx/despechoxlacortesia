"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Share2, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface MemeDespechoProps {
  topText?: string
  bottomText?: string
  imageUrl?: string
  onGenerate?: (topText: string, bottomText: string) => void
  onShare?: () => void
}

export function MemeDespecho({
  topText = "Cuando dices 'ya lo superé'",
  bottomText = "Pero revisas su Spotify a las 3 AM",
  imageUrl = "/placeholder.svg?height=500&width=500&text=Meme+Template",
  onGenerate,
  onShare,
}: MemeDespechoProps) {
  const [memeTopText, setMemeTopText] = useState(topText)
  const [memeBottomText, setMemeBottomText] = useState(bottomText)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      if (onGenerate) {
        onGenerate(memeTopText, memeBottomText)
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
      <CardContent className="p-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <img src={imageUrl || "/placeholder.svg"} alt="Meme template" className="w-full aspect-square object-cover" />

          <motion.div
            className="absolute top-4 left-0 right-0 text-center px-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase text-stroke">{memeTopText}</h2>
          </motion.div>

          <motion.div
            className="absolute bottom-4 left-0 right-0 text-center px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white uppercase text-stroke">{memeBottomText}</h2>
          </motion.div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="topText" className="block text-sm font-medium text-gray-700 mb-1">
              Texto Superior
            </label>
            <Input
              id="topText"
              value={memeTopText}
              onChange={(e) => setMemeTopText(e.target.value)}
              placeholder="Texto superior del meme"
            />
          </div>

          <div>
            <label htmlFor="bottomText" className="block text-sm font-medium text-gray-700 mb-1">
              Texto Inferior
            </label>
            <Input
              id="bottomText"
              value={memeBottomText}
              onChange={(e) => setMemeBottomText(e.target.value)}
              placeholder="Texto inferior del meme"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
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
            "Generar Meme"
          )}
        </Button>

        <Button variant="outline" className="flex items-center gap-1" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartir</span>
        </Button>

        <Button variant="outline" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Descargar</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
