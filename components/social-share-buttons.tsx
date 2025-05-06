"use client"

import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Twitter, Copy, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface SocialShareButtonsProps {
  url: string
  title: string
  caption?: string
}

export function SocialShareButtons({ url, title, caption }: SocialShareButtonsProps) {
  const { toast } = useToast()

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace ha sido copiado al portapapeles.",
      duration: 3000,
    })

    // Reproducir sonido
    playSound("click")
  }

  // Función para compartir en redes sociales
  const shareToSocial = (platform: string) => {
    let shareUrl = ""
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedCaption = caption ? encodeURIComponent(caption) : ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        break
      case "instagram":
        // Instagram no tiene una API de compartir directa, mostramos un toast con instrucciones
        toast({
          title: "Compartir en Instagram",
          description: "Descarga la imagen y súbela a tu historia de Instagram.",
          duration: 5000,
        })
        return
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`
        break
      default:
        return
    }

    // Abrir ventana para compartir
    window.open(shareUrl, "_blank", "width=600,height=400")

    // Reproducir sonido
    playSound("click")

    // Mostrar toast de confirmación
    toast({
      title: `Compartiendo en ${platform}`,
      description: "Se ha abierto una ventana para compartir.",
      duration: 3000,
    })
  }

  // Función para reproducir sonidos
  const playSound = (soundType: "success" | "error" | "click") => {
    // En una implementación real, esto reproduciría un archivo de audio
    console.log(`Reproduciendo sonido: ${soundType}`)
  }

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg border">
      <h3 className="text-sm font-medium mb-3">Compartir en:</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 bg-[#1877F2] text-white hover:bg-[#0E65D9] hover:text-white"
            onClick={() => shareToSocial("facebook")}
          >
            <Facebook className="h-4 w-4" />
            <span className="hidden sm:inline">Facebook</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90 hover:text-white"
            onClick={() => shareToSocial("instagram")}
          >
            <Instagram className="h-4 w-4" />
            <span className="hidden sm:inline">Instagram</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 bg-[#1DA1F2] text-white hover:bg-[#0C85D0] hover:text-white"
            onClick={() => shareToSocial("twitter")}
          >
            <Twitter className="h-4 w-4" />
            <span className="hidden sm:inline">Twitter</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] hover:text-white"
            onClick={() => shareToSocial("whatsapp")}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" className="w-full flex items-center gap-2" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Copiar</span>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
