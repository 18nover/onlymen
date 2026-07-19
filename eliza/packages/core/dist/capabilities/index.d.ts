/**
 * Environment-agnostic capability-router contract and its two reference
 * implementations. `ElizaCapabilityRouter` is the surface a host exposes to an
 * Eliza agent for filesystem, terminal (pty), git, local-model, and
 * remote-plugin capabilities; the concrete router service registers under
 * `CAPABILITY_ROUTER_SERVICE_TYPE` and is retrieved with `getCapabilityRouter`.
 *
 * `UnavailableCapabilityRouter` fails every call with a structured
 * `CapabilityError` (the fallback where no host capabilities exist).
 * `RuntimeBrokerCapabilityRouter` forwards calls over an `invokeRuntime` broker
 * and strictly decodes every response — rejecting malformed payloads,
 * control-character / header injection, unsafe asset paths and URLs, and
 * reserved service-method names before they reach a caller.
 * `CAPABILITY_ROUTER_PROTOCOL_FIXTURE` is the canonical decoder-valid payload
 * that pins the wire protocol.
 */
import type { JsonObject, JsonValue } from "../types/primitives.js";
import type { SurfaceCapability } from "../types/surface-manifest.js";
export * from "./sandbox-factory.js";
export declare const CAPABILITY_ROUTER_SERVICE_TYPE: "capability-router";
export type CapabilityEnvironment = "desktop" | "node" | "server" | "browser" | "mobile" | "unknown";
export type CapabilityName = "fs" | "pty" | "git" | "model" | "plugin";
export type CapabilityAvailability = {
    environment: CapabilityEnvironment;
    available: boolean;
    capabilities: Record<CapabilityName, boolean>;
    reason?: string;
};
export type CapabilityEndpointSelection = {
    endpointId?: string;
};
export type CapabilityErrorCode = "CAPABILITY_UNAVAILABLE" | "CAPABILITY_DECODE_FAILED" | "CAPABILITY_REQUEST_FAILED";
export type CapabilityErrorPayload = {
    code: CapabilityErrorCode;
    message: string;
    capability?: CapabilityName;
    method?: string;
    details?: JsonValue;
};
export declare class CapabilityError extends Error {
    readonly code: CapabilityErrorCode;
    readonly capability?: CapabilityName;
    readonly method?: string;
    readonly details?: JsonValue;
    constructor(payload: CapabilityErrorPayload);
    toJSON(): CapabilityErrorPayload;
}
export type FileReadTextParams = CapabilityEndpointSelection & {
    path: string;
    maxBytes?: number;
    traceSessionId?: string;
};
export type FileReadTextResult = {
    path: string;
    text: string;
    size: number;
    truncated: boolean;
};
export type FileEntryKind = "file" | "directory" | "symlink" | "other";
export type FileStat = {
    path: string;
    name: string;
    kind: FileEntryKind;
    size: number;
    modifiedAt?: string;
    isText?: boolean;
};
export type FileListParams = CapabilityEndpointSelection & {
    path?: string;
    rootId?: string;
    limit?: number;
    includeHidden?: boolean;
    ignore?: string[];
    traceSessionId?: string;
};
export type FileListResult = {
    root: JsonObject;
    path: string;
    entries: FileStat[];
    truncated: boolean;
    totalAfterIgnore: number;
};
export type FileWriteTextParams = CapabilityEndpointSelection & {
    path: string;
    text: string;
    createDirectories?: boolean;
    overwrite?: boolean;
    traceSessionId?: string;
};
export type FileWriteTextResult = {
    path: string;
    bytesWritten: number;
};
export type TerminalRunParams = CapabilityEndpointSelection & {
    command: string;
    args?: string[];
    cwd?: string;
    env?: Record<string, string>;
    timeoutMs?: number;
    traceSessionId?: string;
};
export type TerminalRunResult = {
    output: string;
    exitCode: number | null;
    timedOut: boolean;
};
export type GitStatusParams = CapabilityEndpointSelection & {
    root: string;
    traceSessionId?: string;
};
export type GitStatusResult = {
    repo: JsonObject;
    branch?: string;
    ahead?: number;
    behind?: number;
    files: JsonObject[];
    raw: string;
};
export type GitDiffParams = CapabilityEndpointSelection & {
    root: string;
    path?: string;
    staged?: boolean;
    traceSessionId?: string;
};
export type GitDiffResult = {
    raw: string;
};
export type GitCommandRunParams = CapabilityEndpointSelection & {
    root: string;
    args: string[];
    traceSessionId?: string;
};
export type GitOperationStatus = "running" | "completed" | "failed";
export type GitOperation = {
    id: string;
    name: string;
    cwd: string;
    command: string[];
    status: GitOperationStatus;
    stdout: string;
    stderr: string;
    exitCode?: number | null;
    signal?: string | null;
    startedAt: string;
    completedAt?: string;
    error?: string;
};
export type GitCommandRunResult = {
    operation: GitOperation;
};
export type LocalModelStatusResult = {
    ok: boolean;
    provider?: string;
    raw?: JsonValue;
};
export type LocalModelStatusParams = CapabilityEndpointSelection & {
    traceSessionId?: string;
};
export type RemotePluginActionManifest = {
    name: string;
    description: string;
    descriptionCompressed?: string;
    similes?: string[];
    parameters?: JsonValue;
};
export type RemotePluginProviderManifest = {
    name: string;
    description?: string;
    descriptionCompressed?: string;
    dynamic?: boolean;
    private?: boolean;
};
export type RemotePluginRouteManifest = {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "STATIC";
    path: string;
    name?: string;
    public?: boolean;
    publicReason?: string;
    publicWrite?: string;
    description?: string;
};
export type RemotePluginBackgroundPolicy = "opaque" | "shared";
export type RemotePluginSurfaceManifest = JsonObject & {
    background?: RemotePluginBackgroundPolicy;
    header?: "normal" | "fullscreen" | "modal" | "immersive";
    isolation?: "in-process" | "sandboxed-iframe" | "native-webview" | "immersive";
    lifecycle?: "ephemeral" | "retained";
    capabilities?: SurfaceCapability[];
};
export type RemotePluginViewManifest = {
    id: string;
    label: string;
    viewType?: "gui" | "tui" | "xr";
    backgroundPolicy?: RemotePluginBackgroundPolicy;
    surface?: RemotePluginSurfaceManifest;
    bundlePath?: string;
    bundleUrl?: string;
    framePath?: string;
    frameUrl?: string;
    contentType?: string;
    integrity?: string;
};
export type RemotePluginEvaluatorManifest = {
    name: string;
    description: string;
    prompt: string;
    similes?: string[];
    priority?: number;
    providers?: string[];
    schema: JsonObject;
    modelType?: string;
    hasPrepare?: boolean;
    hasProcessor?: boolean;
};
export type RemotePluginResponseHandlerEvaluatorManifest = {
    name: string;
    description?: string;
    priority?: number;
};
export type RemotePluginResponseHandlerFieldEvaluatorManifest = {
    name: string;
    description: string;
    priority?: number;
    schema: JsonObject;
    hasParse?: boolean;
    hasHandle?: boolean;
};
export type RemotePluginEventManifest = {
    eventName: string;
};
export type RemotePluginModelManifest = {
    modelType: string;
    priority?: number;
};
export type RemotePluginServiceManifest = {
    serviceType: string;
    capabilityDescription?: string;
    methods?: string[];
    config?: JsonObject;
};
export type RemotePluginJsonSchemaDefinition = {
    type: string;
    properties?: Record<string, RemotePluginJsonSchemaDefinition>;
    items?: RemotePluginJsonSchemaDefinition;
    required?: string[];
    enumValues?: string[];
    description?: string;
};
export type RemotePluginComponentTypeManifest = {
    name: string;
    schema: RemotePluginJsonSchemaDefinition;
};
export type RemotePluginWidgetManifest = {
    id: string;
    pluginId?: string;
    slot: "chat-sidebar" | "character" | "nav-page";
    label: string;
    icon?: string;
    order?: number;
    defaultEnabled?: boolean;
    navGroup?: string;
    developerOnly?: boolean;
    componentExport?: string;
};
export type RemotePluginAppViewerManifest = {
    url: string;
    embedParams?: Record<string, string>;
    postMessageAuth?: boolean;
    sandbox?: string;
};
export type RemotePluginAppSessionManifest = {
    mode: "viewer" | "spectate-and-steer" | "external";
    features?: Array<"commands" | "telemetry" | "pause" | "resume" | "suggestions">;
};
export type RemotePluginAppNavTabManifest = {
    id: string;
    label: string;
    icon?: string;
    path: string;
    order?: number;
    developerOnly?: boolean;
    group?: string;
    backgroundPolicy?: RemotePluginBackgroundPolicy;
    componentExport?: string;
};
export type RemotePluginAppManifest = {
    displayName?: string;
    category?: string;
    launchType?: string;
    launchUrl?: string | null;
    icon?: string | null;
    capabilities?: string[];
    minPlayers?: number | null;
    maxPlayers?: number | null;
    runtimePlugin?: string;
    viewer?: RemotePluginAppViewerManifest;
    session?: RemotePluginAppSessionManifest;
    bridgeExport?: string;
    uiExtension?: {
        detailPanelId?: string;
    };
    developerOnly?: boolean;
    visibleInAppStore?: boolean;
    navTabs?: RemotePluginAppNavTabManifest[];
};
export type RemotePluginAppBridgeHook = "prepareLaunch" | "resolveViewerAuthMessage" | "ensureRuntimeReady" | "collectLaunchDiagnostics" | "resolveLaunchSession" | "refreshRunSession" | "stopRun" | "handleAppRoutes";
export type RemotePluginAppBridgeManifest = {
    hooks: RemotePluginAppBridgeHook[];
};
export type RemotePluginLifecycleHook = "init" | "dispose" | "applyConfig";
export type RemotePluginLifecycleManifest = {
    hooks: RemotePluginLifecycleHook[];
};
export type RemotePluginConfigValue = string | number | boolean | null;
export type RemotePluginConfigMap = Record<string, RemotePluginConfigValue>;
export type RemotePluginModuleProvenance = {
    issuer: string;
    subject: string;
    digestSha256: string;
    signatureAlgorithm: string;
    signature: string;
};
export type RemotePluginModuleManifest = {
    id: string;
    name: string;
    /** Assigned by an aggregating capability router so RPC calls stay bound to the endpoint that supplied this module. */
    capabilityEndpointId?: string;
    version?: string;
    description?: string;
    priority?: number;
    contexts?: string[];
    config?: RemotePluginConfigMap;
    schema?: JsonObject;
    actions?: RemotePluginActionManifest[];
    providers?: RemotePluginProviderManifest[];
    evaluators?: RemotePluginEvaluatorManifest[];
    responseHandlerEvaluators?: RemotePluginResponseHandlerEvaluatorManifest[];
    responseHandlerFieldEvaluators?: RemotePluginResponseHandlerFieldEvaluatorManifest[];
    events?: RemotePluginEventManifest[];
    models?: RemotePluginModelManifest[];
    services?: RemotePluginServiceManifest[];
    componentTypes?: RemotePluginComponentTypeManifest[];
    widgets?: RemotePluginWidgetManifest[];
    app?: RemotePluginAppManifest;
    appBridge?: RemotePluginAppBridgeManifest;
    lifecycle?: RemotePluginLifecycleManifest;
    routes?: RemotePluginRouteManifest[];
    views?: RemotePluginViewManifest[];
    provenance?: RemotePluginModuleProvenance;
    metadata?: JsonObject;
};
export type PluginListModulesParams = CapabilityEndpointSelection & {
    traceSessionId?: string;
};
export type PluginListModulesResult = {
    modules: RemotePluginModuleManifest[];
};
export type PluginInvokeActionParams = CapabilityEndpointSelection & {
    moduleId: string;
    action: string;
    content?: JsonObject;
    options?: JsonObject;
    traceSessionId?: string;
};
export type PluginInvokeActionResult = {
    text?: string;
    actions?: string[];
    values?: JsonObject;
    data?: JsonObject;
};
export type PluginGetProviderParams = CapabilityEndpointSelection & {
    moduleId: string;
    provider: string;
    state?: JsonObject;
    traceSessionId?: string;
};
export type PluginGetProviderResult = {
    text?: string;
    values?: JsonObject;
    data?: JsonObject;
};
export type PluginCallRouteParams = CapabilityEndpointSelection & {
    moduleId: string;
    method: string;
    path: string;
    body?: JsonValue;
    query?: Record<string, string | string[]>;
    headers?: Record<string, string>;
    traceSessionId?: string;
};
export type PluginCallRouteResult = {
    status: number;
    headers?: Record<string, string>;
    body?: JsonValue;
};
export type PluginGetAssetParams = CapabilityEndpointSelection & {
    moduleId: string;
    path: string;
    traceSessionId?: string;
};
export type PluginGetAssetResult = {
    path: string;
    contentType: string;
    bodyBase64: string;
    integrity?: string;
};
export type PluginEvaluatorShouldRunParams = CapabilityEndpointSelection & {
    moduleId: string;
    evaluator: string;
    message?: JsonObject;
    state?: JsonObject;
    options?: JsonObject;
    traceSessionId?: string;
};
export type PluginEvaluatorShouldRunResult = {
    shouldRun: boolean;
};
export type PluginEvaluatorPrepareParams = PluginEvaluatorShouldRunParams;
export type PluginEvaluatorPrepareResult = {
    prepared?: JsonValue;
};
export type PluginEvaluatorPromptParams = PluginEvaluatorShouldRunParams & {
    prepared?: JsonValue;
};
export type PluginEvaluatorPromptResult = {
    prompt: string;
};
export type PluginEvaluatorProcessParams = PluginEvaluatorPromptParams & {
    output?: JsonValue;
};
export type PluginEvaluatorProcessResult = {
    result?: JsonObject;
};
export type PluginResponseHandlerEvaluatorShouldRunParams = CapabilityEndpointSelection & {
    moduleId: string;
    evaluator: string;
    context?: JsonObject;
    traceSessionId?: string;
};
export type PluginResponseHandlerEvaluatorShouldRunResult = {
    shouldRun: boolean;
};
export type PluginResponseHandlerEvaluatorEvaluateParams = PluginResponseHandlerEvaluatorShouldRunParams;
export type PluginResponseHandlerEvaluatorEvaluateResult = {
    patch?: JsonObject;
};
export type PluginResponseHandlerFieldEvaluatorShouldRunParams = CapabilityEndpointSelection & {
    moduleId: string;
    field: string;
    context?: JsonObject;
    traceSessionId?: string;
};
export type PluginResponseHandlerFieldEvaluatorShouldRunResult = {
    shouldRun: boolean;
};
export type PluginResponseHandlerFieldEvaluatorParseParams = PluginResponseHandlerFieldEvaluatorShouldRunParams & {
    value?: JsonValue;
};
export type PluginResponseHandlerFieldEvaluatorParseResult = {
    value?: JsonValue;
    softFail?: boolean;
};
export type PluginResponseHandlerFieldEvaluatorHandleParams = PluginResponseHandlerFieldEvaluatorParseParams & {
    parsed?: JsonObject;
};
export type PluginResponseHandlerFieldEvaluatorHandleResult = {
    effect?: {
        patch?: JsonObject;
        preempt?: {
            mode: "ack-and-stop" | "ignore" | "direct-reply";
            reason: string;
        };
        debug?: string[];
    };
};
export type PluginLifecycleCallParams = CapabilityEndpointSelection & {
    moduleId: string;
    hook: RemotePluginLifecycleHook;
    config?: Record<string, string>;
    context?: JsonObject;
    traceSessionId?: string;
};
export type PluginLifecycleCallResult = {
    ok: boolean;
};
export type PluginHandleEventParams = CapabilityEndpointSelection & {
    moduleId: string;
    eventName: string;
    payload?: JsonObject;
    traceSessionId?: string;
};
export type PluginHandleEventResult = {
    handled: boolean;
};
export type PluginInvokeModelParams = CapabilityEndpointSelection & {
    moduleId: string;
    modelType: string;
    params?: JsonValue;
    traceSessionId?: string;
};
export type PluginInvokeModelResult = {
    result: JsonValue;
};
export type PluginCallServiceParams = CapabilityEndpointSelection & {
    moduleId: string;
    serviceType: string;
    method: string;
    args?: JsonValue[];
    traceSessionId?: string;
};
export type PluginCallServiceResult = {
    result?: JsonValue;
};
export type PluginCallAppBridgeParams = CapabilityEndpointSelection & {
    moduleId: string;
    hook: RemotePluginAppBridgeHook;
    context?: JsonObject;
    traceSessionId?: string;
};
export type PluginCallAppBridgeResult = {
    result?: JsonValue;
};
export interface FileCapability {
    list(params?: FileListParams): Promise<FileListResult>;
    readText(params: FileReadTextParams): Promise<FileReadTextResult>;
    writeText(params: FileWriteTextParams): Promise<FileWriteTextResult>;
}
export interface TerminalCapability {
    runCommand(params: TerminalRunParams): Promise<TerminalRunResult>;
}
export interface GitCapability {
    status(params: GitStatusParams): Promise<GitStatusResult>;
    diff(params: GitDiffParams): Promise<GitDiffResult>;
    commandRun(params: GitCommandRunParams): Promise<GitCommandRunResult>;
}
export interface LocalModelCapability {
    status(params?: LocalModelStatusParams): Promise<LocalModelStatusResult>;
}
export interface RemotePluginCapability {
    listModules(params?: PluginListModulesParams): Promise<PluginListModulesResult>;
    invokeAction(params: PluginInvokeActionParams): Promise<PluginInvokeActionResult>;
    getProvider(params: PluginGetProviderParams): Promise<PluginGetProviderResult>;
    callRoute(params: PluginCallRouteParams): Promise<PluginCallRouteResult>;
    getAsset(params: PluginGetAssetParams): Promise<PluginGetAssetResult>;
    shouldRunEvaluator(params: PluginEvaluatorShouldRunParams): Promise<PluginEvaluatorShouldRunResult>;
    prepareEvaluator(params: PluginEvaluatorPrepareParams): Promise<PluginEvaluatorPrepareResult>;
    promptEvaluator(params: PluginEvaluatorPromptParams): Promise<PluginEvaluatorPromptResult>;
    processEvaluator(params: PluginEvaluatorProcessParams): Promise<PluginEvaluatorProcessResult>;
    shouldRunResponseHandlerEvaluator(params: PluginResponseHandlerEvaluatorShouldRunParams): Promise<PluginResponseHandlerEvaluatorShouldRunResult>;
    evaluateResponseHandlerEvaluator(params: PluginResponseHandlerEvaluatorEvaluateParams): Promise<PluginResponseHandlerEvaluatorEvaluateResult>;
    shouldRunResponseHandlerFieldEvaluator(params: PluginResponseHandlerFieldEvaluatorShouldRunParams): Promise<PluginResponseHandlerFieldEvaluatorShouldRunResult>;
    parseResponseHandlerFieldEvaluator(params: PluginResponseHandlerFieldEvaluatorParseParams): Promise<PluginResponseHandlerFieldEvaluatorParseResult>;
    handleResponseHandlerFieldEvaluator(params: PluginResponseHandlerFieldEvaluatorHandleParams): Promise<PluginResponseHandlerFieldEvaluatorHandleResult>;
    callLifecycle(params: PluginLifecycleCallParams): Promise<PluginLifecycleCallResult>;
    handleEvent(params: PluginHandleEventParams): Promise<PluginHandleEventResult>;
    invokeModel(params: PluginInvokeModelParams): Promise<PluginInvokeModelResult>;
    callService(params: PluginCallServiceParams): Promise<PluginCallServiceResult>;
    callAppBridge(params: PluginCallAppBridgeParams): Promise<PluginCallAppBridgeResult>;
}
export interface ElizaCapabilityRouter {
    readonly environment: CapabilityEnvironment;
    availability(): Promise<CapabilityAvailability>;
    readonly fs: FileCapability;
    readonly pty: TerminalCapability;
    readonly git: GitCapability;
    readonly model: LocalModelCapability;
    readonly plugin: RemotePluginCapability;
}
export declare const CAPABILITY_ROUTER_PROTOCOL_FIXTURE_VERSION: "2026-05-19";
export declare const CAPABILITY_ROUTER_PROTOCOL_FIXTURE: {
    readonly availability: {
        readonly environment: "server";
        readonly available: true;
        readonly capabilities: {
            readonly fs: false;
            readonly pty: false;
            readonly git: false;
            readonly model: false;
            readonly plugin: true;
        };
    };
    readonly module: {
        readonly id: "fixture-remote-plugin";
        readonly name: "@remote/fixture-plugin";
        readonly version: "1.0.0";
        readonly description: "Canonical capability-router remote plugin fixture.";
        readonly priority: 25;
        readonly contexts: ["developer", "remote-fixture"];
        readonly config: {
            readonly fixtureMode: true;
        };
        readonly schema: {
            readonly remote_fixture_records: {
                readonly id: "uuid";
                readonly label: "text";
            };
        };
        readonly actions: [{
            readonly name: "FIXTURE_ACTION";
            readonly description: "Exercise a remote action through the protocol.";
        }];
        readonly providers: [{
            readonly name: "FIXTURE_CONTEXT";
            readonly description: "Exercise a remote provider through the protocol.";
        }];
        readonly evaluators: [{
            readonly name: "FIXTURE_EVALUATOR";
            readonly description: "Exercise a remote evaluator through the protocol.";
            readonly prompt: "Evaluate the fixture response.";
            readonly schema: {
                readonly type: "object";
            };
            readonly hasPrepare: true;
            readonly hasProcessor: true;
        }];
        readonly responseHandlerEvaluators: [{
            readonly name: "FIXTURE_RESPONSE_EVALUATOR";
            readonly description: "Exercise a response-handler evaluator.";
        }];
        readonly responseHandlerFieldEvaluators: [{
            readonly name: "FIXTURE_FIELD_EVALUATOR";
            readonly description: "Exercise a response-handler field evaluator.";
            readonly schema: {
                readonly type: "object";
            };
            readonly hasParse: true;
            readonly hasHandle: true;
        }];
        readonly events: [{
            readonly eventName: "fixture.event";
        }];
        readonly models: [{
            readonly modelType: "TEXT_SMALL";
            readonly priority: 1;
        }];
        readonly services: [{
            readonly serviceType: "fixture-service";
            readonly capabilityDescription: "Fixture remote service.";
            readonly methods: ["ping"];
            readonly config: {
                readonly fixture: true;
            };
        }];
        readonly componentTypes: [{
            readonly name: "fixture.component";
            readonly schema: {
                readonly type: "object";
                readonly properties: {
                    readonly label: {
                        readonly type: "string";
                        readonly description: "Fixture label.";
                    };
                    readonly count: {
                        readonly type: "number";
                    };
                };
                readonly required: ["label"];
            };
        }];
        readonly widgets: [{
            readonly id: "fixture-widget";
            readonly slot: "chat-sidebar";
            readonly label: "Fixture Widget";
            readonly componentExport: "FixtureWidget";
        }];
        readonly app: {
            readonly displayName: "Fixture Remote App";
            readonly category: "developer";
            readonly launchType: "remote";
            readonly launchUrl: "https://fixture.example.test/app";
            readonly viewer: {
                readonly url: "https://fixture.example.test/viewer";
                readonly postMessageAuth: true;
            };
            readonly session: {
                readonly mode: "spectate-and-steer";
                readonly features: ["commands", "telemetry"];
            };
            readonly navTabs: [{
                readonly id: "fixture-tab";
                readonly label: "Fixture";
                readonly path: "/apps/fixture";
                readonly componentExport: "FixtureTab";
            }];
        };
        readonly appBridge: {
            readonly hooks: ["prepareLaunch", "handleAppRoutes"];
        };
        readonly lifecycle: {
            readonly hooks: ["init", "dispose", "applyConfig"];
        };
        readonly routes: [{
            readonly method: "POST";
            readonly path: "/fixture/route";
            readonly public: true;
            readonly name: "fixture-route";
            readonly publicReason: "Capability-router fixture route is unauthenticated test transport.";
        }];
        readonly views: [{
            readonly id: "fixture.view";
            readonly label: "Fixture View";
            readonly viewType: "gui";
            readonly bundlePath: "/assets/fixture-view.js";
            readonly contentType: "text/javascript";
        }];
        readonly provenance: {
            readonly issuer: "fixture-build";
            readonly subject: "fixture://remote-plugin";
            readonly digestSha256: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            readonly signatureAlgorithm: "ed25519";
            readonly signature: "fixture-signature";
        };
        readonly metadata: {
            readonly fixtureVersion: "2026-05-19";
        };
    };
    readonly results: {
        readonly action: {
            readonly text: "fixture action";
            readonly data: {
                readonly fixture: true;
            };
        };
        readonly provider: {
            readonly text: "fixture provider";
            readonly values: {
                readonly fixture: true;
            };
        };
        readonly route: {
            readonly status: 209;
            readonly headers: {
                readonly "x-capability-fixture": "yes";
            };
            readonly body: {
                readonly fixtureRoute: true;
            };
        };
        readonly asset: {
            readonly path: "/assets/fixture-view.js";
            readonly contentType: "text/javascript";
            readonly bodyBase64: "ZXhwb3J0IGNvbnN0IGZpeHR1cmVWaWV3ID0gdHJ1ZTsK";
        };
        readonly model: {
            readonly result: {
                readonly text: "fixture model";
                readonly fixture: true;
            };
        };
        readonly lifecycle: {
            readonly ok: true;
        };
        readonly event: {
            readonly handled: true;
        };
        readonly service: {
            readonly result: {
                readonly text: "fixture service";
                readonly fixture: true;
            };
        };
        readonly appBridge: {
            readonly result: {
                readonly handled: true;
                readonly status: 208;
                readonly headers: {
                    readonly "x-capability-fixture-bridge": "yes";
                };
                readonly body: {
                    readonly fixtureAppBridge: true;
                };
            };
        };
        readonly evaluatorShouldRun: {
            readonly shouldRun: true;
        };
        readonly evaluatorPrepare: {
            readonly prepared: {
                readonly fixturePrepared: true;
            };
        };
        readonly evaluatorPrompt: {
            readonly prompt: "fixture evaluator prompt";
        };
        readonly evaluatorProcess: {
            readonly result: {
                readonly fixtureProcessed: true;
            };
        };
        readonly responseHandlerEvaluatorShouldRun: {
            readonly shouldRun: true;
        };
        readonly responseHandlerEvaluatorEvaluate: {
            readonly patch: {
                readonly fixtureResponsePatch: true;
            };
        };
        readonly responseHandlerFieldEvaluatorShouldRun: {
            readonly shouldRun: true;
        };
        readonly responseHandlerFieldEvaluatorParse: {
            readonly value: {
                readonly fixtureParsed: true;
            };
        };
        readonly responseHandlerFieldEvaluatorHandle: {
            readonly effect: {
                readonly patch: {
                    readonly fixtureHandled: true;
                };
                readonly debug: ["fixture field handled"];
            };
        };
    };
};
export type RuntimeBrokerCapabilityMethod = "fs.list" | "fs.readText" | "fs.writeText" | "pty.command.run" | "git.status" | "git.diff" | "git.command.run" | "model.status" | "plugin.modules.list" | "plugin.action.invoke" | "plugin.provider.get" | "plugin.route.call" | "plugin.asset.get" | "plugin.evaluator.shouldRun" | "plugin.evaluator.prepare" | "plugin.evaluator.prompt" | "plugin.evaluator.process" | "plugin.responseHandlerEvaluator.shouldRun" | "plugin.responseHandlerEvaluator.evaluate" | "plugin.responseHandlerFieldEvaluator.shouldRun" | "plugin.responseHandlerFieldEvaluator.parse" | "plugin.responseHandlerFieldEvaluator.handle" | "plugin.lifecycle.call" | "plugin.event.handle" | "plugin.model.invoke" | "plugin.service.call" | "plugin.appBridge.call";
export type RuntimeBrokerInvoke = (method: RuntimeBrokerCapabilityMethod, params?: JsonObject) => Promise<JsonValue | undefined>;
export type RuntimeBrokerCapabilityRouterOptions = {
    environment?: CapabilityEnvironment;
    invokeRuntime: RuntimeBrokerInvoke;
};
export declare class UnavailableCapabilityRouter implements ElizaCapabilityRouter {
    readonly environment: CapabilityEnvironment;
    private readonly reason;
    readonly fs: FileCapability;
    readonly pty: TerminalCapability;
    readonly git: GitCapability;
    readonly model: LocalModelCapability;
    readonly plugin: RemotePluginCapability;
    constructor(environment?: CapabilityEnvironment, reason?: string);
    availability(): Promise<CapabilityAvailability>;
    private unavailable;
}
export declare class RuntimeBrokerCapabilityRouter implements ElizaCapabilityRouter {
    readonly environment: CapabilityEnvironment;
    readonly fs: FileCapability;
    readonly pty: TerminalCapability;
    readonly git: GitCapability;
    readonly model: LocalModelCapability;
    readonly plugin: RemotePluginCapability;
    private readonly invokeRuntime;
    constructor(options: RuntimeBrokerCapabilityRouterOptions);
    availability(): Promise<CapabilityAvailability>;
    private list;
    private readText;
    private writeText;
    private runCommand;
    private gitStatus;
    private gitDiff;
    private gitCommandRun;
    private modelStatus;
    private listPluginModules;
    private invokePluginAction;
    private getPluginProvider;
    private callPluginRoute;
    private getPluginAsset;
    private shouldRunPluginEvaluator;
    private preparePluginEvaluator;
    private promptPluginEvaluator;
    private processPluginEvaluator;
    private shouldRunResponseHandlerEvaluator;
    private evaluateResponseHandlerEvaluator;
    private shouldRunResponseHandlerFieldEvaluator;
    private parseResponseHandlerFieldEvaluator;
    private handleResponseHandlerFieldEvaluator;
    private callPluginLifecycle;
    private handlePluginEvent;
    private invokePluginModel;
    private callPluginService;
    private callPluginAppBridge;
    private request;
}
export type CapabilityRuntimeLike = {
    getService(service: string): unknown;
};
export declare function getCapabilityRouter(runtime: CapabilityRuntimeLike): ElizaCapabilityRouter | null;
//# sourceMappingURL=index.d.ts.map