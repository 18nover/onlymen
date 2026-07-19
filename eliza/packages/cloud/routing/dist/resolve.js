/**
 * Cloud route resolver for local-key, cloud-proxy, and disabled service access.
 *
 * The resolver reads settings at call time, validates caller-provided service
 * names and base URLs, and never performs network I/O.
 */
import { DEFAULT_FEATURE_POLICY, FEATURE_IDS, getFeature, isFeaturePolicy, } from "./features.js";
const CLOUD_BASE_FALLBACK = "https://elizacloud.ai/api/v1";
export function toRuntimeSettings(runtime) {
    return {
        getSetting(key) {
            const v = runtime.getSetting(key);
            if (v === null || v === undefined)
                return v;
            if (typeof v === "string" ||
                typeof v === "boolean" ||
                typeof v === "number") {
                return v;
            }
            if (typeof v === "bigint")
                return v.toString();
            return undefined;
        },
    };
}
export function cloudServiceApisBaseUrl(runtime, service) {
    return buildCloudProxyRoute(runtime, service);
}
function stripTrailingSlashes(url) {
    return url.replace(/\/+$/, "");
}
function normalizeCloudBaseUrl(rawUrl) {
    let parsed;
    try {
        parsed = new URL(rawUrl);
    }
    catch {
        // error-policy:J3 rawUrl is a caller/config-provided string; an unparseable
        // value is an explicit "no valid cloud base" signal (null), which
        // buildCloudProxyRoute keeps distinct from a resolved route.
        return null;
    }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
    }
    if (parsed.username || parsed.password || parsed.search || parsed.hash) {
        return null;
    }
    return stripTrailingSlashes(parsed.toString());
}
function normalizeServiceName(service) {
    const trimmed = service.trim().replace(/^\/+|\/+$/g, "");
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return null;
    }
    return trimmed;
}
function getSettingAsString(runtime, key) {
    const raw = runtime.getSetting(key);
    if (raw === null || raw === undefined)
        return null;
    const str = String(raw).trim();
    return str.length > 0 ? str : null;
}
function buildCloudProxyRoute(runtime, service) {
    const cloudApiKey = getSettingAsString(runtime, "ELIZAOS_CLOUD_API_KEY");
    if (cloudApiKey === null || !isCloudRoutingEnabled(runtime))
        return null;
    const cloudBaseRaw = getSettingAsString(runtime, "ELIZAOS_CLOUD_BASE_URL") ??
        CLOUD_BASE_FALLBACK;
    const cloudBase = normalizeCloudBaseUrl(cloudBaseRaw);
    const svc = normalizeServiceName(service);
    if (!cloudBase || !svc)
        return null;
    return {
        baseUrl: `${cloudBase}/apis/${svc}`,
        headers: { Authorization: `Bearer ${cloudApiKey}` },
    };
}
export function isCloudConnected(runtime) {
    return (getSettingAsString(runtime, "ELIZAOS_CLOUD_API_KEY") !== null &&
        isCloudRoutingEnabled(runtime));
}
function isCloudRoutingEnabled(runtime) {
    const enabled = runtime.getSetting("ELIZAOS_CLOUD_ENABLED");
    if (enabled === true)
        return true;
    if (typeof enabled === "string") {
        const lower = enabled.trim().toLowerCase();
        return lower === "true" || lower === "1";
    }
    return false;
}
export function resolveCloudRoute(runtime, spec) {
    const localKey = getSettingAsString(runtime, spec.localKeySetting);
    if (localKey !== null) {
        const baseUrl = stripTrailingSlashes(spec.upstreamBaseUrl);
        const headers = buildLocalKeyHeaders(spec, localKey);
        return {
            source: "local-key",
            baseUrl,
            headers,
            reason: `local key set: ${spec.localKeySetting}`,
        };
    }
    const cloudRoute = buildCloudProxyRoute(runtime, spec.service);
    if (cloudRoute) {
        return {
            source: "cloud-proxy",
            ...cloudRoute,
            reason: "cloud proxy: ELIZAOS_CLOUD_API_KEY",
        };
    }
    return {
        source: "disabled",
        reason: `no local ${spec.localKeySetting} and cloud not connected`,
    };
}
function buildLocalKeyHeaders(spec, key) {
    switch (spec.localKeyAuth.kind) {
        case "header":
            return { [spec.localKeyAuth.headerName]: key };
        case "bearer":
            return { Authorization: `Bearer ${key}` };
    }
}
export function getFeaturePolicy(runtime, feature) {
    const def = getFeature(feature);
    if (def === null)
        return DEFAULT_FEATURE_POLICY;
    const raw = runtime.getSetting(def.settingKey);
    if (typeof raw === "string") {
        const trimmed = raw.trim().toLowerCase();
        if (isFeaturePolicy(trimmed))
            return trimmed;
    }
    return DEFAULT_FEATURE_POLICY;
}
export function getFeaturePolicyMap(runtime) {
    const entries = FEATURE_IDS.map((id) => [
        id,
        getFeaturePolicy(runtime, id),
    ]);
    return Object.fromEntries(entries);
}
export function resolveFeatureCloudRoute(runtime, feature, spec, policyOverride) {
    const policy = policyOverride ?? getFeaturePolicy(runtime, feature);
    switch (policy) {
        case "local": {
            const localKey = getSettingAsString(runtime, spec.localKeySetting);
            if (localKey === null) {
                return {
                    source: "disabled",
                    reason: `feature "${feature}" pinned to local but ${spec.localKeySetting} is unset`,
                    feature,
                    policy,
                };
            }
            return {
                source: "local-key",
                baseUrl: stripTrailingSlashes(spec.upstreamBaseUrl),
                headers: buildLocalKeyHeaders(spec, localKey),
                reason: `feature "${feature}" pinned to local: ${spec.localKeySetting}`,
                feature,
                policy,
            };
        }
        case "cloud": {
            const cloudRoute = buildCloudProxyRoute(runtime, spec.service);
            if (cloudRoute === null) {
                return {
                    source: "disabled",
                    reason: `feature "${feature}" pinned to cloud but cloud is not connected`,
                    feature,
                    policy,
                };
            }
            return {
                source: "cloud-proxy",
                ...cloudRoute,
                reason: `feature "${feature}" pinned to cloud: ELIZAOS_CLOUD_API_KEY`,
                feature,
                policy,
            };
        }
        case "auto": {
            const auto = resolveCloudRoute(runtime, spec);
            return {
                ...auto,
                reason: `feature "${feature}" auto: ${auto.reason}`,
                feature,
                policy,
            };
        }
    }
}
