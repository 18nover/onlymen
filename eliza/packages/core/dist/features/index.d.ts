/**
 * Core Capabilities — Infrastructure services that are independently gated.
 *
 * Unlike advanced-capabilities (gated by `advancedCapabilities: true`),
 * these are enabled via their own flags:
 * - `enableTrust: true` / `ENABLE_TRUST` — trust engine, security, permissions
 * - `enableSecretsManager: true` / `ENABLE_SECRETS_MANAGER` — encrypted secrets, plugin activation
 * - `enablePluginManager: true` / `ENABLE_PLUGIN_MANAGER` — plugin introspection, install/eject
 *
 * Actions and providers are populated eagerly from each capability's index so
 * they are registered with the runtime alongside the lazy-started services.
 */
import type { Action, Provider } from "../types/index.js";
import type { ServiceClass } from "../types/plugin.js";
import type { IAgentRuntime } from "../types/runtime.js";
declare const trustCapability: {
    providers: Provider[];
    actions: Action[];
    services: ServiceClass[];
    init(runtime: IAgentRuntime): Promise<void>;
};
declare const secretsCapability: {
    providers: Provider[];
    actions: Action[];
    services: ServiceClass[];
};
declare const pluginManagerCapability: {
    providers: Provider[];
    actions: Action[];
    services: ServiceClass[];
};
export type { DocumentsPluginConfig, FetchDocumentFromUrlOptions, FetchedDocumentUrl, FetchedDocumentUrlKind, } from "./documents/index.js";
export { createDocumentsPlugin, DocumentService, documentAction, documentActions, documentsPlugin, documentsPluginCore, documentsPluginHeadless, documentsProvider, fetchDocumentFromUrl, isYouTubeUrl, } from "./documents/index.js";
export type { TrajectoryExportOptions, TrajectoryListItem, TrajectoryListOptions, TrajectoryListResult, TrajectoryStats, TrajectoryZipEntry, TrajectoryZipExportOptions, TrajectoryZipExportResult, } from "./trajectories/index.js";
export { TrajectoriesService, trajectoriesPlugin, } from "./trajectories/index.js";
export { pluginManagerCapability, secretsCapability, trustCapability };
export declare const coreCapabilities: {
    trust: {
        providers: Provider[];
        actions: Action[];
        services: ServiceClass[];
        init(runtime: IAgentRuntime): Promise<void>;
    };
    secretsManager: {
        providers: Provider[];
        actions: Action[];
        services: ServiceClass[];
    };
    pluginManager: {
        providers: Provider[];
        actions: Action[];
        services: ServiceClass[];
    };
};
export default coreCapabilities;
//# sourceMappingURL=index.d.ts.map