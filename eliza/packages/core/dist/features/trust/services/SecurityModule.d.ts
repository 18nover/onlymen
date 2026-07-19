/**
 * Runs the `SecurityModule` service — the threat-detection core of the trust
 * capability. Analyzes messages for prompt injection, social-engineering
 * pressure (urgency, authority, intimidation, liking, reciprocity, and so on),
 * and credential theft, and detects account-level abuse: multi-account linkage,
 * phishing campaigns, username impersonation, and coordinated activity. Scoring
 * is deterministic — regex banks (shared via `../injection-primitives`),
 * obfuscation-aware keyword matching, behavioral-profile similarity, and
 * Levenshtein/visual-similarity comparisons — with no model calls.
 *
 * Confirmed events are logged to the runtime log and best-effort persisted to
 * the `securityIncidents` table (`SecurityStore`), then mapped to trust evidence
 * fed back into the {@link TrustEngine}. Per-entity message/action history and
 * behavioral profiles are held in memory, bounded by an LRU cap
 * ({@link MAX_TRACKED_ENTITIES}) so a long-lived agent that talks to many users
 * cannot grow without limit. The runtime-facing wrapper is
 * `SecurityModuleServiceWrapper`.
 */
import type { IAgentRuntime, UUID } from "../../../types/index.js";
import { type Action, type CoordinationDetection, type CredentialTheftDetection, type ImpersonationDetection, type Message, type MultiAccountDetection, type PhishingDetection, type SecurityCheck, type SecurityContext, type SecurityEvent, SecurityEventType, type ThreatAssessment } from "../types/security.js";
import type { TrustEngine } from "./TrustEngine.js";
export interface RiskScore {
    score: number;
    factors: Record<string, number>;
    recommendation: string;
}
export interface SocialEngineeringFactors {
    urgency: number;
    authority: number;
    intimidation: number;
    liking: number;
    reciprocity: number;
    commitment: number;
    socialProof: number;
    scarcity: number;
}
export declare class SecurityModule {
    private runtime;
    private trustEngine;
    private behavioralProfiles;
    private messageHistory;
    private actionHistory;
    /**
     * Cap on the number of distinct entities retained in the per-entity
     * analysis maps. Without this, a long-running agent that talks to many
     * users accumulates one entry per entity forever (each holding up to 100
     * messages/actions). LRU eviction keeps the most recently active entities.
     */
    private static readonly MAX_TRACKED_ENTITIES;
    /**
     * Insert into a per-entity analysis map with LRU eviction of the oldest
     * entity once {@link MAX_TRACKED_ENTITIES} is exceeded. Re-inserting an
     * existing key refreshes its recency.
     */
    private setEntityScoped;
    private readonly CREDENTIAL_PATTERNS;
    private readonly SENSITIVE_KEYWORDS;
    private readonly PHISHING_INDICATORS;
    /**
     * Initialize the security module
     */
    initialize(runtime: IAgentRuntime, trustEngine: TrustEngine): Promise<void>;
    /**
     * Detect prompt injection attempts
     */
    detectPromptInjection(message: string, context: SecurityContext): Promise<SecurityCheck>;
    /**
     * Detect social engineering attempts
     */
    detectSocialEngineering(message: string, context: SecurityContext): Promise<SecurityCheck>;
    /**
     * Analyze a message for security threats
     */
    analyzeMessage(message: string, entityId: UUID, context: SecurityContext): Promise<SecurityCheck>;
    /**
     * Assess overall threat level
     */
    assessThreatLevel(context: SecurityContext): Promise<ThreatAssessment>;
    /**
     * Get recent security incidents
     */
    getRecentSecurityIncidents(_roomId?: UUID, hours?: number): Promise<SecurityEvent[]>;
    /**
     * Get security recommendations based on threat level
     */
    getSecurityRecommendations(threatLevel: number): string[];
    /**
     * Log security event
     */
    logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp" | "handled">): Promise<void>;
    /**
     * Analyze social engineering factors
     */
    private analyzeSocialEngineeringFactors;
    /**
     * Calculate keyword score
     */
    private calculateKeywordScore;
    private static readonly SE_FACTOR_PHRASES;
    private detectFactorScore;
    /**
     * Calculate overall social engineering risk
     */
    private calculateSocialEngineeringRisk;
    /**
     * Analyze semantic patterns
     */
    private analyzeSemantics;
    /**
     * Log trust impact from security events
     */
    logTrustImpact(entityId: UUID, event: SecurityEventType, impact: number, context?: {
        worldId?: UUID;
    }): Promise<void>;
    /**
     * Maps security events to trust evidence types
     */
    private mapSecurityEventToTrustEvidence;
    /**
     * Detect multi-account manipulation
     */
    detectMultiAccountPattern(entities: UUID[], timeWindow?: number): Promise<MultiAccountDetection | null>;
    /**
     * Detect credential theft attempts
     */
    detectCredentialTheft(message: string, entityId: UUID, context: SecurityContext): Promise<CredentialTheftDetection | null>;
    /**
     * Detect phishing campaigns
     */
    detectPhishing(messages: Message[], entityId: UUID): Promise<PhishingDetection | null>;
    /**
     * Detect impersonation attempts
     */
    detectImpersonation(username: string, existingUsers: string[]): Promise<ImpersonationDetection | null>;
    /**
     * Detect coordinated activity
     */
    detectCoordinatedActivity(entities: UUID[], timeWindow?: number): Promise<CoordinationDetection | null>;
    /**
     * Helper methods for pattern detection
     */
    private getBehavioralProfiles;
    private buildBehavioralProfile;
    private calculateProfileSimilarities;
    private calculateVariance;
    private checkSynchronizedActions;
    private getRecentActions;
    private detectSuspiciousLinks;
    private extractLinks;
    private calculateStringSimilarity;
    private calculateVisualSimilarity;
    private levenshteinDistance;
    /**
     * Store message for analysis
     */
    storeMessage(message: Message): Promise<void>;
    /**
     * Store action for analysis
     */
    storeAction(action: Action): Promise<void>;
}
//# sourceMappingURL=SecurityModule.d.ts.map