/**
 * Servicio para recopilar y analizar datos de usuario para la funcionalidad "Wrapped"
 */

import type { Card } from "@/lib/card-generator-pipeline-enhanced"
import type { RewardType } from "@/contexts/challenge-context"

// Tipos de eventos que podemos rastrear
export enum EventType {
  CARD_VIEWED = "card_viewed",
  CARD_COMPLETED = "card_completed",
  REWARD_EARNED = "reward_earned",
  STICKER_UNLOCKED = "sticker_unlocked",
  COMBO_UNLOCKED = "combo_unlocked",
  SOCIAL_TRIGGER_ACTIVATED = "social_trigger_activated",
  GROUP_CHALLENGE_COMPLETED = "group_challenge_completed",
  VERIFICATION_COMPLETED = "verification_completed",
  MEME_GENERATED = "meme_generated",
  MEME_SHARED = "meme_shared",
}

// Interfaz para los eventos
export interface AnalyticsEvent {
  type: EventType
  timestamp: number
  userId: string
  sessionId: string
  data: any
}

// Interfaz para los datos de Wrapped
export interface WrappedData {
  userId: string
  period: "weekly" | "monthly" | "yearly"
  startDate: Date
  endDate: Date

  // Estadísticas generales
  totalCards: number
  totalChallengesCompleted: number
  totalRewardsEarned: number
  totalStickersUnlocked: number
  totalCombosUnlocked: number
  totalSocialTriggersActivated: number

  // Análisis emocional
  emotionalProfile: {
    dominantEmotion: string
    emotionalIntensity: number
    emotionalJourney: Array<{
      date: Date
      emotion: string
      intensity: number
    }>
    chaosLevel: number
    chaosPercentile: number // Comparado con otros usuarios
  }

  // Top cards y recompensas
  topCards: Array<{
    card: Card
    timesPlayed: number
  }>
  topRewards: Array<{
    reward: RewardType
    value: number
  }>

  // Estadísticas sociales
  socialStats: {
    groupChallengesCompleted: number
    duetChallengesCompleted: number
    totalReactions: number
    totalShares: number
    mostFrequentPartners: Array<{
      userId: string
      name: string
      count: number
    }>
  }

  // Logros y momentos destacados
  achievements: Array<{
    title: string
    description: string
    date: Date
    iconType: string
  }>

  // Recomendaciones personalizadas
  recommendations: Array<{
    type: "card" | "partner" | "emotion" | "reward"
    title: string
    description: string
    score: number
  }>
}

// Clase para gestionar los eventos y generar el Wrapped
export class WrappedAnalytics {
  private static instance: WrappedAnalytics
  private events: AnalyticsEvent[] = []
  private cachedWrappedData: Record<string, WrappedData> = {}

  private constructor() {
    // Cargar eventos guardados en localStorage
    this.loadEvents()

    // Configurar guardado periódico
    setInterval(() => this.saveEvents(), 60000) // Guardar cada minuto
  }

  public static getInstance(): WrappedAnalytics {
    if (!WrappedAnalytics.instance) {
      WrappedAnalytics.instance = new WrappedAnalytics()
    }
    return WrappedAnalytics.instance
  }

  // Método para rastrear un evento
  public trackEvent(type: EventType, userId: string, data: any): void {
    const event: AnalyticsEvent = {
      type,
      timestamp: Date.now(),
      userId,
      sessionId: this.getCurrentSessionId(),
      data,
    }

    this.events.push(event)

    // Invalidar caché de Wrapped para este usuario
    if (this.cachedWrappedData[userId]) {
      delete this.cachedWrappedData[userId]
    }
  }

