import { type ReportedError } from "./errors.js";
import { ChatPreHandlerRegistry } from "./runtime/chat-pre-handler-registry.js";
import { ContextRegistry } from "./runtime/context-registry.js";
import type { ResponseHandlerEvaluator } from "./runtime/response-handler-evaluators.js";
import type { ResponseHandlerFieldEvaluator } from "./runtime/response-handler-field-evaluator.js";
import { ResponseHandlerFieldRegistry } from "./runtime/response-handler-field-registry.js";
import { RoomHandlerQueue } from "./runtime/room-handler-queue.js";
import { ShortcutRegistry } from "./runtime/shortcut-registry.js";
import { TurnControllerRegistry } from "./runtime/turn-controller.js";
import { type AccessContext, type Action, type ActionMode, type ActionResult, type Agent, type AppendConnectorAccountAuditEventParams, ChannelType, type Character, type Component, type ConnectorAccountAuditEventRecord, type ConnectorAccountCredentialRefRecord, type ConnectorAccountRecord, type ConnectorPostIdentity, type ConsumeOAuthFlowStateParams, type Content, type CreateOAuthFlowStateParams, type DeleteConnectorAccountParams, type DeleteOAuthFlowStateParams, type Entity, type EventHandler, type EventPayload, type EventPayloadMap, type GenerateTextOptions, type GenerateTextParams, type GenerateTextResult, type GetConnectorAccountCredentialRefParams, type GetConnectorAccountParams, type GetOAuthFlowStateParams, type HandlerCallback, type IAgentRuntime, type IDatabaseAdapter, type IMessagingAdapter, type JsonValue, type ListConnectorAccountCredentialRefsParams, type ListConnectorAccountsParams, type Log, type LogBody, type Memory, type MemoryMetadata, type MessageConnector, type MessageConnectorCreateThreadParams, type MessageConnectorRegistration, type MessageSearchHit, type Metadata, type ModelHandler, type ModelParamsMap, type ModelRegistrationInfo, type ModelRegistrationMetadata, type ModelResultMap, type ModelTypeName, type OAuthFlowRecord, type PairingAllowlistEntry, type PairingChannel, type PairingRequest, type Participant, type PatchOp, type PipelineHookContext, type PipelineHookPhase, type PipelineHookSpec, type Plugin, type PluginOwnership, type PostConnector, type PostConnectorRegistration, type Provider, type RegisteredEvaluator, type Relationship, type RemotePluginInstallOptions, type RemotePluginInstanceHandle, type Room, type Route, type RuntimeEventStorage, type RuntimeSettings, type RuntimeStopOptions, type SendHandlerFunction, type Service, type ServiceClass, type ServiceTypeName, type SetConnectorAccountCredentialRefParams, type State, type StreamChunkCallback, type TargetInfo, type Task, type TaskWorker, type ThreadHandle, type UpdateOAuthFlowStateParams, type UpsertConnectorAccountParams, type UUID, type World } from "./types/index.js";
import type { ChatPreHandler, ChatPreHandlerContext, ChatPreHandlerResult } from "./types/chat-pre-handler.js";
import type { AgentContext } from "./types/contexts.js";
import type { IMessageService } from "./types/message-service.js";
import type { PromptOptimizationRuntimeHooks } from "./types/prompt-optimization-hooks.js";
import type { ExecutionTrace, ScoreSignal } from "./types/prompt-optimization-trace.js";
import { type SearchCategoryEnumerationOptions, type SearchCategoryLookupOptions, type SearchCategoryRegistration } from "./types/search.js";
import type { ShortcutDefinition } from "./types/shortcut.js";
import type { RetryBackoffConfig, SchemaRow, StreamEvent } from "./types/state.js";
import type { ToolPolicyConfig, ToolProfileId } from "./types/tools.js";
import { PromptBatcher } from "./utils/prompt-batcher.js";
/**
 * Thrown by `AgentRuntime.useModel` when a text-generation model is requested
 * but no LLM provider plugin is registered for any text model type at all.
 *
 * This is distinct from "one provider is registered but the specific type is
 * missing" — that case still throws the generic `No handler found for delegate
 * type` error so legitimate misconfigurations stay loud.
 *
 * Surfacing this as a typed error lets the chat layer render an actionable
 * hint instead of a generic parse-failure template. See issue elizaOS/eliza#7203.
 */
export declare class NoModelProviderConfiguredError extends Error {
    constructor(message?: string);
}
/** One failed TEXT_EMBEDDING dimension-probe attempt, kept for diagnostics. */
export interface EmbeddingProbeAttempt {
    provider: string;
    modelKey: string;
    error: string;
}
/**
 * Thrown by `AgentRuntime.ensureEmbeddingDimension` when EVERY registered
 * TEXT_EMBEDDING provider failed the null dimension probe. Carries the
 * per-provider failure list so callers (and logs) can show exactly which
 * providers were tried and why each one failed.
 *
 * `AgentRuntime.initialize` catches this error type — and only this type —
 * non-fatally: the runtime keeps booting with embedding generation disabled
 * (memory writes persist without vectors) instead of either crashing boot or
 * leaving the vector column at its default width, where later real vectors
 * would be silently dropped on dimension mismatch by the SQL adapter (#8769).
 */
export declare class EmbeddingDimensionProbeError extends Error {
    readonly attempts: readonly EmbeddingProbeAttempt[];
    constructor(attempts: readonly EmbeddingProbeAttempt[]);
}
type StructuredResponseFormat = "JSON" | "TOON";
/**
 * Resolves the default structured-output format from a setting value.
 * Used by `dynamicPromptExecFromState` when no per-call preference is given.
 */
export declare function resolveDefaultOutputFormat(raw: unknown): StructuredResponseFormat;
/**
 * Resolve which structured fields stream to the consumer for the line-oriented
 * `dynamicPromptExecFromState` path. A field streams when it opts in with
 * `streamField: true`, or — when it expresses no preference — when its name is
 * in {@link DEFAULT_DYNAMIC_PROMPT_STREAM_FIELDS} (the clean reply `text`).
 * `streamField: false` always opts out. Exported for regression coverage of
 * the default token-stream contract (#9174).
 */
export declare function resolveDynamicPromptStreamFields(schema: readonly SchemaRow[]): string[];
/**
 * Merges provider options from three sources: a base object (e.g. `{ agentName }`),
 * optional caller-supplied options, and a cache-plan's options. Caller fields take
 * precedence over base; plan fields take precedence over caller on key collision, but
 * named provider sub-objects (e.g. `anthropic`, `openai`) are merged one level deep so
 * caller-specific fields like `anthropic.thinking` survive alongside plan additions like
 * `anthropic.cacheControl`.
 *
 * Exported so tests can import and exercise the real function rather than maintaining a
 * hand-copied mirror that cannot catch regressions in this code path.
 */
