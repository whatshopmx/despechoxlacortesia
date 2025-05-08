"use client"

import { useState, useRef, useEffect } from "react"
import type { Card } from "@/lib/card-generator-pipeline-enhanced"
import { useChallenge } from "@/contexts/challenge-context"
import { Button } from "@/components/ui/button"
import { EmotionalCard } from "@/components/emotional-card"
import { Progress } from "@/components/ui/progress"
import { Camera, Mic, CheckCircle, XCircle, Loader2, Award, AlertCircle, Bot, StopCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"

// Importar el servicio de analytics
import { wrappedAnalytics, EventType } from "@/services/wrapped-analytics"

interface ChallengeFlowProps {
  card: Card
  onComplete?: () => void
}

export function ChallengeFlow({ card, onComplete }: ChallengeFlowProps) {
  const {
    startChallenge,
    completeChallenge,
    verifyChallenge,
    claimReward,
    resetChallenge,
    challengeStatus,
    socialTriggerActivated,
    verificationMethod,
    emotionalIntensity,
    submitPhoto,
    submitAudio,
    submitGroupVerification,
    error,
    clearError,
    currentCard,
  } = useChallenge()

  // Reemplazar el estado activeTab por un sistema de pasos
  const [currentStep, setCurrentStep] = useState<"challenge" | "verification" | "result">("challenge")
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [groupVotes, setGroupVotes] = useState<number>(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [textVerification, setTextVerification] = useState<string>("")
  const [showAiHelp, setShowAiHelp] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  // Añadir estos estados para la cuenta regresiva de la cámara
  const [countdown, setCountdown] = useState<number | null>(null)
  // Añadir un estado para el tiempo de grabación
  const [recordingTime, setRecordingTime] = useState(0)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Start the challenge when the component mounts - FIX: Changed from useState to useEffect
  useEffect(() => {
    if (!isInitialized) {
      try {
        startChallenge(card)
        setIsInitialized(true)
      } catch (err) {
        console.error("Error starting challenge:", err)
        setVerificationError("Error al iniciar el reto. Por favor, intenta de nuevo.")
      }
    }
  }, [card, startChallenge, isInitialized])

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

  // Reemplazar la función handleCompleteChallenge
  const handleCompleteChallenge = () => {
    try {
      completeChallenge()

      // Tracking de analytics
      wrappedAnalytics.trackEvent(EventType.CARD_COMPLETED, "user_123", {
        card: currentCard,
        emotionalIntensity,
        success: true,
      })

      // Si es auto-verificación, procesamos inmediatamente
      if (verificationMethod === "self") {
        verifyChallenge("self").catch((err) => {
          console.error("Error during self-verification:", err)
          setVerificationError("Error durante la auto-verificación. Por favor, intenta de nuevo.")
          setCurrentStep("challenge") // Volvemos al paso del reto si hay error
        })
      }
      // Para otros métodos, la transición al paso de verificación se maneja en el onClick del botón
    } catch (err) {
      console.error("Error completing challenge:", err)
      setVerificationError("Error al completar el reto. Por favor, intenta de nuevo.")
    }
  }

  // Modificar la función capturePhoto para incluir una cuenta regresiva
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setVerificationError("No se pudo acceder a la cámara. Por favor, intenta de nuevo.")
      return
    }

    // Iniciar cuenta regresiva
    setCountdown(3)

    // Función para contar hacia atrás y tomar la foto
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownTimer)
          // Tomar la foto cuando la cuenta llega a 0
          setTimeout(() => {
            try {
              const video = videoRef.current
              const canvas = canvasRef.current
              if (!video || !canvas) return

              const context = canvas.getContext("2d")
              if (context) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                context.drawImage(video, 0, 0, canvas.width, canvas.height)

                const data = canvas.toDataURL("image/png")
                setPhotoData(data)

                // Stop the camera stream
                if (video.srcObject) {
                  const tracks = (video.srcObject as MediaStream).getTracks()
                  tracks.forEach((track) => track.stop())
                  setCameraActive(false)
                }

                setCountdown(null)
              }
            } catch (err) {
              console.error("Error capturing photo:", err)
              setVerificationError("Ocurrió un error al capturar la foto. Por favor, intenta de nuevo.")
              setCountdown(null)
            }
          }, 100)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Modificar submitPhotoVerification
  const submitPhotoVerification = async () => {
    if (!photoData) {
      setVerificationError("Por favor, toma una foto primero.")
      return
    }

    try {
      const success = await submitPhoto(photoData)

      if (success) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        setCurrentStep("result") // Actualizar al paso de resultado
      } else {
        setVerificationError("La verificación falló. Intenta de nuevo.")
      }
    } catch (err) {
      console.error("Error submitting photo verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Modificar startRecording para incluir un temporizador
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioData(audioBlob)
        audioChunksRef.current = []

        // Detener el temporizador
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Iniciar temporizador
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setVerificationError("No se pudo acceder al micrófono. Por favor, verifica los permisos e intenta de nuevo.")
    }
  }

  // Modificar stopRecording para detener el temporizador
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }

      // Detener el temporizador
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }

  // Modificar submitAudioVerification de manera similar
  const submitAudioVerification = async () => {
    if (!audioData) {
      setVerificationError("Por favor, graba un audio primero.")
      return
    }

    try {
      const success = await submitAudio(audioData)

      if (success) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        setCurrentStep("result") // Actualizar al paso de resultado
      } else {
        setVerificationError("La verificación falló. Intenta de nuevo.")
      }
    } catch (err) {
      console.error("Error submitting audio verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Modificar submitTextVerification de manera similar
  const submitTextVerification = async () => {
    if (!textVerification.trim()) {
      setVerificationError("Por favor, escribe algo primero.")
      return
    }

    try {
      const success = await verifyChallenge("self", textVerification)

      if (success) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        setCurrentStep("result") // Actualizar al paso de resultado

        wrappedAnalytics.trackEvent(EventType.MEME_GENERATED, "user_123", {
          card: currentCard,
          text: textVerification || "¡He completado el reto!",
        })
      } else {
        setVerificationError("La verificación falló. Intenta de nuevo.")
      }
    } catch (err) {
      console.error("Error submitting text verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Modificar addGroupVote para incluir animaciones
  const addGroupVote = () => {
    setGroupVotes((prev) => prev + 1)

    // Reproducir sonido (si está disponible)
    // playSoundEffect("vote")

    // Mostrar un pequeño confeti localizado
    const confettiContainer = document.querySelector(".group-verification-container")
    if (confettiContainer) {
      const rect = confettiContainer.getBoundingClientRect()
      const x = rect.width / 2
      const y = rect.height / 2

      // Crear 10 partículas de confeti
      for (let i = 0; i < 10; i++) {
        const particle = document.createElement("div")
        particle.className = "absolute w-2 h-2 rounded-full pointer-events-none"
        particle.style.backgroundColor = ["#FF5E5B", "#D8D8D8", "#FFFFEA", "#00CECB", "#FFED66"][
          Math.floor(Math.random() * 5)
        ]
        particle.style.left = `${x}px`
        particle.style.top = `${y}px`

        confettiContainer.appendChild(particle)

        // Animar la partícula
        const angle = Math.random() * Math.PI * 2
        const distance = 30 + Math.random() * 50
        const destinationX = x + Math.cos(angle) * distance
        const destinationY = y + Math.sin(angle) * distance

        // Usar GSAP o una animación simple
        setTimeout(() => {
          particle.style.transition = "all 0.5s ease-out"
          particle.style.left = `${destinationX}px`
          particle.style.top = `${destinationY}px`
          particle.style.opacity = "0"

          // Eliminar después de la animación
          setTimeout(() => {
            particle.remove()
          }, 500)
        }, 10)
      }
    }
  }

  // Modificar handleGroupVerification de manera similar
  const handleGroupVerification = async () => {
    try {
      const threshold = 3
      const success = await submitGroupVerification(groupVotes, threshold)

      if (success) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        setCurrentStep("result") // Actualizar al paso de resultado
      } else {
        setVerificationError(`Necesitas al menos ${threshold} votos para verificar el reto.`)
      }
    } catch (err) {
      console.error("Error submitting group verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Handle reward claiming
  const handleClaimReward = () => {
    try {
      claimReward()

      // Dentro de la función handleClaimReward, después de claimReward():
      wrappedAnalytics.trackEvent(EventType.REWARD_EARNED, "user_123", {
        reward: currentCard?.reward,
        card: currentCard,
      })

      if (onComplete) {
        onComplete()
      }
    } catch (err) {
      console.error("Error claiming reward:", err)
      setVerificationError("Ocurrió un error al reclamar la recompensa. Por favor, intenta de nuevo.")
    }
  }

  // Clear verification error
  const clearVerificationError = () => {
    setVerificationError(null)
  }

  // Modificar el inicio de renderVerificationUI para incluir instrucciones generales
  const renderVerificationUI = () => {
    // Instrucciones generales basadas en el método de verificación
    const getInstructions = () => {
      switch (verificationMethod) {
        case "photo":
          return "Toma una foto que demuestre que has completado el reto. Asegúrate de que la imagen sea clara."
        case "audio":
          return "Graba un audio describiendo cómo completaste el reto o demostrando que lo has hecho."
        case "group":
          return "Necesitas que otros jugadores confirmen que has completado el reto correctamente."
        default:
          return "Describe cómo completaste el reto con el mayor detalle posible."
      }
    }

    // Añadir este div antes del switch para las instrucciones
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="text-blue-800 font-medium flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            Verificación del Reto
          </h3>
          <p className="text-blue-700 text-sm mt-1">{getInstructions()}</p>
        </div>

        {/* Resto del código de renderVerificationUI */}
        switch (verificationMethod) {
          case "photo":\
            const startCamera = async () => {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true })
                if (videoRef.current) {
                  videoRef.current.srcObject = stream
                  setCameraActive(true)
                }
              } catch (error) {
                console.error("Error accessing camera:", error)
                setVerificationError("No se pudo acceder a la cámara. Por favor, verifica los permisos e intenta de nuevo.")
              }
            }
            return (
              <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium">Verifica tu reto con una foto</h3>
                <p className="text-sm text-gray-500">Toma una foto que demuestre que has completado el reto.</p>

                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  {!photoData ? (
                    cameraActive ? (
                      <>
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        {countdown !== null && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-6xl font-bold text-white">{countdown}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    )
                  ) : (
                    <img
                      src={photoData || "/placeholder.svg"}
                      alt="Captured verification"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                <div className="flex justify-center gap-4">
                  {!photoData ? (
                    !cameraActive ? (
                      <Button onClick={startCamera} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Activar Cámara
                      </Button>
                    ) : (
                      <Button onClick={capturePhoto} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Capturar Foto
                      </Button>
                    )
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setPhotoData(null)} className="flex-1">
                        Volver a Capturar
                      </Button>
                      <Button onClick={submitPhotoVerification} className="flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Enviar Verificación
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )

          case "audio":
            return (
              <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium">Verifica tu reto con audio</h3>
                <p className="text-sm text-gray-500">Graba un audio que demuestre que has completado el reto.</p>

                <div className="flex justify-center">
                  <div
                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center ${
                      isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"
                    }`}
                  >
                    <Mic className={`h-12 w-12 ${isRecording ? "text-red-500" : "text-gray-400"}`} />
                    {isRecording && (
                      <span className="text-xs font-mono mt-1 text-red-500">
                        {Math.floor(recordingTime / 60)
                          .toString()
                          .padStart(2, "0")}
                        :{(recordingTime % 60).toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>

                {audioData && (
                  <div className="mt-4">
                    <audio controls src={URL.createObjectURL(audioData)} className="w-full" />
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  {!isRecording && !audioData ? (
                    <Button onClick={startRecording} className="w-full">
                      <Mic className="mr-2 h-4 w-4" />
                      Iniciar Grabación
                    </Button>
                  ) : isRecording ? (
                    <Button variant="destructive" onClick={stopRecording} className="w-full">
                      <StopCircle className="mr-2 h-4 w-4" />
                      Detener Grabación
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAudioData(null)
                          startRecording()
                        }}
                        className="flex-1"
                      >
                        Volver a Grabar
                      </Button>
                      <Button onClick={submitAudioVerification} className="flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Enviar Verificación
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )

          case "group":
            return (
              <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-lg border group-verification-container relative">
                <h3 className="text-lg font-medium">Verificación grupal</h3>
                <p className="text-sm text-gray-500">
                  Necesitas que al menos 3 personas confirmen que has completado el reto.
                </p>

                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Votos recibidos:</span>
                    <Badge variant="secondary">{groupVotes} / 3}</Badge>
                  </div>
                  <Progress value={(groupVotes / 3) * 100} className="h-2 mt-2" />
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                  {["Carlos", "Diana", "Miguel", "Laura", "Javier"].map((name, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full h-12 w-12 p-0" onClick={addGroupVote}>
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{name[0]}</AvatarFallback>
                            </Avatar>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Simular voto de {name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>

                <Button onClick={handleGroupVerification} disabled={groupVotes < 3} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verificar con Grupo
                </Button>
              </div>
            )

          default:
            return (
              <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-medium">Verificación por texto</h3>
                <p className="text-sm text-gray-500">Describe cómo completaste el reto.</p>

                <Textarea
                  placeholder="Escribe aquí cómo completaste el reto..."
                  value={textVerification}
                  onChange={(e) => setTextVerification(e.target.value)}
                  className="min-h-[100px]"
                />

                <Button onClick={submitTextVerification} className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Enviar Verificación
                </Button>
              </div>
            )
        }
      </div>
    )
  }

  // Render AI help
  const renderAiHelp = () => {
    if (!card.ai_backup_response) return null

    return (
      <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-5 w-5 text-purple-500" />
          <h3 className="font-medium text-purple-800">Sugerencia de IA</h3>
        </div>
        <p className="text-purple-700 italic">{card.ai_backup_response}</p>
      </div>
    )
  }

  // Modificar el renderResultUI para el caso de éxito
  const renderResultUI = () => {
    if (challengeStatus === "completed") {
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

          {/* Si hay un desencadenante social activado: */}
          {socialTriggerActivated &&
            wrappedAnalytics.trackEvent(EventType.SOCIAL_TRIGGER_ACTIVATED, "user_123", {
              card: currentCard,
              trigger: currentCard?.social_trigger,
            })}

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

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <Button
              onClick={handleClaimReward}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90"
            >
              <Award className="mr-2 h-4 w-4" />
              Reclamar Recompensa
            </Button>
          </motion.div>
        </div>
      )
    } else if (challengeStatus === "failed") {
      return (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-red-800">Verificación fallida</h3>
            </div>
            <p className="mt-2 text-red-700">No se pudo verificar que hayas completado el reto.</p>
          </div>

          <Button onClick={resetChallenge} className="w-full">
            Intentar de Nuevo
          </Button>
        </div>
      )
    } else {
      return (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={clearError}>
            Cerrar
          </Button>
        </Alert>
      )}

      {verificationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error de verificación</AlertTitle>
          <AlertDescription>{verificationError}</AlertDescription>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={clearVerificationError}>
            Cerrar
          </Button>
        </Alert>
      )}

      {/* Añadir después de las alertas de error, antes del contenido principal */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span
            className={`text-sm font-medium ${currentStep === "challenge" ? "text-primary" : "text-muted-foreground"}`}
          >
            1. Reto
          </span>
          <span
            className={`text-sm font-medium ${currentStep === "verification" ? "text-primary" : "text-muted-foreground"}`}
          >
            2. Verificación
          </span>
          <span
            className={`text-sm font-medium ${currentStep === "result" ? "text-primary" : "text-muted-foreground"}`}
          >
            3. Resultado
          </span>
        </div>
        <Progress
          value={currentStep === "challenge" ? 33 : currentStep === "verification" ? 66 : 100}
          className="h-2"
        />
      </div>

      {/* Reemplazar el renderizado condicional actual por este */}
      <AnimatePresence mode="wait">
        {currentStep === "challenge" && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EmotionalCard card={card} isPreview={false} hideButton={true} />

            {/* AI Help/Suggestion */}
            {card.ai_backup_response && (
              <Button
                variant="outline"
                onClick={() => setShowAiHelp(!showAiHelp)}
                className="w-full mt-4 flex items-center justify-center gap-2"
              >
                <Bot className="h-4 w-4" />
                {showAiHelp ? "Ocultar sugerencia" : "Necesito una sugerencia"}
              </Button>
            )}

            {showAiHelp && renderAiHelp()}

            <Button
              onClick={() => {
                handleCompleteChallenge()
                if (verificationMethod === "self") {
                  // Si es auto-verificación, saltamos directamente al resultado
                  setCurrentStep("result")
                } else {
                  // Para otros métodos, vamos al paso de verificación
                  setCurrentStep("verification")
                }
              }}
              className="w-full mt-4"
              disabled={challengeStatus !== "in-progress"}
            >
              {challengeStatus === "in-progress" ? (
                <>He Completado el Reto</>
              ) : (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
            </Button>
          </motion.div>
        )}

        {currentStep === "verification" && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Resumen del reto:</h3>
              <p className="text-sm text-muted-foreground">{card.challenge}</p>
            </div>

            {renderVerificationUI()}

            <Button variant="outline" onClick={() => setCurrentStep("challenge")} className="mt-4 w-full">
              Volver al reto
            </Button>
          </motion.div>
        )}

        {currentStep === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderResultUI()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti effect for successful completion */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <AnimatePresence>
            {Array.from({ length: 50 }).map((_, i) => {
              const size = Math.random() * 10 + 5
              const x = Math.random() * 100
              const y = -10
              const delay = Math.random() * 0.5
              const duration = Math.random() * 3 + 2
              const color = ["#FF5E5B", "#D8D8D8", "#FFFFEA", "#00CECB", "#FFED66"][Math.floor(Math.random() * 5)]

              return (
                <motion.div
                  key={i}
                  initial={{ x: `${x}vw`, y: `${y}vh` }}
                  animate={{
                    y: "110vh",
                    rotate: 360,
                    transition: {
                      duration,
                      delay,
                      ease: "easeIn",
                    },
                  }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
