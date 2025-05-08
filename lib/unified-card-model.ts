/**
 * Modelo Unificado de Cartas para La Cortesía
 *
 * Este modelo se utiliza en todas las experiencias: campañas, multimesas y grupal.
 */

import type { CoreEmotion, EmotionalIntensity, VisualStyle } from "./brinda-emotional-engine"

// Tipos de experiencia
export type ExperienceType = "campaign" | "multi_table" | "group" | "individual"

// Tipos de verificación
export type VerificationType = "self" | "group" | "ai" | "photo" | "audio" | "none"

// Tipos de reto
export type ChallengeType = "individual" | "duet" | "group"

// Tipos de recompensa
export type RewardType = "shot" | "discount" | "zerosum_card" | "product" | "sticker" | "combo" | "experience"

// Categorías de reto (basadas en la lista proporcionada)
export type ChallengeCategory =
  | "karaoke"
  | "visual"
  | "misterioso"
  | "icebreaker"
  | "roleplay"
  | "reflexion"
  | "confesion"
  | "improvisacion"
  | "velocidad"
  | "operatico"
  | "comparacion"
  | "texto"
  | "abstracto"
  | "social"
  | "interpretacion"
  | "eleccion"
  | "teorias"
  | "simbolico"
  | "digital"
  | "creativo"
  | "imitacion"
  | "meme"
  | "redes_sociales"
  | "fotografia"
  | "arte"
  | "prediccion"
  | "destino"
  | "decision"
  | "especulacion"
  | "autoengano"
  | "imaginacion"
  | "familiar"
  | "exposicion"
  | "terapeutico"
  | "transformacion"
  | "dramatizacion"
  | "autoconciencia"
  | "pasivo_agresivo"
  | "vulnerabilidad"
  | "simbolismo"
  | "mensajes"
  | "casualidad"
  | "paranoia"
  | "resumen"
  | "premiacion"
  | "catarsis"
  | "humor"
  | "intimidad"

// Formatos de interacción
export type InteractionFormat =
  | "canto_memoria"
  | "vocal_improvisacion"
  | "canto_tempo"
  | "recitacion_opera"
  | "descripcion_imagen"
  | "descripcion_caption"
  | "descripcion_meme"
  | "lista_concepto"
  | "texto_prediccion"
  | "lista_traduccion"
  | "opcion_sorpresa"
  | "teorias_revelacion"
  | "emojis_interpretacion"
  | "voz_texto"
  | "video_texto"
  | "actuacion_voz"
  | "texto_imagen"
  | "recitacion_lista"

// Subtipos de tono
export type ToneSubtype =
  | "acusatorio"
  | "metalero"
  | "urbano"
  | "confesional"
  | "acelerado"
  | "caotico"
  | "lirico"
  | "fantasmagorico"
  | "revelador"
  | "humoristico"
  | "vengativo"
  | "poetico"
  | "vulnerable"
  | "ironico"
  | "artistico"
  | "aleatorio"
  | "profetico"
  | "sarcastico"
  | "mistico"
  | "comico"
  | "tenso"
  | "conspirativo"
  | "desmitificador"
  | "minimalista"
  | "reflexivo"
  | "viral"
  | "ligero"
  | "cinematografico"
  | "melodramatico"
  | "tradicional"
  | "autentico"

// Modelo unificado de carta
export interface UnifiedCard {
  // Identificadores
  card_id: string
  card_title: string

  // Contenido principal
  challenge: string
  challenge_type: ChallengeType
  challenge_category: ChallengeCategory
  interaction_format: InteractionFormat
  tone_subtype: ToneSubtype

  // Metadatos emocionales
  emotional_tier: "mild" | "intense" | "chaotic"
  core_emotion?: CoreEmotion
  emotional_intensity?: EmotionalIntensity
  visual_style?: VisualStyle

  // Elementos temáticos
  theme_tag: string
  genre_tag: string
  narrative_voice?: string

  // Elementos sociales
  social_trigger: string
  partner_selection?: "random" | "choice" | "none"

  // Verificación
  verification_type: VerificationType
  verification_threshold?: number

  // Recompensas
  reward: string | { descripcion: string; valor: number }
  reward_type: RewardType
  sticker_integration?: string

