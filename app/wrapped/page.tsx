"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WrappedExperience } from "@/components/wrapped-experience"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function WrappedPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string>("")
  const [userName, setUserName] = useState<string>("")

  useEffect(() => {
    // En una implementación real, obtendríamos el ID del usuario de la sesión
    // Por ahora, usamos un ID de ejemplo
    setUserId("user_123")
    setUserName("Usuario de La Cortesía")
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.push("/")} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">Tu Wrapped de La Cortesía</h1>
      </div>

      <div className="flex flex-col items-center justify-center">
        <WrappedExperience userId={userId} userName={userName} />
      </div>
    </div>
  )
}
