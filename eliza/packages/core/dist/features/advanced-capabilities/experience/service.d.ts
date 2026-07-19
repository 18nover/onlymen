import type { UUID } from "../../../types/primitives.js";
import type { IAgentRuntime } from "../../../types/runtime.js";
import { Service, type ServiceTypeName } from "../../../types/service.js";
import { type Experience, type ExperienceAnalysis, type ExperienceDedupeResult, type ExperienceGraphSnapshot, type ExperienceQuery, ExperienceType } from "./types.js";
export declare class ExperienceService extends Service {
    static serviceType: ServiceTypeName;
    capabilityDescription: string;
    private experiences;
    private experiencesByDomain;
    private experiencesByType;
    private dirtyExperiences;
    private persistTimer;
    private maintenanceTimer;
    private decayManager;
    private relationshipManager;
    constructor(runtime: IAgentRuntime);
    static start(runtime: IAgentRuntime): Promise<ExperienceService>;
    private toTimestamp;
    private toOptionalTimestamp;
    private asStringArray;
    private asOptionalUuidArray;
    private asUuidArray;
    private dedupeStrings;
    private normalizeTags;
    private deriveKeywords;
    private asOptionalEmbedding;
    private clampScore;
    private isExperienceType;
    private isOutcomeType;
    private cloneExperience;
    private indexExperience;
    private unindexExperience;
    private setExperience;
    private parseExperienceMemory;
    private generateEmbedding;
    private buildExperienceMemory;
    private touchExperiences;
    private loadExperiences;
    recordExperience(experienceData: Partial<Experience>): Promise<Experience>;
    private saveExperienceToMemory;
    private persistDirtyExperiences;
    getExperience(id: UUID): Promise<Experience | null>;
    listExperiences(query?: ExperienceQuery): Promise<Experience[]>;
    updateExperience(id: UUID, updates: Partial<Experience>): Promise<Experience | null>;
    deleteExperience(id: UUID): Promise<boolean>;
    queryExperiences(query: ExperienceQuery): Promise<Experience[]>;
    private resolveExperiences;
    /** Apply query filters (type, outcome, domain, tags, confidence, importance, timeRange). */
    private applyFilters;
    /**
     * Find similar experiences using vector search + reranking.
     *
     * Reranking strategy:
     *   Vector similarity is the dominant signal (70%) — an irrelevant experience
     *   should never outrank a relevant one just because it has high confidence.
     *   Quality signals (confidence, importance) act as tiebreakers among
     *   similarly-relevant results (30% combined).
     *
     *   A minimum similarity threshold filters out noise so quality signals
     *   can't promote genuinely irrelevant experiences.
     */
    findSimilarExperiences(text: string, limit?: number): Promise<Experience[]>;
    /** Fallback when embeddings are unavailable: sort by decayed confidence * importance. */
    private fallbackSort;
    getExperienceGraph(query?: ExperienceQuery): Promise<ExperienceGraphSnapshot>;
    dedupeDuplicateExperiences(options?: {
        deleteDuplicates?: boolean;
        limit?: number;
    }): Promise<ExperienceDedupeResult>;
    private buildGraphSnapshot;
    private buildGraphNode;
    private buildGraphLinks;
    private inferGraphLink;
    private toGraphLinkType;
    private getSharedKeywords;
    private getTimeWeight;
    private selectPrimaryExperience;
    private areAlreadyDedupeLinked;
    private mergeDuplicateExperience;
    analyzeExperiences(domain?: string, type?: ExperienceType): Promise<ExperienceAnalysis>;
    private cosineSimilarity;
    private findCommonPatterns;
    private calculateOutcomeConsistency;
    private extractAlternatives;
    private generateRecommendations;
    stop(): Promise<void>;
}
//# sourceMappingURL=service.d.ts.map