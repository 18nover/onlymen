/**
 * Shared app manager contracts.
 */
import curatedAppDefinitions from "@elizaos/registry/first-party/curated-app-definitions.json" with {
    type: "json"
};
import z from "zod";
// ---------------------------------------------------------------------------
// Runtime-registered curated apps — keyed on a global Symbol so the same
// store is shared across @elizaos/shared, @elizaos/app-core, and any plugin
// that wires in additional curated entries. Owning the helpers here removes
// shared's dependency on the @elizaos/core export.
// ---------------------------------------------------------------------------
const ELIZA_CURATED_APP_REGISTRY_KEY = Symbol.for("elizaos.curated-app-registry");
function getCuratedAppRegistryStore() {
    const globalObject = globalThis;
    const existing = globalObject[ELIZA_CURATED_APP_REGISTRY_KEY];
    if (existing)
        return existing;
    const created = { entries: [] };
    globalObject[ELIZA_CURATED_APP_REGISTRY_KEY] = created;
    return created;
}
function registerCoreCuratedApp(def) {
    const store = getCuratedAppRegistryStore();
    const existing = store.entries.findIndex((d) => d.slug === def.slug);
    if (existing >= 0) {
        store.entries[existing] = def;
    }
    else {
        store.entries.push(def);
    }
}
function getRegisteredCuratedApps() {
    return [...getCuratedAppRegistryStore().entries];
}
/**
 * Runtime service type under which `@elizaos/plugin-app-manager` registers its
 * app-run reader. Consumers (e.g. the agent's hosted-app session gate) query
 * `runtime.getService(APP_SESSION_SERVICE_TYPE)` instead of statically importing
 * the plugin, keeping the host→plugin dependency direction correct.
 */
