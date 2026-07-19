/**
 * @module features/plugin-manager/actions/plugin-handlers/sync
 *
 * `sync` sub-mode of the PLUGIN action. Pulls upstream changes
 * for an ejected plugin.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface SyncInput {
    runtime: IAgentRuntime;
    name: string;
    callback?: HandlerCallback;
}
export declare function runSync({ runtime, name, callback, }: SyncInput): Promise<ActionResult>;
//# sourceMappingURL=sync.d.ts.map