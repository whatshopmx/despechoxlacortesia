"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface GroupSidebarProps {
  currentPlayer: Player
  players: Player[]
  brandInfo: BrandInfo
  onPlayerChange: (playerId: string) => void
  remainingTime: number
  onShowRewards: () => void
}

interface Player {
  id: string
  name: string
  avatar?: string
  tier: "basic" | "intermediate" | "advanced"
  completedCards: string[]
  emotionalScore: number
  currentTurn: boolean
}

interface BrandInfo {
  name: string
  logo: string
  themeColor: string
}

export function GroupSidebar({
  currentPlayer,
  players,
  brandInfo,
  onPlayerChange,
  remainingTime,
  onShowRewards,
}: GroupSidebarProps) {
  const [expanded, setExpanded] = useState(true)

  // Helper to get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "bg-blue-500"
      case "intermediate":
        return "bg-purple-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Calculate total time
  const totalTime = 60 // 60 seconds per turn
  const timePercentage = (remainingTime / totalTime) * 100

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar side="left" variant="floating" className="border-r">
        <SidebarHeader className="py-4">
          <div className="flex items-center justify-center mb-4">
            <div
              className="rounded-lg overflow-hidden p-2"
              style={{ backgroundColor: brandInfo.themeColor || "#f3f4f6" }}
            >
              <img
                src={brandInfo.logo || "/placeholder.svg?height=40&width=120&text=Brand"}
                alt={brandInfo.name || "Brand"}
                className="h-10 object-contain"
              />
            </div>
          </div>
          <div className="flex justify-between items-center px-4">
            <h2 className="font-semibold text-lg">Jugadores</h2>
            <Badge variant="outline" className="flex gap-1 items-center">
              <Users size={14} />
              {players.length}
            </Badge>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Turno Actual</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3 p-2">
                <div className="flex items-center gap-3">
                  <Avatar className={`border-2 ${currentPlayer.currentTurn ? "border-primary" : "border-transparent"}`}>
                    <AvatarImage
                      src={currentPlayer.avatar || `/placeholder.svg?height=40&width=40&text=${currentPlayer.name[0]}`}
                    />
                    <AvatarFallback>{currentPlayer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{currentPlayer.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getTierColor(currentPlayer.tier)} text-white`}>{currentPlayer.tier}</Badge>
                      <span className="text-xs text-muted-foreground">{currentPlayer.completedCards.length} retos</span>
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> Tiempo restante
                    </span>
                    <span>{Math.floor(remainingTime)}s</span>
                  </div>
                  <Progress
                    value={timePercentage}
                    className={`h-1.5 ${timePercentage < 30 ? "bg-red-500" : "bg-blue-500"}`}
                  />
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Todos Los Jugadores</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {players.map((player) => (
                  <SidebarMenuItem key={player.id}>
                    <SidebarMenuButton
                      onClick={() => onPlayerChange(player.id)}
                      isActive={player.id === currentPlayer.id}
                      className="flex justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{player.name}</span>
                      </div>
                      {player.currentTurn && (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Turno
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className="px-4 py-2">
            <div className="bg-muted/50 p-2 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Recompensas grupales</h4>
              <div className="flex gap-2 flex-wrap mb-2">
                {["Básico", "Intermedio", "Avanzado"].map((tier, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    {tier}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2" onClick={onShowRewards}>
                <Award className="h-3 w-3 mr-1" />
                Ver Todas las Recompensas
              </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
