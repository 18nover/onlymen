/**
 * Service abstraction: the `ServiceTypeRegistry` (extended by plugins via module
 * augmentation) and the long-lived-singleton `Service` base contract. Services are
 * clients/schedulers/connectors the runtime starts once and shares across the
 * message loop.
 */
import type { JsonValue, Metadata } from "./primitives.js";
import type { IAgentRuntime } from "./runtime.js";
/**
 * Core service type registry that can be extended by plugins via module augmentation.
 * Plugins can extend this interface to add their own service types:
 *
 * @example
 * ```typescript
 * declare module '@elizaos/core' {
 *   interface ServiceTypeRegistry {
 *     MY_CUSTOM_SERVICE: 'my_custom_service';
 *   }
 * }
 * ```
 */
export interface ServiceTypeRegistry {
    TRANSCRIPTION: "transcription";
    VIDEO: "video";
    BROWSER: "browser";
    PDF: "pdf";
    REMOTE_FILES: "aws_s3";
    TUNNEL: "tunnel";
    CLOUD_AUTH: "CLOUD_AUTH";
    WEB_SEARCH: "web_search";
    EMAIL: "email";
    TEE: "tee";
    TASK: "task";
    APPROVAL: "approval";
    TOOL_POLICY: "tool_policy";
    WALLET: "wallet";
    LP_POOL: "lp_pool";
    TOKEN_DATA: "token_data";
    MESSAGE_SERVICE: "message_service";
    MESSAGE: "message";
    POST: "post";
    HOOKS: "hooks";
    PAIRING: "pairing";
    CONNECTOR_ACCOUNT: "connector_account";
    CONNECTOR_ACCOUNT_STORAGE: "connector_account_storage";
    AGENT_EVENT: "agent_event";
    CONTROL_TRANSPORT: "control_transport";
    OPTIMIZED_PROMPT: "optimized_prompt";
    CHANNEL_TOPICS: "channel_topics";
    COMMANDS: "commands";
    MOBILE_DEVICE_BRIDGE: "mobile_device_bridge";
    SCREEN_CAPTURE: "screen_capture";
    DOCUMENTS: "documents";
    RELATIONSHIPS: "relationships";
    FOLLOW_UP: "follow_up";
    TRAJECTORIES: "trajectories";
    SWARM_COORDINATOR: "SWARM_COORDINATOR";
    UNKNOWN: "unknown";
}
/**
 * Type for service names that includes both core services and any plugin-registered services
 */
export type ServiceTypeName = ServiceTypeRegistry[keyof ServiceTypeRegistry];
/**
 * Helper type to extract service type values from the registry
 */
export type ServiceTypeValue<K extends keyof ServiceTypeRegistry> = ServiceTypeRegistry[K];
/**
 * Helper type to check if a service type exists in the registry
 */
export type IsValidServiceType<T extends string> = T extends ServiceTypeName ? true : false;
/**
 * Type-safe service class definition
 */
export type TypedServiceClass<T extends ServiceTypeName> = {
    new (runtime?: IAgentRuntime): Service;
    serviceType: T;
    allowsMultiple?: boolean;
    start(runtime: IAgentRuntime): Promise<Service>;
};
/**
 * Map of service type names to their implementation classes.
 * Plugins can extend this via module augmentation:
 * @example
 * ```typescript
 * declare module '@elizaos/core' {
 *   interface ServiceClassMap {
 *     MY_SERVICE: typeof MyService;
 *   }
 * }
 * ```
 */
export type ServiceClassMap = {};
/**
 * Helper to infer service instance type from service type name
 */
export type ServiceInstance<T extends ServiceTypeName> = T extends keyof ServiceClassMap ? InstanceType<ServiceClassMap[T]> : Service;
/**
 * Runtime service registry type
 */
export type ServiceRegistry<T extends ServiceTypeName = ServiceTypeName> = Map<T, Service>;
/**
 * Enumerates the recognized types of services that can be registered and used by the agent runtime.
 * Services provide specialized functionalities like audio transcription, video processing,
 * web browsing, PDF handling, file storage (e.g., AWS S3), web search, email integration,
 * secure execution via TEE (Trusted Execution Environment), and task management.
 * This constant is used in `AgentRuntime` for service registration and retrieval (e.g., `getService`).
 * Each service typically implements the `Service` abstract class or a more specific interface like `IVideoService`.
 */
