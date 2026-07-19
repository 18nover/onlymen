/**
 * @module features/plugin-manager/actions/plugin
 *
 * Unified MANAGE_PLUGINS action with subactions (`install`, `eject`,
 * `sync`, `reinject`, `list`, `list_ejected`, `search`, `details`,
 * `status`, `enable`, `disable`, `core_status`, `create`).
 *
 * Validate gates on owner role + structured/context selection + a lookup
 * against any pending PLUGIN_CREATE intent task in the same room (so the
 * multi-turn choice reply still resolves).
 *
 * Handler is pure dispatch — sub-handlers live under ./plugin-handlers/.
 * Subaction routing goes through the shared `resolveActionArgs` substrate:
 * structured planner/programmatic `action` enum first, then a single LLM
 * extraction pass over the registered subactions for free-form requests.
 */
import type { Action } from "../../../types/components.js";
import type { Memory } from "../../../types/memory.js";
import type { IAgentRuntime } from "../../../types/runtime.js";
export type PluginSubaction = "install" | "eject" | "sync" | "reinject" | "list" | "list_ejected" | "search" | "details" | "status" | "enable" | "disable" | "core_status" | "create";
type OwnerAccessFn = (runtime: IAgentRuntime, message: Memory) => Promise<boolean>;
interface PluginActionDeps {
    hasOwnerAccess?: OwnerAccessFn;
    repoRoot?: string;
}
/**
 * Machine extractor: pull a plugin package identifier (`@scope/plugin-x`,
 * `plugin-x`, or a bare name after an operation verb) out of free-form text.
 * Operates on plugin-identifier token shapes, not behavior-deciding NL.
 */
export declare function extractNameFromText(text: string): string | undefined;
export declare function extractQueryFromText(text: string): string | undefined;
export declare function createPluginAction(deps?: PluginActionDeps): Action;
export declare const pluginAction: Action;
export {};
//# sourceMappingURL=plugin.d.ts.map