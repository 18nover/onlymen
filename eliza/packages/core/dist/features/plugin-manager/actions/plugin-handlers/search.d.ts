/**
 * @module features/plugin-manager/actions/plugin-handlers/search
 *
 * `search` sub-mode of the PLUGIN action. Searches the elizaOS
 * plugin registry by free-form query.
 */
import type { ActionResult, HandlerCallback } from "../../../../types/components.js";
import type { IAgentRuntime } from "../../../../types/runtime.js";
export interface SearchInput {
    runtime: IAgentRuntime;
    query: string;
    callback?: HandlerCallback;
}
export declare function runSearch({ runtime, query, callback, }: SearchInput): Promise<ActionResult>;
//# sourceMappingURL=search.d.ts.map