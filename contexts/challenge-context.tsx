"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Card } from "@/lib/card-generator-pipeline-enhanced"

export type RewardType = {
  id: string
  name: string
  description: string
  type: "digital" | "physical" | "experience"
  value?: number
  imageUrl?: string
  expiryDate?: Date
  redeemed: boolean
  brandId?: string
  brandName?: string
  brandLogo?: string
}

export type ChallengeStatus = "idle" | "in-progress" | "verifying" | "completed" | "failed"

export type ChallengeVerificationType = "self" | "group" | "ai" | "photo" | "audio" | "none"

export type ChallengeContextType = {
  currentCard: Card | null
  challengeStatus: ChallengeStatus
  rewards: RewardType[]
  emotionalIntensity: number
  socialTriggerActivated: boolean
  verificationMethod: ChallengeVerificationType
  error: string | null

  // Methods
  startChallenge: (card: Card) => void
  completeChallenge: () => void
  verifyChallenge: (verificationType: ChallengeVerificationType, data?: any) => Promise<boolean>
  claimReward: () => void
  resetChallenge: () => void
  clearError: () => void

  // Verification-specific methods
  submitPhoto: (photoData: string) => Promise<boolean>
  submitAudio: (audioData: Blob) => Promise<boolean>
  submitGroupVerification: (votes: number, threshold: number) => Promise<boolean>
}

const defaultContext: ChallengeContextType = {
  currentCard: null,
  challengeStatus: "idle",
  rewards: [],
  emotionalIntensity: 0,
  socialTriggerActivated: false,
  verificationMethod: "none",
  error: null,

  startChallenge: () => {},
  completeChallenge: () => {},
  verifyChallenge: async () => false,
  claimReward: () => {},
  resetChallenge: () => {},
  clearError: () => {},

  submitPhoto: async () => false,
  submitAudio: async () => false,
  submitGroupVerification: async () => false,
}

const ChallengeContext = createContext<ChallengeContextType>(defaultContext)

export const useChallenge = () => useContext(ChallengeContext)

