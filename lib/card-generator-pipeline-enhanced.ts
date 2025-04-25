/**
 * Card Generator Pipeline - Enhanced with Library
 *
 * This file defines the data structure and logic for generating card content
 * using a predefined library of challenges.
 */

export interface Card {
  card_title: string;
  challenge: string;
  emotional_tier: "mild" | "intense" | "chaotic"; // Kept from original interface
  theme_tag: string; // Mapped from 'genre_tag'
  spotify_song: {
    title: string;
    artist: string;
    // url?: string; // URL is in source data but not in this interface
  };
  sticker: string; // Needs to be generated or added to source data
  reward: string;
  reward_type: "shot" | "discount" | "zerosum_card" | "product"; // Needs to be determined from reward text
  social_trigger: string;
  brand_sponsor?: {
    id: string;
    name: string;
    logo: string;
    industry: string;
    rewardValue: number;
  };
  back_image_url?: string;
}

// Library of card data provided by the user
const cardLibrary = [
  {
    "card_title": "La Llamada Prohibida",
    "challenge": "Muestra y narra el chat o mensaje más intenso que mandaste en pleno despecho (si no quieres mostrar el real, inventa uno aún más vergonzoso).",
    "genre_tag": "Reggaetón Sad",
    "spotify_song": {
      "title": "HÁBITO",
      "artist": "Bad Bunny",
      "url": "https://open.spotify.com/track/5sSzCxHtgd0liGnIRfEfBk"
    },
    "social_trigger": "Si logras que al menos dos personas digan 'yo hubiera hecho lo mismo', desbloqueas la cortesía.",
    "reward": "1x Botella de agua para las lágrimas + 1 shot para el valor"
  },
  {
    "card_title": "El Stalking Terapéutico",
    "challenge": "Confiesa cuántas cuentas falsas has creado para ver stories de ex o confesa hasta qué familiar de tu ex has stalkeado en redes.",
    "genre_tag": "Terapia Express",
    "spotify_song": {
      "title": "Cactus",
      "artist": "Karol G", // Assuming this was meant to be Karol G based on context
      "url": "https://open.spotify.com/track/2qP8K5XbuxBxBfVpRb21uu"
    },
    "social_trigger": "Si superas el número de cuentas o el nivel de stalking de todos en el grupo, ganas la Cortesía del Detective Herido.",
    "reward": "El grupo debe seguirte en todas tus redes sociales, incluso las secretas"
  },
  {
    "card_title": "Mensaje Borracho Premium",
    "challenge": "Inventa y dramatiza el mensaje de voz que mandarías a tu ex después de 5 tragos. Todo el grupo debe aplaudir si fue suficientemente intenso.",
    "genre_tag": "Cumbia del Olvido",
    "spotify_song": {
      "title": "Mil Horas",
      "artist": "Los Abuelos de la Nada",
      "url": "https://open.spotify.com/track/38YnxF9HJJQQm5Zw7cjUQT"
    },
    "social_trigger": "Si logras que alguien diga 'yo recibí uno así', ambos comparten la cortesía.",
    "reward": "Promo Tóxica 2x1: Dos shots para olvidar la vergüenza"
  },
  {
    "card_title": "La Playlist del Despecho",
    "challenge": "Canta el coro de LA canción que escuchabas en repeat durante tu peor ruptura. Si no recuerdas la letra, el grupo elige una para que la cantes.",
    "genre_tag": "Terapia Express",
    "spotify_song": {
      "title": "Así Fue",
      "artist": "Isabel Pantoja",
      "url": "https://open.spotify.com/track/5BGGqN9Nfrn9aCuDotZDpK"
    },
    "social_trigger": "Si al menos una persona se une espontáneamente a cantar contigo, desbloqueas la Cortesía Karaoke del Alma.",
    "reward": "Dedicatoria especial: El grupo debe escuchar en silencio tu canción completa mientras tomas un shot"
  },
  {
    "card_title": "La Indirecta Directa",
    "challenge": "Comparte la indirecta más obvia que has publicado en redes esperando que tu ex la viera. Si nunca lo has hecho, inventa la más dramática posible.",
    "genre_tag": "Reggaetón Sad",
    "spotify_song": {
      "title": "Antes Que Salga El Sol",
      "artist": "Natti Natasha & Prince Royce",
      "url": "https://open.spotify.com/track/1yonGuBPfQ38kbTgNaXQGu"
    },
    "social_trigger": "Si alguien del grupo admite haber reaccionado a alguna de tus indirectas, ambos toman.",
    "reward": "1x Captura de Pantalla Honorífica (todos deben darle like a tu próxima publicación)"
  },
  {
    "card_title": "El Rebote Inmediato",
    "challenge": "Cuenta la historia de tu rebote más rápido o desastroso después de una ruptura. Incluye tiempo exacto entre relaciones.",
    "genre_tag": "Cumbia del Olvido",
    "spotify_song": {
      "title": "Deja Que Te Bese",
      "artist": "Marc Anthony",
      "url": "https://open.spotify.com/track/74IxGR9c0h0FC1WsMbEm23"
    },
    "social_trigger": "Si tienes el récord del rebote más rápido del grupo, todos deben aplaudirte de pie.",
    "reward": "Tratamiento VIP: El grupo debe conseguirte el número de alguien en la fiesta"
  },
  {
    "card_title": "Contactos Bloqueados S.A.",
    "challenge": "Revela cuántas personas tienes bloqueadas por razones románticas y la historia detrás del bloqueo más justificado.",
    "genre_tag": "Terapia Express",
    "spotify_song": {
      "title": "Rata de Dos Patas",
      "artist": "Paquita la del Barrio",
      "url": "https://open.spotify.com/track/22pJFir2J4crzTkupItwvj"
    },
    "social_trigger": "Si alguien dice 'yo bloquearía por menos', ganas la cortesía.",
    "reward": "Ritual Purificador: Todos levantan sus vasos y gritan 'NEXT!' mientras tú tomas"
  },
  {
    "card_title": "La Tía Dramática",
    "challenge": "Actúa como tía de novela mexicana y narra tu ruptura más dolorosa con todos los efectos dramáticos posibles.",
    "genre_tag": "Corridos del Alma",
    "spotify_song": {
      "title": "Ya lo Sé",
      "artist": "Cristian Castro",
      "url": "https://open.spotify.com/track/2Rwp36T4EC1XG0aXMDlOTz"
    },
    "social_trigger": "Si logras que alguien derrame una lágrima (de risa o emoción), desbloqueas la cortesía.",
    "reward": "Premio Telenovela: Un brindis dedicado y todos deben llamarte 'Doña/Don' el resto de la noche"
  },
  {
    "card_title": "Archivo Sentimental",
    "challenge": "Comparte el objeto más ridículo o sentimental que has guardado de una relación pasada y por qué no puedes tirarlo.",
    "genre_tag": "Cumbia del Olvido",
    "spotify_song": {
      "title": "Fotografía",
      "artist": "Juanes & Nelly Furtado",
      "url": "https://open.spotify.com/track/7DYU0yB95KCrQxwHDSXdXR"
    },
    "social_trigger": "Si alguien admite tener un objeto más ridículo aún guardado, comparten la cortesía.",
    "reward": "Bono Nostálgico: Un shot dedicado a los recuerdos que no sirven pero no soltamos"
  },
  {
    "card_title": "Canciones Prohibidas",
    "challenge": "Nombra esa canción que ya no puedes escuchar porque te recuerda demasiado a alguien. El grupo decide si es razonable o demasiado dramático.",
    "genre_tag": "Terapia Express",
    "spotify_song": {
      "title": "La Tortura",
      "artist": "Shakira & Alejandro Sanz",
      "url": "https://open.spotify.com/track/4ZLzoOkj8TPV5BQ5K9ZNfP"
    },
    "social_trigger": "Si todos votan que tu trauma musical está justificado, ganas la cortesía.",
    "reward": "Minuto Musical: Puedes poner la canción que quieras y todos deben bailarla"
  },
  {
    "card_title": "El Cambio Post-Ruptura",
    "challenge": "Muestra una foto de tu cambio de look más dramático después de una ruptura (o describe el cambio que harías en este momento).",
    "genre_tag": "Reggaetón Sad",
    "spotify_song": {
      "title": "BICHOTA",
      "artist": "Karol G",
      "url": "https://open.spotify.com/track/7vrJn5hDSXRmdXoR30KgF1"
    },
    "social_trigger": "Si al menos dos personas aprueban tu transformación con un '¡qué upgrade!', ganas.",
    "reward": "Consultoría de Imagen: Cada jugador debe darte un consejo de estilo para tu próxima conquista"
  },
  {
    "card_title": "La Coincidencia Incómoda",
    "challenge": "Cuenta la historia del encuentro más incómodo con un ex (o un rechazo) en público. Si nunca te ha pasado, inventa el escenario más doloroso.",
    "genre_tag": "Corridos del Alma",
    "spotify_song": {
      "title": "El Recuento de los Daños",
      "artist": "Gloria Trevi",
      "url": "https://open.spotify.com/track/4IQRHLlaW9WdRUVpRVFi3w"
    },
    "social_trigger": "Si alguien dice 'eso es peor que lo que me pasó a mí', ganas la inmunidad.",
    "reward": "Kit de Supervivencia Social: Nadie puede retarte por las próximas dos rondas"
  },
  {
    "card_title": "La Excusa Perfecta",
    "challenge": "Comparte la peor/mejor excusa que alguien te dio para terminar contigo, o la que tú diste para cortar con alguien.",
    "genre_tag": "Terapia Express",
    "spotify_song": {
      "title": "Mientes Tan Bien",
      "artist": "Sin Bandera",
      "url": "https://open.spotify.com/track/5W7DOVGQLTigu06wZHVNgj"
    },
    "social_trigger": "Si alguien dice 'a mí me dijeron algo peor', ambos toman para olvidar.",
    "reward": "Premio a la Creatividad: Un brindis en tu honor y todos deben inventar una excusa mejor"
  },
  {
    "card_title": "Karaoke del Despecho",
    "challenge": "Canta con todo sentimiento el coro de una canción que dedicarías a tu ex más tóxico. El grupo debe adivinar qué le hizo.",
    "genre_tag": "Reggaetón Sad",
    "spotify_song": {
      "title": "Hawái",
      "artist": "Maluma",
      "url": "https://open.spotify.com/track/1yoMvmasuxZfqHkrJmwgLz"
    },
    "social_trigger": "Si el grupo logra adivinar correctamente el motivo del despecho, todos ganan.",
    "reward": "Concierto Privado: Todos deben cantar contigo una estrofa de la canción elegida"
  },
  {
    "card_title": "El Crush Imposible",
    "challenge": "Confiesa ese crush secreto que tuviste por años sin que la persona lo supiera (sin nombres si están presentes).",
    "genre_tag": "Cumbia del Olvido",
    "spotify_song": {
      "title": "Perfecta",
      "artist": "Miranda!",
      "url": "https://open.spotify.com/track/7yCuiQPEQANKiT0Qjal8ff"
    },
    "social_trigger": "Si alguien confiesa haber tenido un crush en ti sin que lo supieras, ambos ganan.",
    "reward": "Declaratoria Oficial: Todo el grupo debe decirte algo que te hace irresistible"
  },
  {
    "card_title": "La Cita del Horror",
    "challenge": "Narra con lujo de detalles tu peor primera cita. El grupo vota si merecía una segunda oportunidad.",
    "genre_tag": "Terapia Express",
    "spotify_song": {
      "title": "No Fue Suficiente",
      "artist": "Paty Cantú",
      "url": "https://open.spotify.com/track/0GKTGiUFX7r7wCu94JbZn0"
    },
    "social_trigger": "Si la mayoría vota que fue demasiado horrible para una segunda cita, ganas por trauma.",
    "reward": "Segunda Oportunidad: Puedes retar a cualquier jugador a una actividad de tu elección"
  },
  {
    "card_title": "La Friendzone Eterna",
    "challenge": "Comparte cómo amistoseaste a alguien cruelmente o cómo te dejaron en la friendzone más obvia de la historia.",
    "genre_tag": "Corridos del Alma",
    "spotify_song": {
      "title": "Amigos Con Derechos",
      "artist": "Reik & Maluma",
      "url": "https://open.spotify.com/track/5iB0coR40J0ZZRUUWgCmTy"
    },
    "social_trigger": "Si alguien dice 'yo estuve más tiempo en la friendzone', comparan historias y el grupo decide quién gana.",
    "reward": "Salida de la Zona: Todos te dan un consejo para nunca más caer en la friendzone"
  },
  {
    "card_title": "Detectives Privados",
    "challenge": "Revela la investigación más exhaustiva que has realizado en redes para averiguar algo de tu crush o ex.",
    "genre_tag": "Reggaetón Sad",
    "spotify_song": {
      "title": "La Curiosidad",
      "artist": "Jay Wheeler & DJ Nelson",
      "url": "https://open.spotify.com/track/4HYDUMY0xSpeBr0AMY9cUz"
    },
    "social_trigger": "Si alcanzas el nivel 'FBI profesional' según el voto del grupo, ganas la cortesía.",
    "reward": "Insignia de Detective: Los demás jugadores deben confesar algo que ocultan en sus redes"
  },
  {
    "card_title": "Mensajes Archivados",
    "challenge": "Lee (o inventa) el último mensaje que recibiste de un ex y lo que realmente querías responderle pero no te atreviste.",
    "genre_tag": "Cumbia del Olvido",
    "spotify_song": {
      "title": "Ya Te Olvidé",
      "artist": "Yuridia",
      "url": "https://open.spotify.com/track/6lFO8lM2Z2WE3YlB0P65wS"
    },
    "social_trigger": "Si el grupo grita 'SEND IT' al unísono, desbloqueas la cortesía.",
    "reward": "Valor Líquido: Un shot para darte el valor que te faltó en ese momento"
  }
];


