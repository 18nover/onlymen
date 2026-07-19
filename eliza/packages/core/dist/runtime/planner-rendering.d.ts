/**
 * Renders completed planner trajectory steps into native assistant/tool chat
 * message pairs and projects a tool result to plain text for the next planner
 * call, shaping everything append-only so the prompt prefix stays byte-stable
 * for provider prompt caching. Also re-exports the provider cache-plan helpers.
 */
import type { ChatMessage } from "../types/model.js";
import type { JsonValue } from "../types/primitives.js";
import type { PlannerStep, PlannerToolResult } from "./planner-types.js";
import { type CacheableSection, type ProviderCachePlan, type ProviderCachePlanArgs } from "./provider-cache-plan.js";
/**
 * Options for {@link trajectoryStepsToMessages}.
 */
export interface TrajectoryStepsToMessagesOptions {
    /**
     * When set, caps each rendered tool-result string to this many characters.
     *
     * A single pathologically-large tool result (a 30 KB shell output, a
     * full file read, a multi-thousand-line grep) can blow the planner's
     * compaction budget single-handedly when it lives inside the
     * kept-verbatim window after compaction. This cap renders such results
     * as `<head> ... [N chars truncated] ... <tail>` so the planner still
     * sees the beginning and end of the result (which is where structure
     * lives) without paying for the middle.
     *
     * **The trajectory itself is unchanged** — the raw `PlannerStep.result`
     * still carries the full content for archival, recorder, replay, and
     * any downstream consumer that wants the unredacted output. Only the
     * wire-shape message that goes to the next planner call is truncated.
     *
     * Default: undefined (no cap).
     */
    maxToolResultChars?: number;
}
/**
 * Truncate a tool-result string to fit within `maxChars` by keeping a head
 * + tail and stitching in a deterministic marker. Pure function — exported
 * so the evaluator/recorder can mirror the exact rendering rule.
 *
 * Returns the input unchanged when it already fits OR when `maxChars` is
 * unset / non-positive / not finite.
 */
export declare function truncateToolResultText(text: string, maxChars: number | undefined): string;
/**
 * Convert completed trajectory steps into proper assistant/tool message pairs
 * for native tool-calling. Skips steps that lack a toolCall or result (e.g.
 * terminal-only steps). The resulting array grows append-only across planner
 * iterations, which keeps the prefix byte-identical for cache hits.
 *
 * Emits AI SDK v6's `AssistantModelMessage` / `ToolModelMessage` shape — tool
 * calls live inside `content` as `ToolCallPart`, tool results inside `content`
 * as `ToolResultPart`. The legacy OpenAI v0.x shape (`assistant` with a
 * top-level `toolCalls` array + `tool` with `toolCallId`/`name` siblings) is
 * silently ignored by AI SDK v6's message conversion: `AssistantContent` only
 * understands `string | Array<TextPart | FilePart | ReasoningPart |
 * ToolCallPart | ToolResultPart | ToolApprovalRequest>` and has no top-level
 * `toolCalls` field. Emitting the legacy shape leaves the evaluator's
 * downstream model call with no view of the tool history, so the LLM keeps
 * routing CONTINUE under the belief that no tool has been executed yet — the
 * planner-loop then iterates until `TrajectoryLimitExceeded` on every
 * shell-tool turn.
 */
export declare function trajectoryStepsToMessages(steps: PlannerStep[], options?: TrajectoryStepsToMessagesOptions): ChatMessage[];
/**
 * Project a PlannerToolResult to plain-text `tool` message content per OpenAI
 * conventions: prefer `result.text`, fall back to a JSON serialization of
 * `data`/`error` only when no text projection exists. Strict-grammar
 * providers (Cerebras) and Anthropic both prefer text over a JSON blob in
 * the tool turn, and this preserves byte-stability when text is consistent.
 */
export declare function toolMessageContent(result: PlannerToolResult): string;
export declare function cacheProviderOptions(args: ProviderCachePlanArgs): Record<string, JsonValue | object | undefined>;
export type { CacheableSection, ProviderCachePlan };
//# sourceMappingURL=planner-rendering.d.ts.map