// Despecho Card Generator System
// A flexible system for generating emotionally-themed party game cards

// Base Configuration
const GENRE_TAGS = {
  REGGAETON_SAD: {
    name: "Reggaetón Sad",
    description: "Modern heartbreak stories with urban vibes",
    emotionalIntensity: 7,
  },
  CUMBIA_DEL_OLVIDO: {
    name: "Cumbia del Olvido",
    description: "Nostalgic or lighter stories about moving on",
    emotionalIntensity: 5,
  },
  CORRIDOS_DEL_ALMA: {
    name: "Corridos del Alma",
    description: "Dramatic, intense emotional situations",
    emotionalIntensity: 9,
  },
  TERAPIA_EXPRESS: {
    name: "Terapia Express",
    description: "Reflective or personal growth moments",
    emotionalIntensity: 6,
  },
}

const EMOTIONAL_TIERS = {
  MILD: {
    name: "Mild",
    description: "Slightly uncomfortable but easy to share",
    minAge: 16,
    intensityRange: [1, 4],
  },
  INTENSE: {
    name: "Intense",
    description: "Deeply personal, requires vulnerability",
    minAge: 18,
    intensityRange: [5, 7],
  },
  CHAOTIC: {
    name: "Chaotic",
    description: "Extremely raw and emotional, cathartic",
    minAge: 21,
    intensityRange: [8, 10],
  },
}

const CHALLENGE_TYPES = {
  CANTA_O_LLORA: {
    name: "Canta o Llora",
    description: "Singing challenges related to emotional experiences",
    performanceRequired: true,
  },
  DESPECHO_IRL: {
    name: "Despecho IRL",
    description: "Real-life storytelling about heartbreak moments",
    performanceRequired: false,
  },
  TERAPIA_GRUPAL: {
    name: "Terapia Grupal",
    description: "Group therapy activities for emotional release",
    performanceRequired: true,
  },
  DIGITAL_DRAMA: {
    name: "Digital Drama",
    description: "Social media and digital communication disasters",
    performanceRequired: false,
  },
  CONFESIONARIO: {
    name: "Confesionario",
    description: "Confession-style challenges revealing personal details",
    performanceRequired: false,
  },
}

