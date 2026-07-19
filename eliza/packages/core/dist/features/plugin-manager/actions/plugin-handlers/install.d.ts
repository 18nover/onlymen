/**
 * @module features/plugin-manager/actions/plugin-handlers/install
 *
 * `install` sub-mode of the PLUGIN action. Installs a plugin from
 * the registry by canonical name. The underlying service handles the
 * npm/git source selection internally — `source: "git"` simply forces a
 * clone via the `PLUGIN_MANAGER_LOCAL_CLONE` env override on this call.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface InstallInput {
    runtime: IAgentRuntime;
    name: string;
    source?: "npm" | "git";
    callback?: HandlerCallback;
}
export declare function runInstall({ runtime, name, source, callback, }: InstallInput): Promise<ActionResult>;
//# sourceMappingURL=install.d.ts.map