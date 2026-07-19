import type { IAgentRuntime, UUID } from "../../../types/index.js";
export interface FactCandidateRecord {
    entityId: UUID;
    kind: "contradict" | "merge";
    existingFactId?: UUID;
    proposedText: string;
    reason?: string;
    evidenceMessageId?: UUID;
}
export declare function recordFactCandidate(runtime: IAgentRuntime, params: FactCandidateRecord): Promise<void>;
//# sourceMappingURL=_factCandidates.d.ts.map