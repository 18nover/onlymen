import { type ActionCatalog, type LocalizedActionExampleResolver } from "../runtime/action-catalog.js";
import { type CandidateActionBackstopRule } from "../runtime/candidate-action-backstop.js";
import { type ExecutePlannedToolCallContext } from "../runtime/execute-planned-tool-call.js";
import { type PlannerLoopParams, type PlannerToolCall, type PlannerToolResult } from "../runtime/planner-loop.js";
import { type ResponseHandlerEvaluator } from "../runtime/response-handler-evaluators.js";
import type { ResponseHandlerFieldRunResult, ResponseHandlerResult } from "../runtime/response-handler-field-evaluator.js";
import { runSubPlanner } from "../runtime/sub-planner.js";
import type { Action, ActionResult, AgentContext, HandlerCallback, MessageHandlerResult } from "../types/components.js";
import type { ContextDefinition, RoleGateRole } from "../types/contexts.js";
import type { Room } from "../types/environment.js";
import type { Memory } from "../types/memory.js";
import type { ContextRoutedResponseDecision, IMessageService, MessageProcessingOptions, MessageProcessingResult } from "../types/message-service.js";
import type { GenerateTextResult } from "../types/model.js";
import type { Content, Media, MentionContext, UUID } from "../types/primitives.js";
import type { IAgentRuntime } from "../types/runtime.js";
import type { State } from "../types/state.js";
import { findWebLookupActionName, findWebLookupActionNames, inferLocalShellCommandFromMessageText, inferWebSearchQueryFromMessageText } from "./message/direct-action-heuristics.js";
export { findWebLookupActionName, findWebLookupActionNames, inferLocalShellCommandFromMessageText, inferWebSearchQueryFromMessageText, };
export declare function extractPlannerActionNames(parsedPlanner: Record<string, unknown>): string[];
export declare function resolvePlannerActionName(runtime: Pick<IAgentRuntime, "actions" | "logger">, actionLookup: Map<string, Action> | undefined, actionName: string, options?: {
    strict?: boolean;
}): string[];
/**
 * The provider include list for Stage-1 response-state composition: the core
 * response providers plus always-on plugin providers, minus the Stage-1
 * exclusions (which are execution exclusions, not just render exclusions —
 * see STAGE1_EXTRA_PROVIDER_EXCLUSIONS). Exported for tests.
 */
export declare function stage1ResponseStateProviderNames(runtime: IAgentRuntime, message: Memory): string[];
export declare function selectV5PlannerStateProviderNames(args: {
    runtime: IAgentRuntime;
    message: Memory;
    selectedContexts: readonly AgentContext[];
    userRoles: readonly RoleGateRole[];
}): string[];
/**
 * Strategy mode for response generation
 */
type StrategyMode = "simple" | "actions" | "none";
/**
 * Strategy result from core processing
 */
interface StrategyResult {
    responseContent: Content | null;
    responseMessages: Memory[];
    actionResults?: ActionResult[];
    state: State;
    mode: StrategyMode;
}
export declare function shouldSkipResponseMemoryPersistence(memory: Memory): boolean;
export { buildFailureReplyPrompt, INSUFFICIENT_CREDITS_REPLY, isAuthError, isInsufficientCreditsError, isInsufficientCreditsMessage, isModelProviderFallbackError, isRateLimitError, stripReasoningBlocks, } from "./message/fallback-reply.js";
export { type EffectiveMuteState, muteExpiryDue, resolveEffectiveMuteState, resolveMutedTargetFlags, roomMuteActive, setRoomMuteUntil, setWorldMuteState, worldMuteActive, } from "./message/mute-state.js";
export { buildVoiceGatePrompt, type EnsureAgentVoiceOptions, ensureAgentVoice, } from "./message/voice-gate.js";
export type V5MessageRuntimeStage1Result = {
    kind: "terminal";
    action: "IGNORE" | "STOP";
    messageHandler: MessageHandlerResult;
    state: State;
} | {
    kind: "direct_reply" | "planned_reply";
    messageHandler: MessageHandlerResult;
    result: StrategyResult;
};
type ResponseHandlerEarlyReplyEvent = {
    text: string;
    messageHandler: MessageHandlerResult;
};
type VoiceTurnSignalMetadata = {
    endOfTurnProbability?: number;
    nextSpeaker?: "agent" | "user" | "unknown";
    agentShouldSpeak?: boolean | null;
    source?: string;
    model?: string;
};
export declare function getVoiceTurnSignalMetadata(message: Pick<Memory, "content">): VoiceTurnSignalMetadata | null;
/**
 * The resolved speaker entity for a voice turn (#8786). Voice attribution
 * (imprint cluster → entityId) writes `speakerEntityId` onto the turn; like
 * {@link getVoiceTurnSignalMetadata} it can arrive top-level (`content.speaker
 * EntityId`, the in-process engine path) or nested under `content.metadata`
 * (chat clients). Returns the trimmed id, or null when the speaker is unbound.
 */
