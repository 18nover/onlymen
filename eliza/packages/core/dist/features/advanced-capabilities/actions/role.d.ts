/**
 * ROLE — polymorphic role-management action.
 *
 * Operations:
 *   - assign: structured `assignments[]` (entityId + newRole) OR single `target` name
 *             with recent-room disambiguation. Hierarchy validation per-assignment.
 *   - revoke: single or batch revoke (sets target(s) to GUEST). Hierarchy-checked.
 *   - list:   returns current role assignments for the world.
 */
import type { Action } from "../../../types/index.js";
export declare function looksLikeRoleIntent(text: string): boolean;
export declare const roleAction: Action;
export declare const updateRoleAction: Action;
//# sourceMappingURL=role.d.ts.map