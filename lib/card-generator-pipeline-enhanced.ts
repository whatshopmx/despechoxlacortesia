/**
 * Enhanced Card Generator Pipeline with Card Library
 * Includes support for both branded and non-branded cards
 */

// Original Card interface
export interface Card {
  card_title: string
  challenge: string
  emotional_tier: "mild" | "intense" | "chaotic"
  theme_tag: string
  spotify_song: {
    title: string
    artist: string
  }
  sticker: string
  reward: string
  reward_type: "shot" | "discount" | "zerosum_card" | "product"
  social_trigger: string
  brand_sponsor?: {
    id: string
    name: string
    logo: string
    industry: string
    rewardValue: number
  }
  back_image_url?: string
}

// Brand sponsor interface
export interface BrandSponsor {
  id: string
  name: string
  logo: string
  industry: string
  rewardValue: number
}

// Template interface based on your source document
export interface CardTemplate {
  nombre: string
  tipo: string[]
  subtipo: string[]
  formato_interaccion: string[]
  tono: string[]
  mecanica: string
  referencias: {
    cancion_sugerida: string
    voz_IA?: string
    inspiracion?: string
    codigo_IA?: string
  }
  uso_en_juego: {
    momento: string
    efecto: string
    recompensa: string
  }
  brandable: boolean  // Flag to indicate if this template can be branded
  brand_mecanica?: string  // Alternative mechanic text for branded version
  brand_recompensa?: string  // Alternative reward for branded version
}

// Available brands for sponsorship
export const availableBrands: BrandSponsor[] = [
  {
    id: "corona",
    name: "Corona",
    logo: "/brands/corona.svg",
    industry: "bebidas",
    rewardValue: 15
  },
  {
    id: "spotify",
    name: "Spotify",
    logo: "/brands/spotify.svg",
    industry: "entretenimiento",
    rewardValue: 10
  },
  {
    id: "sephora",
    name: "Sephora",
    logo: "/brands/sephora.svg",
    industry: "belleza",
    rewardValue: 20
  },
  {
    id: "uber",
    name: "Uber",
    logo: "/brands/uber.svg",
    industry: "transporte",
    rewardValue: 25
  }
];

