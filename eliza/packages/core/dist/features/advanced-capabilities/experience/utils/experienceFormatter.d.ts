/**
 * Pure formatting and aggregation helpers for the experience capability. Renders
 * an `Experience` for display, prompt injection, list, and RAG-storage text
 * (with per-type emoji), groups experiences by domain, and computes aggregate
 * stats (counts by type/outcome/domain, average confidence/importance, and
 * success rate). Keyword extraction falls back to deriving terms from
 * tags/learning/action/type/outcome/domain when none are stored. Consumed by the
 * experience providers/prompts and pinned by experienceFormatter.test.ts.
 */
import type { Experience } from "../types.js";
import { ExperienceType, OutcomeType } from "../types.js";
export declare function formatExperienceForDisplay(experience: Experience): string;
export declare function formatExperienceSummary(experience: Experience): string;
export declare function formatExperienceForPrompt(experience: Experience, index?: number): string;
export declare function formatExperienceList(experiences: Experience[]): string;
export declare function formatPatternSummary(pattern: {
    description: string;
    frequency: number;
    significance: string;
}): string;
export declare function groupExperiencesByDomain(experiences: Experience[]): Map<string, Experience[]>;
export declare function getExperienceStats(experiences: Experience[]): {
    total: number;
    byType: Record<ExperienceType, number>;
    byOutcome: Record<OutcomeType, number>;
    byDomain: Record<string, number>;
    averageConfidence: number;
    averageImportance: number;
    successRate: number;
};
export declare function formatExperienceForRAG(experience: Experience): string;
export declare function extractKeywords(experience: Experience): string[];
//# sourceMappingURL=experienceFormatter.d.ts.map