"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Share2,
  Download,
  ChevronRight,
  ChevronLeft,
  Award,
  Heart,
  Flame,
  Sparkles,
  Music,
  ImageIcon,
} from "lucide-react"
import { wrappedAnalytics, type WrappedData } from "@/services/wrapped-analytics"
import { useToast } from "@/hooks/use-toast"

interface WrappedExperienceProps {
  userId: string
  userName: string
  onClose?: () => void
}

export function WrappedExperience({ userId, userName, onClose }: WrappedExperienceProps) {
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly")
  const router = useRouter()
  const { toast } = useToast()

  // Cargar datos de Wrapped
  useEffect(() => {
    const loadWrappedData = () => {
      try {
        setLoading(true)
        const data = wrappedAnalytics.generateWrapped(userId, period)
        setWrappedData(data)
      } catch (error) {
        console.error("Error loading wrapped data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadWrappedData()
  }, [userId, period])

  // Manejar cambio de período
  const handlePeriodChange = (newPeriod: "weekly" | "monthly" | "yearly") => {
    setPeriod(newPeriod)
  }

  // Navegar entre slides
  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Compartir Wrapped
  const shareWrapped = async () => {
    try {
      // Capturar el contenido actual como imagen
      const slideElement = document.getElementById("wrapped-slide")
      if (!slideElement) return

      // En una implementación real, usaríamos html2canvas o una solución similar
      // para capturar el contenido como imagen

      // Simulamos compartir
      if (navigator.share) {
        await navigator.share({
          title: `Mi ${period === "yearly" ? "Año" : period === "monthly" ? "Mes" : "Semana"} en La Cortesía`,
          text: `¡Mira mi experiencia en La Cortesía! ${getShareText()}`,
          // url: "https://lacortesia.app/wrapped/" + userId
        })
      } else {
        // Fallback para navegadores que no soportan Web Share API
        navigator.clipboard.writeText(`¡Mira mi experiencia en La Cortesía! ${getShareText()}`)
        toast({
          title: "¡Enlace copiado!",
          description: "El enlace ha sido copiado al portapapeles.",
        })
      }
    } catch (error) {
      console.error("Error sharing wrapped:", error)
    }
  }

  // Descargar como imagen
  const downloadWrapped = () => {
    // En una implementación real, usaríamos html2canvas o similar
    toast({
      title: "Descarga iniciada",
      description: "Tu Wrapped se está descargando como imagen.",
    })
  }

  // Obtener texto para compartir
  const getShareText = () => {
    if (!wrappedData) return ""

    return `Este ${period === "yearly" ? "año" : period === "monthly" ? "mes" : "semana"} completé ${
      wrappedData.totalChallengesCompleted
    } retos en La Cortesía con un nivel de caos del ${Math.round(wrappedData.emotionalProfile.chaosLevel)}%. ¡Mi emoción dominante fue "${
      wrappedData.emotionalProfile.dominantEmotion
    }"!`
  }

  // Determinar número total de slides
  const totalSlides = 5 // Ajustar según el número de slides que tengas

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-lg">Preparando tu experiencia Wrapped...</p>
      </div>
    )
  }

  // Si no hay datos, mostrar mensaje
  if (!wrappedData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No hay suficientes datos</h2>
          <p className="text-muted-foreground mb-6">Necesitas completar más retos para generar tu Wrapped.</p>
          <Button onClick={() => router.push("/experience")}>Ir a Jugar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Selector de período */}
      <div className="mb-6 w-full max-w-md">
        <Tabs defaultValue={period} onValueChange={(value) => handlePeriodChange(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensual</TabsTrigger>
            <TabsTrigger value="yearly">Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Contenedor principal del Wrapped */}
      <div className="relative w-full max-w-md aspect-[9/16] bg-gradient-to-br from-purple-900 via-pink-800 to-amber-700 rounded-xl overflow-hidden shadow-xl">
        {/* Indicador de progreso */}
        <div className="absolute top-0 left-0 right-0 z-10 p-2">
          <div className="flex gap-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${index <= currentSlide ? "bg-white" : "bg-white/30"}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Slides */}
        <div id="wrapped-slide" className="h-full w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full flex flex-col items-center justify-center p-6 text-white"
            >
              {currentSlide === 0 && (
                <div className="text-center">
                  <h1 className="text-3xl font-bold mb-2">
                    Tu {period === "yearly" ? "Año" : period === "monthly" ? "Mes" : "Semana"} en La Cortesía
                  </h1>
                  <p className="text-xl mb-6">{userName}</p>
                  <div className="mb-8">
                    <img
                      src="/placeholder.svg?height=200&width=200&text=Wrapped"
                      alt="Wrapped Logo"
                      className="w-40 h-40 mx-auto rounded-full bg-white/20 p-2"
                    />
                  </div>
                  <p className="text-lg mb-4">Descubre tu experiencia emocional en La Cortesía</p>
                  <p className="text-sm opacity-70">
                    {wrappedData.startDate.toLocaleDateString()} - {wrappedData.endDate.toLocaleDateString()}
                  </p>
                </div>
              )}

              {currentSlide === 1 && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-6">Tu Perfil Emocional</h2>
                  <div className="mb-8">
                    <div className="relative w-40 h-40 mx-auto">
                      <div className="absolute inset-0 rounded-full bg-white/20 flex items-center justify-center">
                        {wrappedData.emotionalProfile.dominantEmotion === "despecho" && (
                          <Heart className="h-16 w-16 text-red-400" />
                        )}
                        {wrappedData.emotionalProfile.dominantEmotion === "nostalgia" && (
                          <Music className="h-16 w-16 text-blue-400" />
                        )}
                        {wrappedData.emotionalProfile.dominantEmotion === "rabia" && (
                          <Flame className="h-16 w-16 text-orange-400" />
                        )}
                        {wrappedData.emotionalProfile.dominantEmotion === "misticismo" && (
                          <Sparkles className="h-16 w-16 text-purple-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {wrappedData.emotionalProfile.dominantEmotion.charAt(0).toUpperCase() +
                      wrappedData.emotionalProfile.dominantEmotion.slice(1)}
                  </h3>
                  <p className="mb-6">Tu emoción dominante</p>
                  <div className="bg-white/10 rounded-lg p-4 mb-4">
                    <div className="flex justify-between mb-1">
                      <span>Nivel de Caos</span>
                      <span>{Math.round(wrappedData.emotionalProfile.chaosLevel)}%</span>
                    </div>
                    <Progress value={wrappedData.emotionalProfile.chaosLevel} className="h-2 bg-white/20" />
                    <p className="text-sm mt-2 opacity-70">
                      Estás en el top {Math.round(100 - wrappedData.emotionalProfile.chaosPercentile)}% de usuarios más
                      caóticos
                    </p>
                  </div>
                </div>
              )}

              {currentSlide === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Tus Estadísticas</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{wrappedData.totalChallengesCompleted}</div>
                      <div className="text-sm">Retos Completados</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{wrappedData.totalRewardsEarned}</div>
                      <div className="text-sm">Recompensas Ganadas</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{wrappedData.totalStickersUnlocked}</div>
                      <div className="text-sm">Stickers Desbloqueados</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-3xl font-bold">{wrappedData.totalSocialTriggersActivated}</div>
                      <div className="text-sm">Desencadenantes Sociales</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <h3 className="font-bold mb-2">Experiencia Social</h3>
                    <div className="flex justify-between mb-1">
                      <span>Retos en Grupo</span>
                      <span>{wrappedData.socialStats.groupChallengesCompleted}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Retos en Dueto</span>
                      <span>{wrappedData.socialStats.duetChallengesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reacciones Recibidas</span>
                      <span>{wrappedData.socialStats.totalReactions}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentSlide === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Tus Logros</h2>
                  <div className="space-y-4 mb-6">
                    {wrappedData.achievements.length > 0 ? (
                      wrappedData.achievements.map((achievement, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-4 flex items-start">
                          <div className="bg-white/20 rounded-full p-2 mr-3">
                            {achievement.iconType === "card" && <ImageIcon className="h-5 w-5" />}
                            {achievement.iconType === "combo" && <Sparkles className="h-5 w-5" />}
                            {achievement.iconType === "chaos" && <Flame className="h-5 w-5" />}
                            {achievement.iconType === "social" && <Share2 className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-bold">{achievement.title}</h3>
                            <p className="text-sm opacity-80">{achievement.description}</p>
                            <p className="text-xs opacity-60 mt-1">{achievement.date.toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Completa más retos para desbloquear logros</p>
                      </div>
                    )}
                  </div>
                  {wrappedData.topCards.length > 0 && (
                    <div className="bg-white/10 rounded-lg p-4">
                      <h3 className="font-bold mb-2">Tu Carta Favorita</h3>
                      <p className="text-lg font-medium">{wrappedData.topCards[0].card.card_title}</p>
                      <p className="text-sm opacity-70">Jugada {wrappedData.topCards[0].timesPlayed} veces</p>
                    </div>
                  )}
                </div>
              )}

              {currentSlide === 4 && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-6">Para Ti</h2>
                  <p className="mb-6">Basado en tu experiencia, te recomendamos:</p>
                  <div className="space-y-4 mb-8">
                    {wrappedData.recommendations.map((recommendation, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-4 text-left">
                        <h3 className="font-bold">{recommendation.title}</h3>
                        <p className="text-sm opacity-80">{recommendation.description}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="mb-2">¡Comparte tu experiencia!</p>
                    <div className="flex justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20"
                        onClick={shareWrapped}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20"
                        onClick={downloadWrapped}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controles de navegación */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="bg-white/10 text-white rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="bg-white/10 text-white rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Botón de cerrar */}
      {onClose && (
        <Button variant="ghost" className="mt-6" onClick={onClose}>
          Cerrar
        </Button>
      )}
    </div>
  )
}
