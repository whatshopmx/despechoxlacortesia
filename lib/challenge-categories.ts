// Tipos principales de retos
export enum ChallengeType {
  KARAOKE = "karaoke",
  VISUAL = "visual",
  MISTERIOSO = "misterioso",
  ICEBREAKER = "icebreaker",
  ROLEPLAY = "roleplay",
  REFLEXION = "reflexion",
  CONFESION = "confesion",
  IMPROVISACION = "improvisacion",
  VELOCIDAD = "velocidad",
  OPERATICO = "operatico",
  COMPARACION = "comparacion",
  TEXTO = "texto",
  ABSTRACTO = "abstracto",
  SOCIAL = "social",
  INTERPRETACION = "interpretacion",
  ELECCION = "eleccion",
  TEORIAS = "teorias",
  SIMBOLICO = "simbolico",
  DIGITAL = "digital",
  CREATIVO = "creativo",
  IMITACION = "imitacion",
  MEME = "meme",
  REDES_SOCIALES = "redes_sociales",
  FOTOGRAFIA = "fotografia",
  ARTE = "arte",
  PREDICCION = "prediccion",
  DESTINO = "destino",
  DECISION = "decision",
  ESPECULACION = "especulacion",
  AUTOENGANO = "autoengano",
  IMAGINACION = "imaginacion",
  FAMILIAR = "familiar",
  EXPOSICION = "exposicion",
  TERAPEUTICO = "terapeutico",
  TRANSFORMACION = "transformacion",
  DRAMATIZACION = "dramatizacion",
  AUTOCONCIENCIA = "autoconciencia",
  PASIVO_AGRESIVO = "pasivo_agresivo",
  VULNERABILIDAD = "vulnerabilidad",
  SIMBOLISMO = "simbolismo",
  MENSAJES = "mensajes",
  CASUALIDAD = "casualidad",
  PARANOIA = "paranoia",
  RESUMEN = "resumen",
  PREMIACION = "premiacion",
  CATARSIS = "catarsis",
  HUMOR = "humor",
  INTIMIDAD = "intimidad",
}

// Formatos de interacción
export enum InteractionFormat {
  CANTO = "canto",
  MEMORIA = "memoria",
  VOCAL = "vocal",
  IMPROVISACION = "improvisacion",
  TEMPO = "tempo",
  RECITACION = "recitacion",
  OPERA = "opera",
  DESCRIPCION = "descripcion",
  IMAGEN = "imagen",
  CAPTION = "caption",
  MEME = "meme",
  LISTA = "lista",
  CONCEPTO = "concepto",
  TEXTO = "texto",
  PREDICCION = "prediccion",
  TRADUCCION = "traduccion",
  OPCION = "opcion",
  SORPRESA = "sorpresa",
  TEORIAS = "teorias",
  REVELACION = "revelacion",
  EMOJIS = "emojis",
  INTERPRETACION = "interpretacion",
  VOZ = "voz",
  VIDEO = "video",
  ACTUACION = "actuacion",
}

// Subtipos de tono
export enum ToneSubtype {
  ACUSATORIO = "acusatorio",
  METALERO = "metalero",
  URBANO = "urbano",
  CONFESIONAL = "confesional",
  ACELERADO = "acelerado",
  CAOTICO = "caotico",
  LIRICO = "lirico",
  FANTASMAGORICO = "fantasmagorico",
  REVELADOR = "revelador",
  HUMORISTICO = "humoristico",
  VENGATIVO = "vengativo",
  POETICO = "poetico",
  VULNERABLE = "vulnerable",
  IRONICO = "ironico",
  ARTISTICO = "artistico",
  ALEATORIO = "aleatorio",
  PROFETICO = "profetico",
  SARCASTICO = "sarcastico",
  MISTICO = "mistico",
  COMICO = "comico",
  TENSO = "tenso",
  CONSPIRATIVO = "conspirativo",
  DESMITIFICADOR = "desmitificador",
  MINIMALISTA = "minimalista",
  REFLEXIVO = "reflexivo",
  VIRAL = "viral",
  LIGERO = "ligero",
  CINEMATOGRAFICO = "cinematografico",
  MELODRAMATICO = "melodramatico",
  TRADICIONAL = "tradicional",
  AUTENTICO = "autentico",
}

