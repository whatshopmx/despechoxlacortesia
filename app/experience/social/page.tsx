"use client"

import { useState } from "react"
import { ExperienceSession } from "@/components/experience-session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { generateBrindaCard } from "@/lib/card-generator-pipeline-enhanced"
import { CoreEmotion, EmotionalIntensity } from "@/lib/brinda-emotional-engine"

export default function SocialExperiencePage() {
  const [sessionStarted, setSessionStarted] = useState(false)
  const [brandName, setBrandName] = useState("Don Julio")
  const [brandLogo, setBrandLogo] = useState("/placeholder.svg?height=40&width=40&text=DJ")

  // Generar una carta para la experiencia
  const card = generateBrindaCard({
    emotion: CoreEmotion.DESPECHO,
    intensity: EmotionalIntensity.MEDIUM,
    isBranded: true,
    brandId: "Don Julio",
  })

  const handleChallengeComplete = () => {
    console.log("Reto completado")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/experience">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Experiencia Social</h1>
      </div>

      {!sessionStarted ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Unirse a una Mesa</CardTitle>
            <CardDescription>Participa en una experiencia social con otros jugadores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Mesa de Don Julio</div>
                    <div className="text-sm text-muted-foreground">4 participantes</div>
                  </div>
                </div>
                <Button onClick={() => setSessionStarted(true)}>Unirse</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Mesa de Spotify</div>
                    <div className="text-sm text-muted-foreground">3 participantes</div>
                  </div>
                </div>
                <Button variant="outline">Unirse</Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Mesa de Uber Eats</div>
                    <div className="text-sm text-muted-foreground">2 participantes</div>
                  </div>
                </div>
                <Button variant="outline">Unirse</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Crear nueva mesa
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <ExperienceSession
          initialCard={card}
          onChallengeComplete={handleChallengeComplete}
          brandName={brandName}
          brandLogo={brandLogo}
        />
      )}
    </div>
  )
}
