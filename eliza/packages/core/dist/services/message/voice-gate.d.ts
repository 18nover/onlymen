/**
 * The humanness voice gate (#14873): the single canonical last-mile pass that
 * rewrites any outbound literal into the agent's own natural voice before it
 * reaches a user, so a user never sees a hardcoded template, a canned status
 * string, or a raw `error.message`. The owner directive is absolute — "we
 * always want response messages to the user to be as if a real person
 * responded to them, no hardcoded messages or injections, even errors should
 * be rephrased."
 *
 * There is no single byte-level chokepoint: agent text leaves through two
 * transports (connector send vs in-app WebSocket) plus notifications. So "one
 * seam" is one gate implementation mandated at each transport boundary, not one
 * literal function call — {@link ensureAgentVoice} is invoked at
 * `AgentRuntime.sendMessageToTarget` (every connector-delivered agent message)
 * and at the in-app proactive relay. It is gated by the `agentVoiced`
 * provenance flag: text that is already the agent's composed voice (a
 * model-generated reply, or output this gate already rephrased) passes through
 * untouched, so genuine model output is never double-voiced and its exact
 * values are never disturbed.
 *
 * Same model seam as the scheduled-dispatch renderer and the failure-reply
 * path — `runWithTrajectoryPurpose` + `runtime.useModel` — but on ModelType
 * TEXT_SMALL with a per-agent input-hash cache, because this runs on every
 * outbound literal and must stay cheap. It diverges from the dispatch
 * renderer's fail-fast in one deliberate way (V1 below): the gate is a cosmetic
 * pass over already-final text, so a rephrase failure delivers the ORIGINAL
 * text unchanged and reports the error, never blocking delivery — dropping a
 * real user message is strictly worse than delivering one raw literal once with
 * the outage flagged.
 */
import type { Content } from "../../types/primitives.js";
import type { IAgentRuntime } from "../../types/runtime.js";
export interface EnsureAgentVoiceOptions {
    /** Origin of the outbound text (connector source, `autonomy`, `escalation`,
     *  …). Part of the cache key and the reportError context so the same literal
     *  from two surfaces rephrases independently. */
    source: string;
}
/**
 * Build the rephrase prompt from the character persona and the raw text. Reuses
 * the failure-reply hard-rules skeleton: no internal-mechanism words, no
 * em-dashes, preserve every exact value verbatim, return only the reply text.
 * Exported for direct unit testing of prompt content.
 */
export declare function buildVoiceGatePrompt(character: IAgentRuntime["character"], rawText: string): string;
/**
 * Rewrite `content.text` into the agent's natural voice unless it is already
 * voiced or empty. Returns a new `Content` with `agentVoiced: true` on success;
 * on any failure (thrown model call, blank output, no model surface) returns
 * the ORIGINAL content unchanged after `runtime.reportError` — delivery is
 * never blocked. Non-text content (attachments only, no `text`) passes through.
 */
export declare function ensureAgentVoice(runtime: IAgentRuntime, content: Content, options: EnsureAgentVoiceOptions): Promise<Content>;
//# sourceMappingURL=voice-gate.d.ts.map