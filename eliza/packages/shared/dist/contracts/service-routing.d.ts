/**
 * Re-exports pure service-routing type contracts from @elizaos/contracts.
 * Runtime helpers (builders, normalizers, constants) remain here in @elizaos/shared.
 */
export type { DeploymentTargetConfig, DeploymentTargetRuntime, LinkedAccountAccountSource, LinkedAccountConfig, LinkedAccountFlagConfig, LinkedAccountFlagsConfig, LinkedAccountHealth, LinkedAccountHealthDetail, LinkedAccountProviderId, LinkedAccountSource, LinkedAccountStatus, LinkedAccountsConfig, LinkedAccountUsage, ServiceCapability, ServiceRouteAccountStrategy, ServiceRouteConfig, ServiceRoutingConfig, ServiceTransport, } from "@elizaos/contracts";
import type { DeploymentTargetConfig, LinkedAccountConfig, LinkedAccountFlagConfig, LinkedAccountFlagsConfig, LinkedAccountProviderId, LinkedAccountsConfig, ServiceCapability, ServiceRouteConfig, ServiceRoutingConfig } from "@elizaos/contracts";
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
/** Compat alias for `@elizaos/app-core@2.0.0-alpha.5xx` bundles embedded in packaged Electrobun. */
export declare const normalizeLinkedAccountsConfig: typeof normalizeLinkedAccountFlagsConfig;
export declare function isLinkedAccountProviderId(value: unknown): value is LinkedAccountProviderId;
export declare function normalizeLinkedAccountRecord(value: unknown): LinkedAccountConfig | null;
export declare function normalizeLinkedAccountsRecords(value: unknown): LinkedAccountsConfig | null;
export declare function normalizeServiceRouteConfig(value: unknown): ServiceRouteConfig | null;
export declare function normalizeServiceRoutingConfig(value: unknown): ServiceRoutingConfig | null;
export declare function normalizeDeploymentTargetConfig(value: unknown): DeploymentTargetConfig | null;
//# sourceMappingURL=service-routing.d.ts.map