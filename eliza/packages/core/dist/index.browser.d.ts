/**
 * Browser-specific entry point for @elizaos/core
 *
 * This file exports only browser-compatible modules and provides explicit
 * browser alternatives for Node.js-specific functionality.
 * Streaming context manager is auto-detected at runtime.
 */
export * from "./access-context.js";
export * from "./access-control/artifact-disclosure.js";
export * from "./access-control/filter.js";
export * from "./account-pool-bridge.js";
export * from "./action-names.js";
export * from "./actions.js";
export * from "./activity-plaintext.js";
export * from "./api/http-helpers.js";
export * from "./api/route-helpers.js";
export * from "./app-route-plugin-registry.js";
export * from "./boot-env.js";
export * from "./build-variant.js";
export * from "./capabilities/index.js";
export * from "./character.js";
export * from "./cloud-routing.js";
export * from "./connectors.js";
export * from "./connectors/account-manager.js";
export * from "./connectors/connector-config.js";
export * from "./connectors/oauth-role.js";
export * from "./connectors/privacy.js";
export * from "./database.js";
export * from "./database/inMemoryAdapter.js";
export * from "./entities.js";
export * from "./env-utils.js";
export * from "./errors.js";
export * from "./features/advanced-memory/index.js";
export { AutonomyService } from "./features/autonomy/index.js";
export { __setDocumentUrlFetchImplForTests, type FetchDocumentFromUrlOptions, type FetchedDocumentUrl, type FetchedDocumentUrlKind, fetchDocumentFromUrl, isYouTubeUrl, } from "./features/documents/index.js";
export type { DraftRecord, DraftRequest, ListOptions, ManageOperation, ManageResult, MessageAdapter, MessageAdapterCapabilities, MessageRef, MessageSource, ScoreContext, SearchMessagesFilters, SendPolicy, TriageOptions, TriageScore, } from "./features/messaging/triage/index.js";
export { BaseMessageAdapter, filterInMemory, getDefaultMessageRefStore, getSendPolicy, MessageRefStore, NotYetImplementedError, rankScored, registerSendPolicy, resetMissingServiceWarning, resolveContactWeight, scoreMessage, scoreMessages, } from "./features/messaging/triage/index.js";
export { paymentsPlugin } from "./features/payments/index.js";
export * from "./features/sub-agent-credentials/index.js";
export * from "./inference-timing.js";
export * from "./lifeops-passive-connectors.js";
export * from "./logger.js";
export * from "./memory.js";
export * from "./messaging/interactions/index.js";
export * from "./model-gateway.js";
export * from "./name-tokens.js";
export * from "./prompts.js";
export * from "./recent-messages-state.js";
export * from "./roles.js";
export * from "./runtime.js";
export { warnOnUnmatchedActionRolePolicyKeys } from "./runtime/action-role-policy.js";
export * from "./runtime/context-gates.js";
export * from "./runtime/context-registry.js";
export * from "./runtime/conversation-compaction-hook.js";
export * from "./runtime/execute-planned-tool-call.js";
export * from "./runtime/rlm.js";
export * from "./runtime/schema-compat.js";
export * from "./runtime/shortcut-registry.js";
export * from "./runtime/sub-planner.js";
export * from "./runtime/system-prompt.js";
export * from "./runtime-route-context.js";
export * from "./sandbox-policy.js";
export * from "./schemas/character.js";
export { type BaseTables, buildBaseTables } from "./schemas/index.js";
export * from "./search.js";
export * from "./security/redact.js";
export * from "./sensitive-request-policy.js";
export * from "./sensitive-requests/index.js";
export * from "./services.js";
export * from "./services/agentEvent.js";
export { AgentEventService } from "./services/agentEvent.js";
export * from "./services/message.js";
export * from "./services/trajectories.js";
export * from "./settings.js";
export { isElizaSettingsDebugEnabled, sanitizeForSettingsDebug, settingsDebugCloudSummary, } from "./settings-debug.js";
export * from "./streaming-context.js";
export * from "./target-sources/index.js";
export * from "./trajectory-context.js";
export * from "./trajectory-utils.js";
export type { ConnectorAccountCapability, ConnectorAccountRef } from "./types/index.js";
export * from "./types/index.js";
export { ConnectorAccountHealth, ConnectorAccountPurpose, ConnectorAccountRole, ConnectorAuthMethod, } from "./types/index.js";
export * from "./types/message-service.js";
export { PENDING_USER_ACTION_WEIGHT } from "./types/pending-user-action.js";
export type { JsonObject, JsonValue, ProcessEnvLike } from "./types/primitives.js";
export type { EnabledViewKinds, ViewKind, ViewKindBearer, } from "./types/view-kind.js";
export { isAlwaysOnViewKind, isViewKindEnabled, isViewVisible, resolveViewKind, VIEW_KIND_META, VIEW_KINDS, } from "./types/view-kind.js";
export * from "./utils.js";
export { addHeader, composePromptFromState, parseKeyValueXml, parseToonKeyValue, } from "./utils.js";
export { Semaphore } from "./utils/batch-queue/semaphore.js";
export * from "./utils/boolean.js";
export * from "./utils/buffer.js";
export type { ConfirmationDecision, ConfirmationStatus, DestructiveConfirmationGateResult, RequireConfirmationArgs, } from "./utils/confirmation.js";
export { clearPendingConfirmation, gateDestructiveConfirmation, llmConfirmedFlagIsAuthoritative, requireConfirmation, } from "./utils/confirmation.js";
export * from "./utils/description-compressed-lint.js";
export * from "./utils/deterministic.js";
export * from "./utils/environment.js";
export { getEnv } from "./utils/environment.js";
export { formatError } from "./utils/format-error.js";
export * from "./utils/project-memory-scope.js";
export * from "./utils/read-env.js";
export * from "./utils/resolve-setting.js";
export * from "./utils/streaming.js";
export { ResponseSkeletonStreamExtractor } from "./utils/streaming.js";
export * from "./validation/index.js";
export declare function getElizaNamespace(env?: Record<string, string | undefined>): string;
export declare function resolveUserPath(input: string): string;
export declare function resolveStateDir(env?: Record<string, string | undefined>): string;
export declare function resolveOAuthDir(): string;
export declare function runPluginMigrations(): Promise<void>;
export declare const isBrowser = true;
export declare const isNode = false;
/**
 * Browser health-check export. Server health is not applicable in browser
 * bundles, so callers get a stable positive probe result with browser context.
 */
export declare const serverHealth: {
    check: () => Promise<{
        status: string;
        environment: string;
    }>;
    isHealthy: () => boolean;
};
export * from "./cloud-routing.js";
//# sourceMappingURL=index.browser.d.ts.map