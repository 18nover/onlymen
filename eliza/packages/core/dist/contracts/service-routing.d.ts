/**
 * Fail-closed normalizers and adapters over `@elizaos/contracts` service-routing
 * config. Re-exports the contract types and validates untrusted config records
 * into typed shapes — service route/routing, deployment target, and
 * linked-account records/flags — dropping unknown or empty fields rather than
 * passing them through. Also builds the default Eliza Cloud service routing
 * (Cerebras text-model defaults, per-capability cloud-proxy routes). Consumed by
 * cloud-topology resolution and first-run config handling.
 */
import type { DeploymentTargetConfig, DeploymentTargetRuntime, LinkedAccountAccountSource, LinkedAccountConfig, LinkedAccountFlagConfig, LinkedAccountFlagsConfig, LinkedAccountHealth, LinkedAccountHealthDetail, LinkedAccountProviderId, LinkedAccountSource, LinkedAccountStatus, LinkedAccountsConfig, LinkedAccountUsage, ServiceCapability, ServiceRouteAccountStrategy, ServiceRouteConfig, ServiceRoutingConfig, ServiceTransport } from "@elizaos/contracts";
export type { DeploymentTargetConfig, DeploymentTargetRuntime, LinkedAccountAccountSource, LinkedAccountConfig, LinkedAccountFlagConfig, LinkedAccountFlagsConfig, LinkedAccountHealth, LinkedAccountHealthDetail, LinkedAccountProviderId, LinkedAccountSource, LinkedAccountStatus, LinkedAccountsConfig, LinkedAccountUsage, ServiceCapability, ServiceRouteAccountStrategy, ServiceRouteConfig, ServiceRoutingConfig, ServiceTransport, };
export declare const DEFAULT_CEREBRAS_TEXT_MODEL = "gemma-4-31b";
export declare const DEFAULT_ELIZA_CLOUD_TEXT_MODEL = "gemma-4-31b";
export declare const DEFAULT_ELIZA_CLOUD_LARGE_TEXT_MODEL = "zai-glm-4.7";
export declare const DEFAULT_ELIZA_CLOUD_FREE_TEXT_MODEL = "gemma-4-31b";
export declare const SERVICE_CAPABILITIES: readonly ["llmText", "tts", "media", "embeddings", "rpc"];
export declare function buildElizaCloudServiceRoute(args?: {
    nanoModel?: string;
    smallModel?: string;
    mediumModel?: string;
    largeModel?: string;
    megaModel?: string;
    responseHandlerModel?: string;
    shouldRespondModel?: string;
    actionPlannerModel?: string;
    plannerModel?: string;
    responseModel?: string;
    mediaDescriptionModel?: string;
}): ServiceRouteConfig;
export declare function buildDefaultElizaCloudServiceRouting(args?: {
    base?: ServiceRoutingConfig | null;
    includeInference?: boolean;
    excludeServices?: readonly Exclude<ServiceCapability, "llmText">[];
    nanoModel?: string;
    smallModel?: string;
    mediumModel?: string;
    largeModel?: string;
    megaModel?: string;
    responseHandlerModel?: string;
    shouldRespondModel?: string;
    actionPlannerModel?: string;
    plannerModel?: string;
    responseModel?: string;
    mediaDescriptionModel?: string;
}): ServiceRoutingConfig;
export declare function normalizeLinkedAccountFlagConfig(value: unknown): LinkedAccountFlagConfig | null;
export declare function normalizeLinkedAccountFlagsConfig(value: unknown): LinkedAccountFlagsConfig | null;
export declare function isLinkedAccountProviderId(value: unknown): value is LinkedAccountProviderId;
export declare function normalizeLinkedAccountRecord(value: unknown): LinkedAccountConfig | null;
export declare function normalizeLinkedAccountsRecords(value: unknown): LinkedAccountsConfig | null;
export declare function normalizeServiceRouteConfig(value: unknown): ServiceRouteConfig | null;
export declare function normalizeServiceRoutingConfig(value: unknown): ServiceRoutingConfig | null;
export declare function normalizeDeploymentTargetConfig(value: unknown): DeploymentTargetConfig | null;
//# sourceMappingURL=service-routing.d.ts.map