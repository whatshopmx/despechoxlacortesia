"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Music,
  User,
  UserPlus,
  Users,
  Camera,
  Mic,
  MessageSquare,
  Heart,
  Flame,
  Snowflake,
} from "lucide-react"
import {
  type UnifiedCard,
  generateUnifiedCard,
  type ChallengeCategory,
  type InteractionFormat,
  type ToneSubtype,
  type ExperienceType,
  type ChallengeType,
} from "@/lib/unified-card-model"
import { UnifiedCardComponent } from "./unified-card"
import { motion } from "framer-motion"

export function CardGeneratorUnified() {
  // Estados para los parámetros de generación
  const [experienceType, setExperienceType] = useState<ExperienceType>("individual")
  const [challengeType, setChallengeType] = useState<ChallengeType>("individual")
  const [challengeCategory, setChallengeCategory] = useState<ChallengeCategory>("social")
  const [interactionFormat, setInteractionFormat] = useState<InteractionFormat>("texto_imagen")
  const [toneSubtype, setToneSubtype] = useState<ToneSubtype>("humoristico")
  const [emotionalTier, setEmotionalTier] = useState<"mild" | "intense" | "chaotic">("mild")
  const [brandId, setBrandId] = useState<string | undefined>(undefined)
  const [isBranded, setIsBranded] = useState(false)

  // Estado para la carta generada
  const [generatedCard, setGeneratedCard] = useState<UnifiedCard | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("category")

  // Función para generar una carta
  const generateCard = () => {
    const card = generateUnifiedCard({
      experienceType,
      challengeType,
      challengeCategory,
      interactionFormat,
      toneSubtype,
      emotionalTier,
      brandId: isBranded ? brandId : undefined,
    })

    setGeneratedCard(card)
  }

  // Función para generar una carta aleatoria
  const generateRandomCard = () => {
    // Seleccionar valores aleatorios para cada parámetro
    const randomExperienceType: ExperienceType[] = ["individual", "group", "campaign", "multi_table"]
    const randomChallengeType: ChallengeType[] = ["individual", "duet", "group"]
    const randomEmotionalTier: ("mild" | "intense" | "chaotic")[] = ["mild", "intense", "chaotic"]

    // Obtener categorías, formatos y tonos de las definiciones
    const categories: ChallengeCategory[] = [
      "karaoke",
      "visual",
      "misterioso",
      "icebreaker",
      "roleplay",
      "reflexion",
      "confesion",
      "improvisacion",
      "social",
      "meme",
      "humor",
      "vulnerabilidad",
    ]

    const formats: InteractionFormat[] = [
      "canto_memoria",
      "vocal_improvisacion",
      "descripcion_imagen",
      "descripcion_meme",
      "voz_texto",
      "texto_imagen",
      "emojis_interpretacion",
      "actuacion_voz",
    ]

    const tones: ToneSubtype[] = [
      "humoristico",
      "caotico",
      "vulnerable",
      "sarcastico",
      "poetico",
      "ironico",
      "tenso",
      "melodramatico",
      "confesional",
    ]

    // Seleccionar valores aleatorios
    const randomExp = randomExperienceType[Math.floor(Math.random() * randomExperienceType.length)]
    const randomChallenge = randomChallengeType[Math.floor(Math.random() * randomChallengeType.length)]
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const randomFormat = formats[Math.floor(Math.random() * formats.length)]
    const randomTone = tones[Math.floor(Math.random() * tones.length)]
    const randomTier = randomEmotionalTier[Math.floor(Math.random() * randomEmotionalTier.length)]

    // Actualizar estados
    setExperienceType(randomExp)
    setChallengeType(randomChallenge)
    setChallengeCategory(randomCategory)
    setInteractionFormat(randomFormat)
    setToneSubtype(randomTone)
    setEmotionalTier(randomTier)

    // Generar la carta
    const card = generateUnifiedCard({
      experienceType: randomExp,
      challengeType: randomChallenge,
      challengeCategory: randomCategory,
      interactionFormat: randomFormat,
      toneSubtype: randomTone,
      emotionalTier: randomTier,
      brandId: isBranded ? brandId : undefined,
    })

    setGeneratedCard(card)
  }

  // Función para copiar el reto al portapapeles
  const copyChallenge = () => {
    if (generatedCard) {
      navigator.clipboard.writeText(generatedCard.challenge)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Obtener el nombre para mostrar de una categoría
  const getCategoryDisplayName = (category: ChallengeCategory): string => {
    const displayNames: Record<ChallengeCategory, string> = {
      karaoke: "Karaoke",
      visual: "Visual",
      misterioso: "Misterio",
      icebreaker: "Rompehielos",
      roleplay: "Roleplay",
      reflexion: "Reflexión",
      confesion: "Confesión",
      improvisacion: "Improvisación",
      velocidad: "Velocidad",
      operatico: "Ópera",
      comparacion: "Comparación",
      texto: "Texto",
      abstracto: "Abstracto",
      social: "Social",
      interpretacion: "Interpretación",
      eleccion: "Elección",
      teorias: "Teorías",
      simbolico: "Simbólico",
      digital: "Digital",
      creativo: "Creativo",
      imitacion: "Imitación",
      meme: "Meme",
      redes_sociales: "Redes Sociales",
      fotografia: "Fotografía",
      arte: "Arte",
      prediccion: "Predicción",
      destino: "Destino",
      decision: "Decisión",
      especulacion: "Especulación",
      autoengano: "Autoengaño",
      imaginacion: "Imaginación",
      familiar: "Familiar",
      exposicion: "Exposición",
      terapeutico: "Terapéutico",
      transformacion: "Transformación",
      dramatizacion: "Dramatización",
      autoconciencia: "Autoconciencia",
      pasivo_agresivo: "Pasivo-Agresivo",
      vulnerabilidad: "Vulnerabilidad",
      simbolismo: "Simbolismo",
      mensajes: "Mensajes",
      casualidad: "Casualidad",
      paranoia: "Paranoia",
      resumen: "Resumen",
      premiacion: "Premiación",
      catarsis: "Catarsis",
      humor: "Humor",
      intimidad: "Intimidad",
    }

    return displayNames[category] || category
  }

  // Obtener el nombre para mostrar de un formato de interacción
  const getFormatDisplayName = (format: InteractionFormat): string => {
    return format
      .replace("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Obtener el nombre para mostrar de un subtipo de tono
  const getToneDisplayName = (tone: ToneSubtype): string => {
    return tone.charAt(0).toUpperCase() + tone.slice(1)
  }

  // Renderizar categorías populares como badges
  const renderPopularCategories = () => {
    const popularCategories: ChallengeCategory[] = ["karaoke", "confesion", "social", "meme", "humor", "vulnerabilidad"]

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {popularCategories.map((category) => (
          <Badge
            key={category}
            variant={challengeCategory === category ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setChallengeCategory(category)}
          >
            {getCategoryDisplayName(category)}
          </Badge>
        ))}
      </div>
    )
  }

  // Renderizar formatos populares como badges
  const renderPopularFormats = () => {
    const popularFormats: InteractionFormat[] = [
      "canto_memoria",
      "descripcion_imagen",
      "voz_texto",
      "texto_imagen",
      "emojis_interpretacion",
      "actuacion_voz",
    ]

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {popularFormats.map((format) => (
          <Badge
            key={format}
            variant={interactionFormat === format ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setInteractionFormat(format)}
          >
            {getFormatDisplayName(format)}
          </Badge>
        ))}
      </div>
    )
  }

  // Renderizar tonos populares como badges
  const renderPopularTones = () => {
    const popularTones: ToneSubtype[] = ["humoristico", "caotico", "vulnerable", "sarcastico", "poetico", "ironico"]

    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {popularTones.map((tone) => (
          <Badge
            key={tone}
            variant={toneSubtype === tone ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setToneSubtype(tone)}
          >
            {getToneDisplayName(tone)}
          </Badge>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Generador de Cartas Unificado
          </CardTitle>
          <CardDescription>Crea cartas personalizadas para todas las experiencias de La Cortesía</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="category">Categoría</TabsTrigger>
              <TabsTrigger value="format">Formato</TabsTrigger>
              <TabsTrigger value="tone">Tono</TabsTrigger>
              <TabsTrigger value="settings">Ajustes</TabsTrigger>
            </TabsList>

            <TabsContent value="category" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Categoría del Reto</h3>
                <Select
                  value={challengeCategory}
                  onValueChange={(value) => setChallengeCategory(value as ChallengeCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karaoke">Karaoke</SelectItem>
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="misterioso">Misterioso</SelectItem>
                    <SelectItem value="icebreaker">Icebreaker</SelectItem>
                    <SelectItem value="roleplay">Roleplay</SelectItem>
                    <SelectItem value="reflexion">Reflexión</SelectItem>
                    <SelectItem value="confesion">Confesión</SelectItem>
                    <SelectItem value="improvisacion">Improvisación</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="meme">Meme</SelectItem>
                    <SelectItem value="redes_sociales">Redes Sociales</SelectItem>
                    <SelectItem value="humor">Humor</SelectItem>
                    <SelectItem value="vulnerabilidad">Vulnerabilidad</SelectItem>
                    <SelectItem value="intimidad">Intimidad</SelectItem>
                    {/* Añadir más categorías según sea necesario */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Categorías Populares</h3>
                {renderPopularCategories()}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tipo de Reto</h3>
                <div className="flex gap-2">
                  <Button
                    variant={challengeType === "individual" ? "default" : "outline"}
                    onClick={() => setChallengeType("individual")}
                    className="flex-1"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Individual
                  </Button>
                  <Button
                    variant={challengeType === "duet" ? "default" : "outline"}
                    onClick={() => setChallengeType("duet")}
                    className="flex-1"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Dueto
                  </Button>
                  <Button
                    variant={challengeType === "group" ? "default" : "outline"}
                    onClick={() => setChallengeType("group")}
                    className="flex-1"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Grupal
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="format" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Formato de Interacción</h3>
                <Select
                  value={interactionFormat}
                  onValueChange={(value) => setInteractionFormat(value as InteractionFormat)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canto_memoria">Canto y Memoria</SelectItem>
                    <SelectItem value="vocal_improvisacion">Vocal e Improvisación</SelectItem>
                    <SelectItem value="descripcion_imagen">Descripción e Imagen</SelectItem>
                    <SelectItem value="descripcion_meme">Descripción y Meme</SelectItem>
                    <SelectItem value="voz_texto">Voz y Texto</SelectItem>
                    <SelectItem value="texto_imagen">Texto e Imagen</SelectItem>
                    <SelectItem value="emojis_interpretacion">Emojis e Interpretación</SelectItem>
                    <SelectItem value="actuacion_voz">Actuación y Voz</SelectItem>
                    {/* Añadir más formatos según sea necesario */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Formatos Populares</h3>
                {renderPopularFormats()}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tipo de Verificación</h3>
                <div className="flex gap-2">
                  <Button
                    variant={
                      interactionFormat.includes("voz") || interactionFormat.includes("canto") ? "default" : "outline"
                    }
                    className="flex-1"
                    disabled
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Audio
                  </Button>
                  <Button
                    variant={interactionFormat.includes("imagen") ? "default" : "outline"}
                    className="flex-1"
                    disabled
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Foto
                  </Button>
                  <Button
                    variant={interactionFormat.includes("texto") ? "default" : "outline"}
                    className="flex-1"
                    disabled
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Texto
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  El tipo de verificación se determina automáticamente según el formato de interacción
                </p>
              </div>
            </TabsContent>

            <TabsContent value="tone" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Subtipo de Tono</h3>
                <Select value={toneSubtype} onValueChange={(value) => setToneSubtype(value as ToneSubtype)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tono" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="humoristico">Humorístico</SelectItem>
                    <SelectItem value="caotico">Caótico</SelectItem>
                    <SelectItem value="vulnerable">Vulnerable</SelectItem>
                    <SelectItem value="sarcastico">Sarcástico</SelectItem>
                    <SelectItem value="poetico">Poético</SelectItem>
                    <SelectItem value="ironico">Irónico</SelectItem>
                    <SelectItem value="tenso">Tenso</SelectItem>
                    <SelectItem value="melodramatico">Melodramático</SelectItem>
                    <SelectItem value="confesional">Confesional</SelectItem>
                    {/* Añadir más tonos según sea necesario */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Tonos Populares</h3>
                {renderPopularTones()}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Intensidad Emocional</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Snowflake className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm">Suave</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-purple-500 mr-1" />
                      <span className="text-sm">Intenso</span>
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm">Caótico</span>
                    </div>
                  </div>
                  <Slider
                    value={[emotionalTier === "mild" ? 0 : emotionalTier === "intense" ? 50 : 100]}
                    min={0}
                    max={100}
                    step={50}
                    onValueChange={(value) => {
                      const intensity = value[0]
                      if (intensity <= 25) setEmotionalTier("mild")
                      else if (intensity <= 75) setEmotionalTier("intense")
                      else setEmotionalTier("chaotic")
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Tipo de Experiencia</h3>
                <Select value={experienceType} onValueChange={(value) => setExperienceType(value as ExperienceType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de experiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="group">Grupal</SelectItem>
                    <SelectItem value="campaign">Campaña</SelectItem>
                    <SelectItem value="multi_table">Multimesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="branded" checked={isBranded} onCheckedChange={setIsBranded} />
                <Label htmlFor="branded">Carta Patrocinada</Label>
              </div>

              {isBranded && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Marca Patrocinadora</h3>
                  <Select value={brandId} onValueChange={setBrandId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Don Julio">Don Julio</SelectItem>
                      <SelectItem value="Tecate">Tecate</SelectItem>
                      <SelectItem value="Spotify">Spotify</SelectItem>
                      <SelectItem value="Uber Eats">Uber Eats</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-2">Canción de Spotify</h3>
                <div className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Se generará automáticamente según el tono y la categoría</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex gap-2 w-full">
            <Button
              onClick={generateCard}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
            >
              Generar Carta
            </Button>
            <Button onClick={generateRandomCard} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Aleatorio
            </Button>
          </div>
        </CardFooter>
      </Card>

      {generatedCard && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Carta Generada</h2>
            <Button variant="outline" size="sm" onClick={copyChallenge}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Reto
                </>
              )}
            </Button>
          </div>

          <UnifiedCardComponent card={generatedCard} isPreview={true} />
        </motion.div>
      )}
    </div>
  )
}
