/**
 * @module features/plugin-manager/actions/plugin-handlers/core-status
 *
 * `core_status` sub-mode of the PLUGIN action. Reports whether
 * `@elizaos/core` is currently ejected or running from the npm package.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface CoreStatusInput {
    runtime: IAgentRuntime;
    callback?: HandlerCallback;
}
export declare function runCoreStatus({ runtime, callback, }: CoreStatusInput): Promise<ActionResult>;
//# sourceMappingURL=core-status.d.ts.map