/**
 * Determines the reward type based on keywords in the reward text.
 */
function getRewardType(rewardText: string): "shot" | "discount" | "zerosum_card" | "product" {
  const lowerCaseReward = rewardText.toLowerCase();
  if (lowerCaseReward.includes("shot")) {
    return "shot";
  }
  if (lowerCaseReward.includes("descuento")) {
    return "discount";
  }
  // Add more specific checks if needed, e.g., for "tarjeta"
  if (lowerCaseReward.includes("tarjeta")) {
    return "zerosum_card";
  }
  // Default to "product" if no specific type is identified
  return "product";
}

/**
 * Generates a sticker text, e.g., based on the card title.
 * (This is a simple example, could be made more sophisticated)
 */
function generateSticker(title: string): string {
    // Example: Use the first 2-3 words of the title
    const words = title.split(' ');
    if (words.length > 2) {
        return words.slice(0, 2).join(' ') + "...";
    }
    return title; // Return full title if short
}


/**
 * Generate a card JSON by randomly selecting from the cardLibrary.
 */
export function generateCardJSON(isBranded = false): Card {
  // Select a random card data object from the library
  const randomIndex = Math.floor(Math.random() * cardLibrary.length);
  const selectedData = cardLibrary[randomIndex];

  // Determine reward type based on reward text
  const rewardType = getRewardType(selectedData.reward);

  // Generate a sticker (example implementation)
  const sticker = generateSticker(selectedData.card_title);

  // Construct the Card object according to the interface
  const card: Card = {
    card_title: isBranded ? `Reto Patrocinado: ${selectedData.card_title}` : selectedData.card_title,
    challenge: selectedData.challenge,
    emotional_tier: "mild", // Defaulting to "mild" as it's not in the source data
    theme_tag: selectedData.genre_tag, // Mapping genre_tag to theme_tag
    spotify_song: {
      title: selectedData.spotify_song.title,
      artist: selectedData.spotify_song.artist,
      // URL is ignored as it's not in the Card interface
    },
    sticker: sticker, // Using generated sticker
    reward: selectedData.reward,
    reward_type: rewardType, // Using determined reward type
    social_trigger: selectedData.social_trigger,
    // brand_sponsor is NOT populated here. The frontend code adds it later.
    back_image_url: "/placeholder.svg?height=400&width=300&text=" + encodeURIComponent(selectedData.card_title), // Example back image
  };

  return card;
}

// Example usage (for testing):
// const randomCard = generateCardJSON();
// console.log(randomCard);
// const brandedCard = generateCardJSON(true);
// console.log(brandedCard);
