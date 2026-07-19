/**
 * @module features/plugin-manager/actions/plugin-handlers/reinject
 *
 * `reinject` sub-mode of the PLUGIN action. Removes an ejected
 * plugin's local copy so the agent falls back to the npm-installed version.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface ReinjectInput {
    runtime: IAgentRuntime;
    name: string;
    callback?: HandlerCallback;
}
export declare function runReinject({ runtime, name, callback, }: ReinjectInput): Promise<ActionResult>;
//# sourceMappingURL=reinject.d.ts.map