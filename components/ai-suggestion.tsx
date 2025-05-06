"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Copy, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AiSuggestionProps {
  narrativeVoice: string
  suggestion: string
  onClose: () => void
}

export function AIsuggestion({ narrativeVoice, suggestion, onClose }: AiSuggestionProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(suggestion)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Sugerencia de {narrativeVoice}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4">
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-md border">
                <p className="italic">{suggestion}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                Puedes usar esta sugerencia tal cual o adaptarla a tu estilo personal.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "¡Copiado!" : "Copiar texto"}
                </Button>
                <Button variant="default" className="flex-1" onClick={onClose}>
                  Entendido
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
