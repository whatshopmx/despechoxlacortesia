/**
 * Plantillas para La Lotería del Despecho
 * Estas plantillas combinan humor, drama y viralidad para generar contenido interactivo
 */

export type DespechoChallengeType =
  | "chat_toxico"
  | "instagram_despechado"
  | "meme_despecho"
  | "revista_drama"
  | "tiktok_despecho"
  | "perfil_citas"
  | "notificacion_redflag"

export interface DespechoTemplate {
  id: string
  type: DespechoChallengeType
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  promptExamples: string[]
  responseExamples: string[]
  emoji: string
  tags: string[]
}

export const DESPECHO_TEMPLATES: DespechoTemplate[] = [
  {
    id: "chat-toxico",
    type: "chat_toxico",
    title: "Chat Tóxico",
    description: "Simula una conversación de mensajería con tu ex o un chat tóxico imaginario",
    difficulty: "medium",
    promptExamples: [
      "¿Por qué me dejaste en visto?",
      "¿Podemos hablar?",
      "Te extraño...",
      "¿Estás con alguien más?",
      "Solo quería saber cómo estás",
    ],
    responseExamples: [
      "Porque tu perfil es un museo del cringe. 🚮",
      "Lo siento, estoy ocupado/a ignorando red flags. 🚩",
      "Nueva vida, ¿quién eres?",
      "Estoy en mi era de paz mental, no contesto mensajes del pasado.",
      "Mensaje no entregado. El destinatario ha bloqueado tu número o está fingiendo que no existes.",
    ],
    emoji: "💬",
    tags: ["chat", "mensajes", "ex", "ghosting", "visto"],
  },
  {
    id: "instagram-despechado",
    type: "instagram_despechado",
    title: "Feed de Instagram Despechado",
    description: "Crea una publicación de Instagram con caption dramático y comentarios irónicos",
    difficulty: "easy",
    promptExamples: [
      "Cuando bloqueas a alguien... y el algoritmo te lo sigue recomendando 😭 #DespechoTecnológico",
      "Nueva etapa, mismos errores ✨ #MeAmoAsiSoy",
      "A veces el universo te quita algo para darte... más tiempo para stalkear 🌙",
      "Sonriendo mientras escucho nuestra canción por accidente 🙃",
      "Casual viernes... revisando si vio mi historia 🕵️‍♀️",
    ],
    responseExamples: [
      "¿Y la terapia? 👀",
      "Mi psicólogo me dijo que deje de seguirte, pero aquí estoy 🤡",
      "Yo también sonrío cuando borro 500 fotos juntos ✨",
      "El algoritmo y tu ex tienen algo en común: ambos vuelven cuando menos los necesitas",
      "Esto es tan yo que duele 💀",
    ],
    emoji: "📱",
    tags: ["instagram", "redes sociales", "stalking", "algoritmo", "publicación"],
  },
  {
    id: "meme-despecho",
    type: "meme_despecho",
    title: "Meme del Despecho",
    description: "Genera un meme clásico con texto superior e inferior sobre desamor",
    difficulty: "easy",
    promptExamples: [
      "Cuando dices 'ya lo superé'",
      "Yo después de decir 'esta vez es la última'",
      "Mi dignidad viéndome",
      "Nadie: / Yo a las 3 AM:",
      "Cuando te llega notificación y piensas que es",
    ],
    responseExamples: [
      "Pero revisas su Spotify a las 3 AM",
      "Y vuelvo a escribirle al primer 'hola'",
      "Escribir párrafos a alguien que responde con 'ok'",
      "Analizando cada palabra de su mensaje de dos letras",
      "Pero es tu operador ofreciéndote más datos para stalkear",
    ],
    emoji: "🎭",
    tags: ["meme", "humor", "viral", "superación", "stalking"],
  },
  {
    id: "revista-drama",
    type: "revista_drama",
    title: "Portada de Revista del Drama",
    description: "Crea una portada de revista sensacionalista sobre tu vida amorosa",
    difficulty: "medium",
    promptExamples: ["¡EXCLUSIVA!", "ÚLTIMA HORA:", "ESCÁNDALO:", "REVELAMOS:", "CONFESIONES:"],
    responseExamples: [
      "Él dijo 'no eres tú, soy yo'... y otros 5 clichés que usó para ghostearte. Pág. 10",
      "Las 7 etapas del duelo post-ghosting: Estás en la 3 y ni te has dado cuenta. Pág. 15",
      "Expertos confirman: Stalkear a tu ex NO cuenta como 'terapia alternativa'. Pág. 8",
      "Descubrimos por qué sigues guardando sus fotos: Tu cerebro está saboteando tu dignidad. Pág. 12",
      "Científicos alarmados: Nueva cepa de 'mensajes borrachos a ex' afecta a millones este fin de semana. Pág. 6",
    ],
    emoji: "📰",
    tags: ["revista", "chisme", "exclusiva", "drama", "sensacionalismo"],
  },
  {
    id: "tiktok-despecho",
    type: "tiktok_despecho",
    title: "TikTok del Despecho",
    description: "Simula un TikTok viral sobre desamor con texto en pantalla y comentarios",
    difficulty: "medium",
    promptExamples: [
      "Cuando revisas su último visto...",
      "POV: Te aparece en sugeridos después de...",
      "El algoritmo sabiendo que estás triste:",
      "Yo fingiendo que estoy bien mientras...",
      "Mi playlist después de la ruptura:",
    ],
    responseExamples: [
      "y es tu mejor amigo 🕵️‍♂️",
      "3 meses de terapia y 2 playlists de desamor",
      "Te muestra su perfil en todas las plataformas 🎯",
      "Escucho la misma canción triste por 5 hora seguida",
      "Pura canción de Bad Bunny y Karol G en modo villana 💅",
    ],
    emoji: "🎬",
    tags: ["tiktok", "viral", "pov", "algoritmo", "trend"],
  },
  {
    id: "perfil-citas",
    type: "perfil_citas",
    title: "Perfil de App de Citas",
    description: "Crea un perfil irónico para una app de citas post-ruptura",
    difficulty: "hard",
    promptExamples: ["Bio de perfil:", "Lo que busco:", "Sobre mí:", "Mis intereses:", "No me escribas si:"],
    responseExamples: [
      "Busco alguien que no me ghostee... o al menos que sea creativo al hacerlo 🎭",
      "Alguien que responda mensajes en menos de 3 días y no considere 'hola' como una conversación completa",
      "Experto/a en sobrevivir situaciones incómodas y maratonear series completas en un fin de semana. Nivel avanzado en stalkeo (discreto).",
      "Llorar en el baño con Bad Bunny, coleccionar red flags, analizar mensajes de dos palabras por horas",
      "Eres igual que mi ex, usas 'jaja' para terminar conversaciones, o crees que 'vamos con calma' es una estrategia válida",
    ],
    emoji: "💘",
    tags: ["dating", "tinder", "bumble", "perfil", "bio"],
  },
  {
    id: "notificacion-redflag",
    type: "notificacion_redflag",
    title: "Notificación de Red Flag",
    description: "Genera una alerta de sistema sobre comportamientos tóxicos o red flags",
    difficulty: "easy",
    promptExamples: [
      "¡ALERTA!",
      "⚠️ ADVERTENCIA:",
      "🚨 SISTEMA DE ALERTA:",
      "🚩 RED FLAG DETECTADA:",
      "⚠️ NOTIFICACIÓN URGENTE:",
    ],
    responseExamples: [
      "Has sobrepensado un mensaje de 3 palabras. Soluciones recomendadas: Comer helado (2x1) o cantar reggaetón triste en el espejo.",
      "Esta persona ha usado 'estoy ocupado' 7 veces esta semana. Probabilidad de ghosting: 89%",
      "Has revisado su perfil 12 veces hoy. Tu dignidad está en 15%. Recarga con una sesión de terapia o un bloqueazo épico.",
      "Detectamos que estás a punto de enviar un mensaje a las 2 AM. ¿Seguro que quieres activar el 'Modo Arrepentimiento Mañanero'?",
      "Has escuchado 'Hawái' de Maluma 27 veces seguidas. Iniciando protocolo anti-despecho: Llamando a tu mejor amigo/a...",
    ],
    emoji: "🚩",
    tags: ["redflag", "alerta", "advertencia", "tóxico", "ghosting"],
  },
]

