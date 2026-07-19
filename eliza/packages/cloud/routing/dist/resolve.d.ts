/**
 * Cloud route resolver for local-key, cloud-proxy, and disabled service access.
 *
 * The resolver reads settings at call time, validates caller-provided service
 * names and base URLs, and never performs network I/O.
 */
import { type FeaturePolicy, type FeaturePolicyMap } from "./features.js";
import type { CloudRoute, FeatureCloudRoute, RouteSpec } from "./types.js";
export interface RuntimeSettings {
    getSetting(key: string): string | boolean | number | null | undefined;
}
export declare function toRuntimeSettings(runtime: {
    getSetting(key: string): unknown;
}): RuntimeSettings;
export declare function cloudServiceApisBaseUrl(runtime: RuntimeSettings, service: string): {
    baseUrl: string;
    headers: Record<string, string>;
} | null;
export declare function isCloudConnected(runtime: RuntimeSettings): boolean;
export declare function resolveCloudRoute(runtime: RuntimeSettings, spec: RouteSpec): CloudRoute;
export declare function getFeaturePolicy(runtime: RuntimeSettings, feature: string): FeaturePolicy;
export declare function getFeaturePolicyMap(runtime: RuntimeSettings): FeaturePolicyMap;
export declare function resolveFeatureCloudRoute(runtime: RuntimeSettings, feature: string, spec: RouteSpec, policyOverride?: FeaturePolicy): FeatureCloudRoute;
//# sourceMappingURL=resolve.d.ts.map