/**
 * @module features/plugin-manager/actions/plugin-handlers/list
 *
 * `list` sub-mode of the PLUGIN action. Reports the loaded
 * plugins in the runtime as tracked by PluginManagerService.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface ListInput {
    runtime: IAgentRuntime;
    callback?: HandlerCallback;
}
export declare function runList({ runtime, callback, }: ListInput): Promise<ActionResult>;
//# sourceMappingURL=list.d.ts.map