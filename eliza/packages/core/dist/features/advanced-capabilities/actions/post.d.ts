/**
 * POST action: the public feed/timeline surface (send publishes, read fetches a
 * feed, search queries posts) across social PostConnectors — x, bluesky,
 * farcaster, nostr, instagram. The counterpart to MESSAGE, which owns
 * addressed/private messaging; the routingHint keeps the planner from confusing
 * the two (public feed -> POST, DM/group/channel -> MESSAGE). Op selection comes
 * from the structured `action` enum, never from natural-language keywords
 * (#10471); shared connector selection and param coercion live in
 * connectorActionUtils.
 */
import type { Action, ActionParameter, HandlerOptions } from "../../../types/index.js";
declare const POST_OPS: readonly ["send", "read", "search"];
type PostOp = (typeof POST_OPS)[number];
export declare function resolveOp(options?: HandlerOptions): PostOp;
export declare const POST_PARAMETERS: ActionParameter[];
export declare const postAction: Action;
export default postAction;
//# sourceMappingURL=post.d.ts.map