// Library of card templates
export const cardTemplateLibrary: CardTemplate[] = [
  {
    nombre: "Premio al Más Iluso",
    tipo: ["Roleplay", "Confesión"],
    subtipo: ["Autoengaño", "Premiación"],
    formato_interaccion: ["Voz", "Texto"],
    tono: ["Irónico", "Reflexivo"],
    mecanica: "Narra una historia de amor donde claramente te autoengañaste.",
    referencias: {
      cancion_sugerida: "Reik - Yo Quisiera",
      voz_IA: "Anuncio tipo ceremonia de premios",
      inspiracion: "Discursos de aceptación en premios",
      codigo_IA: "Generación de título de premio personalizado"
    },
    uso_en_juego: {
      momento: "Ronda de confesiones",
      efecto: "AI añade un premio y descripción tipo 'Y el Oscar a \"Creer que era diferente\" va para…'",
      recompensa: "Estatuilla virtual de 'Mejor Autoengaño'"
    },
    brandable: true,
    brand_mecanica: "Cuenta una historia donde pensaste que una marca era mejor que [MARCA_PATROCINADOR]",
    brand_recompensa: "Descuento en [MARCA_PATROCINADOR]"
  },
  {
    nombre: "TikTok Therapy",
    tipo: ["Roleplay", "Digital"],
    subtipo: ["Imitación", "Confesión"],
    formato_interaccion: ["Video", "Texto"],
    tono: ["Viral", "Ligero"],
    mecanica: "Cuenta tu drama como si fueras una influencer dando consejos en TikTok.",
    referencias: {
      cancion_sugerida: "Doja Cat - Say So",
      voz_IA: "Voz de coach motivacional con filtro",
      inspiracion: "Videos virales de consejos de relación",
      codigo_IA: "Generación de hashtags y tendencias"
    },
    uso_en_juego: {
      momento: "Hora de compartir consejos",
      efecto: "AI responde con 'teoría psicológica dudosa pero viral'",
      recompensa: "Certificado: 'Influencer de Desamor'"
    },
    brandable: true,
    brand_mecanica: "Promociona [MARCA_PATROCINADOR] como si fueras influencer que encubre anuncio pagado",
    brand_recompensa: "Descuento en [MARCA_PATROCINADOR] por convertirte en su embajador"
  },
  {
    nombre: "Casting para tu Ex",
    tipo: ["Roleplay", "Creativo"],
    subtipo: ["Imaginación", "Catarsis"],
    formato_interaccion: ["Voz", "Texto"],
    tono: ["Cinematográfico", "Humorístico"],
    mecanica: "Elige un actor o actriz para interpretar a tu ex. Justifica por qué.",
    referencias: {
      cancion_sugerida: "Lady Gaga - Paparazzi",
      voz_IA: "Narración tipo tráiler de película",
      inspiracion: "Críticas de casting en redes sociales",
      codigo_IA: "Generación de sinopsis de película romántica"
    },
    uso_en_juego: {
      momento: "Momento creativo grupal",
      efecto: "AI te da el tráiler de la película basada en su relación",
      recompensa: "Póster digital de tu 'película'"
    },
    brandable: false
  },
  {
    nombre: "Reacción de tu Abuelita",
    tipo: ["Roleplay", "Imitación"],
    subtipo: ["Familiar", "Humor"],
    formato_interaccion: ["Actuación", "Voz"],
    tono: ["Melodramático", "Tradicional"],
    mecanica: "Actúa cómo reaccionaría tu abuelita si supiera tu última historia de desamor.",
    referencias: {
      cancion_sugerida: "Rocío Dúrcal - Amor Eterno",
      voz_IA: "Voz de abuelita con efectos de telenovela",
      inspiracion: "Consejos de abuelas en telenovelas",
      codigo_IA: "Transformación de historia a formato sermón familiar"
    },
    uso_en_juego: {
      momento: "Después de compartir una historia triste",
      efecto: "AI reescribe tu historia como si fuera un sermón de telenovela",
      recompensa: "Recetario virtual: 'Sopas para el Alma Rota'"
    },
    brandable: false
  },
  {
    nombre: "Lo que no posteaste",
    tipo: ["Reflexión", "Confesión"],
    subtipo: ["Redes Sociales", "Intimidad"],
    formato_interaccion: ["Texto", "Imagen"],
    tono: ["Vulnerable", "Auténtico"],
    mecanica: "Describe una escena de tu relación que jamás compartiste en redes.",
    referencias: {
      cancion_sugerida: "Billie Eilish - idontwannabeyouanymore",
      voz_IA: "Texto en formato caption de Instagram",
      inspiracion: "Confesiones de realidades detrás de posts",
      codigo_IA: "Generación de caption alternativo para redes"
    },
    uso_en_juego: {
      momento: "Ronda de verdades ocultas",
      efecto: "AI la convierte en un post viral alternativo con caption",
      recompensa: "Filtro: 'Reality Check'"
    },
    brandable: true,
    brand_mecanica: "Confiesa una experiencia relacionada con [MARCA_PATROCINADOR] que nunca compartiste",
    brand_recompensa: "Descuento exclusivo en [MARCA_PATROCINADOR]"
  },
  {
    nombre: "Tu Villano Origin Story",
    tipo: ["Reflexión", "Narrativa"],
    subtipo: ["Transformación", "Catarsis"],
    formato_interaccion: ["Texto", "Voz"],
    tono: ["Intenso", "Dramático"],
    mecanica: "Cuenta el momento donde naciste como tu versión más tóxica.",
    referencias: {
      cancion_sugerida: "Billie Eilish - You Should See Me in a Crown",
      voz_IA: "Narración tipo tráiler de villano",
      inspiracion: "Escenas de origen en películas de superhéroes",
      codigo_IA: "Generación de título de supervillano personalizado"
    },
    uso_en_juego: {
      momento: "Confesiones de momentos bajos",
      efecto: "AI narra tu transformación en tono Marvel oscuro",
      recompensa: "Logo de supervillano personalizado"
    },
    brandable: false
  },
  {
    nombre: "Notas del Universo",
    tipo: ["Reflexión", "Espiritual"],
    subtipo: ["Coincidencias", "Misticismo"],
    formato_interaccion: ["Texto", "Voz"],
    tono: ["Poético", "Místico"],
    mecanica: "Describe un momento que sentiste como 'señal'.",
    referencias: {
      cancion_sugerida: "Coldplay - The Scientist",
      voz_IA: "Voz etérea con reverberación cósmica",
      inspiracion: "Mensajes de oráculos y tarot",
      codigo_IA: "Transformación de anécdota a mensaje cósmico"
    },
    uso_en_juego: {
      momento: "Momento de introspección",
      efecto: "AI lo convierte en un mensaje cósmico poético tipo oráculo",
      recompensa: "Carta de tarot personalizada"
    },
    brandable: true,
    brand_mecanica: "Describe una señal del universo que te llevó a descubrir [MARCA_PATROCINADOR]",
    brand_recompensa: "Experiencia exclusiva con [MARCA_PATROCINADOR]"
  }
];