export declare function getVoiceSpeakerEntityId(message: Pick<Memory, "content">): string | null;
export declare function voiceTurnSignalSuppressesAgent(signal: VoiceTurnSignalMetadata | null): boolean;
/**
 * The turn signal POSITIVELY confirms the agent should reply — the server-side
 * "decide, don't just veto" path (#8786). Conservative: it only fires on the
 * EXPLICIT `agentShouldSpeak === true` signal (the client sets this on a
 * wake-word / direct-address turn), and only when end-of-turn doesn't read as
 * the user still talking. Used to PROMOTE an IGNORE to RESPOND; it never
 * overrides an explicit STOP or an already-RESPOND decision.
 */
export declare function voiceTurnSignalConfirmsAgent(signal: VoiceTurnSignalMetadata | null): boolean;
/**
 * Read the transcription-mode flag off a turn. Mirrors
 * {@link getVoiceTurnSignalMetadata}: chat clients nest custom fields under
 * `content.metadata` (where the conversation route persists a request's
 * `metadata`), while in-process callers may set `content.transcriptionMode`
 * at top level — read both. Transcription mode records the user turn into the
 * conversation but suppresses the agent's reply (long-form "transcribe, agent
 * stays silent until an exit phrase").
 */
export declare function transcriptionModeActive(message: Pick<Memory, "content">): boolean;
/**
 * Canonical form for delivered-text dedup: callers that thread
 * `deliveredVisibleTexts` into `runV5MessageRuntimeStage1` must add entries in
 * this form for the action-echo suppression to match them.
 */
export declare function normalizeVisibleTextForDuplicateCheck(text: string): string;
export declare function sanitizeReplyTextAfterMediaDelivery(text: string, deliveredUrls: readonly string[]): string;
/**
 * Restore PII surrogates → real values at the final user-facing reply egress
 * (#10827). The NER pseudonymization layer swaps real PII to surrogates on
 * ingress and restores them at the tool-call execution boundary
 * (`execute-planned-tool-call.ts`) — but a direct/terminal reply that does NOT
 * go through a tool call was still shipping the surrogate to the user. Mirror
 * the tool-call egress restore here so the user (and the persisted assistant
 * message they read back) sees the real value, while the model, trajectory,
 * logs, and providers upstream keep the surrogate. Best-effort + a zero-cost
 * no-op when PII swap is disabled (no session on the trajectory context) or the
 * text carries no surrogate. Scoped to the reply TEXT only — the `thought`
 * (reasoning trajectory) is intentionally left pseudonymized.
 */
export declare function restorePiiInUserReplyText(text: string): string;
export declare function getCachedActionCatalog(actions: readonly Action[], localizedExamples?: LocalizedActionExampleResolver): ActionCatalog;
export declare const BUILTIN_RESPONSE_HANDLER_EVALUATORS: readonly ResponseHandlerEvaluator[];
/**
 * Format the role-filtered context catalog as a compact bullet list for the
 * Stage 1 prompt. Each line includes the id plus compressed metadata that helps
 * Stage 1 pick generously without inventing contexts.
 */
export declare function formatAvailableContextsForPrompt(contexts: readonly ContextDefinition[], options?: {
    compact?: boolean;
}): string;
/**
 * Render only the *stable* part of the Stage-1 (`HANDLE_RESPONSE`) model
 * input for a given room — the system prompt + tool/action schema block +
 * the stable provider blocks. This is the prefix that does NOT depend on
 * the user's turn, so it is the exact text the local-inference KV cache
 * should be pre-warmed with the instant a voice session opens or VAD
 * detects speech onset (item I1/C1 of the voice swarm).
 *
 * The returned string is byte-identical to the `messages[0].content`
 * (the "system" message) that `renderMessageHandlerModelInput` would
 * produce for the first turn of a fresh conversation in that room — the
 * unstable tail (recent dialogue, the current user message) is dropped.
 * Pre-warming with this string lands the system prefix in the slot's KV
 * so the real request only forward-passes the user tokens.
 *
 * Best-effort by construction: composing state may hit providers that
 * query the DB; a synthetic empty message is used so a brand-new room
 * with no history still renders. Callers that fail to render should just
 * skip the pre-warm (the real request cold-prefills, which is the
 * pre-pre-warm behaviour).
 */
