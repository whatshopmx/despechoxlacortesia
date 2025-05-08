import type { UnifiedCard, ChallengeCategory, ExperienceType, ChallengeType } from "./unified-card-model"

// Tipos para organizar las colecciones
export type CardCollection = {
  id: string
  name: string
  description: string
  icon: string
  cards: UnifiedCard[]
  tags: string[]
  difficulty: "easy" | "medium" | "hard" | "mixed"
  recommended_for: ("beginners" | "friends" | "couples" | "parties" | "brands")[]
}

// Colección de Despecho (Desamor)
const despecho: UnifiedCard[] = [
  {
    card_id: "despecho_1",
    card_title: "Karaoke del Despecho",
    challenge: "Canta el coro de una canción que te recuerde a tu ex",
    challenge_type: "individual",
    challenge_category: "karaoke",
    interaction_format: "canto_memoria",
    tone_subtype: "melodramatico",
    emotional_tier: "intense",
    core_emotion: "sadness",
    emotional_intensity: "high",
    visual_style: "dramatic",
    theme_tag: "#Despecho",
    genre_tag: "Balada Dramática",
    social_trigger: "Si alguien más se une a cantar contigo, ambos ganan un bonus",
    verification_type: "audio",
    reward: "Sticker 'Corazón Roto'",
    reward_type: "sticker",
    spotify_song: {
      title: "Ya lo sé",
      artist: "Christian Nodal",
    },
    experience_type: "group",
    difficulty_level: "medium",
    time_limit: 60,
  },
  {
    card_id: "despecho_2",
    card_title: "Confesiones de Medianoche",
    challenge: "Confiesa el mensaje más vergonzoso que has enviado a alguien que te gustaba",
    challenge_type: "individual",
    challenge_category: "confesion",
    interaction_format: "texto_imagen",
    tone_subtype: "vulnerable",
    emotional_tier: "intense",
    theme_tag: "#MensajesDesesperados",
    genre_tag: "Confesiones Íntimas",
    social_trigger: "Si alguien dice 'yo también', ambos ganan un bonus",
    verification_type: "self",
    reward: "Shot de consolación",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "despecho_3",
    card_title: "Poesía del Desamor",
    challenge: "Improvisa un poema de 4 versos sobre tu peor ruptura",
    challenge_type: "individual",
    challenge_category: "creativo",
    interaction_format: "voz_texto",
    tone_subtype: "poetico",
    emotional_tier: "intense",
    theme_tag: "#PoesíaDespechada",
    genre_tag: "Poesía del Desamor",
    social_trigger: "Si tu poema hace que alguien diga 'wow', duplica tu recompensa",
    verification_type: "audio",
    reward: "Sticker 'Poeta del Despecho'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "hard",
  },
  {
    card_id: "despecho_4",
    card_title: "Teorías Conspirativas",
    challenge: "Elabora una teoría absurda sobre por qué todas tus relaciones terminan de forma similar",
    challenge_type: "individual",
    challenge_category: "teorias",
    interaction_format: "teorias_revelacion",
    tone_subtype: "humoristico",
    emotional_tier: "mild",
    theme_tag: "#TeoriasDespechadas",
    genre_tag: "Comedia Romántica",
    social_trigger: "Si alguien añade a tu teoría, ambos ganan un bonus",
    verification_type: "group",
    reward: "Sticker 'Teórico del Amor'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
  {
    card_id: "despecho_5",
    card_title: "Meme del Ex",
    challenge: "Describe un meme que represente perfectamente tu última ruptura",
    challenge_type: "individual",
    challenge_category: "meme",
    interaction_format: "descripcion_meme",
    tone_subtype: "sarcastico",
    emotional_tier: "mild",
    theme_tag: "#MemesDeRuptura",
    genre_tag: "Comedia Negra",
    social_trigger: "Si alguien se ríe a carcajadas, ganas un bonus",
    verification_type: "self",
    reward: "Sticker 'Meme Lord'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
]

// Colección de Fiesta
const fiesta: UnifiedCard[] = [
  {
    card_id: "fiesta_1",
    card_title: "Karaoke Frenético",
    challenge: "Canta el coro de tu canción favorita de fiesta lo más rápido posible",
    challenge_type: "individual",
    challenge_category: "karaoke",
    interaction_format: "canto_tempo",
    tone_subtype: "acelerado",
    emotional_tier: "intense",
    theme_tag: "#FiestaTotal",
    genre_tag: "Pop Frenético",
    social_trigger: "Si alguien baila mientras cantas, duplica tu recompensa",
    verification_type: "audio",
    reward: "Shot de celebración",
    reward_type: "shot",
    spotify_song: {
      title: "Gasolina",
      artist: "Daddy Yankee",
    },
    experience_type: "group",
    difficulty_level: "medium",
    time_limit: 45,
  },
  {
    card_id: "fiesta_2",
    card_title: "Historia de Fiesta",
    challenge: "Cuenta la anécdota más loca que hayas vivido en una fiesta",
    challenge_type: "individual",
    challenge_category: "social",
    interaction_format: "texto_imagen",
    tone_subtype: "caotico",
    emotional_tier: "chaotic",
    theme_tag: "#HistoriasDeFiesta",
    genre_tag: "Comedia Caótica",
    social_trigger: "Si alguien dice 'yo estuve ahí', ambos ganan un bonus",
    verification_type: "self",
    reward: "Sticker 'Rey/Reina de la Fiesta'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
  {
    card_id: "fiesta_3",
    card_title: "Coreografía Improvisada",
    challenge: "Inventa una coreografía de 15 segundos para la canción que está sonando",
    challenge_type: "individual",
    challenge_category: "improvisacion",
    interaction_format: "actuacion_voz",
    tone_subtype: "comico",
    emotional_tier: "intense",
    theme_tag: "#BaileSalvaje",
    genre_tag: "Comedia Física",
    social_trigger: "Si alguien se une a tu coreografía, triplica tu recompensa",
    verification_type: "photo",
    reward: "Combo 'Bailarín Estrella'",
    reward_type: "combo",
    experience_type: "group",
    difficulty_level: "medium",
    time_limit: 30,
  },
  {
    card_id: "fiesta_4",
    card_title: "Imitación de Celebridad",
    challenge: "Imita a una celebridad en estado de ebriedad",
    challenge_type: "individual",
    challenge_category: "imitacion",
    interaction_format: "actuacion_voz",
    tone_subtype: "humoristico",
    emotional_tier: "mild",
    theme_tag: "#ImitacionEstelar",
    genre_tag: "Comedia de Imitación",
    social_trigger: "Si alguien adivina a quién imitas, ambos ganan un bonus",
    verification_type: "group",
    reward: "Shot de premio",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "fiesta_5",
    card_title: "Selfie Grupal",
    challenge: "Toma una selfie grupal con la pose más ridícula que se te ocurra",
    challenge_type: "group",
    challenge_category: "fotografia",
    interaction_format: "descripcion_imagen",
    tone_subtype: "comico",
    emotional_tier: "mild",
    theme_tag: "#SelfieLocura",
    genre_tag: "Comedia Visual",
    social_trigger: "Si todos hacen una cara diferente, todos ganan un bonus",
    verification_type: "photo",
    reward: "Sticker 'Selfie Legendaria'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
]

// Colección de Confesiones
const confesiones: UnifiedCard[] = [
  {
    card_id: "confesion_1",
    card_title: "Secreto Inconfesable",
    challenge: "Confiesa algo que nunca le has dicho a nadie en esta mesa",
    challenge_type: "individual",
    challenge_category: "confesion",
    interaction_format: "texto_imagen",
    tone_subtype: "confesional",
    emotional_tier: "intense",
    theme_tag: "#SecretosOscuros",
    genre_tag: "Confesiones Íntimas",
    social_trigger: "Si tu confesión deja a todos en silencio por 5 segundos, duplica tu recompensa",
    verification_type: "group",
    reward: "Shot de valor",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "hard",
  },
  {
    card_id: "confesion_2",
    card_title: "Mensaje Revelador",
    challenge: "Muestra el último mensaje vergonzoso que enviaste (puedes ocultar el nombre)",
    challenge_type: "individual",
    challenge_category: "mensajes",
    interaction_format: "texto_imagen",
    tone_subtype: "vulnerable",
    emotional_tier: "intense",
    theme_tag: "#MensajesExpuestos",
    genre_tag: "Exposición Digital",
    social_trigger: "Si alguien dice 'yo he enviado algo peor', ambos ganan un bonus",
    verification_type: "photo",
    reward: "Sticker 'Mensajero Valiente'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "confesion_3",
    card_title: "Verdad o Verdad",
    challenge: "Responde con total honestidad: ¿Cuál ha sido tu momento más vergonzoso en público?",
    challenge_type: "individual",
    challenge_category: "confesion",
    interaction_format: "texto_imagen",
    tone_subtype: "vulnerable",
    emotional_tier: "mild",
    theme_tag: "#VerdadesIncómodas",
    genre_tag: "Confesiones Cómicas",
    social_trigger: "Si alguien dice 'me pasó algo similar', ambos ganan un bonus",
    verification_type: "self",
    reward: "Sticker 'Honestidad Brutal'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "confesion_4",
    card_title: "Crush Secreto",
    challenge: "Confiesa quién fue tu crush más inesperado o inapropiado",
    challenge_type: "individual",
    challenge_category: "confesion",
    interaction_format: "texto_imagen",
    tone_subtype: "confesional",
    emotional_tier: "intense",
    theme_tag: "#CrushSecreto",
    genre_tag: "Romance Prohibido",
    social_trigger: "Si alguien confiesa un crush más inapropiado, ambos ganan un bonus",
    verification_type: "self",
    reward: "Shot de confesión",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "hard",
  },
  {
    card_id: "confesion_5",
    card_title: "La Gran Mentira",
    challenge: "Confiesa la mentira más grande que has dicho para impresionar a alguien",
    challenge_type: "individual",
    challenge_category: "confesion",
    interaction_format: "texto_imagen",
    tone_subtype: "humoristico",
    emotional_tier: "mild",
    theme_tag: "#MentirasBlancas",
    genre_tag: "Comedia de Errores",
    social_trigger: "Si alguien se ríe a carcajadas, ganas un bonus",
    verification_type: "self",
    reward: "Sticker 'Mentiroso Profesional'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
]

// Colección de Retos Creativos
const creativos: UnifiedCard[] = [
  {
    card_id: "creativo_1",
    card_title: "Poeta Improvisado",
    challenge: "Crea un poema de 4 versos usando las palabras: luna, tequila, corazón y destino",
    challenge_type: "individual",
    challenge_category: "creativo",
    interaction_format: "voz_texto",
    tone_subtype: "poetico",
    emotional_tier: "mild",
    theme_tag: "#PoesíaImprovisada",
    genre_tag: "Poesía Experimental",
    social_trigger: "Si tu poema hace que alguien diga 'profundo', ganas un bonus",
    verification_type: "audio",
    reward: "Sticker 'Poeta Laureado'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "creativo_2",
    card_title: "Historia en 30 Segundos",
    challenge: "Inventa una historia de terror en 30 segundos usando el nombre de alguien de la mesa",
    challenge_type: "individual",
    challenge_category: "improvisacion",
    interaction_format: "voz_texto",
    tone_subtype: "fantasmagorico",
    emotional_tier: "intense",
    theme_tag: "#MicroTerror",
    genre_tag: "Terror Express",
    social_trigger: "Si logras asustar a alguien, duplica tu recompensa",
    verification_type: "group",
    reward: "Sticker 'Narrador Macabro'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "medium",
    time_limit: 30,
  },
  {
    card_id: "creativo_3",
    card_title: "Dibujante Veloz",
    challenge: "Dibuja en 20 segundos el emoji que mejor represente tu estado emocional actual",
    challenge_type: "individual",
    challenge_category: "arte",
    interaction_format: "descripcion_imagen",
    tone_subtype: "expresivo",
    emotional_tier: "mild",
    theme_tag: "#ArteExpress",
    genre_tag: "Arte Conceptual",
    social_trigger: "Si alguien adivina correctamente tu emoción, ambos ganan un bonus",
    verification_type: "photo",
    reward: "Sticker 'Artista del Alma'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
    time_limit: 20,
  },
  {
    card_id: "creativo_4",
    card_title: "Eslogan Personal",
    challenge: "Crea un eslogan publicitario para venderte como pareja ideal",
    challenge_type: "individual",
    challenge_category: "creativo",
    interaction_format: "texto_imagen",
    tone_subtype: "humoristico",
    emotional_tier: "mild",
    theme_tag: "#MarketingPersonal",
    genre_tag: "Comedia Publicitaria",
    social_trigger: "Si alguien dice 'yo compraría', ganas un bonus",
    verification_type: "self",
    reward: "Sticker 'Genio del Marketing'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
  {
    card_id: "creativo_5",
    card_title: "Canción Improvisada",
    challenge: "Improvisa una canción de 20 segundos sobre la persona a tu derecha",
    challenge_type: "individual",
    challenge_category: "improvisacion",
    interaction_format: "canto_memoria",
    tone_subtype: "humoristico",
    emotional_tier: "intense",
    theme_tag: "#CanciónPersonalizada",
    genre_tag: "Comedia Musical",
    social_trigger: "Si la persona sobre la que cantas se sonroja, duplica tu recompensa",
    verification_type: "audio",
    reward: "Shot de inspiración",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "hard",
    time_limit: 20,
  },
]

// Colección de Retos para Marcas (Patrocinados)
const marcas: UnifiedCard[] = [
  {
    card_id: "marca_1",
    card_title: "Eslogan Creativo",
    challenge: "Crea un eslogan alternativo para Don Julio que haga reír a todos",
    challenge_type: "individual",
    challenge_category: "creativo",
    interaction_format: "texto_imagen",
    tone_subtype: "humoristico",
    emotional_tier: "mild",
    theme_tag: "#MarketingCreativo",
    genre_tag: "Publicidad Alternativa",
    social_trigger: "Si alguien dice 'deberían usarlo de verdad', duplica tu recompensa",
    verification_type: "group",
    reward: "Shot de Don Julio",
    reward_type: "product",
    brand_sponsor: {
      id: "don_julio",
      name: "Don Julio",
      logo: "/brands/don-julio-logo.png",
      industry: "spirits",
      rewardValue: 100,
    },
    experience_type: "campaign",
    difficulty_level: "easy",
  },
  {
    card_id: "marca_2",
    card_title: "Jingle Improvisado",
    challenge: "Crea un jingle de 15 segundos para Tecate que todos puedan corear",
    challenge_type: "individual",
    challenge_category: "karaoke",
    interaction_format: "canto_memoria",
    tone_subtype: "humoristico",
    emotional_tier: "mild",
    theme_tag: "#JingleCreativo",
    genre_tag: "Publicidad Musical",
    social_trigger: "Si todos cantan tu jingle, triplica tu recompensa",
    verification_type: "audio",
    reward: "Cerveza Tecate gratis",
    reward_type: "product",
    brand_sponsor: {
      id: "tecate",
      name: "Tecate",
      logo: "/brands/tecate-logo.png",
      industry: "beer",
      rewardValue: 80,
    },
    experience_type: "campaign",
    difficulty_level: "medium",
    time_limit: 15,
  },
  {
    card_id: "marca_3",
    card_title: "Playlist Perfecta",
    challenge: "Nombra 3 canciones que deberían estar en la playlist oficial de Spotify para La Cortesía",
    challenge_type: "individual",
    challenge_category: "creativo",
    interaction_format: "lista_concepto",
    tone_subtype: "reflexivo",
    emotional_tier: "mild",
    theme_tag: "#PlaylistPerfecta",
    genre_tag: "Curaduría Musical",
    social_trigger: "Si alguien dice 'esa canción es perfecta', ganas un bonus",
    verification_type: "self",
    reward: "1 mes de Spotify Premium",
    reward_type: "product",
    brand_sponsor: {
      id: "spotify",
      name: "Spotify",
      logo: "/brands/spotify-logo.png",
      industry: "music",
      rewardValue: 120,
    },
    experience_type: "campaign",
    difficulty_level: "easy",
  },
  {
    card_id: "marca_4",
    card_title: "Historia de Entrega",
    challenge: "Cuenta la anécdota más extraña que has vivido con un repartidor de comida",
    challenge_type: "individual",
    challenge_category: "social",
    interaction_format: "texto_imagen",
    tone_subtype: "humoristico",
    emotional_tier: "mild",
    theme_tag: "#HistoriasDeEntrega",
    genre_tag: "Comedia de Situación",
    social_trigger: "Si tu historia hace reír a todos, ganas un bonus",
    verification_type: "self",
    reward: "Cupón de $200 en Uber Eats",
    reward_type: "product",
    brand_sponsor: {
      id: "uber_eats",
      name: "Uber Eats",
      logo: "/brands/uber-eats-logo.png",
      industry: "food_delivery",
      rewardValue: 200,
    },
    experience_type: "campaign",
    difficulty_level: "easy",
  },
  {
    card_id: "marca_5",
    card_title: "Mixología Creativa",
    challenge: "Inventa un cóctel con Don Julio y ponle un nombre creativo",
    challenge_type: "individual",
    challenge_category: "creativo",
    interaction_format: "texto_imagen",
    tone_subtype: "creativo",
    emotional_tier: "mild",
    theme_tag: "#CóctelesCreativos",
    genre_tag: "Mixología Experimental",
    social_trigger: "Si alguien dice 'yo lo probaría', ganas un bonus",
    verification_type: "self",
    reward: "Tarjeta ZeroSum con Don Julio por valor de 150 MXN",
    reward_type: "zerosum_card",
    brand_sponsor: {
      id: "don_julio",
      name: "Don Julio",
      logo: "/brands/don-julio-logo.png",
      industry: "spirits",
      rewardValue: 150,
    },
    experience_type: "campaign",
    difficulty_level: "medium",
  },
]

// Colección de Retos Grupales
const grupales: UnifiedCard[] = [
  {
    card_id: "grupal_1",
    card_title: "Coro Improvisado",
    challenge: "Todo el grupo debe cantar el coro de una canción popular, cada uno una línea",
    challenge_type: "group",
    challenge_category: "karaoke",
    interaction_format: "canto_memoria",
    tone_subtype: "comico",
    emotional_tier: "intense",
    theme_tag: "#CoroGrupal",
    genre_tag: "Karaoke Colectivo",
    social_trigger: "Si logran terminar la canción sin equivocarse, todos ganan un bonus",
    verification_type: "audio",
    reward: "Shot para todos",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "medium",
    time_limit: 60,
  },
  {
    card_id: "grupal_2",
    card_title: "Cadena de Historias",
    challenge: "Creen una historia de amor, cada uno añadiendo una frase",
    challenge_type: "group",
    challenge_category: "improvisacion",
    interaction_format: "texto_imagen",
    tone_subtype: "melodramatico",
    emotional_tier: "mild",
    theme_tag: "#HistoriaColectiva",
    genre_tag: "Narrativa Colaborativa",
    social_trigger: "Si la historia tiene un final inesperado, todos ganan un bonus",
    verification_type: "group",
    reward: "Sticker 'Narradores Épicos'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
  {
    card_id: "grupal_3",
    card_title: "Foto Temática",
    challenge: "Tomen una foto grupal que represente una escena de telenovela",
    challenge_type: "group",
    challenge_category: "fotografia",
    interaction_format: "descripcion_imagen",
    tone_subtype: "melodramatico",
    emotional_tier: "intense",
    theme_tag: "#FotoTelenovela",
    genre_tag: "Drama Visual",
    social_trigger: "Si la foto parece realmente una telenovela, todos ganan un bonus",
    verification_type: "photo",
    reward: "Combo 'Actores de Telenovela'",
    reward_type: "combo",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "grupal_4",
    card_title: "Debate Absurdo",
    challenge: "Debatan por 1 minuto: ¿Es el reggaetón una forma válida de poesía moderna?",
    challenge_type: "group",
    challenge_category: "improvisacion",
    interaction_format: "actuacion_voz",
    tone_subtype: "sarcastico",
    emotional_tier: "mild",
    theme_tag: "#DebateAbsurdo",
    genre_tag: "Comedia de Debate",
    social_trigger: "Si alguien usa un argumento realmente convincente, todos ganan un bonus",
    verification_type: "group",
    reward: "Sticker 'Maestros del Debate'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "medium",
    time_limit: 60,
  },
  {
    card_id: "grupal_5",
    card_title: "Coreografía Express",
    challenge: "Creen una coreografía grupal de 15 segundos para la canción actual",
    challenge_type: "group",
    challenge_category: "improvisacion",
    interaction_format: "actuacion_voz",
    tone_subtype: "comico",
    emotional_tier: "intense",
    theme_tag: "#BaileGrupal",
    genre_tag: "Danza Colaborativa",
    social_trigger: "Si logran sincronizarse perfectamente, todos ganan un bonus",
    verification_type: "photo",
    reward: "Shot para todos",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "hard",
    time_limit: 30,
  },
]

// Colección de Retos Románticos
const romanticos: UnifiedCard[] = [
  {
    card_id: "romantico_1",
    card_title: "Declaración Poética",
    challenge: "Haz una declaración de amor improvisada a la persona a tu izquierda",
    challenge_type: "duet",
    challenge_category: "roleplay",
    interaction_format: "actuacion_voz",
    tone_subtype: "poetico",
    emotional_tier: "intense",
    theme_tag: "#DeclaraciónImprovisada",
    genre_tag: "Romance Poético",
    social_trigger: "Si la persona se sonroja, duplica tu recompensa",
    verification_type: "group",
    reward: "Sticker 'Poeta Romántico'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "romantico_2",
    card_title: "Serenata Sorpresa",
    challenge: "Canta 20 segundos de una canción romántica a alguien de la mesa",
    challenge_type: "duet",
    challenge_category: "karaoke",
    interaction_format: "canto_memoria",
    tone_subtype: "melodramatico",
    emotional_tier: "intense",
    theme_tag: "#SerenataExpress",
    genre_tag: "Balada Romántica",
    social_trigger: "Si la persona te aplaude al final, duplica tu recompensa",
    verification_type: "audio",
    reward: "Shot compartido",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "hard",
    time_limit: 20,
  },
  {
    card_id: "romantico_3",
    card_title: "Cumplidos Sinceros",
    challenge: "Da tres cumplidos sinceros a la persona frente a ti",
    challenge_type: "duet",
    challenge_category: "social",
    interaction_format: "texto_imagen",
    tone_subtype: "vulnerable",
    emotional_tier: "mild",
    theme_tag: "#CumplidosSinceros",
    genre_tag: "Conexión Auténtica",
    social_trigger: "Si la persona se emociona visiblemente, ambos ganan un bonus",
    verification_type: "group",
    reward: "Sticker 'Conexión Genuina'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "easy",
  },
  {
    card_id: "romantico_4",
    card_title: "Primera Cita Ideal",
    challenge: "Describe tu cita ideal con alguien de la mesa (sin nombrar a quién)",
    challenge_type: "individual",
    challenge_category: "imaginacion",
    interaction_format: "texto_imagen",
    tone_subtype: "romantico",
    emotional_tier: "mild",
    theme_tag: "#CitaIdeal",
    genre_tag: "Fantasía Romántica",
    social_trigger: "Si alguien adivina a quién te refieres, ambos ganan un bonus",
    verification_type: "self",
    reward: "Sticker 'Romántico Secreto'",
    reward_type: "sticker",
    experience_type: "group",
    difficulty_level: "medium",
  },
  {
    card_id: "romantico_5",
    card_title: "Miradas Intensas",
    challenge: "Mantén contacto visual con la persona a tu derecha por 30 segundos sin reír",
    challenge_type: "duet",
    challenge_category: "social",
    interaction_format: "actuacion_voz",
    tone_subtype: "intenso",
    emotional_tier: "intense",
    theme_tag: "#MiradasProfundas",
    genre_tag: "Conexión Visual",
    social_trigger: "Si ninguno de los dos ríe, ambos ganan un bonus",
    verification_type: "group",
    reward: "Shot compartido",
    reward_type: "shot",
    experience_type: "group",
    difficulty_level: "medium",
    time_limit: 30,
  },
]

// Definir todas las colecciones
export const cardCollections: CardCollection[] = [
  {
    id: "despecho",
    name: "Despecho",
    description: "Retos sobre desamor, rupturas y experiencias románticas fallidas",
    icon: "heart-crack",
    cards: despecho,
    tags: ["desamor", "ruptura", "ex", "drama"],
    difficulty: "medium",
    recommended_for: ["friends", "parties"],
  },
  {
    id: "fiesta",
    name: "Fiesta Total",
    description: "Retos divertidos y enérgicos para animar cualquier fiesta",
    icon: "party-popper",
    cards: fiesta,
    tags: ["diversión", "energía", "baile", "música"],
    difficulty: "easy",
    recommended_for: ["parties", "friends"],
  },
  {
    id: "confesiones",
    name: "Confesiones",
    description: "Retos para revelar secretos y hacer confesiones inesperadas",
    icon: "message-square",
    cards: confesiones,
    tags: ["secretos", "revelaciones", "verdad", "intimidad"],
    difficulty: "hard",
    recommended_for: ["friends", "couples"],
  },
  {
    id: "creativos",
    name: "Creativos",
    description: "Retos que ponen a prueba tu creatividad e improvisación",
    icon: "palette",
    cards: creativos,
    tags: ["creatividad", "arte", "improvisación", "talento"],
    difficulty: "medium",
    recommended_for: ["beginners", "friends", "parties"],
  },
  {
    id: "marcas",
    name: "Patrocinados",
    description: "Retos patrocinados por marcas con recompensas especiales",
    icon: "badge",
    cards: marcas,
    tags: ["marcas", "patrocinios", "premios", "productos"],
    difficulty: "easy",
    recommended_for: ["brands", "parties"],
  },
  {
    id: "grupales",
    name: "Grupales",
    description: "Retos diseñados para ser completados por todo el grupo",
    icon: "users",
    cards: grupales,
    tags: ["grupo", "colaboración", "equipo", "diversión"],
    difficulty: "medium",
    recommended_for: ["parties", "friends"],
  },
  {
    id: "romanticos",
    name: "Románticos",
    description: "Retos con temática romántica para crear conexiones",
    icon: "heart",
    cards: romanticos,
    tags: ["romance", "conexión", "parejas", "coqueteo"],
    difficulty: "medium",
    recommended_for: ["couples", "parties"],
  },
]

// Función para obtener todas las cartas
export function getAllCards(): UnifiedCard[] {
  return cardCollections.flatMap((collection) => collection.cards)
}

// Función para obtener cartas por colección
export function getCardsByCollection(collectionId: string): UnifiedCard[] {
  const collection = cardCollections.find((c) => c.id === collectionId)
  return collection ? collection.cards : []
}

// Función para obtener cartas por categoría
export function getCardsByCategory(category: ChallengeCategory): UnifiedCard[] {
  return getAllCards().filter((card) => card.challenge_category === category)
}

// Función para obtener cartas por tipo de experiencia
export function getCardsByExperienceType(experienceType: ExperienceType): UnifiedCard[] {
  return getAllCards().filter((card) => card.experience_type === experienceType)
}

// Función para obtener cartas por nivel de dificultad
export function getCardsByDifficulty(difficulty: "easy" | "medium" | "hard"): UnifiedCard[] {
  return getAllCards().filter((card) => card.difficulty_level === difficulty)
}

// Función para obtener cartas por tipo de reto
export function getCardsByChallengeType(challengeType: ChallengeType): UnifiedCard[] {
  return getAllCards().filter((card) => card.challenge_type === challengeType)
}

// Función para obtener cartas por marca patrocinadora
export function getCardsByBrand(brandId: string): UnifiedCard[] {
  return getAllCards().filter((card) => card.brand_sponsor && card.brand_sponsor.id === brandId)
}

// Función para buscar cartas por texto
export function searchCards(query: string): UnifiedCard[] {
  const lowerQuery = query.toLowerCase()
  return getAllCards().filter(
    (card) =>
      card.card_title.toLowerCase().includes(lowerQuery) ||
      card.challenge.toLowerCase().includes(lowerQuery) ||
      card.theme_tag.toLowerCase().includes(lowerQuery) ||
      card.genre_tag.toLowerCase().includes(lowerQuery),
  )
}

// Función para obtener una carta aleatoria
export function getRandomCard(): UnifiedCard {
  const allCards = getAllCards()
  return allCards[Math.floor(Math.random() * allCards.length)]
}

// Función para obtener una carta aleatoria de una colección
export function getRandomCardFromCollection(collectionId: string): UnifiedCard {
  const cards = getCardsByCollection(collectionId)
  return cards[Math.floor(Math.random() * cards.length)]
}

// Función para obtener una carta por ID
export function getCardById(cardId: string): UnifiedCard | undefined {
  return getAllCards().find((card) => card.card_id === cardId)
}

// Función para obtener cartas recomendadas para un tipo de usuario
export function getRecommendedCards(
  userType: "beginners" | "friends" | "couples" | "parties" | "brands",
): UnifiedCard[] {
  const recommendedCollections = cardCollections.filter((collection) => collection.recommended_for.includes(userType))
  return recommendedCollections.flatMap((collection) => collection.cards)
}

// Función para obtener un mazo aleatorio de cartas
export function getRandomDeck(size = 10): UnifiedCard[] {
  const allCards = getAllCards()
  const shuffled = [...allCards].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, size)
}

// Función para obtener un mazo temático
export function getThematicDeck(theme: string, size = 10): UnifiedCard[] {
  let thematicCards: UnifiedCard[] = []

  // Buscar por colección
  const collection = cardCollections.find((c) => c.id === theme || c.name.toLowerCase() === theme.toLowerCase())
  if (collection) {
    thematicCards = collection.cards
  } else {
    // Buscar por tags
    thematicCards = getAllCards().filter(
      (card) =>
        card.theme_tag.toLowerCase().includes(theme.toLowerCase()) ||
        card.genre_tag.toLowerCase().includes(theme.toLowerCase()),
    )
  }

  // Si no hay suficientes cartas, completar con cartas aleatorias
  if (thematicCards.length < size) {
    const remainingCards = getAllCards()
      .filter((card) => !thematicCards.some((tc) => tc.card_id === card.card_id))
      .sort(() => 0.5 - Math.random())
      .slice(0, size - thematicCards.length)

    thematicCards = [...thematicCards, ...remainingCards]
  }

  // Si hay más cartas que el tamaño solicitado, seleccionar aleatoriamente
  if (thematicCards.length > size) {
    thematicCards = thematicCards.sort(() => 0.5 - Math.random()).slice(0, size)
  }

  return thematicCards
}
