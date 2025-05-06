"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Volume2, VolumeX } from "lucide-react"
import { soundEffects } from "@/services/sound-effects"
import { motion } from "framer-motion"

interface SoundControlsProps {
  className?: string
}

export function SoundControls({ className }: SoundControlsProps) {
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // Sincronizar estado con el servicio de sonido
  useEffect(() => {
    setMuted(soundEffects.isMuted())
    setVolume(soundEffects.getVolume())
  }, [])

  // Manejar cambio de estado de silencio
  const handleToggleMute = () => {
    const newMutedState = soundEffects.toggleMute()
    setMuted(newMutedState)
  }

  // Manejar cambio de volumen
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    soundEffects.setVolume(newVolume)

    // Si el volumen es 0, silenciar; si no, activar el sonido
    if (newVolume === 0 && !muted) {
      soundEffects.setMuted(true)
      setMuted(true)
    } else if (newVolume > 0 && muted) {
      soundEffects.setMuted(false)
      setMuted(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleMute}
        onMouseEnter={() => setShowVolumeSlider(true)}
        className="relative z-10"
      >
        {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>

      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: showVolumeSlider ? 1 : 0,
          width: showVolumeSlider ? 100 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-10 top-1/2 -translate-y-1/2 bg-background border rounded-full px-3 py-1 z-0"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <Slider value={[volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-full" />
      </motion.div>
    </div>
  )
}
