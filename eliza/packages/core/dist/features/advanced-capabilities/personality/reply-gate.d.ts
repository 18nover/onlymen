/**
 * Pure reply-gate decision logic for the personality capability. Given a user's
 * and the global slot's `reply_gate` setting, decides whether the agent may
 * respond at all before the model call — supporting the `on_mention` and
 * `never_until_lift` mute modes and an explicit, testable list of lift phrases
 * that unmute the agent. Consumed by the message runtime to short-circuit muted
 * conversations without spending a model call.
 */
import type { PersonalitySlot, ReplyGateMode } from "./types.js";
/**
 * Pure decision for whether the agent should respond at all given a reply
 * gate setting. Used by the message runtime to short-circuit BEFORE the
 * model call when a user has asked the agent to "shut up" or only respond
 * on mention.
 *
 * Resolution order (most specific wins):
 *   1. user slot reply_gate (if set)
 *   2. global slot reply_gate (if set)
 *   3. "always" (no gate)
 */
export type ReplyGateDecision = {
    allow: true;
    reason: "no_gate" | "lift_signal" | "on_mention_satisfied";
} | {
    allow: false;
    reason: "never_until_lift" | "on_mention_not_addressed";
    gateMode: ReplyGateMode;
    scope: "user" | "global";
};
export interface ReplyGateInput {
    userSlot?: PersonalitySlot | null;
    globalSlot?: PersonalitySlot | null;
    messageText: string | undefined;
    explicitlyAddressesAgent: boolean;
}
export declare function resolveEffectiveReplyGate(userSlot: PersonalitySlot | null | undefined, globalSlot: PersonalitySlot | null | undefined): {
    mode: ReplyGateMode | null;
    scope: "user" | "global" | null;
};
export declare function messageContainsLiftSignal(text: string | undefined, explicitlyAddressesAgent: boolean): boolean;
export declare function decideReplyGate(input: ReplyGateInput): ReplyGateDecision;
//# sourceMappingURL=reply-gate.d.ts.map