"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Card } from "@/lib/card-generator-pipeline-enhanced"
import type { ChallengeType, StickerType, StickerCombo } from "@/lib/card-models"
import { useChallenge } from "@/contexts/challenge-context"
import { Button } from "@/components/ui/button"
import { EmotionalCard } from "@/components/emotional-card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { AIsuggestion } from "@/components/ai-suggestion"
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
  User,
  UserPlus,
  HelpCircle,
  Share2,
  Copy,
  Lightbulb,
  Heart,
  Skull,
  ThumbsUp,
  PartyPopper,
  Sparkles,
  Flame,
  ImageIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { GroupSidebar } from "./group-sidebar"
import { GroupRewardsSummary } from "./group-rewards-summary"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getComboByStickers } from "@/lib/card-models"

// Importar los nuevos componentes y servicios al inicio del archivo:
import { MemeGenerator } from "./meme-generator"
import { SoundControls } from "./sound-controls"
import { playSound } from "@/services/sound-effects"

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
  stickers?: StickerType[]
  unlockedCombos?: string[]
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

// Vote types for group verification
type VoteType = "heart" | "skull" | "thumbsUp" | "party" | "fire"

interface Vote {
  playerId: string
  voteType: VoteType
  timestamp: number
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
  const { toast } = useToast()

