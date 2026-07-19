/**
 * Pre-model heuristics that decide which registered actions a raw message should
 * directly trigger: local-shell inspection, web/live-info lookup, coding-task
 * delegation, and views/app navigation. Each detector fires on clear intent,
 * honors explicit negations ("don't run commands", "don't browse the web"), and
 * resolves action names structurally by canonical name, simile, or tag — so a
 * runtime missing a given backend action simply yields no candidate. Also derives
 * a concrete shell command or web-search query from the message text.
 */
import type { Action } from "../../types/components.js";
export interface DirectActionInferenceHooks {
    looksLikeCodingWorkRequest?: (text: string) => boolean;
    findCodingDelegationActionName?: (actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>) => string | undefined;
}
export declare function normalizeActionIdentifier(actionName: string): string;
export declare function looksLikeLocalShellRequest(text: string): boolean;
export declare function looksLikeWebSearchRequest(text: string): boolean;
export declare function findAvailableActionName(actions: ReadonlyArray<Pick<Action, "name" | "similes">>, names: readonly string[]): string | undefined;
export declare const CODING_DELEGATION_ACTION_TAGS: readonly ["domain:coding", "resource:agent-task", "capability:delegate"];
export declare const LEGACY_CODING_DELEGATION_ACTION_NAMES: readonly ["TASKS", "TASKS_SPAWN_AGENT", "SPAWN_AGENT", "START_CODING_TASK", "CODE_TASK", "SPAWN_CODING_AGENT"];
export declare const SHELL_DIRECT_ACTION_TAGS: readonly ["domain:system", "resource:shell", "capability:execute"];
export declare const LEGACY_SHELL_DIRECT_ACTION_NAMES: readonly ["SHELL", "TERMINAL_SHELL", "RUN_IN_TERMINAL", "RUN_COMMAND", "EXECUTE_COMMAND", "TERMINAL", "RUN_SHELL", "EXEC"];
export declare function hasActionTags(action: Pick<Action, "tags">, requiredTags: readonly string[]): boolean;
export declare function findCodingDelegationActionName(actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>): string | undefined;
export declare function findShellDirectActionName(actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>): string | undefined;
export declare function isShellDirectActionName(actionName: string, actions?: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>): boolean;
/**
 * Which detector produced a direct-current-request candidate inference. Lets
 * callers weigh the EVIDENCE STRENGTH of an inferred (never model-emitted)
 * candidate:
 * - "shell" / "coding" / "web": explicit intent phrasing in the message.
 * - "owner-goals": concrete owner goal create/save/confirm phrasing.
 * - "view-surface": an operation verb PLUS an explicit UI-surface noun
 *   (view/window/panel/app/screen/ui) — strong navigation evidence.
 * - "view-navigation": the message is nothing but a bare registered surface
 *   name ("settings") — the voice-transcription navigation contract (#9950).
 * - "view-capability": only an incidental token overlap between the message
 *   and a views action's tag/simile vocabulary (e.g. "whats 17 TIMES 23"
 *   matching the "screen-time" tag via TIME). Weak evidence — observed live
 *   hijacking already-answered trivial chat turns into a required-tool
 *   planner deadlock (trajectories tj-501e594bfb23a7, tj-5d1c9601f33e8d).
 */
export type DirectCurrentRequestCandidateKind = "shell" | "coding" | "owner-goals" | "view-surface" | "view-navigation" | "view-capability" | "web";
export interface DirectCurrentRequestCandidateInference {
    names: string[];
    kind: DirectCurrentRequestCandidateKind | null;
}
export declare function inferDirectCurrentRequestCandidateActions(actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>, messageText: string, hooks?: DirectActionInferenceHooks): string[];
export declare function inferDirectCurrentRequestCandidateInference(actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>, messageText: string, hooks?: DirectActionInferenceHooks): DirectCurrentRequestCandidateInference;
/**
 * Resolve ONE web/live-info lookup action, or undefined when the runtime has no
 * web backend. Prefers WEB_SEARCH — the general fallback used by the
 * rescue/existence checks, where a broad search satisfies any query without
 * needing a constructible URL. The planner-surfacing path uses
 * findWebLookupActionNames (WEB_FETCH-first) instead.
 */
export declare function findWebLookupActionName(actions: ReadonlyArray<Pick<Action, "name" | "similes">>): string | undefined;
/**
 * Resolve EVERY web/live-info lookup action the runtime exposes, in planner
 * preference order: WEB_FETCH first (a constructible live API/URL — e.g.
 * coingecko or wttr.in — returns deterministic JSON the planner can use inline),
 * then WEB_SEARCH (open-ended discovery). Surfacing BOTH lets the planner fetch
 * a live source itself instead of settling for a stale search result or spawning
 * a sub-agent just to webfetch a URL it already knows.
 */
export declare function findWebLookupActionNames(actions: ReadonlyArray<Pick<Action, "name" | "similes">>): string[];
export declare function inferLocalShellCommandFromMessageText(messageText: string): string | null;
export declare function inferWebSearchQueryFromMessageText(messageText: string): string | null;
//# sourceMappingURL=direct-action-heuristics.d.ts.map