/**
 * Brinda Emotional Engine
 *
 * This file implements the core emotional framework from the Brinda X specification.
 * It provides utilities for generating emotionally-charged content and experiences.
 */

// Core Emotions
export enum CoreEmotion {
  DESPECHO = "despecho",
  TRISTEZA = "tristeza",
  RABIA = "rabia",
  AUTOENGANO = "autoengano",
  MISTICISMO = "misticismo",
}

// Emotional Intensity Levels
export enum EmotionalIntensity {
  MILD = 1,
  MODERATE = 2,
  MEDIUM = 3,
  INTENSE = 4,
  CHAOTIC = 5,
}

// Challenge Types
export enum ChallengeType {
  VERBAL = "verbal",
  PHYSICAL = "physical",
  CREATIVE = "creative",
  SOCIAL = "social",
  DIGITAL = "digital",
}

// Visual Styles
export enum VisualStyle {
  LOTERIA_VINTAGE = "loteria_vintage",
  NEON = "neon",
  MEME = "meme",
  CORPORATIVO = "corporativo",
  Y2K = "y2k",
  CHISMOGRAFO = "chismografo",
  TAROT = "tarot",
  SCREENSHOTS = "screenshots",
}

// Reward Types
export enum RewardType {
  PHYSICAL = "physical",
  DIGITAL = "digital",
  EXPERIENTIAL = "experiential",
}

// Subemotions by Core Emotion
export const SUBEMOTIONS: Record<CoreEmotion, string[]> = {
  [CoreEmotion.DESPECHO]: ["celos", "envidia_amorosa", "revancha", "nostalgia_dolida"],
  [CoreEmotion.TRISTEZA]: ["melancolia", "soledad", "duelo_ridiculo"],
  [CoreEmotion.RABIA]: ["ardidez", "venganza", "frustracion_performatica"],
  [CoreEmotion.AUTOENGANO]: ["justificacion_ridicula", "positivismo_toxico"],
  [CoreEmotion.MISTICISMO]: ["karma_romantico", "rituales_caseros"],
}

// Card Parameters Interface
export interface CardParameters {
  coreEmotion: CoreEmotion
  subemotion?: string
  intensity: EmotionalIntensity
  challengeType: ChallengeType
  visualStyle: VisualStyle
  culturalReferences?: string[]
  brandId?: string
}

// Reward Parameters Interface
export interface RewardParameters {
  type: RewardType
  intensity: EmotionalIntensity
  brandId?: string
  venueId?: string
}

/**
 * Generates a challenge based on emotional parameters
 */