  // State for players and turn management
  const [players, setPlayers] = useState<Player[]>(
    initialPlayers.map((player) => ({
      ...player,
      stickers: player.stickers || [],
      unlockedCombos: player.unlockedCombos || [],
    })),
  )
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>("challenge")
  const [isInitialized, setIsInitialized] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [showRewardsSummary, setShowRewardsSummary] = useState(false)
  const [textVerification, setTextVerification] = useState<string>("")
  const [showPartnerSelection, setShowPartnerSelection] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null)
  const [groupParticipation, setGroupParticipation] = useState<Record<string, boolean>>({})
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [sessionLink, setSessionLink] = useState<string>("")
  const [showAiHelp, setShowAiHelp] = useState(false)
  const [showStickerCombo, setShowStickerCombo] = useState(false)
  const [unlockedCombo, setUnlockedCombo] = useState<StickerCombo | null>(null)

  // Añadir nuevos estados para las funcionalidades de memes y animaciones:
  const [showMemeGenerator, setShowMemeGenerator] = useState<boolean>(false)
  const [memeGeneratorText, setMemeGeneratorText] = useState<string>("")
  const [generatedMemeUrl, setGeneratedMemeUrl] = useState<string | null>(null)
  const [animateCard, setAnimateCard] = useState<boolean>(false)
  const [animateButton, setAnimateButton] = useState<boolean>(false)
  const [animateReward, setAnimateReward] = useState<boolean>(false)

  // State for verification methods
  const [photoData, setPhotoData] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState<Blob | null>(null)
  const [groupVotes, setGroupVotes] = useState<Vote[]>([])

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

  // Determine challenge type
  const challengeType: ChallengeType = currentCard?.challenge_type || "individual"
  const partnerSelectionType = currentCard?.partner_selection || "random"

  // Calculate verification threshold based on number of participants
  const getVerificationThreshold = () => {
    const participantCount = Object.values(groupParticipation).filter(Boolean).length
    // For small groups (2-3 people), require all participants
    // For medium groups (4-6 people), require 75% of participants
    // For large groups (7+ people), require 60% of participants
    if (participantCount <= 3) return participantCount
    if (participantCount <= 6) return Math.ceil(participantCount * 0.75)
    return Math.ceil(participantCount * 0.6)
  }

  // Generate session link
  useEffect(() => {
    // In a real app, this would be a unique ID from the database
    const sessionId = `session_${Math.random().toString(36).substring(2, 9)}`
    const baseUrl = window.location.origin
    setSessionLink(`${baseUrl}/experience/social/group/join?id=${sessionId}`)
  }, [])

  // Start the challenge when the component mounts
  useEffect(() => {
    if (!isInitialized && currentCard) {
      try {
        startChallenge(currentCard)
        setIsInitialized(true)

        // Reset partner selection and group participation on new challenge
        setSelectedPartner(null)
        setGroupParticipation({})

        // For duet challenges, show partner selection
        if (challengeType === "duet") {
          // If random partner, select one automatically
          if (partnerSelectionType === "random") {
            const availablePartners = players.filter((p) => p.id !== currentPlayer.id)
            if (availablePartners.length > 0) {
              const randomIndex = Math.floor(Math.random() * availablePartners.length)
              setSelectedPartner(availablePartners[randomIndex].id)
            }
          } else {
            // Show partner selection dialog
            setShowPartnerSelection(true)
          }
        }

        // For group challenges, initialize participation
        if (challengeType === "group") {
          const initialParticipation: Record<string, boolean> = {}
          players.forEach((p) => {
            initialParticipation[p.id] = p.id === currentPlayer.id // Current player is always participating
          })
          setGroupParticipation(initialParticipation)
        }
      } catch (err) {
        console.error("Error starting challenge:", err)
        setVerificationError("Error al iniciar el reto. Por favor, intenta de nuevo.")
      }
    }
  }, [currentCard, startChallenge, isInitialized, challengeType, partnerSelectionType, players, currentPlayer])

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

  // Función para reproducir sonidos
  const playSoundEffect = (
    effect:
      | "success"
      | "error"
      | "click"
      | "card_flip"
      | "challenge_complete"
      | "reward"
      | "social_trigger"
      | "vote"
      | "camera"
      | "countdown"
      | "magic"
      | "level_up"
      | "combo"
      | "notification",
  ) => {
    playSound(effect)
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
    setGroupVotes([])
    setTextVerification("")
    resetChallenge()
    setIsInitialized(false)
    setSelectedPartner(null)
    setGroupParticipation({})
    setShowAiHelp(false)

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
      setGroupVotes([])
      setTextVerification("")
      resetChallenge()
      setIsInitialized(false)
      setSelectedPartner(null)
      setGroupParticipation({})
      setShowAiHelp(false)

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

      // Reproducir sonido de completado
      playSoundEffect("challenge_complete")

      // Añadir animación
      setAnimateButton(true)
      setTimeout(() => setAnimateButton(false), 500)

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

      // Reproducir sonido de error
      playSoundEffect("error")
    }
  }

  // Handle partner selection confirmation
  const handlePartnerConfirm = () => {
    setShowPartnerSelection(false)
  }

  // Handle group participation toggle
  const toggleGroupParticipation = (playerId: string) => {
    setGroupParticipation((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }))
  }

  // Get participating players count
  const getParticipatingPlayersCount = () => {
    return Object.values(groupParticipation).filter(Boolean).length
  }

  // Get challenge status message
  const getChallengeStatusMessage = () => {
    switch (challengeType) {
      case "individual":
        return "Reto individual: Solo tú debes completarlo"
      case "duet":
        const partner = players.find((p) => p.id === selectedPartner)
        return `Reto en dueto: Tú y ${partner ? partner.name : "tu compañero"} deben completarlo juntos`
      case "group":
        return `Reto grupal: ${getParticipatingPlayersCount()} de ${players.length} participantes`
      default:
        return ""
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

  // Handle text verification
  const submitTextVerification = async () => {
    if (!textVerification.trim()) {
      setVerificationError("Por favor, describe cómo completaste el reto.")
      return
    }

    try {
      // Simulate verification with text
      const success = true // Always succeed for demo purposes

      if (success) {
        updatePlayerProgress("text")
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting text verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Handle group verification with emoji votes
  const addGroupVote = (playerId: string, voteType: VoteType) => {
    // Check if player has already voted
    const existingVoteIndex = groupVotes.findIndex((vote) => vote.playerId === playerId)

    if (existingVoteIndex !== -1) {
      // Update existing vote
      setGroupVotes((prev) => {
        const newVotes = [...prev]
        newVotes[existingVoteIndex] = {
          playerId,
          voteType,
          timestamp: Date.now(),
        }
        return newVotes
      })
    } else {
      // Add new vote
      setGroupVotes((prev) => [
        ...prev,
        {
          playerId,
          voteType,
          timestamp: Date.now(),
        },
      ])
    }

    // Reproducir sonido de voto
    playSoundEffect("vote")

    // Show toast notification
    const player = players.find((p) => p.id === playerId)
    const voteMessages = {
      heart: "¡Le encantó!",
      skull: "No le convenció...",
      thumbsUp: "¡Aprobado!",
      party: "¡Fiesta total!",
      fire: "¡Fuego puro!",
    }

    toast({
      title: `${player?.name} ha votado`,
      description: voteMessages[voteType],
      duration: 2000,
    })
  }

  const getPositiveVotesCount = () => {
    // Count positive votes (heart, thumbsUp, party, fire)
    return groupVotes.filter(
      (vote) =>
        vote.voteType === "heart" ||
        vote.voteType === "thumbsUp" ||
        vote.voteType === "party" ||
        vote.voteType === "fire",
    ).length
  }

  const getNegativeVotesCount = () => {
    // Count negative votes (skull)
    return groupVotes.filter((vote) => vote.voteType === "skull").length
  }

  const handleGroupVerification = async () => {
    try {
      // Calculate threshold based on number of participants
      const threshold = getVerificationThreshold()
      const positiveVotes = getPositiveVotesCount()

      // Verification succeeds if positive votes >= threshold
      const success = positiveVotes >= threshold

      if (success) {
        await verifyChallenge("group", { votes: positiveVotes, threshold })
        updatePlayerProgress("group")
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        // Failed verification
        toast({
          title: "Verificación fallida",
          description: `Necesitas al menos ${threshold} votos positivos para completar el reto.`,
          variant: "destructive",
        })
      }

      setActiveTab("result")
    } catch (err) {
      console.error("Error submitting group verification:", err)
      setVerificationError("Ocurrió un error al enviar la verificación. Por favor, intenta de nuevo.")
    }
  }

  // Check if a player has already voted
  const hasPlayerVoted = (playerId: string) => {
    return groupVotes.some((vote) => vote.playerId === playerId)
  }

  // Get a player's vote type
  const getPlayerVoteType = (playerId: string): VoteType | null => {
    const vote = groupVotes.find((vote) => vote.playerId === playerId)
    return vote ? vote.voteType : null
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

      // Add sticker if card has sticker_integration
      const updatedStickers = [...(player.stickers || [])]
      if (currentCard?.sticker_integration) {
        // Extract sticker type from the integration text
        // This is a simplified approach - in a real app, you'd have a more structured way to define stickers
        const stickerMatch = currentCard.sticker_integration.match(/sticker\s+([🎤💔🤡💬🧨💃🧸🚩🎭🧠🫣🫦🦁])/u)
        if (stickerMatch && stickerMatch[1]) {
          const emojiToStickerType: Record<string, StickerType> = {
            "🎤": StickerType.VOZ_TELENOVELA,
            "💔": StickerType.CORAZON_ROTO,
            "🤡": StickerType.PAYASO_OFICIAL,
            "💬": StickerType.TEXTO_MAL_MANDADO,
            "🧨": StickerType.CAUSA_CAOS,
            "💃": StickerType.VERGUENZA_AJENA,
            "🧸": StickerType.CHICLE_EMOCIONAL,
            "🚩": StickerType.RED_FLAG_FLAG,
            "🎭": StickerType.MODO_DRAMATICA,
            "🧠": StickerType.SOBREPENSAR,
            "🫣": StickerType.FACEPALM_TOTAL,
            "🫦": StickerType.TENSION_GENERADA,
            "🦁": StickerType.RUGIDO_INTERNO,
          }

          const stickerType = emojiToStickerType[stickerMatch[1]]
          if (stickerType && !updatedStickers.includes(stickerType)) {
            updatedStickers.push(stickerType)

            // Show toast notification for new sticker
            toast({
              title: "¡Nuevo sticker desbloqueado!",
              description: `Has conseguido el sticker ${stickerMatch[1]} ${stickerType}`,
              duration: 3000,
            })
          }
        }
      }

      // Check for sticker combos
      const combo = getComboByStickers(updatedStickers)
      const updatedCombos = [...(player.unlockedCombos || [])]

      if (combo && !updatedCombos.includes(combo.nombre_combo)) {
        updatedCombos.push(combo.nombre_combo)
        setUnlockedCombo(combo)
        setShowStickerCombo(true)
      }

      // Update the current player
      updatedPlayers[currentPlayerIndex] = {
        ...player,
        completedCards,
        emotionalScore,
        tier,
        assignedCards: remainingCards,
        stickers: updatedStickers,
        unlockedCombos: updatedCombos,
      }

      // For duet challenges, also update the partner's progress
      if (challengeType === "duet" && selectedPartner) {
        const partnerIndex = updatedPlayers.findIndex((p) => p.id === selectedPartner)
        if (partnerIndex !== -1) {
          const partner = updatedPlayers[partnerIndex]

          // Partner gets half the emotional intensity increase
          const partnerIntensityIncrease = Math.floor(intensityIncrease / 2)
          const partnerEmotionalScore = Math.min(100, partner.emotionalScore + partnerIntensityIncrease)

          // Partner doesn't complete the card, but gets emotional score
          updatedPlayers[partnerIndex] = {
            ...partner,
            emotionalScore: partnerEmotionalScore,
            tier: calculateTier(partner.completedCards.length, partnerEmotionalScore),
          }
        }
      }

      // For group challenges, update all participating players' progress
      if (challengeType === "group") {
        Object.entries(groupParticipation).forEach(([playerId, isParticipating]) => {
          if (isParticipating && playerId !== player.id) {
            // Skip current player as already updated
            const participantIndex = updatedPlayers.findIndex((p) => p.id === playerId)
            if (participantIndex !== -1) {
              const participant = updatedPlayers[participantIndex]

              // Participants get 1/3 of the emotional intensity increase
              const participantIntensityIncrease = Math.floor(intensityIncrease / 3)
              const participantEmotionalScore = Math.min(100, participant.emotionalScore + participantIntensityIncrease)

              updatedPlayers[participantIndex] = {
                ...participant,
                emotionalScore: participantEmotionalScore,
                tier: calculateTier(participant.completedCards.length, participantEmotionalScore),
              }
            }
          }
        })
      }

      return updatedPlayers
    })
  }

  // Handle reward claiming
  const handleClaimReward = () => {
    try {
      claimReward()

      // Reproducir sonido de recompensa
      playSoundEffect("reward")

      // Añadir animación
      setAnimateReward(true)
      setTimeout(() => setAnimateReward(false), 800)

      // Mostrar generador de memes si es apropiado
      if (challengeType === "individual" || challengeType === "duet") {
        setMemeGeneratorText(textVerification || "¡He completado el reto!")
        setShowMemeGenerator(true)
      }

      moveToNextPlayer("completed")
    } catch (err) {
      console.error("Error claiming reward:", err)
      setVerificationError("Ocurrió un error al reclamar la recompensa. Por favor, intenta de nuevo.")

      // Reproducir sonido de error
      playSoundEffect("error")
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

  // Copy session link to clipboard
  const copySessionLink = () => {
    navigator.clipboard.writeText(sessionLink)
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace de la sesión ha sido copiado al portapapeles.",
    })
  }

  // Toggle AI help
  const toggleAiHelp = () => {
    setShowAiHelp(!showAiHelp)
  }

  // Get vote button color based on vote type
  const getVoteButtonColor = (voteType: VoteType) => {
    switch (voteType) {
      case "heart":
        return "bg-pink-100 hover:bg-pink-200 text-pink-600"
      case "skull":
        return "bg-gray-100 hover:bg-gray-200 text-gray-600"
      case "thumbsUp":
        return "bg-blue-100 hover:bg-blue-200 text-blue-600"
      case "party":
        return "bg-purple-100 hover:bg-purple-200 text-purple-600"
      case "fire":
        return "bg-orange-100 hover:bg-orange-200 text-orange-600"
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-600"
    }
  }

  // Get vote icon based on vote type
  const getVoteIcon = (voteType: VoteType) => {
    switch (voteType) {
      case "heart":
        return <Heart className="h-5 w-5" />
      case "skull":
        return <Skull className="h-5 w-5" />
      case "thumbsUp":
        return <ThumbsUp className="h-5 w-5" />
      case "party":
        return <PartyPopper className="h-5 w-5" />
      case "fire":
        return <Flame className="h-5 w-5" />
      default:
        return <ThumbsUp className="h-5 w-5" />
    }
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
                <Button
                  onClick={capturePhoto}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capturar Foto
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setPhotoData(null)}>
                    Volver a Capturar
                  </Button>
                  <Button
                    onClick={submitPhotoVerification}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                  >
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
                <Button
                  onClick={startRecording}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:opacity-90"
                >
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
                  <Button
                    onClick={submitAudioVerification}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Enviar Verificación
                  </Button>
                </>
              )}
            </div>
          </div>
        )

      case "group":
        const threshold = getVerificationThreshold()
        const positiveVotes = getPositiveVotesCount()
        const negativeVotes = getNegativeVotesCount()

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verificación grupal</h3>
            <p className="text-sm text-gray-500">
              Necesitas que al menos {threshold} personas confirmen que has completado el reto.
            </p>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
              <div className="flex justify-between items-center">
                <span className="font-medium">Votos positivos:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {positiveVotes} / {threshold}
                </Badge>
              </div>
              <Progress
                value={(positiveVotes / threshold) * 100}
                className="h-2 mt-2 bg-pink-200"
                indicatorClassName="bg-gradient-to-r from-pink-500 to-purple-500"
              />

              <div className="flex justify-between items-center mt-3">
                <span className="font-medium">Votos negativos:</span>
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {negativeVotes}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Jugadores</h4>
                <div className="space-y-2">
                  {players
                    .filter((p) => p.id !== currentPlayer.id)
                    .map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={player.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{player.name}</span>
                        </div>
                        {hasPlayerVoted(player.id) && (
                          <Badge className={`${getVoteButtonColor(getPlayerVoteType(player.id) || "thumbsUp")}`}>
                            {getVoteIcon(getPlayerVoteType(player.id) || "thumbsUp")}
                          </Badge>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Votar como...</h4>
                <div className="space-y-2">
                  {players
                    .filter((p) => p.id !== currentPlayer.id)
                    .map((player) => (
                      <div key={player.id} className="p-2 bg-gray-50 rounded-lg border">
                        <div className="flex flex-wrap gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${getVoteButtonColor("heart")} ${getPlayerVoteType(player.id) === "heart" ? "ring-2 ring-pink-500" : ""}`}
                                  onClick={() => addGroupVote(player.id, "heart")}
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Me encanta</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${getVoteButtonColor("thumbsUp")} ${getPlayerVoteType(player.id) === "thumbsUp" ? "ring-2 ring-blue-500" : ""}`}
                                  onClick={() => addGroupVote(player.id, "thumbsUp")}
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Apruebo</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${getVoteButtonColor("party")} ${getPlayerVoteType(player.id) === "party" ? "ring-2 ring-purple-500" : ""}`}
                                  onClick={() => addGroupVote(player.id, "party")}
                                >
                                  <PartyPopper className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>¡Fiesta!</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${getVoteButtonColor("fire")} ${getPlayerVoteType(player.id) === "fire" ? "ring-2 ring-orange-500" : ""}`}
                                  onClick={() => addGroupVote(player.id, "fire")}
                                >
                                  <Flame className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>¡Fuego!</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`${getVoteButtonColor("skull")} ${getPlayerVoteType(player.id) === "skull" ? "ring-2 ring-gray-500" : ""}`}
                                  onClick={() => addGroupVote(player.id, "skull")}
                                >
                                  <Skull className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>No me convence</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <Button
              onClick={handleGroupVerification}
              disabled={positiveVotes < threshold}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 mt-4"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Verificar con Grupo ({positiveVotes}/{threshold})
            </Button>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cuéntanos cómo completaste el reto</h3>
            <p className="text-sm text-gray-500">Describe brevemente cómo realizaste el desafío.</p>

            <Textarea
              placeholder="Escribe aquí tu descripción..."
              value={textVerification}
              onChange={(e) => setTextVerification(e.target.value)}
              className="min-h-[120px]"
            />

            <Button
              onClick={submitTextVerification}
              className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:opacity-90"
              disabled={!textVerification.trim()}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Enviar Verificación
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

          {/* Stickers section */}
          {currentPlayer.stickers && currentPlayer.stickers.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium flex items-center">
                <Sparkles className="h-5 w-5 text-purple-500 mr-2" />
                Tus stickers:
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentPlayer.stickers.map((sticker) => (
                  <Badge key={sticker} className="bg-white text-purple-700 border border-purple-200 py-1 px-2">
                    {sticker}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Añadir botón para crear meme */}
          <Button
            onClick={() => {
              setMemeGeneratorText(textVerification || "¡He completado el reto!")
              setShowMemeGenerator(true)
              playSoundEffect("click")
            }}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 mb-2"
          >
            <ImageIcon className="h-4 w-4" />
            Crear Meme para Compartir
          </Button>

          <Button
            onClick={handleClaimReward}
            className={`w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:opacity-90 ${animateReward ? "animate-bounce" : ""}`}
          >
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

  const handleMemeGenerated = (url: string | null) => {
    setGeneratedMemeUrl(url)
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

      {/* Button to show rewards summary and share session */}
      <div className="mb-4 flex justify-end gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowShareDialog(true)}>
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Compartir Sesión</span>
          <span className="sm:hidden">Compartir</span>
        </Button>
        <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowRewardsSummary(true)}>
          <Award className="h-4 w-4" />
          <span className="hidden sm:inline">Ver Recompensas</span>
          <span className="sm:hidden">Recompensas</span>
        </Button>
        <SoundControls className="ml-2" />
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

          {/* Challenge type indicator */}
          {currentCard && (
            <div className="mb-4 p-3 rounded-lg border bg-white shadow-sm">
              <div className="flex items-center gap-2">
                {challengeType === "individual" && <User className="h-5 w-5 text-blue-500" />}
                {challengeType === "duet" && <UserPlus className="h-5 w-5 text-purple-500" />}
                {challengeType === "group" && <Users className="h-5 w-5 text-green-500" />}
                <h3 className="font-medium">{getChallengeStatusMessage()}</h3>
              </div>

              {challengeType === "duet" && selectedPartner && (
                <div className="mt-2 flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={players.find((p) => p.id === selectedPartner)?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{players.find((p) => p.id === selectedPartner)?.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Tu compañero: {players.find((p) => p.id === selectedPartner)?.name}</span>
                </div>
              )}

              {challengeType === "group" && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Participantes:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {players.map((player) => (
                      <Badge
                        key={player.id}
                        variant={groupParticipation[player.id] ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleGroupParticipation(player.id)}
                      >
                        {player.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

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
                    verificationType={verificationMethod}
                    onReaction={(type) => console.log("Reaction:", type)}
                  />

                  {/* AI Help Button */}
                  <div className="mt-4 mb-2">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={toggleAiHelp}
                    >
                      <Lightbulb className="h-4 w-4" />
                      {showAiHelp ? "Ocultar ayuda de IA" : "Mostrar ayuda de IA"}
                    </Button>
                  </div>

                  {/* AI Suggestion */}
                  {showAiHelp && currentCard.ai_backup_response && (
                    <div className="mb-4">
                      <AIsuggestion suggestion={currentCard.ai_backup_response} onClose={() => setShowAiHelp(false)} />
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleCompleteChallenge}
                      className={`flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 ${animateButton ? "animate-pulse" : ""}`}
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

      {/* Dialog for partner selection */}
      <Dialog open={showPartnerSelection} onOpenChange={setShowPartnerSelection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elige un compañero para el reto</DialogTitle>
            <DialogDescription>
              Este es un reto en dueto. Selecciona a otro jugador para completar el reto juntos.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={selectedPartner || ""} onValueChange={setSelectedPartner}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un compañero" />
              </SelectTrigger>
              <SelectContent>
                {players
                  .filter((p) => p.id !== currentPlayer.id)
                  .map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button onClick={handlePartnerConfirm} disabled={!selectedPartner}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Session Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartir Sesión</DialogTitle>
            <DialogDescription>Comparte este enlace con tus amigos para que se unan a la sesión.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center space-x-2">
              <input type="text" value={sessionLink} readOnly className="flex-1 px-3 py-2 border rounded-md text-sm" />
              <Button size="icon" onClick={copySessionLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="bg-white p-4 rounded-lg border">
                <img
                  src={`/placeholder.svg?height=200&width=200&text=QR+Code`}
                  alt="QR Code"
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Escanea este código QR para unirte a la sesión
            </p>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowShareDialog(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sticker Combo Dialog */}
      <Dialog open={showStickerCombo} onOpenChange={setShowStickerCombo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">¡Combo de Stickers Desbloqueado!</DialogTitle>
            <DialogDescription className="text-center">
              Has conseguido todos los stickers necesarios para desbloquear un combo especial.
            </DialogDescription>
          </DialogHeader>

          {unlockedCombo && (
            <div className="py-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg text-center mb-4">
                <h3 className="text-xl font-bold">{unlockedCombo.nombre_combo}</h3>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 mb-4">
                <h4 className="font-medium mb-2">Stickers necesarios:</h4>
                <div className="flex flex-wrap gap-2">
                  {unlockedCombo.stickers_necesarios.map((sticker) => (
                    <Badge key={sticker} className="bg-white text-purple-700 border border-purple-200 py-1 px-2">
                      {sticker}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200 mb-4">
                <h4 className="font-medium mb-2">Efecto grupal:</h4>
                <p className="text-amber-800">{unlockedCombo.efecto_grupal}</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-medium mb-2">Premio:</h4>
                <p className="text-green-800 font-medium">{unlockedCombo.premio.descripcion}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowStickerCombo(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              ¡Genial!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Help dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 rounded-full h-10 w-10 bg-white shadow-lg"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tipos de Retos</DialogTitle>
            <DialogDescription>
              En La Cortesía, hay tres tipos de retos que pueden aparecer en las cartas:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Retos Individuales</h4>
                <p className="text-sm text-gray-500">
                  Estos retos los completa únicamente el jugador en turno. Solo tú debes completar el desafío.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UserPlus className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Retos en Dueto</h4>
                <p className="text-sm text-gray-500">
                  Para estos retos necesitas un compañero. El sistema puede elegir uno aleatoriamente o permitirte
                  seleccionar con quién quieres completar el reto.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Retos Grupales</h4>
                <p className="text-sm text-gray-500">
                  Estos retos involucran a todo el grupo. Todos los participantes deben contribuir para completarlo,
                  aunque la principal responsabilidad es del jugador en turno.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

      {/* Meme Generator Dialog */}
      {showMemeGenerator && (
        <Dialog open={showMemeGenerator} onOpenChange={setShowMemeGenerator}>
          <DialogContent className="max-w-4xl">
            <MemeGenerator
              initialText={memeGeneratorText}
              initialCategory={
                currentCard?.emotional_tier === "chaotic"
                  ? "fiesta"
                  : currentCard?.emotional_tier === "intense"
                    ? "despecho"
                    : "general"
              }
              onMemeGenerated={handleMemeGenerated}
              onClose={() => setShowMemeGenerator(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
