import type { MessageHandlerExtract, MessageHandlerExtractedRelationship } from "../types/components.js";
import { type Memory } from "../types/memory.js";
import type { ChatMessage, JSONSchema, ToolDefinition } from "../types/model.js";
import type { IAgentRuntime } from "../types/runtime.js";
import type { State } from "../types/state.js";
export declare const FACTS_AND_RELATIONSHIPS_TOOL_NAME = "FACTS_AND_RELATIONSHIPS_VALIDATE";
export declare const factsAndRelationshipsSchema: JSONSchema;
export declare function createFactsAndRelationshipsTool(): ToolDefinition;
export declare const factsAndRelationshipsInstructions = "task: Validate candidate facts and relationships extracted from the latest user message. Persist only what is genuinely new.\n\nrules:\n- drop any candidate that is a paraphrase or trivial restatement of an existing fact or relationship\n- drop candidates that are speculative, agent-generated, or not stated by the user\n- drop credentials, API keys, passwords, raw tokens, and other secrets; never persist their values\n- drop synthetic summaries, compaction artifacts, generic chat filler, and one-off task requests\n- normalize entity names to match the names already used in existing relationships or room entities when possible (do not invent new aliases)\n- when an entity UUID is shown in room_entities, prefer that UUID for relationship subject/object; otherwise use the canonical display name\n- relationships use snake_case predicates (\"works_with\", \"lives_in\", \"manages\")\n- if every candidate is a duplicate, return empty arrays\n- thought is a one-line internal note about the dedup decision";
export interface FactsAndRelationshipsResult {
    facts: string[];
    relationships: MessageHandlerExtractedRelationship[];
    thought: string;
}
export interface FactsAndRelationshipsRunArgs {
    runtime: IAgentRuntime;
    message: Memory;
    state: State;
    extract: MessageHandlerExtract;
    priorDialogue?: readonly Memory[];
}
export interface FactsAndRelationshipsRunResult {
    parsed: FactsAndRelationshipsResult;
    messages: ChatMessage[];
    tools: ToolDefinition[];
    rawResponse?: unknown;
    /**
     * The provider that actually served THIS facts/relationships TEXT_LARGE call,
     * captured synchronously right after the call resolved (before any other
     * TEXT_LARGE call can overwrite the runtime-wide last-resolved-provider).
     * Carried with the result so the trajectory stage recorder attributes the
     * facts stage to the real provider instead of a stale shared value or the
     * fabricated `"default"` literal (#13623).
     */
    provider?: string;
    written: {
        facts: number;
        relationships: number;
    };
}
export declare function runFactsAndRelationshipsStage(args: FactsAndRelationshipsRunArgs): Promise<FactsAndRelationshipsRunResult>;
export declare function parseFactsAndRelationshipsOutput(raw: unknown): FactsAndRelationshipsResult;
//# sourceMappingURL=facts-and-relationships.d.ts.map