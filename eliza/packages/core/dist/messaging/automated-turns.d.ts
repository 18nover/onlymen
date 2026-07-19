/**
 * Structural classifier for message rows injected by the agent's own bridge
 * machinery (sub-agent relay, swarm synthesis), identified by `content.source`
 * or sub-agent metadata — stamped structurally, never inferred from message
 * text. RECENT_MESSAGES uses it to strip bridge rows from the transcript.
 * Consumers must only use this signal to change HOW a turn is presented,
 * never to withhold recall: bridge rows sit inside real human conversation,
 * so gating context providers off this signal silently blinds the agent on
 * exactly those turns. Absence of the signal means the turn is treated as
 * human — connectors that stamp nothing keep today's behavior.
 */
import type { Memory } from "../types/memory.js";
export declare const INTERNAL_BRIDGE_MESSAGE_SOURCES: ReadonlySet<string>;
/** Message injected by the agent's own sub-agent/swarm bridge machinery. */
export declare function isInternalBridgeMessage(memory: Memory): boolean;
//# sourceMappingURL=automated-turns.d.ts.map