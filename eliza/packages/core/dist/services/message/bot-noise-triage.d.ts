/**
 * Small-model triage for unaddressed bot/webhook traffic.
 *
 * Every inbound message normally runs the full Stage 1 RESPONSE_HANDLER call —
 * the most expensive model in the stack. That is correct for human/addressed
 * turns (Stage 1 produces the reply), but a relay channel flooding automated
 * webhook embeds (status feeds, queue updates, bot-to-bot chatter) burns a
 * full composeState + RESPONSE_HANDLER call per message just to conclude
 * IGNORE. On subscription-backed RESPONSE_HANDLER providers (plugin-cli-
 * inference claude-sdk/codex-sdk) ~1000 such IGNOREs/day drain the daily
 * session budget and take the whole agent down at the provider's reset window.
 *
 * This gate runs BEFORE state composition, only for messages that are
 * positively bot/webhook-authored (`fromBot` connector metadata) AND not
 * addressed to the agent (no platform mention/reply, agent not named in the
 * text). It asks the cheap TEXT_SMALL tier for a one-word RESPOND/IGNORE
 * verdict; IGNORE ends the turn with zero large-tier calls. Everything
 * ambiguous fails OPEN into the normal pipeline: private channels, sub-agent
 * completion relays, autonomous turns, missing channel metadata, a missing
 * TEXT_SMALL handler, model errors, and unparseable verdicts all fall through
 * to the full Stage 1 path, so behavior for addressed/owner/human traffic is
 * unchanged.
 */
import type { Memory } from "../../types/memory.js";
import type { IAgentRuntime } from "../../types/runtime.js";
export interface BotNoiseTriageArgs {
    runtime: IAgentRuntime;
    message: Memory;
    /** Platform mention/reply or agent named in text (computed by the caller). */
    explicitlyAddressesAgent: boolean;
}
export type BotNoiseTriageResult = 
/** Gate did not apply (or failed open) — run the full pipeline. */
{
    applied: false;
}
/** Small-model verdict. `respond: false` ends the turn before Stage 1. */
 | {
    applied: true;
    respond: boolean;
};
/**
 * The gate is ON by default; opt out with ELIZA_BOT_NOISE_TRIAGE=0|false|off.
 */
export declare function isBotNoiseTriageEnabled(runtime: IAgentRuntime): boolean;
/**
 * Deterministic preconditions: only positively-identified, unaddressed
 * bot/webhook group traffic is triagable. Anything the checks cannot confirm
 * falls through to the full pipeline (fail-open).
 */
export declare function isTriagableBotNoiseMessage(message: Memory, explicitlyAddressesAgent: boolean): boolean;
export declare function buildBotNoiseTriagePrompt(args: {
    agentName: string;
    senderName: string;
    messageText: string;
    historyLines: readonly string[];
}): string;
/**
 * Run the cheap-tier triage. Returns `{ applied: false }` whenever the gate
 * does not confidently apply — the caller then runs the normal pipeline.
 */
export declare function runBotNoiseTriage(args: BotNoiseTriageArgs): Promise<BotNoiseTriageResult>;
//# sourceMappingURL=bot-noise-triage.d.ts.map