  // Elementos multimedia
  spotify_song?: {
    title: string
    artist: string
    url?: string
  }
  back_image_url?: string

  // Elementos de marca
  brand_sponsor?: {
    id: string
    name: string
    logo: string
    industry: string
    rewardValue: number
  }

  // Elementos de ayuda
  ai_backup_response?: string

  // Metadatos de experiencia
  experience_type: ExperienceType
  difficulty_level?: "easy" | "medium" | "hard"
  time_limit?: number

  // Elementos de juego
  combo_potential?: string[]
  unlock_condition?: string
}

// Función para convertir cartas antiguas al nuevo formato unificado
export function convertToUnifiedCard(oldCard: any): UnifiedCard {
  // Implementación de la conversión...
  const unifiedCard: UnifiedCard = {
    card_id: oldCard.card_id || `card_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    card_title: oldCard.card_title || "Reto de La Cortesía",
    challenge: oldCard.challenge || "",
    challenge_type: oldCard.challenge_type || "individual",
    challenge_category: mapToChallengeCategory(oldCard),
    interaction_format: mapToInteractionFormat(oldCard),
    tone_subtype: mapToToneSubtype(oldCard),
    emotional_tier: oldCard.emotional_tier || "mild",
    core_emotion: oldCard.core_emotion,
    emotional_intensity: oldCard.emotional_intensity,
    visual_style: oldCard.visual_style,
    theme_tag: oldCard.theme_tag || "",
    genre_tag: oldCard.genre_tag || "",
    narrative_voice: oldCard.narrative_voice,
    social_trigger: oldCard.social_trigger || "",
    partner_selection: oldCard.partner_selection || "none",
    verification_type: oldCard.verification_type || "none",
    verification_threshold: oldCard.verification_threshold,
    reward: oldCard.reward || "",
    reward_type: oldCard.reward_type || "product",
    sticker_integration: oldCard.sticker_integration,
    spotify_song: oldCard.spotify_song,
    back_image_url: oldCard.back_image_url,
    brand_sponsor: oldCard.brand_sponsor,
    ai_backup_response: oldCard.ai_backup_response,
    experience_type: mapToExperienceType(oldCard),
    difficulty_level: oldCard.difficulty_level || "medium",
    time_limit: oldCard.time_limit,
    combo_potential: oldCard.combo_potential,
    unlock_condition: oldCard.unlock_condition,
  }

  return unifiedCard
}

// Funciones auxiliares para mapear propiedades antiguas al nuevo formato
function mapToChallengeCategory(oldCard: any): ChallengeCategory {
  // Lógica para determinar la categoría basada en propiedades antiguas
  if (oldCard.challenge_category) return oldCard.challenge_category as ChallengeCategory

  // Mapeo basado en palabras clave en el reto
  const challenge = oldCard.challenge || ""
  if (challenge.toLowerCase().includes("canta")) return "karaoke"
  if (challenge.toLowerCase().includes("describe")) return "visual"
  if (challenge.toLowerCase().includes("confiesa")) return "confesion"
  if (challenge.toLowerCase().includes("reflexiona")) return "reflexion"

  // Valor por defecto
  return "social"
}

function mapToInteractionFormat(oldCard: any): InteractionFormat {
  if (oldCard.interaction_format) return oldCard.interaction_format as InteractionFormat

  // Mapeo basado en el tipo de reto y otras propiedades
  if (oldCard.challenge_type === "duet") return "actuacion_voz"
  if (oldCard.verification_type === "photo") return "descripcion_imagen"
  if (oldCard.verification_type === "audio") return "voz_texto"

  // Valor por defecto
  return "texto_imagen"
}

function mapToToneSubtype(oldCard: any): ToneSubtype {
  if (oldCard.tone_subtype) return oldCard.tone_subtype as ToneSubtype

  // Mapeo basado en el nivel emocional
  if (oldCard.emotional_tier === "chaotic") return "caotico"
  if (oldCard.emotional_tier === "intense") return "tenso"

  // Valor por defecto
  return "humoristico"
}

function mapToExperienceType(oldCard: any): ExperienceType {
  if (oldCard.experience_type) return oldCard.experience_type as ExperienceType

  // Mapeo basado en otras propiedades
  if (oldCard.challenge_type === "group") return "group"
  if (oldCard.brand_sponsor) return "campaign"

  // Valor por defecto
  return "individual"
}

// Función para generar una carta unificada desde cero
export function generateUnifiedCard(params: {
  experienceType?: ExperienceType
  challengeType?: ChallengeType
  challengeCategory?: ChallengeCategory
  interactionFormat?: InteractionFormat
  toneSubtype?: ToneSubtype
  emotionalTier?: "mild" | "intense" | "chaotic"
  brandId?: string
}): UnifiedCard {
  const {
    experienceType = "individual",
    challengeType = "individual",
    challengeCategory = "social",
    interactionFormat = "texto_imagen",
    toneSubtype = "humoristico",
    emotionalTier = "mild",
    brandId,
  } = params

  // Aquí iría la lógica para generar una carta basada en los parámetros
  // Por ahora, devolvemos una carta de ejemplo

  return {
    card_id: `card_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    card_title: `Reto de ${getCategoryDisplayName(challengeCategory)}`,
    challenge: generateChallengeText(challengeCategory, interactionFormat, toneSubtype),
    challenge_type: challengeType,
    challenge_category: challengeCategory,
    interaction_format: interactionFormat,
    tone_subtype: toneSubtype,
    emotional_tier: emotionalTier,
    theme_tag: `#${challengeCategory}`,
    genre_tag: mapToneToGenre(toneSubtype),
    social_trigger: generateSocialTrigger(challengeCategory, emotionalTier),
    verification_type: mapToVerificationType(interactionFormat),
    reward: generateReward(experienceType, emotionalTier, brandId),
    reward_type: brandId ? "product" : "sticker",
    experience_type: experienceType,
    difficulty_level: mapEmotionalTierToDifficulty(emotionalTier),
    time_limit: challengeType === "group" ? 120 : 60,
  }
}

