/**
 * Runs the `TrustEngine` service — the scoring core of the trust capability.
 * Computes multi-dimensional trust profiles (reliability, competence, integrity,
 * benevolence, transparency) by aggregating decayed, verification-weighted
 * evidence, derives an overall score under context-specific dimension weights,
 * and gates actions via `evaluateTrustDecision` against `TrustRequirements`.
 *
 * `recordInteraction` ingests evidence with per-entity hourly rate limiting and
 * diminishing-returns weighting. Profiles are cached (FIFO-capped) and persisted
 * as entity `trust_profile` components; evidence is read from both components
 * and the `trustEvidence` table (`SecurityStore`) and merged. Consumed by the
 * SecurityModule, ContextualPermissionSystem, trust providers/actions, and the
 * `TrustEngineServiceWrapper` that registers it with the runtime.
 */
import { type IAgentRuntime, Service, type UUID } from "../../../types/index.js";
import { type TrustCalculationConfig, type TrustContext, type TrustDecision, type TrustInteraction, type TrustProfile, type TrustRequirements } from "../types/trust.js";
export declare class TrustEngine extends Service {
    static serviceType: "trust-engine:core";
    capabilityDescription: string;
    private static readonly ACTION_CONTEXT_WEIGHTS;
    private trustConfig;
    private profileCache;
    private readonly cacheTimeout;
    private readonly maxProfileCacheEntries;
    private readonly maxInteractionsInMemory;
    private interactions;
    private rateLimits;
    private readonly maxEvidencePerHour;
    constructor(config?: Partial<TrustCalculationConfig>);
    initialize(runtime: IAgentRuntime): Promise<void>;
    stop(): Promise<void>;
    static start(runtime: IAgentRuntime): Promise<Service>;
    /**
     * Calculate trust profile for an entity
     */
    calculateTrust(subjectId: UUID, context: TrustContext): Promise<TrustProfile>;
    /**
     * Records a trust interaction
     */
    recordInteraction(interaction: TrustInteraction): Promise<void>;
    /**
     * Evaluate if an action is allowed based on trust
     */
    evaluateTrustDecision(entityId: UUID, requirements: TrustRequirements, context: TrustContext): Promise<TrustDecision>;
    /**
     * Check rate limiting for evidence recording
     */
    private static readonly DIMINISHING_WEIGHTS;
    private checkRateLimit;
    /**
     * Calculate trust dimensions from evidence
     */
    private calculateDimensions;
    /**
     * Calculate overall trust score from dimensions
     */
    private calculateOverallTrust;
    /**
     * Calculate confidence based on evidence quantity and consistency
     */
    private calculateConfidence;
    /**
     * Calculate age weight for evidence based on recency
     */
    private calculateAgeWeight;
    /**
     * Analyze trust trend over time
     */
    private analyzeTrend;
    /**
     * Load evidence from storage
     */
    private loadEvidence;
    /**
     * Save trust profile to storage
     */
    private saveTrustProfile;
    /**
     * Generate suggestions for building trust
     */
    private generateTrustBuildingSuggestions;
    /**
     * Generate suggestions for improving specific dimensions
     */
    private generateDimensionSuggestions;
    /**
     * Evaluates trust for an entity (simplified API for actions)
     */
    evaluateTrust(entityId: UUID, evaluatorId: UUID, context?: Partial<TrustContext>): Promise<TrustProfile>;
    /**
     * Get recent trust interactions for an entity
     * @param daysBack Number of days to look back (default: 10)
     */
    getRecentInteractions(entityId: UUID, daysBack?: number): Promise<TrustInteraction[]>;
}
//# sourceMappingURL=TrustEngine.d.ts.map