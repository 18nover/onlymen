/**
 * Type contracts and the service-type registration for the experience
 * advanced-capability. Declares the `Experience` record (context/action/result/
 * learning plus categorization, confidence/importance, temporal, correction, and
 * provenance fields), the `ExperienceType`/`OutcomeType` enums, and the query,
 * analysis, dedupe, graph, and event shapes consumed by ExperienceService and
 * its formatting/relationship utilities. The `declare module` augmentation adds
 * `EXPERIENCE` to the core ServiceTypeRegistry so the service can register under it.
 */
import type { Memory } from "../../../types/memory.js";
import type { JsonObject, JsonPrimitive, JsonValue, UUID } from "../../../types/primitives.js";
export type { JsonObject, JsonPrimitive, JsonValue };
declare module "../../../types/service.ts" {
    interface ServiceTypeRegistry {
        EXPERIENCE: "EXPERIENCE";
    }
}
export declare const ExperienceServiceType: {
    EXPERIENCE: "EXPERIENCE";
};
export declare enum ExperienceType {
    SUCCESS = "success",// Agent accomplished something
    FAILURE = "failure",// Agent failed at something
    DISCOVERY = "discovery",// Agent discovered new information
    CORRECTION = "correction",// Agent corrected a mistake
    LEARNING = "learning",// Agent learned something new
    HYPOTHESIS = "hypothesis",// Agent formed a hypothesis
    VALIDATION = "validation",// Agent validated a hypothesis
    WARNING = "warning"
}
export declare enum OutcomeType {
    POSITIVE = "positive",
    NEGATIVE = "negative",
    NEUTRAL = "neutral",
    MIXED = "mixed"
}
export type ExperienceGraphLinkType = "similar" | "supports" | "contradicts" | "supersedes" | "co_occurs";
export interface ExperienceGraphNode {
    id: UUID;
    label: string;
    type: ExperienceType;
    outcome: OutcomeType;
    domain: string;
    keywords: string[];
    associatedEntityIds: UUID[];
    confidence: number;
    importance: number;
    timeWeight: number;
    x: number;
    y: number;
}
export interface ExperienceGraphLink {
    sourceId: UUID;
    targetId: UUID;
    type: ExperienceGraphLinkType;
    strength: number;
    reason: string;
    keywords: string[];
}
export interface ExperienceGraphSnapshot {
    generatedAt: number;
    totalExperiences: number;
    nodes: ExperienceGraphNode[];
    links: ExperienceGraphLink[];
}
export interface ExperienceDedupeGroup {
    primaryId: UUID;
    duplicateIds: UUID[];
    mergedKeywords: string[];
    reason: string;
}
export interface ExperienceDedupeResult {
    inspected: number;
    groups: ExperienceDedupeGroup[];
    merged: number;
    deleted: number;
}
export interface Experience {
    id: UUID;
    agentId: UUID;
    type: ExperienceType;
    outcome: OutcomeType;
    context: string;
    action: string;
    result: string;
    learning: string;
    tags: string[];
    domain: string;
    keywords: string[];
    associatedEntityIds: UUID[];
    relatedExperiences?: UUID[];
    supersedes?: UUID;
    mergedExperienceIds?: UUID[];
    confidence: number;
    importance: number;
    createdAt: number;
    updatedAt: number;
    lastAccessedAt?: number;
    accessCount: number;
    previousBelief?: string;
    correctedBelief?: string;
    embedding?: number[];
    memoryIds?: UUID[];
    sourceMessageIds?: UUID[];
    sourceRoomId?: UUID;
    sourceTriggerMessageId?: UUID;
    sourceTrajectoryId?: string;
    sourceTrajectoryStepId?: string;
    extractionMethod?: string;
    extractionReason?: string;
}
export interface ExperienceQuery {
    query?: string;
    type?: ExperienceType | ExperienceType[];
    outcome?: OutcomeType | OutcomeType[];
    domain?: string | string[];
    tags?: string[];
    minImportance?: number;
    minConfidence?: number;
    timeRange?: {
        start?: number;
        end?: number;
    };
    limit?: number;
    includeRelated?: boolean;
}
export interface ExperienceAnalysis {
    pattern?: string;
    frequency?: number;
    reliability?: number;
    alternatives?: string[];
    recommendations?: string[];
}
export interface ExperienceEvent {
    experienceId: UUID;
    eventType: "created" | "accessed" | "updated" | "superseded";
    timestamp: number;
    metadata?: JsonObject;
}
export interface ExperienceMemory extends Memory {
    experienceId: string;
    experienceType: ExperienceType;
}
//# sourceMappingURL=types.d.ts.map