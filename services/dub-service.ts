/**
 * Dub.co Integration Service
 *
 * This service handles the creation and management of branded short links and QR codes
 * using the Dub.co API.
 */

// Types for Dub.co API
export interface DubLinkRequest {
  domain: string
  url: string
  slug?: string
  title?: string
  description?: string
  image?: string
  expiresAt?: string
  password?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  ios?: string
  android?: string
}

export interface DubLinkResponse {
  id: string
  domain: string
  key: string
  url: string
  archived: boolean
  expiresAt: string | null
  createdAt: string
  updatedAt: string
  title: string | null
  description: string | null
  image: string | null
  clicks: number
  qrCode: {
    href: string
  }
}

export interface BrandedLinkParams {
  brandId: string
  brandName: string
  campaignId: string
  venueId?: string
  expiresAt?: string
  title?: string
  description?: string
}

/**
 * Create a branded short link using Dub.co API
 */
export async function createBrandedLink(params: BrandedLinkParams): Promise<DubLinkResponse> {
  const { brandId, brandName, campaignId, venueId, expiresAt, title, description } = params

  // Base URL for the branded experience
  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL}/experience`

  // Create URL with query parameters
  const url = new URL(baseUrl)
  url.searchParams.append("brand", brandId)
  url.searchParams.append("campaign", campaignId)
  if (venueId) url.searchParams.append("venue", venueId)

  // Create a slug based on brand and campaign
  const slug = `${brandId.toLowerCase()}-${campaignId.toLowerCase()}${venueId ? `-${venueId}` : ""}`

  // Prepare the request payload
  const payload: DubLinkRequest = {
    domain: "cort.es", // Your custom domain configured in Dub.co
    url: url.toString(),
    slug,
    title: title || `${brandName} x La Cortesía`,
    description: description || `Experiencia Despecho x La Cortesía patrocinada por ${brandName}`,
    utm_source: brandId,
    utm_medium: "qr",
    utm_campaign: campaignId,
  }

  if (expiresAt) {
    payload.expiresAt = expiresAt
  }

  try {
    // In a real implementation, this would call the Dub.co API
    // const response = await fetch('https://api.dub.co/links', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.DUB_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(payload)
    // });
    // const data = await response.json();

    // For demo purposes, we'll simulate the API response
    const mockResponse: DubLinkResponse = {
      id: `link_${Date.now()}`,
      domain: "cort.es",
      key: slug,
      url: url.toString(),
      archived: false,
      expiresAt: expiresAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: payload.title || null,
      description: payload.description || null,
      image: null,
      clicks: 0,
      qrCode: {
        href: `/api/qr?url=https://cort.es/${slug}`,
      },
    }

    return mockResponse
  } catch (error) {
    console.error("Error creating branded link:", error)
    throw new Error("Failed to create branded link")
  }
}

/**
 * Get analytics for a branded link
 */
export async function getLinkAnalytics(linkId: string): Promise<{ clicks: number; uniqueClicks: number }> {
  try {
    // In a real implementation, this would call the Dub.co API
    // const response = await fetch(`https://api.dub.co/links/${linkId}/stats`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.DUB_API_KEY}`
    //   }
    // });
    // const data = await response.json();

    // For demo purposes, we'll simulate the API response
    return {
      clicks: Math.floor(Math.random() * 1000),
      uniqueClicks: Math.floor(Math.random() * 500),
    }
  } catch (error) {
    console.error("Error getting link analytics:", error)
    throw new Error("Failed to get link analytics")
  }
}

/**
 * Generate a QR code URL for a branded link
 */
export function getQRCodeUrl(slug: string): string {
  return `/api/qr?url=https://cort.es/${slug}`
}