// Funciones auxiliares para la generación de cartas
function getCategoryDisplayName(category: ChallengeCategory): string {
  const displayNames: Record<ChallengeCategory, string> = {
    karaoke: "Karaoke",
    visual: "Visual",
    misterioso: "Misterio",
    icebreaker: "Rompehielos",
    roleplay: "Roleplay",
    reflexion: "Reflexión",
    confesion: "Confesión",
    improvisacion: "Improvisación",
    velocidad: "Velocidad",
    operatico: "Ópera",
    comparacion: "Comparación",
    texto: "Texto",
    abstracto: "Abstracto",
    social: "Social",
    interpretacion: "Interpretación",
    eleccion: "Elección",
    teorias: "Teorías",
    simbolico: "Simbólico",
    digital: "Digital",
    creativo: "Creativo",
    imitacion: "Imitación",
    meme: "Meme",
    redes_sociales: "Redes Sociales",
    fotografia: "Fotografía",
    arte: "Arte",
    prediccion: "Predicción",
    destino: "Destino",
    decision: "Decisión",
    especulacion: "Especulación",
    autoengano: "Autoengaño",
    imaginacion: "Imaginación",
    familiar: "Familiar",
    exposicion: "Exposición",
    terapeutico: "Terapéutico",
    transformacion: "Transformación",
    dramatizacion: "Dramatización",
    autoconciencia: "Autoconciencia",
    pasivo_agresivo: "Pasivo-Agresivo",
    vulnerabilidad: "Vulnerabilidad",
    simbolismo: "Simbolismo",
    mensajes: "Mensajes",
    casualidad: "Casualidad",
    paranoia: "Paranoia",
    resumen: "Resumen",
    premiacion: "Premiación",
    catarsis: "Catarsis",
    humor: "Humor",
    intimidad: "Intimidad",
  }

  return displayNames[category] || category
}

