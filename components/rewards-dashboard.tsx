"use client"

import { useState } from "react"
import { useChallenge, type RewardType } from "@/contexts/challenge-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Gift, Calendar, CreditCard, QrCode, Share, Check, AlertCircle } from "lucide-react"
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

export function RewardsDashboard() {
  const { rewards, emotionalIntensity } = useChallenge()
  const [selectedReward, setSelectedReward] = useState<RewardType | null>(null)
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false)
  const [redeemError, setRedeemError] = useState<string | null>(null)

  // Filter rewards by type
  const digitalRewards = rewards.filter((reward) => reward.type === "digital")
  const physicalRewards = rewards.filter((reward) => reward.type === "physical")
  const experienceRewards = rewards.filter((reward) => reward.type === "experience")

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

  const intensityInfo = getIntensityLevel(emotionalIntensity)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Tu Nivel Emocional
          </CardTitle>
          <CardDescription>
            Tu nivel emocional determina la calidad de las recompensas que puedes obtener
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nivel actual:</p>
              <p className={`text-2xl font-bold ${intensityInfo.color}`}>{intensityInfo.label}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Intensidad:</p>
              <p className="text-2xl font-bold">{emotionalIntensity}%</p>
            </div>
          </div>

          <div className="mt-4 h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                emotionalIntensity < 40 ? "bg-blue-500" : emotionalIntensity < 70 ? "bg-purple-500" : "bg-red-500"
              }`}
              style={{ width: `${emotionalIntensity}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Suave</span>
            <span>Intenso</span>
            <span>Caótico</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos ({rewards.length})</TabsTrigger>
          <TabsTrigger value="digital">Digital ({digitalRewards.length})</TabsTrigger>
          <TabsTrigger value="physical">Físico ({physicalRewards.length})</TabsTrigger>
          <TabsTrigger value="experience">Experiencia ({experienceRewards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-4">
          {rewards.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <Gift className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">Aún no tienes recompensas. ¡Completa retos para ganarlas!</p>
              </CardContent>
            </Card>
          ) : (
            rewards.map((reward) => <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />)
          )}
        </TabsContent>

        <TabsContent value="digital" className="mt-4 space-y-4">
          {digitalRewards.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-500">No tienes recompensas digitales.</p>
              </CardContent>
            </Card>
          ) : (
            digitalRewards.map((reward) => <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />)
          )}
        </TabsContent>

        <TabsContent value="physical" className="mt-4 space-y-4">
          {physicalRewards.length === 0 ? (
            <Card>
              <CardContent className="pt-6 pb-6 text-center">
                <p className="text-gray-500">No tienes recompensas físicas.</p>
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
                <p className="text-gray-500">No tienes recompensas de experiencia.</p>
              </CardContent>
            </Card>
          ) : (
            experienceRewards.map((reward) => (
              <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeemReward} />
            ))
          )}
        </TabsContent>
      </Tabs>

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

  return (
    <Card className={reward.redeemed ? "opacity-70" : ""}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {getRewardIcon()}
            <CardTitle className="ml-2 text-lg">{reward.name}</CardTitle>
          </div>
          <Badge variant={reward.redeemed ? "outline" : "default"}>{reward.redeemed ? "Canjeado" : "Disponible"}</Badge>
        </div>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-500">
              Expira: {new Date(reward.expiryDate || Date.now()).toLocaleDateString()}
            </span>
          </div>

          {reward.brandName && <Badge variant="outline">{reward.brandName}</Badge>}
        </div>
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
