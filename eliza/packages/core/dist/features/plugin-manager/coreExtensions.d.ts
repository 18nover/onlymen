/**
 * Core Runtime Extensions
 *
 * This module provides extensions to the core runtime for plugin management.
 * `unregisterEvent` is a first-class method on `AgentRuntime` / `IAgentRuntime`,
 * so this file only retains component unregistration helpers (action/provider/
 * service) that live outside the runtime contract.
 */
import type { IAgentRuntime } from "../../types/runtime.js";
/**
 * Extended runtime interface with optional component unregistration helpers.
 */
export interface ExtendedRuntime extends IAgentRuntime {
    unregisterAction: (actionName: string) => boolean;
    unregisterProvider?: (providerName: string) => void;
    unregisterService?: (serviceType: string) => Promise<void>;
}
/**
 * Extends the runtime with component unregistration methods
 * These are needed for proper plugin unloading
 */
export declare function extendRuntimeWithComponentUnregistration(runtime: IAgentRuntime): void;
/**
 * Apply all runtime extensions
 */
export declare function applyRuntimeExtensions(runtime: IAgentRuntime): void;
//# sourceMappingURL=coreExtensions.d.ts.map