/**
 * Shared trajectory types and helpers for the skill-learning evaluators
 * (skill-items.ts): the trajectory / step / service shapes, a defensive
 * `getTrajectoryService` lookup that returns null unless the "trajectories" service
 * exposes both list and detail, a tolerant JSON-object parser, and
 * `formatTrajectoryForPrompt`, which renders a trajectory (step by step, prompts
 * truncated) into the digest fed to the extraction model.
 */
import type { IAgentRuntime } from "../../../types/index.js";
export interface SkillTrajectoryLlmCall {
    systemPrompt?: string;
    userPrompt?: string;
    response?: string;
    actionType?: string;
    purpose?: string;
}
export interface SkillTrajectoryStep {
    stepId?: string;
    timestamp: number;
    llmCalls?: SkillTrajectoryLlmCall[];
    usedSkills?: string[];
}
export interface SkillTrajectory {
    trajectoryId: string;
    agentId: string;
    startTime: number;
    endTime?: number;
    steps?: SkillTrajectoryStep[];
    metrics?: {
        finalStatus?: string;
    };
    metadata?: Record<string, unknown>;
}
export interface SkillTrajectoryListItem {
    id: string;
    status: string;
    stepCount?: number;
    endTime: number | null;
    metadata?: Record<string, unknown>;
}
export interface SkillTrajectoryService {
    listTrajectories?: (options: {
        limit?: number;
        status?: string;
    }) => Promise<{
        trajectories: SkillTrajectoryListItem[];
    }>;
    getTrajectoryDetail?: (trajectoryId: string) => Promise<SkillTrajectory | null>;
}
export declare function parseJsonObject(raw: string): Record<string, unknown> | null;
export declare function getTrajectoryService(runtime: IAgentRuntime): SkillTrajectoryService | null;
export declare function formatTrajectoryForPrompt(trajectory: SkillTrajectory, options?: {
    statusLabel?: string;
    includeStepCount?: boolean;
    blankLineAfterHeader?: boolean;
}): string;
//# sourceMappingURL=trajectory-evaluator-utils.d.ts.map