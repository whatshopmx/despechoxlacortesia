"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChallengeProvider } from "@/contexts/challenge-context"
import { ChallengeFlow } from "@/components/challenge-flow"
import { RewardsDashboard } from "@/components/rewards-dashboard"
import type { Card } from "@/lib/card-generator-pipeline-enhanced"
import { generateBrindaCard } from "@/lib/card-generator-pipeline-enhanced"
import { CoreEmotion, type EmotionalIntensity } from "@/lib/brinda-emotional-engine"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ErrorBoundary } from "@/components/error-boundary"

export default function ChallengePage() {
  const searchParams = useSearchParams()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get parameters from URL
  const emotion = (searchParams.get("emotion") as CoreEmotion) || CoreEmotion.DESPECHO
  const intensity = Number.parseInt(searchParams.get("intensity") || "3", 10) as EmotionalIntensity
  const brandId = searchParams.get("brand") || "Don Julio"
  const isBranded = searchParams.get("branded") === "true"

  // Generate a card based on parameters
  useEffect(() => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      setTimeout(() => {
        const generatedCard = generateBrindaCard({
          emotion,
          intensity,
          isBranded,
          brandId,
        })

        setCard(generatedCard)
        setLoading(false)
      }, 1000)
    } catch (err) {
      console.error("Error generating card:", err)
      setError("Ocurrió un error al generar el reto. Por favor, intenta de nuevo.")
      setLoading(false)
    }
  }, [emotion, intensity, isBranded, brandId])

  const handleChallengeComplete = () => {
    setChallengeCompleted(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Generando tu reto...</p>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Error</h3>
          </div>
          <p className="mt-2 text-red-700">{error || "Error al generar el reto. Inténtalo de nuevo."}</p>
        </div>
        <Button asChild className="mt-4 mx-auto block">
          <Link href="/experience">Volver</Link>
        </Button>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <ChallengeProvider>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/experience">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">La Cortesía Challenge</h1>
          </div>

          <Tabs defaultValue={challengeCompleted ? "rewards" : "challenge"}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="challenge">Reto Actual</TabsTrigger>
              <TabsTrigger value="rewards">
                <Award className="mr-2 h-4 w-4" />
                Mis Recompensas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="challenge" className="mt-4">
              <ChallengeFlow card={card} onComplete={handleChallengeComplete} />
            </TabsContent>

            <TabsContent value="rewards" className="mt-4">
              <RewardsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </ChallengeProvider>
    </ErrorBoundary>
  )
}
