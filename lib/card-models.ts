/**
 * Modelos para las cartas emocionales de La Lotería del Despecho
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

// Tipos de stickers
export enum StickerType {
  CORAZON_ROTO = "💔 Corazón Roto™",
  PAYASO_OFICIAL = "🤡 Payaso Oficial",
  TEXTO_MAL_MANDADO = "💬 Texto Mal Mandado",
  CAUSA_CAOS = "🧨 Causa Caos",
  VOZ_TELENOVELA = "🎤 Voz de Telenovela",
  VERGUENZA_AJENA = "💃 Vergüenza Ajena",
  CHICLE_EMOCIONAL = "🧸 Chicle Emocional",
  RED_FLAG_FLAG = "🚩 Red Flag Flag",
  MODO_DRAMATICA = "🎭 Modo Dramática",
  SOBREPENSAR = "🧠 Sobrepensar S.A.",
  FACEPALM_TOTAL = "🫣 Facepalm Total",
  TENSION_GENERADA = "🫦 Tensión Generada",
  RUGIDO_INTERNO = "🦁 Rugido Interno",
}

// Niveles de caos
export enum ChaosLevel {
  MILD = "mild",
  INTENSE = "intense",
  CHAOTIC = "chaotic",
}

// Niveles de riesgo social
export enum SocialRisk {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Modelo para la canción de Spotify
export interface SpotifySong {
  title: string
  artist: string
  url: string
}

// Modelo para la recompensa
export interface Reward {
  tipo: "digital" | "physical" | "stickers"
  descripcion: string
}

// Modelo para la carta emocional
export interface EmotionalCardModel {
  card_title: string
  challenge: string
  genre_tag: GenreTag
  emotional_tier: ChaosLevel
  spotify_song: SpotifySong
  ai_backup_response: string
  social_trigger: string
  reward: string | Reward
  sticker_integration?: string
  narrative_voice?: NarrativeVoice
  emotional_tone?: EmotionalTone
  stylistic_language?: StylisticLanguage
}

// Modelo para el combo de stickers
export interface StickerCombo {
  nombre_combo: string
  stickers_necesarios: StickerType[]
  efecto_grupal: string
  premio: Reward
}

// Cartas predefinidas basadas en el documento
export const PREDEFINED_CARDS: EmotionalCardModel[] = [
  {
    card_title: "🎤 El Coro que Nunca Le Dedicaste 🔥",
    challenge:
      "Canta el coro de una canción que siempre quisiste dedicar pero nunca tuviste el valor... ¡hasta ahora! El grupo debe adivinar si es por amor, despecho o locura. Puedes usar lágrimas falsas, micrófono de plátano o efectos de sonido ambientales.",
    genre_tag: GenreTag.REGGAETON_SAD,
    emotional_tier: ChaosLevel.INTENSE,
    spotify_song: {
      title: "Hawái",
      artist: "Maluma",
      url: "https://open.spotify.com/track/1yoMvmasuxZfqHkrJmwgLz",
    },
    ai_backup_response:
      "¡Eras mi destino, pero el karma te traicionó! Este micrófono es mi único consuelo... (pausa dramática) ¡Cántalo conmigo, mundo cruel! (sollozo falso + sonido de viento teatral)",
    social_trigger:
      "Si al menos 3 personas juran que pondrían tu coro en su playlist 'Emo del Verano', ganas el derecho de elegir la próxima canción (y exigir que se canten todos los versos).",
    reward:
      "Premio a la Valentina Fallida: Todos deben hacer playback de tu coro con un corazón gigante hecho de servilletas arrugadas y un '¡Qué fuerte!' colectivo.",
    narrative_voice: NarrativeVoice.CANTINERO_POETA,
    emotional_tone: EmotionalTone.DESPECHO,
    stylistic_language: StylisticLanguage.JERGA_DIGITAL,
    sticker_integration: "Ganas el sticker 🎤 Voz de Telenovela si logras que alguien llore durante tu interpretación.",
  },
  {
    card_title: "💔 El Ex-Bot que Nunca Silencia 🔧💔",
    challenge:
      "Usa la voz de Ex-Bot para narrar tu peor momento post-ruptura como si fuera un informe técnico. Ejemplo: 'Error 404: Amor no encontrado. Causa: red flags múltiples en fase crítica.'",
    genre_tag: GenreTag.CORRIDOS_DEL_ALMA,
    emotional_tier: ChaosLevel.CHAOTIC,
    spotify_song: {
      title: "Me Va a Extrañar",
      artist: "Luis Fonsi",
      url: "https://open.spotify.com/track/3C4ML1koYbc8leu72fv9vV",
    },
    ai_backup_response:
      "Probabilidad de reconciliación: 0.0001%. Diagnóstico: Síndrome de Apego Tóxico v3.0. Recomendación: Formatear corazón y reinstalar autoestima. Actualización disponible en App Store del Alma.",
    social_trigger:
      "Si al menos 3 personas ríen mientras asienten con 'esto es 100% mi vida', ganas el derecho de forzar a otro jugador a recibir un 'diagnóstico' personalizado.",
    reward: "Certificado digital: 'Ingeniero Emocional Certificado (IEC)' + filtro AR de error 404 en rostro",
    narrative_voice: NarrativeVoice.EX_BOT,
    emotional_tone: EmotionalTone.IRONIA,
    stylistic_language: StylisticLanguage.TERAPIA_MEME,
    sticker_integration:
      "Ganas el sticker 💔 Corazón Roto™ al completar 2 diagnósticos técnicos de relaciones fallidas.",
  },
  {
    card_title: "🎭 El Meme que Tu Ex No Verá 🧠😭",
    challenge:
      "Usa la letra de 'Me Va a Extrañar' de Luis Fonsi para crear un meme que resuma tu mayor catarsis post-ruptura. Ejemplo: 'Cuando dices \"estoy bien\" pero tu playlist es puro Luis Fonsi'. El grupo vota el más terapéutico y el más ridículo.",
    genre_tag: GenreTag.CORRIDOS_DEL_ALMA,
    emotional_tier: ChaosLevel.INTENSE,
    spotify_song: {
      title: "Me Va a Extrañar",
      artist: "Luis Fonsi",
      url: "https://open.spotify.com/track/3C4ML1koYbc8leu72fv9vV",
    },
    ai_backup_response:
      'Caption de meme generado por Coach de Rupturas: \'Cuando él dice "me va a extrañar" pero tú ya estás en la fase de "me va a bloquear y punto". #DolorDulce #TerapiaDeMeme\'',
    social_trigger:
      "Si al menos 3 personas guardan tu meme en sus favoritos o lo usan como story, ganas el derecho de elegir la próxima canción del karaoke (y exigir coreografía grupal).",
    reward:
      "Filtro digital: 'Dignificador 3000' (hace que cualquier foto tuya luzca como si hubieras superado todo con estilo).",
    narrative_voice: NarrativeVoice.COACH_RUPTURAS,
    emotional_tone: EmotionalTone.CAOS_ROMANTICO,
    stylistic_language: StylisticLanguage.TERAPIA_MEME,
    sticker_integration: "Ganas el sticker 🧸 Chicle Emocional al crear un meme que active risa + ternura colectiva.",
  },
  {
    card_title: "🎵 La Playlist que Nunca Le Dedicaste 🔥",
    challenge:
      "Crea una playlist de 5 canciones que resuman tu vida amorosa. El grupo analiza tu estado emocional basado en tu selección. Ejemplo: Si incluyes 3 canciones de Shakira, explica tu fase 'exorcismo con ritmo'.",
    genre_tag: GenreTag.REGGAETON_SAD,
    emotional_tier: ChaosLevel.MILD,
    spotify_song: {
      title: "Hawái",
      artist: "Maluma",
      url: "https://open.spotify.com/track/1yoMvmasuxZfqHkrJmwgLz",
    },
    ai_backup_response:
      "Coach de Rupturas analiza: 'Tu playlist indica Síndrome de Apego Tóxico v2.0: 40% despecho, 30% nostalgia, 30% 'soy adicta al dolor'. Recomendación: Añade una canción de empoderamiento y borra 'Despacito' de tu vida.'",
    social_trigger: "Si el diagnóstico del grupo coincide con tu situación real, desbloqueas la cortesía.",
    reward: "Playlist digital: 'Soundtrack de mi Ex' + filtro AR de 'Playlist Killer'.",
    narrative_voice: NarrativeVoice.BOT_SARCASTICO,
    emotional_tone: EmotionalTone.CAOS_ROMANTICO,
    stylistic_language: StylisticLanguage.IRONIA_CRUDA,
    sticker_integration: "Ganas el sticker 🧨 Causa Caos si tu playlist incluye >3 canciones de despecho en 1 minuto.",
  },
  {
    card_title: "💬 El Mensaje que Nunca Enviaste 📱💔",
    challenge:
      "Muestra o recrea el mensaje más atrevido que has enviado por redes para conquistar a alguien. El grupo evalúa su efectividad. Ejemplo: 'Hola, ¿cómo estás? (y sí, te sigo en Instagram)'.",
    genre_tag: GenreTag.REGGAETON_SAD,
    emotional_tier: ChaosLevel.MILD,
    spotify_song: {
      title: "Contigo",
      artist: "Calibre 50",
      url: "https://open.spotify.com/track/4sUPUtUwactN4hCH3ghrq2",
    },
    ai_backup_response:
      "Coach de Rupturas analiza: 'Tu mensaje indica un 80% de valentía y 20% de 'ojalá no me bloquee'. Recomendación: Añade un emoji de corazón y borra 'Hola, ¿cómo estás?'.'",
    social_trigger: "Si el diagnóstico del grupo coincide con tu situación real, desbloqueas la cortesía.",
    reward: "Filtro digital: 'Tears but Make it Aesthetic' + certificado 'Influencer de Desamor'.",
    narrative_voice: NarrativeVoice.TIA_CHISMOSA,
    emotional_tone: EmotionalTone.VULNERABILIDAD,
    stylistic_language: StylisticLanguage.EMOJIS_SPANGLISH,
    sticker_integration:
      "Ganas el sticker 💬 Texto Mal Mandado si tu mensaje incluye >3 errores ortográficos y un 'jeje' final.",
  },
]

// Combos de stickers predefinidos
export const STICKER_COMBOS: StickerCombo[] = [
  {
    nombre_combo: "Karaoke Caótico",
    stickers_necesarios: [StickerType.VOZ_TELENOVELA, StickerType.VERGUENZA_AJENA, StickerType.PAYASO_OFICIAL],
    efecto_grupal:
      "Todos deben cantar 'Hawái' de Maluma con voz operática y coreografía ridícula. La persona con peor interpretación recibe el sticker 'Payaso Oficial' adicional.",
    premio: {
      tipo: "digital",
      descripcion:
        "Playlist 'Soundtrack de mi Ex' + filtro AR de coro de fantasmas cantando '¿Ya viste que subió una story?'",
    },
  },
  {
    nombre_combo: "Cerebro Apagado",
    stickers_necesarios: [StickerType.PAYASO_OFICIAL, StickerType.CAUSA_CAOS, StickerType.RED_FLAG_FLAG],
    efecto_grupal: "El grupo habla solo con emojis durante una ronda.",
    premio: {
      tipo: "digital",
      descripcion:
        "Badge 'Emoji Master' + derecho a forzar a otro jugador a hablar solo con emojis por una ronda adicional.",
    },
  },
  {
    nombre_combo: "Barra Libre de Excusas",
    stickers_necesarios: [StickerType.TEXTO_MAL_MANDADO, StickerType.PAYASO_OFICIAL, StickerType.CORAZON_ROTO],
    efecto_grupal: "Todos inventan excusas absurdas para no contestar un chat (ej.: 'Estaba meditando con delfines').",
    premio: {
      tipo: "digital",
      descripcion: "Generador de excusas premium + certificado 'Maestro de la Evasión Emocional'.",
    },
  },
  {
    nombre_combo: "Duelo Colectivo",
    stickers_necesarios: [StickerType.CORAZON_ROTO, StickerType.CHICLE_EMOCIONAL, StickerType.TEXTO_MAL_MANDADO],
    efecto_grupal: "Todos comparten historias de 'me dejó en visto'. El grupo vota la más dolorosa.",
    premio: {
      tipo: "digital",
      descripcion: "NFT 'Mensaje en Botella Digital' + filtro AR de 'Visto pero Ignorado'.",
    },
  },
]

// Función para obtener una carta aleatoria
export function getRandomCard(): EmotionalCardModel {
  return PREDEFINED_CARDS[Math.floor(Math.random() * PREDEFINED_CARDS.length)]
}

// Función para obtener un combo por stickers
export function getComboByStickers(stickers: StickerType[]): StickerCombo | null {
  return (
    STICKER_COMBOS.find((combo) =>
      combo.stickers_necesarios.every((requiredSticker) => stickers.includes(requiredSticker)),
    ) || null
  )
}
