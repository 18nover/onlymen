/**
 * Shared app manager contracts.
 */
import type { IAgentRuntime, ViewKind } from "@elizaos/core";
import z from "zod";
export type AppSessionMode = "viewer" | "spectate-and-steer" | "external";
export type AppSessionFeature = "commands" | "telemetry" | "pause" | "resume" | "suggestions";
export type AppSessionControlAction = "pause" | "resume";
export type AppRunViewerAttachment = "attached" | "detached" | "unavailable";
export type AppRunHealthState = "healthy" | "degraded" | "offline";
export type AppRunCapabilityAvailability = "available" | "unavailable" | "unknown";
export type AppRunEventKind = "launch" | "refresh" | "attach" | "detach" | "stop" | "status" | "summary" | "health";
export type AppRunEventSeverity = "info" | "warning" | "error";
export type AppSessionJsonValue = string | number | boolean | null | AppSessionJsonValue[] | {
    [key: string]: AppSessionJsonValue;
};
export interface AppViewerAuthMessage {
    type: string;
    authToken?: string;
    characterId?: string;
    sessionToken?: string;
    agentId?: string;
    followEntity?: string;
}
export interface AppSessionRecommendation {
    id: string;
    label: string;
    type?: string;
    reason?: string | null;
    priority?: number | null;
    command?: string | null;
}
export interface AppSessionActivityItem {
    id: string;
    type: string;
    message: string;
    timestamp?: number | null;
    severity?: "info" | "warning" | "error";
}
export interface AppViewerConfig {
    url: string;
    embedParams?: Record<string, string>;
    postMessageAuth?: boolean;
    sandbox?: string;
    authMessage?: AppViewerAuthMessage;
}
export interface AppSessionConfig {
    mode: AppSessionMode;
    features?: AppSessionFeature[];
}
export interface AppUiExtensionConfig {
    detailPanelId: string;
}
export interface RegistryAppSupports {
    v0: boolean;
    v1: boolean;
    v2: boolean;
}
export interface RegistryAppNpmInfo {
    package: string;
    v0Version: string | null;
    v1Version: string | null;
    v2Version: string | null;
}
export interface RegistryAppInfo {
    name: string;
    displayName: string;
    description: string;
    category: string;
    launchType: string;
    launchUrl: string | null;
    icon: string | null;
    /**
     * Absolute or app-scoped URL to a large hero image (ideally a 1024×1024
     * square webp) used as the card background on the apps page. Apps declare
     * this in their `package.json` under `elizaos.app.heroImage` as a path
     * relative to the package root; the runtime rewrites app hero requests
     * through `/api/apps/hero/<slug>` and will synthesize generated artwork
     * there when the app does not ship a dedicated hero asset.
     */
    heroImage: string | null;
    capabilities: string[];
    stars: number;
    repository: string;
    latestVersion: string | null;
    supports: RegistryAppSupports;
    npm: RegistryAppNpmInfo;
    directory?: string | null;
    registryKind?: string;
    origin?: "builtin" | "third-party" | string;
    source?: string;
    support?: "first-party" | "community" | string;
    builtIn?: boolean;
    firstParty?: boolean;
    thirdParty?: boolean;
    status?: string;
    uiExtension?: AppUiExtensionConfig;
    viewer?: Omit<AppViewerConfig, "authMessage">;
    session?: AppSessionConfig;
    /**
     * If true, the app is a developer-tooling surface and is hidden from the
     * main UI unless Developer Mode is enabled in Settings. Equivalent to
     * `viewKind: "developer"`.
     */
    developerOnly?: boolean;
    /**
     * Four-tier visibility category. Supersedes `developerOnly` when set:
     * `system`/`release` always show; `developer`/`preview` follow Settings
     * toggles. See `ViewKind` in `@elizaos/core`.
     */
    viewKind?: ViewKind;
    /**
     * Controls whether the app appears in the user-facing app store/catalog.
     * Defaults to true. Set to false for apps that auto-install or are surfaced
     * only via direct deep-links.
     */
    visibleInAppStore?: boolean;
    /**
     * If true, the app declares itself as the default landing tab. Exactly one
     * installed app should set this. Sourced from `package.json` →
     * `elizaos.app.mainTab`. Consumed by `getMainTabApp()` in `@elizaos/app-core`
     * to compute the shell's landing tab at boot.
     */
    mainTab?: boolean;
    /**
     * Declared home section for the app catalog, sourced from `package.json` →
     * `elizaos.app.catalogSection`. One of the concrete catalog sections
     * (`games` | `developerUtilities` | `finance` | `other`). When absent, the
     * section is derived from `category` and keyword heuristics. The dynamic
     * `featured` / `favorites` sections are never declared here (they are
     * computed from `featured` and the user's starred apps).
     */
    catalogSection?: string;
    /**
     * If true, the app is promoted into the Featured catalog section. Sourced
     * from `elizaos.app.featured`. Featured is presentational only — it does not
     * make an otherwise-hidden app appear.
     */
    featured?: boolean;
    /**
     * If true, the app is hidden from the catalog by default and only surfaces
     * when explicitly configured as a default app, or — for `scope: "wallet"`
     * apps — when the wallet is enabled. Sourced from `elizaos.app.defaultHidden`.
     */
    defaultHidden?: boolean;
    /**
     * Capability scope that gates default visibility. `"wallet"` apps are
     * revealed when the wallet is enabled. Sourced from `elizaos.app.scope`.
     */
    scope?: string;
}
export interface AppSessionState {
    sessionId: string;
    appName: string;
    mode: AppSessionMode;
    status: string;
    displayName?: string;
    agentId?: string;
    characterId?: string;
    followEntity?: string;
    canSendCommands?: boolean;
    controls?: AppSessionControlAction[];
    summary?: string | null;
    goalLabel?: string | null;
    suggestedPrompts?: string[];
    recommendations?: AppSessionRecommendation[];
    activity?: AppSessionActivityItem[];
    telemetry?: Record<string, AppSessionJsonValue> | null;
}
export interface AppSessionActionResult {
    success: boolean;
    message: string;
    session?: AppSessionState | null;
}
export interface AppRunHealth {
    state: AppRunHealthState;
    message: string | null;
}
export interface AppRunHealthFacet {
    state: AppRunHealthState | "unknown";
    message: string | null;
}
export interface AppRunHealthDetails {
    checkedAt: string | null;
    auth: AppRunHealthFacet;
    runtime: AppRunHealthFacet;
    viewer: AppRunHealthFacet;
    chat: AppRunHealthFacet;
    control: AppRunHealthFacet;
    message: string | null;
}
export interface AppRunEvent {
    eventId: string;
    kind: AppRunEventKind;
    severity: AppRunEventSeverity;
    message: string;
    createdAt: string;
    status?: string | null;
    details?: Record<string, AppSessionJsonValue> | null;
}
export interface AppRunAwaySummary {
    generatedAt: string;
    message: string;
    eventCount: number;
    since: string | null;
    until: string | null;
}
export interface AppRunSummary {
    runId: string;
    appName: string;
    displayName: string;
    pluginName: string;
    launchType: string;
    launchUrl: string | null;
    viewer: AppViewerConfig | null;
    session: AppSessionState | null;
    characterId: string | null;
    agentId: string | null;
    status: string;
    summary: string | null;
    startedAt: string;
    updatedAt: string;
    lastHeartbeatAt: string | null;
    supportsBackground: boolean;
    supportsViewerDetach: boolean;
    chatAvailability: AppRunCapabilityAvailability;
    controlAvailability: AppRunCapabilityAvailability;
    viewerAttachment: AppRunViewerAttachment;
    recentEvents: AppRunEvent[];
    awaySummary: AppRunAwaySummary | null;
    health: AppRunHealth;
    healthDetails: AppRunHealthDetails;
}
export interface AppRunActionResult {
    success: boolean;
    message: string;
    run?: AppRunSummary | null;
}
/**
 * Runtime service type under which `@elizaos/plugin-app-manager` registers its
 * app-run reader. Consumers (e.g. the agent's hosted-app session gate) query
 * `runtime.getService(APP_SESSION_SERVICE_TYPE)` instead of statically importing
 * the plugin, keeping the host→plugin dependency direction correct.
 */
