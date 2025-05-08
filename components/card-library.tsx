"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { UnifiedCard } from "@/lib/unified-card-model"
import { cardCollections, getAllCards, searchCards, getCardsByCollection } from "@/lib/card-collections"
import { UnifiedCardComponent } from "./unified-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  HeartCrack,
  PartyPopper,
  MessageSquare,
  Palette,
  Award,
  Users,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Shuffle,
} from "lucide-react"
import { motion } from "framer-motion"

// Mapeo de iconos para colecciones
const collectionIcons: Record<string, React.ReactNode> = {
  despecho: <HeartCrack className="h-5 w-5" />,
  fiesta: <PartyPopper className="h-5 w-5" />,
  confesiones: <MessageSquare className="h-5 w-5" />,
  creativos: <Palette className="h-5 w-5" />,
  marcas: <Award className="h-5 w-5" />,
  grupales: <Users className="h-5 w-5" />,
  romanticos: <Heart className="h-5 w-5" />,
}

export function CardLibrary() {
  // Estados
  const [cards, setCards] = useState<UnifiedCard[]>([])
  const [filteredCards, setFilteredCards] = useState<UnifiedCard[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCollection, setActiveCollection] = useState("all")
  const [selectedCard, setSelectedCard] = useState<UnifiedCard | null>(null)
  const [copied, setCopied] = useState(false)
  const [deckCards, setDeckCards] = useState<UnifiedCard[]>([])
  const [sortBy, setSortBy] = useState<"category" | "difficulty" | "type">("category")

  // Cargar todas las cartas al inicio
  useEffect(() => {
    const allCards = getAllCards()
    setCards(allCards)
    setFilteredCards(allCards)
  }, [])

  // Filtrar cartas cuando cambia la colección o la búsqueda
  useEffect(() => {
    let result = cards

    // Filtrar por colección
    if (activeCollection !== "all") {
      result = getCardsByCollection(activeCollection)
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      result = searchCards(searchQuery).filter((card) =>
        activeCollection === "all"
          ? true
          : getCardsByCollection(activeCollection).some((c) => c.card_id === card.card_id),
      )
    }

    // Ordenar cartas
    result = sortCards(result, sortBy)

    setFilteredCards(result)
  }, [activeCollection, searchQuery, cards, sortBy])

  // Función para ordenar cartas
  const sortCards = (cardsToSort: UnifiedCard[], sortType: "category" | "difficulty" | "type"): UnifiedCard[] => {
    return [...cardsToSort].sort((a, b) => {
      switch (sortType) {
        case "category":
          return a.challenge_category.localeCompare(b.challenge_category)
        case "difficulty":
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
          return (
            (difficultyOrder[a.difficulty_level || "medium"] || 2) -
            (difficultyOrder[b.difficulty_level || "medium"] || 2)
          )
        case "type":
          return a.challenge_type.localeCompare(b.challenge_type)
        default:
          return 0
      }
    })
  }

  // Función para seleccionar una carta
  const handleSelectCard = (card: UnifiedCard) => {
    setSelectedCard(card)
  }

  // Función para copiar el reto al portapapeles
  const copyChallenge = () => {
    if (selectedCard) {
      navigator.clipboard.writeText(selectedCard.challenge)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Función para añadir una carta al mazo
  const addToDeck = (card: UnifiedCard) => {
    if (!deckCards.some((c) => c.card_id === card.card_id)) {
      setDeckCards([...deckCards, card])
    }
  }

  // Función para quitar una carta del mazo
  const removeFromDeck = (cardId: string) => {
    setDeckCards(deckCards.filter((card) => card.card_id !== cardId))
  }

  // Función para exportar el mazo
  const exportDeck = () => {
    const deckData = JSON.stringify(deckCards, null, 2)
    const blob = new Blob([deckData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `la-cortesia-deck-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Función para generar un mazo aleatorio
  const generateRandomDeck = () => {
    const shuffled = [...cards].sort(() => 0.5 - Math.random())
    setDeckCards(shuffled.slice(0, 10))
  }

  // Renderizar colecciones como tabs
  const renderCollectionTabs = () => {
    return (
      <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-4">
        <TabsTrigger value="all" onClick={() => setActiveCollection("all")}>
          Todas
        </TabsTrigger>
        {cardCollections.map((collection) => (
          <TabsTrigger
            key={collection.id}
            value={collection.id}
            onClick={() => setActiveCollection(collection.id)}
            className="flex items-center gap-1"
          >
            {collectionIcons[collection.id]}
            <span className="hidden md:inline">{collection.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    )
  }

  // Renderizar cartas filtradas
  const renderFilteredCards = () => {
    if (filteredCards.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron cartas que coincidan con tu búsqueda.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card) => (
          <motion.div
            key={card.card_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer"
            onClick={() => handleSelectCard(card)}
          >
            <UnifiedCardComponent card={card} isPreview={true} />
          </motion.div>
        ))}
      </div>
    )
  }

  // Renderizar el mazo actual
  const renderDeck = () => {
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mi Mazo ({deckCards.length})</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={generateRandomDeck} disabled={cards.length === 0}>
              <Shuffle className="h-4 w-4 mr-2" />
              Aleatorio
            </Button>
            <Button variant="default" size="sm" onClick={exportDeck} disabled={deckCards.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {deckCards.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                Tu mazo está vacío. Haz clic en las cartas de arriba para añadirlas a tu mazo.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deckCards.map((card) => (
              <motion.div
                key={card.card_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFromDeck(card.card_id)
                  }}
                >
                  &times;
                </Button>
                <UnifiedCardComponent card={card} isPreview={true} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar cartas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Categoría</SelectItem>
              <SelectItem value="difficulty">Dificultad</SelectItem>
              <SelectItem value="type">Tipo de Reto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all">
        {renderCollectionTabs()}

        <TabsContent value="all" className="mt-4">
          {renderFilteredCards()}
        </TabsContent>

        {cardCollections.map((collection) => (
          <TabsContent key={collection.id} value={collection.id} className="mt-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                {collectionIcons[collection.id]}
                {collection.name}
              </h2>
              <p className="text-gray-600">{collection.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {collection.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            {renderFilteredCards()}
          </TabsContent>
        ))}
      </Tabs>

      {renderDeck()}

      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Detalles de la Carta</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedCard(null)}>
                &times;
              </Button>
            </div>
            <div className="p-4">
              <UnifiedCardComponent card={selectedCard} isPreview={false} />

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Categoría</h3>
                  <Badge>{selectedCard.challenge_category}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Tipo de Reto</h3>
                  <Badge>{selectedCard.challenge_type}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Formato</h3>
                  <Badge>{selectedCard.interaction_format}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Tono</h3>
                  <Badge>{selectedCard.tone_subtype}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Verificación</h3>
                  <Badge>{selectedCard.verification_type}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Dificultad</h3>
                  <Badge
                    variant={
                      selectedCard.difficulty_level === "easy"
                        ? "outline"
                        : selectedCard.difficulty_level === "hard"
                          ? "destructive"
                          : "default"
                    }
                  >
                    {selectedCard.difficulty_level}
                  </Badge>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Desencadenante Social</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">{selectedCard.social_trigger}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Recompensa</h3>
                <p className="text-sm bg-gray-100 p-2 rounded">
                  {typeof selectedCard.reward === "string"
                    ? selectedCard.reward
                    : `${selectedCard.reward.descripcion} (${selectedCard.reward.valor})`}
                </p>
              </div>

              {selectedCard.spotify_song && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-1">Canción Sugerida</h3>
                  <div className="flex items-center gap-2 bg-green-100 p-2 rounded">
                    <div className="bg-green-500 text-white p-1 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18V5l12-2v13" />
                        <circle cx="6" cy="18" r="3" />
                        <circle cx="18" cy="16" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedCard.spotify_song.title}</p>
                      <p className="text-xs">{selectedCard.spotify_song.artist}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <Button onClick={copyChallenge} variant="outline" className="flex-1">
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
                <Button
                  onClick={() => {
                    addToDeck(selectedCard)
                    setSelectedCard(null)
                  }}
                  className="flex-1"
                >
                  Añadir al Mazo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