export const APP_SESSION_SERVICE_TYPE = "app-session";
// ─── Zod response-tree schemas ───────────────────────────────────────────────
//
// Mirror the TS interfaces above so handlers in `packages/agent/src/api/` can
// validate / type their wire output. Schemas are co-located with the
// interfaces they mirror; bidirectional `extends` checks at the bottom of
// this section assert structural equivalence at compile time so drift in
// either direction breaks the build.
//
// Recursive `AppSessionJsonValueSchema` uses `z.lazy()`. Where the original
// interface declared `?: T` for an optional field, the schema uses
// `.optional()` (TypeScript treats `?: T` and `T | undefined` as equivalent
// for structural typing). Where the interface declared `T | null`, the
// schema uses `z.union([..., z.null()])` rather than `.nullable()` (zod 4
// inference quirk noted in the project memory).
const AppSessionModeEnum = z.enum(["viewer", "spectate-and-steer", "external"]);
const AppSessionControlActionEnum = z.enum(["pause", "resume"]);
const AppRunViewerAttachmentEnum = z.enum([
    "attached",
    "detached",
    "unavailable",
]);
const AppRunHealthStateEnum = z.union([
    z.literal("healthy"),
    z.literal("degraded"),
    z.literal("offline"),
]);
const AppRunCapabilityAvailabilityEnum = z.enum([
    "available",
    "unavailable",
    "unknown",
]);
const AppRunEventKindEnum = z.enum([
    "launch",
    "refresh",
    "attach",
    "detach",
    "stop",
    "status",
    "summary",
    "health",
]);
const AppRunEventSeverityEnum = z.enum(["info", "warning", "error"]);
const AppLaunchDiagnosticSeverityEnum = z.enum(["info", "warning", "error"]);
const AppSessionActivitySeverityEnum = z.enum(["info", "warning", "error"]);
const AppRunHealthFacetStateEnum = z.enum([
    "healthy",
    "degraded",
    "offline",
    "unknown",
]);
export const AppSessionJsonValueSchema = z.lazy(() => z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(AppSessionJsonValueSchema),
    z.record(z.string(), AppSessionJsonValueSchema),
]));
export const AppViewerAuthMessageSchema = z.object({
    type: z.string(),
    authToken: z.string().optional(),
    characterId: z.string().optional(),
    sessionToken: z.string().optional(),
    agentId: z.string().optional(),
    followEntity: z.string().optional(),
});
export const AppViewerConfigSchema = z.object({
    url: z.string(),
    embedParams: z.record(z.string(), z.string()).optional(),
    postMessageAuth: z.boolean().optional(),
    sandbox: z.string().optional(),
    authMessage: AppViewerAuthMessageSchema.optional(),
});
export const AppSessionRecommendationSchema = z.object({
    id: z.string(),
    label: z.string(),
    type: z.string().optional(),
    reason: z.union([z.string(), z.null()]).optional(),
    priority: z.union([z.number(), z.null()]).optional(),
    command: z.union([z.string(), z.null()]).optional(),
});
export const AppSessionActivityItemSchema = z.object({
    id: z.string(),
    type: z.string(),
    message: z.string(),
    timestamp: z.union([z.number(), z.null()]).optional(),
    severity: AppSessionActivitySeverityEnum.optional(),
});
export const AppSessionStateSchema = z.object({
    sessionId: z.string(),
    appName: z.string(),
    mode: AppSessionModeEnum,
    status: z.string(),
    displayName: z.string().optional(),
    agentId: z.string().optional(),
    characterId: z.string().optional(),
    followEntity: z.string().optional(),
    canSendCommands: z.boolean().optional(),
    controls: z.array(AppSessionControlActionEnum).optional(),
    summary: z.union([z.string(), z.null()]).optional(),
    goalLabel: z.union([z.string(), z.null()]).optional(),
    suggestedPrompts: z.array(z.string()).optional(),
    recommendations: z.array(AppSessionRecommendationSchema).optional(),
    activity: z.array(AppSessionActivityItemSchema).optional(),
    telemetry: z
        .union([z.record(z.string(), AppSessionJsonValueSchema), z.null()])
        .optional(),
});
export const AppRunHealthSchema = z.object({
    state: AppRunHealthStateEnum,
    message: z.union([z.string(), z.null()]),
});
export const AppRunHealthFacetSchema = z.object({
    state: AppRunHealthFacetStateEnum,
    message: z.union([z.string(), z.null()]),
});
export const AppRunHealthDetailsSchema = z.object({
    checkedAt: z.union([z.string(), z.null()]),
    auth: AppRunHealthFacetSchema,
    runtime: AppRunHealthFacetSchema,
    viewer: AppRunHealthFacetSchema,
    chat: AppRunHealthFacetSchema,
    control: AppRunHealthFacetSchema,
    message: z.union([z.string(), z.null()]),
});
export const AppRunEventSchema = z.object({
    eventId: z.string(),
    kind: AppRunEventKindEnum,
    severity: AppRunEventSeverityEnum,
    message: z.string(),
    createdAt: z.string(),
    status: z.union([z.string(), z.null()]).optional(),
    details: z
        .union([z.record(z.string(), AppSessionJsonValueSchema), z.null()])
        .optional(),
});
export const AppRunAwaySummarySchema = z.object({
    generatedAt: z.string(),
    message: z.string(),
    eventCount: z.number(),
    since: z.union([z.string(), z.null()]),
    until: z.union([z.string(), z.null()]),
});
export const AppRunSummarySchema = z.object({
    runId: z.string(),
    appName: z.string(),
    displayName: z.string(),
    pluginName: z.string(),
    launchType: z.string(),
    launchUrl: z.union([z.string(), z.null()]),
    viewer: z.union([AppViewerConfigSchema, z.null()]),
    session: z.union([AppSessionStateSchema, z.null()]),
    characterId: z.union([z.string(), z.null()]),
    agentId: z.union([z.string(), z.null()]),
    status: z.string(),
    summary: z.union([z.string(), z.null()]),
    startedAt: z.string(),
    updatedAt: z.string(),
    lastHeartbeatAt: z.union([z.string(), z.null()]),
    supportsBackground: z.boolean(),
    supportsViewerDetach: z.boolean(),
    chatAvailability: AppRunCapabilityAvailabilityEnum,
    controlAvailability: AppRunCapabilityAvailabilityEnum,
    viewerAttachment: AppRunViewerAttachmentEnum,
    recentEvents: z.array(AppRunEventSchema),
    awaySummary: z.union([AppRunAwaySummarySchema, z.null()]),
    health: AppRunHealthSchema,
    healthDetails: AppRunHealthDetailsSchema,
});
export const AppLaunchDiagnosticSchema = z.object({
    code: z.string(),
    severity: AppLaunchDiagnosticSeverityEnum,
    message: z.string(),
});
export const AppLaunchResultSchema = z.object({
    pluginInstalled: z.boolean(),
    needsRestart: z.boolean(),
    displayName: z.string(),
    launchType: z.string(),
    launchUrl: z.union([z.string(), z.null()]),
    viewer: z.union([AppViewerConfigSchema, z.null()]),
    session: z.union([AppSessionStateSchema, z.null()]),
    run: z.union([AppRunSummarySchema, z.null()]),
    diagnostics: z.array(AppLaunchDiagnosticSchema).optional(),
});
export const AppStopResultSchema = z.object({
    success: z.boolean(),
    appName: z.string(),
    runId: z.union([z.string(), z.null()]),
    stoppedAt: z.string(),
    pluginUninstalled: z.boolean(),
    needsRestart: z.boolean(),
    stopScope: z.union([
        z.literal("plugin-uninstalled"),
        z.literal("viewer-session"),
        z.literal("nothing-stopped"),
    ]),
    message: z.string(),
});
/**
 * /relaunch returns `{ launch, verify }` — `launch` is an AppLaunchResult,
 * `verify` is the verdict from `AppVerificationService.verifyApp` (or null
 * if the caller did not request post-launch verification).
 */
