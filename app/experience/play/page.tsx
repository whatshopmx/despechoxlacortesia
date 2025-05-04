"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BadgeCheck, Heart, HeartCrack, ThumbsUp, Smile, Laugh } from "lucide-react"
import Link from "next/link"
import { getBrandCampaignById, getBrandCampaignsByBrandId, getVenueById } from "@/lib/brand-campaigns"
import { generateCardJSON } from "@/lib/card-generator-pipeline-enhanced"
import { EmotionalCard } from "@/components/emotional-card"
import { generateBrindaCard } from "@/lib/card-generator-pipeline-enhanced"
import { CoreEmotion, EmotionalIntensity } from "@/lib/brinda-emotional-engine"

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
  const [showSuccess, setShowSuccess] = useState(false)

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

  // Generate a card using the Brinda emotional engine
  const card = generateBrindaCard({
    emotion: CoreEmotion.DESPECHO,
    intensity: EmotionalIntensity.MEDIUM,
    isBranded: true,
    brandId: "Don Julio",
  })

  // Replace the existing card display with our new EmotionalCard component
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">La Cortesía Experience</h1>

      <div className="max-w-md mx-auto mb-8">
        <EmotionalCard card={card} onComplete={() => setShowSuccess(true)} hideButton={false} />
      </div>

      {showSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative max-w-md mx-auto"
          role="alert"
        >
          <strong className="font-bold">¡Felicidades! </strong>
          <span className="block sm:inline">Has completado el reto y desbloqueado tu cortesía.</span>
        </div>
      )}
    </div>
  )
}