// Enhanced song database with more metadata
const songDatabase = [
  {
    title: "Te Boté",
    artist: "Nio Garcia, Casper Magico, Bad Bunny",
    url: "https://open.spotify.com/track/3V8UQkZrksxKUYWyIuD7y2",
    genre: GENRE_TAGS.REGGAETON_SAD.name,
    emotionalIntensity: 8,
    themes: ["revenge", "moving on", "empowerment"],
    lyricalHook: "Ya no me importa lo que digan",
  },
  {
    title: "Hawái",
    artist: "Maluma",
    url: "https://open.spotify.com/track/1yoMvmasuxZfqHkrJmwgLz",
    genre: GENRE_TAGS.REGGAETON_SAD.name,
    emotionalIntensity: 7,
    themes: ["social media", "fake happiness", "jealousy"],
    lyricalHook: "Subiendo fotos pa' que yo vea",
  },
  {
    title: "Ya No Somos Ni Seremos",
    artist: "Christian Nodal",
    url: "https://open.spotify.com/track/5MqvmiiCi79LjjgCdZZIne",
    genre: GENRE_TAGS.CORRIDOS_DEL_ALMA.name,
    emotionalIntensity: 9,
    themes: ["finality", "acceptance", "painful memories"],
    lyricalHook: "Quise mi piel llenarte de tatuajes",
  },
  {
    title: "Fotografía",
    artist: "Juanes & Nelly Furtado",
    url: "https://open.spotify.com/track/7DYU0yB95KCrQxwHDSXdXR",
    genre: GENRE_TAGS.CUMBIA_DEL_OLVIDO.name,
    emotionalIntensity: 6,
    themes: ["distance", "memories", "nostalgia"],
    lyricalHook: "Cada vez que yo me voy llevo a un lado de mi piel",
  },
  {
    title: "BICHOTA",
    artist: "Karol G",
    url: "https://open.spotify.com/track/7vrJn5hDSXRmdXoR30KgF1",
    genre: GENRE_TAGS.REGGAETON_SAD.name,
    emotionalIntensity: 4,
    themes: ["empowerment", "transformation", "confidence"],
    lyricalHook: "Perreando hasta abajo sin darle explicaciones a nadie",
  },
  {
    title: "El Recuento de los Daños",
    artist: "Gloria Trevi",
    url: "https://open.spotify.com/track/4IQRHLlaW9WdRUVpRVFi3w",
    genre: GENRE_TAGS.CORRIDOS_DEL_ALMA.name,
    emotionalIntensity: 10,
    themes: ["heartbreak", "damage assessment", "painful memories"],
    lyricalHook: "Y mientras tanto yo quería hacer canciones",
  },
  {
    title: "Cactus",
    artist: "Karol G",
    url: "https://open.spotify.com/track/2qP8K5XbuxBxBfVpRb21uu",
    genre: GENRE_TAGS.TERAPIA_EXPRESS.name,
    emotionalIntensity: 7,
    themes: ["moving on", "growth", "self-discovery"],
    lyricalHook: "Me di cuenta que lo nuestro no era de dos",
  },
  {
    title: "Mil Horas",
    artist: "Los Abuelos de la Nada",
    url: "https://open.spotify.com/track/38YnxF9HJJQQm5Zw7cjUQT",
    genre: GENRE_TAGS.CUMBIA_DEL_OLVIDO.name,
    emotionalIntensity: 5,
    themes: ["waiting", "desire", "hope"],
    lyricalHook: "Hace mil horas que estoy sentado aquí",
  },
  {
    title: "Antes Que Salga El Sol",
    artist: "Natti Natasha & Prince Royce",
    url: "https://open.spotify.com/track/1yonGuBPfQ38kbTgNaXQGu",
    genre: GENRE_TAGS.REGGAETON_SAD.name,
    emotionalIntensity: 6,
    themes: ["one night", "fleeting connection", "temporary love"],
    lyricalHook: "Antes que salga el sol, tú y yo",
  },
  {
    title: "Rata de Dos Patas",
    artist: "Paquita la del Barrio",
    url: "https://open.spotify.com/track/22pJFir2J4crzTkupItwvj",
    genre: GENRE_TAGS.TERAPIA_EXPRESS.name,
    emotionalIntensity: 10,
    themes: ["rage", "insults", "betrayal"],
    lyricalHook: "Rata inmunda, animal rastrero",
  },
  {
    title: "Amigos Con Derechos",
    artist: "Reik & Maluma",
    url: "https://open.spotify.com/track/5iB0coR40J0ZZRUUWgCmTy",
    genre: GENRE_TAGS.REGGAETON_SAD.name,
    emotionalIntensity: 6,
    themes: ["friendzone", "unclear boundaries", "desire"],
    lyricalHook: "Ya no quiero ser tu amigo con derecho",
  },
  {
    title: "Mientes Tan Bien",
    artist: "Sin Bandera",
    url: "https://open.spotify.com/track/5W7DOVGQLTigu06wZHVNgj",
    genre: GENRE_TAGS.TERAPIA_EXPRESS.name,
    emotionalIntensity: 8,
    themes: ["lies", "deception", "beautiful pain"],
    lyricalHook: "Que me duele tanto que seas tan perfecto",
  },
]

