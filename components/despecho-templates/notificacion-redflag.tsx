"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, RefreshCw, Share2, X, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NotificacionRedFlagProps {
  title?: string
  message?: string
  solutions?: string[]
  onGenerate?: (title: string, message: string) => void
  onShare?: () => void
}

export function NotificacionRedFlag({
  title = "¡ALERTA!",
  message = "Has sobrepensado un mensaje de 3 palabras. Soluciones recomendadas: Comer helado (2x1) o cantar reggaetón triste en el espejo.",
  solutions = ["Bloquear", "Llorar", "Terapia", "Ignorar"],
  onGenerate,
  onShare,
}: NotificacionRedFlagProps) {
  const [alertTitle, setAlertTitle] = useState(title)
  const [alertMessage, setAlertMessage] = useState(message)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([])

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setShowNotification(true)
      if (onGenerate) {
        onGenerate(alertTitle, alertMessage)
      }
    }, 1000)
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    }
  }

  const toggleSolution = (solution: string) => {
    if (selectedSolutions.includes(solution)) {
      setSelectedSolutions(selectedSolutions.filter((s) => s !== solution))
    } else {
      setSelectedSolutions([...selectedSolutions, solution])
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardContent className="p-4">
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4 relative"
            >
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-500"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-red-800">{alertTitle}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{alertMessage}</p>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-red-800">Soluciones recomendadas:</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {solutions.map((solution, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className={`border-red-300 ${
                            selectedSolutions.includes(solution)
                              ? "bg-red-200 text-red-800"
                              : "bg-white text-red-700 hover:bg-red-100"
                          }`}
                          onClick={() => toggleSolution(solution)}
                        >
                          {selectedSolutions.includes(solution) ? <Check className="h-3 w-3 mr-1" /> : null}
                          {solution}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <div>
            <label htmlFor="alertTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Título de la Alerta
            </label>
            <Input
              id="alertTitle"
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              placeholder="Título de la alerta"
            />
          </div>

          <div>
            <label htmlFor="alertMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Mensaje de la Alerta
            </label>
            <Input
              id="alertMessage"
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              placeholder="Mensaje de la alerta"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 p-4 pt-0">
        <Button
          onClick={handleGenerate}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            "Generar Alerta"
          )}
        </Button>

        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>

        {!showNotification && (
          <Button variant="outline" onClick={() => setShowNotification(true)}>
            Mostrar Alerta
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
