import type { Evaluator, Memory } from "../../../../types/index.js";
import type { ExperienceService } from "../service.js";
import { type Experience, ExperienceType, OutcomeType } from "../types.js";
interface ExtractedExperience {
    type: ExperienceType;
    outcome: OutcomeType;
    domain: string;
    learning: string;
    context: string;
    confidence: number;
    importance: number;
    reasoning: string;
}
interface ExperienceOutput {
    experiences: ExtractedExperience[];
}
interface ExperiencePrepared {
    experienceService: ExperienceService;
    recentMessages: Memory[];
    conversationContext: string;
    signalSummary: string;
    existingExperiences: Experience[];
    provenance: Pick<Experience, "sourceMessageIds" | "sourceRoomId" | "sourceTriggerMessageId" | "sourceTrajectoryId" | "sourceTrajectoryStepId" | "associatedEntityIds">;
}
export declare const experiencePatternEvaluator: Evaluator<ExperienceOutput, ExperiencePrepared>;
export {};
//# sourceMappingURL=experience-items.d.ts.map