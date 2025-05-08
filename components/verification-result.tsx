"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Award, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Card } from "@/lib/card-generator-pipeline-enhanced"

interface VerificationResultProps {
  success: boolean
  card: Card
  emotionalIntensity: number
  socialTriggerActivated?: boolean
  onClaimReward: () => void
  onRetry: () => void
}

export function VerificationResult({
  success,
  card,
  emotionalIntensity,
  socialTriggerActivated = false,
  onClaimReward,
  onRetry,
}: VerificationResultProps) {
  const [showShare, setShowShare] = useState(false)

  // Mostrar opción de compartir después de un breve retraso
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowShare(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [success])

  // Helper function to get intensity color
  const getIntensityColor = (intensity: number) => {
    if (intensity < 40) return "bg-blue-500"
    if (intensity < 70) return "bg-purple-500"
    return "bg-red-500"
  }

  // Helper function to get intensity label
  const getIntensityLabel = (intensity: number) => {
    if (intensity < 40) return "Suave"
    if (intensity < 70) return "Intenso"
    return "Caótico"
  }

  if (success) {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-green-800">¡Reto completado!</h3>
          <p className="mt-2 text-green-700">Has superado el desafío exitosamente.</p>
        </motion.div>

        {socialTriggerActivated && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Alert className="bg-purple-50 border-purple-200">
              <Award className="h-4 w-4 text-purple-500" />
              <AlertTitle className="text-purple-800">¡Desencadenante social activado!</AlertTitle>
              <AlertDescription className="text-purple-700">{card.social_trigger}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gray-100 p-4 rounded-lg"
        >
          <h3 className="font-medium">Tu intensidad emocional:</h3>
          <div className="flex items-center mt-2">
            <Progress value={emotionalIntensity} className={`h-2 flex-1 ${getIntensityColor(emotionalIntensity)}`} />
            <Badge className="ml-2" variant="outline">
              {getIntensityLabel(emotionalIntensity)}
            </Badge>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4"
        >
          <h3 className="font-medium flex items-center">
            <Award className="h-5 w-5 text-amber-500 mr-2" />
            Tu recompensa:
          </h3>
          <p className="mt-2 text-amber-800 font-medium">
            {card.reward}
            {socialTriggerActivated && card.brand_sponsor?.rewardValue && (
              <span className="block mt-1 text-purple-700">¡Bonus del 50% por activar el desencadenante social!</span>
            )}
          </p>
        </motion.div>

        {showShare && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h3 className="font-medium flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              ¿Quieres compartir tu logro?
            </h3>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="flex-1">
                Crear Meme
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Compartir
              </Button>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <Button
            onClick={onClaimReward}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90"
          >
            <Award className="mr-2 h-4 w-4" />
            Reclamar Recompensa
          </Button>
        </motion.div>
      </div>
    )
  } else {
    return (
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-red-800">Verificación fallida</h3>
          <p className="mt-2 text-red-700">No se pudo verificar que hayas completado el reto.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button onClick={onRetry} className="w-full">
            Intentar de Nuevo
          </Button>
        </motion.div>
      </div>
    )
  }
}
