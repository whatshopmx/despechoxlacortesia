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
  } = useChallenge()

  const [photoData, setPhotoData] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [groupVotes, setGroupVotes] = useState<number>(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("challenge")
  const [isInitialized, setIsInitialized] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [textVerification, setTextVerification] = useState<string>("")
  const [showAiHelp, setShowAiHelp] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)

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

  // Handle challenge completion
  const handleCompleteChallenge = () => {
    try {
      completeChallenge()

      // If verification is required, show the appropriate verification UI
      if (verificationMethod === "self") {
        // Self-verification doesn't require additional steps
        verifyChallenge("self").catch((err) => {
          console.error("Error during self-verification:", err)
          setVerificationError("Error durante la auto-verificación. Por favor, intenta de nuevo.")
        })
      } else {
        // For other verification methods, we'll show the verification UI inline
        // No need to change tabs anymore
      }
    } catch (err) {
      console.error("Error completing challenge:", err)
      setVerificationError("Error al completar el reto. Por favor, intenta de nuevo.")
    }
  }

  // Handle photo capture
  const startCamera = async () => {
    if (!videoRef.current) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream
      setCameraActive(true)
    } catch (err) {
      console.error("Error accessing camera:", err)
      // Show a user-friendly error message
      setVerificationError("No se pudo acceder a la cámara. Por favor, verifica los permisos e intenta de nuevo.")
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setVerificationError("No se pudo acceder a la cámara. Por favor, intenta de nuevo.")
      return
    }

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
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
      }
    } catch (err) {
      console.error("Error capturing photo:", err)
      setVerificationError("Ocurrió un error al capturar la foto. Por favor, intenta de nuevo.")
    }
  }

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
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting photo verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Handle audio recording
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
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      // Show a user-friendly error message
      setVerificationError("No se pudo acceder al micrófono. Por favor, verifica los permisos e intenta de nuevo.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      }
    }
  }

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
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting audio verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Handle text verification
  const submitTextVerification = async () => {
    if (!textVerification.trim()) {
      setVerificationError("Por favor, escribe algo primero.")
      return
    }

    try {
      // Simulate verification with text
      const success = await verifyChallenge("self", textVerification)

      if (success) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting text verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Handle group verification
  const addGroupVote = () => {
    setGroupVotes((prev) => prev + 1)
  }

  const handleGroupVerification = async () => {
    try {
      // For group verification, we need a threshold (e.g., 3 votes)
      const threshold = 3
      const success = await submitGroupVerification(groupVotes, threshold)

      if (success) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting group verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Handle reward claiming
  const handleClaimReward = () => {
    try {
      claimReward()

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

  // Render verification UI based on method
  const renderVerificationUI = () => {
    switch (verificationMethod) {
      case "photo":
        return (
          <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-medium">Verifica tu reto con una foto</h3>
            <p className="text-sm text-gray-500">Toma una foto que demuestre que has completado el reto.</p>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {!photoData ? (
                cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
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
                className={`w-24 h-24 rounded-full flex items-center justify-center ${isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"}`}
              >
                <Mic className={`h-12 w-12 ${isRecording ? "text-red-500" : "text-gray-400"}`} />
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
          <div className="space-y-4 mt-4 bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-medium">Verificación grupal</h3>
            <p className="text-sm text-gray-500">
              Necesitas que al menos 3 personas confirmen que has completado el reto.
            </p>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="font-medium">Votos recibidos:</span>
                <Badge variant="secondary">{groupVotes} / 3</Badge>
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

  // Render result UI based on challenge status
  const renderResultUI = () => {
    if (challengeStatus === "completed") {
      return (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-green-800">¡Reto completado!</h3>
            </div>
            <p className="mt-2 text-green-700">Has completado el reto exitosamente.</p>
          </div>

          {socialTriggerActivated && (
            <Alert className="bg-purple-50 border-purple-200">
              <Award className="h-4 w-4 text-purple-500" />
              <AlertTitle className="text-purple-800">¡Desencadenante social activado!</AlertTitle>
              <AlertDescription className="text-purple-700">{card.social_trigger}</AlertDescription>
            </Alert>
          )}

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-medium">Tu intensidad emocional:</h3>
            <div className="flex items-center mt-2">
              <Progress value={emotionalIntensity} className={`h-2 flex-1 ${getIntensityColor(emotionalIntensity)}`} />
              <Badge className="ml-2" variant="outline">
                {getIntensityLabel(emotionalIntensity)}
              </Badge>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
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
          </div>

          <Button onClick={handleClaimReward} className="w-full">
            <Award className="mr-2 h-4 w-4" />
            Reclamar Recompensa
          </Button>
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

      {challengeStatus === "completed" || challengeStatus === "failed" ? (
        // Show result UI when challenge is completed or failed
        renderResultUI()
      ) : (
        // Show challenge UI with integrated verification
        <div>
          <EmotionalCard card={card} isPreview={false} hideButton={true} />

          {/* AI Help/Suggestion */}
          {card.ai_backup_response && renderAiHelp()}

          {/* Verification UI integrated directly under the card */}
          {challengeStatus === "verifying" ? (
            renderVerificationUI()
          ) : (
            <div className="mt-4">
              <Button onClick={handleCompleteChallenge} className="w-full" disabled={challengeStatus !== "in-progress"}>
                {challengeStatus === "in-progress" ? (
                  <>He Completado el Reto</>
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
              </Button>
            </div>
          )}
        </div>
      )}

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
