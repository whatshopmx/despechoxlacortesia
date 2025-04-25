/**
 * Brand Campaigns Model
 *
 * This file defines the data structure and sample data for brand campaigns
 * in the Despecho x La Cortesía multibrand experience.
 */

export interface BrandCampaign {
  id: string
  brandId: string
  brandName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  startDate: string
  endDate: string
  title: string
  description: string
  venues: BrandVenue[]
  cardThemes: string[]
  challengeTypes: string[]
  emotionalTiers: string[]
  rewardValue: number
  rewardType: "shot" | "discount" | "zerosum_card" | "product"
  rewardDescription: string
  targetAudience: string[]
  active: boolean
}

export interface BrandVenue {
  id: string
  name: string
  address: string
  city: string
  qrCode?: string
  shortLink?: string
}

// Sample brand campaigns
export const BRAND_CAMPAIGNS: BrandCampaign[] = [
  {
    id: "donjulio-summer2025",
    brandId: "donjulio",
    brandName: "Don Julio",
    logo: "/placeholder.svg?height=60&width=120&text=Don+Julio",
    primaryColor: "#0057B8",
    secondaryColor: "#FFFFFF",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    title: "Despecho de Verano",
    description:
      "Experiencia Despecho x La Cortesía patrocinada por Don Julio. Completa retos y gana shots o tarjetas ZeroSum.",
    venues: [
      {
        id: "venue-001",
        name: "La Cantina",
        address: "Av. Revolución 123",
        city: "CDMX",
        qrCode: "/placeholder.svg?height=200&width=200&text=QR+Don+Julio+La+Cantina",
        shortLink: "cort.es/dj-cantina",
      },
      {
        id: "venue-002",
        name: "El Mezcalito",
        address: "Calle Durango 456",
        city: "CDMX",
        qrCode: "/placeholder.svg?height=200&width=200&text=QR+Don+Julio+El+Mezcalito",
        shortLink: "cort.es/dj-mezcalito",
      },
    ],
    cardThemes: ["ghosting", "revenge", "drunk_text", "ex_encounter"],
    challengeTypes: ["karaoke", "confession", "truth_or_dare"],
    emotionalTiers: ["intense", "chaotic"],
    rewardValue: 100,
    rewardType: "zerosum_card",
    rewardDescription: "Shot de Don Julio Blanco",
    targetAudience: ["21-35", "social drinkers", "nightlife"],
    active: true,
  },
  {
    id: "spotify-premium2025",
    brandId: "spotify",
    brandName: "Spotify",
    logo: "/placeholder.svg?height=60&width=120&text=Spotify",
    primaryColor: "#1DB954",
    secondaryColor: "#191414",
    startDate: "2025-05-15",
    endDate: "2025-07-15",
    title: "Playlist del Despecho",
    description:
      "Experiencia Despecho x La Cortesía patrocinada por Spotify. Completa retos y gana 1 mes de Spotify Premium.",
    venues: [
      {
        id: "venue-003",
        name: "Foro Indie",
        address: "Av. Insurgentes 789",
        city: "CDMX",
        qrCode: "/placeholder.svg?height=200&width=200&text=QR+Spotify+Foro+Indie",
        shortLink: "cort.es/spotify-indie",
      },
    ],
    cardThemes: ["nostalgic_music", "drunk_dial", "ritual_let_go"],
    challengeTypes: ["karaoke", "emoji_drama", "storytelling"],
    emotionalTiers: ["mild", "intense", "chaotic"],
    rewardValue: 130,
    rewardType: "zerosum_card",
    rewardDescription: "1 mes de Spotify Premium",
    targetAudience: ["18-45", "music lovers", "social media users"],
    active: true,
  },
  {
    id: "ubereats-fall2025",
    brandId: "ubereats",
    brandName: "Uber Eats",
    logo: "/placeholder.svg?height=60&width=120&text=Uber+Eats",
    primaryColor: "#06C167",
    secondaryColor: "#000000",
    startDate: "2025-09-01",
    endDate: "2025-11-30",
    title: "Despecho Post-Bailazo",
    description:
      "Experiencia Despecho x La Cortesía patrocinada por Uber Eats. Completa retos y gana descuentos en tu próximo pedido.",
    venues: [
      {
        id: "venue-004",
        name: "Club Nocturno",
        address: "Calle Madero 321",
        city: "CDMX",
        qrCode: "/placeholder.svg?height=200&width=200&text=QR+UberEats+Club+Nocturno",
        shortLink: "cort.es/ubereats-club",
      },
    ],
    cardThemes: ["drunk_text", "ex_encounter", "stalking"],
    challengeTypes: ["confession", "truth_or_dare"],
    emotionalTiers: ["intense", "chaotic"],
    rewardValue: 100,
    rewardType: "discount",
    rewardDescription: "$100 MXN de descuento en Uber Eats",
    targetAudience: ["21-40", "urban dwellers", "nightlife"],
    active: true,
  },
]

/**
 * Get all active brand campaigns
 */
export function getActiveBrandCampaigns(): BrandCampaign[] {
  return BRAND_CAMPAIGNS.filter((campaign) => campaign.active)
}

/**
 * Get a brand campaign by ID
 */
export function getBrandCampaignById(id: string): BrandCampaign | undefined {
  return BRAND_CAMPAIGNS.find((campaign) => campaign.id === id)
}

/**
 * Get a brand campaign by brand ID
 */
export function getBrandCampaignsByBrandId(brandId: string): BrandCampaign[] {
  return BRAND_CAMPAIGNS.filter((campaign) => campaign.brandId === brandId && campaign.active)
}

/**
 * Get a venue by ID within a campaign
 */
export function getVenueById(campaignId: string, venueId: string): BrandVenue | undefined {
  const campaign = getBrandCampaignById(campaignId)
  return campaign?.venues.find((venue) => venue.id === venueId)
}
