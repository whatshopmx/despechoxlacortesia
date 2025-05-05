"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Card } from "@/lib/card-generator-pipeline-enhanced"
import { useChallenge } from "@/contexts/challenge-context"
import { Button } from "@/components/ui/button"
import { EmotionalCard } from "@/components/emotional-card"
import { Progress } from "@/components/ui/progress"
import {
  Camera,
  Mic,
  CheckCircle,
  XCircle,
  Loader2,
  Award,
  AlertCircle,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { GroupSidebar } from "./group-sidebar"
import { GroupRewardsSummary } from "./group-rewards-summary"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// New typed interfaces for our challenge system
interface Player {
  id: string
  name: string
  avatar?: string
  tier: "basic" | "intermediate" | "advanced"
  completedCards: string[]
  emotionalScore: number
  currentTurn: boolean
  assignedCards: Card[]
}

interface BrandInfo {
  name: string
  logo: string
  themeColor: string
}

interface GroupChallengeFlowProps {
  initialPlayers: Player[]
  cards: Card[]
  brandInfo: BrandInfo
  onComplete?: () => void
}

export function GroupChallengeFlow({ initialPlayers, cards, brandInfo, onComplete }: GroupChallengeFlowProps) {
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

  const router = useRouter()

  // State for players and turn management
  const [players, setPlayers] = useState<Player[]>(initialPlayers)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("challenge")
  const [isInitialized, setIsInitialized] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showRewardsSummary, setShowRewardsSummary] = useState(false)

  // State for verification methods
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [groupVotes, setGroupVotes] = useState<number>(0)

  // State for turn timer
  const [remainingTime, setRemainingTime] = useState<number>(60) // 60 seconds per turn
  const [timerActive, setTimerActive] = useState<boolean>(true)

  // Refs for media handling
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Current player and card
  const currentPlayer = players[currentPlayerIndex]
  const currentCard = currentPlayer?.assignedCards[0] || null

  // Start the challenge when the component mounts
  useEffect(() => {
    if (!isInitialized && currentCard) {
      try {
        startChallenge(currentCard)
        setIsInitialized(true)
      } catch (err) {
        console.error("Error starting challenge:", err)
        setVerificationError("Error al iniciar el reto. Por favor, intenta de nuevo.")
      }
    }
  }, [currentCard, startChallenge, isInitialized])

  // Handle turn timer
  useEffect(() => {
    if (timerActive && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (remainingTime <= 0) {
      handleTimeUp()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timerActive, remainingTime])

  // Handle when time runs out for a player
  const handleTimeUp = () => {
    // Move to the next player
    moveToNextPlayer("timeout")
  }

  // Calculate the tier based on completed cards and emotional score
  const calculateTier = (completedCards: number, score: number): "basic" | "intermediate" | "advanced" => {
    if (completedCards >= 3 && score > 70) return "advanced"
    if (completedCards >= 2 && score > 50) return "intermediate"
    return "basic"
  }

  // Move to the next player in the group
  const moveToNextPlayer = (reason: "completed" | "timeout" | "skipped") => {
    // Reset state for the next player
    setTimerActive(false)
    setActiveTab("challenge")
    setPhotoData(null)
    setAudioData(null)
    setGroupVotes(0)
    resetChallenge()
    setIsInitialized(false)

    // Update players array
    setPlayers((prevPlayers) => {
      // Create a copy of the players array
      const updatedPlayers = [...prevPlayers]

      // Update current player's turn status
      updatedPlayers[currentPlayerIndex] = {
        ...updatedPlayers[currentPlayerIndex],
        currentTurn: false,
      }

      // Calculate the next player index
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length

      // Update next player's turn status
      updatedPlayers[nextPlayerIndex] = {
        ...updatedPlayers[nextPlayerIndex],
        currentTurn: true,
      }

      return updatedPlayers
    })

    // Set the new current player index
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length)

    // Reset timer for the next player
    setRemainingTime(60)
    setTimerActive(true)
  }

  // Handle player switching directly
  const handlePlayerChange = (playerId: string) => {
    const playerIndex = players.findIndex((p) => p.id === playerId)
    if (playerIndex !== -1) {
      // Reset states
      setTimerActive(false)
      setActiveTab("challenge")
      setPhotoData(null)
      setAudioData(null)
      setGroupVotes(0)
      resetChallenge()
      setIsInitialized(false)

      // Update all players' turn status
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, index) => ({
          ...player,
          currentTurn: index === playerIndex,
        }))
      })

      // Set new current player
      setCurrentPlayerIndex(playerIndex)

      // Reset timer
      setRemainingTime(60)
      setTimerActive(true)
    }
  }

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

  const getTierColor = (tier: string) => {
    if (tier === "advanced") return "bg-green-500"
    if (tier === "intermediate") return "bg-purple-500"
    return "bg-blue-500"
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
        // For other verification methods, the UI will guide the user
        setActiveTab("verify")
      }

      // Pause the timer during verification
      setTimerActive(false)
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
    } catch (err) {
      console.error("Error accessing camera:", err)
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
        updatePlayerProgress("photo")
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
        updatePlayerProgress("audio")
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting audio verification:", err)
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
        updatePlayerProgress("group")
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting group verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Update player progress after successful verification
  const updatePlayerProgress = (verificationType: string) => {
    // Update players array with new progress
    setPlayers((prevPlayers) => {
      // Create a copy of the players array
      const updatedPlayers = [...prevPlayers]

      // Get current player
      const player = updatedPlayers[currentPlayerIndex]

      // Update completed cards and emotional score
      const completedCards = [...player.completedCards, currentCard?.card_id || "unknown"]

      // Calculate emotional intensity increase based on card tier
      let intensityIncrease = 5 // base increase
      if (currentCard?.emotional_tier === "intense") intensityIncrease = 10
      if (currentCard?.emotional_tier === "chaotic") intensityIncrease = 15

      // Bonus for group verification
      if (verificationType === "group") intensityIncrease += 5

      const emotionalScore = Math.min(100, player.emotionalScore + intensityIncrease)

      // Calculate new tier
      const tier = calculateTier(completedCards.length, emotionalScore)

      // Remove the completed card from assignedCards
      const remainingCards = player.assignedCards.filter((card) => card.card_id !== currentCard?.card_id)

      // Update the player
      updatedPlayers[currentPlayerIndex] = {
        ...player,
        completedCards,
        emotionalScore,
        tier,
        assignedCards: remainingCards, // Actualizar con las cartas restantes
      }

      return updatedPlayers
    })
  }

  // Handle reward claiming
  const handleClaimReward = () => {
    try {
      claimReward()
      moveToNextPlayer("completed")
    } catch (err) {
      console.error("Error claiming reward:", err)
      setVerificationError("Ocurrió un error al reclamar la recompensa. Por favor, intenta de nuevo.")
    }
  }

  // Skip the current player's turn
  const handleSkipTurn = () => {
    moveToNextPlayer("skipped")
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verifica tu reto con una foto</h3>
            <p className="text-sm text-gray-500">Toma una foto que demuestre que has completado el reto.</p>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {!photoData ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  onLoadedMetadata={() => startCamera()}
                />
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
                <Button onClick={capturePhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capturar Foto
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setPhotoData(null)}>
                    Volver a Capturar
                  </Button>
                  <Button onClick={submitPhotoVerification}>
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
          <div className="space-y-4">
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
                <Button onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  Iniciar Grabación
                </Button>
              ) : isRecording ? (
                <Button variant="destructive" onClick={stopRecording}>
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
                  >
                    Volver a Grabar
                  </Button>
                  <Button onClick={submitAudioVerification}>
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verificación grupal</h3>
            <p className="text-sm text-gray-500">
              Necesitas que al menos 3 personas confirmen que has completado el reto.
            </p>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Votos recibidos:</span>
                <Badge variant="secondary">{groupVotes} / 3</Badge>
              </div>
              <Progress value={(groupVotes / 3) * 100} className="h-2 mt-2" />
            </div>

            <div className="flex flex-wrap gap-2">
              {players
                .filter((p) => p.id !== currentPlayer.id)
                .map((player) => (
                  <TooltipProvider key={player.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full h-12 w-12 p-0"
                          onClick={addGroupVote}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={player.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Simular voto de {player.name}</p>
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Auto-verificación</h3>
            <p className="text-sm text-gray-500">Confirma que has completado el reto.</p>

            <Button onClick={() => verifyChallenge("self")} className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirmar Reto Completado
            </Button>
          </div>
        )
    }
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
              <AlertDescription className="text-purple-700">{currentCard?.social_trigger}</AlertDescription>
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
              {currentCard?.reward}
              {socialTriggerActivated && currentCard?.brand_sponsor?.rewardValue && (
                <span className="block mt-1 text-purple-700">¡Bonus del 50% por activar el desencadenante social!</span>
              )}
              {currentPlayer.tier === "intermediate" && (
                <span className="block mt-1 text-purple-700">+ NFT Meme por ser nivel Intermedio</span>
              )}
              {currentPlayer.tier === "advanced" && (
                <span className="block mt-1 text-purple-700">+ Afterpass VIP por ser nivel Avanzado</span>
              )}
            </p>
          </div>

          <Button onClick={handleClaimReward} className="w-full">
            <Award className="mr-2 h-4 w-4" />
            Reclamar Recompensa y Pasar Turno
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

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={resetChallenge} variant="outline">
              Intentar de Nuevo
            </Button>
            <Button onClick={handleSkipTurn} variant="secondary">
              Pasar Turno
            </Button>
          </div>
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
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Mobile drawer for sidebar */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          className="fixed top-4 left-4 z-50 bg-white/50 backdrop-blur-sm"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {/* Button to show rewards summary */}
      <div className="mb-4 flex justify-end">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowRewardsSummary(true)}>
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Ver Recompensas</span>
          <span className="sm:hidden">Recompensas</span>
        </Button>
      </div>

      {/* Sidebar with player info and brand details */}
      <div className={`${expanded ? "block" : "hidden"} md:block h-full md:min-h-screen flex-shrink-0 border-r`}>
        <GroupSidebar
          currentPlayer={currentPlayer}
          players={players}
          brandInfo={brandInfo}
          onPlayerChange={handlePlayerChange}
          remainingTime={remainingTime}
          onShowRewards={() => setShowRewardsSummary(true)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-md mx-auto">
          {/* Timer for mobile */}
          <div className="mb-4 md:hidden">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm font-medium">Tiempo: {Math.floor(remainingTime)}s</span>
              </div>
              <Badge variant="outline">{currentPlayer.name}</Badge>
            </div>
            <Progress
              value={(remainingTime / 60) * 100}
              className={`h-1.5 ${remainingTime < 15 ? "bg-red-500" : "bg-blue-500"}`}
            />
          </div>

          {/* Errors */}
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

          {/* Brand info for mobile view */}
          <div className="bg-white mb-4 p-3 rounded-lg border shadow-sm flex items-center justify-between md:hidden">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 flex items-center justify-center rounded"
                style={{ backgroundColor: brandInfo.themeColor || "#f3f4f6" }}
              >
                <img
                  src={brandInfo.logo || "/placeholder.svg?height=20&width=20"}
                  alt={brandInfo.name}
                  className="h-5 object-contain"
                />
              </div>
              <span className="font-medium text-sm">{brandInfo.name}</span>
            </div>
            <Badge variant="outline" className="flex gap-1 items-center">
              <Users size={14} />
              {players.length}
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="challenge">Reto</TabsTrigger>
              <TabsTrigger value="verify" disabled={challengeStatus === "idle" || challengeStatus === "in-progress"}>
                Verificar
              </TabsTrigger>
              <TabsTrigger value="result" disabled={challengeStatus !== "completed" && challengeStatus !== "failed"}>
                Resultado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="challenge" className="mt-4">
              {currentCard ? (
                <>
                  <EmotionalCard
                    card={currentCard}
                    isPreview={false}
                    hideButton={true}
                    showReactions={true}
                    onReaction={(type) => console.log("Reaction:", type)}
                  />

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleCompleteChallenge}
                      className="flex-1"
                      disabled={challengeStatus !== "in-progress"}
                    >
                      {challengeStatus === "in-progress" ? (
                        <>He Completado el Reto</>
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      )}
                    </Button>
                    <Button onClick={handleSkipTurn} variant="outline" disabled={challengeStatus !== "in-progress"}>
                      Pasar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No hay retos disponibles</h3>
                  <p className="text-muted-foreground text-center mt-1">
                    Este jugador ha completado todos los retos o no tiene retos asignados
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="verify" className="mt-4">
              {renderVerificationUI()}
            </TabsContent>

            <TabsContent value="result" className="mt-4">
              {renderResultUI()}
            </TabsContent>
          </Tabs>

          {/* Player progression - visible on mobile */}
          {currentPlayer && (
            <div className="mt-4 bg-gray-50 rounded-lg p-3 border md:hidden">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-sm">Progreso de {currentPlayer.name}</h3>
                <Badge className={getTierColor(currentPlayer.tier) + " text-xs text-white"}>{currentPlayer.tier}</Badge>
              </div>
              <div className="mt-2">
                <Progress
                  value={currentPlayer.emotionalScore}
                  className={`h-1.5 ${getTierColor(currentPlayer.tier)}`}
                />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Retos completados: {currentPlayer.completedCards.length}</span>
                  <span>Intensidad: {currentPlayer.emotionalScore}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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

      {/* Group Rewards Summary Dialog */}
      {showRewardsSummary && (
        <Dialog open={showRewardsSummary} onOpenChange={setShowRewardsSummary}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <GroupRewardsSummary
              players={players.map((player) => ({
                ...player,
                rewards: [
                  // Ejemplo de recompensas - en una app real, estas vendrían de la base de datos
                  {
                    id: `reward_${player.id}_1`,
                    name:
                      player.tier === "advanced"
                        ? "Afterpass VIP"
                        : player.tier === "intermediate"
                          ? "NFT Meme Exclusivo"
                          : "Sticker Digital",
                    description:
                      player.tier === "advanced"
                        ? "Acceso VIP a eventos exclusivos"
                        : player.tier === "intermediate"
                          ? "Coleccionable digital único"
                          : "Sticker para compartir en redes sociales",
                    type:
                      player.tier === "advanced"
                        ? "experience"
                        : player.tier === "intermediate"
                          ? "digital"
                          : "digital",
                    brandName: brandInfo.name,
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
                    redeemed: false,
                    tier: player.tier,
                    image:
                      player.tier === "advanced"
                        ? "/placeholder.svg?height=200&width=400&text=VIP+Pass"
                        : player.tier === "intermediate"
                          ? "/placeholder.svg?height=200&width=400&text=NFT+Meme"
                          : "/placeholder.svg?height=200&width=400&text=Digital+Sticker",
                  },
                  // Añadir más recompensas basadas en los retos completados
                  ...(player.completedCards.length > 0
                    ? [
                        {
                          id: `reward_${player.id}_2`,
                          name: "Descuento en Bebidas",
                          description: "20% de descuento en tu próxima compra",
                          type: "physical",
                          brandName: brandInfo.name,
                          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
                          redeemed: false,
                          tier: "basic",
                          image: "/placeholder.svg?height=200&width=400&text=Discount+Coupon",
                        },
                      ]
                    : []),
                  // Recompensas especiales para niveles avanzados
                  ...(player.tier === "advanced"
                    ? [
                        {
                          id: `reward_${player.id}_3`,
                          name: "Merchandise Exclusivo",
                          description: "Camiseta o gorra de edición limitada",
                          type: "physical",
                          brandName: brandInfo.name,
                          expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días
                          redeemed: false,
                          tier: "advanced",
                          image: "/placeholder.svg?height=200&width=400&text=Exclusive+Merch",
                        },
                      ]
                    : []),
                ],
              }))}
              brandInfo={brandInfo}
              onClose={() => setShowRewardsSummary(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