export function generateChallenge(params: CardParameters): string {
  // This would be replaced with actual logic from the Brinda X specification
  // For now, we'll return placeholder challenges based on emotion and intensity

  const challenges: Record<CoreEmotion, Record<EmotionalIntensity, string>> = {
    [CoreEmotion.DESPECHO]: {
      [EmotionalIntensity.MILD]:
        "Comparte la indirecta más obvia que has publicado en redes esperando que tu ex la viera.",
      [EmotionalIntensity.MODERATE]:
        "Dramatiza el último mensaje que enviaste a alguien que te dejó en visto para siempre.",
      [EmotionalIntensity.MEDIUM]: "Muestra y narra el chat o mensaje más intenso que mandaste en pleno despecho.",
      [EmotionalIntensity.INTENSE]: "Canta el coro de LA canción que escuchabas en repeat durante tu peor ruptura.",
      [EmotionalIntensity.CHAOTIC]:
        "Confiesa con lujo de detalles cuántas cuentas falsas has creado para ver stories de ex.",
    },
    [CoreEmotion.TRISTEZA]: {
      [EmotionalIntensity.MILD]: "Describe un momento triste que ahora te hace reír.",
      [EmotionalIntensity.MODERATE]: "Comparte la canción que te hace llorar sin razón aparente.",
      [EmotionalIntensity.MEDIUM]: "Cuenta la historia de tu peor ruptura en exactamente tres frases.",
      [EmotionalIntensity.INTENSE]: "Recrea la reacción exacta que tuviste en tu momento más vulnerable.",
      [EmotionalIntensity.CHAOTIC]: "Revela sin filtros el mensaje que nunca enviaste pero escribiste mil veces.",
    },
    [CoreEmotion.RABIA]: {
      [EmotionalIntensity.MILD]: "Comparte algo que te molesta pero que todos parecen amar.",
      [EmotionalIntensity.MODERATE]: "Describe la 'red flag' más obvia que ignoraste al principio de una relación.",
      [EmotionalIntensity.MEDIUM]: "Cuenta la historia de la persona que bloqueaste y desbloqueaste más veces.",
      [EmotionalIntensity.INTENSE]: "Actúa como si estuvieras reclamándole algo a tu ex frente a todos.",
      [EmotionalIntensity.CHAOTIC]: "Expón dramáticamente la venganza que planeaste pero nunca ejecutaste.",
    },
    [CoreEmotion.AUTOENGANO]: {
      [EmotionalIntensity.MILD]: "Comparte una mentira piadosa que te dices a ti mismo.",
      [EmotionalIntensity.MODERATE]: "Describe una situación donde te convenciste de algo que no era cierto.",
      [EmotionalIntensity.MEDIUM]: "Confiesa algo que te niegas a aceptar aunque todos te lo dicen.",
      [EmotionalIntensity.INTENSE]: "Recrea una conversación donde te justificaste de manera ridícula.",
      [EmotionalIntensity.CHAOTIC]: "Revela sin filtros la mayor mentira que te has dicho a ti mismo.",
    },
    [CoreEmotion.MISTICISMO]: {
      [EmotionalIntensity.MILD]: "Comparte un ritual extraño que haces para la buena suerte.",
      [EmotionalIntensity.MODERATE]:
        "Describe el ritual más extraño que has hecho para deshacerte de recuerdos de tu ex.",
      [EmotionalIntensity.MEDIUM]: "Cuenta una coincidencia que te hizo creer en el destino.",
      [EmotionalIntensity.INTENSE]: "Actúa como si estuvieras haciendo un ritual para olvidar a alguien.",
      [EmotionalIntensity.CHAOTIC]: "Revela sin filtros el objeto más ridículo que has guardado por 'energía'.",
    },
  }

  return challenges[params.coreEmotion][params.intensity] || "Cuenta una historia que nunca le has contado a nadie."
}

/**
 * Generates a social trigger based on emotional parameters
 */
export function generateSocialTrigger(params: CardParameters): string {
  // This would be replaced with actual logic from the Brinda X specification
  // For now, we'll return placeholder social triggers

  const triggers = [
    "Si alguien confiesa haber hecho lo mismo que te hicieron a ti, ambos ganan la cortesía.",
    "Si logras que al menos dos personas digan 'yo hubiera hecho lo mismo', desbloqueas la cortesía.",
    "Si el grupo vota que tu experiencia es la más dramática, ganas la cortesía.",
    "Si alguien del grupo admite haber reaccionado a alguna de tus indirectas, ambos toman.",
    "Si tienes el récord del rebote más rápido del grupo, todos deben aplaudirte de pie.",
    "Si alguien dice 'yo bloquearía por menos', ganas la cortesía.",
    "Si logras que alguien derrame una lágrima (de risa o emoción), desbloqueas la cortesía.",
  ]

  // Modify based on intensity
  let trigger = triggers[Math.floor(Math.random() * triggers.length)]

  if (params.intensity === EmotionalIntensity.MILD) {
    trigger = trigger.replace("dos personas", "una persona")
    trigger = trigger.replace("la mayoría", "al menos una persona")
  }

  if (params.intensity === EmotionalIntensity.CHAOTIC) {
    trigger = trigger.replace("dos personas", "la mayoría del grupo")
    trigger = trigger.replace("alguien", "al menos tres personas")
  }

  return trigger
}

