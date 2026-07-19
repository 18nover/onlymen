/**
 * Action-Level Instrumentation
 *
 * Wraps actions and providers with trajectory logging.
 */
import type { Action, IAgentRuntime, Plugin, Provider } from "../../types/index.js";
import type { TrajectoriesService } from "./TrajectoriesService.js";
import type { JsonValue } from "./types.js";
interface TrajectoryContext {
    trajectoryId: string;
    logger: TrajectoriesService;
}
export declare function setTrajectoryContext(runtime: IAgentRuntime, trajectoryId: string, trajectoryLogger: TrajectoriesService): void;
export declare function getTrajectoryContext(runtime: IAgentRuntime): TrajectoryContext | null;
export declare function clearTrajectoryContext(runtime: IAgentRuntime): void;
export declare function wrapActionWithLogging(action: Action, _trajectoryLogger: TrajectoriesService): Action;
export declare function wrapPluginActions(plugin: Plugin, trajectoryLogger: TrajectoriesService): Plugin;
export declare function logLLMCallFromAction(actionContext: Record<string, JsonValue | undefined>, trajectoryLogger: TrajectoriesService, trajectoryId: string): void;
export declare function logProviderFromAction(actionContext: Record<string, JsonValue | undefined>, trajectoryLogger: TrajectoriesService, trajectoryId: string): void;
export declare function wrapProviderWithLogging(provider: Provider, _trajectoryLogger: TrajectoriesService): Provider;
export declare function wrapPluginProviders(plugin: Plugin, trajectoryLogger: TrajectoriesService): Plugin;
export {};
//# sourceMappingURL=action-interceptor.d.ts.map