export declare function renderMessageHandlerStablePrefix(runtime: IAgentRuntime, roomId: UUID): Promise<string>;
export declare function messageHandlerFromFieldResult(result: ResponseHandlerResult, fieldRun?: ResponseHandlerFieldRunResult, runtimeContext?: {
    actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>;
    messageText?: string;
    candidateBackstopRules?: readonly CandidateActionBackstopRule[];
    subAgentCompletionRelay?: boolean;
}): MessageHandlerResult;
export declare function applyDirectCurrentCandidateBackstopToMessageHandler(messageHandler: MessageHandlerResult, runtimeContext: {
    actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>;
    messageText?: string;
    subAgentCompletionRelay?: boolean;
} | undefined): MessageHandlerResult;
export declare function shouldPreferDirectCurrentCandidateActions(args: {
    candidateActions: readonly string[];
    currentMessageText: string;
    directCandidateActions: readonly string[];
    actions?: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>;
}): boolean;
export declare function inferDirectCurrentRequestCandidateActions(actions: ReadonlyArray<Pick<Action, "name" | "similes" | "tags">>, messageText: string): string[];
export declare function getStage1RetryReason(raw: string | GenerateTextResult): "empty completion" | "malformed HANDLE_RESPONSE tool call" | null;
/**
 * Whether a Stage-1 result should be regenerated. Empty or garbled output can be
 * fixed by retrying, but a completion-limit truncation cannot: regenerating at
 * the same token cap just truncates again, burning a full Stage-1 turn for the
 * same result. A truncated envelope is routed to the dedicated truncation
 * recovery below instead. Exported for unit coverage of the retry policy.
 */
export declare function shouldRetryStage1Generation(reason: ReturnType<typeof getStage1RetryReason>, raw: string | GenerateTextResult, maxTokens: number | undefined): boolean;
interface BuildV5ExecutorContextParams {
    message: Memory;
    state: State;
    selectedContexts: AgentContext[];
    senderRole: RoleGateRole;
    previousResults: readonly ActionResult[];
    callback?: HandlerCallback;
}
export declare function __buildV5ExecutorContextForTests(args: BuildV5ExecutorContextParams): ExecutePlannedToolCallContext;
export declare function __buildDeterministicPlannerFallbackToolCallForTests(args: {
    message: Memory;
    messageHandler?: MessageHandlerResult;
    actions: readonly Action[];
}): PlannerToolCall | null;
export declare function subPlannerResultToPlannerToolResult(subResult: Awaited<ReturnType<typeof runSubPlanner>>): PlannerToolResult;
/**
 * Pre-LLM action shortcut gate (#8791).
 *
 * Matches the user's text against the runtime's `ShortcutRegistry` BEFORE any
 * model call. Explicit slash/`!` commands are always eligible (this is what
 * makes slash commands deterministic per #8790); natural-language shortcuts use
 * narrow/confidence-floored patterns. On a confident `action`-target match the
 * matched action runs and its reply is returned as a `direct_reply` — emitting
 * ZERO `RESPONSE_HANDLER` tokens. Navigate/client targets are resolved on the
 * client (the slash menu already runs them locally) so the gate ignores them.
 *
 * Returns `null` on no match / mis-fire so the turn proceeds unchanged
 * (byte-identical to today). Set `ELIZA_SHORTCUTS_DISABLED=1` to bypass entirely.
 */
export declare function runShortcutGate(args: {
    runtime: IAgentRuntime;
    message: Memory;
    state: State;
    responseId: UUID;
    senderRole: RoleGateRole;
}): Promise<V5MessageRuntimeStage1Result | null>;
export declare function runV5MessageRuntimeStage1(args: {
    runtime: IAgentRuntime;
    message: Memory;
    state: State;
    responseId: UUID;
    callback?: HandlerCallback;
    deliveredVisibleTexts?: Set<string>;
    plannerLoopConfig?: PlannerLoopParams["config"];
    onResponseHandlerEarlyReply?: (event: ResponseHandlerEarlyReplyEvent) => Promise<void> | void;
}): Promise<V5MessageRuntimeStage1Result>;
/**
 * True when a plugin registered at least one core text delegate (chat / planning).
 * Embeddings-only (local-ai) and TTS do not count — without a matching delegate,
 * `dynamicPromptExecFromState` can fail with "No handler found for delegate type".
 */
export declare function hasTextGenerationHandler(runtime: IAgentRuntime): boolean;
export declare function isSimpleReplyResponse(responseContent: Pick<Content, "actions"> | null | undefined): boolean;
export type ActionOwnershipSuggestion = {
    actionName: string;
    score: number;
    secondBestScore: number;
    reasons: string[];
};
/**
 * Gate for the metadata-rescue path that promotes a passive (REPLY/NONE)
 * response to a privileged action based on keyword overlap. Run only when
 * the planner produced no real action AND no explicit REPLY — i.e. when
 * we genuinely have nothing to say.
 */
