"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  HeartCrack,
  Music,
  Sparkles,
  ThumbsUp,
  Share,
  Gift,
  CheckCircle,
  Flame,
  Smile,
  Laugh,
  Loader2,
  Volume2,
  VolumeX,
  Camera,
  CreditCard,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { getBrandCampaignById, getBrandCampaignsByBrandId, getVenueById } from "@/lib/brand-campaigns"
import { generateCardJSON } from "@/lib/card-generator-pipeline-enhanced"

interface Reaction {
  playerId: string
  type: "laugh" | "heart" | "thumbsUp" | "wow" | "applause"
  timestamp: number
}

interface Player {
  id: string
  name: string
  image: string
  stickers: string[]
  intensity: number
}

export default function BrandedExperiencePlayPage() {
  const searchParams = useSearchParams()
  const brandId = searchParams.get("brand")
  const campaignId = searchParams.get("campaign")
  const venueId = searchParams.get("venue")

  // Game state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<any | null>(null)
  const [venue, setVenue] = useState<any | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(-1)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [reactionPhase, setReactionPhase] = useState(false)
  const [selectedCard, setSelectedCard] = useState<any | null>(null)
  const [completedChallenge, setCompletedChallenge] = useState(false)
  const [socialTrigger, setSocialTrigger] = useState(false)
  const [rewardClaimed, setRewardClaimed] = useState(false)
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [emotionalIntensity, setEmotionalIntensity] = useState(30)
  const [notifications, setNotifications] = useState<string[]>([])
  const [earnedStickers, setEarnedStickers] = useState<string[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [showTutorial, setShowTutorial] = useState(true)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [cardFlipAnimation, setCardFlipAnimation] = useState(false)
  const [showReactionOptions, setShowReactionOptions] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [zeroSumCards, setZeroSumCards] = useState<any[]>([])
  const [showZeroSumModal, setShowZeroSumModal] = useState(false)

  // Audio reference
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Mock deck of cards
  const [deck, setDeck] = useState<any[]>([])

  // Mock players
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "p1",
      name: "Tú",
      image: "/placeholder.svg?height=40&width=40&text=You",
      stickers: [],
      intensity: 30,
    },
    {
      id: "p2",
      name: "Carlos",
      image: "/placeholder.svg?height=40&width=40&text=C",
      stickers: ["Tears de Oro", "Friendzone Champion"],
      intensity: 45,
    },
    {
      id: "p3",
      name: "Diana",
      image: "/placeholder.svg?height=40&width=40&text=D",
      stickers: ["Voz de Borrachx", "Petty Pro"],
      intensity: 60,
    },
    {
      id: "p4",
      name: "Miguel",
      image: "/placeholder.svg?height=40&width=40&text=M",
      stickers: ["Micrófono Ardido"],
      intensity: 25,
    },
  ])

  // Load campaign data
  useEffect(() => {
    setLoading(true)

    try {
      // Get campaign data
      let foundCampaign = null

      if (campaignId) {
        foundCampaign = getBrandCampaignById(campaignId)
      } else if (brandId) {
        const campaigns = getBrandCampaignsByBrandId(brandId)
        foundCampaign = campaigns.length > 0 ? campaigns[0] : null
      }

      if (!foundCampaign) {
        setError("Campaign not found")
        setLoading(false)
        return
      }

      setCampaign(foundCampaign)

      // Get venue data if provided
      if (venueId) {
        const foundVenue = getVenueById(foundCampaign.id, venueId)
        if (foundVenue) {
          setVenue(foundVenue)
        }
      }

      // Generate branded deck
      generateBrandedDeck(foundCampaign)

      setLoading(false)
    } catch (err) {
      console.error("Error loading branded experience:", err)
      setError("Failed to load experience")
      setLoading(false)
    }
  }, [brandId, campaignId, venueId])

  // Generate a branded deck of cards
  const generateBrandedDeck = (campaign: any) => {
    // Generate 10 cards with brand-specific parameters
    const newDeck = Array.from({ length: 10 }, () => {
      // Use the campaign's preferred parameters
      const emotionalTier = getRandomItem(campaign.emotionalTiers)
      const challengeType = getRandomItem(campaign.challengeTypes)
      const themeTag = getRandomItem(campaign.cardThemes)

      // Generate a card with these parameters
      const card = generateCardJSON(true)

      // Override with brand-specific values
      card.brand_sponsor = {
        id: campaign.brandId,
        name: campaign.brandName,
        logo: campaign.logo,
        industry: campaign.brandId,
        rewardValue: campaign.rewardValue,
      }

      // Customize reward based on brand
      if (campaign.rewardType === "shot") {
        card.reward = `Shot de ${campaign.brandName}: ${campaign.rewardDescription}`
        card.reward_type = "shot"
      } else if (campaign.rewardType === "discount") {
        card.reward = `Descuento de ${campaign.brandName}: ${campaign.rewardDescription}`
        card.reward_type = "discount"
      } else if (campaign.rewardType === "zerosum_card") {
        card.reward = `Tarjeta ZeroSum: ${campaign.rewardValue} MXN patrocinada por ${campaign.brandName}`
        card.reward_type = "zerosum_card"
      } else {
        card.reward = `${campaign.rewardDescription} de ${campaign.brandName}`
        card.reward_type = campaign.rewardType
      }

      return card
    })

    setDeck(newDeck)
  }

  // Helper function to get a random item from an array
  function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  // Camera functionality
  useEffect(() => {
    if (showCamera && videoRef.current && !photoTaken) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.error("Error accessing camera:", err)
        }
      }

      startCamera()

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }, [showCamera, photoTaken])

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL("image/png")
        setPhotoUrl(dataUrl)
        setPhotoTaken(true)

        // Stop the camera stream
        if (video.srcObject) {
          const tracks = (video.srcObject as MediaStream).getTracks()
          tracks.forEach((track) => track.stop())
        }
      }
    }
  }

  const resetCamera = () => {
    setPhotoTaken(false)
    setPhotoUrl(null)
  }

  const startGame = () => {
    setGameStarted(true)
    setShowTutorial(true)
    setTutorialStep(0)
    addNotification(
      `¡Bienvenido a la experiencia ${campaign?.brandName} x La Cortesía! Toca 'Sacar Carta' para comenzar.`,
    )
  }

  const drawCard = () => {
    if (currentCardIndex >= deck.length - 1) {
      addNotification("¡Se acabaron las cartas! El juego ha terminado.")
      return
    }

    const nextIndex = currentCardIndex + 1
    setCurrentCardIndex(nextIndex)
    setSelectedCard(deck[nextIndex])
    setCardFlipped(false)
    setCompletedChallenge(false)
    setSocialTrigger(false)
    setRewardClaimed(false)
    setReactionPhase(false)
    setReactions([])
    setIsPlaying(false)
    setShowCamera(false)
    setPhotoTaken(false)
    setPhotoUrl(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    addNotification("Has sacado una nueva carta. Toca para voltearla.")

    if (showTutorial && tutorialStep === 0) {
      setTutorialStep(1)
    }
  }

  const flipCard = () => {
    setCardFlipAnimation(true)
    setTimeout(() => {
      setCardFlipped(true)
      setCardFlipAnimation(false)
      addNotification(`¡${selectedCard?.card_title}! Lee el reto y prepárate para completarlo.`)
    }, 500)

    if (showTutorial && tutorialStep === 1) {
      setTutorialStep(2)
    }
  }

  const completeChallenge = () => {
    setCompletedChallenge(true)
    setReactionPhase(true)
    setShowReactionOptions(true)

    // Increase emotional intensity based on card tier
    let intensityIncrease = 10
    if (selectedCard?.emotional_tier === "intense") intensityIncrease = 20
    if (selectedCard?.emotional_tier === "chaotic") intensityIncrease = 30

    const newIntensity = Math.min(100, emotionalIntensity + intensityIncrease)
    setEmotionalIntensity(newIntensity)

    // Update player's intensity
    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex].intensity = newIntensity
    setPlayers(updatedPlayers)

    addNotification("¡Has completado el reto! Espera a que los demás reaccionen.")

    // Simulate other players' reactions after a delay
    setTimeout(() => {
      const otherPlayers = players.filter((_, i) => i !== currentPlayerIndex)
      const randomReactions: Reaction[] = otherPlayers.map((player) => {
        const reactionTypes: ("laugh" | "heart" | "thumbsUp" | "wow" | "applause")[] = [
          "laugh",
          "heart",
          "thumbsUp",
          "wow",
          "applause",
        ]
        return {
          playerId: player.id,
          type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)],
          timestamp: Date.now(),
        }
      })

      setReactions(randomReactions)

      // Determine if social trigger is activated
      const triggerChance = Math.random() > 0.5
      setSocialTrigger(triggerChance)

      if (triggerChance) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
        addNotification("¡Se ha activado el desencadenante social! Has desbloqueado un bonus.")
      }
    }, 2000)

    if (showTutorial && tutorialStep === 2) {
      setTutorialStep(3)
    }
  }

  const claimReward = () => {
    setRewardClaimed(true)
    setShowReactionOptions(false)

    const newStickers = [...earnedStickers]
    if (selectedCard) {
      newStickers.push(selectedCard.sticker)
    }
    setEarnedStickers(newStickers)

    // Add sticker to player
    const updatedPlayers = [...players]
    if (selectedCard) {
      updatedPlayers[currentPlayerIndex].stickers.push(selectedCard.sticker)
    }
    setPlayers(updatedPlayers)

    // If the reward is a ZeroSum card, create it
    if (selectedCard?.reward_type === "zerosum_card" && selectedCard.brand_sponsor) {
      const newCard = {
        id: `zerosum-${Date.now()}`,
        brand: selectedCard.brand_sponsor.name,
        value: selectedCard.brand_sponsor.rewardValue * (socialTrigger ? 1.5 : 1), // 50% bonus if social trigger activated
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "active",
        cardNumber: `4000 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        cardholderName: players[currentPlayerIndex].name,
      }

      setZeroSumCards([...zeroSumCards, newCard])
      setShowZeroSumModal(true)
      addNotification(`¡Has recibido una tarjeta ZeroSum de ${newCard.value} MXN patrocinada por ${newCard.brand}!`)
    } else {
      addNotification(`¡Has reclamado tu recompensa: ${selectedCard?.reward}!`)
    }

    // Move to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
    setCurrentPlayerIndex(nextPlayerIndex)

    if (showTutorial && tutorialStep === 3) {
      setTutorialStep(4)
      setTimeout(() => {
        setShowTutorial(false)
      }, 5000)
    }
  }

  const addNotification = (message: string) => {
    const newNotification = message
    setNotifications((prev) => [newNotification, ...prev].slice(0, 5))

    // Auto-dismiss notifications after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => {
        const index = prev.indexOf(newNotification)
        if (index !== -1) {
          const newNotifications = [...prev]
          newNotifications.splice(index, 1)
          return newNotifications
        }
        return prev
      })
    }, 5000)
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity < 40) return "bg-blue-500"
    if (intensity < 70) return "bg-purple-500"
    return "bg-red-500"
  }

  const getIntensityLabel = (intensity: number) => {
    if (intensity < 40) return "Suave"
    if (intensity < 70) return "Intenso"
    return "Caótico"
  }

  const getReactionIcon = (type: string) => {
    switch (type) {
      case "laugh":
        return <Laugh className="h-4 w-4 text-yellow-500" />
      case "heart":
        return <Heart className="h-4 w-4 text-red-500" />
      case "thumbsUp":
        return <ThumbsUp className="h-4 w-4 text-blue-500" />
      case "wow":
        return <Smile className="h-4 w-4 text-purple-500" />
      case "applause":
        return <BadgeCheck className="h-4 w-4 text-green-500" />
      default:
        return <ThumbsUp className="h-4 w-4" />
    }
  }

  const getTutorialMessage = () => {
    switch (tutorialStep) {
      case 0:
        return `Bienvenido a ${campaign?.brandName} x La Cortesía. Comienza sacando una carta del mazo.`
      case 1:
        return "Toca la carta para voltearla y ver el reto que debes completar."
      case 2:
        return "Lee el reto y cuando estés listo, haz clic en 'He Completado el Reto'."
      case 3:
        return "¡Genial! Ahora espera las reacciones del grupo y reclama tu recompensa."
      case 4:
        return `¡Felicidades! Has ganado un sticker y una recompensa de ${campaign?.brandName}. Continúa jugando para coleccionar más.`
      default:
        return ""
    }
  }

  const togglePlayMusic = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
    }

    setIsPlaying(!isPlaying)
  }

  const addReaction = (type: "laugh" | "heart" | "thumbsUp" | "wow" | "applause") => {
    const newReaction: Reaction = {
      playerId: players[0].id,
      type,
      timestamp: Date.now(),
    }

    setReactions((prev) => [...prev, newReaction])

    // Check if this reaction might trigger the social trigger
    if (reactions.length >= 2) {
      setSocialTrigger(true)
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      addNotification("¡Tu reacción ha activado el desencadenante social! Has desbloqueado un bonus.")
    }
  }

  const shareContent = () => {
    setShowShareModal(true)
  }

  const closeShareModal = () => {
    setShowShareModal(false)
  }

  const openCamera = () => {
    setShowCamera(true)
  }

  const closeCamera = () => {
    setShowCamera(false)
    setPhotoTaken(false)
    setPhotoUrl(null)

    // Stop the camera stream if it's active
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
  }

  const closeZeroSumModal = () => {
    setShowZeroSumModal(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-md p-4 flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-center text-lg">Cargando experiencia...</p>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto max-w-md p-4 flex flex-col items-center justify-center min-h-screen">
        <HeartCrack className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-center">Experiencia no encontrada</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Lo sentimos, no pudimos encontrar la experiencia que buscas.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    )
  }

  return (
    <div
      className="container mx-auto max-w-5xl p-4 py-8 min-h-screen"
      style={{
        background: `linear-gradient(to bottom, ${campaign.primaryColor}10, ${campaign.secondaryColor}10)`,
      }}
    >
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link
            href={`/experience?brand=${campaign.brandId}&campaign=${campaign.id}${venue ? `&venue=${venue.id}` : ""}`}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">{campaign.brandName} x La Cortesía</h1>
      </div>

      {!gameStarted ? (
        <Card className="mb-8 overflow-hidden">
          <div
            className="relative h-48"
            style={{
              background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartCrack className="h-24 w-24 text-white opacity-20" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold">{campaign.title}</h2>
              <p className="text-sm opacity-90">{venue ? `En ${venue.name}` : "Experiencia exclusiva"}</p>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <img src={campaign.logo || "/placeholder.svg"} alt={campaign.brandName} className="h-6 w-6" />
              Simulador de Juego
            </CardTitle>
            <CardDescription>
              Experimenta "{campaign.brandName} x La Cortesía", el juego de cartas que combina storytelling emocional,
              desafíos y recompensas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Cómo se juega:</h3>
              <ol className="ml-5 list-decimal space-y-3 text-base text-muted-foreground">
                <li>
                  <span className="font-medium">Saca una carta</span>: Cada carta contiene un desafío basado en
                  experiencias de desamor.
                </li>
                <li>
                  <span className="font-medium">Completa el reto</span>: Puede ser cantar, confesar algo, o actuar una
                  situación.
                </li>
                <li>
                  <span className="font-medium">Activa desencadenantes sociales</span>: Si el grupo reacciona de cierta
                  manera, se desbloquean bonos.
                </li>
                <li>
                  <span className="font-medium">Gana recompensas</span>: Desde stickers digitales hasta{" "}
                  {campaign.rewardDescription}.
                </li>
              </ol>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <h3 className="mb-2 text-sm font-medium">Jugadores en esta sesión:</h3>
              <div className="flex flex-wrap gap-2">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={player.image || "/placeholder.svg"} alt={player.name} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={startGame}
              className="w-full py-6 text-lg"
              style={{
                backgroundColor: campaign.primaryColor,
                color: campaign.secondaryColor === "#FFFFFF" ? "white" : "black",
              }}
            >
              <Sparkles className="mr-3 h-5 w-5" />
              Comenzar Juego
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-5">
          <div className="space-y-6 md:col-span-3">
            <Card>
              <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {players[currentPlayerIndex].name === "Tú"
                      ? "Tu turno"
                      : `Turno de ${players[currentPlayerIndex].name}`}
                  </CardTitle>
                  <Badge variant="outline">
                    Ronda {currentCardIndex + 1}/{deck.length}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  Intensidad Emocional: {players[currentPlayerIndex].intensity}%
                  <Badge
                    variant="outline"
                    className={`ml-2 ${
                      players[currentPlayerIndex].intensity < 40
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : players[currentPlayerIndex].intensity < 70
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {getIntensityLabel(players[currentPlayerIndex].intensity)}
                  </Badge>
                </CardDescription>
                <Progress
                  value={players[currentPlayerIndex].intensity}
                  className={`h-2 w-full ${getIntensityColor(players[currentPlayerIndex].intensity)}`}
                />
              </CardHeader>
              <CardContent className="space-y-4 pb-2">
                {currentCardIndex === -1 ? (
                  <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-4">
                    <HeartCrack className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-center font-medium">Saca una carta para comenzar</p>
                    <Button
                      onClick={drawCard}
                      className="mt-4"
                      style={{
                        backgroundColor: campaign.primaryColor,
                        color: campaign.secondaryColor === "#FFFFFF" ? "white" : "black",
                      }}
                    >
                      Sacar Carta
                    </Button>
                  </div>
                ) : selectedCard && !cardFlipped ? (
                  <div className="flex justify-center">
                    <div
                      className={`cursor-pointer transition-all hover:scale-105 relative ${cardFlipAnimation ? "animate-card-flip" : ""}`}
                      onClick={flipCard}
                    >
                      <img
                        src={selectedCard.back_image_url || "/placeholder.svg"}
                        alt="Reverso de carta"
                        className="h-[400px] w-auto rounded-lg shadow-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-white text-opacity-80 text-lg font-bold">
                        Toca para voltear
                      </div>
                      {selectedCard.brand_sponsor && (
                        <div className="absolute bottom-4 right-4 bg-white rounded-full p-1 shadow-md">
                          <img
                            src={selectedCard.brand_sponsor.logo || "/placeholder.svg"}
                            alt={selectedCard.brand_sponsor.name}
                            className="h-8 w-8 rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : selectedCard && cardFlipped ? (
                  <div
                    className="flex min-h-[400px] flex-col rounded-lg p-6 shadow-lg relative"
                    style={{
                      background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
                      color: campaign.secondaryColor === "#FFFFFF" ? "white" : "black",
                    }}
                  >
                    {/* Add a semi-transparent overlay for text readability */}
                    <div className="absolute inset-0 bg-black/10 rounded-lg"></div>

                    {/* Make all content appear above the overlay */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white text-shadow-sm">{selectedCard.card_title}</h3>
                        <Badge variant="outline" className="border-opacity-50 bg-white bg-opacity-20">
                          {selectedCard.emotional_tier === "mild"
                            ? "Suave"
                            : selectedCard.emotional_tier === "intense"
                              ? "Intenso"
                              : "Caótico"}
                        </Badge>
                      </div>

                      {selectedCard.brand_sponsor && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg bg-white bg-opacity-25 p-2">
                          <img
                            src={selectedCard.brand_sponsor.logo || "/placeholder.svg"}
                            alt={selectedCard.brand_sponsor.name}
                            className="h-6 w-6 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-white">{selectedCard.brand_sponsor.name}</p>
                            <p className="text-xs text-white/90">
                              Completa el reto para ganar{" "}
                              {selectedCard.reward_type === "zerosum_card"
                                ? `una tarjeta ZeroSum de ${selectedCard.brand_sponsor.rewardValue} MXN`
                                : selectedCard.reward}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="mb-4 flex-1 rounded-lg bg-white bg-opacity-25 p-4">
                        <p className="font-medium text-base md:text-lg text-white">{selectedCard.challenge}</p>
                      </div>

                      <div className="mb-4 rounded-lg bg-white bg-opacity-25 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Music className="h-5 w-5" />
                            <div>
                              <p className="text-sm md:text-base font-medium">{selectedCard.spotify_song.title}</p>
                              <p className="text-xs md:text-sm opacity-75">{selectedCard.spotify_song.artist}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-white bg-opacity-20"
                            onClick={togglePlayMusic}
                          >
                            {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                          </Button>
                        </div>
                      </div>

                      {!completedChallenge ? (
                        <div className="mt-auto space-y-2">
                          <Button onClick={completeChallenge} variant="secondary" className="w-full py-5 text-base">
                            He Completado el Reto
                          </Button>
                          <div className="flex justify-center gap-2">
                            <Button variant="outline" size="sm" onClick={openCamera}>
                              <Camera className="mr-2 h-4 w-4" />
                              Capturar Momento
                            </Button>
                            <Button variant="outline" size="sm" onClick={shareContent}>
                              <Share className="mr-2 h-4 w-4" />
                              Compartir
                            </Button>
                          </div>
                        </div>
                      ) : !reactionPhase ? (
                        <div className="mt-auto flex items-center gap-2">
                          <Button disabled variant="outline" className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Esperando Reacciones...
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-auto space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {socialTrigger ? (
                              <div className="flex w-full flex-col rounded-lg bg-primary p-3 text-primary-foreground">
                                <p className="mb-1 font-medium">¡Desencadenante Social Activado!</p>
                                <p className="text-sm opacity-90">{selectedCard.social_trigger}</p>
                                {selectedCard.brand_sponsor && (
                                  <p className="text-sm opacity-90 mt-1">
                                    ¡Bonus de 50% en tu recompensa de {selectedCard.brand_sponsor.name}!
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="flex w-full flex-col rounded-lg bg-muted p-3">
                                <p className="mb-1 font-medium">Reacciones del grupo:</p>
                                <div className="flex flex-wrap gap-2">
                                  {reactions.map((reaction, i) => (
                                    <TooltipProvider key={i}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-center gap-1">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage
                                                src={
                                                  players.find((p) => p.id === reaction.playerId)?.image ||
                                                  "/placeholder.svg" ||
                                                  "/placeholder.svg" ||
                                                  "/placeholder.svg" ||
                                                  "/placeholder.svg"
                                                }
                                                alt="Player"
                                              />
                                              <AvatarFallback>
                                                {players.find((p) => p.id === reaction.playerId)?.name[0] || "?"}
                                              </AvatarFallback>
                                            </Avatar>
                                            {getReactionIcon(reaction.type)}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {players.find((p) => p.id === reaction.playerId)?.name || "Player"}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {showReactionOptions && (
                            <div className="flex justify-center gap-2 my-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800"
                                onClick={() => addReaction("laugh")}
                              >
                                <Laugh className="h-4 w-4 text-yellow-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                                onClick={() => addReaction("heart")}
                              >
                                <Heart className="h-4 w-4 text-red-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                                onClick={() => addReaction("thumbsUp")}
                              >
                                <ThumbsUp className="h-4 w-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800"
                                onClick={() => addReaction("wow")}
                              >
                                <Smile className="h-4 w-4 text-purple-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                                onClick={() => addReaction("applause")}
                              >
                                <BadgeCheck className="h-4 w-4 text-green-500" />
                              </Button>
                            </div>
                          )}

                          {!rewardClaimed ? (
                            <Button
                              onClick={claimReward}
                              className="w-full"
                              style={{
                                backgroundColor: campaign.primaryColor,
                                color: campaign.secondaryColor === "#FFFFFF" ? "white" : "black",
                              }}
                            >
                              <Gift className="mr-2 h-4 w-4" />
                              Reclamar Recompensa: {selectedCard.reward}
                            </Button>
                          ) : (
                            <Button disabled variant="outline" className="w-full">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Recompensa Reclamada
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Hidden audio element for song playback */}
                <audio
                  ref={audioRef}
                  src={`/placeholder.mp3`}
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentCardIndex <= 0}
                  onClick={() => {
                    if (currentCardIndex > 0) {
                      setCurrentCardIndex(currentCardIndex - 1)
                      setSelectedCard(deck[currentCardIndex - 1])
                      setCardFlipped(true)
                      setCompletedChallenge(true)
                      setReactionPhase(true)
                      setRewardClaimed(true)
                      setIsPlaying(false)
                      if (audioRef.current) {
                        audioRef.current.pause()
                        audioRef.current.currentTime = 0
                      }
                    }
                  }}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                {rewardClaimed || currentCardIndex === -1 ? (
                  <Button
                    size="sm"
                    onClick={drawCard}
                    style={{
                      backgroundColor: campaign.primaryColor,
                      color: campaign.secondaryColor === "#FFFFFF" ? "white" : "black",
                    }}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    {currentCardIndex === -1 ? "Sacar Carta" : "Siguiente Carta"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={!cardFlipped}
                    onClick={completeChallenge}
                    style={{
                      backgroundColor: campaign.primaryColor,
                      color: campaign.secondaryColor === "#FFFFFF" ? "white" : "black",
                    }}
                  >
                    {!cardFlipped ? "Voltea la Carta" : !completedChallenge ? "Completar Reto" : ""}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentCardIndex >= deck.length - 1 || rewardClaimed === false}
                  onClick={() => {
                    if (currentCardIndex < deck.length - 1) {
                      setCurrentCardIndex(currentCardIndex + 1)
                      setSelectedCard(deck[currentCardIndex + 1])
                      setCardFlipped(true)
                      setCompletedChallenge(false)
                      setReactionPhase(false)
                      setRewardClaimed(false)
                      setIsPlaying(false)
                      if (audioRef.current) {
                        audioRef.current.pause()
                        audioRef.current.currentTime = 0
                      }
                    }
                  }}
                >
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {showTutorial && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {tutorialStep + 1}
                    </div>
                    <p className="text-base md:text-lg">{getTutorialMessage()}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6 md:col-span-2">
            <Tabs defaultValue="players">
              <TabsList className="w-full">
                <TabsTrigger value="players">Jugadores</TabsTrigger>
                <TabsTrigger value="stickers">Stickers</TabsTrigger>
                <TabsTrigger value="rewards">Recompensas</TabsTrigger>
              </TabsList>

              <TabsContent value="players" className="space-y-4 mt-4">
                {players.map((player) => (
                  <Card
                    key={player.id}
                    className={currentPlayerIndex === players.indexOf(player) ? "border-primary" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className={currentPlayerIndex === players.indexOf(player) ? "ring-2 ring-primary" : ""}>
                          <AvatarImage src={player.image || "/placeholder.svg"} alt={player.name} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">
                            {player.name}
                            {currentPlayerIndex === players.indexOf(player) && (
                              <Badge variant="outline" className="ml-2">
                                Turno Actual
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-muted-foreground">Intensidad: {player.intensity}%</p>
                            <Progress
                              value={player.intensity}
                              className={`ml-2 h-1.5 w-20 ${getIntensityColor(player.intensity)}`}
                            />
                          </div>
                        </div>
                        <div className="flex">
                          {player.stickers.slice(0, 2).map((sticker, i) => (
                            <Badge key={i} className="mr-1" variant="secondary">
                              {sticker.split(" ")[0]}
                            </Badge>
                          ))}
                          {player.stickers.length > 2 && <Badge variant="outline">+{player.stickers.length - 2}</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="stickers" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Tus Stickers</CardTitle>
                    <CardDescription>Colecciona stickers completando retos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {players[0].stickers.length === 0 ? (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed p-4">
                        <BadgeCheck className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-center text-sm text-muted-foreground">Aún no has ganado ningún sticker</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {players[0].stickers.map((sticker, i) => (
                          <div key={i} className="flex flex-col items-center rounded-lg border p-3">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <BadgeCheck className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-center text-sm font-medium">{sticker}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rewards" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Recompensas de {campaign.brandName}</CardTitle>
                    <CardDescription>Recompensas ganadas en el juego</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {zeroSumCards.length === 0 ? (
                      <div className="flex h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed p-4">
                        <CreditCard className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-center text-sm text-muted-foreground">
                          Completa retos para ganar recompensas de {campaign.brandName}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {zeroSumCards.map((card, index) => (
                          <div key={index} className="rounded-lg border p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">{card.brand}</h3>
                              </div>
                              <Badge variant={card.status === "active" ? "default" : "secondary"}>
                                {card.status === "active"
                                  ? "Activa"
                                  : card.status === "pending"
                                    ? "Pendiente"
                                    : "Canjeada"}
                              </Badge>
                            </div>
                            <div
                              className="mb-3 rounded-lg p-4 text-white"
                              style={{
                                background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
                              }}
                            >
                              <p className="mb-1 text-xs opacity-80">Tarjeta Virtual</p>
                              <p className="font-mono text-lg">{card.cardNumber}</p>
                              <div className="mt-4 flex justify-between">
                                <div>
                                  <p className="text-xs opacity-80">Titular</p>
                                  <p className="text-sm">{card.cardholderName}</p>
                                </div>
                                <div>
                                  <p className="text-xs opacity-80">Valor</p>
                                  <p className="text-sm">${card.value} MXN</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <p className="text-muted-foreground">
                                Expira: {new Date(card.expiresAt).toLocaleDateString()}
                              </p>
                              <Button variant="outline" size="sm">
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Acerca de {campaign.brandName} x La Cortesía</CardTitle>
                <CardDescription>Información sobre esta experiencia</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted p-3">
                  <h4 className="flex items-center gap-1 text-sm font-medium">
                    <Flame className="h-4 w-4 text-orange-500" /> Intensidad Emocional
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Tu intensidad emocional determina la magnitud de tus recompensas. ¡Más intensidad, mejores premios!
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <h4 className="flex items-center gap-1 text-sm font-medium">
                    <img src={campaign.logo || "/placeholder.svg"} alt={campaign.brandName} className="h-4 w-4" />
                    Recompensas Exclusivas
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Completa retos para ganar {campaign.rewardDescription} y stickers exclusivos.
                  </p>
                </div>

                {venue && (
                  <div className="rounded-lg bg-muted p-3">
                    <h4 className="flex items-center gap-1 text-sm font-medium">Ubicación</h4>
                    <p className="text-xs text-muted-foreground">
                      {venue.name}, {venue.address}, {venue.city}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Capturar Momento</h3>
              <Button variant="ghost" size="sm" onClick={closeCamera}>
                ✕
              </Button>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-black">
              {!photoTaken ? (
                <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
              ) : (
                <img
                  src={photoUrl || "/placeholder.svg"}
                  alt="Captured moment"
                  className="h-full w-full object-cover"
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="mt-4 flex justify-center gap-2">
              {!photoTaken ? (
                <Button onClick={takePhoto}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capturar
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={resetCamera}>
                    Volver a Capturar
                  </Button>
                  <Button onClick={closeCamera}>Guardar Momento</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Compartir Experiencia</h3>
              <Button variant="ghost" size="sm" onClick={closeShareModal}>
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <p className="mb-2 font-medium">Compartir en redes sociales</p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" className="h-12 w-12 rounded-full p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pink-500"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-full p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-500"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-full p-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <p className="mb-2 font-medium">Mensaje personalizado</p>
                <textarea
                  className="w-full rounded-md border p-2 text-sm"
                  rows={3}
                  placeholder="Escribe un mensaje para compartir con tu experiencia..."
                  defaultValue={
                    selectedCard
                      ? `¡Acabo de completar el reto "${selectedCard.card_title}" en ${campaign.brandName} x La Cortesía! 🎭💔`
                      : ""
                  }
                ></textarea>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={closeShareModal}>
                Cancelar
              </Button>
              <Button onClick={closeShareModal}>Compartir</Button>
            </div>
          </div>
        </div>
      )}

      {/* ZeroSum Card Modal */}
      {showZeroSumModal && zeroSumCards.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">¡Felicidades!</h3>
              <Button variant="ghost" size="sm" onClick={closeZeroSumModal}>
                ✕
              </Button>
            </div>
            <div className="space-y-4">
              <p>Has ganado una tarjeta ZeroSum:</p>
              {zeroSumCards.slice(-1).map((card) => (
                <div key={card.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{card.brand}</h3>
                    </div>
                    <Badge variant={card.status === "active" ? "default" : "secondary"}>
                      {card.status === "active" ? "Activa" : card.status === "pending" ? "Pendiente" : "Canjeada"}
                    </Badge>
                  </div>
                  <div
                    className="mb-3 rounded-lg p-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
                    }}
                  >
                    <p className="mb-1 text-xs opacity-80">Tarjeta Virtual</p>
                    <p className="font-mono text-lg">{card.cardNumber}</p>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <p className="text-xs opacity-80">Titular</p>
                        <p className="text-sm">{card.cardholderName}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-80">Valor</p>
                        <p className="text-sm">${card.value} MXN</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">Expira: {new Date(card.expiresAt).toLocaleDateString()}</p>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
              <Button onClick={closeZeroSumModal} className="w-full">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <div className="fixed bottom-4 left-4 z-50 max-h-[30vh] overflow-y-auto w-80 md:w-96">
        <div className="flex flex-col items-start space-y-3">
          {notifications.slice(0, 3).map((message, index) => (
            <div
              key={index}
              className="rounded-md bg-secondary p-4 text-base text-secondary-foreground shadow-md w-full"
            >
              {message}
            </div>
          ))}
        </div>
      </div>

      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {Array.from({ length: 50 }).map((_, i) => {
                const size = Math.random() * 10 + 5
                const left = Math.random() * 100
                const animationDuration = Math.random() * 3 + 2
                const delay = Math.random() * 0.5
                const color = ["#FF5E5B", "#D8D8D8", "#FFFFEA", "#00CECB", "#FFED66"][Math.floor(Math.random() * 5)]

                return (
                  <div
                    key={i}
                    className="absolute top-0 rounded-full"
                    style={{
                      left: `${left}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      animation: `fall ${animationDuration}s ease-in forwards`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes card-flip {
          0% {
            transform: rotateY(0deg);
          }
          100% {
            transform: rotateY(180deg);
          }
        }
      `}</style>
    </div>
  )
}
