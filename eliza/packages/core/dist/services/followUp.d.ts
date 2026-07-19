import type { JsonValue, UUID } from "../types/primitives.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
import type { Task } from "../types/task.js";
import type { ContactInfo } from "./relationships.js";
export interface FollowUpTask {
    entityId: UUID;
    reason: string;
    message?: string;
    priority: "high" | "medium" | "low";
    metadata?: Record<string, JsonValue | object>;
}
export interface FollowUpSuggestion {
    entityId: UUID;
    entityName: string;
    reason: string;
    daysSinceLastContact: number;
    relationshipStrength: number;
    suggestedMessage?: string;
}
export declare class FollowUpService extends Service {
    static serviceType: "follow_up";
    capabilityDescription: string;
    private relationshipsService;
    constructor(runtime?: IAgentRuntime);
    initialize(runtime: IAgentRuntime): Promise<void>;
    stop(): Promise<void>;
    static start(runtime: IAgentRuntime): Promise<Service>;
    scheduleFollowUp(entityId: UUID, scheduledAt: Date, reason: string, priority?: "high" | "medium" | "low", message?: string): Promise<Task>;
    getUpcomingFollowUps(days?: number, includeOverdue?: boolean): Promise<Array<{
        task: Task;
        contact: ContactInfo;
    }>>;
    completeFollowUp(taskId: UUID, notes?: string): Promise<void>;
    snoozeFollowUp(taskId: UUID, newDate: Date): Promise<void>;
    getFollowUpSuggestions(): Promise<FollowUpSuggestion[]>;
    private registerFollowUpWorker;
    private generateFollowUpReason;
    private generateFollowUpMessage;
    scheduleMultipleFollowUps(followUps: Array<{
        entityId: UUID;
        scheduledAt: Date;
        reason: string;
        priority?: "high" | "medium" | "low";
        message?: string;
    }>): Promise<Task[]>;
}
//# sourceMappingURL=followUp.d.ts.map