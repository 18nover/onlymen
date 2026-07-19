/**
 * SECRETS Action
 *
 * Single umbrella action for all secret management. The planner picks
 * `SECRETS` and supplies a structured `action` value (`get | set | delete |
 * list | check | mirror | request`); the dispatcher routes to the
 * appropriate atomic handler.
 *
 * `SECRETS_UPDATE_SETTINGS` stays a separate action (it's a settings
 * mutation, not a secret operation).
 */
import { type Action } from "../../../types/index.js";
/**
 * SECRETS — single umbrella action for all secret management.
 */
export declare const secretsAction: Action;
export { maskSecretValue } from "./mask.js";
//# sourceMappingURL=manage-secret.d.ts.map