// Combinaciones predefinidas de tipo, formato y tono
export interface ChallengeCombination {
  type: ChallengeType
  format: InteractionFormat[]
  tone: ToneSubtype[]
  description: string
  examples: string[]
}

// Ejemplos de combinaciones predefinidas
export const PREDEFINED_COMBINATIONS: ChallengeCombination[] = [
  {
    type: ChallengeType.KARAOKE,
    format: [InteractionFormat.CANTO, InteractionFormat.MEMORIA],
    tone: [ToneSubtype.MELODRAMATICO, ToneSubtype.VULNERABLE],
    description: "Canta el coro de LA canción que escuchabas en repeat durante tu peor ruptura.",
    examples: [
      "Canta el coro de 'All By Myself' como si estuvieras en el baño de un bar a las 2 AM.",
      "Interpreta 'Titanium' con voz quebrada y lágrimas de cocodrilo.",
    ],
  },
  {
    type: ChallengeType.CONFESION,
    format: [InteractionFormat.TEXTO, InteractionFormat.REVELACION],
    tone: [ToneSubtype.VULNERABLE, ToneSubtype.AUTENTICO],
    description: "Confiesa con lujo de detalles cuántas cuentas falsas has creado para ver stories de ex.",
    examples: [
      "Revela el mensaje más vergonzoso que enviaste a un ex a las 3 AM.",
      "Confiesa la excusa más ridícula que has usado para cancelar una cita.",
    ],
  },
  {
    type: ChallengeType.MEME,
    format: [InteractionFormat.IMAGEN, InteractionFormat.CAPTION],
    tone: [ToneSubtype.IRONICO, ToneSubtype.SARCASTICO],
    description: "Crea un meme que resuma perfectamente tu vida amorosa actual.",
    examples: [
      "Genera un meme que capture la esencia de tus dating apps.",
      "Crea un caption para una foto de un gato mirando con desprecio que represente tu última cita.",
    ],
  },
  {
    type: ChallengeType.ROLEPLAY,
    format: [InteractionFormat.ACTUACION, InteractionFormat.VOZ],
    tone: [ToneSubtype.MELODRAMATICO, ToneSubtype.CAOTICO],
    description: "Actúa como si estuvieras reclamándole algo a tu ex frente a todos.",
    examples: [
      "Interpreta una escena de telenovela donde descubres una traición.",
      "Actúa como si fueras el protagonista de una película romántica en la escena final.",
    ],
  },
  {
    type: ChallengeType.IMITACION,
    format: [InteractionFormat.VOZ, InteractionFormat.ACTUACION],
    tone: [ToneSubtype.COMICO, ToneSubtype.EXAGERADO],
    description: "Imita cómo hablaría tu ex si fuera un personaje de telenovela.",
    examples: [
      "Imita a tu crush como si fuera un personaje de anime.",
      "Recrea la voz de tu peor cita como si fuera un villano de Disney.",
    ],
  },
  {
    type: ChallengeType.REDES_SOCIALES,
    format: [InteractionFormat.TEXTO, InteractionFormat.CAPTION],
    tone: [ToneSubtype.PASIVO_AGRESIVO, ToneSubtype.IRONICO],
    description: "Comparte la indirecta más obvia que has publicado en redes esperando que tu ex la viera.",
    examples: [
      "Escribe el caption más dramático que usarías para una selfie post-ruptura.",
      "Redacta el estado de WhatsApp que pondrías si tu ex empezara a salir con alguien nuevo.",
    ],
  },
  {
    type: ChallengeType.IMPROVISACION,
    format: [InteractionFormat.VOCAL, InteractionFormat.IMPROVISACION],
    tone: [ToneSubtype.ACELERADO, ToneSubtype.CAOTICO],
    description: "Improvisa un rap de 30 segundos sobre tu peor cita.",
    examples: [
      "Crea un jingle publicitario sobre tus red flags.",
      "Improvisa un poema sobre el momento más incómodo en una relación.",
    ],
  },
  {
    type: ChallengeType.VISUAL,
    format: [InteractionFormat.DESCRIPCION, InteractionFormat.IMAGEN],
    tone: [ToneSubtype.CINEMATOGRAFICO, ToneSubtype.POETICO],
    description: "Describe con lujo de detalles visuales el outfit que llevabas en tu peor cita.",
    examples: [
      "Pinta con palabras la escena exacta de tu ruptura más dramática.",
      "Describe el lugar donde tuviste tu primer beso como si fuera la sinopsis de una película.",
    ],
  },
  {
    type: ChallengeType.AUTOENGANO,
    format: [InteractionFormat.LISTA, InteractionFormat.REVELACION],
    tone: [ToneSubtype.IRONICO, ToneSubtype.HUMORISTICO],
    description: "Enumera las tres mentiras más grandes que te has dicho a ti mismo sobre una relación.",
    examples: [
      "Lista las excusas que te diste para no terminar una relación tóxica.",
      "Enumera las señales de alerta que ignoraste en tu último crush.",
    ],
  },
  {
    type: ChallengeType.PREDICCION,
    format: [InteractionFormat.TEXTO, InteractionFormat.PREDICCION],
    tone: [ToneSubtype.MISTICO, ToneSubtype.PROFETICO],
    description: "Como si fueras un adivino, predice el futuro amoroso de la persona a tu derecha.",
    examples: [
      "Lee el 'tarot amoroso' de alguien del grupo usando cartas imaginarias.",
      "Crea un horóscopo personalizado para la vida romántica de otro jugador.",
    ],
  },
]

