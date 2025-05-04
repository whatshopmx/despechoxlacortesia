/**
 * Card Generator Pipeline - Enhanced
 *
 * This file defines the data structure and logic for generating card content.
 */

import { generateCard as generateDespechCard } from "./despecho-card-generator"
import {
  CoreEmotion,
  EmotionalIntensity,
  ChallengeType,
  VisualStyle,
  generateEmotionalCard,
} from "./brinda-emotional-engine"

export interface Card {
  card_title: string
  challenge: string
  emotional_tier: "mild" | "intense" | "chaotic"
  theme_tag: string
  spotify_song: {
    title: string
    artist: string
  }
  sticker: string
  reward: string
  reward_type: "shot" | "discount" | "zerosum_card" | "product"
  social_trigger: string
  brand_sponsor?: {
    id: string
    name: string
    logo: string
    industry: string
    rewardValue: number
  }
  back_image_url?: string
}

/**
 * Generate a card JSON with default values.
 */
export function generateCardJSON(isBranded = false): Card {
  // Use the despecho card generator for more varied and themed cards
  const despechoCard = generateDespechCard()

  // Alternatively, use the Brinda emotional engine for more sophisticated cards
  const emotionalCard = generateEmotionalCard({
    coreEmotion: CoreEmotion.DESPECHO,
    intensity: EmotionalIntensity.MEDIUM,
    challengeType: ChallengeType.VERBAL,
    visualStyle: VisualStyle.LOTERIA_VINTAGE,
    brandId: isBranded ? "Don Julio" : undefined,
  })

  // For now, we'll use the despecho card generator
  const card: Card = {
    card_title: isBranded ? "Reto Patrocinado" : despechoCard.card_title,
    challenge: despechoCard.challenge,
    emotional_tier: despechoCard.genre_tag.includes("CORRIDOS_DEL_ALMA")
      ? "chaotic"
      : despechoCard.genre_tag.includes("REGGAETON_SAD")
        ? "intense"
        : "mild",
    theme_tag: despechoCard.genre_tag,
    spotify_song: {
      title: despechoCard.spotify_song.title,
      artist: despechoCard.spotify_song.artist,
    },
    sticker: "Corazón Roto",
    reward: despechoCard.reward,
    reward_type: "product",
    social_trigger: despechoCard.social_trigger,
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
  }

  return card
}

/**
 * Generate a card using the Brinda emotional engine
 */
export function generateBrindaCard(params: {
  emotion?: CoreEmotion
  intensity?: EmotionalIntensity
  isBranded?: boolean
  brandId?: string
}): Card {
  const {
    emotion = CoreEmotion.DESPECHO,
    intensity = EmotionalIntensity.MEDIUM,
    isBranded = false,
    brandId = "Don Julio",
  } = params

  const emotionalCard = generateEmotionalCard({
    coreEmotion: emotion,
    intensity: intensity,
    challengeType: ChallengeType.VERBAL,
    visualStyle: VisualStyle.LOTERIA_VINTAGE,
    brandId: isBranded ? brandId : undefined,
  })

  return emotionalCard as Card
}
