"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Gift, Calendar, CreditCard, QrCode, Share, Check, AlertCircle, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QRCodeSVG } from "qrcode.react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Define types for our rewards
interface RewardType {
  id: string
  name: string
  description: string
  type: "digital" | "physical" | "experience"
  brandName?: string
  expiryDate?: Date
  redeemed: boolean
  tier: "basic" | "intermediate" | "advanced"
  image?: string
}

interface Player {
  id: string
  name: string
  avatar?: string
  tier: "basic" | "intermediate" | "advanced"
  completedCards: string[]
  emotionalScore: number
  rewards: RewardType[]
}

interface GroupRewardsSummaryProps {
  players: Player[]
  brandInfo: {
    name: string
    logo: string
    themeColor: string
  }
  onClose: () => void
}

export function GroupRewardsSummary({ players, brandInfo, onClose }: GroupRewardsSummaryProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(players[0] || null)
  const [selectedReward, setSelectedReward] = useState<RewardType | null>(null)
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false)
  const [redeemError, setRedeemError] = useState<string | null>(null)

  // Get all rewards from all players
  const allRewards = players.flatMap((player) => player.rewards)

  // Filter rewards by type
  const digitalRewards = allRewards.filter((reward) => reward.type === "digital")
  const physicalRewards = allRewards.filter((reward) => reward.type === "physical")
  const experienceRewards = allRewards.filter((reward) => reward.type === "experience")

  // Format date
  const formatDate = (date: Date | undefined) => {
    if (!date) return "No expira"
    return new Date(date).toLocaleDateString()
  }

  // Handle reward redemption
  const handleRedeemReward = (reward: RewardType) => {
    try {
      setRedeemError(null)
      setSelectedReward(reward)
      setRedeemDialogOpen(true)
    } catch (err) {
      console.error("Error redeeming reward:", err)
      setRedeemError("Ocurrió un error al canjear la recompensa. Por favor, intenta de nuevo.")
    }
  }

  // Get intensity level
  const getIntensityLevel = (intensity: number) => {
    if (intensity < 40) return { label: "Suave", color: "text-blue-500" }
    if (intensity < 70) return { label: "Intenso", color: "text-purple-500" }
    return { label: "Caótico", color: "text-red-500" }
  }

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "advanced":
        return "bg-red-500"
      case "intermediate":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  // Calculate group stats
  const totalRewards = allRewards.length
  const totalCompletedCards = players.reduce((sum, player) => sum + player.completedCards.length, 0)
  const averageEmotionalScore =
    players.reduce((sum, player) => sum + player.emotionalScore, 0) / Math.max(1, players.length)
  const intensityInfo = getIntensityLevel(averageEmotionalScore)

  return (
    <div className="space-y-6">
      {/* Group Stats Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-amber-500" />
              Recompensas del Grupo
            </CardTitle>
            <div
              className="rounded-lg overflow-hidden p-1"
              style={{ backgroundColor: brandInfo.themeColor || "#f3f4f6" }}
            >
              <img
                src={brandInfo.logo || "/placeholder.svg?height=30&width=80&text=Brand"}
                alt={brandInfo.name || "Brand"}
                className="h-6 object-contain"
              />
            </div>
          </div>
          <CardDescription>Resumen de todas las recompensas ganadas por el grupo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-blue-600 font-medium">Jugadores</p>
              <p className="text-2xl font-bold text-blue-700">{players.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-sm text-purple-600 font-medium">Retos</p>
              <p className="text-2xl font-bold text-purple-700">{totalCompletedCards}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-sm text-amber-600 font-medium">Recompensas</p>
              <p className="text-2xl font-bold text-amber-700">{totalRewards}</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-muted-foreground">Intensidad emocional promedio:</p>
              <p className={`text-sm font-medium ${intensityInfo.color}`}>{intensityInfo.label}</p>
            </div>
            <Progress
              value={averageEmotionalScore}
              className={`h-2 ${
                averageEmotionalScore < 40 ? "bg-blue-500" : averageEmotionalScore < 70 ? "bg-purple-500" : "bg-red-500"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {players.map((player) => (
              <Button
                key={player.id}
                variant={selectedPlayer?.id === player.id ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setSelectedPlayer(player)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={player.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <span>{player.name}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {player.rewards.length}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Player Rewards */}
      {selectedPlayer && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-purple-500" />
                Recompensas de {selectedPlayer.name}
              </CardTitle>
              <Badge className={`${getTierColor(selectedPlayer.tier)} text-white`}>{selectedPlayer.tier}</Badge>
            </div>
            <CardDescription>
              Nivel emocional: {selectedPlayer.emotionalScore}% | Retos completados:{" "}
              {selectedPlayer.completedCards.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Todos ({selectedPlayer.rewards.length})</TabsTrigger>
                <TabsTrigger value="digital">
                  Digital ({selectedPlayer.rewards.filter((r) => r.type === "digital").length})
                </TabsTrigger>
                <TabsTrigger value="physical">
                  Físico ({selectedPlayer.rewards.filter((r) => r.type === "physical").length})
                </TabsTrigger>
                <TabsTrigger value="experience">
                  Experiencia ({selectedPlayer.rewards.filter((r) => r.type === "experience").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4 space-y-4">
                {selectedPlayer.rewards.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 pb-6 text-center">
                      <Gift className="mx-auto h-12 w-12 text-gray-300" />
                      <p className="mt-2 text-gray-500">
                        {selectedPlayer.name} aún no tiene recompensas. ¡Completa retos para ganarlas!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  selectedPlayer.rewards.map((reward) => (
                    <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="digital" className="mt-4 space-y-4">
                {selectedPlayer.rewards.filter((r) => r.type === "digital").length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 pb-6 text-center">
                      <p className="text-gray-500">No hay recompensas digitales.</p>
                    </CardContent>
                  </Card>
                ) : (
                  selectedPlayer.rewards
                    .filter((r) => r.type === "digital")
                    .map((reward) => <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />)
                )}
              </TabsContent>

              <TabsContent value="physical" className="mt-4 space-y-4">
                {selectedPlayer.rewards.filter((r) => r.type === "physical").length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 pb-6 text-center">
                      <p className="text-gray-500">No hay recompensas físicas.</p>
                    </CardContent>
                  </Card>
                ) : (
                  selectedPlayer.rewards
                    .filter((r) => r.type === "physical")
                    .map((reward) => <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />)
                )}
              </TabsContent>

              <TabsContent value="experience" className="mt-4 space-y-4">
                {selectedPlayer.rewards.filter((r) => r.type === "experience").length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 pb-6 text-center">
                      <p className="text-gray-500">No hay recompensas de experiencia.</p>
                    </CardContent>
                  </Card>
                ) : (
                  selectedPlayer.rewards
                    .filter((r) => r.type === "experience")
                    .map((reward) => <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />)
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={onClose}>
              Volver al Juego
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* All Group Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-green-500" />
            Todas las Recompensas del Grupo
          </CardTitle>
          <CardDescription>Recompensas ganadas por todos los jugadores</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos ({allRewards.length})</TabsTrigger>
              <TabsTrigger value="digital">Digital ({digitalRewards.length})</TabsTrigger>
              <TabsTrigger value="physical">Físico ({physicalRewards.length})</TabsTrigger>
              <TabsTrigger value="experience">Experiencia ({experienceRewards.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-4">
              {allRewards.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-6 text-center">
                    <Gift className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2 text-gray-500">
                      El grupo aún no tiene recompensas. ¡Completen retos para ganarlas!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                allRewards.map((reward) => <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />)
              )}
            </TabsContent>

            <TabsContent value="digital" className="mt-4 space-y-4">
              {digitalRewards.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-gray-500">No hay recompensas digitales.</p>
                  </CardContent>
                </Card>
              ) : (
                digitalRewards.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />
                ))
              )}
            </TabsContent>

            <TabsContent value="physical" className="mt-4 space-y-4">
              {physicalRewards.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-gray-500">No hay recompensas físicas.</p>
                  </CardContent>
                </Card>
              ) : (
                physicalRewards.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />
                ))
              )}
            </TabsContent>

            <TabsContent value="experience" className="mt-4 space-y-4">
              {experienceRewards.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-6 text-center">
                    <p className="text-gray-500">No hay recompensas de experiencia.</p>
                  </CardContent>
                </Card>
              ) : (
                experienceRewards.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Redeem Dialog */}
      <Dialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Canjear Recompensa</DialogTitle>
            <DialogDescription>Muestra este código QR para canjear tu recompensa.</DialogDescription>
          </DialogHeader>

          {redeemError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{redeemError}</AlertDescription>
            </Alert>
          )}

          {selectedReward && (
            <div className="flex flex-col items-center py-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={`https://lacortesia.app/redeem/${selectedReward.id}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mt-4 text-center">
                <h3 className="font-medium">{selectedReward.name}</h3>
                <p className="text-sm text-gray-500">{selectedReward.description}</p>

                {selectedReward.brandName && (
                  <Badge variant="outline" className="mt-2">
                    {selectedReward.brandName}
                  </Badge>
                )}

                <p className="mt-2 text-xs text-gray-400">Expira: {formatDate(selectedReward.expiryDate)}</p>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setRedeemDialogOpen(false)}>
              Cerrar
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                // Mark as redeemed in a real app
                setRedeemDialogOpen(false)
              }}
            >
              <Share className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface RewardCardProps {
  reward: RewardType
  onRedeem: (reward: RewardType) => void
}

