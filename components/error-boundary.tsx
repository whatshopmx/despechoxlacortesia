"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught error:", error)
      setError(error.error || new Error("An unknown error occurred"))
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Algo salió mal</h2>
          <p className="text-gray-600 text-center mb-6">
            Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recargar página
            </Button>
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
          {error && (
            <div className="mt-6 p-3 bg-gray-100 rounded-md text-xs text-gray-600 overflow-auto max-h-32">
              <p className="font-medium">Detalles del error:</p>
              <p className="mt-1">{error.message}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{children}</>
}
