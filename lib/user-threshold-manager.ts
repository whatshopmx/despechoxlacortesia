import type { Card } from "@/lib/card-generator-pipeline-enhanced"

export type UserTier = "basic" | "intermediate" | "advanced"

export interface UserProgress {
  id: string
  name: string
  completedCards: string[]
  emotionalScore: number
  tier: UserTier
  rewards: {
    basic: string[]
    intermediate: string[]
    advanced: string[]
  }
}

export interface RewardThreshold {
  tier: UserTier
  cardsRequired: number
  emotionalScoreRequired: number
  rewards: string[]
}

// Define thresholds for different reward tiers
const REWARD_THRESHOLDS: RewardThreshold[] = [
  {
    tier: "basic",
    cardsRequired: 0,
    emotionalScoreRequired: 0,
    rewards: ["sticker_digital"],
  },
  {
    tier: "intermediate",
    cardsRequired: 2,
    emotionalScoreRequired: 50,
    rewards: ["nft_meme", "drink_discount"],
  },
  {
    tier: "advanced",
    cardsRequired: 3,
    emotionalScoreRequired: 70,
    rewards: ["afterpass", "premium_feature", "exclusive_merch"],
  },
]

/**
 * Calculate the user tier based on completed cards and emotional score
 */
export function calculateUserTier(completedCards: number, emotionalScore: number): UserTier {
  if (completedCards >= 3 && emotionalScore >= 70) return "advanced"
  if (completedCards >= 2 && emotionalScore >= 50) return "intermediate"
  return "basic"
}

/**
 * Calculate available rewards based on user's tier
 */
export function calculateAvailableRewards(tier: UserTier): string[] {
  const availableTiers = REWARD_THRESHOLDS.filter(
    (threshold) =>
      tier === "advanced" ||
      (tier === "intermediate" && threshold.tier !== "advanced") ||
      (tier === "basic" && threshold.tier === "basic"),
  )

  return availableTiers.flatMap((threshold) => threshold.rewards)
}

/**
 * Calculate emotional intensity increase based on card and verification type
 */
export function calculateIntensityIncrease(
  card: Card | null,
  verificationType: string,
  socialTriggerActivated: boolean,
): number {
  if (!card) return 5

  // Base increase based on card emotional tier
  let increase = 5
  if (card.emotional_tier === "intense") increase = 10
  if (card.emotional_tier === "chaotic") increase = 15

  // Bonus for verification type
  if (verificationType === "group") increase += 5
  if (verificationType === "photo") increase += 3

  // Bonus for social trigger
  if (socialTriggerActivated) increase += 5

  return increase
}

/**
 * Update user progress based on completed card and verification
 */
export function updateUserProgress(
  user: UserProgress,
  card: Card,
  verificationType: string,
  socialTriggerActivated: boolean,
): UserProgress {
  // Add card to completed cards
  const completedCards = [...user.completedCards, card.card_id]

  // Calculate emotional score increase
  const intensityIncrease = calculateIntensityIncrease(card, verificationType, socialTriggerActivated)
  const emotionalScore = Math.min(100, user.emotionalScore + intensityIncrease)

  // Calculate new tier
  const tier = calculateUserTier(completedCards.length, emotionalScore)

  // Calculate newly available rewards
  const availableRewards = calculateAvailableRewards(tier)

  // Prepare updated rewards structure with new rewards
  const updatedRewards = {
    basic: [...user.rewards.basic],
    intermediate: [...user.rewards.intermediate],
    advanced: [...user.rewards.advanced],
  }

  // Add new rewards based on tier
  if (tier === "intermediate" && user.tier !== "intermediate" && user.tier !== "advanced") {
    const intermediateRewards = REWARD_THRESHOLDS.find((t) => t.tier === "intermediate")?.rewards || []

    // Add only new rewards that aren't already in the user's rewards
    intermediateRewards.forEach((reward) => {
      if (!updatedRewards.intermediate.includes(reward)) {
        updatedRewards.intermediate.push(reward)
      }
    })
  }

  if (tier === "advanced" && user.tier !== "advanced") {
    const advancedRewards = REWARD_THRESHOLDS.find((t) => t.tier === "advanced")?.rewards || []

    // Add only new rewards that aren't already in the user's rewards
    advancedRewards.forEach((reward) => {
      if (!updatedRewards.advanced.includes(reward)) {
        updatedRewards.advanced.push(reward)
      }
    })
  }

  return {
    ...user,
    completedCards,
    emotionalScore,
    tier,
    rewards: updatedRewards,
  }
}
