/**
 * Structural triage signals for cross-platform messages.
 *
 * The engine deliberately makes no urgency, spam, or next-action judgment —
 * those are language-understanding calls that belong to the model reading the
 * MESSAGE action output (#14716; keyword tables were English-only and
 * word-presence-based, so "no deadline on this" read as urgent). It attaches
 * only typed structural facts the model cannot cheaply derive from the
 * message text itself:
 *   - contact weight (relationship category resolved via RelationshipsService)
 *   - whether the user previously replied in the message's thread
 * and orders the feed by recency, with contact weight as the tie-break.
 */
import type { ContactInfo } from "../../../services/relationships.js";
import type { IAgentRuntime } from "../../../types/index.js";
import type { MessageRef, TriageScore } from "./types.js";
export declare const DEFAULT_CONTACT_WEIGHT = 0.5;
export declare function resetMissingServiceWarning(): void;
export declare function resolveContactWeight(runtime: IAgentRuntime, source: string, identifier: string): Promise<{
    weight: number;
    contact: ContactInfo | null;
}>;
export interface ScoreContext {
    /**
     * Optional: set of threadIds in which the user has previously replied.
     * Surfaced as the userRepliedInThread signal.
     */
    userRepliedThreadIds?: Set<string>;
    nowMs?: number;
}
export declare function scoreMessage(runtime: IAgentRuntime, message: MessageRef, ctx?: ScoreContext): Promise<TriageScore>;
export declare function scoreMessages(runtime: IAgentRuntime, messages: MessageRef[], ctx?: ScoreContext): Promise<MessageRef[]>;
/**
 * Presentation order for the feed: newest first, contact weight breaking
 * ties. Unscored refs sort at the default weight — the comparator needs a
 * total order, and a missing score carries no relationship information.
 */
export declare function rankScored(messages: MessageRef[]): MessageRef[];
//# sourceMappingURL=triage-engine.d.ts.map