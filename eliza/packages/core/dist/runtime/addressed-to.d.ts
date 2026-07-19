/**
 * Resolves and persists the message handler's `addressedTo` targets. Upserts
 * "addressed" relationship edges from the speaker to each resolved participant,
 * and decides whether an inbound turn is directed at another participant (so the
 * agent is merely overhearing and should not act on it). All name/id resolution
 * runs against the room's entity list, without an LLM call.
 */
import type { UUID } from "../types/index.js";
import type { Memory } from "../types/memory.js";
import type { IAgentRuntime } from "../types/runtime.js";
export interface ApplyAddressedToArgs {
    runtime: IAgentRuntime;
    message: Memory;
    addressedTo: readonly string[];
}
export interface ApplyAddressedToResult {
    created: number;
    updated: number;
    resolved: UUID[];
}
export declare function applyAddressedTo(args: ApplyAddressedToArgs): Promise<ApplyAddressedToResult>;
interface ResolveTargetsArgs {
    runtime: IAgentRuntime;
    message: Memory;
    addressedTo: readonly string[];
}
/**
 * Detects that the inbound message is explicitly directed at ANOTHER known
 * participant — not this agent — so the agent is merely overhearing. Used to
 * skip the simple→requiresTool promotion so the agent does not fabricate a tool
 * task from a turn it was not asked to act on (#9874 item 1).
 *
 * Uniform, NOT bot-specific: it fires identically whether the other participant
 * is a human or a bot. Bot-ness is surfaced to the model as CONTEXT instead (the
 * conversation transcript tags `fromBot` senders as "Name (bot)"), so how to
 * treat overheard bot crosstalk is the model's call with full context — there is
 * no runtime type-branch on bot-ness here.
 *
 * Returns true only when ALL hold:
 *  - the message carries explicit `addressedTo` targets,
 *  - this agent is NOT among them (by literal name/id/username OR a resolved room
 *    alias),
 *  - at least one addressee RESOLVES to a real room participant other than us.
 *
 * Fails SAFE (returns false) whenever it cannot positively confirm that a
 * different real participant was addressed: empty `addressedTo`, a turn
 * addressed to us, or an addressee that resolves to no real room entity (a bare
 * unrecognized name) all return false — the agent keeps acting on requests meant
 * for it, and DMs / undirected asks (which carry no other-participant addressee)
 * are never gated.
 */
export declare function messageAddressedToOtherParticipant(args: ApplyAddressedToArgs): Promise<boolean>;
export declare function resolveAddressedTargets(args: ResolveTargetsArgs): Promise<UUID[]>;
export {};
//# sourceMappingURL=addressed-to.d.ts.map