function generateChallengeText(category: ChallengeCategory, format: InteractionFormat, tone: ToneSubtype): string {
  // Aquí iría una lógica más compleja para generar retos basados en la combinación
  // de categoría, formato y tono. Por ahora, usamos ejemplos predefinidos.

  const challenges: Record<ChallengeCategory, string[]> = {
    karaoke: [
      "Canta el coro de una canción que te recuerde a tu ex",
      "Improvisa una canción sobre la última vez que te rompieron el corazón",
      "Canta como si estuvieras en una telenovela dramática",
    ],
    confesion: [
      "Confiesa el mensaje más vergonzoso que has enviado a alguien",
      "Revela un secreto que nunca le has contado a nadie en esta mesa",
      "Comparte la historia de tu peor cita romántica",
    ],
    social: [
      "Cuenta la historia de cómo conociste a tu mejor amigo/a",
      "Describe el momento más incómodo que has vivido en una fiesta",
      "Comparte una anécdota de cuando hiciste el ridículo en público",
    ],
    // Añadir más categorías según sea necesario
    visual: ["Describe la escena más dramática que has presenciado"],
    misterioso: ["Cuenta una historia misteriosa que te haya sucedido"],
    icebreaker: ["Comparte algo que nadie en esta mesa sabe sobre ti"],
    roleplay: ["Actúa como si fueras el protagonista de tu telenovela favorita"],
    reflexion: ["Reflexiona sobre tu mayor arrepentimiento romántico"],
    improvisacion: ["Improvisa una escena donde te encuentras con tu ex inesperadamente"],
    velocidad: ["Enumera 5 red flags en una relación en menos de 10 segundos"],
    operatico: ["Canta operáticamente sobre tu peor ruptura"],
    comparacion: ["Compara a tu ex con un personaje de ficción y explica por qué"],
    texto: ["Recita el último mensaje que enviaste a alguien que te gusta"],
    abstracto: ["Describe tu vida amorosa usando solo metáforas"],
    interpretacion: ["Interpreta el significado oculto del último mensaje de tu ex"],
    eleccion: ["Si tuvieras que elegir entre volver con tu ex o estar solo por 5 años, ¿qué elegirías?"],
    teorias: ["Elabora una teoría sobre por qué tus relaciones terminan de forma similar"],
    simbolico: ["¿Qué animal simboliza mejor tu vida amorosa y por qué?"],
    digital: ["Muestra la última foto que te tomaste con alguien especial"],
    creativo: ["Crea un poema de despecho en 30 segundos"],
    imitacion: ["Imita cómo reaccionaría tu ex si te viera ahora"],
    meme: ["Describe un meme que represente tu situación sentimental actual"],
    redes_sociales: ["¿Cuál es la publicación más desesperada que has hecho en redes después de una ruptura?"],
    fotografia: ["Toma una selfie que capture cómo te sientes ahora mismo"],
    arte: ["Dibuja rápidamente cómo visualizas tu corazón en este momento"],
    prediccion: ["Predice cómo será tu próxima relación"],
    destino: ["¿Crees que el destino te reunirá con alguien del pasado?"],
    decision: ["¿Cuál ha sido la decisión más difícil que has tomado en una relación?"],
    especulacion: ["Especula sobre dónde estarías ahora si hubieras seguido con tu ex"],
    autoengano: ["Comparte una mentira que te has dicho a ti mismo después de una ruptura"],
    imaginacion: ["Imagina y describe cómo sería tu cita perfecta"],
    familiar: ["¿Qué rasgo familiar crees que ha afectado tus relaciones?"],
    exposicion: ["Expón el peor consejo romántico que has recibido"],
    terapeutico: ["¿Qué dirías a tu yo del pasado antes de iniciar tu peor relación?"],
    transformacion: ["¿Cómo te ha transformado tu última ruptura?"],
    dramatizacion: ["Dramatiza tu ruptura más dolorosa como si fuera una escena de película"],
    autoconciencia: ["¿Qué patrón tóxico has identificado en tus relaciones?"],
    pasivo_agresivo: ["Comparte un comentario pasivo-agresivo que hayas hecho a una ex pareja"],
    vulnerabilidad: ["Comparte un momento en que te sentiste completamente vulnerable en una relación"],
    simbolismo: ["Si tu corazón fuera un objeto, ¿qué sería y por qué?"],
    mensajes: ["Lee el último mensaje que enviaste a alguien que te gustaba"],
    casualidad: ["Cuenta una coincidencia increíble que hayas experimentado en el amor"],
    paranoia: ["Describe un momento en que la paranoia arruinó una relación"],
    resumen: ["Resume tu vida amorosa en una frase dramática"],
    premiacion: ["Si tuvieras que dar un premio a tu peor ex, ¿cuál sería y por qué?"],
    catarsis: ["Grita el nombre de tu ex y libera toda tu frustración"],
    humor: ["Cuenta el momento más gracioso de una ruptura"],
    intimidad: ["Comparte algo íntimo (no sexual) que extrañes de una relación pasada"],
  }

  // Seleccionar un reto aleatorio de la categoría
  const categoryOptions = challenges[category] || challenges.social
  const randomIndex = Math.floor(Math.random() * categoryOptions.length)

  // Modificar el tono según el subtipo
  let challenge = categoryOptions[randomIndex]

  // Ajustar el tono del reto
  switch (tone) {
    case "caotico":
      challenge += " ¡Y hazlo con toda la intensidad que puedas!"
      break
    case "humoristico":
      challenge += " Intenta hacerlo de la manera más cómica posible."
      break
    case "poetico":
      challenge = `Como si fueras un poeta del desamor: ${challenge}`
      break
    case "sarcastico":
      challenge += " Con todo el sarcasmo que puedas reunir."
      break
    case "vulnerable":
      challenge += " Sé completamente honesto y vulnerable."
      break
    // Añadir más modificadores de tono según sea necesario
  }

  // Ajustar el formato de interacción
  switch (format) {
    case "canto_memoria":
      challenge = challenge.replace("Cuenta", "Canta sobre").replace("Comparte", "Canta sobre")
      break
    case "descripcion_imagen":
      challenge = challenge.replace("Cuenta", "Dibuja").replace("Comparte", "Muestra con una imagen")
      break
    case "emojis_interpretacion":
      challenge += " Luego, los demás deben interpretar lo que quisiste decir."
      break
    // Añadir más modificadores de formato según sea necesario
  }

  return challenge
}

