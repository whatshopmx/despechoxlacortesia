/**
 * Servicio para manejar efectos de sonido en la aplicación
 */

// Tipos de efectos de sonido disponibles
export type SoundEffect =
  | "success"
  | "error"
  | "click"
  | "card_flip"
  | "challenge_complete"
  | "reward"
  | "social_trigger"
  | "vote"
  | "camera"
  | "countdown"
  | "magic"
  | "level_up"
  | "combo"
  | "notification"

// Mapeo de efectos de sonido a archivos
const SOUND_EFFECTS: Record<SoundEffect, string> = {
  success: "/sounds/success.mp3",
  error: "/sounds/error.mp3",
  click: "/sounds/click.mp3",
  card_flip: "/sounds/card_flip.mp3",
  challenge_complete: "/sounds/challenge_complete.mp3",
  reward: "/sounds/reward.mp3",
  social_trigger: "/sounds/social_trigger.mp3",
  vote: "/sounds/vote.mp3",
  camera: "/sounds/camera.mp3",
  countdown: "/sounds/countdown.mp3",
  magic: "/sounds/magic.mp3",
  level_up: "/sounds/level_up.mp3",
  combo: "/sounds/combo.mp3",
  notification: "/sounds/notification.mp3",
}

// Clase para manejar los efectos de sonido
class SoundEffectsManager {
  private audioElements: Map<SoundEffect, HTMLAudioElement> = new Map()
  private muted = false
  private volume = 0.7

  constructor() {
    // Precargar efectos de sonido comunes
    this.preloadSounds(["click", "success", "error"])
  }

  // Precargar sonidos para uso posterior
  preloadSounds(effects: SoundEffect[]): void {
    effects.forEach((effect) => {
      if (!this.audioElements.has(effect)) {
        try {
          const audio = new Audio(SOUND_EFFECTS[effect])
          audio.preload = "auto"
          this.audioElements.set(effect, audio)
        } catch (error) {
          console.error(`Error preloading sound effect ${effect}:`, error)
        }
      }
    })
  }

  // Reproducir un efecto de sonido
  play(effect: SoundEffect): void {
    if (this.muted) return

    try {
      let audio = this.audioElements.get(effect)

      // Si el audio no está precargado, crearlo
      if (!audio) {
        audio = new Audio(SOUND_EFFECTS[effect])
        this.audioElements.set(effect, audio)
      }

      // Reiniciar el audio si ya estaba reproduciéndose
      audio.currentTime = 0
      audio.volume = this.volume

      // Reproducir el sonido
      audio.play().catch((error) => {
        console.error(`Error playing sound effect ${effect}:`, error)
      })
    } catch (error) {
      console.error(`Error with sound effect ${effect}:`, error)
    }
  }

  // Silenciar/activar todos los sonidos
  toggleMute(): boolean {
    this.muted = !this.muted
    return this.muted
  }

  // Establecer si los sonidos están silenciados
  setMuted(muted: boolean): void {
    this.muted = muted
  }

  // Obtener el estado de silencio
  isMuted(): boolean {
    return this.muted
  }

  // Establecer el volumen (0.0 a 1.0)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // Obtener el volumen actual
  getVolume(): number {
    return this.volume
  }

  // Detener todos los sonidos
  stopAll(): void {
    this.audioElements.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }
}

// Exportar una instancia única (singleton)
export const soundEffects = new SoundEffectsManager()

// Función de ayuda para reproducir un sonido fácilmente
export function playSound(effect: SoundEffect): void {
  soundEffects.play(effect)
}
