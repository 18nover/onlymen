import type { Experience } from "../types.js";
/** Minimal interface of ExperienceService used by this module. */
interface ExperienceServiceLike {
    findSimilarExperiences(text: string, limit: number): Promise<Experience[]>;
    listExperiences(options: {
        limit: number;
    }): Promise<Experience[]>;
}
export declare function sanitizeExperienceText(text: string): string;
export declare function detectExperienceDomain(text: string): string;
export declare function extractExperienceKeywords(parts: Array<string | string[] | null | undefined>, limit?: number): string[];
export declare function findDuplicateExperienceByLearning(experienceService: ExperienceServiceLike, learning: string): Promise<Experience | null>;
export declare function isDuplicateLearning(a: string, b: string): boolean;
export {};
//# sourceMappingURL=experienceText.d.ts.map