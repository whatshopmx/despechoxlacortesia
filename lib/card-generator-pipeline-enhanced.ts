/**
 * Card Generator Pipeline - Enhanced
 *
 * This file defines the data structure and logic for generating card content.
 */

export interface Card {
  card_title: string
  challenge: string
  emotional_tier: "mild" | "intense" | "chaotic"
  theme_tag: string // Corresponds to genre_tag in the knowledge base
  spotify_song: {
    title: string
    artist: string
    url: string // Added based on knowledge base
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
  tono?: string[] // Added based on knowledge base (e.g., ["Sarcástico", "Reflexivo"])
  formato_interacción?: string // Interaction medium (e.g., Texto, Audio, Video)
  nivel_de_vergüenza?: number // Adjusts public exposure (0-10 scale)
  tipo?: string // Primary category of the card (e.g., Performance, Digital, Roleplay)
  subtipo?: string // Secondary category or theme (e.g., Catarsis Grupal, Magia Casera)
  ai_challenge?: {
    type: string // Type of AI-generated challenge (e.g., storytelling)
    prompt: string // Prompt for AI-generated content
    interaction: string // Player interaction description
  }
}

/**
 * Generate a card JSON with default values.
 */
export function generateCardJSON(isBranded = false): Card {
  const card: Card = {
    card_title: isBranded ? "Reto Patrocinado" : "Reto Despecho",
    challenge: "Describe tu peor experiencia de despecho en 30 segundos.",
    emotional_tier: "mild",
    theme_tag: "ghosting", // Example tag; could be "Terapia Express", "Reggaetón Sad", etc.
    spotify_song: {
      title: "Ella Baila Sola",
      artist: "Peso Pluma",
      url: "https://open.spotify.com/track/example_track_id", // Added based on knowledge base
    },
    sticker: "Corazón Roto",
    reward: "Un abrazo grupal",
    reward_type: "product",
    social_trigger: 'Si alguien llora, todos gritan "¡Salud!"',
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
    tono: ["Sarcástico", "Reflexivo"], // Example tone array
    formato_interacción: "Texto", // Example interaction medium
    nivel_de_vergüenza: 5, // Example shame level
    tipo: "Performance", // Example primary category
    subtipo: "Catarsis Grupal", // Example secondary category
    ai_challenge: {
      type: "storytelling",
      prompt:
        "Generate a short, melodramatic synopsis of the player's chosen movie/series, highlighting the most heartbreaking moments.",
      interaction:
        "Player must narrate the AI-generated synopsis with exaggerated emotional reactions, as if they are reliving the sadness.",
    },
  }

  return card
}
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
  }

  return card
}