// Función para generar un reto aleatorio basado en tipo, formato y tono
export function generateChallenge(type?: ChallengeType, format?: InteractionFormat, tone?: ToneSubtype): string {
  // Si se proporcionan parámetros específicos, buscar combinaciones que coincidan
  let filteredCombinations = [...PREDEFINED_COMBINATIONS]

  if (type) {
    filteredCombinations = filteredCombinations.filter((combo) => combo.type === type)
  }

  if (format) {
    filteredCombinations = filteredCombinations.filter((combo) => combo.format.includes(format))
  }

  if (tone) {
    filteredCombinations = filteredCombinations.filter((combo) => combo.tone.includes(tone))
  }

  // Si no hay combinaciones que coincidan, usar todas
  if (filteredCombinations.length === 0) {
    filteredCombinations = PREDEFINED_COMBINATIONS
  }

  // Seleccionar una combinación aleatoria
  const selectedCombo = filteredCombinations[Math.floor(Math.random() * filteredCombinations.length)]

  // Seleccionar un ejemplo aleatorio o usar la descripción
  if (Math.random() > 0.5 && selectedCombo.examples.length > 0) {
    return selectedCombo.examples[Math.floor(Math.random() * selectedCombo.examples.length)]
  } else {
    return selectedCombo.description
  }
}

// Función para obtener todas las combinaciones disponibles
export function getAllCombinations(): ChallengeCombination[] {
  return PREDEFINED_COMBINATIONS
}

// Función para obtener combinaciones por tipo
export function getCombinationsByType(type: ChallengeType): ChallengeCombination[] {
  return PREDEFINED_COMBINATIONS.filter((combo) => combo.type === type)
}

// Función para obtener combinaciones por formato
export function getCombinationsByFormat(format: InteractionFormat): ChallengeCombination[] {
  return PREDEFINED_COMBINATIONS.filter((combo) => combo.format.includes(format))
}

// Función para obtener combinaciones por tono
export function getCombinationsByTone(tone: ToneSubtype): ChallengeCombination[] {
  return PREDEFINED_COMBINATIONS.filter((combo) => combo.tone.includes(tone))
}
