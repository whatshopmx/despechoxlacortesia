"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChallengeType, InteractionFormat, ToneSubtype, generateChallenge } from "@/lib/challenge-categories"
import { Sparkles, Music, ImageIcon, MessageCircle, Mic, RefreshCw, Copy, Check, Shuffle } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export function ChallengeGenerator() {
  const [selectedType, setSelectedType] = useState<ChallengeType | undefined>(undefined)
  const [selectedFormat, setSelectedFormat] = useState<InteractionFormat | undefined>(undefined)
  const [selectedTone, setSelectedTone] = useState<ToneSubtype | undefined>(undefined)
  const [generatedChallenge, setGeneratedChallenge] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("type")
  const { toast } = useToast()

  // Generar un reto aleatorio al cargar el componente
  useEffect(() => {
    generateRandomChallenge()
  }, [])

  // Función para generar un reto aleatorio
  const generateRandomChallenge = () => {
    setIsGenerating(true)

    // Simular un pequeño retraso para el efecto visual
    setTimeout(() => {
      const challenge = generateChallenge(selectedType, selectedFormat, selectedTone)
      setGeneratedChallenge(challenge)
      setIsGenerating(false)
    }, 600)
  }

  // Función para copiar el reto al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedChallenge)
    setCopied(true)

    toast({
      title: "¡Copiado al portapapeles!",
      description: "El reto ha sido copiado.",
      duration: 3000,
    })

    setTimeout(() => setCopied(false), 2000)
  }

  // Función para generar un reto completamente aleatorio
  const generateFullyRandomChallenge = () => {
    setSelectedType(undefined)
    setSelectedFormat(undefined)
    setSelectedTone(undefined)

    setIsGenerating(true)

    // Simular un pequeño retraso para el efecto visual
    setTimeout(() => {
      const challenge = generateChallenge()
      setGeneratedChallenge(challenge)
      setIsGenerating(false)
    }, 600)
  }

  // Obtener el ícono para el tipo de reto
  const getChallengeTypeIcon = (type: ChallengeType) => {
    switch (type) {
      case ChallengeType.KARAOKE:
        return <Music className="h-4 w-4" />
      case ChallengeType.VISUAL:
        return <ImageIcon className="h-4 w-4" />
      case ChallengeType.CONFESION:
        return <MessageCircle className="h-4 w-4" />
      case ChallengeType.IMPROVISACION:
        return <Mic className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          Generador de Retos
        </CardTitle>
        <CardDescription>Personaliza y genera retos únicos para La Cortesía</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="type">Tipo</TabsTrigger>
            <TabsTrigger value="format">Formato</TabsTrigger>
            <TabsTrigger value="tone">Tono</TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Selecciona un tipo de reto</Label>
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ChallengeType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de reto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined as any}>Cualquiera</SelectItem>
                  {Object.values(ChallengeType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedType(ChallengeType.KARAOKE)}
              >
                <Music className="h-3 w-3 mr-1" /> Karaoke
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedType(ChallengeType.CONFESION)}
              >
                <MessageCircle className="h-3 w-3 mr-1" /> Confesión
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedType(ChallengeType.MEME)}
              >
                <ImageIcon className="h-3 w-3 mr-1" /> Meme
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedType(ChallengeType.ROLEPLAY)}
              >
                <Mic className="h-3 w-3 mr-1" /> Roleplay
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedType(ChallengeType.IMPROVISACION)}
              >
                <Sparkles className="h-3 w-3 mr-1" /> Improvisación
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="format" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Selecciona un formato de interacción</Label>
              <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as InteractionFormat)}>
                <SelectTrigger>
                  <SelectValue placeholder="Formato de interacción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined as any}>Cualquiera</SelectItem>
                  {Object.values(InteractionFormat).map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.charAt(0).toUpperCase() + format.slice(1).toLowerCase().replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedFormat(InteractionFormat.CANTO)}
              >
                Canto
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedFormat(InteractionFormat.TEXTO)}
              >
                Texto
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedFormat(InteractionFormat.IMAGEN)}
              >
                Imagen
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedFormat(InteractionFormat.VOZ)}
              >
                Voz
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedFormat(InteractionFormat.ACTUACION)}
              >
                Actuación
              </Badge>
            </div>
          </TabsContent>

          <TabsContent value="tone" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Selecciona un subtipo de tono</Label>
              <Select value={selectedTone} onValueChange={(value) => setSelectedTone(value as ToneSubtype)}>
                <SelectTrigger>
                  <SelectValue placeholder="Subtipo de tono" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={undefined as any}>Cualquiera</SelectItem>
                  {Object.values(ToneSubtype).map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone.charAt(0).toUpperCase() + tone.slice(1).toLowerCase().replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedTone(ToneSubtype.MELODRAMATICO)}
              >
                Melodramático
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedTone(ToneSubtype.IRONICO)}
              >
                Irónico
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedTone(ToneSubtype.VULNERABLE)}
              >
                Vulnerable
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedTone(ToneSubtype.SARCASTICO)}
              >
                Sarcástico
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-purple-50"
                onClick={() => setSelectedTone(ToneSubtype.COMICO)}
              >
                Cómico
              </Badge>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <Label>Reto generado</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!generatedChallenge}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={generateRandomChallenge} disabled={isGenerating}>
                <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={generatedChallenge}
            className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 min-h-[100px] flex items-center justify-center"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="h-5 w-5 animate-spin text-purple-500 mr-2" />
                <span className="text-purple-700">Generando reto...</span>
              </div>
            ) : (
              <p className="text-center text-purple-800 font-medium">{generatedChallenge}</p>
            )}
          </motion.div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2 w-full">
          {selectedType && (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
              {getChallengeTypeIcon(selectedType)}
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1).toLowerCase().replace("_", " ")}
              <button className="ml-1 text-purple-600 hover:text-purple-800" onClick={() => setSelectedType(undefined)}>
                ×
              </button>
            </Badge>
          )}

          {selectedFormat && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
              {selectedFormat.charAt(0).toUpperCase() + selectedFormat.slice(1).toLowerCase().replace("_", " ")}
              <button className="ml-1 text-blue-600 hover:text-blue-800" onClick={() => setSelectedFormat(undefined)}>
                ×
              </button>
            </Badge>
          )}

          {selectedTone && (
            <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">
              {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1).toLowerCase().replace("_", " ")}
              <button className="ml-1 text-pink-600 hover:text-pink-800" onClick={() => setSelectedTone(undefined)}>
                ×
              </button>
            </Badge>
          )}
        </div>

        <Button
          onClick={generateFullyRandomChallenge}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
          disabled={isGenerating}
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Generar Reto Aleatorio
        </Button>
      </CardFooter>
    </Card>
  )
}
