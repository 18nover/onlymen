/**
 * @module features/plugin-manager/actions/plugin-handlers/runtime-state
 *
 * Read and mutate runtime plugin state for the MANAGE_PLUGINS action.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
interface RuntimeStateInput {
    runtime: IAgentRuntime;
    name?: string;
    callback?: HandlerCallback;
}
export declare function runPluginStatus({ runtime, name, callback, }: RuntimeStateInput): Promise<ActionResult>;
export declare function runPluginDetails({ runtime, name, callback, }: RuntimeStateInput): Promise<ActionResult>;
export declare function runEnablePlugin(input: RuntimeStateInput): Promise<ActionResult>;
export declare function runDisablePlugin(input: RuntimeStateInput): Promise<ActionResult>;
export {};
//# sourceMappingURL=runtime-state.d.ts.map