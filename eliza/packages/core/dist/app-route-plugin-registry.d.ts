import { type Plugin, type Route } from "./types/plugin.js";
export type AppRoutePluginLoader = () => Plugin | Promise<Plugin>;
export interface AppRoutePluginRegistryEntry {
    id: string;
    load: AppRoutePluginLoader;
}
/**
 * Canonical `Error.name` for the error an app-route plugin loader throws when
 * its plugin is intentionally absent from this deployment (optional plugin).
 *
 * This single string literal is the whole cross-package contract: hosts
 * (`@elizaos/app-core`) construct {@link OptionalAppRoutePluginUnavailableError}
 * and {@link drainAppRoutePluginLoaders} recognizes it. Matching is by name (not
 * `instanceof`) so it stays robust when a combined deployment bundles two copies
 * of `@elizaos/core` — the class identity differs across bundles but the name
 * does not.
 */
export declare const OPTIONAL_APP_ROUTE_PLUGIN_UNAVAILABLE_ERROR_NAME = "OptionalAppRoutePluginUnavailableError";
/**
 * Error an app-route plugin loader throws when its optional plugin is not
 * installed in this deployment. Hosts throw it; {@link drainAppRoutePluginLoaders}
 * treats it as a graceful skip. Owned by core so the contract has one definition.
 */
export declare class OptionalAppRoutePluginUnavailableError extends Error {
    readonly specifier: string;
    constructor(specifier: string, cause?: unknown);
}
/**
 * Whether `err` is the optional-app-route-plugin-unavailable signal. Matches by
 * `Error.name` (not `instanceof`) so it holds across duplicate `@elizaos/core`
 * bundles in a combined deployment.
 */
export declare function isOptionalAppRoutePluginUnavailableError(err: unknown): boolean;
export declare function registerAppRoutePluginLoader(id: string, load: AppRoutePluginLoader): void;
export declare function listAppRoutePluginLoaders(): AppRoutePluginRegistryEntry[];
/**
 * Drain app-route plugin loaders into a runtime's route table.
 *
 * App-route plugins register a loader here (so they survive bundler
 * tree-shaking) instead of exposing routes through `Plugin.routes` directly.
 * Both the headless `@elizaos/agent` server boot and the `@elizaos/app-core`
 * boot drain this registry; in a combined deployment (desktop/dashboard) both
 * run against the same `runtime.routes`. This helper is therefore **idempotent**:
 * routes already present (keyed by `${type}:${path}`) are skipped, so a second
 * drain adds nothing rather than double-registering hundreds of routes.
 *
 * Routes are pushed with their absolute `rawPath` (no `/<pluginName>/` prefix)
 * so `tryHandleRuntimePluginRoute` matches them. Per-loader failures are
 * isolated: an optional-unavailable loader is debug-logged and contributes no
 * routes; any other failure is warn-logged and skipped, never aborting the rest.
 */
export declare function drainAppRoutePluginLoaders(target: {
    routes: Route[];
}, loaders?: AppRoutePluginRegistryEntry[]): Promise<void>;
//# sourceMappingURL=app-route-plugin-registry.d.ts.map