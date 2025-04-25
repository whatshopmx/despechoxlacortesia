* Card Generator Pipeline - Enhanced
 *
 * This file defines the data structure and logic for generating card content.
 */

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
  const card: Card = {
    card_title: isBranded ? "Reto Patrocinado" : "Reto Despecho",
    challenge: "Describe tu peor experiencia de despecho en 30 segundos.",
    emotional_tier: "mild",
    theme_tag: "ghosting",
    spotify_song: {
      title: "Ella Baila Sola",
      artist: "Peso Pluma",
    },
    sticker: "Corazón Roto",
    reward: "Un abrazo grupal",
    reward_type: "product",
    social_trigger: 'Si alguien llora, todos gritan "¡Salud!"',
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
  }
,  { card_title: isBranded ? "Reto Patrocinado" : "Reto Despecho",
    challenge: "Describe tu peor experiencia de despecho en 50 segundos.",
    emotional_tier: "mild",
    theme_tag: "ghosting",
    spotify_song: {
      title: "titi",
      artist: "bad bunny",
    },
    sticker: "Corazón Roto",
    reward: "Un beso grupal",
    reward_type: "product",
    social_trigger: 'Si alguien llora, todos lloran"¡Salud!"',
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
  }
  return card
}
