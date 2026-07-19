/**
 * HookService - Hook Management Service
 *
 * Provides centralized hook registration, management, and execution for the
 * Eliza agent runtime. Integrates with the runtime event system to dispatch
 * hooks when events are emitted.
 *
 * Key features:
 * - registry for all hook sources (bundled, workspace, plugin, runtime)
 * - Priority-based execution with FIFO ordering for same priority
 * - Eligibility checking based on OS, binaries, env vars, and config
 * - Directory-based hook discovery and loading
 * - Integration with runtime event system
 */
import { EventType } from "../types/events.js";
import type { HookEligibilityResult, HookHandler, HookLoadResult, HookPriority, HookRegistration, HookRegistrationOptions, HookRequirements, HookSnapshot, HookSource, IHookService } from "../types/hook.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
/**
 * HookService implementation
 */
export declare class HookService extends Service implements IHookService {
    static serviceType: "hooks";
    capabilityDescription: string;
    /** Hook registry keyed by ID */
    private registry;
    /** Index of hook IDs by event type for fast lookup */
    private eventIndex;
    /** Counter for generating unique hook IDs */
    private idCounter;
    /** Version counter for snapshots */
    private snapshotVersion;
    /** Configuration for eligibility checks */
    private hookConfig;
    /**
     * Start the hook service
     */
    static start(runtime: IAgentRuntime): Promise<HookService>;
    /**
     * Stop the hook service
     */
    stop(): Promise<void>;
    /**
     * Set up event interceptors to dispatch to hooks
     */
    private setupEventInterceptors;
    /**
     * Dispatch an event to all registered hooks
     */
    private dispatchToHooks;
    /**
     * Check eligibility for a registration (internal)
     */
    private checkEligibilityInternal;
    register(events: EventType | EventType[], handler: HookHandler, options: HookRegistrationOptions): string;
    unregister(hookId: string): boolean;
    registerFromDirectory(_dir: string, _source: HookSource, _options?: {
        pluginId?: string;
    }): Promise<HookLoadResult>;
    getSnapshot(): HookSnapshot;
    getHooksByEvent(event: EventType): HookRegistration[];
    getHook(hookId: string): HookRegistration | undefined;
    getAllHooks(): HookRegistration[];
    setEnabled(hookId: string, enabled: boolean): void;
    setPriority(hookId: string, priority: HookPriority): void;
    /**
     * Set configuration for eligibility checks
     */
    setConfig(config: Record<string, unknown>): void;
    checkEligibility(hookId: string): HookEligibilityResult;
    checkRequirements(requirements: HookRequirements, config?: Record<string, unknown>): HookEligibilityResult;
    /**
     * Resolve a dot-separated config path
     */
    private resolveConfigPath;
    /**
     * Check if a value is truthy
     */
    private isTruthy;
}
/**
 * Create and return the HookService class for registration
 */
export declare const HookServiceClass: typeof HookService;
//# sourceMappingURL=hook.d.ts.map