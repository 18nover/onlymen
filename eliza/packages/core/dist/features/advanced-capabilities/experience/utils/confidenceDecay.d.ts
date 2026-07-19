/**
 * Confidence-decay model for the experience capability: `ConfidenceDecayManager`
 * ages an experience's stored confidence toward a floor along a configurable
 * half-life after a grace period, with per-type and per-domain tuning (facts and
 * safety/security lessons decay slower; performance and user-preference insights
 * decay faster). ExperienceService uses the decayed confidence as the dominant
 * quality signal when ranking and filtering recall; the manager also exposes
 * reinforcement boosts and confidence-over-time trends.
 */
import type { Experience } from "../types.js";
export interface DecayConfig {
    halfLife: number;
    minConfidence: number;
    decayStartDelay: number;
}
export declare class ConfidenceDecayManager {
    private config;
    constructor(config?: Partial<DecayConfig>);
    /**
     * Calculate the decayed confidence for an experience
     */
    getDecayedConfidence(experience: Experience): number;
    /**
     * Get experiences that need reinforcement (low confidence due to decay)
     */
    getExperiencesNeedingReinforcement(experiences: Experience[], threshold?: number): Experience[];
    /**
     * Calculate reinforcement boost when an experience is validated
     */
    calculateReinforcementBoost(experience: Experience, validationStrength?: number): number;
    /**
     * Adjust decay rate based on experience type and domain
     */
    getDomainSpecificDecay(experience: Experience): DecayConfig;
    /**
     * Get confidence trend for an experience over time
     */
    getConfidenceTrend(experience: Experience, points?: number): Array<{
        timestamp: number;
        confidence: number;
    }>;
}
//# sourceMappingURL=confidenceDecay.d.ts.map