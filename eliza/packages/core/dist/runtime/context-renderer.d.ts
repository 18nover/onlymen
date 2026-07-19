/**
 * Replays a `ContextObject` into the wire shape a model stage consumes: chat
 * messages, native tool specs, and labeled prompt segments. Formats each context
 * event (message, memory, provider, tool, instruction, segment, and compacted
 * runtime events) into its prompt representation and assembles the single-system
 * plus single-user plus assistant/tool-suffix message array each planner stage
 * sends.
 */
import type { ContextObject, ContextObjectMessage, ContextObjectPromptSegment, ContextObjectTool } from "../types/context-object.js";
import type { ChatMessage, PromptSegment } from "../types/model.js";
export interface RenderedContextObject {
    messages: ContextObjectMessage[];
    tools: ContextObjectTool[];
    promptSegments: ContextObjectPromptSegment[];
}
/**
 * Format one prompt segment as a labeled block. Segments with `label: "system"`
 * are emitted as raw content (the label is implicit in the system role); all
 * other segments get a `<label>:\n<content>` prefix so the model can locate
 * them inside the merged Tier 1 / Tier 2 strings.
 */
export declare function segmentBlock(segment: PromptSegment): string;
/**
 * Drop segments with empty content. Used by `normalizePromptSegments` and as a
 * post-step in renderers that build segment lists incrementally.
 */
export declare function compactPromptSegments(segments: PromptSegment[]): PromptSegment[];
/**
 * Trim each segment's content and prefix all but the first with `\n\n` so that
 * `segments.map(s => s.content).join("")` round-trips to a clean concatenated
 * prompt. Empties are dropped.
 */
export declare function normalizePromptSegments(segments: PromptSegment[]): PromptSegment[];
/**
 * Take the longest stable prefix of `segments`. If no segment is stable, fall
 * back to the first segment so a non-empty prefix hash is always available.
 */
export declare function cachePrefixSegments(segments: PromptSegment[]): PromptSegment[];
/**
 * Build the wire-shape `messages` array for a stage call: ONE system message
 * (Tier 1: stable context segments + the stage's task instructions), ONE user
 * message (Tier 2: dynamic context segments + caller-supplied dynamic blocks),
 * and the trajectory's append-only assistant/tool suffix.
 *
 * Why: stacking many `system` messages fragments the cache prefix, confuses
 * turn boundaries, and triggers strict provider validation. The native chat
 * protocol expects a single system + user prefix followed by assistant/tool
 * turns for each iteration of the planner loop.
 */
export declare function buildStageChatMessages(args: {
    contextSegments: PromptSegment[];
    stageLabel: string;
    instructions: string;
    dynamicBlocks: string[];
    stepMessages: ChatMessage[];
}): ChatMessage[];
export declare function renderContextObject(context: ContextObject): RenderedContextObject;
//# sourceMappingURL=context-renderer.d.ts.map