  // Método para generar el Wrapped para un usuario
  public generateWrapped(userId: string, period: "weekly" | "monthly" | "yearly" = "monthly"): WrappedData {
    // Si ya tenemos datos en caché y son recientes, devolverlos
    const cacheKey = `${userId}_${period}`
    if (this.cachedWrappedData[cacheKey] && Date.now() - this.cachedWrappedData[cacheKey].endDate.getTime() < 3600000) {
      // Caché de 1 hora
      return this.cachedWrappedData[cacheKey]
    }

    // Filtrar eventos por usuario y período
    const { startDate, endDate } = this.getPeriodDates(period)
    const userEvents = this.events.filter(
      (event) =>
        event.userId === userId && event.timestamp >= startDate.getTime() && event.timestamp <= endDate.getTime(),
    )

    // Calcular estadísticas generales
    const totalCards = this.countEventsByType(userEvents, EventType.CARD_VIEWED)
    const totalChallengesCompleted = this.countEventsByType(userEvents, EventType.CARD_COMPLETED)
    const totalRewardsEarned = this.countEventsByType(userEvents, EventType.REWARD_EARNED)
    const totalStickersUnlocked = this.countEventsByType(userEvents, EventType.STICKER_UNLOCKED)
    const totalCombosUnlocked = this.countEventsByType(userEvents, EventType.COMBO_UNLOCKED)
    const totalSocialTriggersActivated = this.countEventsByType(userEvents, EventType.SOCIAL_TRIGGER_ACTIVATED)

    // Analizar perfil emocional
    const emotionalProfile = this.analyzeEmotionalProfile(userEvents)

    // Obtener top cards y recompensas
    const topCards = this.getTopCards(userEvents)
    const topRewards = this.getTopRewards(userEvents)

    // Calcular estadísticas sociales
    const socialStats = this.calculateSocialStats(userEvents)

    // Generar logros y momentos destacados
    const achievements = this.generateAchievements(userEvents)

    // Generar recomendaciones personalizadas
    const recommendations = this.generateRecommendations(userEvents)

    // Crear objeto Wrapped
    const wrappedData: WrappedData = {
      userId,
      period,
      startDate,
      endDate,
      totalCards,
      totalChallengesCompleted,
      totalRewardsEarned,
      totalStickersUnlocked,
      totalCombosUnlocked,
      totalSocialTriggersActivated,
      emotionalProfile,
      topCards,
      topRewards,
      socialStats,
      achievements,
      recommendations,
    }

    // Guardar en caché
    this.cachedWrappedData[cacheKey] = wrappedData

    return wrappedData
  }

  // Métodos privados para análisis

