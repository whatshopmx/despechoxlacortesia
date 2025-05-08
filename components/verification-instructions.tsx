import { Camera, Mic, Users, FileText, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ChallengeVerificationType } from "@/contexts/challenge-context"

interface VerificationInstructionsProps {
  method: ChallengeVerificationType
  showTips?: boolean
}

export function VerificationInstructions({ method, showTips = true }: VerificationInstructionsProps) {
  // Obtener el título y descripción según el método
  const getContent = () => {
    switch (method) {
      case "photo":
        return {
          icon: <Camera className="h-4 w-4" />,
          title: "Verificación por foto",
          description: "Toma una foto que demuestre que has completado el reto.",
          tips: [
            "Asegúrate de que la imagen sea clara y bien iluminada",
            "Incluye elementos que demuestren que completaste el reto",
            "Mantén la cámara estable para evitar fotos borrosas",
          ],
        }
      case "audio":
        return {
          icon: <Mic className="h-4 w-4" />,
          title: "Verificación por audio",
          description: "Graba un audio describiendo o demostrando cómo completaste el reto.",
          tips: [
            "Habla claramente y cerca del micrófono",
            "Menciona detalles específicos del reto",
            "Mantén un volumen adecuado durante la grabación",
          ],
        }
      case "group":
        return {
          icon: <Users className="h-4 w-4" />,
          title: "Verificación grupal",
          description: "Necesitas que otros jugadores confirmen que has completado el reto correctamente.",
          tips: [
            "Pide a los demás que presten atención mientras realizas el reto",
            "Necesitas alcanzar el número mínimo de votos para verificar",
            "Cada jugador solo puede votar una vez",
          ],
        }
      case "self":
        return {
          icon: <FileText className="h-4 w-4" />,
          title: "Auto-verificación",
          description: "Describe cómo completaste el reto con el mayor detalle posible.",
          tips: [
            "Sé honesto y detallado en tu descripción",
            "Menciona cualquier dificultad que hayas encontrado",
            "Explica cómo te sentiste al completar el reto",
          ],
        }
      default:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          title: "Verificación del reto",
          description: "Completa la verificación para reclamar tu recompensa.",
          tips: [
            "Sigue las instrucciones específicas para este tipo de verificación",
            "Si tienes problemas, puedes intentarlo de nuevo",
          ],
        }
    }
  }

  const { icon, title, description, tips } = getContent()

  return (
    <Alert className="bg-blue-50 border-blue-200 mb-4">
      {icon}
      <AlertTitle className="text-blue-800">{title}</AlertTitle>
      <AlertDescription className="text-blue-700">
        {description}

        {showTips && tips.length > 0 && (
          <div className="mt-2 pt-2 border-t border-blue-200">
            <p className="text-xs font-medium mb-1">Consejos:</p>
            <ul className="text-xs list-disc pl-4 space-y-1">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  )
}