function RewardCard({ reward, onRedeem }: RewardCardProps) {
  const getRewardIcon = () => {
    switch (reward.type) {
      case "digital":
        return <Gift className="h-5 w-5 text-purple-500" />
      case "physical":
        return <CreditCard className="h-5 w-5 text-blue-500" />
      case "experience":
        return <Calendar className="h-5 w-5 text-amber-500" />
      default:
        return <Award className="h-5 w-5 text-gray-500" />
    }
  }

  const getTierBadge = () => {
    switch (reward.tier) {
      case "advanced":
        return <Badge className="bg-red-500 text-white">Avanzado</Badge>
      case "intermediate":
        return <Badge className="bg-purple-500 text-white">Intermedio</Badge>
      default:
        return <Badge className="bg-blue-500 text-white">Básico</Badge>
    }
  }

  return (
    <Card className={reward.redeemed ? "opacity-70" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getRewardIcon()}
            <CardTitle className="ml-2 text-lg">{reward.name}</CardTitle>
          </div>
          <div className="flex flex-col items-end gap-1">
            {getTierBadge()}
            <Badge variant={reward.redeemed ? "outline" : "default"} className="ml-auto">
              {reward.redeemed ? "Canjeado" : "Disponible"}
            </Badge>
          </div>
        </div>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-500">
              Expira: {reward.expiryDate ? new Date(reward.expiryDate).toLocaleDateString() : "No expira"}
            </span>
          </div>

          {reward.brandName && <Badge variant="outline">{reward.brandName}</Badge>}
        </div>

        {reward.image && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img src={reward.image || "/placeholder.svg"} alt={reward.name} className="w-full h-32 object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={reward.redeemed} onClick={() => onRedeem(reward)}>
          {reward.redeemed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Canjeado
            </>
          ) : (
            <>
              <QrCode className="mr-2 h-4 w-4" />
              Canjear Recompensa
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