export declare const APP_SESSION_SERVICE_TYPE = "app-session";
/**
 * Contract for the app-session runtime service. Exposes the current AppManager
 * run snapshot so gate logic can decide whether a hosted app is active without
 * reaching into the plugin's on-disk store directly.
 */
export interface AppSessionServiceLike {
    /** Current AppManager run snapshot (unfiltered; callers apply status logic). */
    getRuns(): AppRunSummary[];
}
export type AppLaunchDiagnosticSeverity = "info" | "warning" | "error";
export interface AppLaunchDiagnostic {
    code: string;
    severity: AppLaunchDiagnosticSeverity;
    message: string;
}
export interface AppLaunchPreparation {
    diagnostics?: AppLaunchDiagnostic[];
    launchUrl?: string | null;
    viewer?: Omit<AppViewerConfig, "authMessage"> | null;
    skipRuntimePluginRegistration?: boolean;
}
export interface AppLaunchResult {
    pluginInstalled: boolean;
    needsRestart: boolean;
    displayName: string;
    launchType: string;
    launchUrl: string | null;
    viewer: AppViewerConfig | null;
    session: AppSessionState | null;
    run: AppRunSummary | null;
    diagnostics?: AppLaunchDiagnostic[];
}
/** Context available during app launch (before a run is started). */
export interface AppLaunchSessionContext {
    appName: string;
    launchUrl: string | null;
    runtime: IAgentRuntime | null;
    viewer: AppLaunchResult["viewer"] | null;
}
/** Context available during an active app run. */
export interface AppRunSessionContext extends AppLaunchSessionContext {
    runId?: string;
    session: AppSessionState | null;
}
export interface InstalledAppInfo {
    name: string;
    displayName: string;
    pluginName: string;
    version: string;
    installedAt: string;
}
export interface ElizaCuratedAppDefinition {
    slug: string;
    canonicalName: string;
    aliases: string[];
}
export interface AppStopResult {
    success: boolean;
    appName: string;
    runId: string | null;
    stoppedAt: string;
    pluginUninstalled: boolean;
    needsRestart: boolean;
    stopScope: "plugin-uninstalled" | "viewer-session" | "nothing-stopped";
    message: string;
}
export declare const AppSessionJsonValueSchema: z.ZodType<AppSessionJsonValue>;
export declare const AppViewerAuthMessageSchema: z.ZodObject<{
    type: z.ZodString;
    authToken: z.ZodOptional<z.ZodString>;
    characterId: z.ZodOptional<z.ZodString>;
    sessionToken: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
    followEntity: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const AppViewerConfigSchema: z.ZodObject<{
    url: z.ZodString;
    embedParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    postMessageAuth: z.ZodOptional<z.ZodBoolean>;
    sandbox: z.ZodOptional<z.ZodString>;
    authMessage: z.ZodOptional<z.ZodObject<{
        type: z.ZodString;
        authToken: z.ZodOptional<z.ZodString>;
        characterId: z.ZodOptional<z.ZodString>;
        sessionToken: z.ZodOptional<z.ZodString>;
        agentId: z.ZodOptional<z.ZodString>;
        followEntity: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const AppSessionRecommendationSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    type: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
    priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
    command: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
}, z.core.$strip>;
export declare const AppSessionActivityItemSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    message: z.ZodString;
    timestamp: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
    severity: z.ZodOptional<z.ZodEnum<{
        info: "info";
        warning: "warning";
        error: "error";
    }>>;
}, z.core.$strip>;
export declare const AppSessionStateSchema: z.ZodObject<{
    sessionId: z.ZodString;
    appName: z.ZodString;
    mode: z.ZodEnum<{
        viewer: "viewer";
        "spectate-and-steer": "spectate-and-steer";
        external: "external";
    }>;
    status: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    agentId: z.ZodOptional<z.ZodString>;
    characterId: z.ZodOptional<z.ZodString>;
    followEntity: z.ZodOptional<z.ZodString>;
    canSendCommands: z.ZodOptional<z.ZodBoolean>;
    controls: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        pause: "pause";
        resume: "resume";
    }>>>;
    summary: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
    goalLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
    suggestedPrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
    recommendations: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        type: z.ZodOptional<z.ZodString>;
        reason: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
        command: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
    }, z.core.$strip>>>;
    activity: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        message: z.ZodString;
        timestamp: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
        severity: z.ZodOptional<z.ZodEnum<{
            info: "info";
            warning: "warning";
            error: "error";
        }>>;
    }, z.core.$strip>>>;
    telemetry: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
}, z.core.$strip>;
export declare const AppRunHealthSchema: z.ZodObject<{
    state: z.ZodUnion<readonly [z.ZodLiteral<"healthy">, z.ZodLiteral<"degraded">, z.ZodLiteral<"offline">]>;
    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strip>;
export declare const AppRunHealthFacetSchema: z.ZodObject<{
    state: z.ZodEnum<{
        unknown: "unknown";
        healthy: "healthy";
        degraded: "degraded";
        offline: "offline";
    }>;
    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strip>;
export declare const AppRunHealthDetailsSchema: z.ZodObject<{
    checkedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    auth: z.ZodObject<{
        state: z.ZodEnum<{
            unknown: "unknown";
            healthy: "healthy";
            degraded: "degraded";
            offline: "offline";
        }>;
        message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>;
    runtime: z.ZodObject<{
        state: z.ZodEnum<{
            unknown: "unknown";
            healthy: "healthy";
            degraded: "degraded";
            offline: "offline";
        }>;
        message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>;
    viewer: z.ZodObject<{
        state: z.ZodEnum<{
            unknown: "unknown";
            healthy: "healthy";
            degraded: "degraded";
            offline: "offline";
        }>;
        message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>;
    chat: z.ZodObject<{
        state: z.ZodEnum<{
            unknown: "unknown";
            healthy: "healthy";
            degraded: "degraded";
            offline: "offline";
        }>;
        message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>;
    control: z.ZodObject<{
        state: z.ZodEnum<{
            unknown: "unknown";
            healthy: "healthy";
            degraded: "degraded";
            offline: "offline";
        }>;
        message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>;
    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strip>;
export declare const AppRunEventSchema: z.ZodObject<{
    eventId: z.ZodString;
    kind: z.ZodEnum<{
        status: "status";
        summary: "summary";
        launch: "launch";
        refresh: "refresh";
        attach: "attach";
        detach: "detach";
        stop: "stop";
        health: "health";
    }>;
    severity: z.ZodEnum<{
        info: "info";
        warning: "warning";
        error: "error";
    }>;
    message: z.ZodString;
    createdAt: z.ZodString;
    status: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
    details: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
}, z.core.$strip>;
export declare const AppRunAwaySummarySchema: z.ZodObject<{
    generatedAt: z.ZodString;
    message: z.ZodString;
    eventCount: z.ZodNumber;
    since: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    until: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
}, z.core.$strip>;
export declare const AppRunSummarySchema: z.ZodObject<{
    runId: z.ZodString;
    appName: z.ZodString;
    displayName: z.ZodString;
    pluginName: z.ZodString;
    launchType: z.ZodString;
    launchUrl: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    viewer: z.ZodUnion<readonly [z.ZodObject<{
        url: z.ZodString;
        embedParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        postMessageAuth: z.ZodOptional<z.ZodBoolean>;
        sandbox: z.ZodOptional<z.ZodString>;
        authMessage: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            authToken: z.ZodOptional<z.ZodString>;
            characterId: z.ZodOptional<z.ZodString>;
            sessionToken: z.ZodOptional<z.ZodString>;
            agentId: z.ZodOptional<z.ZodString>;
            followEntity: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodNull]>;
    session: z.ZodUnion<readonly [z.ZodObject<{
        sessionId: z.ZodString;
        appName: z.ZodString;
        mode: z.ZodEnum<{
            viewer: "viewer";
            "spectate-and-steer": "spectate-and-steer";
            external: "external";
        }>;
        status: z.ZodString;
        displayName: z.ZodOptional<z.ZodString>;
        agentId: z.ZodOptional<z.ZodString>;
        characterId: z.ZodOptional<z.ZodString>;
        followEntity: z.ZodOptional<z.ZodString>;
        canSendCommands: z.ZodOptional<z.ZodBoolean>;
        controls: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            pause: "pause";
            resume: "resume";
        }>>>;
        summary: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        goalLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        suggestedPrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            type: z.ZodOptional<z.ZodString>;
            reason: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
            command: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        }, z.core.$strip>>>;
        activity: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodString;
            message: z.ZodString;
            timestamp: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
            severity: z.ZodOptional<z.ZodEnum<{
                info: "info";
                warning: "warning";
                error: "error";
            }>>;
        }, z.core.$strip>>>;
        telemetry: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
    }, z.core.$strip>, z.ZodNull]>;
    characterId: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    agentId: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    status: z.ZodString;
    summary: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    startedAt: z.ZodString;
    updatedAt: z.ZodString;
    lastHeartbeatAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    supportsBackground: z.ZodBoolean;
    supportsViewerDetach: z.ZodBoolean;
    chatAvailability: z.ZodEnum<{
        unknown: "unknown";
        available: "available";
        unavailable: "unavailable";
    }>;
    controlAvailability: z.ZodEnum<{
        unknown: "unknown";
        available: "available";
        unavailable: "unavailable";
    }>;
    viewerAttachment: z.ZodEnum<{
        unavailable: "unavailable";
        attached: "attached";
        detached: "detached";
    }>;
    recentEvents: z.ZodArray<z.ZodObject<{
        eventId: z.ZodString;
        kind: z.ZodEnum<{
            status: "status";
            summary: "summary";
            launch: "launch";
            refresh: "refresh";
            attach: "attach";
            detach: "detach";
            stop: "stop";
            health: "health";
        }>;
        severity: z.ZodEnum<{
            info: "info";
            warning: "warning";
            error: "error";
        }>;
        message: z.ZodString;
        createdAt: z.ZodString;
        status: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        details: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
    }, z.core.$strip>>;
    awaySummary: z.ZodUnion<readonly [z.ZodObject<{
        generatedAt: z.ZodString;
        message: z.ZodString;
        eventCount: z.ZodNumber;
        since: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        until: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>, z.ZodNull]>;
    health: z.ZodObject<{
        state: z.ZodUnion<readonly [z.ZodLiteral<"healthy">, z.ZodLiteral<"degraded">, z.ZodLiteral<"offline">]>;
        message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>;
    healthDetails: z.ZodObject<{
        checkedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        auth: z.ZodObject<{
            state: z.ZodEnum<{
                unknown: "unknown";
                healthy: "healthy";
                degraded: "degraded";
                offline: "offline";
            }>;
            message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>;
        runtime: z.ZodObject<{
            state: z.ZodEnum<{
                unknown: "unknown";
                healthy: "healthy";
                degraded: "degraded";
                offline: "offline";
            }>;
            message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>;
        viewer: z.ZodObject<{
            state: z.ZodEnum<{
                unknown: "unknown";
                healthy: "healthy";
                degraded: "degraded";
                offline: "offline";
            }>;
            message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>;
        chat: z.ZodObject<{
            state: z.ZodEnum<{
                unknown: "unknown";
                healthy: "healthy";
                degraded: "degraded";
                offline: "offline";
            }>;
            message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>;
        control: z.ZodObject<{
            state: z.ZodEnum<{
                unknown: "unknown";
                healthy: "healthy";
                degraded: "degraded";
                offline: "offline";
            }>;
            message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>;
        message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const AppLaunchDiagnosticSchema: z.ZodObject<{
    code: z.ZodString;
    severity: z.ZodEnum<{
        info: "info";
        warning: "warning";
        error: "error";
    }>;
    message: z.ZodString;
}, z.core.$strip>;
export declare const AppLaunchResultSchema: z.ZodObject<{
    pluginInstalled: z.ZodBoolean;
    needsRestart: z.ZodBoolean;
    displayName: z.ZodString;
    launchType: z.ZodString;
    launchUrl: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    viewer: z.ZodUnion<readonly [z.ZodObject<{
        url: z.ZodString;
        embedParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        postMessageAuth: z.ZodOptional<z.ZodBoolean>;
        sandbox: z.ZodOptional<z.ZodString>;
        authMessage: z.ZodOptional<z.ZodObject<{
            type: z.ZodString;
            authToken: z.ZodOptional<z.ZodString>;
            characterId: z.ZodOptional<z.ZodString>;
            sessionToken: z.ZodOptional<z.ZodString>;
            agentId: z.ZodOptional<z.ZodString>;
            followEntity: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodNull]>;
    session: z.ZodUnion<readonly [z.ZodObject<{
        sessionId: z.ZodString;
        appName: z.ZodString;
        mode: z.ZodEnum<{
            viewer: "viewer";
            "spectate-and-steer": "spectate-and-steer";
            external: "external";
        }>;
        status: z.ZodString;
        displayName: z.ZodOptional<z.ZodString>;
        agentId: z.ZodOptional<z.ZodString>;
        characterId: z.ZodOptional<z.ZodString>;
        followEntity: z.ZodOptional<z.ZodString>;
        canSendCommands: z.ZodOptional<z.ZodBoolean>;
        controls: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            pause: "pause";
            resume: "resume";
        }>>>;
        summary: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        goalLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        suggestedPrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            type: z.ZodOptional<z.ZodString>;
            reason: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
            command: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
        }, z.core.$strip>>>;
        activity: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodString;
            message: z.ZodString;
            timestamp: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
            severity: z.ZodOptional<z.ZodEnum<{
                info: "info";
                warning: "warning";
                error: "error";
            }>>;
        }, z.core.$strip>>>;
        telemetry: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
    }, z.core.$strip>, z.ZodNull]>;
    run: z.ZodUnion<readonly [z.ZodObject<{
        runId: z.ZodString;
        appName: z.ZodString;
        displayName: z.ZodString;
        pluginName: z.ZodString;
        launchType: z.ZodString;
        launchUrl: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        viewer: z.ZodUnion<readonly [z.ZodObject<{
            url: z.ZodString;
            embedParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            postMessageAuth: z.ZodOptional<z.ZodBoolean>;
            sandbox: z.ZodOptional<z.ZodString>;
            authMessage: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                authToken: z.ZodOptional<z.ZodString>;
                characterId: z.ZodOptional<z.ZodString>;
                sessionToken: z.ZodOptional<z.ZodString>;
                agentId: z.ZodOptional<z.ZodString>;
                followEntity: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodNull]>;
        session: z.ZodUnion<readonly [z.ZodObject<{
            sessionId: z.ZodString;
            appName: z.ZodString;
            mode: z.ZodEnum<{
                viewer: "viewer";
                "spectate-and-steer": "spectate-and-steer";
                external: "external";
            }>;
            status: z.ZodString;
            displayName: z.ZodOptional<z.ZodString>;
            agentId: z.ZodOptional<z.ZodString>;
            characterId: z.ZodOptional<z.ZodString>;
            followEntity: z.ZodOptional<z.ZodString>;
            canSendCommands: z.ZodOptional<z.ZodBoolean>;
            controls: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                pause: "pause";
                resume: "resume";
            }>>>;
            summary: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            goalLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            suggestedPrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            recommendations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                type: z.ZodOptional<z.ZodString>;
                reason: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
                priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
                command: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            }, z.core.$strip>>>;
            activity: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodString;
                message: z.ZodString;
                timestamp: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
                severity: z.ZodOptional<z.ZodEnum<{
                    info: "info";
                    warning: "warning";
                    error: "error";
                }>>;
            }, z.core.$strip>>>;
            telemetry: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
        }, z.core.$strip>, z.ZodNull]>;
        characterId: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        agentId: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        status: z.ZodString;
        summary: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        startedAt: z.ZodString;
        updatedAt: z.ZodString;
        lastHeartbeatAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        supportsBackground: z.ZodBoolean;
        supportsViewerDetach: z.ZodBoolean;
        chatAvailability: z.ZodEnum<{
            unknown: "unknown";
            available: "available";
            unavailable: "unavailable";
        }>;
        controlAvailability: z.ZodEnum<{
            unknown: "unknown";
            available: "available";
            unavailable: "unavailable";
        }>;
        viewerAttachment: z.ZodEnum<{
            unavailable: "unavailable";
            attached: "attached";
            detached: "detached";
        }>;
        recentEvents: z.ZodArray<z.ZodObject<{
            eventId: z.ZodString;
            kind: z.ZodEnum<{
                status: "status";
                summary: "summary";
                launch: "launch";
                refresh: "refresh";
                attach: "attach";
                detach: "detach";
                stop: "stop";
                health: "health";
            }>;
            severity: z.ZodEnum<{
                info: "info";
                warning: "warning";
                error: "error";
            }>;
            message: z.ZodString;
            createdAt: z.ZodString;
            status: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            details: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
        }, z.core.$strip>>;
        awaySummary: z.ZodUnion<readonly [z.ZodObject<{
            generatedAt: z.ZodString;
            message: z.ZodString;
            eventCount: z.ZodNumber;
            since: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            until: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>, z.ZodNull]>;
        health: z.ZodObject<{
            state: z.ZodUnion<readonly [z.ZodLiteral<"healthy">, z.ZodLiteral<"degraded">, z.ZodLiteral<"offline">]>;
            message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>;
        healthDetails: z.ZodObject<{
            checkedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            auth: z.ZodObject<{
                state: z.ZodEnum<{
                    unknown: "unknown";
                    healthy: "healthy";
                    degraded: "degraded";
                    offline: "offline";
                }>;
                message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>;
            runtime: z.ZodObject<{
                state: z.ZodEnum<{
                    unknown: "unknown";
                    healthy: "healthy";
                    degraded: "degraded";
                    offline: "offline";
                }>;
                message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>;
            viewer: z.ZodObject<{
                state: z.ZodEnum<{
                    unknown: "unknown";
                    healthy: "healthy";
                    degraded: "degraded";
                    offline: "offline";
                }>;
                message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>;
            chat: z.ZodObject<{
                state: z.ZodEnum<{
                    unknown: "unknown";
                    healthy: "healthy";
                    degraded: "degraded";
                    offline: "offline";
                }>;
                message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>;
            control: z.ZodObject<{
                state: z.ZodEnum<{
                    unknown: "unknown";
                    healthy: "healthy";
                    degraded: "degraded";
                    offline: "offline";
                }>;
                message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>;
            message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        }, z.core.$strip>;
    }, z.core.$strip>, z.ZodNull]>;
    diagnostics: z.ZodOptional<z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        severity: z.ZodEnum<{
            info: "info";
            warning: "warning";
            error: "error";
        }>;
        message: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const AppStopResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    appName: z.ZodString;
    runId: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
    stoppedAt: z.ZodString;
    pluginUninstalled: z.ZodBoolean;
    needsRestart: z.ZodBoolean;
    stopScope: z.ZodUnion<readonly [z.ZodLiteral<"plugin-uninstalled">, z.ZodLiteral<"viewer-session">, z.ZodLiteral<"nothing-stopped">]>;
    message: z.ZodString;
}, z.core.$strip>;
/**
 * /relaunch returns `{ launch, verify }` — `launch` is an AppLaunchResult,
 * `verify` is the verdict from `AppVerificationService.verifyApp` (or null
 * if the caller did not request post-launch verification).
 */
export declare const AppVerifyResultSchema: z.ZodObject<{
    verdict: z.ZodString;
    retryablePromptForChild: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const PostRelaunchAppResponseSchema: z.ZodObject<{
    launch: z.ZodObject<{
        pluginInstalled: z.ZodBoolean;
        needsRestart: z.ZodBoolean;
        displayName: z.ZodString;
        launchType: z.ZodString;
        launchUrl: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
        viewer: z.ZodUnion<readonly [z.ZodObject<{
            url: z.ZodString;
            embedParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            postMessageAuth: z.ZodOptional<z.ZodBoolean>;
            sandbox: z.ZodOptional<z.ZodString>;
            authMessage: z.ZodOptional<z.ZodObject<{
                type: z.ZodString;
                authToken: z.ZodOptional<z.ZodString>;
                characterId: z.ZodOptional<z.ZodString>;
                sessionToken: z.ZodOptional<z.ZodString>;
                agentId: z.ZodOptional<z.ZodString>;
                followEntity: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        }, z.core.$strip>, z.ZodNull]>;
        session: z.ZodUnion<readonly [z.ZodObject<{
            sessionId: z.ZodString;
            appName: z.ZodString;
            mode: z.ZodEnum<{
                viewer: "viewer";
                "spectate-and-steer": "spectate-and-steer";
                external: "external";
            }>;
            status: z.ZodString;
            displayName: z.ZodOptional<z.ZodString>;
            agentId: z.ZodOptional<z.ZodString>;
            characterId: z.ZodOptional<z.ZodString>;
            followEntity: z.ZodOptional<z.ZodString>;
            canSendCommands: z.ZodOptional<z.ZodBoolean>;
            controls: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                pause: "pause";
                resume: "resume";
            }>>>;
            summary: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            goalLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            suggestedPrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
            recommendations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                label: z.ZodString;
                type: z.ZodOptional<z.ZodString>;
                reason: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
                priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
                command: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
            }, z.core.$strip>>>;
            activity: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                type: z.ZodString;
                message: z.ZodString;
                timestamp: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
                severity: z.ZodOptional<z.ZodEnum<{
                    info: "info";
                    warning: "warning";
                    error: "error";
                }>>;
            }, z.core.$strip>>>;
            telemetry: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
        }, z.core.$strip>, z.ZodNull]>;
        run: z.ZodUnion<readonly [z.ZodObject<{
            runId: z.ZodString;
            appName: z.ZodString;
            displayName: z.ZodString;
            pluginName: z.ZodString;
            launchType: z.ZodString;
            launchUrl: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            viewer: z.ZodUnion<readonly [z.ZodObject<{
                url: z.ZodString;
                embedParams: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
                postMessageAuth: z.ZodOptional<z.ZodBoolean>;
                sandbox: z.ZodOptional<z.ZodString>;
                authMessage: z.ZodOptional<z.ZodObject<{
                    type: z.ZodString;
                    authToken: z.ZodOptional<z.ZodString>;
                    characterId: z.ZodOptional<z.ZodString>;
                    sessionToken: z.ZodOptional<z.ZodString>;
                    agentId: z.ZodOptional<z.ZodString>;
                    followEntity: z.ZodOptional<z.ZodString>;
                }, z.core.$strip>>;
            }, z.core.$strip>, z.ZodNull]>;
            session: z.ZodUnion<readonly [z.ZodObject<{
                sessionId: z.ZodString;
                appName: z.ZodString;
                mode: z.ZodEnum<{
                    viewer: "viewer";
                    "spectate-and-steer": "spectate-and-steer";
                    external: "external";
                }>;
                status: z.ZodString;
                displayName: z.ZodOptional<z.ZodString>;
                agentId: z.ZodOptional<z.ZodString>;
                characterId: z.ZodOptional<z.ZodString>;
                followEntity: z.ZodOptional<z.ZodString>;
                canSendCommands: z.ZodOptional<z.ZodBoolean>;
                controls: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                    pause: "pause";
                    resume: "resume";
                }>>>;
                summary: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
                goalLabel: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
                suggestedPrompts: z.ZodOptional<z.ZodArray<z.ZodString>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    label: z.ZodString;
                    type: z.ZodOptional<z.ZodString>;
                    reason: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
                    priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
                    command: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
                }, z.core.$strip>>>;
                activity: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    type: z.ZodString;
                    message: z.ZodString;
                    timestamp: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
                    severity: z.ZodOptional<z.ZodEnum<{
                        info: "info";
                        warning: "warning";
                        error: "error";
                    }>>;
                }, z.core.$strip>>>;
                telemetry: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
            }, z.core.$strip>, z.ZodNull]>;
            characterId: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            agentId: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            status: z.ZodString;
            summary: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            startedAt: z.ZodString;
            updatedAt: z.ZodString;
            lastHeartbeatAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            supportsBackground: z.ZodBoolean;
            supportsViewerDetach: z.ZodBoolean;
            chatAvailability: z.ZodEnum<{
                unknown: "unknown";
                available: "available";
                unavailable: "unavailable";
            }>;
            controlAvailability: z.ZodEnum<{
                unknown: "unknown";
                available: "available";
                unavailable: "unavailable";
            }>;
            viewerAttachment: z.ZodEnum<{
                unavailable: "unavailable";
                attached: "attached";
                detached: "detached";
            }>;
            recentEvents: z.ZodArray<z.ZodObject<{
                eventId: z.ZodString;
                kind: z.ZodEnum<{
                    status: "status";
                    summary: "summary";
                    launch: "launch";
                    refresh: "refresh";
                    attach: "attach";
                    detach: "detach";
                    stop: "stop";
                    health: "health";
                }>;
                severity: z.ZodEnum<{
                    info: "info";
                    warning: "warning";
                    error: "error";
                }>;
                message: z.ZodString;
                createdAt: z.ZodString;
                status: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNull]>>;
                details: z.ZodOptional<z.ZodUnion<readonly [z.ZodRecord<z.ZodString, z.ZodType<AppSessionJsonValue, unknown, z.core.$ZodTypeInternals<AppSessionJsonValue, unknown>>>, z.ZodNull]>>;
            }, z.core.$strip>>;
            awaySummary: z.ZodUnion<readonly [z.ZodObject<{
                generatedAt: z.ZodString;
                message: z.ZodString;
                eventCount: z.ZodNumber;
                since: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
                until: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>, z.ZodNull]>;
            health: z.ZodObject<{
                state: z.ZodUnion<readonly [z.ZodLiteral<"healthy">, z.ZodLiteral<"degraded">, z.ZodLiteral<"offline">]>;
                message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>;
            healthDetails: z.ZodObject<{
                checkedAt: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
                auth: z.ZodObject<{
                    state: z.ZodEnum<{
                        unknown: "unknown";
                        healthy: "healthy";
                        degraded: "degraded";
                        offline: "offline";
                    }>;
                    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
                }, z.core.$strip>;
                runtime: z.ZodObject<{
                    state: z.ZodEnum<{
                        unknown: "unknown";
                        healthy: "healthy";
                        degraded: "degraded";
                        offline: "offline";
                    }>;
                    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
                }, z.core.$strip>;
                viewer: z.ZodObject<{
                    state: z.ZodEnum<{
                        unknown: "unknown";
                        healthy: "healthy";
                        degraded: "degraded";
                        offline: "offline";
                    }>;
                    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
                }, z.core.$strip>;
                chat: z.ZodObject<{
                    state: z.ZodEnum<{
                        unknown: "unknown";
                        healthy: "healthy";
                        degraded: "degraded";
                        offline: "offline";
                    }>;
                    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
                }, z.core.$strip>;
                control: z.ZodObject<{
                    state: z.ZodEnum<{
                        unknown: "unknown";
                        healthy: "healthy";
                        degraded: "degraded";
                        offline: "offline";
                    }>;
                    message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
                }, z.core.$strip>;
                message: z.ZodUnion<readonly [z.ZodString, z.ZodNull]>;
            }, z.core.$strip>;
        }, z.core.$strip>, z.ZodNull]>;
        diagnostics: z.ZodOptional<z.ZodArray<z.ZodObject<{
            code: z.ZodString;
            severity: z.ZodEnum<{
                info: "info";
                warning: "warning";
                error: "error";
            }>;
            message: z.ZodString;
        }, z.core.$strip>>>;
    }, z.core.$strip>;
    verify: z.ZodUnion<readonly [z.ZodObject<{
        verdict: z.ZodString;
        retryablePromptForChild: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodNull]>;
}, z.core.$strip>;
export type PostRelaunchAppResponse = z.infer<typeof PostRelaunchAppResponseSchema>;
export type AppVerifyResult = z.infer<typeof AppVerifyResultSchema>;
export declare const ELIZA_CURATED_APP_DEFINITIONS: readonly ElizaCuratedAppDefinition[];
export declare function packageNameToAppRouteSlug(packageName: string): string | null;
export declare function packageNameToAppDisplayName(packageName: string): string;
export declare function hasAppInterface(value: {
    kind?: string | null;
    appMeta?: unknown;
} | null | undefined): boolean;
export declare function getElizaCuratedAppDefinition(value: string): ElizaCuratedAppDefinition | null;
export declare function normalizeElizaCuratedAppName(value: string): string | null;
export declare function isElizaCuratedAppName(value: string): boolean;
/**
 * Register an additional curated app definition at runtime.
 * Plugins should call this during initialization to add their app to the
 * curated catalog.
 */
export declare function registerCuratedApp(def: ElizaCuratedAppDefinition): void;
/**
 * Get all curated app definitions: hardcoded list merged with
 * runtime-registered apps. Runtime registrations with the same slug
 * override hardcoded entries.
 */
export declare function getCuratedAppDefinitions(): ElizaCuratedAppDefinition[];
export declare function getElizaCuratedAppCatalogOrder(value: string): number;
export declare function getElizaCuratedAppLookupNames(value: string): string[];
//# sourceMappingURL=apps.d.ts.map