// Template generators for different components
const generateCardTitle = (parameters) => {
  const { emotionalTier, challengeType, theme } = parameters
  const titleTemplates = [
    // Emotional expression templates
    `${theme === "social media" ? "La Indirecta Directa" : ""}`,
    `${theme === "ghosting" ? "Ghosteado en Visto" : ""}`,
    `${theme === "stalking" ? "El Stalking Terapéutico" : ""}`,
    `${theme === "drunk texts" ? "Mensaje Borracho Premium" : ""}`,
    `${theme === "music" ? "La Playlist del Despecho" : ""}`,
    `${theme === "blocking" ? "Contactos Bloqueados S.A." : ""}`,
    `${theme === "telenovela" ? "La Tía Dramática" : ""}`,
    `${theme === "keepsakes" ? "Archivo Sentimental" : ""}`,
    `${theme === "forbidden songs" ? "Canciones Prohibidas" : ""}`,
    `${theme === "transformation" ? "El Cambio Post-Ruptura" : ""}`,
    `${theme === "awkward encounter" ? "La Coincidencia Incómoda" : ""}`,
    `${theme === "breakup excuses" ? "La Excusa Perfecta" : ""}`,
    `${theme === "karaoke" ? "Karaoke del Despecho" : ""}`,
    `${theme === "secret crush" ? "El Crush Imposible" : ""}`,
    `${theme === "bad date" ? "La Cita del Horror" : ""}`,
    `${theme === "friendzone" ? "La Friendzone Eterna" : ""}`,
    `${theme === "detective work" ? "Detectives Privados" : ""}`,
    `${theme === "unsent messages" ? "Mensajes Archivados" : ""}`,
    `${theme === "music history" ? "El Soundtrack del Amor" : ""}`,
    `${theme === "digital flirting" ? "La Confesión Virtual" : ""}`,
    `${theme === "ex encounter" ? "Fantasmas del Pasado" : ""}`,
    `${theme === "digital memories" ? "Recuerdos Digitales" : ""}`,
    `${theme === "revenge" ? "El Arte de la Venganza" : ""}`,
    `${theme === "sad movies" ? "El Maratón de Lágrimas" : ""}`,
    `${theme === "ex calling" ? "La Llamada de Ex-Emergencia" : ""}`,
    `${theme === "vengeful singing" ? "El Karaoke de la Venganza" : ""}`,
    `${theme === "closure" ? "El Testamento Emocional" : ""}`,
    `${theme === "red flags" ? "El Detector de Banderas Rojas" : ""}`,
    // Fallback generic templates (if no specific theme matched)
    "Terapia de Cantina",
    "Confesiones de Medianoche",
    "Desamor en Directo",
    "Corazón en Reconstrucción",
    "Lágrimas al Ritmo",
    "Drama en Tres Actos",
    "Palabras No Dichas",
    "El Último Mensaje",
    "La Libreta de Rencores",
    "Memoria Selectiva",
  ]

  // Filter out empty strings and select a title
  const validTitles = titleTemplates.filter((title) => title !== "")
  if (validTitles.length === 0) {
    return "Corazón Roto Express"
  }
  return validTitles[Math.floor(Math.random() * validTitles.length)]
}

