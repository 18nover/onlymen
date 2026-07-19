/**
 * RECENT_MESSAGES provider — builds the canonical bounded conversation
 * transcript injected into the planner prompt for the current room. Fetches room
 * memories (honoring the compaction start point), then filters, dedupes, and
 * formats them into `# Conversation Messages` / `# Posts in Thread` blocks plus a
 * `# Received Message` / `# Focus your response` framing for the incoming turn.
 * Part of the basic-capabilities bundle and the single source of dialogue
 * history — PLATFORM_CHAT_CONTEXT carries connector metadata, not the transcript.
 *
 * The filtering is load-bearing for prompt hygiene: internal bridge rows
 * (sub-agent-router / swarm-synthesis), synthetic provider-failure replies,
 * transient orchestrator status posts, leaked tool transcripts and local-path
 * dumps, and consecutive- or assistant-run duplicates are all stripped so the
 * model never re-reads its own machinery or paraphrases it as fact on a later
 * turn. Rendered history is hard-capped to the runtime conversation length
 * regardless of how many rows the adapter returns, and a persisted compaction
 * ledger is prepended when present. On any error the provider degrades to an
 * empty, safe result rather than throwing — a throw here would drop the entire
 * turn's history.
 *
 * Also surfaces cross-room `recentInteractions` between the sender's identity
 * cluster and the agent, rendered as message or post interactions by room type.
 * That fetch only runs on a turn RECOMPOSE (the provider already present in the
 * cached state passed in): no Stage-1 template renders it, so the first compose
 * of a turn skips the cross-room queries entirely.
 */
import type { Provider } from "../../../types/index.js";
export declare const recentMessagesProvider: Provider;
//# sourceMappingURL=recentMessages.d.ts.map