function mapToneToGenre(tone: ToneSubtype): string {
  const genreMap: Record<ToneSubtype, string> = {
    acusatorio: "Corridos del Alma",
    metalero: "Rock del Despecho",
    urbano: "Reggaetón Sad",
    confesional: "Balada Dramática",
    acelerado: "Pop Frenético",
    caotico: "Corridos del Alma",
    lirico: "Poesía del Desamor",
    fantasmagorico: "Balada Gótica",
    revelador: "Confesiones Íntimas",
    humoristico: "Comedia Romántica",
    vengativo: "Corridos del Alma",
    poetico: "Poesía del Desamor",
    vulnerable: "Balada Vulnerable",
    ironico: "Pop Irónico",
    artistico: "Arte Conceptual",
    aleatorio: "Experimental",
    profetico: "Misticismo Romántico",
    sarcastico: "Comedia Negra",
    mistico: "Misticismo Romántico",
    comico: "Comedia Romántica",
    tenso: "Thriller Emocional",
    conspirativo: "Paranoia Romántica",
    desmitificador: "Realismo Crudo",
    minimalista: "Minimalismo Emocional",
    reflexivo: "Terapia Express",
    viral: "Tendencia Digital",
    ligero: "Pop Ligero",
    cinematografico: "Drama Cinematográfico",
    melodramatico: "Telenovela Clásica",
    tradicional: "Bolero Tradicional",
    autentico: "Realismo Emocional",
  }

  return genreMap[tone] || "Despecho Mix"
}