const generateChallenge = (parameters) => {
  const { emotionalTier, challengeType, theme } = parameters
  const challengeTemplates = {
    "social media": [
      "Comparte la indirecta más obvia que has publicado en redes esperando que tu ex la viera. Si nunca lo has hecho, inventa la más dramática posible.",
      "Revela cuántas veces has revisado las redes de tu ex en la última semana. El grupo decide si es normal o necesitas intervención.",
      "Muestra la última foto que subiste después de una ruptura buscando causar celos. Explica la estrategia detrás.",
    ],
    ghosting: [
      "Dramatiza el último mensaje que enviaste a alguien que te dejó en visto para siempre. El grupo vota si merecías respuesta.",
      "Explica la excusa más creativa que has inventado para justificar por qué alguien te dejó de hablar de repente.",
      "Recrea la reacción que tuviste cuando te diste cuenta que habías sido ghosteado/a.",
    ],
    stalking: [
      "Confiesa cuántas cuentas falsas has creado para ver stories de ex o confesa hasta qué familiar de tu ex has stalkeado en redes.",
      "Revela la investigación más exhaustiva que has realizado en redes para averiguar algo de tu crush o ex.",
      "Comparte el hallazgo más doloroso o sorprendente que descubriste stalkeando a alguien y cómo reaccionaste.",
    ],
    "drunk texts": [
      "Inventa y dramatiza el mensaje de voz que mandarías a tu ex después de 5 tragos. Todo el grupo debe aplaudir si fue suficientemente intenso.",
      "Muestra y narra el chat o mensaje más intenso que mandaste en pleno despecho (si no quieres mostrar el real, inventa uno aún más vergonzoso).",
      "Recrea el mensaje borracho que nunca deberías haber enviado o que te arrepientes de haber mandado.",
    ],
    music: [
      "Canta el coro de LA canción que escuchabas en repeat durante tu peor ruptura. Si no recuerdas la letra, el grupo elige una para que la cantes.",
      "Nombra esa canción que ya no puedes escuchar porque te recuerda demasiado a alguien. El grupo decide si es razonable o demasiado dramático.",
      "Crea en 30 segundos una playlist de 5 canciones que resuman tu vida amorosa. El grupo analiza tu estado emocional basado en tu selección.",
    ],
    blocking: [
      "Revela cuántas personas tienes bloqueadas por razones románticas y la historia detrás del bloqueo más justificado.",
      "Cuenta la historia de la persona que bloqueaste y desbloqueaste más veces y por qué no podías decidirte.",
      "Comparte qué tendría que pasar para desbloquear a la última persona que bloqueaste por razones sentimentales.",
    ],
    telenovela: [
      "Actúa como tía de novela mexicana y narra tu ruptura más dolorosa con todos los efectos dramáticos posibles.",
      "Recrea la reacción exacta que tendrías si te encuentras a tu ex ahora mismo con su nueva pareja. La dramatización debe ser realista.",
      "Inventa un diálogo de telenovela entre tú y tu ex que refleje todo lo que nunca te atreviste a decir.",
    ],
    keepsakes: [
      "Comparte el objeto más ridículo o sentimental que has guardado de una relación pasada y por qué no puedes tirarlo.",
      "Describe el ritual más extraño que has hecho para deshacerte de recuerdos de tu ex.",
      "Confiesa qué pertenencia de tu ex nunca devolviste a propósito y por qué la conservas.",
    ],
    "red flags": [
      "Describe la 'red flag' más obvia que ignoraste al principio de una relación. El grupo comparte si han ignorado la misma señal.",
      "Confiesa las señales de alarma más obvias que ignoraste en una relación pasada por estar enamorado/a.",
      "Comparte la 'green flag' que te hizo ignorar todas las 'red flags' en una relación pasada.",
    ],
    default: [
      "Cuenta la historia de tu peor ruptura en exactamente tres frases.",
      "Describe el momento más incómodo que has vivido con un ex después de terminar.",
      "Comparte el consejo amoroso más útil que has recibido y cómo lo has aplicado (o ignorado).",
      "Confiesa algo que nunca le dijiste a tu ex pero que desearías haber dicho.",
    ],
  }

  // Select appropriate challenge templates based on theme
  const templates = challengeTemplates[theme] || challengeTemplates.default

  // Add emotional tier modifiers
  let challenge = templates[Math.floor(Math.random() * templates.length)]
  if (emotionalTier === EMOTIONAL_TIERS.CHAOTIC.name) {
    challenge = challenge.replace("Comparte", "Confiesa con lujo de detalles")
    challenge = challenge.replace("Cuenta", "Revela sin filtros")
    challenge = challenge.replace("Describe", "Expón dramáticamente")
  }
  if (challengeType === CHALLENGE_TYPES.TERAPIA_GRUPAL.name) {
    challenge += " El grupo debe dar su opinión sincera al final."
  }

  return challenge
}

