"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, ArrowRight, Loader2 } from "lucide-react"

export default function JoinGroupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("id")

  const [playerName, setPlayerName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [sessionInfo, setSessionInfo] = useState<{
    id: string
    name: string
    host: string
    players: { id: string; name: string; avatar?: string }[]
    brandInfo: { name: string; logo: string }
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch session info
  useEffect(() => {
    if (!sessionId) {
      setError("ID de sesión no válido")
      setIsLoading(false)
      return
    }

    // Simulate API call to get session info
    setTimeout(() => {
      // In a real app, this would be an API call
      setSessionInfo({
        id: sessionId,
        name: "Sesión de Despecho",
        host: "Ana",
        players: [
          { id: "user_001", name: "Ana", avatar: "/placeholder.svg?height=40&width=40&text=A" },
          { id: "user_002", name: "Carlos", avatar: "/placeholder.svg?height=40&width=40&text=C" },
        ],
        brandInfo: {
          name: "Tecate",
          logo: "/placeholder.svg?height=40&width=120&text=Tecate",
        },
      })
      setIsLoading(false)
    }, 1500)
  }, [sessionId])

  const handleJoin = () => {
    if (!playerName.trim()) return

    setIsLoading(true)

    // Simulate joining the session
    setTimeout(() => {
      router.push(`/experience/social/group?id=${sessionId}`)
    }, 1000)
  }

  if (isLoading && !sessionInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">Cargando información de la sesión...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
            <CardDescription className="text-center">{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/experience")}>
              Volver al Inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!sessionInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sesión no encontrada</CardTitle>
            <CardDescription className="text-center">
              La sesión que intentas unirte no existe o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/experience")}>
              Volver al Inicio
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <img
              src={sessionInfo.brandInfo.logo || "/placeholder.svg"}
              alt={sessionInfo.brandInfo.name}
              className="h-10 object-contain"
            />
          </div>
          <CardTitle className="text-center">Unirse a la Sesión</CardTitle>
          <CardDescription className="text-center">
            Estás a punto de unirte a la sesión "{sessionInfo.name}" creada por {sessionInfo.host}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Jugadores en la sesión</h3>
              <div className="bg-primary-50 rounded-full px-2 py-1 flex items-center">
                <Users size={16} className="mr-1 text-primary" />
                <span className="text-sm font-medium">{sessionInfo.players.length}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {sessionInfo.players.map((player) => (
                <div key={player.id} className="flex items-center gap-2 bg-background rounded-full px-3 py-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{player.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="player-name">Tu nombre</Label>
            <Input
              id="player-name"
              placeholder="Ingresa tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleJoin} disabled={!playerName.trim() || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uniéndose...
              </>
            ) : (
              <>
                Unirse a la Sesión
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
