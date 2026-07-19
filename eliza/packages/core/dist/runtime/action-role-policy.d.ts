import type { RoleGateRole } from "../types/contexts.js";
export declare function readActionRolePolicy(): Record<string, RoleGateRole>;
type PolicyAddressableAction = {
    name: string;
    contextGate?: {
        roleGate?: {
            minRole?: RoleGateRole;
        };
    };
    roleGate?: {
        minRole?: RoleGateRole;
    };
};
export type ActionRolePolicyWarning = {
    type: "unmatched";
    actionName: string;
    policyRole: RoleGateRole;
} | {
    type: "loosens";
    actionName: string;
    policyRole: RoleGateRole;
    declaredRole: RoleGateRole;
};
export declare function resolveActionRolePolicyRole(action: string | PolicyAddressableAction): RoleGateRole | undefined;
/**
 * Returns the policy-mandated minimum role for `actionName` if it is
 * present in `ACTION_ROLE_POLICY` and the caller satisfies that role.
 * Returns `undefined` when the action is not whitelisted by the policy
 * or when the caller does not satisfy the policy role.
 */
export declare function isActionAllowedByRolePolicy(action: string | PolicyAddressableAction, userRoles: readonly RoleGateRole[] | undefined): boolean;
export declare function getActionRolePolicyWarnings(actions: readonly PolicyAddressableAction[]): ActionRolePolicyWarning[];
/**
 * Warn about `ACTION_ROLE_POLICY` keys that match no registered action name.
 * Policy lookup is exact-name only; similes intentionally do not authorize.
 * Returns the unmatched keys for tests.
 */
export declare function warnOnUnmatchedActionRolePolicyKeys(actions: readonly PolicyAddressableAction[]): string[];
/** Test seam — clears the cached `ACTION_ROLE_POLICY` parse. */
export declare function _resetActionRolePolicyCacheForTests(): void;
export {};
//# sourceMappingURL=action-role-policy.d.ts.map