// Función para obtener una plantilla por ID
export function getTemplateById(id: string): DespechoTemplate | undefined {
  return DESPECHO_TEMPLATES.find((template) => template.id === id)
}

// Función para obtener una plantilla por tipo
export function getTemplateByType(type: DespechoChallengeType): DespechoTemplate | undefined {
  return DESPECHO_TEMPLATES.find((template) => template.type === type)
}

// Función para obtener plantillas por dificultad
export function getTemplatesByDifficulty(difficulty: "easy" | "medium" | "hard"): DespechoTemplate[] {
  return DESPECHO_TEMPLATES.filter((template) => template.difficulty === difficulty)
}

// Función para obtener plantillas por tag
export function getTemplatesByTag(tag: string): DespechoTemplate[] {
  return DESPECHO_TEMPLATES.filter((template) => template.tags.includes(tag))
}

// Función para obtener una plantilla aleatoria
export function getRandomTemplate(): DespechoTemplate {
  const randomIndex = Math.floor(Math.random() * DESPECHO_TEMPLATES.length)
  return DESPECHO_TEMPLATES[randomIndex]
}

// Función para obtener un prompt aleatorio de una plantilla
export function getRandomPrompt(template: DespechoTemplate): string {
  const randomIndex = Math.floor(Math.random() * template.promptExamples.length)
  return template.promptExamples[randomIndex]
}

// Función para obtener una respuesta aleatoria de una plantilla
export function getRandomResponse(template: DespechoTemplate): string {
  const randomIndex = Math.floor(Math.random() * template.responseExamples.length)
  return template.responseExamples[randomIndex]
}