function generateSocialTrigger(category: ChallengeCategory, emotionalTier: string): string {
  // Ejemplos de desencadenantes sociales basados en la categoría y nivel emocional
  const triggers: Record<ChallengeCategory, Record<string, string>> = {
    karaoke: {
      mild: "Si alguien más se une a cantar contigo, todos ganan un bonus",
      intense: "Si logras que alguien llore con tu interpretación, duplica tu recompensa",
      chaotic: "Si todo el grupo canta el coro juntos, todos reciben un shot gratis",
    },
    confesion: {
      mild: "Si alguien dice 'yo también' a tu confesión, ambos ganan un bonus",
      intense: "Si tu confesión deja a todos en silencio por 5 segundos, duplica tu recompensa",
      chaotic: "Si alguien confiesa algo peor después de ti, triplica tu recompensa",
    },
    // Añadir más categorías según sea necesario
    social: {
      mild: "Si logras que todos se rían, ganas un bonus",
      intense: "Si alguien comparte una experiencia similar, ambos ganan un bonus",
      chaotic: "Si todo el grupo aplaude tu historia, todos reciben un shot gratis",
    },
    visual: {
      mild: "Si alguien adivina exactamente lo que estás describiendo, ambos ganan un bonus",
      intense: "Si tu descripción hace que alguien diga 'wow', duplica tu recompensa",
      chaotic: "Si logras que todos visualicen la misma escena, triplica tu recompensa",
    },
    misterioso: {
      mild: "Si alguien resuelve tu misterio, ambos ganan un bonus",
      intense: "Si nadie puede explicar tu historia misteriosa, duplica tu recompensa",
      chaotic: "Si logras asustar a alguien con tu historia, triplica tu recompensa",
    },
    icebreaker: {
      mild: "Si tu revelación sorprende a todos, ganas un bonus",
      intense: "Si alguien dice 'nunca lo hubiera imaginado', duplica tu recompensa",
      chaotic: "Si todos comparten algo similar después de ti, todos reciben un shot gratis",
    },
    roleplay: {
      mild: "Si alguien adivina qué personaje estás interpretando, ambos ganan un bonus",
      intense: "Si logras mantenerte en personaje por 2 minutos, duplica tu recompensa",
      chaotic: "Si alguien más se une a tu actuación, triplica tu recompensa",
    },
  }

  // Obtener el trigger adecuado o usar uno genérico
  const categoryTriggers = triggers[category] || triggers.social
  const tierTrigger = categoryTriggers[emotionalTier] || categoryTriggers.mild

  return tierTrigger
}

function mapToVerificationType(format: InteractionFormat): VerificationType {
  // Mapear el formato de interacción al tipo de verificación más adecuado
  const verificationMap: Record<InteractionFormat, VerificationType> = {
    canto_memoria: "audio",
    vocal_improvisacion: "audio",
    canto_tempo: "audio",
    recitacion_opera: "audio",
    descripcion_imagen: "photo",
    descripcion_caption: "self",
    descripcion_meme: "self",
    lista_concepto: "self",
    texto_prediccion: "self",
    lista_traduccion: "self",
    opcion_sorpresa: "group",
    teorias_revelacion: "group",
    emojis_interpretacion: "group",
    voz_texto: "audio",
    video_texto: "photo",
    actuacion_voz: "group",
    texto_imagen: "photo",
    recitacion_lista: "self",
  }

  return verificationMap[format] || "self"
}

function generateReward(experienceType: ExperienceType, emotionalTier: string, brandId?: string): string {
  // Generar recompensas basadas en el tipo de experiencia y nivel emocional
  if (brandId) {
    // Recompensas de marca
    switch (emotionalTier) {
      case "mild":
        return `Descuento del 10% en productos ${brandId}`
      case "intense":
        return `Shot de cortesía patrocinado por ${brandId}`
      case "chaotic":
        return `Tarjeta ZeroSum con ${brandId} por valor de 150 MXN`
      default:
        return `Regalo sorpresa de ${brandId}`
    }
  } else {
    // Recompensas estándar
    switch (experienceType) {
      case "campaign":
        return "Tarjeta ZeroSum por 100 MXN"
      case "group":
        switch (emotionalTier) {
          case "mild":
            return "Sticker 'Corazón Roto'"
          case "intense":
            return "Sticker 'Voz de Telenovela' + Shot"
          case "chaotic":
            return "Combo 'Despechado Total' + Shot Doble"
          default:
            return "Sticker sorpresa"
        }
      case "multi_table":
        return "Descuento en tu próxima bebida"
      default:
        return "Sticker digital para compartir"
    }
  }
}

function mapEmotionalTierToDifficulty(tier: string): "easy" | "medium" | "hard" {
  switch (tier) {
    case "mild":
      return "easy"
    case "intense":
      return "medium"
    case "chaotic":
      return "hard"
    default:
      return "medium"
  }
}