export declare function shouldRunMetadataActionRescue(responseContent: Pick<Content, "actions"> | null | undefined): boolean;
export declare function shouldPromoteExplicitReplyToOwnedAction(responseContent: Pick<Content, "actions"> | null | undefined, suggestion: ActionOwnershipSuggestion | null, messageText?: string): boolean;
export type ActionContinuationDecision = {
    shouldContinue: boolean;
    suppressed: boolean;
    continuingActions: string[];
    suppressingActions: string[];
};
export declare function getActionContinuationDecision(runtime: Pick<IAgentRuntime, "actions">, responseContent: Content | null | undefined): ActionContinuationDecision;
export declare function actionResultsSuppressPostActionContinuation(actionResults: readonly ActionResult[]): boolean;
/**
 * True when the planner's `text` field should be surfaced to the user as a
 * preamble before action handlers run in actions-mode dispatch. The goal:
 * the user sees "checking your inbox" rather than silence while INBOX/GMAIL
 * do their work.
 *
 * Skipped when the first action is REPLY (the REPLY handler generates its own
 * text), IGNORE (no user-visible response), or STOP (terminal). Also skipped
 * when `text` is empty.
 */
export declare function shouldEmitPlannerPreamble(runtime: IAgentRuntime, responseContent: Pick<Content, "text" | "actions"> | null | undefined): boolean;
export declare function stripReplyWhenActionOwnsTurn(runtime: Pick<IAgentRuntime, "actions" | "logger">, actions: readonly string[] | null | undefined): string[];
export declare function wrapSingleTurnVisibleCallback(runtime: Pick<IAgentRuntime, "agentId" | "logger"> & Partial<Pick<IAgentRuntime, "character" | "useModel">> & {
    getService?: IAgentRuntime["getService"];
}, message: Pick<Memory, "id" | "roomId" | "entityId">, callback?: HandlerCallback, recordDeliveredVisibleText?: (text: string) => void): HandlerCallback | undefined;
export declare function withActionResultsForPrompt(state: State, actionResults: ActionResult[]): State;
/**
 * Default implementation of the MessageService interface.
 * This service handles the complete message processing pipeline including:
 * - Message validation and memory creation
 * - Smart response decision (shouldRespond)
 * - Native planner processing
 * - Action execution and evaluation
 * - Attachment processing
 * - Message deletion and channel clearing
 *
 * This is the standard message handler used by elizaOS and can be replaced
 * with custom implementations via the IMessageService interface.
 */
export declare class DefaultMessageService implements IMessageService {
    /**
     * Main message handling entry point
     */
    handleMessage(runtime: IAgentRuntime, message: Memory, callback?: HandlerCallback, options?: MessageProcessingOptions): Promise<MessageProcessingResult>;
    /**
     * Internal message processing implementation
     */
    private processMessage;
    /**
     * Determines whether the agent should respond to a message.
     * Uses simple rules for obvious cases (DM, mentions) and defers to LLM for ambiguous cases.
     */
    shouldRespond(runtime: IAgentRuntime, message: Memory, room?: Room, mentionContext?: MentionContext): ContextRoutedResponseDecision;
    /**
     * Processes attachments by generating descriptions for supported media types.
     */
    processAttachments(runtime: IAgentRuntime, attachments: Media[]): Promise<Media[]>;
    /**
     * Fetch an attachment's bytes for enrichment with a hard size cap. Remote
     * (attacker-influenceable) URLs go through the SSRF-guarded fetcher, which
     * blocks private/loopback/link-local hosts; trusted local media-store URLs
     * (built from a path-validated relative URL) use the runtime fetch. This is
     * the ONLY place a raw fetch is used during attachment enrichment.
     */
    private fetchAttachmentBytes;
    private resolveRecentMessagesForFailureReply;
    private generateFailureReplyText;
    private buildStructuredFailureReply;
    /**
     * Render the no-LLM-provider hint as a chat reply. Used when `useModel`
     * throws `NoModelProviderConfiguredError`, which means no provider plugin
     * is registered and no fallback model call will ever succeed. The user
     * sees an actionable message instead of a generic transient-failure
     * template. See elizaOS/eliza#7203.
     */
    private buildNoModelProviderReply;
    /**
     * Helper to emit run ended events
     */
    private emitRunEnded;
    private emitMessageSent;
    /**
     * Deletes a message from the agent's memory.
     *
     * @param runtime - The agent runtime instance
     * @param message - The message memory to delete
     * @returns Promise resolving when deletion is complete
     */
    deleteMessage(runtime: IAgentRuntime, message: Memory): Promise<void>;
    /**
     * Clears all messages from a channel/room.
     * This method handles bulk deletion of all message memories in a room.
     *
     * @param runtime - The agent runtime instance
     * @param roomId - The room ID to clear messages from
     * @param channelId - The original channel ID (for logging)
     * @returns Promise resolving when channel is cleared
     */
    clearChannel(runtime: IAgentRuntime, roomId: UUID, channelId: string): Promise<void>;
}
//# sourceMappingURL=message.d.ts.map