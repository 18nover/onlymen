/**
 * Handler for the TRUST umbrella's `update_role` subaction: assigns
 * OWNER/ADMIN/NONE roles to entities within a group or world channel. A
 * `TEXT_LARGE` extraction resolves who-gets-what from the request (explicit
 * action parameters take precedence over the model output), the OWNER-only rule
 * in `canModifyRole` is enforced per assignment, and results are persisted into
 * `world.metadata.roles`. Requires `state`, a GROUP/WORLD channel, a `serverId`,
 * and a resolvable world; each rejection path replies via the callback and
 * returns a structured `ActionResult`.
 */
import { type ActionResult, type HandlerCallback, type IAgentRuntime, type Memory, type State } from "../../../types/index.js";
type ActionOptions = Record<string, unknown>;
export declare function updateRoleHandler(runtime: IAgentRuntime, message: Memory, state: State | undefined, options: ActionOptions | undefined, callback?: HandlerCallback): Promise<ActionResult>;
export {};
//# sourceMappingURL=roles.d.ts.map