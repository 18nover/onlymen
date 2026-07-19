/**
 * @module features/plugin-manager/actions/plugin-handlers/list-ejected
 *
 * `list_ejected` sub-mode of the PLUGIN action. Lists plugins
 * currently ejected to the local managed directory.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface ListEjectedInput {
    runtime: IAgentRuntime;
    callback?: HandlerCallback;
}
export declare function runListEjected({ runtime, callback, }: ListEjectedInput): Promise<ActionResult>;
//# sourceMappingURL=list-ejected.d.ts.map