  private getCurrentSessionId(): string {
    // Obtener o generar ID de sesión
    let sessionId = sessionStorage.getItem("la-cortesia-session-id")
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      sessionStorage.setItem("la-cortesia-session-id", sessionId)
    }
    return sessionId
  }

  private loadEvents(): void {
    try {
      const savedEvents = localStorage.getItem("la-cortesia-analytics-events")
      if (savedEvents) {
        this.events = JSON.parse(savedEvents)
      }
    } catch (e) {
      console.error("Error loading analytics events:", e)
    }
  }

  private saveEvents(): void {
    try {
      // Limitar a los últimos 1000 eventos para no sobrecargar localStorage
      const eventsToSave = this.events.slice(-1000)
      localStorage.setItem("la-cortesia-analytics-events", JSON.stringify(eventsToSave))
    } catch (e) {
      console.error("Error saving analytics events:", e)
    }
  }

  private getPeriodDates(period: "weekly" | "monthly" | "yearly"): { startDate: Date; endDate: Date } {
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case "weekly":
        startDate.setDate(endDate.getDate() - 7)
        break
      case "monthly":
        startDate.setMonth(endDate.getMonth() - 1)
        break
      case "yearly":
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    return { startDate, endDate }
  }

  private countEventsByType(events: AnalyticsEvent[], type: EventType): number {
    return events.filter((event) => event.type === type).length
  }

  private analyzeEmotionalProfile(events: AnalyticsEvent[]): WrappedData["emotionalProfile"] {
    // Extraer datos emocionales de los eventos
    const emotionalData = events
      .filter((event) => event.type === EventType.CARD_COMPLETED && event.data.card)
      .map((event) => ({
        date: new Date(event.timestamp),
        emotion: event.data.card.emotional_tone || "neutral",
        intensity: event.data.emotionalIntensity || 50,
      }))

    // Calcular emoción dominante
    const emotionCounts: Record<string, number> = {}
    emotionalData.forEach((data) => {
      emotionCounts[data.emotion] = (emotionCounts[data.emotion] || 0) + 1
    })

    const dominantEmotion =
      Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0])[0] || "neutral"

    // Calcular intensidad emocional promedio
    const totalIntensity = emotionalData.reduce((sum, data) => sum + data.intensity, 0)
    const emotionalIntensity = emotionalData.length > 0 ? totalIntensity / emotionalData.length : 50

    // Calcular nivel de caos (basado en la variabilidad de emociones e intensidad)
    const uniqueEmotions = new Set(emotionalData.map((data) => data.emotion)).size
    const intensityVariance = this.calculateVariance(emotionalData.map((data) => data.intensity))
    const chaosLevel = (uniqueEmotions * 10 + intensityVariance / 10) / 2

    // Percentil de caos (simulado - en una implementación real se compararía con otros usuarios)
    const chaosPercentile = Math.min(100, chaosLevel * 10)

    return {
      dominantEmotion,
      emotionalIntensity,
      emotionalJourney: emotionalData,
      chaosLevel,
      chaosPercentile,
    }
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const squaredDiffs = values.map((val) => Math.pow(val - mean, 2))
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
  }

  private getTopCards(events: AnalyticsEvent[]): WrappedData["topCards"] {
    const cardCounts: Record<string, { card: Card; count: number }> = {}

    events
      .filter((event) => event.type === EventType.CARD_VIEWED && event.data.card)
      .forEach((event) => {
        const cardId = event.data.card.card_id
        if (!cardCounts[cardId]) {
          cardCounts[cardId] = { card: event.data.card, count: 0 }
        }
        cardCounts[cardId].count++
      })

    return Object.values(cardCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => ({
        card: item.card,
        timesPlayed: item.count,
      }))
  }

  private getTopRewards(events: AnalyticsEvent[]): WrappedData["topRewards"] {
    const rewardCounts: Record<string, { reward: RewardType; value: number }> = {}

    events
      .filter((event) => event.type === EventType.REWARD_EARNED && event.data.reward)
      .forEach((event) => {
        const rewardId = event.data.reward.id
        if (!rewardCounts[rewardId]) {
          rewardCounts[rewardId] = { reward: event.data.reward, value: 0 }
        }
        rewardCounts[rewardId].value += event.data.reward.value || 1
      })

    return Object.values(rewardCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
  }

  private calculateSocialStats(events: AnalyticsEvent[]): WrappedData["socialStats"] {
    const groupChallengesCompleted = this.countEventsByType(events, EventType.GROUP_CHALLENGE_COMPLETED)
    const duetChallengesCompleted = events.filter(
      (event) =>
        event.type === EventType.CARD_COMPLETED && event.data.card && event.data.card.challenge_type === "duet",
    ).length

    const totalReactions = events
      .filter((event) => event.type === EventType.VERIFICATION_COMPLETED && event.data.verificationType === "group")
      .reduce((sum, event) => sum + (event.data.votes || 0), 0)

    const totalShares = this.countEventsByType(events, EventType.MEME_SHARED)

    // Contar partners más frecuentes
    const partnerCounts: Record<string, { userId: string; name: string; count: number }> = {}
    events
      .filter(
        (event) =>
          event.type === EventType.CARD_COMPLETED &&
          event.data.card &&
          event.data.card.challenge_type === "duet" &&
          event.data.partner,
      )
      .forEach((event) => {
        const partnerId = event.data.partner.id
        if (!partnerCounts[partnerId]) {
          partnerCounts[partnerId] = {
            userId: partnerId,
            name: event.data.partner.name || "Desconocido",
            count: 0,
          }
        }
        partnerCounts[partnerId].count++
      })

    const mostFrequentPartners = Object.values(partnerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    return {
      groupChallengesCompleted,
      duetChallengesCompleted,
      totalReactions,
      totalShares,
      mostFrequentPartners,
    }
  }

  private generateAchievements(events: AnalyticsEvent[]): WrappedData["achievements"] {
    const achievements: WrappedData["achievements"] = []

    // Logro: Primera carta completada
    const firstCompletedCard = events
      .filter((event) => event.type === EventType.CARD_COMPLETED)
      .sort((a, b) => a.timestamp - b.timestamp)[0]

    if (firstCompletedCard) {
      achievements.push({
        title: "Primera Carta Completada",
        description: `Completaste tu primera carta: "${firstCompletedCard.data.card?.card_title || "Carta de La Cortesía"}"`,
        date: new Date(firstCompletedCard.timestamp),
        iconType: "card",
      })
    }

    // Logro: Primer combo desbloqueado
    const firstCombo = events
      .filter((event) => event.type === EventType.COMBO_UNLOCKED)
      .sort((a, b) => a.timestamp - b.timestamp)[0]

    if (firstCombo) {
      achievements.push({
        title: "Primer Combo Desbloqueado",
        description: `Desbloqueaste tu primer combo: "${firstCombo.data.combo?.nombre_combo || "Combo Especial"}"`,
        date: new Date(firstCombo.timestamp),
        iconType: "combo",
      })
    }

    // Logro: Nivel de caos máximo
    const highChaosEvents = events.filter(
      (event) =>
        event.type === EventType.CARD_COMPLETED && event.data.card && event.data.card.emotional_tier === "chaotic",
    )

    if (highChaosEvents.length >= 3) {
      achievements.push({
        title: "Maestro del Caos",
        description: "Completaste 3 o más cartas de nivel caótico",
        date: new Date(Math.max(...highChaosEvents.map((e) => e.timestamp))),
        iconType: "chaos",
      })
    }

    // Logro: Compartir social
    const shareEvents = events.filter((event) => event.type === EventType.MEME_SHARED)
    if (shareEvents.length >= 5) {
      achievements.push({
        title: "Influencer del Despecho",
        description: "Compartiste 5 o más memes en redes sociales",
        date: new Date(Math.max(...shareEvents.map((e) => e.timestamp))),
        iconType: "social",
      })
    }

    return achievements
  }

  private generateRecommendations(events: AnalyticsEvent[]): WrappedData["recommendations"] {
    const recommendations: WrappedData["recommendations"] = []

    // Analizar preferencias de emociones
    const emotionCounts: Record<string, number> = {}
    events
      .filter((event) => event.type === EventType.CARD_COMPLETED && event.data.card)
      .forEach((event) => {
        const emotion = event.data.card.emotional_tone || "neutral"
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      })

    // Recomendar emoción más frecuente
    const topEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0])[0]

    if (topEmotion) {
      recommendations.push({
        type: "emotion",
        title: `Más ${this.formatEmotion(topEmotion)}`,
        description: `Parece que disfrutas las cartas con emoción "${topEmotion}". ¡Prueba más de estas!`,
        score: 0.9,
      })
    }

    // Recomendar partner más compatible
    const partnerCompatibility: Record<string, number> = {}
    events
      .filter(
        (event) =>
          event.type === EventType.CARD_COMPLETED &&
          event.data.card &&
          event.data.card.challenge_type === "duet" &&
          event.data.partner &&
          event.data.success === true,
      )
      .forEach((event) => {
        const partnerId = event.data.partner.id
        partnerCompatibility[partnerId] = (partnerCompatibility[partnerId] || 0) + 1
      })

    const topPartner = Object.entries(partnerCompatibility)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => ({
        id: entry[0],
        name: events.find((e) => e.data.partner && e.data.partner.id === entry[0])?.data.partner.name || "Desconocido",
        score: entry[1],
      }))[0]

    if (topPartner) {
      recommendations.push({
        type: "partner",
        title: `Dueto con ${topPartner.name}`,
        description: `Tienes gran química con ${topPartner.name}. ¡Prueba más retos en dueto!`,
        score: 0.85,
      })
    }

    // Recomendar tipo de recompensa preferida
    const rewardTypeCounts: Record<string, number> = {}
    events
      .filter((event) => event.type === EventType.REWARD_EARNED && event.data.reward)
      .forEach((event) => {
        const rewardType = event.data.reward.type || "digital"
        rewardTypeCounts[rewardType] = (rewardTypeCounts[rewardType] || 0) + 1
      })

    const topRewardType = Object.entries(rewardTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0])[0]

    if (topRewardType) {
      const rewardTypeNames: Record<string, string> = {
        digital: "digitales",
        physical: "físicas",
        experience: "experiencias",
      }

      recommendations.push({
        type: "reward",
        title: `Recompensas ${rewardTypeNames[topRewardType] || topRewardType}`,
        description: `Prefieres las recompensas de tipo "${topRewardType}". ¡Busca más cartas con estas recompensas!`,
        score: 0.8,
      })
    }

    return recommendations.sort((a, b) => b.score - a.score)
  }

  private formatEmotion(emotion: string): string {
    // Convertir camelCase o snake_case a formato legible
    return emotion
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase())
  }
}

// Exportar una instancia singleton
export const wrappedAnalytics = WrappedAnalytics.getInstance()