export const ChallengeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [challengeStatus, setChallengeStatus] = useState<ChallengeStatus>("idle")
  const [rewards, setRewards] = useState<RewardType[]>([])
  const [emotionalIntensity, setEmotionalIntensity] = useState(0)
  const [socialTriggerActivated, setSocialTriggerActivated] = useState(false)
  const [verificationMethod, setVerificationMethod] = useState<ChallengeVerificationType>("none")
  const [error, setError] = useState<string | null>(null)

  // Load rewards from localStorage on mount
  useEffect(() => {
    try {
      const savedRewards = localStorage.getItem("la-cortesia-rewards")
      if (savedRewards) {
        setRewards(JSON.parse(savedRewards))
      }

      const savedIntensity = localStorage.getItem("la-cortesia-emotional-intensity")
      if (savedIntensity) {
        setEmotionalIntensity(Number.parseInt(savedIntensity, 10))
      }
    } catch (e) {
      console.error("Failed to load saved data", e)
      setError("No se pudieron cargar los datos guardados. Por favor, intenta de nuevo.")
    }
  }, [])

  // Save rewards to localStorage when they change
  useEffect(() => {
    try {
      if (rewards.length > 0) {
        localStorage.setItem("la-cortesia-rewards", JSON.stringify(rewards))
      }
    } catch (e) {
      console.error("Failed to save rewards", e)
      setError("No se pudieron guardar las recompensas. Por favor, intenta de nuevo.")
    }
  }, [rewards])

  // Save emotional intensity to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("la-cortesia-emotional-intensity", emotionalIntensity.toString())
    } catch (e) {
      console.error("Failed to save emotional intensity", e)
      setError("No se pudo guardar la intensidad emocional. Por favor, intenta de nuevo.")
    }
  }, [emotionalIntensity])

  const startChallenge = (card: Card) => {
    try {
      setCurrentCard(card)
      setChallengeStatus("in-progress")

      // Determine verification method based on card properties
      if (card.emotional_tier === "chaotic") {
        setVerificationMethod("group")
      } else if (card.emotional_tier === "intense") {
        setVerificationMethod(Math.random() > 0.5 ? "photo" : "audio")
      } else {
        setVerificationMethod("self")
      }
    } catch (err) {
      console.error("Error starting challenge:", err)
      setError("Ocurrió un error al iniciar el reto. Por favor, intenta de nuevo.")
    }
  }

  const completeChallenge = () => {
    try {
      if (!currentCard) {
        setError("No hay un reto activo para completar.")
        return
      }

      setChallengeStatus("verifying")
    } catch (err) {
      console.error("Error completing challenge:", err)
      setError("Ocurrió un error al completar el reto. Por favor, intenta de nuevo.")
    }
  }

  const verifyChallenge = async (verificationType: ChallengeVerificationType, data?: any): Promise<boolean> => {
    if (!currentCard) {
      setError("No hay un reto activo para verificar.")
      return false
    }

    try {
      // Set status to verifying
      setChallengeStatus("verifying")

      // Simulate verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let success = false

      switch (verificationType) {
        case "self":
          // Self-verification always succeeds
          success = true
          break
        case "group":
          // Group verification depends on votes
          if (data && data.votes && data.threshold) {
            success = data.votes >= data.threshold
          } else {
            setError("Datos de verificación grupal incompletos.")
            return false
          }
          break
        case "ai":
          // AI verification would call an external API
          // For now, simulate with 80% success rate
          success = Math.random() > 0.2
          break
        case "photo":
          // Photo verification would analyze the image
          // For now, simulate with 90% success rate
          if (!data) {
            setError("No se proporcionó una foto para verificar.")
            return false
          }
          success = Math.random() > 0.1
          break
        case "audio":
          // Audio verification would analyze the audio
          // For now, simulate with 85% success rate
          if (!data) {
            setError("No se proporcionó un audio para verificar.")
            return false
          }
          success = Math.random() > 0.15
          break
        default:
          success = true
      }

      // Check if social trigger is activated (25% chance)
      const socialTriggered = Math.random() < 0.25
      setSocialTriggerActivated(socialTriggered)

      // Update emotional intensity based on card tier and success
      if (success) {
        let intensityIncrease = 5 // base increase

        if (currentCard.emotional_tier === "intense") intensityIncrease = 10
        if (currentCard.emotional_tier === "chaotic") intensityIncrease = 15

        // Bonus for social trigger
        if (socialTriggered) intensityIncrease += 5

        setEmotionalIntensity((prev) => Math.min(100, prev + intensityIncrease))
      }

      // Update status based on verification result
      setChallengeStatus(success ? "completed" : "failed")

      return success
    } catch (e) {
      console.error("Error during challenge verification:", e)
      setError("Ocurrió un error durante la verificación. Por favor, intenta de nuevo.")
      setChallengeStatus("failed")
      return false
    }
  }

  const claimReward = () => {
    try {
      if (!currentCard || challengeStatus !== "completed") {
        setError("No hay un reto completado para reclamar recompensa.")
        return
      }

      // Generate a reward based on the current card
      const newReward: RewardType = {
        id: `reward-${Date.now()}`,
        name: currentCard.reward_type === "shot" ? "Shot Gratis" : "Sticker Digital",
        description: currentCard.reward,
        type: currentCard.reward_type === "shot" || currentCard.reward_type === "product" ? "physical" : "digital",
        value: currentCard.brand_sponsor?.rewardValue || 0,
        imageUrl: "/placeholder.svg?height=200&width=200&text=Reward",
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        redeemed: false,
        brandId: currentCard.brand_sponsor?.id,
        brandName: currentCard.brand_sponsor?.name,
        brandLogo: currentCard.brand_sponsor?.logo,
      }

      // Add bonus for social trigger
      if (socialTriggerActivated && newReward.value) {
        newReward.value = Math.round(newReward.value * 1.5) // 50% bonus
        newReward.name += " (¡Bonus Social!)"
      }

      // Add the reward to the list
      setRewards((prev) => [...prev, newReward])

      // Reset the challenge
      resetChallenge()
    } catch (err) {
      console.error("Error claiming reward:", err)
      setError("Ocurrió un error al reclamar la recompensa. Por favor, intenta de nuevo.")
    }
  }

  const resetChallenge = () => {
    try {
      setCurrentCard(null)
      setChallengeStatus("idle")
      setSocialTriggerActivated(false)
    } catch (err) {
      console.error("Error resetting challenge:", err)
      setError("Ocurrió un error al reiniciar el reto. Por favor, intenta de nuevo.")
    }
  }

  // Verification-specific methods
  const submitPhoto = async (photoData: string): Promise<boolean> => {
    try {
      // In a real implementation, this would send the photo to an API for verification
      // For now, simulate a delay and return success
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return verifyChallenge("photo", photoData)
    } catch (err) {
      console.error("Error submitting photo:", err)
      setError("Ocurrió un error al enviar la foto. Por favor, intenta de nuevo.")
      return false
    }
  }

  const submitAudio = async (audioData: Blob): Promise<boolean> => {
    try {
      // In a real implementation, this would send the audio to an API for verification
      // For now, simulate a delay and return success
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return verifyChallenge("audio", audioData)
    } catch (err) {
      console.error("Error submitting audio:", err)
      setError("Ocurrió un error al enviar el audio. Por favor, intenta de nuevo.")
      return false
    }
  }

  const submitGroupVerification = async (votes: number, threshold: number): Promise<boolean> => {
    try {
      return verifyChallenge("group", { votes, threshold })
    } catch (err) {
      console.error("Error submitting group verification:", err)
      setError("Ocurrió un error al verificar con el grupo. Por favor, intenta de nuevo.")
      return false
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <ChallengeContext.Provider
      value={{
        currentCard,
        challengeStatus,
        rewards,
        emotionalIntensity,
        socialTriggerActivated,
        verificationMethod,
        error,

        startChallenge,
        completeChallenge,
        verifyChallenge,
        claimReward,
        resetChallenge,
        clearError,

        submitPhoto,
        submitAudio,
        submitGroupVerification,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  )
}
