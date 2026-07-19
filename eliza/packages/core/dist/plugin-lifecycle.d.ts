import type { ModelRegistrationMetadata } from "./types/model.js";
import type { Plugin, PluginOwnership } from "./types/plugin.js";
import type { IAgentRuntime } from "./types/runtime.js";
import type { Service, ServiceTypeName } from "./types/service.js";
type RuntimeServiceClass = NonNullable<Plugin["services"]>[number];
type RuntimeSendHandler = (runtime: unknown, target: unknown, content: unknown) => Promise<unknown>;
type RuntimeServiceRegistrationStatus = "pending" | "registering" | "registered" | "failed";
type RuntimeServicePromiseHandler = {
    resolve: (service: Service) => void;
    reject: (error: Error) => void;
};
type RuntimeModelHandlerRecord = {
    handler: (runtime: unknown, params: Record<string, unknown>) => Promise<unknown>;
    metadata?: ModelRegistrationMetadata;
    provider: string;
    priority?: number;
    registrationOrder?: number;
};
type RuntimeWithPluginLifecycle = IAgentRuntime & RuntimePrivateState & {
    __elizaPluginLifecycleInstalled?: boolean;
    __elizaPluginOwnership?: Map<string, PluginOwnership>;
    registerDatabaseAdapter: (adapter: IAgentRuntime["adapter"]) => void;
    unloadPlugin?: (pluginName: string) => Promise<PluginOwnership | null>;
    reloadPlugin?: (plugin: Plugin) => Promise<void>;
    applyPluginConfig?: (pluginName: string, config: Record<string, string>) => Promise<boolean>;
    getPluginOwnership?: (pluginName: string) => PluginOwnership | null;
    getAllPluginOwnership?: () => PluginOwnership[];
};
type RuntimePrivateState = {
    serviceTypes: Map<ServiceTypeName, RuntimeServiceClass[]>;
    servicePromises: Map<ServiceTypeName, Promise<Service>>;
    servicePromiseHandlers: Map<ServiceTypeName, RuntimeServicePromiseHandler>;
    startingServices: Map<ServiceTypeName, Promise<Service | null>>;
    serviceRegistrationStatus: Map<ServiceTypeName, RuntimeServiceRegistrationStatus>;
    sendHandlers: Map<string, RuntimeSendHandler>;
    models: Map<string, RuntimeModelHandlerRecord[]>;
    _runServiceStart?: (key: ServiceTypeName, serviceType: string, serviceDef: RuntimeServiceClass) => Promise<Service | null>;
    registerSendHandler?: (source: string, handler: RuntimeSendHandler) => void;
};
/** Test hook: reset the one-time registration-warning guard. */
export declare function _resetProviderContextWarningsForTests(): void;
export declare function installRuntimePluginLifecycle(runtime: IAgentRuntime): void;
export declare function supportsRuntimePluginLifecycle(runtime: IAgentRuntime | null): runtime is RuntimeWithPluginLifecycle;
export {};
//# sourceMappingURL=plugin-lifecycle.d.ts.map