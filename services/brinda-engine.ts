/**
 * Brinda Engine Service
 *
 * Este servicio maneja la generación de contenido para las cartas de La Cortesía
 * utilizando el sistema de generación de copy de Brinda.
 */

// Tipos de voces narrativas
export enum NarrativeVoice {
  CANTINERO_POETA = "Cantinero Poeta",
  TIA_CHISMOSA = "Tía Chismosa",
  BOT_SARCASTICO = "Bot Sarcástico",
  EX_ARREPENTIDO = "Ex Arrepentido",
  CONSEJERA_EMOCIONAL = "Consejera Emocional",
  COACH_RUPTURAS = "Coach de Rupturas",
  EX_BOT = "Ex-Bot",
}

// Tipos de emociones base
export enum EmotionalTone {
  DESPECHO = "despecho",
  IRONIA = "ironía",
  VULNERABILIDAD = "vulnerabilidad",
  NOSTALGIA = "nostalgia",
  CAOS_ROMANTICO = "caos romántico",
}

// Tipos de lenguaje estilístico
export enum StylisticLanguage {
  EMOJIS_SPANGLISH = "Emojis + Spanglish",
  IRONIA_CRUDA = "Ironía Cruda",
  POESIA_CHAFA = "Poesía Chafa",
  JERGA_DIGITAL = "Jerga Digital",
  TERAPIA_MEME = "Terapia de Meme",
}

// Tipos de géneros musicales
export enum GenreTag {
  REGGAETON_SAD = "Reggaetón Sad",
  CUMBIA_DEL_OLVIDO = "Cumbia del Olvido",
  CORRIDOS_DEL_ALMA = "Corridos del Alma",
  TERAPIA_EXPRESS = "Terapia Express",
}

// Tipos de retos según la cantidad de participantes
export enum ChallengeType {
  INDIVIDUAL = "individual",
  DUET = "duet",
  GROUP = "group",
}

// Niveles de caos
export enum ChaosLevel {
  MILD = "mild",
  INTENSE = "intense",
  CHAOTIC = "chaotic",
}

// Tipos de prompts creativos
export enum PromptType {
  DESIRE_FULFILLMENT = "desire_fulfillment",
  CURIOSITY_SPARKING = "curiosity_sparking",
  BENEFIT_DRIVEN = "benefit_driven",
  SIMPLICITY_CLARITY = "simplicity_clarity",
  SOLVE_PAIN_POINT = "solve_pain_point",
  HIGHLIGHT_SPECIFIC_BENEFIT = "highlight_specific_benefit",
  TRANSFORMATIVE_OUTCOME = "transformative_outcome",
  EASE_OF_USE = "ease_of_use",
  EXCLUSIVITY_SCARCITY = "exclusivity_scarcity",
  NOSTALGIA_HACK = "nostalgia_hack",
  PERFORMANCE_DARE = "performance_dare",
  TECNOLOGIA_TOXICA = "tecnologia_toxica",
  CONFESION_PROHIBIDA = "confesion_prohibida",
  LOOP_TEMPORAL = "loop_temporal",
  RANDOM_DRAMA = "random_drama",
  ESPIRITU_DESPECHO = "espiritu_despecho",
  DUALIDAD = "dualidad",
}

// Tipos de moduladores de tono
export enum MoodComposer {
  SASSY_CRINGE = "sassy_cringe",
  DESPECHO_NOSTALGICO = "despecho_nostalgico",
  DRAMA_CAOTICO = "drama_caotico",
  TUSA_CINEMATICA = "tusa_cinematica",
  NOSTALGIA_KITSCH = "nostalgia_kitsch",
  SAD_MEME_ENERGY = "sad_meme_energy",
  FIESTA_CON_LAGRIMITAS = "fiesta_con_lagrimitas",
}

// Tipos de voces finales
export enum FinalVoice {
  TELENOVELA = "telenovela",
  SAD_GIRL_TIKTOK = "sad_girl_tiktok",
  SENORA_ESPIRITISTA = "senora_espiritista",
  LOCUTOR_RADIO_NOCTURNA = "locutor_radio_nocturna",
  CUMBIA_FILOSOFICA = "cumbia_filosofica",
  MEMO_APONTE_CRISIS = "memo_aponte_crisis",
}