const generateSocialTrigger = (parameters) => {
  const { theme, emotionalTier } = parameters
  const triggerTemplates = [
    "Si alguien confiesa haber hecho lo mismo que te hicieron a ti, ambos ganan la cortesía.",
    "Si logras que al menos dos personas digan 'yo hubiera hecho lo mismo', desbloqueas la cortesía.",
    "Si el grupo vota que tu experiencia es la más dramática, ganas la cortesía.",
    "Si alguien del grupo admite haber reaccionado a alguna de tus indirectas, ambos toman.",
    "Si tienes el récord del rebote más rápido del grupo, todos deben aplaudirte de pie.",
    "Si alguien dice 'yo bloquearía por menos', ganas la cortesía.",
    "Si logras que alguien derrame una lágrima (de risa o emoción), desbloqueas la cortesía.",
    "Si alguien admite tener un objeto más ridículo aún guardado, comparten la cortesía.",
    "Si todos votan que tu trauma musical está justificado, ganas la cortesía.",
    "Si al menos dos personas aprueban tu transformación con un '¡qué upgrade!', ganas.",
    "Si alguien dice 'eso es peor que lo que me pasó a mí', ganas la inmunidad.",
    "Si alguien dice 'a mí me dijeron algo peor', ambos toman para olvidar.",
    "Si el grupo logra adivinar correctamente el motivo del despecho, todos ganan.",
    "Si alguien confiesa haber tenido un crush en ti sin que lo supieras, ambos ganan.",
    "Si la mayoría vota que fue demasiado horrible para una segunda cita, ganas por trauma.",
    "Si alguien dice 'yo estuve más tiempo en la friendzone', comparan historias y el grupo decide quién gana.",
    "Si alcanzas el nivel 'FBI profesional' según el voto del grupo, ganas la cortesía.",
    "Si el grupo grita 'SEND IT' al unísono, desbloqueas la cortesía.",
    "Si el diagnóstico del grupo coincide con tu situación real, desbloqueas la cortesía.",
    "Si alguien admite que caería con ese mensaje, ganas automáticamente.",
    "Si el grupo decide que tu reacción es la más madura, ganas por superación.",
    "Si tienes el tiempo más corto o más largo del grupo, ganas por extremista.",
    "Si al menos tres personas aplauden tu nivel de creatividad vengativa, ganas la cortesía.",
  ]

  // Add emotional tier-specific modifiers
  let socialTrigger = triggerTemplates[Math.floor(Math.random() * triggerTemplates.length)]
  if (emotionalTier === EMOTIONAL_TIERS.MILD.name) {
    // For mild cards, make triggers easier to achieve
    socialTrigger = socialTrigger.replace("tres personas", "una persona")
    socialTrigger = socialTrigger.replace("la mayoría", "al menos una persona")
  }
  if (emotionalTier === EMOTIONAL_TIERS.CHAOTIC.name) {
    // For chaotic cards, make triggers more demanding
    socialTrigger = socialTrigger.replace("dos personas", "la mayoría del grupo")
    socialTrigger = socialTrigger.replace("alguien", "al menos tres personas")
  }
  return socialTrigger
}

