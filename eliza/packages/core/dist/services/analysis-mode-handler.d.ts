/**
 * Analysis-mode activation hook for the core message handler.
 *
 * When a user types the bare token `analysis` (or `as you were` to disable),
 * this module toggles a per-room debug flag and short-circuits the rest of
 * the planner pipeline so the agent never hallucinates a "performing an
 * analysis" reply. The token grammar mirrors the agent-side runtime hook at
 * `packages/agent/src/runtime/analysis-mode-flag.ts`. We intentionally
 * re-implement the regex + env-gate locally instead of importing from
 * `@elizaos/agent`: `core` is upstream of `agent` and cannot depend on it.
 * The two layers stay in lock-step by sharing the exact same token grammar
 * and env-gate semantics — both are tiny and stable.
 *
 * Privacy:
 *   - `isAnalysisModeAllowed()` returns false unless the operator opted in
 *     via `ELIZA_ENABLE_ANALYSIS_MODE=1`, or `NODE_ENV=development`.
 *   - When disabled, activation tokens are ignored (no toggle, no
 *     confirmation) so the words flow through to the planner like any
 *     other text.
 *
 * Sidecar attachment (the four debug payloads — thinking, planned actions,
 * simple-mode flag, evaluator output) is implemented as `appendAnalysisSidecar`
 * but is only invoked from the activation-confirmation path in this wave.
 * Response-emit wiring requires a dedicated SSE event type and UI sidecar
 * component; until those exist, activation echoes avoid exposing a debug
 * payload format as user-facing contract.
 */
export type AnalysisToken = "enable" | "disable" | null;
/**
 * Detect activation tokens. Mirror of
 * `packages/agent/src/runtime/analysis-mode-flag.ts#parseAnalysisToken`.
 */
export declare function parseAnalysisToken(text: string | undefined | null): AnalysisToken;
/**
 * Gate analysis-mode activation. Mirror of
 * `packages/agent/src/runtime/analysis-mode-flag.ts#isAnalysisModeAllowed`.
 */
export declare function isAnalysisModeAllowed(env?: NodeJS.ProcessEnv): boolean;
export declare function isAnalysisModeEnabledForRoom(roomId: string): boolean;
/** Test helper. */
export declare function __resetAnalysisModeFlagsForTests(): void;
export interface AnalysisActivationResult {
    /** True when the message was an activation/deactivation token and was handled. */
    handled: boolean;
    /** Confirmation text to emit back to the user. Only set when `handled === true`. */
    responseText?: string;
    /** New per-room flag state after applying the token. */
    enabledAfter?: boolean;
}
interface ActivationInput {
    text: string | undefined | null;
    roomId: string;
}
/**
 * Inspect an inbound message for an analysis-mode activation token. When
 * detected (and the env gate allows it), toggle the per-room flag and
 * return a confirmation response so the caller can short-circuit before
 * the planner runs.
 *
 * Returns `{ handled: false }` when:
 *   - the env gate is closed, OR
 *   - the message text is not exactly an activation/deactivation token.
 *
 * The caller (message handler) MUST treat `handled: true` as terminal —
 * do not invoke the planner or emit any other reply.
 */
export declare function maybeHandleAnalysisActivation(input: ActivationInput, env?: NodeJS.ProcessEnv): AnalysisActivationResult;
export interface AnalysisSidecarPayload {
    thoughtPreview?: string;
    plannedActions?: readonly string[];
    simpleMode?: boolean;
    evaluatorOutputs?: readonly string[];
}
/**
 * Append a debug sidecar to the user-facing text. Only called when the
 * per-room flag is enabled. The delimiter format is intentionally
 * deterministic so UI sidecar components can split on it.
 *
 * This helper is exported for unit testing the sidecar format.
 */
export declare function appendAnalysisSidecar(text: string, payload: AnalysisSidecarPayload): string;
export {};
//# sourceMappingURL=analysis-mode-handler.d.ts.map