// Interfaz para los parámetros de generación de cartas
export interface CardGenerationParams {
  promptType: PromptType
  moodComposer: MoodComposer
  finalVoice: FinalVoice
  challengeType: ChallengeType
  emotionalTier: ChaosLevel
  genreTag: GenreTag
  verificationMethod?: "photo" | "audio" | "text" | "group" | "self"
  partnerSelection?: "random" | "choose"
  brandId?: string
}

// Interfaz para la carta generada
export interface GeneratedCard {
  card_id: string
  card_title: string
  challenge: string
  emotional_tier: "mild" | "intense" | "chaotic"
  theme_tag: string
  spotify_song: {
    title: string
    artist: string
  }
  ai_backup_response: string
  social_trigger: string
  reward: string
  reward_type: "shot" | "discount" | "zerosum_card" | "product"
  challenge_type: ChallengeType
  partner_selection?: "random" | "choose"
  verification_method: "photo" | "audio" | "text" | "group" | "self"
  brand_sponsor?: {
    id: string
    name: string
    logo: string
    industry: string
    rewardValue: number
  }
  back_image_url?: string
}

/**
 * Genera una carta utilizando el Brinda Engine
 */
export async function generateCard(params: CardGenerationParams): Promise<GeneratedCard> {
  // En una implementación real, esto llamaría a una API o utilizaría un modelo de IA
  // Para este ejemplo, generamos una carta con valores predeterminados basados en los parámetros

  // Generar un ID único para la carta
  const cardId = `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // Generar título basado en el tipo de prompt y modulador de tono
  let cardTitle = ""
  switch (params.promptType) {
    case PromptType.DESIRE_FULFILLMENT:
      cardTitle = "El Deseo Prohibido"
      break
    case PromptType.CURIOSITY_SPARKING:
      cardTitle = "La Curiosidad Mató al Ex"
      break
    case PromptType.CONFESION_PROHIBIDA:
      cardTitle = "El Secreto Inconfesable"
      break
    case PromptType.LOOP_TEMPORAL:
      cardTitle = "El Bucle del Despecho"
      break
    default:
      cardTitle = "La Carta del Destino"
  }

  // Modificar el título según el modulador de tono
  switch (params.moodComposer) {
    case MoodComposer.SASSY_CRINGE:
      cardTitle = `${cardTitle} (Modo Cringe)`
      break
    case MoodComposer.DESPECHO_NOSTALGICO:
      cardTitle = `${cardTitle} del 2010`
      break
    case MoodComposer.DRAMA_CAOTICO:
      cardTitle = `${cardTitle} Extremo`
      break
    case MoodComposer.TUSA_CINEMATICA:
      cardTitle = `${cardTitle}: La Película`
      break
    case MoodComposer.NOSTALGIA_KITSCH:
      cardTitle = `${cardTitle} Vintage`
      break
    case MoodComposer.SAD_MEME_ENERGY:
      cardTitle = `${cardTitle} (Sad Reacts Only)`
      break
    case MoodComposer.FIESTA_CON_LAGRIMITAS:
      cardTitle = `${cardTitle} con Shots de Lágrimas`
      break
  }

  // Generar reto basado en el tipo de prompt y tipo de reto
  let challenge = ""
  switch (params.promptType) {
    case PromptType.DESIRE_FULFILLMENT:
      challenge = "Grita tu mayor deseo prohibido mientras el grupo adivina si es verdad o mentira."
      break
    case PromptType.CURIOSITY_SPARKING:
      challenge = "¿Qué harías si tu ex entrara ahora mismo? Actúa como si estuviera aquí."
      break
    case PromptType.CONFESION_PROHIBIDA:
      challenge = "Confiesa el mensaje más vergonzoso que has enviado a un ex o crush."
      break
    case PromptType.LOOP_TEMPORAL:
      challenge = "Repite la última frase que le dijiste a tu ex como si fuera un mantra, cada vez más dramático."
      break
    default:
      challenge = "Comparte una historia de desamor que nunca le has contado a nadie."
  }

  // Modificar el reto según el tipo de reto (individual, dueto, grupo)
  switch (params.challengeType) {
    case ChallengeType.INDIVIDUAL:
      // El reto ya está en formato individual, no necesita modificación
      break
    case ChallengeType.DUET:
      challenge = `Con un compañero: ${challenge} Uno comienza y el otro termina la historia.`
      break
    case ChallengeType.GROUP:
      challenge = `Todo el grupo participa: ${challenge} Cada persona añade un detalle a la historia.`
      break
  }

  // Generar respuesta de respaldo de IA basada en el tipo de prompt y voz final
  let aiBackupResponse = ""
  switch (params.finalVoice) {
    case FinalVoice.TELENOVELA:
      aiBackupResponse = "¡No puedo creer que me hayas hecho esto! *Pausa dramática* ¡Después de todo lo que vivimos!"
      break
    case FinalVoice.SAD_GIRL_TIKTOK:
      aiBackupResponse = "POV: cuando te das cuenta que nunca te quiso y solo fuiste un capítulo en su historia... 🥺💔"
      break
    case FinalVoice.SENORA_ESPIRITISTA:
      aiBackupResponse =
        "Yo veo que hay una energía de despecho muy fuerte aquí... necesitas limpiar tu aura con agua de rosas y sal marina."
      break
    case FinalVoice.LOCUTOR_RADIO_NOCTURNA:
      aiBackupResponse =
        "Y en la noche solitaria, cuando los recuerdos golpean como olas en la playa, nos preguntamos... ¿valió la pena?"
      break
    case FinalVoice.CUMBIA_FILOSOFICA:
      aiBackupResponse =
        "Y así es la vida, compadre, unos vienen y otros van, pero la cumbia del desamor siempre sonará."
      break
    case FinalVoice.MEMO_APONTE_CRISIS:
      aiBackupResponse =
        "¡NO PUEDO MÁS! *grito exagerado* ¡ESTO ES DEMASIADO PARA MÍ! *llanto falso* ¡NECESITO UN MOMENTO!"
      break
    default:
      aiBackupResponse =
        "Podrías decir algo como: 'Nunca pensé que estaría aquí, contando esta historia, pero la vida da muchas vueltas...'"
  }

  // Generar desencadenante social basado en el tipo de reto
  let socialTrigger = ""
  switch (params.challengeType) {
    case ChallengeType.INDIVIDUAL:
      socialTrigger = "Si al menos 2 personas dicen 'yo hubiera hecho lo mismo', ganas un shot gratis."
      break
    case ChallengeType.DUET:
      socialTrigger = "Si logran hacer reír a todo el grupo, ambos ganan un shot gratis."
      break
    case ChallengeType.GROUP:
      socialTrigger = "Si todos completan el reto, cada uno gana un shot gratis."
      break
    default:
      socialTrigger = "Si el grupo vota que tu historia es la más dramática, ganas un shot gratis."
  }

  // Generar recompensa basada en el nivel emocional
  let reward = ""
  let rewardType = "shot"
  switch (params.emotionalTier) {
    case ChaosLevel.MILD:
      reward = "Shot de tequila"
      rewardType = "shot"
      break
    case ChaosLevel.INTENSE:
      reward = "Sticker digital 'Sobreviviente del Despecho'"
      rewardType = "product"
      break
    case ChaosLevel.CHAOTIC:
      reward = "Corona de 'Rey/Reina del Drama' por el resto de la noche"
      rewardType = "product"
      break
    default:
      reward = "Shot de tequila"
      rewardType = "shot"
  }

  // Si hay un patrocinador, modificar la recompensa
  if (params.brandId) {
    reward = `${reward} cortesía de ${params.brandId}`
  }

  // Generar método de verificación si no se proporciona
  const verificationMethod =
    params.verificationMethod ||
    ((params.challengeType === ChallengeType.GROUP
      ? "group"
      : params.challengeType === ChallengeType.DUET
        ? "photo"
        : ["photo", "audio", "text", "self"][Math.floor(Math.random() * 4)]) as
      | "photo"
      | "audio"
      | "text"
      | "group"
      | "self")

  // Generar canción de Spotify basada en el género
  let spotifySong = {
    title: "",
    artist: "",
  }
  switch (params.genreTag) {
    case GenreTag.REGGAETON_SAD:
      spotifySong = {
        title: "Hawái",
        artist: "Maluma",
      }
      break
    case GenreTag.CUMBIA_DEL_OLVIDO:
      spotifySong = {
        title: "Cómo Te Voy a Olvidar",
        artist: "Los Ángeles Azules",
      }
      break
    case GenreTag.CORRIDOS_DEL_ALMA:
      spotifySong = {
        title: "Ya Lo Sé",
        artist: "Cristian Nodal",
      }
      break
    case GenreTag.TERAPIA_EXPRESS:
      spotifySong = {
        title: "Amorfoda",
        artist: "Bad Bunny",
      }
      break
    default:
      spotifySong = {
        title: "Te Boté",
        artist: "Nio García, Casper Mágico, Bad Bunny",
      }
  }

  // Crear la carta generada
  const generatedCard: GeneratedCard = {
    card_id: cardId,
    card_title: cardTitle,
    challenge: challenge,
    emotional_tier: params.emotionalTier,
    theme_tag: params.genreTag,
    spotify_song: spotifySong,
    ai_backup_response: aiBackupResponse,
    social_trigger: socialTrigger,
    reward: reward,
    reward_type: rewardType as "shot" | "discount" | "zerosum_card" | "product",
    challenge_type: params.challengeType,
    partner_selection: params.challengeType === ChallengeType.DUET ? params.partnerSelection || "random" : undefined,
    verification_method: verificationMethod,
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
  }

  // Si hay un patrocinador, añadir información del patrocinador
  if (params.brandId) {
    generatedCard.brand_sponsor = {
      id: params.brandId,
      name: params.brandId,
      logo: `/placeholder.svg?height=40&width=120&text=${params.brandId}`,
      industry: "Bebidas",
      rewardValue: 50,
    }
  }

  return generatedCard
}

/**
 * Genera un conjunto de cartas utilizando el Brinda Engine
 */
export async function generateCardDeck(
  count: number,
  params?: Partial<CardGenerationParams>,
): Promise<GeneratedCard[]> {
  const cards: GeneratedCard[] = []

  // Valores predeterminados para los parámetros
  const defaultParams: CardGenerationParams = {
    promptType: PromptType.DESIRE_FULFILLMENT,
    moodComposer: MoodComposer.DRAMA_CAOTICO,
    finalVoice: FinalVoice.TELENOVELA,
    challengeType: ChallengeType.INDIVIDUAL,
    emotionalTier: ChaosLevel.INTENSE,
    genreTag: GenreTag.REGGAETON_SAD,
  }

  // Combinar parámetros predeterminados con los proporcionados
  const mergedParams = { ...defaultParams, ...params }

  // Generar cartas
  for (let i = 0; i < count; i++) {
    // Variar algunos parámetros para tener diversidad
    const cardParams: CardGenerationParams = { ...mergedParams }

    // Variar el tipo de reto para tener una mezcla de individuales, duetos y grupales
    if (!params?.challengeType) {
      const challengeTypes = [ChallengeType.INDIVIDUAL, ChallengeType.DUET, ChallengeType.GROUP]
      cardParams.challengeType = challengeTypes[i % challengeTypes.length]
    }

    // Variar el nivel emocional
    if (!params?.emotionalTier) {
      const emotionalTiers = [ChaosLevel.MILD, ChaosLevel.INTENSE, ChaosLevel.CHAOTIC]
      cardParams.emotionalTier = emotionalTiers[Math.floor(Math.random() * emotionalTiers.length)]
    }

    // Variar el tipo de prompt
    if (!params?.promptType) {
      const promptTypes = Object.values(PromptType)
      cardParams.promptType = promptTypes[Math.floor(Math.random() * promptTypes.length)]
    }

    // Variar el modulador de tono
    if (!params?.moodComposer) {
      const moodComposers = Object.values(MoodComposer)
      cardParams.moodComposer = moodComposers[Math.floor(Math.random() * moodComposers.length)]
    }

    // Variar la voz final
    if (!params?.finalVoice) {
      const finalVoices = Object.values(FinalVoice)
      cardParams.finalVoice = finalVoices[Math.floor(Math.random() * finalVoices.length)]
    }

    // Variar el género musical
    if (!params?.genreTag) {
      const genreTags = Object.values(GenreTag)
      cardParams.genreTag = genreTags[Math.floor(Math.random() * genreTags.length)]
    }

    // Generar la carta y añadirla al mazo
    const card = await generateCard(cardParams)
    cards.push(card)
  }

  return cards
}
