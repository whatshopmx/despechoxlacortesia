"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmotionalCard } from "@/components/emotional-card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertCircle,
  Award,
  Heart,
  MessageCircle,
  Send,
  ThumbsUp,
  Users,
  Clock,
  Laugh,
  Smile,
  CheckCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Card as CardType } from "@/lib/card-generator-pipeline-enhanced"

// Tipos para los participantes y mensajes
interface Participant {
  id: string
  name: string
  avatar: string
  isActive: boolean
  emotionalIntensity: number
  stickers: string[]
  completedChallenges: number
}

interface ChatMessage {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  message: string
  timestamp: Date
}

interface Reaction {
  id: string
  participantId: string
  participantName: string
  type: "laugh" | "heart" | "thumbsUp" | "wow" | "applause"
  timestamp: Date
}

interface ChallengeActivity {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  card: CardType
  completed: boolean
  reactions: Reaction[]
  timestamp: Date
}

interface ExperienceSessionProps {
  initialCard?: CardType
  onChallengeComplete?: () => void
  brandName?: string
  brandLogo?: string
}

export function ExperienceSession({
  initialCard,
  onChallengeComplete,
  brandName = "La Cortesía",
  brandLogo = "/placeholder.svg?height=40&width=40&text=LC",
}: ExperienceSessionProps) {
  // Estado para los participantes
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "user",
      name: "Tú",
      avatar: "/placeholder.svg?height=40&width=40&text=Tú",
      isActive: true,
      emotionalIntensity: 30,
      stickers: ["Corazón Roto"],
      completedChallenges: 2,
    },
    {
      id: "p1",
      name: "Carlos",
      avatar: "/placeholder.svg?height=40&width=40&text=C",
      isActive: false,
      emotionalIntensity: 45,
      stickers: ["Tears de Oro", "Friendzone Champion"],
      completedChallenges: 3,
    },
    {
      id: "p2",
      name: "Diana",
      avatar: "/placeholder.svg?height=40&width=40&text=D",
      isActive: false,
      emotionalIntensity: 60,
      stickers: ["Voz de Borrachx", "Petty Pro"],
      completedChallenges: 5,
    },
    {
      id: "p3",
      name: "Miguel",
      avatar: "/placeholder.svg?height=40&width=40&text=M",
      isActive: false,
      emotionalIntensity: 25,
      stickers: ["Micrófono Ardido"],
      completedChallenges: 1,
    },
  ])

  // Estado para el chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg1",
      participantId: "p1",
      participantName: "Carlos",
      participantAvatar: "/placeholder.svg?height=40&width=40&text=C",
      message: "¡Vamos a empezar con los retos!",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "msg2",
      participantId: "p2",
      participantName: "Diana",
      participantAvatar: "/placeholder.svg?height=40&width=40&text=D",
      message: "Estoy lista para el drama 😂",
      timestamp: new Date(Date.now() - 240000),
    },
    {
      id: "msg3",
      participantId: "p3",
      participantName: "Miguel",
      participantAvatar: "/placeholder.svg?height=40&width=40&text=M",
      message: "Espero que me toque algo fácil...",
      timestamp: new Date(Date.now() - 180000),
    },
  ])

  // Estado para el feed de actividad
  const [activityFeed, setActivityFeed] = useState<ChallengeActivity[]>([])

  // Estado para el mensaje actual
  const [currentMessage, setCurrentMessage] = useState("")

  // Estado para el turno actual
  const [currentTurn, setCurrentTurn] = useState(0)

  // Estado para el reto actual
  const [currentCard, setCurrentCard] = useState<CardType | null>(initialCard || null)

  // Estado para el temporizador
  const [timer, setTimer] = useState(60)

  // Estado para mostrar la verificación
  const [showVerification, setShowVerification] = useState(false)

  // Estado para los votos de verificación
  const [verificationVotes, setVerificationVotes] = useState<Record<string, boolean>>({})

  // Estado para mostrar el resultado
  const [showResult, setShowResult] = useState(false)

  // Estado para el resultado (éxito o fracaso)
  const [challengeSuccess, setChallengeSuccess] = useState(false)

  // Efecto para simular el temporizador
  useEffect(() => {
    if (participants[currentTurn].isActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [timer, currentTurn, participants])

  // Función para enviar un mensaje
  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      participantId: "user",
      participantName: "Tú",
      participantAvatar: "/placeholder.svg?height=40&width=40&text=Tú",
      message: currentMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, newMessage])
    setCurrentMessage("")

    // Simular respuestas de otros participantes
    setTimeout(() => {
      const responses = [
        "¡Totalmente de acuerdo!",
        "Jajaja, eso es muy cierto",
        "No puedo creer que hayas dicho eso 😂",
        "Interesante punto de vista...",
        "¡Vamos a ver qué pasa!",
      ]

      const randomParticipant = participants.find((p) => p.id !== "user") || participants[1]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const responseMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        participantId: randomParticipant.id,
        participantName: randomParticipant.name,
        participantAvatar: randomParticipant.avatar,
        message: randomResponse,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, responseMessage])
    }, 2000)
  }

  // Función para completar un reto
  const completeChallenge = () => {
    if (!currentCard) return

    // Mostrar la verificación
    setShowVerification(true)

    // Simular votos automáticos después de un tiempo
    setTimeout(() => {
      const simulatedVotes: Record<string, boolean> = {}
      participants.forEach((p) => {
        if (p.id !== "user") {
          // 80% de probabilidad de voto positivo
          simulatedVotes[p.id] = Math.random() > 0.2
        }
      })
      setVerificationVotes(simulatedVotes)
    }, 2000)
  }

  // Función para votar en la verificación
  const voteOnVerification = (vote: boolean) => {
    setVerificationVotes((prev) => ({
      ...prev,
      user: vote,
    }))

    // Verificar si hay suficientes votos para determinar el resultado
    setTimeout(() => {
      const votes = Object.values({ ...verificationVotes, user: vote })
      const positiveVotes = votes.filter((v) => v).length
      const success = positiveVotes >= Math.ceil(participants.length / 2)

      setChallengeSuccess(success)
      setShowVerification(false)
      setShowResult(true)

      if (success) {
        // Añadir al feed de actividad
        const newActivity: ChallengeActivity = {
          id: `activity-${Date.now()}`,
          participantId: participants[currentTurn].id,
          participantName: participants[currentTurn].name,
          participantAvatar: participants[currentTurn].avatar,
          card: currentCard,
          completed: true,
          reactions: [],
          timestamp: new Date(),
        }

        setActivityFeed((prev) => [newActivity, ...prev])

        // Actualizar la intensidad emocional del participante
        setParticipants((prev) =>
          prev.map((p) => {
            if (p.id === participants[currentTurn].id) {
              return {
                ...p,
                emotionalIntensity: Math.min(100, p.emotionalIntensity + 15),
                completedChallenges: p.completedChallenges + 1,
              }
            }
            return p
          }),
        )

        // Notificar al componente padre
        if (onChallengeComplete) {
          onChallengeComplete()
        }
      }

      // Pasar al siguiente turno después de un tiempo
      setTimeout(() => {
        setShowResult(false)
        nextTurn()
      }, 3000)
    }, 1000)
  }

  // Función para pasar al siguiente turno
  const nextTurn = () => {
    const nextTurnIndex = (currentTurn + 1) % participants.length
    setCurrentTurn(nextTurnIndex)

    // Actualizar participantes activos
    setParticipants((prev) =>
      prev.map((p, i) => ({
        ...p,
        isActive: i === nextTurnIndex,
      })),
    )

    // Reiniciar el temporizador
    setTimer(60)

    // Simular un nuevo reto
    if (initialCard) {
      setCurrentCard(initialCard)
    }
  }

  // Función para añadir una reacción a una actividad
  const addReaction = (activityId: string, type: "laugh" | "heart" | "thumbsUp" | "wow" | "applause") => {
    const newReaction: Reaction = {
      id: `reaction-${Date.now()}`,
      participantId: "user",
      participantName: "Tú",
      type,
      timestamp: new Date(),
    }

    setActivityFeed((prev) =>
      prev.map((activity) => {
        if (activity.id === activityId) {
          return {
            ...activity,
            reactions: [...activity.reactions, newReaction],
          }
        }
        return activity
      }),
    )

    // Simular reacciones de otros participantes
    setTimeout(() => {
      const randomParticipant = participants.find((p) => p.id !== "user") || participants[1]
      const reactionTypes: ("laugh" | "heart" | "thumbsUp" | "wow" | "applause")[] = [
        "laugh",
        "heart",
        "thumbsUp",
        "wow",
        "applause",
      ]
      const randomType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)]

      const simulatedReaction: Reaction = {
        id: `reaction-${Date.now() + 1}`,
        participantId: randomParticipant.id,
        participantName: randomParticipant.name,
        type: randomType,
        timestamp: new Date(),
      }

      setActivityFeed((prev) =>
        prev.map((activity) => {
          if (activity.id === activityId) {
            return {
              ...activity,
              reactions: [...activity.reactions, simulatedReaction],
            }
          }
          return activity
        }),
      )
    }, 1500)
  }

  // Función para formatear el tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Función para obtener el color de intensidad
  const getIntensityColor = (intensity: number) => {
    if (intensity < 40) return "bg-blue-500"
    if (intensity < 70) return "bg-purple-500"
    return "bg-red-500"
  }

  // Función para obtener el icono de reacción
  const getReactionIcon = (type: string) => {
    switch (type) {
      case "laugh":
        return <Laugh className="h-4 w-4 text-yellow-500" />
      case "heart":
        return <Heart className="h-4 w-4 text-red-500" />
      case "thumbsUp":
        return <ThumbsUp className="h-4 w-4 text-blue-500" />
      case "wow":
        return <Smile className="h-4 w-4 text-purple-500" />
      case "applause":
        return <Award className="h-4 w-4 text-green-500" />
      default:
        return <ThumbsUp className="h-4 w-4" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Panel izquierdo: Participantes y chat */}
      <div className="md:col-span-1 space-y-4">
        {/* Información de la sesión */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={brandLogo || "/placeholder.svg"} alt={brandName} />
                  <AvatarFallback>{brandName.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{brandName}</CardTitle>
              </div>
              <Badge variant="outline" className="ml-2">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(timer)}
              </Badge>
            </div>
            <CardDescription>Sesión de experiencia emocional</CardDescription>
          </CardHeader>
        </Card>

        {/* Participantes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Participantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className={`flex items-center justify-between p-2 rounded-md ${
                    participant.isActive ? "bg-primary/10" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm flex items-center">
                        {participant.name}
                        {participant.isActive && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Turno actual
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {participant.completedChallenges} retos completados
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-16">
                            <Progress
                              value={participant.emotionalIntensity}
                              className={`h-1.5 ${getIntensityColor(participant.emotionalIntensity)}`}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Intensidad emocional: {participant.emotionalIntensity}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="h-[400px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <ScrollArea className="h-[280px]">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={message.participantAvatar || "/placeholder.svg"}
                        alt={message.participantName}
                      />
                      <AvatarFallback>{message.participantName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{message.participantName}</span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Escribe un mensaje..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage()
                }}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Panel central: Reto actual */}
      <div className="md:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Reto Actual</span>
              {participants[currentTurn].isActive && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timer)}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Turno de {participants[currentTurn].name} {participants[currentTurn].id === "user" && "(Tú)"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {currentCard ? (
              <div className="w-full">
                <EmotionalCard card={currentCard} hideButton={true} />
                {participants[currentTurn].id === "user" && (
                  <Button className="w-full mt-4" onClick={completeChallenge}>
                    He Completado el Reto
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <div className="mb-2">Esperando el próximo reto...</div>
                <Button onClick={nextTurn}>Sacar una carta</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Panel derecho: Feed de actividad */}
      <div className="md:col-span-1">
        <Tabs defaultValue="feed">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Feed de Actividad</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-4 space-y-4">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                <ScrollArea className="h-[520px]">
                  <div className="space-y-4">
                    {activityFeed.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        Aún no hay actividad. ¡Completa un reto para empezar!
                      </div>
                    ) : (
                      activityFeed.map((activity) => (
                        <Card key={activity.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                  <AvatarImage
                                    src={activity.participantAvatar || "/placeholder.svg"}
                                    alt={activity.participantName}
                                  />
                                  <AvatarFallback>{activity.participantName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{activity.participantName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {activity.timestamp.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {activity.card.emotional_tier}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="text-sm font-medium mb-1">{activity.card.card_title}</div>
                            <div className="text-xs text-muted-foreground">{activity.card.challenge}</div>
                          </CardContent>
                          <CardFooter className="pt-2 flex justify-between border-t">
                            <div className="flex items-center gap-1">
                              {activity.reactions.length > 0 && (
                                <div className="flex -space-x-1">
                                  {Array.from(new Set(activity.reactions.map((r) => r.type).slice(0, 3))).map(
                                    (type, i) => (
                                      <div
                                        key={i}
                                        className="h-5 w-5 rounded-full bg-background flex items-center justify-center border"
                                      >
                                        {getReactionIcon(type)}
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                              {activity.reactions.length > 0 && (
                                <span className="text-xs text-muted-foreground ml-1">{activity.reactions.length}</span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => addReaction(activity.id, "heart")}
                              >
                                <Heart className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => addReaction(activity.id, "thumbsUp")}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => addReaction(activity.id, "laugh")}
                              >
                                <Laugh className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stickers" className="mt-4">
            <Card className="h-[600px]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Stickers Coleccionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {participants.map((participant) => (
                    <Card key={participant.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-sm">{participant.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {participant.stickers.map((sticker, i) => (
                            <Badge key={i} variant="secondary">
                              {sticker}
                            </Badge>
                          ))}
                          {participant.stickers.length === 0 && (
                            <div className="text-xs text-muted-foreground">Sin stickers aún</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de verificación */}
      {showVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Verificación del Reto</CardTitle>
              <CardDescription>
                Los participantes están verificando si {participants[currentTurn].name} completó el reto correctamente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {participants.map((participant) => (
                    <div key={participant.id} className="text-center">
                      <Avatar className="h-12 w-12 mx-auto">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-xs mt-1">{participant.name}</div>
                      {participant.id !== "user" ? (
                        verificationVotes[participant.id] !== undefined ? (
                          <Badge
                            variant={verificationVotes[participant.id] ? "default" : "destructive"}
                            className="mt-1"
                          >
                            {verificationVotes[participant.id] ? "Aprobado" : "Rechazado"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="mt-1">
                            Votando...
                          </Badge>
                        )
                      ) : (
                        <div className="mt-1">
                          {verificationVotes["user"] === undefined ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="default"
                                className="text-xs h-7"
                                onClick={() => voteOnVerification(true)}
                              >
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs h-7"
                                onClick={() => voteOnVerification(false)}
                              >
                                Rechazar
                              </Button>
                            </div>
                          ) : (
                            <Badge variant={verificationVotes["user"] ? "default" : "destructive"} className="mt-1">
                              {verificationVotes["user"] ? "Aprobado" : "Rechazado"}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de resultado */}
      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{challengeSuccess ? "¡Reto Completado!" : "Reto Fallido"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                {challengeSuccess ? (
                  <>
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-center">¡{participants[currentTurn].name} ha completado el reto exitosamente!</p>
                  </>
                ) : (
                  <>
                    <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-center">{participants[currentTurn].name} no ha logrado completar el reto.</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Confetti para celebración */}
      {challengeSuccess && showResult && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <AnimatePresence>
            {Array.from({ length: 50 }).map((_, i) => {
              const size = Math.random() * 10 + 5
              const x = Math.random() * 100
              const y = -10
              const delay = Math.random() * 0.5
              const duration = Math.random() * 3 + 2
              const color = ["#FF5E5B", "#D8D8D8", "#FFFFEA", "#00CECB", "#FFED66"][Math.floor(Math.random() * 5)]

              return (
                <motion.div
                  key={i}
                  initial={{ x: `${x}vw`, y: `${y}vh` }}
                  animate={{
                    y: "110vh",
                    rotate: 360,
                    transition: {
                      duration,
                      delay,
                      ease: "easeIn",
                    },
                  }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
