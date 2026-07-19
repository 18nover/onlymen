/**
 * Cloud-topology contract: the set of Eliza Cloud services (inference, tts,
 * media, embeddings, rpc) and helpers that resolve which of them a config routes
 * to Cloud versus local, from deployment-target and linked-account settings.
 */
import { normalizeFirstRunProviderId, resolveDeploymentTargetInConfig, resolveLinkedAccountsInConfig, resolveServiceRoutingInConfig, } from "./first-run-options.js";
const REDACTED_SECRET = "[REDACTED]";
function asConfigRecord(value) {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value
        : null;
}
function _readConfigString(source, key) {
    const value = source?.[key];
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
function normalizeSecretString(value) {
    if (typeof value !== "string") {
        return undefined;
    }
    const trimmed = value.trim();
    if (!trimmed || trimmed.toUpperCase() === REDACTED_SECRET) {
        return undefined;
    }
    return trimmed;
}
export function isElizaCloudLinkedInConfig(config) {
    const linkedAccounts = resolveLinkedAccountsInConfig(config);
    const linkedCloudAccount = linkedAccounts?.elizacloud;
    if (linkedCloudAccount?.status === "linked") {
        return true;
    }
    const cloud = asConfigRecord(config?.cloud);
    return Boolean(normalizeSecretString(cloud?.apiKey));
}
export function resolveElizaCloudTopology(config) {
    const deploymentTarget = resolveDeploymentTargetInConfig(config);
    const routing = resolveServiceRoutingInConfig(config);
    const provider = (normalizeFirstRunProviderId(routing?.llmText?.backend) === "elizacloud"
        ? "elizacloud"
        : null) ??
        (deploymentTarget.provider === "elizacloud" ? "elizacloud" : null);
    const runtime = deploymentTarget.runtime === "cloud" ? "cloud" : "local";
    const resolvedServices = {
        inference: Boolean(routing?.llmText?.transport === "cloud-proxy" &&
            normalizeFirstRunProviderId(routing.llmText.backend) === "elizacloud"),
        tts: Boolean(routing?.tts?.transport === "cloud-proxy" &&
            normalizeFirstRunProviderId(routing.tts.backend) === "elizacloud"),
        media: Boolean(routing?.media?.transport === "cloud-proxy" &&
            normalizeFirstRunProviderId(routing.media.backend) === "elizacloud"),
        embeddings: Boolean(routing?.embeddings?.transport === "cloud-proxy" &&
            normalizeFirstRunProviderId(routing.embeddings.backend) ===
                "elizacloud"),
        rpc: Boolean(routing?.rpc?.transport === "cloud-proxy" &&
            normalizeFirstRunProviderId(routing.rpc.backend) === "elizacloud"),
    };
    const cloudDeploymentSelected = deploymentTarget.runtime === "cloud" &&
        deploymentTarget.provider === "elizacloud";
    return {
        linked: isElizaCloudLinkedInConfig(config),
        provider: provider === "elizacloud" ? "elizacloud" : null,
        runtime,
        services: resolvedServices,
        shouldLoadPlugin: cloudDeploymentSelected || Object.values(resolvedServices).some(Boolean),
    };
}
export function isElizaCloudServiceSelectedInConfig(config, service) {
    return resolveElizaCloudTopology(config).services[service];
}
export function shouldLoadElizaCloudPluginInConfig(config) {
    return resolveElizaCloudTopology(config).shouldLoadPlugin;
}
//# sourceMappingURL=cloud-topology.js.map