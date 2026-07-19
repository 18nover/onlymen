/**
 * @module features/plugin-manager/actions/plugin-handlers/eject
 *
 * `eject` sub-mode of the PLUGIN action. Clones a registry plugin
 * into the local ejected directory so the user can edit + sync against
 * upstream.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface EjectInput {
    runtime: IAgentRuntime;
    name: string;
    callback?: HandlerCallback;
}
export declare function runEject({ runtime, name, callback, }: EjectInput): Promise<ActionResult>;
//# sourceMappingURL=eject.d.ts.map