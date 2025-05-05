"use client"

import { useState } from "react"
import { GroupChallengeFlow } from "@/components/group-challenge-flow"
import type { Card } from "@/lib/card-generator-pipeline-enhanced"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus, X, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample data - in production this would come from an API
const sampleCards: Card[] = [
  {
    card_id: "card_001",
    card_title: "EL EX-TEXTER",
    challenge: "Le escribió a su ex desde la cuenta de su roomie",
    social_trigger: "Convence a alguien más de la mesa que mande un mensaje a su ex",
    reward: "Shot gratis de tequila",
    reward_type: "shot",
    emotional_tier: "intense",
    genre_tag: "Reggaetón Sad",
    ai_backup_response:
      "Podrías decir algo como: 'Una vez envié un mensaje por error a mi ex preguntando si podíamos volver, ¡pero en realidad era para otra persona!'",
    narrative_voice: "La Lotería del Despecho™",
    spotify_song: {
      title: "Amorfoda",
      artist: "Bad Bunny",
      url: "https://open.spotify.com/track/5ricyQVd3gobVoinkRFgBF",
    },
    sticker_integration: "Desbloquea el sticker 'Textos Peligrosos'",
  },
  {
    card_id: "card_002",
    card_title: "EL RENUNCIAZO",
    challenge: "Publica 'Orgulloso de anunciar...' cada 2 semanas",
    social_trigger: "Comparte tu post de LinkedIn más cringe con el grupo",
    reward: "Sticker AR 'Fantasma del After'",
    reward_type: "digital",
    emotional_tier: "mild",
    genre_tag: "Cumbia del Olvido",
    ai_backup_response:
      "Un ejemplo sería: 'Mi post más cringe fue cuando anuncié que dejaba mi trabajo para 'perseguir mis sueños' pero en realidad solo tenía otra oferta mejor'",
    narrative_voice: "Corporate Cringe™",
    brand_sponsor: {
      id: "brand_001",
      name: "Tecate",
      logo: "/placeholder.svg?height=40&width=120&text=Tecate",
      rewardValue: 50,
    },
  },
  {
    card_id: "card_003",
    card_title: "LA POLAROID",
    challenge: "Tu playlist más vergonzosa revelada",
    social_trigger: "Pon tu canción más cursi a todo volumen",
    reward: "Memoria digital con subtítulos neón",
    reward_type: "digital",
    emotional_tier: "chaotic",
    genre_tag: "Corridos del Alma",
    ai_backup_response:
      "Puedes confesar: 'Mi playlist secreto de breakup está lleno de Adele, Taylor Swift y baladas de Luis Miguel'",
    narrative_voice: "Nostalgia Digital™",
  },
]

// Sample brand info
const sampleBrandInfo = {
  name: "Tecate",
  logo: "/placeholder.svg?height=40&width=120&text=Tecate",
  themeColor: "#f3f4f6",
}

export default function GroupExperiencePage() {
  const router = useRouter()
  const [gameStarted, setGameStarted] = useState(false)
  const [players, setPlayers] = useState<
    Array<{
      id: string
      name: string
      avatar?: string
      tier: "basic" | "intermediate" | "advanced"
      completedCards: string[]
      emotionalScore: number
      currentTurn: boolean
      assignedCards: Card[]
    }>
  >([
    {
      id: "user_001",
      name: "Ana",
      avatar: "/placeholder.svg?height=40&width=40&text=A",
      tier: "basic",
      completedCards: [],
      emotionalScore: 0,
      currentTurn: true,
      assignedCards: [sampleCards[0], sampleCards[1]], // Asignar múltiples cartas
    },
  ])
  const [newPlayerName, setNewPlayerName] = useState("")

  // Function to add new player
  const addPlayer = () => {
    if (!newPlayerName.trim()) return

    const newPlayerId = `user_${players.length + 1}`.padStart(7, "0")

    // Asignar todas las cartas disponibles al nuevo jugador
    const assignedCards = [...sampleCards].sort(() => 0.5 - Math.random())

    setPlayers([
      ...players,
      {
        id: newPlayerId,
        name: newPlayerName,
        avatar: `/placeholder.svg?height=40&width=40&text=${newPlayerName[0]}`,
        tier: "basic",
        completedCards: [],
        emotionalScore: 0,
        currentTurn: false,
        assignedCards,
      },
    ])

    setNewPlayerName("")
  }

  // Function to remove a player
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((player) => player.id !== playerId))
  }

  // Function to start the game
  const startGame = () => {
    setGameStarted(true)
  }

  return (
    <div>
      {!gameStarted ? (
        <div className="max-w-md mx-auto p-4 md:p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">Experiencia Grupal</h1>
            <p className="text-muted-foreground">Añade jugadores para comenzar la experiencia grupal</p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <div
              className="rounded-lg overflow-hidden p-2 inline-block mb-2"
              style={{ backgroundColor: sampleBrandInfo.themeColor }}
            >
              <img
                src={sampleBrandInfo.logo || "/placeholder.svg"}
                alt={sampleBrandInfo.name}
                className="h-8 object-contain"
              />
            </div>
            <p className="text-sm text-yellow-700">La experiencia está patrocinada por {sampleBrandInfo.name}</p>
          </div>

          {/* Player list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Jugadores</h2>
              <div className="bg-primary-50 rounded-full px-2 py-1 flex items-center">
                <Users size={16} className="mr-1 text-primary" />
                <span className="text-sm font-medium">{players.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              {players.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{player.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayer(player.id)}
                    disabled={players.length === 1}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add new player form */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="player-name" className="sr-only">
                  Nombre del jugador
                </Label>
                <Input
                  id="player-name"
                  placeholder="Nombre del jugador"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addPlayer()
                  }}
                />
              </div>
              <Button onClick={addPlayer} size="icon">
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <Button onClick={startGame} className="w-full" disabled={players.length < 1}>
            Comenzar Experiencia Grupal
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      ) : (
        <GroupChallengeFlow
          initialPlayers={players}
          cards={sampleCards}
          brandInfo={sampleBrandInfo}
          onComplete={() => router.push("/experience")}
        />
      )}
    </div>
  )
}
