"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, QrCode, HeartCrack, Sparkles } from "lucide-react"
import Link from "next/link"
import { getBrandCampaignById, getBrandCampaignsByBrandId, getVenueById } from "@/lib/brand-campaigns"

export default function BrandedExperiencePage() {
  const searchParams = useSearchParams()
  const brandId = searchParams.get("brand")
  const campaignId = searchParams.get("campaign")
  const venueId = searchParams.get("venue")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<any | null>(null)
  const [venue, setVenue] = useState<any | null>(null)

  useEffect(() => {
    // Simulate loading
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

      setLoading(false)
    } catch (err) {
      console.error("Error loading branded experience:", err)
      setError("Failed to load experience")
      setLoading(false)
    }
  }, [brandId, campaignId, venueId])

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
    <div className="container mx-auto max-w-md p-4 py-8 min-h-screen flex flex-col">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Despecho x {campaign.brandName}</h1>
      </div>

      <Card className="mb-6 overflow-hidden">
        <div
          className="h-40 flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${campaign.primaryColor} 0%, ${campaign.secondaryColor} 100%)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <HeartCrack className="h-24 w-24 text-white opacity-20" />
          </div>
          <div className="relative z-10 p-6 text-center">
            <img src={campaign.logo || "/placeholder.svg"} alt={campaign.brandName} className="h-16 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">{campaign.title}</h2>
            <p className="text-sm text-white/80">{venue ? `En ${venue.name}` : ""}</p>
          </div>
        </div>
        <CardContent className="p-6">
          <p className="text-base md:text-lg text-center">{campaign.description}</p>

          {venue && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-lg mb-2">Ubicación</h3>
              <p className="text-base">{venue.name}</p>
              <p className="text-sm text-muted-foreground">
                {venue.address}, {venue.city}
              </p>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <h3 className="font-medium text-xl text-center mb-3">Recompensa</h3>
            <div className="flex items-center justify-center gap-3 p-4 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
              <p className="font-medium text-lg">{campaign.rewardDescription}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full text-base py-6">
            <Link
              href={`/experience/play?brand=${campaign.brandId}&campaign=${campaign.id}${venue ? `&venue=${venue.id}` : ""}`}
            >
              Comenzar Experiencia
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <QrCode className="h-6 w-6 text-primary" />
            Comparte esta experiencia
          </CardTitle>
          <CardDescription>Escanea este código QR para compartir esta experiencia con amigos</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <img
              src={venue?.qrCode || `/api/qr?url=https://cort.es/${campaign.brandId}`}
              alt="QR Code"
              className="h-48 w-48"
            />
          </div>
          <p className="mt-4 text-center text-sm font-medium">{venue?.shortLink || `cort.es/${campaign.brandId}`}</p>
        </CardContent>
      </Card>
    </div>
  )
}