export const AppVerifyResultSchema = z.object({
    verdict: z.string(),
    retryablePromptForChild: z.string().optional(),
});
export const PostRelaunchAppResponseSchema = z.object({
    launch: AppLaunchResultSchema,
    verify: z.union([AppVerifyResultSchema, z.null()]),
});
const _alignAppViewerAuthMessage = true;
const _alignAppViewerConfig = true;
const _alignAppSessionRecommendation = true;
const _alignAppSessionActivityItem = true;
const _alignAppSessionState = true;
const _alignAppRunHealth = true;
const _alignAppRunHealthFacet = true;
const _alignAppRunHealthDetails = true;
const _alignAppRunEvent = true;
const _alignAppRunAwaySummary = true;
const _alignAppRunSummary = true;
const _alignAppLaunchDiagnostic = true;
const _alignAppLaunchResult = true;
const _alignAppStopResult = true;
function packageNameToBasename(packageName) {
    return packageName
        .trim()
        .replace(/^@[^/]+\//, "")
        .trim();
}
// Materialized from the first-party registry. The curated-app set is derived at
// registry build time from each plugin's `registry-entry.json` `curatedApp`
// marker (slug + order + aliases) and emitted as a small, browser-safe JSON. To
// add/change a curated app, edit the owning plugin's registry-entry.json and run
// `bun run --cwd packages/registry generate:first-party` — do NOT hand-edit this
// list. Registration is plugin-side; see packages/registry/src/first-party/.
export const ELIZA_CURATED_APP_DEFINITIONS = curatedAppDefinitions;
function getElizaCuratedAppMatchKeys(definition) {
    const keys = new Set([
        definition.slug.trim().toLowerCase(),
        definition.canonicalName.trim().toLowerCase(),
    ]);
    for (const alias of definition.aliases) {
        const trimmed = alias.trim().toLowerCase();
        if (!trimmed)
            continue;
        keys.add(trimmed);
        const routeSlug = packageNameToAppRouteSlug(alias)?.trim().toLowerCase();
        if (routeSlug) {
            keys.add(routeSlug);
        }
    }
    const canonicalRouteSlug = packageNameToAppRouteSlug(definition.canonicalName)
        ?.trim()
        .toLowerCase();
    if (canonicalRouteSlug) {
        keys.add(canonicalRouteSlug);
    }
    return Array.from(keys);
}
const ELIZA_CURATED_APP_DEFINITION_BY_KEY = new Map(ELIZA_CURATED_APP_DEFINITIONS.flatMap((definition) => getElizaCuratedAppMatchKeys(definition).map((key) => [key, definition])));
export function packageNameToAppRouteSlug(packageName) {
    const basename = packageNameToBasename(packageName);
    if (!basename)
        return null;
    const withoutPrefix = basename.replace(/^(app|plugin)-/, "").trim();
    return withoutPrefix || basename;
}
export function packageNameToAppDisplayName(packageName) {
    const slug = packageNameToAppRouteSlug(packageName) ??
        packageNameToBasename(packageName);
    return slug
        .split(/[^a-zA-Z0-9]+/)
        .filter((part) => part.length > 0)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
export function hasAppInterface(value) {
    return Boolean(value && (value.kind === "app" || value.appMeta));
}
export function getElizaCuratedAppDefinition(value) {
    const trimmed = value.trim();
    if (!trimmed)
        return null;
    const directMatch = ELIZA_CURATED_APP_DEFINITION_BY_KEY.get(trimmed.toLowerCase());
    if (directMatch) {
        return directMatch;
    }
    const routeSlug = packageNameToAppRouteSlug(trimmed)?.trim().toLowerCase();
    if (!routeSlug) {
        return null;
    }
    return ELIZA_CURATED_APP_DEFINITION_BY_KEY.get(routeSlug) ?? null;
}
export function normalizeElizaCuratedAppName(value) {
    return getElizaCuratedAppDefinition(value)?.canonicalName ?? null;
}
export function isElizaCuratedAppName(value) {
    return normalizeElizaCuratedAppName(value) !== null;
}
// ---------------------------------------------------------------------------
// Curated app registry — allows plugins to register additional curated app
// definitions at runtime without modifying the hardcoded list.
// ---------------------------------------------------------------------------
/**
 * Register an additional curated app definition at runtime.
 * Plugins should call this during initialization to add their app to the
 * curated catalog.
 */
export function registerCuratedApp(def) {
    registerCoreCuratedApp(def);
    // Rebuild the lookup map so runtime-registered apps are discoverable
    _rebuildCuratedAppLookup();
}
/**
 * Get all curated app definitions: hardcoded list merged with
 * runtime-registered apps. Runtime registrations with the same slug
 * override hardcoded entries.
 */
export function getCuratedAppDefinitions() {
    const merged = new Map();
    for (const def of ELIZA_CURATED_APP_DEFINITIONS) {
        merged.set(def.slug, def);
    }
    for (const def of getRegisteredCuratedApps()) {
        merged.set(def.slug, def);
    }
    return Array.from(merged.values());
}
function _rebuildCuratedAppLookup() {
    // Add registered apps to the mutable lookup map
    for (const def of getRegisteredCuratedApps()) {
        for (const key of getElizaCuratedAppMatchKeys(def)) {
            ELIZA_CURATED_APP_DEFINITION_BY_KEY.set(key, def);
        }
    }
}
export function getElizaCuratedAppCatalogOrder(value) {
    const canonicalName = normalizeElizaCuratedAppName(value);
    if (!canonicalName) {
        return Number.MAX_SAFE_INTEGER;
    }
    const index = ELIZA_CURATED_APP_DEFINITIONS.findIndex((definition) => definition.canonicalName === canonicalName);
    return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}
export function getElizaCuratedAppLookupNames(value) {
    const definition = getElizaCuratedAppDefinition(value);
    if (!definition) {
        const trimmed = value.trim();
        return trimmed ? [trimmed] : [];
    }
    return Array.from(new Set([
        definition.canonicalName,
        ...definition.aliases,
        definition.slug,
        ...definition.aliases
            .map((alias) => packageNameToAppRouteSlug(alias))
            .filter((alias) => Boolean(alias)),
        packageNameToAppRouteSlug(definition.canonicalName) ?? definition.slug,
    ]));
}
//# sourceMappingURL=apps.js.map