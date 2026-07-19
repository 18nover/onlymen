/**
 * Type and helper definitions for the trust capability's permission and
 * access-control subsystem: permission contexts, contextual (time-bounded,
 * trust-gated) role assignments, permissions with constraints, decision and
 * audit shapes, and elevation/delegation requests and results. Also defines a
 * Unix-style octal permission model (`UnixPermission`, `ActionPermission`) and
 * the `PermissionUtils` helpers that evaluate owner/group/other read/write/exec
 * bits against a caller. Consumed by `ContextualPermissionSystem` and the
 * service wrappers.
 */
import type { Role, UUID } from "../../../types/index.js";
import type { TrustRequirements } from "./trust.js";
/**
 * Context for permission evaluation
 */
export interface PermissionContext {
    worldId?: UUID;
    roomId?: UUID;
    platform?: string;
    serverId?: string;
    channelId?: string;
    timestamp?: number;
}
/**
 * A contextual role that applies in specific contexts
 */
export interface ContextualRole {
    id: UUID;
    role: Role;
    entityId: UUID;
    context: PermissionContext;
    /** When this role assignment expires */
    expiresAt?: number;
    /** Who assigned this role */
    assignedBy: UUID;
    /** When this role was assigned */
    assignedAt: number;
    /** Trust requirements for this role */
    trustRequirements?: TrustRequirements;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Permission that can be granted
 */
export interface Permission {
    action: string;
    resource: string;
    context?: PermissionContext;
    constraints?: PermissionConstraint[];
}
/**
 * Constraint on a permission
 */
export interface PermissionConstraint {
    type: "time_window" | "usage_limit" | "trust_required" | "role_required" | "custom";
    value: string | number | boolean | Record<string, unknown>;
    description?: string;
}
/**
 * Result of a permission check
 */
export interface PermissionDecision {
    allowed: boolean;
    /** How the decision was made */
    method: "role-based" | "trust-based" | "delegated" | "elevated" | "denied";
    /** Which role or trust level granted access */
    grantedBy?: {
        type: "role" | "trust";
        value: Role | number;
        context?: PermissionContext;
    };
    /** Reason for the decision */
    reason: string;
    /** Suggestions if denied */
    suggestions?: string[];
    /** Conditions that must be met */
    conditions?: string[];
    /** Audit trail */
    auditInfo?: {
        decidedAt: number;
        evaluatorId: UUID;
        evidence?: Record<string, unknown>[];
    };
}
/**
 * Request for elevated permissions
 */
export interface ElevationRequest {
    entityId: UUID;
    requestedPermission: Permission;
    justification: string;
    duration?: number;
    context: PermissionContext;
}
/**
 * Result of an elevation request
 */
export interface ElevationResult {
    granted: boolean;
    elevationId?: UUID;
    expiresAt?: number;
    conditions?: string[];
    reason?: string;
    trustDeficit?: number;
    suggestions?: string[];
}
/**
 * Represents a delegation of permissions
 */
export interface PermissionDelegation {
    id: UUID;
    delegatorId: UUID;
    delegateeId: UUID;
    permissions: Permission[];
    context: PermissionContext;
    expiresAt?: number;
    createdAt: number;
    conditions?: string[];
    revoked?: boolean;
    revokedAt?: number;
    revokedBy?: UUID;
}
/**
 * Access request for evaluation
 */
export interface AccessRequest {
    entityId: UUID;
    action: string;
    resource: string;
    context: PermissionContext;
    metadata?: Record<string, unknown>;
}
/**
 * Complete access decision with all details
 */
export interface AccessDecision extends PermissionDecision {
    request: AccessRequest;
    evaluatedAt: number;
    ttl?: number;
    securityChecks?: {
        promptInjection: boolean;
        socialEngineering: boolean;
        anomalyDetection: boolean;
    };
}
/**
 * Unix-style permission system for autonomous agents
 * Format: XYYY where:
 * X = Special permissions (setuid, setgid, sticky)
 * First Y = Owner (self) permissions
 * Second Y = Group (admin/trusted) permissions
 * Third Y = Others (user/anon) permissions
 *
 * Each digit is sum of: 4 (read), 2 (write), 1 (execute)
 *
 * Examples:
 * 0700 = Only self can read/write/execute
 * 0755 = Self has full, others can read/execute
 * 0644 = Self read/write, others read only
 * 4755 = Setuid + self full, others read/execute
 */
export interface UnixPermission {
    mode: number;
    owner: "self" | "system" | string;
    group: "admin" | "trusted" | "user" | string;
    setuid?: boolean;
    setgid?: boolean;
    sticky?: boolean;
}
export interface ActionPermission {
    action: string;
    unix: UnixPermission;
    trustRequired?: number;
    roleRequired?: string[];
    contextRequired?: string[];
    selfCallable?: boolean;
    delegatable?: boolean;
    auditable?: boolean;
}
export interface PermissionEvaluationContext {
    caller: "self" | "admin" | "user" | "anon" | string;
    action: string;
    target?: string;
    trust?: number;
    roles?: string[];
    context?: Record<string, unknown>;
}
export declare const PermissionUtils: {
    fromOctal: (octal: string) => number;
    canExecute: (permission: UnixPermission, caller: PermissionEvaluationContext) => boolean;
    canRead: (permission: UnixPermission, caller: PermissionEvaluationContext) => boolean;
    canWrite: (permission: UnixPermission, caller: PermissionEvaluationContext) => boolean;
};
//# sourceMappingURL=permissions.d.ts.map