/**
 * Helper function to determine emotional tier based on template tones
 */
function getEmotionalTier(tones: string[]): "mild" | "intense" | "chaotic" {
  const intenseTones = ["Intenso", "Dramático", "Vulnerable"];
  const chaoticTones = ["Melodramático", "Catarsis", "Tóxico"];
  
  if (tones.some(tone => chaoticTones.includes(tone))) {
    return "chaotic";
  } else if (tones.some(tone => intenseTones.includes(tone))) {
    return "intense";
  }
  return "mild";
}

/**
 * Get a random brand sponsor
 */
function getRandomBrandSponsor(): BrandSponsor {
  const randomIndex = Math.floor(Math.random() * availableBrands.length);
  return availableBrands[randomIndex];
}

/**
 * Convert a template to a card
 */
export function templateToCard(template: CardTemplate, options: {
  isBranded?: boolean,
  brandSponsor?: BrandSponsor
} = {}): Card {
  // Extract song information
  const songInfo = template.referencias.cancion_sugerida.split(" - ");
  
  // Determine if card should be branded
  const shouldBrand = options.isBranded && template.brandable;
  
  // Get brand sponsor if needed
  const brandSponsor = shouldBrand ? (options.brandSponsor || getRandomBrandSponsor()) : undefined;
  
  // Prepare card contents based on branding status
  let challenge = template.mecanica;
  let reward = template.uso_en_juego.recompensa;
  let cardTitle = template.nombre;
  
  // Apply brand-specific content if applicable
  if (shouldBrand && brandSponsor) {
    cardTitle = `Reto ${brandSponsor.name}: ${template.nombre}`;
    
    // Use brand-specific mechanic if available
    if (template.brand_mecanica) {
      challenge = template.brand_mecanica.replace("[MARCA_PATROCINADOR]", brandSponsor.name);
    }
    
    // Use brand-specific reward if available
    if (template.brand_recompensa) {
      reward = template.brand_recompensa.replace("[MARCA_PATROCINADOR]", brandSponsor.name);
    }
  }
  
  // Create the card
  const card: Card = {
    card_title: cardTitle,
    challenge: challenge,
    emotional_tier: getEmotionalTier(template.tono),
    theme_tag: template.subtipo[0].toLowerCase(),
    spotify_song: {
      title: songInfo[1] || "",
      artist: songInfo[0] || "",
    },
    sticker: template.uso_en_juego.recompensa.replace(/virtual|personalizada|personalizado|digital/g, "").trim(),
    reward: reward,
    reward_type: shouldBrand ? "discount" : 
                (template.uso_en_juego.recompensa.includes("digital") || 
                template.uso_en_juego.recompensa.includes("virtual")) ? 
                "product" : "zerosum_card",
    social_trigger: template.uso_en_juego.efecto,
    back_image_url: "/placeholder.svg?height=400&width=300&text=" + encodeURIComponent(template.nombre),
  };
  
  // Add brand sponsor information if applicable
  if (shouldBrand && brandSponsor) {
    card.brand_sponsor = brandSponsor;
  }
  
  return card;
}

/**
 * Generate a card from the template library
 */
