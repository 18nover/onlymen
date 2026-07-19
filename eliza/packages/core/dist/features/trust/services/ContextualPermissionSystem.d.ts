import type { IAgentRuntime, UUID } from "../../../types/index.js";
import type { AccessDecision, AccessRequest, ElevationRequest, ElevationResult, Permission, PermissionContext, PermissionDelegation } from "../types/permissions.js";
import type { SecurityModule } from "./SecurityModule.js";
import type { TrustEngine } from "./TrustEngine.js";
export declare class ContextualPermissionSystem {
    private runtime;
    private trustEngine;
    private securityModule;
    private permissionCache;
    /**
     * Cap on cached permission decisions. The cache is keyed by a full
     * serialization of the access request, so its key space is effectively
     * unbounded over a long-running process. LRU eviction (with the lazy TTL
     * check on read) keeps it bounded.
     */
    private static readonly MAX_PERMISSION_CACHE_ENTRIES;
    private elevations;
    private delegations;
    /**
     * Role→action grants as cumulative rank tiers (#12087 Item 5). Grants
     * accumulate by canonical rank so no tier ever holds fewer grants than the
     * unauthenticated NONE floor: everyone at NONE and above gets BASE_PERMISSIONS
     * (including send_message/view_content); ADMIN and above additionally get
     * ADMIN_PERMISSIONS; OWNER gets everything. (Full target: derive each
     * requirement from the capability it protects; the tier sets remain the interim
     * source of truth.)
     */
    private static readonly BASE_PERMISSIONS;
    private static readonly ADMIN_PERMISSIONS;
    private static readonly TRUST_ACTION_THRESHOLDS;
    private static readonly TRUST_ONLY_ACTIONS;
    private static readonly ADMIN_ONLY_ACTIONS;
    initialize(runtime: IAgentRuntime, trustEngine: TrustEngine, securityModule: SecurityModule): Promise<void>;
    hasPermission(entityId: UUID, permission: Permission, context: PermissionContext): Promise<boolean>;
    checkAccess(request: AccessRequest): Promise<AccessDecision>;
    private checkRolePermissions;
    private checkTrustPermissions;
    private checkDelegatedPermissions;
    requestElevation(request: ElevationRequest): Promise<ElevationResult>;
    /**
     * Check if the entity has an active (non-expired) elevation grant for the requested action.
     */
    private checkActiveElevations;
    /**
     * Create a delegation granting another entity specific permissions.
     */
    addDelegation(delegation: PermissionDelegation): void;
    /**
     * Revoke a delegation by ID.
     */
    revokeDelegation(delegationId: UUID, revokedBy: UUID): boolean;
    private createDecision;
    private roleHasPermission;
    private getEntityRoles;
    private generateDenialReason;
}
//# sourceMappingURL=ContextualPermissionSystem.d.ts.map