const generateReward = (parameters) => {
  const { theme, emotionalTier, challengeType } = parameters
  const rewardTemplates = [
    "1x Trago del Olvido Digital (para borrar la vergüenza)",
    "Premio Telenovela: Un brindis dedicado y todos deben llamarte 'Doña/Don' el resto de la noche",
    "Inmunidad Kármica: Todos brindan a tu salud y prometen no cruzarte jamás",
    "Tratamiento VIP: El grupo debe conseguirte el número de alguien en la fiesta",
    "Ritual Purificador: Todos levantan sus vasos y gritan 'NEXT!' mientras tú tomas",
    "Bono Nostálgico: Un shot dedicado a los recuerdos que no sirven pero no soltamos",
    "Minuto Musical: Puedes poner la canción que quieras y todos deben bailarla",
    "Consultoría de Imagen: Cada jugador debe darte un consejo de estilo para tu próxima conquista",
    "Kit de Supervivencia Social: Nadie puede retarte por las próximas dos rondas",
    "Premio a la Creatividad: Un brindis en tu honor y todos deben inventar una excusa mejor",
    "Concierto Privado: Todos deben cantar contigo una estrofa de la canción elegida",
    "Declaratoria Oficial: Todo el grupo debe decirte algo que te hace irresistible",
    "Segunda Oportunidad: Puedes retar a cualquier jugador a una actividad de tu elección",
    "Salida de la Zona: Todos te dan un consejo para nunca más caer en la friendzone",
    "Insignia de Detective: Los demás jugadores deben confesar algo que ocultan en sus redes",
    "Valor Líquido: Un shot para darte el valor que te faltó en ese momento",
    "DJ del Corazón: Puedes elegir las próximas 3 canciones de la fiesta",
    "Taller de Ligues: Cada jugador debe darte una frase para tu próxima conquista",
    "Exorcismo Emocional: Todos te dan un aplauso mientras gritan '¡Superado!'",
  ]

  // Add more specific rewards based on theme
  if (theme === "music") {
    rewardTemplates.push("Playlist Personalizada: Cada jugador debe sugerirte una canción para sanar")
    rewardTemplates.push("Certificado de Karaoke: Todos te nombran la voz del despecho")
  }
  if (theme === "revenge") {
    rewardTemplates.push("Medalla de Honor: El grupo certifica que tu venganza fue justificada")
    rewardTemplates.push("Karma Express: Todos imaginan un final dramático para tu ex")
  }
  if (theme === "telenovela") {
    rewardTemplates.push("Premio Óscar: Todo el grupo debe aplaudirte de pie")
    rewardTemplates.push("Estelar Protagónico: Puedes asignar roles de telenovela a los demás jugadores")
  }

  let reward = rewardTemplates[Math.floor(Math.random() * rewardTemplates.length)]

  // Modify based on emotional tier
  if (emotionalTier === EMOTIONAL_TIERS.CHAOTIC.name) {
    reward = reward.replace("Un shot", "Un shot doble")
    reward = reward.replace("brindis", "brindis ceremonial")
  }

  return reward
}

// Main card generator function
const generateCard = (parameters = {}) => {
  // Set default parameters if not provided
  const theme =
    parameters.theme ||
    [
      "social media",
      "ghosting",
      "stalking",
      "drunk texts",
      "music",
      "blocking",
      "telenovela",
      "keepsakes",
      "red flags",
      "breakup excuses",
      "secret crush",
      "bad date",
      "friendzone",
      "detective work",
      "unsent messages",
      "music history",
      "digital flirting",
      "ex encounter",
      "digital memories",
      "revenge",
      "sad movies",
      "ex calling",
      "vengeful singing",
      "closure",
    ][Math.floor(Math.random() * 24)]
  const emotionalTier =
    parameters.emotionalTier ||
    [EMOTIONAL_TIERS.MILD.name, EMOTIONAL_TIERS.INTENSE.name, EMOTIONAL_TIERS.CHAOTIC.name][
      Math.floor(Math.random() * 3)
    ]
  const challengeType =
    parameters.challengeType ||
    [
      CHALLENGE_TYPES.CANTA_O_LLORA.name,
      CHALLENGE_TYPES.DESPECHO_IRL.name,
      CHALLENGE_TYPES.TERAPIA_GRUPAL.name,
      CHALLENGE_TYPES.DIGITAL_DRAMA.name,
      CHALLENGE_TYPES.CONFESIONARIO.name,
    ][Math.floor(Math.random() * 5)]

  // Get a list of songs matching the theme mood
  let matchingSongs = songDatabase
  if (parameters.genreTag) {
    matchingSongs = matchingSongs.filter((song) => song.genre === parameters.genreTag)
  }
  if (parameters.emotionalIntensity) {
    const intensityRange = 2 // How much variation to allow
    matchingSongs = matchingSongs.filter(
      (song) => Math.abs(song.emotionalIntensity - parameters.emotionalIntensity) <= intensityRange,
    )
  }

  // If no songs match our criteria, use the full database
  if (matchingSongs.length === 0) {
    matchingSongs = songDatabase
  }

  // Select a random song from matching options
  const selectedSong = matchingSongs[Math.floor(Math.random() * matchingSongs.length)]

  // Generate each component of the card
  const card = {
    card_title: generateCardTitle({ emotionalTier, challengeType, theme }),
    challenge: generateChallenge({ emotionalTier, challengeType, theme }),
    genre_tag: selectedSong.genre,
    spotify_song: {
      title: selectedSong.title,
      artist: selectedSong.artist,
      url: selectedSong.url,
    },
    social_trigger: generateSocialTrigger({ theme, emotionalTier }),
    reward: generateReward({ theme, emotionalTier, challengeType }),
  }

  return card
}