export function generateCardFromLibrary(options: {
  templateIndex?: number,
  tipo?: string,
  subtipo?: string,
  tono?: string,
  isBranded?: boolean,
  brandId?: string,
  onlyBrandable?: boolean
} = {}): Card {
  let selectedTemplate: CardTemplate;
  
  // Prepare filtered templates
  let filteredTemplates = [...cardTemplateLibrary];
  
  // Filter by brandable flag if requested
  if (options.onlyBrandable) {
    filteredTemplates = filteredTemplates.filter(template => template.brandable);
  }
  
  // Filter by type if provided
  if (options.tipo) {
    filteredTemplates = filteredTemplates.filter(
      template => template.tipo.includes(options.tipo)
    );
  }
  
  // Filter by subtype if provided
  if (options.subtipo) {
    filteredTemplates = filteredTemplates.filter(
      template => template.subtipo.includes(options.subtipo)
    );
  }
  
  // Filter by tone if provided
  if (options.tono) {
    filteredTemplates = filteredTemplates.filter(
      template => template.tono.includes(options.tono)
    );
  }
  
  // If no templates match criteria, use full library
  if (filteredTemplates.length === 0) {
    filteredTemplates = options.onlyBrandable ? 
      cardTemplateLibrary.filter(template => template.brandable) : 
      cardTemplateLibrary;
  }
  
  // If specific index is provided and valid, use that template
  if (options.templateIndex !== undefined && options.templateIndex < cardTemplateLibrary.length) {
    selectedTemplate = cardTemplateLibrary[options.templateIndex];
    
    // Check if template is brandable if branding was requested
    if (options.isBranded && !selectedTemplate.brandable) {
      console.warn(`Template at index ${options.templateIndex} cannot be branded. Using as regular card.`);
    }
  } else {
    // Select a random template from filtered list
    const randomIndex = Math.floor(Math.random() * filteredTemplates.length);
    selectedTemplate = filteredTemplates[randomIndex];
  }
  
  // Find specific brand if brand ID is provided
  let brandSponsor: BrandSponsor | undefined;
  if (options.brandId) {
    brandSponsor = availableBrands.find(brand => brand.id === options.brandId);
  }
  
  // Convert template to card
  return templateToCard(selectedTemplate, {
    isBranded: options.isBranded || false,
    brandSponsor: brandSponsor
  });
}

/**
 * Generate branded cards only
 */
export function generateBrandedCard(options: {
  brandId?: string,
  tipo?: string,
  subtipo?: string,
  tono?: string
} = {}): Card {
  return generateCardFromLibrary({
    ...options,
    isBranded: true,
    onlyBrandable: true
  });
}

/**
 * Original function preserved for backward compatibility
 */
export function generateCardJSON(isBranded = false): Card {
  if (cardTemplateLibrary.length > 0) {
    return generateCardFromLibrary({ 
      isBranded, 
      onlyBrandable: isBranded 
    });
  }
  
  // Fallback to original implementation if library is empty
  const card: Card = {
    card_title: isBranded ? "Reto Patrocinado" : "Reto Despecho",
    challenge: "Describe tu peor experiencia de despecho en 30 segundos.",
    emotional_tier: "mild",
    theme_tag: "ghosting",
    spotify_song: {
      title: "Ella Baila Sola",
      artist: "Peso Pluma",
    },
    sticker: "Corazón Roto",
    reward: "Un abrazo grupal",
    reward_type: "product",
    social_trigger: 'Si alguien llora, todos gritan "¡Salud!"',
    back_image_url: "/placeholder.svg?height=400&width=300&text=Card+Back",
  };
  
  // Add brand sponsor if needed
  if (isBranded) {
    const brandSponsor = getRandomBrandSponsor();
    card.card_title = `Reto ${brandSponsor.name}`;
    card.reward = `Descuento en ${brandSponsor.name}`;
    card.reward_type = "discount";
    card.brand_sponsor = brandSponsor;
  }
  
  return card;
}

// Example usage
// const randomCard = generateCardFromLibrary();
// const brandedCard = generateBrandedCard({ brandId: "spotify" });
// const roleplayCard = generateCardFromLibrary({ tipo: "Roleplay" });