/**
 * Generates a reward based on emotional parameters
 */
export function generateReward(params: RewardParameters): string {
  // This would be replaced with actual logic from the Brinda X specification
  // For now, we'll return placeholder rewards based on intensity

  const rewards = [
    "1x Trago del Olvido Digital (para borrar la vergüenza)",
    "Premio Telenovela: Un brindis dedicado y todos deben llamarte 'Doña/Don' el resto de la noche",
    "Inmunidad Kármica: Todos brindan a tu salud y prometen no cruzarte jamás",
    "Tratamiento VIP: El grupo debe conseguirte el número de alguien en la fiesta",
    "Ritual Purificador: Todos levantan sus vasos y gritan 'NEXT!' mientras tú tomas",
    "Bono Nostálgico: Un shot dedicado a los recuerdos que no sirven pero no soltamos",
    "Minuto Musical: Puedes poner la canción que quieras y todos deben bailarla",
  ]

  let reward = rewards[Math.floor(Math.random() * rewards.length)]

  // Modify based on intensity
  if (params.intensity === EmotionalIntensity.CHAOTIC) {
    reward = reward.replace("Un shot", "Un shot doble")
    reward = reward.replace("brindis", "brindis ceremonial")
  }

  // Add brand if available
  if (params.brandId) {
    reward += ` (cortesía de ${params.brandId})`
  }

  return reward
}

/**
 * Generates a card title based on emotional parameters
 */
export function generateCardTitle(params: CardParameters): string {
  // This would be replaced with actual logic from the Brinda X specification
  // For now, we'll return placeholder titles based on emotion

  const titles: Record<CoreEmotion, string[]> = {
    [CoreEmotion.DESPECHO]: [
      "El Ex-Texter",
      "Ghosteado en Visto",
      "El Stalking Terapéutico",
      "Mensaje Borracho Premium",
      "La Playlist del Despecho",
    ],
    [CoreEmotion.TRISTEZA]: [
      "Corazón en Reconstrucción",
      "Lágrimas al Ritmo",
      "El Último Mensaje",
      "La Libreta de Rencores",
      "Memoria Selectiva",
    ],
    [CoreEmotion.RABIA]: [
      "El Arte de la Venganza",
      "Contactos Bloqueados S.A.",
      "El Detector de Banderas Rojas",
      "La Excusa Perfecta",
      "El Testamento Emocional",
    ],
    [CoreEmotion.AUTOENGANO]: [
      "El Sobrepienso",
      "La Friendzone Eterna",
      "El Cambio Post-Ruptura",
      "La Coincidencia Incómoda",
      "Mensajes Archivados",
    ],
    [CoreEmotion.MISTICISMO]: [
      "Fantasmas del Pasado",
      "El Soundtrack del Amor",
      "La Confesión Virtual",
      "Recuerdos Digitales",
      "El Maratón de Lágrimas",
    ],
  }

  const emotionTitles = titles[params.coreEmotion]
  return emotionTitles[Math.floor(Math.random() * emotionTitles.length)]
}

/**
 * Integrates with the existing card generator pipeline
 */
export function generateEmotionalCard(params: CardParameters) {
  return {
    card_title: generateCardTitle(params),
    challenge: generateChallenge(params),
    emotional_tier: params.intensity <= 2 ? "mild" : params.intensity >= 4 ? "chaotic" : "intense",
    theme_tag: params.coreEmotion,
    spotify_song: {
      title: "Placeholder Song",
      artist: "Placeholder Artist",
    },
    sticker: "Corazón Roto",
    reward: generateReward({
      type: RewardType.PHYSICAL,
      intensity: params.intensity,
      brandId: params.brandId,
    }),
    reward_type: "product",
    social_trigger: generateSocialTrigger(params),
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
  }
}
