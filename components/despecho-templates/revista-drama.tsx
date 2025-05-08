"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RefreshCw, Share2, Download } from "lucide-react"
import { motion } from "framer-motion"

interface RevistaDramaProps {
  headline?: string
  subheadline?: string
  imageUrl?: string
  onGenerate?: (headline: string, subheadline: string) => void
  onShare?: () => void
}

export function RevistaDrama({
  headline = "¡EXCLUSIVA!",
  subheadline = "Él dijo 'no eres tú, soy yo'... y otros 5 clichés que usó para ghostearte. Pág. 10",
  imageUrl = "/placeholder.svg?height=600&width=400&text=Portada+Revista",
  onGenerate,
  onShare,
}: RevistaDramaProps) {
  const [magazineHeadline, setMagazineHeadline] = useState(headline)
  const [magazineSubheadline, setMagazineSubheadline] = useState(subheadline)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      if (onGenerate) {
        onGenerate(magazineHeadline, magazineSubheadline)
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
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-b from-pink-200 to-purple-200 border border-pink-300">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center py-2">
            <h1 className="text-xl font-bold tracking-wider">LA CORTESÍA</h1>
            <p className="text-xs">LA REVISTA DEL DESPECHO</p>
          </div>

          <div className="pt-14 pb-4 px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[3/4] rounded overflow-hidden mb-4"
            >
              <img src={imageUrl || "/placeholder.svg"} alt="Portada" className="w-full h-full object-cover" />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-3xl font-black text-white text-center"
                >
                  {magazineHeadline}
                </motion.h2>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-white p-3 rounded-lg shadow-lg border-2 border-pink-400 transform -rotate-2"
            >
              <p className="text-lg font-bold text-pink-800 leading-tight">{magazineSubheadline}</p>
            </motion.div>

            <div className="mt-4 flex justify-between items-center">
              <div className="bg-yellow-300 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold transform rotate-12">
                ¡EDICIÓN LIMITADA!
              </div>

              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">HOY</div>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
              Titular Principal
            </label>
            <Input
              id="headline"
              value={magazineHeadline}
              onChange={(e) => setMagazineHeadline(e.target.value)}
              placeholder="Titular sensacionalista"
            />
          </div>

          <div>
            <label htmlFor="subheadline" className="block text-sm font-medium text-gray-700 mb-1">
              Subtítulo
            </label>
            <Input
              id="subheadline"
              value={magazineSubheadline}
              onChange={(e) => setMagazineSubheadline(e.target.value)}
              placeholder="Subtítulo dramático"
            />
          </div>

          <div className="flex gap-2 pt-2">
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
                "Generar Portada"
              )}
            </Button>

            <Button variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