export declare function mergeProviderOptionsWithCachePlan(base: Record<string, JsonValue | object | undefined>, callerOptions: Record<string, JsonValue | object | undefined> | undefined, planOptions: Record<string, JsonValue | object | undefined>): Record<string, JsonValue | object | undefined>;
export declare class AgentRuntime implements IAgentRuntime {
    #private;
    readonly agentId: UUID;
    readonly character: Character;
    adapter: IDatabaseAdapter;
    readonly actions: Action[];
    readonly providers: Provider[];
    readonly evaluators: RegisteredEvaluator[];
    readonly responseHandlerEvaluators: ResponseHandlerEvaluator[];
    readonly responseHandlerFieldEvaluators: ResponseHandlerFieldEvaluator[];
    /** Pre-LLM action shortcuts (#8791), registered from `Plugin.shortcuts`. */
    readonly shortcutRegistry: ShortcutRegistry;
    /** Chat pre-handlers, registered from `Plugin.chatPreHandlers`. */
    readonly chatPreHandlerRegistry: ChatPreHandlerRegistry;
    readonly responseHandlerFieldRegistry: ResponseHandlerFieldRegistry;
    readonly turnControllers: TurnControllerRegistry;
    readonly roomHandlerQueue: RoomHandlerQueue;
    readonly plugins: Plugin[];
    /**
     * Per-runtime context registry seeded with first-party context definitions
     * during `_initializeCore`. Plugins may register additional contexts before
     * Stage 1 runs.
     */
    readonly contexts: ContextRegistry;
    unloadPlugin: (pluginName: string) => Promise<PluginOwnership | null>;
    reloadPlugin: (plugin: Plugin) => Promise<void>;
    applyPluginConfig: (pluginName: string, config: Record<string, string>) => Promise<boolean>;
    getPluginOwnership: (pluginName: string) => PluginOwnership | null;
    getAllPluginOwnership: () => PluginOwnership[];
    events: RuntimeEventStorage;
    stateCache: Map<string, State>;
    readonly fetch: typeof fetch;
    promptBatcher: PromptBatcher;
    services: Map<ServiceTypeName, Service[]>;
    private serviceTypes;
    /**
     * Bounded ring of failures surfaced via {@link reportError} (#12263). Read
     * by the RECENT_ERRORS provider and the owner-escalation threshold. Oldest
     * entries drop once the cap is exceeded.
     */
    private reportedErrors;
    private static readonly REPORTED_ERROR_RING_CAP;
    /** Re-entrancy latch so a failure inside reportError stays warn-only (J7). */
    private inReportError;
    models: Map<string, ModelHandler<Record<string, object | JsonValue>, object | JsonValue>[]>;
    routes: Route[];
    /**
     * Provider that answered the boot-time TEXT_EMBEDDING dimension probe. The
     * SQL adapter's vector column is sized from that provider's output, so all
     * later embedding calls without an explicit provider are pinned to it —
     * letting a different registration serve an embedding call can emit a
     * different-width vector that the adapter silently drops on dimension
     * mismatch (#8769). Re-set on every successful `ensureEmbeddingDimension`.
     */
    private pinnedEmbeddingProvider;
    /**
     * The provider name that actually served the most recent successful
     * `useModel` call for each model type key. Populated the moment a
     * registration answers (before any streaming/return path), so a caller that
     * cannot see `useModel`'s internal resolution — e.g. the messageHandler /
     * factsAndRelationships trajectory stage recorders in `services/message.ts`,
     * which previously hardcoded the provider as the literal `"default"` — can
     * read the real provider that answered instead of fabricating one (#13623).
     * Keyed by the REQUESTED model type string so the recorder for a
     * RESPONSE_HANDLER / TEXT_LARGE stage reads the provider for that stage's
     * call, not some other model type's.
     */
    private lastResolvedModelProviderByType;
    /**
     * Non-null while embedding generation is disabled because every registered
     * TEXT_EMBEDDING provider failed the dimension probe. While set, memory
     * writes skip vector generation entirely (see `addEmbeddingToMemory` /
     * `queueEmbeddingGeneration`) instead of producing vectors the SQL adapter
     * would silently drop against a default-sized column. Cleared by the next
     * successful `ensureEmbeddingDimension` (e.g. the deferred boot re-probe).
     */
    private embeddingGenerationDisabledReason;
    /** Once-latch so the embedding-skip warning fires once, not per write. */
    private embeddingSkipWarned;
    private taskWorkers;
    private sendHandlers;
    private messageConnectors;
    private postConnectors;
    private searchCategories;
    private eventHandlers;
    /**
     * In-flight execution traces keyed by trace.id (unique uuid).
     * A single run can produce multiple DPE calls; each gets its own trace.
     * `runToTraces` maps runId -> set of trace ids for enrichment lookup.
     */
    private activeTraces;
    private runToTraces;
    /** Optional DPE-side prompt optimization I/O (merge, registry, baseline/failure traces). */
    private promptOptimizationHooks;
    private pipelineHookEntries;
    private pipelineHookIdToIndex;
    private allAvailablePlugins;
    private characterPlugins;
    private capabilityOptions;
    private readonly nativeFeatureOptions;
    private actionPlanningOption?;
    private llmModeOption?;
    private checkShouldRespondOption?;
    private isAnonymousCharacter;
    logger: import("@elizaos/logger").Logger;
    enableAutonomy: boolean;
    private settings;
    private servicePromiseHandlers;
    private servicePromises;
    /** In-flight service start promises; dedupes concurrent getService() for the same type. */
    private startingServices;
    private serviceRegistrationStatus;
    initPromise: Promise<void>;
    private initResolver;
    private currentRunId?;
    private currentRoomId?;
    messageService: IMessageService | null;
    companionUrl?: string;
    /** Set when stop() has been called; prevents new service starts and use-after-stop. */
    private stopped;
    constructor(opts: {
        conversationLength?: number;
        agentId?: UUID;
        /** Optional character configuration. If not provided, an anonymous character is created. */
        character?: Character;
        plugins?: Plugin[];
        fetch?: typeof fetch;
        /** Database adapter. Use InMemoryDatabaseAdapter for in-memory-only runs. WHY: Caller owns DB lifecycle; no plugin registration race; single source of truth. */
        adapter?: IDatabaseAdapter;
        settings?: RuntimeSettings;
        allAvailablePlugins?: Plugin[];
        /**
         * Log level for this runtime. Defaults to "error".
         * Valid levels: "trace", "debug", "info", "warn", "error", "fatal"
         */
        logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
        /** Disable basic basic-capabilities capabilities (reply, ignore, none, core providers) */
        disableBasicCapabilities?: boolean;
        /** Enable extended/advanced basic-capabilities capabilities (facts, roles, settings, room actions, etc.) */
        enableExtendedCapabilities?: boolean;
        /** Alias for enableExtendedCapabilities - Enable advanced basic-capabilities capabilities */
        advancedCapabilities?: boolean;
        /**
         * Enable action planning mode for multi-action execution.
         * When true (default), agent can plan and execute multiple actions per response.
         * When false, agent executes only a single action per response (performance optimization
         * useful for game situations where state updates with every action).
         */
        actionPlanning?: boolean;
        /**
         * LLM mode for overriding model selection.
         * - "DEFAULT": Use the model type specified in the useModel call (no override)
         * - "SMALL": Override all text generation model calls to use TEXT_SMALL
         * - "LARGE": Override all text generation model calls to use TEXT_LARGE
         *
         * This is useful for cost optimization (force SMALL) or quality (force LARGE).
         * While not recommended for production, it can be a fast way to make the agent run cheaper.
         */
        llmMode?: import("./types/index.js").LLMModeType;
        /**
         * Enable or disable the shouldRespond evaluation.
         * When true (default), the agent evaluates whether to respond to each message.
         * When false, the agent always responds (ChatGPT mode) - useful for direct chat interfaces.
         */
        checkShouldRespond?: boolean;
        /**
         * Enable autonomy capabilities for autonomous agent operation.
         * When true, the agent can operate autonomously with its own thinking loop,
         * communicating with admin users and running continuous background processing.
         * Can be enabled at construction time or lazily via settings.
         */
        enableAutonomy?: boolean;
        /** Enable trust engine, security, and permissions infrastructure. */
        enableTrust?: boolean;
        /** Enable encrypted secrets management and dynamic plugin activation. */
        enableSecretsManager?: boolean;
        /** Enable plugin introspection, install/eject/sync. */
        enablePluginManager?: boolean;
        enableDocuments?: boolean;
        enableRelationships?: boolean;
        enableTrajectories?: boolean;
        /** Optional URL of a long-lived companion runtime for fire-and-forget embedding/task work. WHY: Thin runtimes (e.g. serverless) delegate embeddings and task-dirty notifications without blocking. */
        companionUrl?: string;
    });
    private warnOnDuplicateServiceTypeRegistration;
    /**
     * Create a new run ID for tracking a sequence of model calls
     */
    createRunId(): UUID;
    /**
     * Start a new run for tracking prompts
     * @param roomId Optional room ID to associate logs with this conversation
     */
    startRun(roomId?: UUID): UUID;
    /**
     * End the current run
     */
    endRun(): void;
    /**
     * Get the current run ID (creates one if it doesn't exist)
     */
    getCurrentRunId(): UUID;
    private resolveServiceTypeAlias;
    private nativeRuntimeFeatureSettingKey;
    private resolveNativeFeatureEnabled;
    private isSecretSwapEnabled;
    private createSecretSwapSession;
    private isPiiSwapEnabled;
    /**
     * Build the turn's PII pseudonymization session (#10469 / #7007). The
     * recognizer is the composite of the runtime's built-in regex recognizer
     * (street addresses) and — if a plugin registered the
     * `PII_ENTITY_RECOGNIZER_SERVICE` — the local NER model (person/org/location).
     * With no model plugin present the layer runs regex-only: degraded coverage,
     * but still never leaks what it does detect. The agent's own name is added to
     * the blocklist so the model's identity is never pseudonymized.
     */
    private createPiiSwapSession;
    /** Flatten every string leaf of the model params plus the system prompt into
     * one text blob for the PII recognizer to scan. */
    private collectPromptText;
    private hasNativeRuntimeFeature;
    private resolveNativeFeatureForServiceType;
    private isNativeFeatureServiceEnabled;
    private isPluginManagedAsNativeFeature;
    private setNativeRuntimeFeatureEnabled;
    enableDocuments(): Promise<void>;
    disableDocuments(): Promise<void>;
    isDocumentsEnabled(): boolean;
    enableRelationships(): Promise<void>;
    disableRelationships(): Promise<void>;
    isRelationshipsEnabled(): boolean;
    enableTrajectories(): Promise<void>;
    disableTrajectories(): Promise<void>;
    isTrajectoriesEnabled(): boolean;
    /**
     * Per-phase, position-sorted hook lists, cached because the
     * `model_stream_chunk` phase is consulted once per streamed token — a
     * filter+sort over all registered hooks per token dominated the zero-hook
     * stream path. Invalidated wholesale on register/unregister (rare,
     * boot-time operations). Callers must treat the returned array as
     * read-only.
     */
    private pipelineHooksByPhase;
    private hooksForPhase;
    private upsertPipelineHook;
    private invokePipelineHooks;
    registerPipelineHook(spec: PipelineHookSpec): void;
    unregisterPipelineHook(id: string): void;
    /**
     * Run pipeline hooks for a phase (skip metadata, ordering, and outgoing sanitize + redact).
     * @param pipelineHookTelemetry When false, skips debug logs / `PIPELINE_HOOK_METRIC` per hook
     * (still logs warn/error for slow hooks). Defaults to false for `model_stream_chunk` only.
     */
    applyPipelineHooks(phase: PipelineHookPhase, ctx: PipelineHookContext, pipelineHookTelemetry?: boolean): Promise<void>;
    registerPlugin(plugin: Plugin): Promise<void>;
    getAllServices(): Map<ServiceTypeName, Service[]>;
    /**
     * Stops all started services and clears runtime caches/handlers.
     * For full teardown (including DB/adapter connection), call close() after stop().
     */
    stop(options?: RuntimeStopOptions): Promise<void>;
    private _stopServices;
    private _stopServiceInstance;
    /**
     * Slim init: register plugins, ensure adapter ready, create message service.
     * Does NOT run migrations, agent/entity/room creation, or embedding dimension.
     * WHY: Those belong to provisioning (once at daemon boot); edge/ephemeral skip them.
     */
    initialize(options?: {
        skipMigrations?: boolean;
        /** Allow running without a persistent database adapter (benchmarks/tests). */
        allowNoDatabase?: boolean;
    }): Promise<void>;
    private _initializeCore;
    private getBasicCapabilitiesSettings;
    registerDatabaseAdapter(adapter: IDatabaseAdapter): void;
    runPluginMigrations(): Promise<void>;
    getConnection(): Promise<object>;
    setSetting(key: string, value: string | boolean | null, secret?: boolean): void;
    private getCharacterEnvSetting;
    private getRuntimeSettingValue;
    getSetting(key: string): string | boolean | number | null;
    getConversationLength(): number;
    /**
     * Check if action planning mode is enabled.
     *
     * When enabled (default), the agent can plan and execute multiple actions per response.
     * When disabled, the agent executes only a single action per response - a performance
     * optimization useful for game situations where state updates with every action.
     *
     * Priority: constructor option > character setting ACTION_PLANNING > default (true)
     */
    isActionPlanningEnabled(): boolean;
    /**
     * Get the LLM mode for model selection override.
     *
     * - `DEFAULT`: Use the model type specified in the useModel call (no override)
     * - `SMALL`: Override all text generation model calls to use TEXT_SMALL
     * - `LARGE`: Override all text generation model calls to use TEXT_LARGE
     *
     * Priority: constructor option > character setting LLM_MODE > default (DEFAULT)
     */
    getLLMMode(): import("./types/index.js").LLMModeType;
    /**
     * Check if the shouldRespond evaluation is enabled.
     *
     * When enabled (default: true), the agent evaluates whether to respond to each message.
     * When disabled, the agent always responds (ChatGPT mode) - useful for direct chat interfaces.
     *
     * Priority: constructor option > character setting CHECK_SHOULD_RESPOND > default (true)
     */
    isCheckShouldRespondEnabled(): boolean;
    getOptimizationDir(): string;
    registerPromptOptimizationHooks(hooks: PromptOptimizationRuntimeHooks | null): void;
    getPromptOptimizationHooks(): PromptOptimizationRuntimeHooks | null;
    resolveProviderModelString(resolvedModelType: string, optionsModel?: string, effectiveModelId?: string): string;
    enrichTrace(runId: string, signal: ScoreSignal): void;
    getActiveTrace(runId: string): ExecutionTrace | undefined;
    getActiveTracesForRun(runId: string): ExecutionTrace[];
    deleteActiveTrace(runId: string): void;
    deleteActiveTraceById(traceId: string): void;
    private static readonly ACTIVE_TRACE_TTL_MS;
    private activeTraceTtlPurgeCounter;
    private purgeStaleActiveTraces;
    private maybeRunActiveTraceTTLPurge;
    /**
     * Get the messaging adapter if available
     *
     * WHY: Messaging functionality is optional (only SQL adapters support it).
     * Client plugins check this before using messaging features.
     *
     * @returns IMessagingAdapter if the current adapter implements it, null otherwise
     */
    getMessagingAdapter(): IMessagingAdapter | null;
    /**
     * Shared collision policy for the three primary component registries
     * (actions, providers, evaluators). Registration is deterministic first-wins:
     * the earliest-registered component of a given name is authoritative and the
     * order in which plugins register is stable across a boot.
     *
     * A later registrant of the same name is either:
     *  - a DECLARED override (`override: true`) — an intentional supersede. We log
     *    the takeover at INFO and instruct the caller to replace the incumbent.
     *  - an UNDECLARED collision — two plugins claimed the same name without one
     *    declaring precedence. This is the unsafe, order-sensitive case the
     *    arch-audit flagged: which component wins used to be decided by a silent
     *    first-wins dedupe. We now keep the incumbent (still deterministic) but
     *    surface a WARN so the drift is observable instead of silent.
     *
     * @returns `true` if the caller should REPLACE the incumbent (declared
     *   override), `false` if it should keep the incumbent and skip the newcomer.
     */
    private resolveComponentCollision;
    registerProvider(provider: Provider): void;
    registerAction(action: Action): void;
    /** Register a pre-LLM action shortcut (#8791) into this runtime's registry. */
    registerShortcut(shortcut: ShortcutDefinition): void;
    registerShortcuts(shortcuts: readonly ShortcutDefinition[]): void;
    unregisterShortcut(id: string): void;
    /** Register a chat pre-handler into this runtime's registry. */
    registerChatPreHandler(handler: ChatPreHandler): void;
    registerChatPreHandlers(handlers: readonly ChatPreHandler[]): void;
    unregisterChatPreHandler(id: string): void;
    /**
     * Drain registered chat pre-handlers by priority before normal action
     * processing; the first non-null result short-circuits the turn.
     */
    drainChatPreHandlers(ctx: ChatPreHandlerContext): Promise<ChatPreHandlerResult | null>;
    registerEvaluator(evaluator: RegisteredEvaluator): void;
    unregisterEvaluator(name: string): boolean;
    registerResponseHandlerEvaluator(evaluator: ResponseHandlerEvaluator): void;
    unregisterResponseHandlerEvaluator(name: string): boolean;
    registerResponseHandlerFieldEvaluator(evaluator: ResponseHandlerFieldEvaluator): void;
    unregisterResponseHandlerFieldEvaluator(name: string): boolean;
    /**
     * Abort the active turn for `roomId`. Convenience wrapper for
     * `turnControllers.abortTurn`. Returns true if a turn was aborted.
     */
    abortTurn(roomId: string, reason: string): boolean;
    unregisterAction(name: string): boolean;
    getAllActions(): Action[];
    /**
     * Get actions filtered by tool policy.
     *
     * @param context - Optional policy context for filtering
     * @returns Filtered actions based on policy
     */
    getFilteredActions(context?: {
        profile?: ToolProfileId;
        characterPolicy?: ToolPolicyConfig;
        channelPolicy?: ToolPolicyConfig;
        providerPolicy?: ToolPolicyConfig;
        worldPolicy?: ToolPolicyConfig;
        roomPolicy?: ToolPolicyConfig;
    }): Promise<Action[]>;
    /**
     * Check if a specific action is allowed by tool policy.
     *
     * @param actionName - The action name to check
     * @param context - Optional policy context
     * @returns Whether the action is allowed
     */
    isActionAllowed(actionName: string, context?: {
        profile?: ToolProfileId;
        characterPolicy?: ToolPolicyConfig;
        channelPolicy?: ToolPolicyConfig;
        providerPolicy?: ToolPolicyConfig;
        worldPolicy?: ToolPolicyConfig;
        roomPolicy?: ToolPolicyConfig;
    }): Promise<{
        allowed: boolean;
        reason: string;
    }>;
    getActionResults(messageId: UUID): ActionResult[];
    /**
     * Run actions whose `mode` matches the given hook position. The runtime
     * fires this from fixed places in the message pipeline (see
     * services/message.ts). DURING modes execute handlers in parallel; all
     * other hook modes run sequentially in `modePriority` ascending order.
     * CONTEXT hooks are gated by `selectedContexts` overlapping the action's
     * `contexts`.
     */
    runActionsByMode(mode: ActionMode, message: Memory, state?: State, options?: {
        didRespond?: boolean;
        callback?: HandlerCallback;
        responses?: Memory[];
        selectedContexts?: readonly AgentContext[];
    }): Promise<Action[]>;
    ensureConnections(entities: Entity[], rooms: Room[], source: string, world: World): Promise<void>;
    ensureConnection(params: {
        entityId: UUID;
        roomId: UUID;
        roomName?: string;
        worldId?: UUID;
        worldName?: string;
        userName?: string;
        name?: string;
        source?: string;
        type?: ChannelType | string;
        channelId?: string;
        messageServerId?: UUID;
        userId?: UUID;
        metadata?: Record<string, JsonValue>;
    }): Promise<void>;
    ensureParticipantInRoom(entityId: UUID, roomId: UUID): Promise<void>;
    getParticipantsForEntity(entityId: UUID): Promise<Participant[]>;
    getParticipantsForEntities(entityIds: UUID[]): Promise<Participant[]>;
    getParticipantsForRoom(roomId: UUID): Promise<UUID[]>;
    getParticipantsForRooms(roomIds: UUID[]): Promise<import("./types/database.js").ParticipantsForRoomsResult>;
    isRoomParticipant(roomId: UUID, entityId: UUID): Promise<boolean>;
    areRoomParticipants(pairs: Array<{
        roomId: UUID;
        entityId: UUID;
    }>): Promise<boolean[]>;
    addParticipant(entityId: UUID, roomId: UUID): Promise<boolean>;
    createRoomParticipants(entityIds: UUID[], roomId: UUID): Promise<UUID[]>;
    /**
     * Ensure the existence of a world.
     *
     * WHY upsert: Eliminates race condition where concurrent agent basic-capabilitiess
     * could both try to create the same world. Upsert is atomic.
     */
    ensureWorldExists({ id, name, messageServerId, metadata }: World): Promise<void>;
    /**
     * Ensure the existence of a room.
     *
     * WHY upsert: Eliminates race condition where concurrent connection attempts
     * (e.g., Discord bot receiving messages in same channel simultaneously) could
     * both try to create the same room. Upsert is atomic.
     */
    ensureRoomExists({ id, name, source, type, channelId, messageServerId, worldId, metadata, }: Room): Promise<void>;
    composeState(message: Memory, includeList?: string[] | null, onlyInclude?: boolean, skipCache?: boolean, refreshProviders?: string[] | null): Promise<State>;
    /** Lazy service start: used internally by _ensureServiceStarted / getServiceLoadPromise. */
    /** Dedupes concurrent starts for the same type via startingServices so only one start runs. */
    private _ensureServiceStarted;
    /** Runs one service start; used by _ensureServiceStarted with startingServices dedupe. */
    private _runServiceStart;
    /** Returns the service instance or null. Synchronous lookup from the services map. */
    getService<T extends Service = Service>(serviceName: ServiceTypeName | string): T | null;
    /**
     * Type-safe service getter that ensures the correct service type is returned
     * @template T - The expected service class type
     * @param serviceName - The service type name
     * @returns The service instance with proper typing, or null if not found
     */
    getTypedService<T extends Service = Service>(serviceName: ServiceTypeName | string): T | null;
    /**
     * Get all services of a specific type
     * @template T - The expected service class type
     * @param serviceName - The service type name
     * @returns Array of service instances with proper typing
     */
    getServicesByType<T extends Service = Service>(serviceName: ServiceTypeName | string): T[];
    /**
     * Get all registered service types, including lazy-registered services
     * that have not started.
     * @returns Array of registered service type names
     */
    getRegisteredServiceTypes(): ServiceTypeName[];
    /**
     * Check if a service type is registered; its class may still be awaiting
     * startup.
     * @param serviceType - The service type to check
     * @returns true if the service is registered
     */
    hasService(serviceType: ServiceTypeName | string): boolean;
    /**
     * Get the registration status of a service
     * @param serviceType - The service type to check
     * @returns the current registration status
     */
    getServiceRegistrationStatus(serviceType: ServiceTypeName | string): "pending" | "registering" | "registered" | "failed" | "unknown";
    /**
     * Get service health information
     * @returns Object containing service health status
     */
    getServiceHealth(): Record<string, {
        status: "pending" | "registering" | "registered" | "failed" | "unknown";
        instances: number;
        hasPromise: boolean;
    }>;
    registerService(serviceDef: ServiceClass): Promise<void>;
    private _createServiceResolver;
    getServiceLoadPromise(serviceType: ServiceTypeName | string): Promise<Service>;
    registerModel(modelType: ModelTypeName | string, handler: (runtime: IAgentRuntime, params: Record<string, JsonValue | object>) => Promise<JsonValue | object>, provider: string, priority?: number, metadata?: ModelRegistrationMetadata): void;
    /**
     * Handler-free snapshot of every registered model handler, sorted by
     * priority (descending) then registration order within each model type —
     * the same order `getModel`/`useModel` select in. Exposes the private
     * `models` map as metadata so hosts and observers can render a routing
     * table or seed a mirror without touching handler functions. Pair with the
     * {@link EventType.MODEL_REGISTERED} event to stay live.
     */
    getModelRegistrations(): ModelRegistrationInfo[];
    /**
     * The runtime-selected text-model provider, or undefined to use the default
     * (highest-priority) handler. Read from `ELIZA_BRAIN_PROVIDER` so an owner
     * action that mutates `character.settings` (and/or persists it to config)
     * flips the chat brain on the next model call with no restart. Returns
     * undefined when the setting is empty OR names a provider that has no
     * registered text handler, so a stale or mistyped value never strands the
     * brain — it simply falls back to the default provider. The same contract
     * holds at call time: useModel keeps the default-chain registrations behind
     * the override as a failover tail, so a rate-limited/exhausted override
     * provider falls to the registered backups instead of stranding the brain.
     */
    /**
     * Record the provider that served a successful `useModel` call, keyed by the
     * requested model-type string. Only real (non-empty) provider names are
     * stored so a caller reading it back never sees a fabricated value (#13623).
     */
    private noteResolvedModelProvider;
    /**
     * The provider name that served the most recent successful `useModel` call
     * for the given model type, or `undefined` if no such call has completed
     * (so callers can fail-closed rather than fabricate a provider). Lets the
     * trajectory stage recorders in `services/message.ts` name the real provider
     * that answered the messageHandler / factsAndRelationships call instead of
     * the hardcoded `"default"` literal (#13623).
     */
    getLastResolvedModelProvider(modelType: ModelTypeName | string): string | undefined;
    private resolveTextProviderOverride;
    private resolveModelRegistration;
    private resolveModelRegistrations;
    private logModelProviderFailover;
    private shouldFailOverModelProvider;
    private throwNoModelHandler;
    /**
     * Surface the failure that ends a `useModel` failover chain. A real `Error`
     * with a message rethrows unchanged so provider SDK stack traces and typed
     * subclasses (e.g. `NoModelProviderConfiguredError`, which the chat UI
     * narrows on) survive the boundary. Everything else — the bare
     * `{ status, error }` objects some providers/AI-SDK paths throw, or a
     * message-less `Error` — becomes an `ElizaError` whose message names the
     * provider, HTTP status, and underlying cause. Without this, a bare object
     * stringified to the diagnostically useless "[object Object]" in logs,
     * trajectories, and any user-surfaced failure text.
     */
    private rethrowModelFailoverError;
    getModel(modelType: ModelTypeName | string): ((runtime: IAgentRuntime, params: Record<string, JsonValue | object>) => Promise<JsonValue | object>) | undefined;
    /**
     * Retrieves model configuration settings from character settings with support for
     * model-specific overrides and default fallbacks.
     *
     * Precedence order (highest to lowest):
     * 1. Model-specific settings (e.g., TEXT_SMALL_TEMPERATURE)
     * 2. Default settings (e.g., DEFAULT_TEMPERATURE)
     *
     * @param modelType The specific model type to get settings for
     * @returns Object containing model parameters if they exist, or null if no settings are configured
     */
    private getModelSettings;
    /**
     * Helper to log model calls to the database (used by both streaming and non-streaming paths)
     */
    private buildRuntimeSystemPrompt;
    private attachEffectiveSystemPrompt;
    private getFirstUserPromptFromMessages;
    private logModelCall;
    useModel<T extends keyof ModelParamsMap, R = ModelResultMap[T]>(modelType: T, params: ModelParamsMap[T], provider?: string): Promise<R>;
    /**
     * Emit an llm-call entry against the current trajectory step for a
     * `useModel` call. Pure dedupe of the streaming and non-streaming paths
     * inside {@link useModel}; both paths formerly inlined an identical block.
     *
     * Skipped while the runtime is still initializing because
     * {@link _ensureServiceStarted} awaits `initPromise` and would deadlock.
     * Trajectory logging must never break core model flow, so any thrown
     * error here is swallowed.
     */
    private recordUseModelTrajectory;
    /**
     * Simplified text generation with optional character context.
     */
    generateText(input: string, options?: GenerateTextOptions): Promise<GenerateTextResult>;
    /**
     * Performance metrics for dynamic prompt execution.
     * Tracks success/failure rates per model+schema combination.
     *
     * Uses LRU-style eviction to prevent unbounded growth:
     * - Max 100 entries (sufficient for typical model+schema combinations)
     * - Entries older than 1 hour are pruned on access
     */
    private static dynamicPromptMetrics;
    private static readonly METRICS_MAX_ENTRIES;
    private static readonly METRICS_TTL_MS;
    private static readonly STRUCTURED_FAILURE_PREVIEW_LIMIT;
    /**
     * Get or create metrics entry with LRU eviction.
     */
    private static getOrCreateMetrics;
    private setStructuredOutputFailureState;
    private clearStructuredOutputFailureState;
    /**
     * Dynamic prompt execution with state injection, schema-based parsing, and validation-aware streaming.
     *
     * WHY THIS EXISTS:
     * LLMs are powerful but unreliable for structured outputs. They can:
     * - Silently truncate output when hitting token limits
     * - Skip fields or produce malformed structures
     * - Hallucinate or ignore parts of the prompt
     *
     * This method addresses these issues by:
     * 1. Validation codes: Injects UUID codes the LLM must echo back
     * 2. Streaming with safety: Enables streaming while detecting truncation
     * 3. Performance tracking: Tracks success/failure rates per model+schema
     */
    dynamicPromptExecFromState({ state: stateArg, params, schema, options, }: {
        state?: State;
        params: Omit<GenerateTextParams, "prompt"> & {
            prompt: string | ((ctx: {
                state: State;
            }) => string);
        };
        schema: SchemaRow[];
        options?: {
            key?: string;
            promptName?: string;
            modelSize?: "nano" | "small" | "medium" | "large" | "mega";
            modelType?: import("./types/index.js").TextGenerationModelType;
            model?: string;
            requiredFields?: string[];
            contextCheckLevel?: 0 | 1 | 2 | 3;
            checkpointCodes?: boolean;
            maxRetries?: number;
            retryBackoff?: number | RetryBackoffConfig;
            disableCache?: boolean;
            cacheTTL?: number;
            onStreamChunk?: StreamChunkCallback;
            onStreamEvent?: (event: StreamEvent, messageId?: string) => void | Promise<void>;
            abortSignal?: AbortSignal;
        };
    }): Promise<Record<string, unknown> | null>;
    private flattenSchemaRows;
    private renderJsonSchemaExample;
    private buildJsonExampleValue;
    private buildJsonExampleValueAtDepth;
    private validateResponseAgainstSchema;
    private validateSchemaValue;
    private validateSchemaValueAtDepth;
    private buildValidationOutputInstructions;
    private getEffectiveSchemaValueType;
    private collectSchemaDefinitionWarnings;
    private collectSchemaSpecWarnings;
    private buildSchemaMetricKey;
    private serializeSchemaMetricRow;
    private serializeSchemaMetricSpec;
    private serializeSchemaMetricSpecAtDepth;
    /**
     * Calculate retry backoff delay.
     */
    private calculateBackoffDelay;
    /**
     * Sleep for a duration that can be interrupted by an abort signal.
     * Returns true if aborted, false if sleep completed normally.
     */
    private abortableSleep;
    /**
     * Template rendering helpers for prompt caching and deterministic compilation.
     */
    private getCompiledRuntimeTemplate;
    private cleanDynamicPromptTemplateOutput;
    private extractTemplatePlaceholderKeys;
    private isTemplateChunkStable;
    private getPromptProviderSegments;
    private renderPromptTemplateSegments;
    private joinPromptSegmentGroups;
    private mergePromptSegments;
    /**
     * Convert double-brace Handlebars bindings to triple-brace (non-escaping).
     *
     * Handlebars uses:
     * - `{{var}}` for HTML-escaped output
     * - `{{{var}}}` for raw/unescaped output
     *
     * This function upgrades simple variable bindings to triple-brace so that
     * special characters in state values don't get HTML-encoded in prompts.
     *
     * The regex preserves Handlebars helpers and special syntax:
     * - `{{#if}}`, `{{/if}}` - block helpers (start with # or /)
     * - `{{! comment }}` - comments (start with !)
     * - `{{> partial}}` - partials (start with >)
     * - `{{{already_raw}}}` - already triple-braced
     * - `{{else}}` - else blocks
     */
    private upgradeDoubleToTriple;
    /**
     * Normalize structured response (handle nested response objects).
     *
     * Some LLMs wrap their output in extra `{response: {...}}` layers.
     * This recursively unwraps them up to a reasonable depth limit.
     */
    private normalizeStructuredResponse;
    private parseStructuredResponse;
    private extractStructuredResponseCandidates;
    private detectStructuredResponseFormats;
    private looksLikeJsonObject;
    private extractEmbeddedJsonObject;
    private extractBalancedJsonObject;
    registerEvent<T extends keyof EventPayloadMap>(event: T, handler: EventHandler<T>): void;
    registerEvent<P extends EventPayload = EventPayload>(event: string, handler: (params: P) => Promise<void>): void;
    unregisterEvent<T extends keyof EventPayloadMap>(event: T, handler: EventHandler<T>): void;
    unregisterEvent<P extends EventPayload = EventPayload>(event: string, handler: (params: P) => Promise<void>): void;
    getEvent(event: string): ((params: EventPayloadMap[keyof EventPayloadMap] | EventPayload) => Promise<void>)[] | undefined;
    emitEvent(event: string | string[], params: JsonValue | object): Promise<void>;
    /**
     * Diagnostic boundary for failures outside the action path (#12263). Logs
     * with a `[scope]` prefix, records the failure in the bounded ring, emits
     * {@link EventType.ERROR_REPORTED}, and forwards it into the
     * AgentEventService `"error"` stream when that service is registered.
     *
     * Self-safe: never throws. A failure inside this method (or inside an
     * `ERROR_REPORTED` handler it triggers) is caught and logged as a warning
     * without re-entering `reportError`, guarded by {@link inReportError}.
     */
    reportError(scope: string, error: unknown, context?: Record<string, unknown>): void;
    /** Snapshot copy of the reported-error ring (newest last). */
    getRecentReportedErrors(): ReportedError[];
    /**
     * Forward a reported error into the AgentEventService `"error"` stream when
     * that service is registered. Duck-typed via ServiceType.AGENT_EVENT so core
     * keeps no import edge to the service class. Best-effort: a missing or
     * throwing service is warn-only (still inside the reportError latch).
     */
    private forwardToAgentEventStream;
    /**
     * True while embedding generation is disabled because every registered
     * TEXT_EMBEDDING provider failed the dimension probe. While true, memory
     * writes persist without vectors (recall over new memories is degraded)
     * rather than emitting vectors the SQL adapter would silently drop against
     * a default-sized column. Cleared by the next successful
     * {@link ensureEmbeddingDimension} (e.g. the deferred boot re-probe).
     */
    isEmbeddingGenerationDisabled(): boolean;
    private disableEmbeddingGeneration;
    private enableEmbeddingGeneration;
    /**
     * Once-latch warn for skipped embedding generation: the first skipped write
     * logs a structured warning, subsequent skips stay quiet until the flag is
     * cleared and re-set (a fresh degradation event warns again).
     */
    private warnEmbeddingGenerationSkipped;
    ensureEmbeddingDimension(): Promise<void>;
    registerTaskWorker(taskHandler: TaskWorker): void;
    getTaskWorker(name: string): TaskWorker | undefined;
    unregisterTaskWorker(name: string): boolean;
    get db(): object;
    init(): Promise<void>;
    /**
     * Closes the database adapter. Call after stop() for full teardown (stops services then closes DB/connection).
     */
    close(): Promise<void>;
    getAgent(agentId: UUID): Promise<Agent | null>;
    getAgents(): Promise<Partial<Agent>[]>;
    createAgent(agent: Partial<Agent>): Promise<boolean>;
    updateAgent(agentId: UUID, agent: Partial<Agent>): Promise<boolean>;
    deleteAgent(agentId: UUID): Promise<boolean>;
    countAgents(): Promise<number>;
    cleanupAgents(): Promise<void>;
    getAgentsByIds(agentIds: UUID[]): Promise<Agent[]>;
    createAgents(agents: Partial<Agent>[]): Promise<UUID[]>;
    upsertAgents(agents: Partial<Agent>[]): Promise<void>;
    updateAgents(updates: Array<{
        agentId: UUID;
        agent: Partial<Agent>;
    }>): Promise<boolean>;
    deleteAgents(agentIds: UUID[]): Promise<boolean>;
    ensureAgentExists(agent: Partial<Agent>): Promise<Agent>;
    getEntityById(entityId: UUID): Promise<Entity | null>;
    getEntitiesForRooms(roomIds: UUID[], includeComponents?: boolean): Promise<import("./types/database.js").EntitiesForRoomsResult>;
    getEntitiesForRoom(roomId: UUID, includeComponents?: boolean): Promise<Entity[]>;
    createEntity(entity: Entity): Promise<boolean>;
    createEntities(entities: Entity[]): Promise<UUID[]>;
    upsertEntities(entities: Entity[]): Promise<void>;
    getComponents(entityId: UUID, worldId?: UUID, sourceEntityId?: UUID): Promise<Component[]>;
    getComponentsByNaturalKeys(keys: Array<{
        entityId: UUID;
        type: string;
        worldId?: UUID;
        sourceEntityId?: UUID;
    }>): Promise<(Component | null)[]>;
    getComponentsForEntities(entityIds: UUID[], worldId?: UUID, sourceEntityId?: UUID): Promise<Component[]>;
    addEmbeddingToMemory(memory: Memory): Promise<Memory>;
    /**
     * Re-embed the given memories at the active embedding dimension after their
     * stale-dimension vectors were reclaimed. Runs detached from boot and drains
     * through the embedding queue at `low` priority so live traffic is never
     * starved. Fetched in chunks so a large migration never loads every memory at
     * once; a chunk failure is reported and the rest still proceed.
     */
    private reembedMemoriesByIds;
    /**
     * Queue a memory for embedding generation. If companionUrl is set, POSTs to companion
     * and returns without waiting (fire-and-forget). WHY: Thin runtime doesn't block on embedding.
     */
    queueEmbeddingGeneration(memory: Memory, priority?: "high" | "normal" | "low"): Promise<void>;
    getMemories(params: {
        entityId?: UUID;
        agentId?: UUID;
        roomId?: UUID;
        limit?: number;
        count?: number;
        offset?: number;
        unique?: boolean;
        tableName: string;
        start?: number;
        end?: number;
        worldId?: UUID;
        metadata?: Record<string, unknown>;
        textContains?: string;
        orderBy?: "createdAt";
        orderDirection?: "asc" | "desc";
        includeEmbedding?: boolean;
        accessContext?: AccessContext;
    }): Promise<Memory[]>;
    getAllMemories(): Promise<Memory[]>;
    getMemoriesByIds(ids: UUID[], tableName?: string): Promise<Memory[]>;
    getMemoriesByRoomIds(params: {
        tableName: string;
        roomIds: UUID[];
        limit?: number;
        offset?: number;
        textContains?: string;
        includeEmbedding?: boolean;
        accessContext?: AccessContext;
    }): Promise<Memory[]>;
    searchMessages(params: {
        roomIds: UUID[];
        query: string;
        tableName?: string;
        limit?: number;
        offset?: number;
        since?: number;
        until?: number;
        accessContext?: AccessContext;
    }): Promise<MessageSearchHit[]>;
    clearEmbeddingsOutsideActiveDimension(): Promise<UUID[]>;
    getCachedEmbeddings(params: {
        query_table_name: string;
        query_threshold: number;
        query_input: string;
        query_field_name: string;
        query_field_sub_name: string;
        query_match_count: number;
    }): Promise<{
        embedding: number[];
        levenshtein_score: number;
    }[]>;
    searchMemories(params: {
        embedding: number[];
        query?: string;
        match_threshold?: number;
        count?: number;
        limit?: number;
        roomId?: UUID;
        unique?: boolean;
        worldId?: UUID;
        entityId?: UUID;
        tableName: string;
        accessContext?: AccessContext;
    }): Promise<Memory[]>;
    rerankMemories(query: string, memories: Memory[]): Promise<Memory[]>;
    /**
     * Get the secrets to redact from character settings.
     * Returns an empty object if no secrets are configured.
     */
    private getSecretsForRedaction;
    /**
     * Redact secrets from text content.
     * This prevents character secrets from appearing in outputs or memories.
     */
    redactSecrets(text: string): string;
    clearAllAgentMemories(): Promise<void>;
    deleteAllMemories(roomIds: UUID[], tableName: string): Promise<void>;
    countMemories(roomIdOrParams: UUID | {
        roomId?: UUID;
        /** The IAgentRuntime/adapter param form. The implementation
         * previously read only `roomId` and silently dropped this,
         * turning interface-correct room-scoped counts into TABLE-WIDE
         * ones (/reset reported "cleared 31k message(s)" for a
         * 40-message room). */
        roomIds?: UUID[];
        unique?: boolean;
        tableName?: string;
        entityId?: UUID;
        agentId?: UUID;
        metadata?: Record<string, unknown>;
    }, unique?: boolean, tableName?: string): Promise<number>;
    getLogs(params: {
        entityId?: UUID;
        roomId?: UUID;
        type?: string;
        limit?: number;
        offset?: number;
    }): Promise<Log[]>;
    getLogsByIds(logIds: UUID[]): Promise<Log[]>;
    createLogs(params: Array<{
        body: LogBody;
        entityId: UUID;
        roomId: UUID;
        type: string;
    }>): Promise<void>;
    updateLogs(logs: Array<{
        id: UUID;
        updates: Partial<Log>;
    }>): Promise<void>;
    deleteLogs(logIds: UUID[]): Promise<void>;
    createWorld(world: World): Promise<UUID>;
    getWorld(id: UUID): Promise<World | null>;
    deleteWorld(worldId: UUID): Promise<void>;
    getAllWorlds(): Promise<World[]>;
    updateWorld(world: World): Promise<void>;
    getWorldsByIds(worldIds: UUID[]): Promise<World[]>;
    createWorlds(worlds: World[]): Promise<UUID[]>;
    upsertWorlds(worlds: World[]): Promise<void>;
    deleteWorlds(worldIds: UUID[]): Promise<void>;
    updateWorlds(worlds: World[]): Promise<void>;
    getRoom(roomId: UUID): Promise<Room | null>;
    getRoomsByIds(roomIds: UUID[]): Promise<Room[]>;
    createRoom({ id, name, source, type, channelId, messageServerId, worldId, }: Room): Promise<UUID>;
    createRooms(rooms: Room[]): Promise<UUID[]>;
    upsertRooms(rooms: Room[]): Promise<void>;
    deleteRoomsByWorldId(worldId: UUID): Promise<void>;
    getRoomsForParticipant(entityId: UUID): Promise<UUID[]>;
    getRoomsForParticipants(entityIds: UUID[]): Promise<UUID[]>;
    getRooms(worldId: UUID): Promise<Room[]>;
    getRoomsByWorld(worldId: UUID): Promise<Room[]>;
    getParticipantUserState(roomId: UUID, entityId: UUID): Promise<"FOLLOWED" | "MUTED" | null>;
    updateParticipantUserState(roomId: UUID, entityId: UUID, state: "FOLLOWED" | "MUTED" | null): Promise<void>;
    getParticipantUserStates(pairs: Array<{
        roomId: UUID;
        entityId: UUID;
    }>): Promise<("FOLLOWED" | "MUTED" | null)[]>;
    updateParticipantUserStates(updates: Array<{
        roomId: UUID;
        entityId: UUID;
        state: "FOLLOWED" | "MUTED" | null;
    }>): Promise<void>;
    getRelationships(params: {
        entityIds?: UUID[];
        entityId?: UUID;
        tags?: string[];
        limit?: number;
        offset?: number;
    }): Promise<Relationship[]>;
    getCaches<T>(keys: string[]): Promise<Map<string, T>>;
    setCaches<T>(entries: Array<{
        key: string;
        value: T;
    }>): Promise<boolean>;
    deleteCaches(keys: string[]): Promise<boolean>;
    getTasks(params: {
        roomId?: UUID;
        tags?: string[];
        entityId?: UUID;
    }): Promise<Task[]>;
    getTasksByName(name: string): Promise<Task[]>;
    /** WHY fire-and-forget: Notify companion that tasks changed so it can poll/process; no need to block. */
    private _notifyCompanionTasksDirty;
    /**
     * Nudge the local TaskService (same process) so its dirty-gated tick re-queries the DB.
     * WHY: the companion POST above only reaches a REMOTE receiver; without this, in-process
     * task mutations never re-arm the tick and tasks created after boot are never seen.
     */
    private _markLocalTasksDirty;
    createTask(task: Task): Promise<UUID>;
    getTask(id: UUID): Promise<Task | null>;
    updateTask(id: UUID, task: Partial<Task>): Promise<void>;
    deleteTask(id: UUID): Promise<void>;
    log(params: {
        body: LogBody;
        entityId: UUID;
        roomId: UUID;
        type: string;
    }): Promise<void>;
    deleteLog(logId: UUID): Promise<void>;
    getCache<T>(key: string): Promise<T | undefined>;
    setCache<T>(key: string, value: T): Promise<boolean>;
    deleteCache(key: string): Promise<boolean>;
    createTasks(tasks: Task[]): Promise<UUID[]>;
    getTasksByIds(taskIds: UUID[]): Promise<Task[]>;
    updateTasks(updates: Array<{
        id: UUID;
        task: Partial<Task>;
    }>): Promise<void>;
    deleteTasks(taskIds: UUID[]): Promise<void>;
    /**
     * Run callback in a database transaction. Forwards options.entityContext to the adapter.
     * WHY forward only: RLS (withEntityContext) is implemented in the adapter (e.g. plugin-sql Postgres);
     * runtime does not touch Postgres or connection context.
     */
    transaction<T>(callback: (tx: IDatabaseAdapter<object>) => Promise<T>, options?: {
        entityContext?: UUID;
    }): Promise<T>;
    queryEntities(params: {
        componentType?: string;
        componentDataFilter?: Record<string, unknown>;
        agentId?: UUID;
        entityIds?: UUID[];
        worldId?: UUID;
        limit?: number;
        offset?: number;
        includeAllComponents?: boolean;
        entityContext?: UUID;
    }): Promise<Entity[]>;
    getEntitiesByIds(entityIds: UUID[]): Promise<Entity[]>;
    updateEntities(entities: Entity[]): Promise<void>;
    deleteEntities(entityIds: UUID[]): Promise<void>;
    searchEntitiesByName(params: {
        query: string;
        agentId?: UUID;
        limit?: number;
    }): Promise<Entity[]>;
    getEntitiesByNames(params: {
        names: string[];
        agentId?: UUID;
    }): Promise<Entity[]>;
    updateEntity(entity: Entity): Promise<void>;
    createComponents(components: Component[]): Promise<UUID[]>;
    getComponentsByIds(componentIds: UUID[]): Promise<Component[]>;
    updateComponents(components: Component[]): Promise<void>;
    deleteComponents(componentIds: UUID[]): Promise<void>;
    createComponent(component: Component): Promise<boolean>;
    getComponent(entityId: UUID, type: string, worldId?: UUID, sourceEntityId?: UUID): Promise<Component | null>;
    updateComponent(component: Component): Promise<void>;
    deleteComponent(componentId: UUID): Promise<void>;
    upsertComponent(component: Component): Promise<void>;
    upsertComponents(components: Component[], options?: {
        entityContext?: UUID;
    }): Promise<void>;
    patchComponent(componentId: UUID, ops: PatchOp[], options?: {
        entityContext?: UUID;
    }): Promise<void>;
    patchComponents(updates: Array<{
        componentId: UUID;
        ops: PatchOp[];
    }>, options?: {
        entityContext?: UUID;
    }): Promise<void>;
    patchComponentField(componentId: UUID, op: PatchOp, options?: {
        entityContext?: UUID;
    }): Promise<void>;
    getComponentsByType(type: string, agentId?: UUID, options?: {
        entityContext?: UUID;
    }): Promise<Component[]>;
    upsertMemory(memory: Memory, tableName: string, options?: {
        entityContext?: UUID;
    }): Promise<void>;
    upsertMemories(memories: Array<{
        memory: Memory;
        tableName: string;
    }>, options?: {
        entityContext?: UUID;
    }): Promise<void>;
    createRelationships(relationships: Array<{
        sourceEntityId: UUID;
        targetEntityId: UUID;
        tags?: string[];
        metadata?: Metadata;
    }>): Promise<UUID[]>;
    getRelationshipsByIds(relationshipIds: UUID[]): Promise<Relationship[]>;
    getRelationshipsByPairs(pairs: Array<{
        sourceEntityId: UUID;
        targetEntityId: UUID;
    }>): Promise<(Relationship | null)[]>;
    updateRelationships(relationships: Relationship[]): Promise<void>;
    deleteRelationships(relationshipIds: UUID[]): Promise<void>;
    createRelationship(params: {
        sourceEntityId: UUID;
        targetEntityId: UUID;
        tags?: string[];
        metadata?: Metadata;
    }): Promise<boolean>;
    getRelationship(params: {
        sourceEntityId: UUID;
        targetEntityId: UUID;
    }): Promise<Relationship | null>;
    updateRelationship(relationship: Relationship): Promise<void>;
    createMemories(memories: Array<{
        memory: Memory;
        tableName: string;
        unique?: boolean;
    }>): Promise<UUID[]>;
    updateMemories(memories: Array<Partial<Memory> & {
        id: UUID;
        metadata?: MemoryMetadata;
    }>): Promise<void>;
    deleteMemories(memoryIds: UUID[]): Promise<void>;
    getMemoryById(id: UUID): Promise<Memory | null>;
    createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<UUID>;
    updateMemory(memory: Partial<Memory> & {
        id: UUID;
        metadata?: MemoryMetadata;
    }): Promise<boolean>;
    deleteMemory(memoryId: UUID): Promise<void>;
    deleteParticipants(participants: Array<{
        entityId: UUID;
        roomId: UUID;
    }>): Promise<boolean>;
    updateParticipants(participants: Array<{
        entityId: UUID;
        roomId: UUID;
        updates: Partial<Participant>;
    }>): Promise<void>;
    removeParticipant(entityId: UUID, roomId: UUID): Promise<boolean>;
    updateRooms(rooms: Room[]): Promise<void>;
    deleteRooms(roomIds: UUID[]): Promise<void>;
    updateRoom(room: Room): Promise<void>;
    deleteRoom(roomId: UUID): Promise<void>;
    on(event: string, callback: (data: EventPayload) => void): void;
    off(event: string, callback: (data: EventPayload) => void): void;
    emit(event: string, data: EventPayload): void;
    sendControlMessage(params: {
        roomId: UUID;
        action: "enable_input" | "disable_input";
        target?: string;
    }): Promise<void>;
    registerSearchCategory(registration: SearchCategoryRegistration): void;
    getSearchCategories(options?: SearchCategoryEnumerationOptions): SearchCategoryRegistration[];
    getSearchCategory(category: string, options?: SearchCategoryLookupOptions): SearchCategoryRegistration;
    registerSendHandler(source: string, handler: SendHandlerFunction): void;
    registerMessageConnector(registration: MessageConnectorRegistration): void;
    unregisterMessageConnector(source: string, accountId?: string): boolean;
    getMessageConnectors(): MessageConnector[];
    registerPostConnector(registration: PostConnectorRegistration): void;
    unregisterPostConnector(source: string, accountId?: string): boolean;
    getPostConnectors(): PostConnector[];
    sendMessageToTarget(target: TargetInfo, content: Content): Promise<Memory | undefined>;
    private resolveMessageConnector;
    private requireConnectorHook;
    editMessageOnTarget(target: TargetInfo, messageId: string, content: Content): Promise<Memory | undefined>;
    sendTypingOnTarget(target: TargetInfo): Promise<void>;
    stopTypingOnTarget(target: TargetInfo): Promise<void>;
    createThreadOnTarget(target: TargetInfo, params?: Omit<MessageConnectorCreateThreadParams, "target">): Promise<ThreadHandle>;
    postToThreadOnTarget(target: TargetInfo, thread: ThreadHandle, content: Content, identity?: ConnectorPostIdentity): Promise<Memory | undefined>;
    addReactionOnTarget(target: TargetInfo, messageId: string, emoji: string): Promise<void>;
    getMemoriesByWorldId(params: {
        worldId: UUID;
        limit?: number;
        tableName?: string;
    }): Promise<Memory[]>;
    runMigrations(migrationsPaths?: string[]): Promise<void>;
    isReady(): Promise<boolean>;
    getPairingRequestsForChannel(channel: PairingChannel, agentId: UUID): Promise<PairingRequest[]>;
    getPairingRequests(queries: Array<{
        channel: PairingChannel;
        agentId: UUID;
    }>): Promise<import("./types/database.js").PairingRequestsResult>;
    getPairingAllowlistForChannel(channel: PairingChannel, agentId: UUID): Promise<PairingAllowlistEntry[]>;
    getPairingAllowlists(queries: Array<{
        channel: PairingChannel;
        agentId: UUID;
    }>): Promise<import("./types/database.js").PairingAllowlistsResult>;
    createPairingRequests(requests: PairingRequest[]): Promise<UUID[]>;
    updatePairingRequests(requests: PairingRequest[]): Promise<void>;
    deletePairingRequests(ids: UUID[]): Promise<void>;
    createPairingAllowlistEntries(entries: PairingAllowlistEntry[]): Promise<UUID[]>;
    updatePairingAllowlistEntries(entries: PairingAllowlistEntry[]): Promise<void>;
    deletePairingAllowlistEntries(ids: UUID[]): Promise<void>;
    createPairingRequest(request: PairingRequest): Promise<UUID>;
    updatePairingRequest(request: PairingRequest): Promise<void>;
    deletePairingRequest(id: UUID): Promise<void>;
    createPairingAllowlistEntry(entry: PairingAllowlistEntry): Promise<UUID>;
    deletePairingAllowlistEntry(id: UUID): Promise<void>;
    listConnectorAccounts(params?: ListConnectorAccountsParams): Promise<ConnectorAccountRecord[]>;
    getConnectorAccount(params: GetConnectorAccountParams): Promise<ConnectorAccountRecord | null>;
    upsertConnectorAccount(params: UpsertConnectorAccountParams): Promise<ConnectorAccountRecord>;
    deleteConnectorAccount(params: DeleteConnectorAccountParams): Promise<boolean>;
    setConnectorAccountCredentialRef(params: SetConnectorAccountCredentialRefParams): Promise<ConnectorAccountCredentialRefRecord>;
    getConnectorAccountCredentialRef(params: GetConnectorAccountCredentialRefParams): Promise<ConnectorAccountCredentialRefRecord | null>;
    listConnectorAccountCredentialRefs(params: ListConnectorAccountCredentialRefsParams): Promise<ConnectorAccountCredentialRefRecord[]>;
    appendConnectorAccountAuditEvent(params: AppendConnectorAccountAuditEventParams): Promise<ConnectorAccountAuditEventRecord>;
    createOAuthFlowState(params: CreateOAuthFlowStateParams): Promise<OAuthFlowRecord>;
    consumeOAuthFlowState(params: ConsumeOAuthFlowStateParams): Promise<OAuthFlowRecord | null>;
    getOAuthFlowState(params: GetOAuthFlowStateParams): Promise<OAuthFlowRecord | null>;
    updateOAuthFlowState(params: UpdateOAuthFlowStateParams): Promise<OAuthFlowRecord | null>;
    deleteOAuthFlowState(params: DeleteOAuthFlowStateParams): Promise<boolean>;
    deleteRoomsByWorldIds(worldIds: UUID[]): Promise<void>;
    getRoomsByWorlds(worldIds: UUID[], limit?: number, offset?: number): Promise<Room[]>;
    installRemotePlugin(_plugin: Plugin, _options?: RemotePluginInstallOptions): Promise<RemotePluginInstanceHandle>;
}
export {};
//# sourceMappingURL=runtime.d.ts.map