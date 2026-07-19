import type { Experience, JsonObject } from "../types.js";
export interface ExperienceChain {
    rootExperience: string;
    chain: string[];
    strength: number;
    validated: boolean;
}
export interface ExperienceRelationship {
    fromId: string;
    toId: string;
    type: "causes" | "contradicts" | "supports" | "supersedes" | "related";
    strength: number;
    metadata?: JsonObject;
}
export declare class ExperienceRelationshipManager {
    private relationships;
    addRelationship(relationship: ExperienceRelationship): void;
    removeExperience(experienceId: string): void;
    findRelationships(experienceId: string, type?: string): ExperienceRelationship[];
    detectCausalChain(experiences: Experience[]): ExperienceChain[];
    private isRelated;
    private contentSimilarity;
    findContradictions(experience: Experience, allExperiences: Experience[]): Experience[];
    getExperienceImpact(experienceId: string, allExperiences: Experience[]): number;
}
//# sourceMappingURL=experienceRelationships.d.ts.map