// Function to generate a complete deck of cards
const generateDeck = (options = {}) => {
  const {
    deckSize = 20,
    emotionalTierDistribution = { MILD: 0.3, INTENSE: 0.5, CHAOTIC: 0.2 },
    themeDistribution = {},
    minIntensity = 1,
    maxIntensity = 10,
    avoidDuplicates = true,
  } = options

  const deck = []
  const usedTitles = new Set()
  const usedChallenges = new Set()

  // Create a distribution of emotional tiers based on the options
  const tierDistribution = []
  Object.entries(emotionalTierDistribution).forEach(([tier, percentage]) => {
    const count = Math.floor(deckSize * percentage)
    for (let i = 0; i < count; i++) {
      tierDistribution.push(tier)
    }
  })

  // Fill the rest with INTENSE if the distribution doesn't add up to deckSize
  while (tierDistribution.length < deckSize) {
    tierDistribution.push("INTENSE")
  }

  // Shuffle the tier distribution
  for (let i = tierDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tierDistribution[i], tierDistribution[j]] = [tierDistribution[j], tierDistribution[i]]
  }

  // Generate cards with the distributed emotional tiers
  for (let i = 0; i < deckSize; i++) {
    const emotionalTier = tierDistribution[i]
    let card
    let attempts = 0
    const maxAttempts = 10
    do {
      card = generateCard({ emotionalTier })
      attempts++
      // Break the loop if we've tried too many times or if duplicates are allowed
      if (attempts > maxAttempts || !avoidDuplicates) {
        break
      }
    } while (usedTitles.has(card.card_title) || usedChallenges.has(card.challenge))

    // Mark the title and challenge as used
    usedTitles.add(card.card_title)
    usedChallenges.add(card.challenge)

    deck.push(card)
  }

  return deck
}

// Function to filter deck by criteria
const filterDeck = (deck, criteria = {}) => {
  return deck.filter((card) => {
    // Filter by emotional tier if specified
    if (criteria.emotionalTier && card.emotionalTier !== criteria.emotionalTier) {
      return false
    }
    // Filter by genre tag if specified
    if (criteria.genreTag && card.genre_tag !== criteria.genreTag) {
      return false
    }
    // Filter by theme if specified
    if (criteria.theme) {
      // Simple check if the card's challenge contains keywords related to the theme
      const themeKeywords = criteria.theme.split(" ")
      if (!themeKeywords.every((keyword) => card.challenge.includes(keyword))) {
        return false
      }
    }
    return true
  })
}

// Export the functions and constants for use in other modules
export { GENRE_TAGS, EMOTIONAL_TIERS, CHALLENGE_TYPES, songDatabase, generateCard, generateDeck, filterDeck }
