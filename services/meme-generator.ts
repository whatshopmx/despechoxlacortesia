/**
 * Servicio para generar memes a partir de texto o imágenes
 */

// Tipos de plantillas de memes disponibles
export type MemeTemplate = {
  id: string
  name: string
  imageUrl: string
  textAreas: {
    id: string
    x: number
    y: number
    width: number
    height: number
    fontSize: number
    color: string
    alignment: "left" | "center" | "right"
    maxLength: number
  }[]
  tags: string[]
  category: "despecho" | "cringe" | "borracho" | "fiesta" | "general"
}

// Plantillas predefinidas de memes
export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: "despecho_ex",
    name: "Mensaje al Ex",
    imageUrl: "/placeholder.svg?height=500&width=500&text=Mensaje+al+Ex",
    textAreas: [
      {
        id: "top",
        x: 10,
        y: 10,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
      {
        id: "bottom",
        x: 10,
        y: 410,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
    ],
    tags: ["ex", "mensaje", "despecho"],
    category: "despecho",
  },
  {
    id: "borracho_confesion",
    name: "Confesión de Borracho",
    imageUrl: "/placeholder.svg?height=500&width=500&text=Confesión+de+Borracho",
    textAreas: [
      {
        id: "top",
        x: 10,
        y: 10,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
      {
        id: "bottom",
        x: 10,
        y: 410,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
    ],
    tags: ["borracho", "confesión", "fiesta"],
    category: "borracho",
  },
  {
    id: "cringe_linkedin",
    name: "LinkedIn Cringe",
    imageUrl: "/placeholder.svg?height=500&width=500&text=LinkedIn+Cringe",
    textAreas: [
      {
        id: "top",
        x: 10,
        y: 10,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
      {
        id: "bottom",
        x: 10,
        y: 410,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
    ],
    tags: ["linkedin", "cringe", "trabajo"],
    category: "cringe",
  },
  {
    id: "fiesta_caos",
    name: "Caos en la Fiesta",
    imageUrl: "/placeholder.svg?height=500&width=500&text=Caos+en+la+Fiesta",
    textAreas: [
      {
        id: "top",
        x: 10,
        y: 10,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
      {
        id: "bottom",
        x: 10,
        y: 410,
        width: 480,
        height: 80,
        fontSize: 32,
        color: "#FFFFFF",
        alignment: "center",
        maxLength: 100,
      },
    ],
    tags: ["fiesta", "caos", "amigos"],
    category: "fiesta",
  },
]

// Función para obtener plantillas por categoría
export function getMemeTemplatesByCategory(category: string): MemeTemplate[] {
  return MEME_TEMPLATES.filter((template) => template.category === category)
}

// Función para obtener una plantilla aleatoria
export function getRandomMemeTemplate(): MemeTemplate {
  const randomIndex = Math.floor(Math.random() * MEME_TEMPLATES.length)
  return MEME_TEMPLATES[randomIndex]
}

// Función para obtener una plantilla por ID
export function getMemeTemplateById(id: string): MemeTemplate | undefined {
  return MEME_TEMPLATES.find((template) => template.id === id)
}

// Función para generar un meme a partir de una plantilla y texto
export async function generateMeme(
  templateId: string,
  texts: Record<string, string>,
  customImage?: string,
): Promise<string> {
  // En una implementación real, esto llamaría a una API o usaría canvas
  // Para este ejemplo, simulamos la generación con un delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = getMemeTemplateById(templateId)
      if (!template) {
        resolve("/placeholder.svg?height=500&width=500&text=Error+generando+meme")
        return
      }

      // En una implementación real, aquí se generaría la imagen
      // Para este ejemplo, devolvemos una URL de placeholder
      const textParam = Object.values(texts).join("+")
      resolve(`/placeholder.svg?height=500&width=500&text=Meme:+${textParam}`)
    }, 1000)
  })
}

// Función para generar un meme con IA a partir de una respuesta
export async function generateAIMeme(
  response: string,
  category = "general",
): Promise<{ memeUrl: string; caption: string }> {
  // En una implementación real, esto llamaría a una API de IA
  // Para este ejemplo, simulamos la generación con un delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const templates = getMemeTemplatesByCategory(category)
      const template =
        templates.length > 0 ? templates[Math.floor(Math.random() * templates.length)] : getRandomMemeTemplate()

      // Generar un caption divertido basado en la respuesta
      const captions = [
        "Cuando dices que estás bien pero...",
        "Nadie: / Yo a las 3am:",
        "Mi dignidad viendo cómo:",
        "POV: Es viernes y tu ex te escribe",
        "El grupo viendo cómo confieso que:",
      ]
      const randomCaption = captions[Math.floor(Math.random() * captions.length)]

      // En una implementación real, aquí se generaría la imagen con IA
      // Para este ejemplo, devolvemos una URL de placeholder
      const memeUrl = `/placeholder.svg?height=500&width=500&text=${template.name}:+${response.substring(0, 20)}...`

      resolve({
        memeUrl,
        caption: `${randomCaption} ${response.substring(0, 30)}...`,
      })
    }, 1500)
  })
}
