"use client"

import Link from "next/link"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CoreEmotion, EmotionalIntensity } from "@/lib/brinda-emotional-engine"
import { HeartCrack, Flame, CloudRain, Zap, Sparkles, AlertCircle, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ExperiencePage() {
  const router = useRouter()
  const [emotion, setEmotion] = useState<CoreEmotion>(CoreEmotion.DESPECHO)
  const [intensity, setIntensity] = useState<EmotionalIntensity>(EmotionalIntensity.MEDIUM)
  const [isBranded, setIsBranded] = useState(true)
  const [brandId, setBrandId] = useState("Don Julio")
  const [error, setError] = useState<string | null>(null)

  const handleStartChallenge = () => {
    try {
      setError(null)
      router.push(
        `/experience/challenge?emotion=${emotion}&intensity=${intensity}&branded=${isBranded}&brand=${brandId}`,
      )
    } catch (err) {
      console.error("Error starting challenge:", err)
      setError("Ocurrió un error al iniciar el reto. Por favor, intenta de nuevo.")
    }
  }

  const getEmotionIcon = (emotion: CoreEmotion) => {
    switch (emotion) {
      case CoreEmotion.DESPECHO:
        return <HeartCrack className="h-5 w-5 text-red-500" />
      case CoreEmotion.TRISTEZA:
        return <CloudRain className="h-5 w-5 text-blue-500" />
      case CoreEmotion.RABIA:
        return <Flame className="h-5 w-5 text-orange-500" />
      case CoreEmotion.AUTOENGANO:
        return <Zap className="h-5 w-5 text-yellow-500" />
      case CoreEmotion.MISTICISMO:
        return <Sparkles className="h-5 w-5 text-purple-500" />
      default:
        return <HeartCrack className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">La Cortesía Experience</h1>

      {error && (
        <Alert variant="destructive" className="mb-6 max-w-3xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setError(null)}>
            Cerrar
          </Button>
        </Alert>
      )}

      <Tabs defaultValue="challenge" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenge">Reto Individual</TabsTrigger>
          <TabsTrigger value="social">Experiencia Social</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
        </TabsList>

        <TabsContent value="challenge" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personaliza tu Reto</CardTitle>
              <CardDescription>Configura los parámetros de tu reto para una experiencia personalizada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emotion">Emoción Principal</Label>
                <Select value={emotion} onValueChange={(value) => setEmotion(value as CoreEmotion)}>
                  <SelectTrigger id="emotion">
                    <SelectValue placeholder="Selecciona una emoción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CoreEmotion.DESPECHO}>
                      <div className="flex items-center">
                        <HeartCrack className="h-4 w-4 mr-2 text-red-500" />
                        Despecho
                      </div>
                    </SelectItem>
                    <SelectItem value={CoreEmotion.TRISTEZA}>
                      <div className="flex items-center">
                        <CloudRain className="h-4 w-4 mr-2 text-blue-500" />
                        Tristeza
                      </div>
                    </SelectItem>
                    <SelectItem value={CoreEmotion.RABIA}>
                      <div className="flex items-center">
                        <Flame className="h-4 w-4 mr-2 text-orange-500" />
                        Rabia
                      </div>
                    </SelectItem>
                    <SelectItem value={CoreEmotion.AUTOENGANO}>
                      <div className="flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                        Autoengaño
                      </div>
                    </SelectItem>
                    <SelectItem value={CoreEmotion.MISTICISMO}>
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                        Misticismo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensidad Emocional</Label>
                <Select
                  value={intensity.toString()}
                  onValueChange={(value) => setIntensity(Number.parseInt(value, 10) as EmotionalIntensity)}
                >
                  <SelectTrigger id="intensity">
                    <SelectValue placeholder="Selecciona una intensidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Suave (Nivel 1)</SelectItem>
                    <SelectItem value="2">Moderado (Nivel 2)</SelectItem>
                    <SelectItem value="3">Medio (Nivel 3)</SelectItem>
                    <SelectItem value="4">Intenso (Nivel 4)</SelectItem>
                    <SelectItem value="5">Caótico (Nivel 5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="branded">Reto Patrocinado</Label>
                <Switch id="branded" checked={isBranded} onCheckedChange={setIsBranded} />
              </div>

              {isBranded && (
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca Patrocinadora</Label>
                  <Select value={brandId} onValueChange={setBrandId}>
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Don Julio">Don Julio</SelectItem>
                      <SelectItem value="Tecate">Tecate</SelectItem>
                      <SelectItem value="Corona">Corona</SelectItem>
                      <SelectItem value="Bacardi">Bacardi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleStartChallenge} className="w-full">
                {getEmotionIcon(emotion)}
                <span className="ml-2">Iniciar Reto</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Experiencia Social</CardTitle>
              <CardDescription>Juega con amigos y comparte la experiencia en tiempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <p className="text-center">
                  Únete a una mesa virtual con amigos o con otros jugadores para compartir retos, reaccionar a sus
                  experiencias y ganar recompensas juntos.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/experience/social">
                  <Users className="mr-2 h-4 w-4" />
                  Iniciar Experiencia Social
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Campañas Disponibles</CardTitle>
              <CardDescription>Explora las campañas de marcas asociadas con La Cortesía.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Don Julio x La Cortesía</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500">Retos de despecho con recompensas exclusivas.</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push("/experience/play?brand=don-julio")}
                    >
                      Ver Campaña
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Tecate x La Cortesía</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-500">Retos de caos emocional con shots gratis.</p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push("/experience/play?brand=tecate")}
                    >
                      Ver Campaña
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