export declare const ServiceType: {
    readonly TRANSCRIPTION: "transcription";
    readonly VIDEO: "video";
    readonly BROWSER: "browser";
    readonly PDF: "pdf";
    readonly REMOTE_FILES: "aws_s3";
    readonly TUNNEL: "tunnel";
    readonly CLOUD_AUTH: "CLOUD_AUTH";
    readonly WEB_SEARCH: "web_search";
    readonly EMAIL: "email";
    readonly TEE: "tee";
    readonly TASK: "task";
    readonly APPROVAL: "approval";
    readonly TOOL_POLICY: "tool_policy";
    readonly WALLET: "wallet";
    readonly LP_POOL: "lp_pool";
    readonly TOKEN_DATA: "token_data";
    readonly MESSAGE_SERVICE: "message_service";
    readonly MESSAGE: "message";
    readonly POST: "post";
    readonly HOOKS: "hooks";
    readonly PAIRING: "pairing";
    readonly CONNECTOR_ACCOUNT: "connector_account";
    readonly CONNECTOR_ACCOUNT_STORAGE: "connector_account_storage";
    readonly AGENT_EVENT: "agent_event";
    readonly CONTROL_TRANSPORT: "control_transport";
    readonly NOTIFICATION: "notification";
    readonly MEDIA_GENERATION: "media_generation";
    readonly VOICE_CACHE: "voice_cache";
    readonly OPTIMIZED_PROMPT: "optimized_prompt";
    readonly CHANNEL_TOPICS: "channel_topics";
    readonly COMMANDS: "commands";
    readonly MOBILE_DEVICE_BRIDGE: "mobile_device_bridge";
    readonly SCREEN_CAPTURE: "screen_capture";
    readonly DOCUMENTS: "documents";
    readonly RELATIONSHIPS: "relationships";
    readonly FOLLOW_UP: "follow_up";
    readonly TRAJECTORIES: "trajectories";
    readonly SWARM_COORDINATOR: "SWARM_COORDINATOR";
    readonly UNKNOWN: "unknown";
};
/**
 * Client instance
 */
export declare abstract class Service {
    /** Runtime instance */
    protected runtime: IAgentRuntime;
    constructor(runtime?: IAgentRuntime);
    abstract stop(): Promise<void>;
    /** Service type */
    static serviceType: string;
    /** True when multiple implementations may intentionally share this service type. */
    static allowsMultiple?: boolean;
    /** Service name */
    abstract capabilityDescription: string;
    /** Service configuration */
    config?: Metadata;
    /** Start service connection - subclasses must override this */
    static start(_runtime: IAgentRuntime): Promise<Service>;
    /** Stop service connection - optional, subclasses may override this */
    static stopRuntime?(_runtime: IAgentRuntime): Promise<void>;
    /** Optional static method to register send handlers */
    static registerSendHandlers?(runtime: IAgentRuntime, service: Service): void;
}
/**
 * Generic service interface that provides better type checking for services
 * @template ConfigType The configuration type for this service
 * @template InputType The input type for processing
 * @template ResultType The result type returned by the service operations
 */
export interface TypedService<ConfigType extends Metadata = Metadata, InputType = JsonValue, ResultType = JsonValue> extends Service {
    /**
     * The configuration for this service instance
     */
    config?: ConfigType;
    /**
     * Process an input with this service
     * @param input The input to process
     * @returns A promise resolving to the result
     */
    process(input: InputType): Promise<ResultType>;
}
/**
 * Generic factory function to create a typed service instance.
 * getService() is synchronous — no await needed.
 * @param runtime The agent runtime
 * @param serviceType The type of service to get
 * @returns The service instance or null if not available
 */
export declare function getTypedService<ConfigType extends Metadata = Metadata, InputType = JsonValue, ResultType = JsonValue>(runtime: IAgentRuntime, serviceType: ServiceTypeName): TypedService<ConfigType, InputType, ResultType> | null;
/**
 * Standardized service error type for consistent error handling
 */
export interface ServiceError {
    code: string;
    message: string;
    details?: Record<string, JsonValue> | string | number | boolean | null;
    cause?: Error;
}
/**
 * Safely create a ServiceError from any caught error
 */
export declare function createServiceError(error: Error | string | JsonValue, code?: string): ServiceError;
//# sourceMappingURL=service.d.ts.map