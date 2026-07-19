/**
 * Fluent, type-safe builder for defining `Service` subclasses at runtime.
 * `createService(type)` / `defineService(spec)` turn a start/stop/description
 * spec into a `TypedServiceBuilder` — a constructor carrying the static
 * `serviceType` and `start(runtime)` members the plugin loader expects — so a
 * plugin can register a service without hand-authoring a class. Static members
 * are pinned via `Object.defineProperty` to match the base `ServiceClass` shape
 * from `types/plugin.ts`, which stays the canonical definition.
 */
import type { IAgentRuntime, ServiceTypeName } from "./types/index.js";
import { Service } from "./types/index.js";
/**
 * Type for the service class returned by the builder.
 * This provides the expected interface for dynamically created service classes.
 * This is a more specific generic version of the base ServiceClass from types/plugin.ts
 */
export interface TypedServiceBuilder<TService extends Service = Service> {
    new (runtime?: IAgentRuntime): TService;
    serviceType: ServiceTypeName;
    start(runtime: IAgentRuntime): Promise<TService>;
}
/**
 * Service builder class that provides type-safe service creation
 * with automatic type inference
 */
export declare class ServiceBuilder<TService extends Service = Service> {
    protected serviceType: ServiceTypeName | string;
    protected startFn: (runtime: IAgentRuntime) => Promise<TService>;
    protected stopFn?: () => Promise<void>;
    protected description: string;
    constructor(serviceType: ServiceTypeName | string);
    /**
     * Set the service description
     */
    withDescription(description: string): this;
    /**
     * Set the start function for the service
     */
    withStart(startFn: (runtime: IAgentRuntime) => Promise<TService>): this;
    /**
     * Set the stop function for the service
     */
    withStop(stopFn: () => Promise<void>): this;
    /**
     * Build the service class with all configured properties.
     * Returns a properly typed service class constructor.
     */
    build(): TypedServiceBuilder<TService>;
}
/**
 * Create a type-safe service builder
 * @param serviceType - The service type name
 * @returns A new ServiceBuilder instance
 */
export declare function createService<TService extends Service = Service>(serviceType: ServiceTypeName | string): ServiceBuilder<TService>;
/**
 * Type-safe service definition helper
 */
export interface ServiceDefinition<T extends Service = Service> {
    serviceType: ServiceTypeName;
    description: string;
    start: (runtime: IAgentRuntime) => Promise<T>;
    stop?: () => Promise<void>;
}
/**
 * Define a service with type safety.
 * Returns a TypedServiceBuilder that can be instantiated and started.
 */
export declare function defineService<T extends Service = Service>(definition: ServiceDefinition<T>): TypedServiceBuilder<T>;
//# sourceMappingURL=services.d.ts.map