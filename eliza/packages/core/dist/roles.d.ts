import type { IAgentRuntime, Memory, UUID, World } from "./types/index.js";
export type RoleName = "OWNER" | "ADMIN" | "USER" | "GUEST";
export type RoleGrantSource = "owner" | "manual" | "connector_admin";
/**
 * Canonical rank for every role tier across the codebase — the single source of
 * truth for role ordering (#9948). It spans both vocabularies that historically
 * disagreed: the `NONE` floor and the `MEMBER` alias (`environment.ts` `Role`)
 * plus `USER`/`GUEST` (`RoleName`). `USER` and `MEMBER` are the same tier.
 *
 * `roles.ts` and `runtime/context-gates.ts` both derive their ranking from this
 * constant rather than each keeping a private rank literal — two rank tables
 * that could silently drift apart is the authz hazard #9948 calls out.
 */
export declare const CANONICAL_ROLE_RANK: {
    readonly NONE: 0;
    readonly GUEST: 1;
    readonly USER: 2;
    readonly MEMBER: 2;
    readonly ADMIN: 3;
    readonly OWNER: 4;
};
export declare const ROLE_RANK: Record<RoleName, number>;
/**
 * True iff `role` ranks at least `minRole` on {@link CANONICAL_ROLE_RANK}. The
 * rank-aware replacement for the scattered `isAdminRank(role)`
 * string comparisons (#12087 Item 31) — those silently miss any tier added between
 * ADMIN and OWNER and don't recognize the MEMBER/USER aliasing. Unknown/empty roles
 * fall to the NONE floor (rank 0), so the predicate fails closed.
 */
export declare function hasAtLeastRole(role: string | undefined | null, minRole: keyof typeof CANONICAL_ROLE_RANK): boolean;
/** True iff `role` is ADMIN-rank or higher (ADMIN or OWNER). #12087 Item 31. */
export declare function isAdminRank(role: string | undefined | null): boolean;
export type RolesWorldMetadata = {
    ownership?: {
        ownerId?: string;
    };
    roles?: Record<string, RoleName>;
    roleSources?: Record<string, RoleGrantSource>;
};
export type ConnectorAdminWhitelist = Record<string, string[]>;
export type RolesConfig = {
    connectorAdmins?: ConnectorAdminWhitelist;
};
export type RoleCheckResult = {
    entityId: UUID;
    role: RoleName;
    isOwner: boolean;
    isAdmin: boolean;
    canManageRoles: boolean;
};
export interface ServerOwnershipState {
    servers: {
        [serverId: string]: World;
    };
}
declare const CONNECTOR_STABLE_ID_FIELDS: readonly ["userId", "id"];
type ConnectorStableIdField = (typeof CONNECTOR_STABLE_ID_FIELDS)[number];
type ConnectorAdminMatch = {
    connector: string;
    matchedValue: string;
    matchedField: ConnectorStableIdField;
};
type ResolveEntityRoleOptions = {
    liveEntityMetadata?: Record<string, unknown> | null;
    liveEntityId?: string;
};
/**
 * Role floor used when a real sender exists but no world role can be resolved.
 * Connector messages must not outrank a fully resolved stranger, so unknown
 * non-local sources fall to GUEST. Local, owner-app, and harness traffic keeps
 * USER so no-world control surfaces keep their historical behavior.
 */
export declare function getUnresolvedSenderRoleFloor(message: Memory): RoleName;
export declare function findWorldsForOwner(runtime: IAgentRuntime, entityId: string): Promise<World[] | null>;
export declare function getConfiguredOwnerEntityIds(runtime: IAgentRuntime): string[];
export declare function hasConfiguredCanonicalOwner(runtime: IAgentRuntime): boolean;
export declare function resolveCanonicalOwnerId(runtime: IAgentRuntime, metadata?: RolesWorldMetadata): string | null;
export declare function setConnectorAdminWhitelist(runtime: IAgentRuntime, whitelist: ConnectorAdminWhitelist | Record<string, unknown> | undefined): void;
export declare function getConnectorAdminWhitelist(runtime: IAgentRuntime): ConnectorAdminWhitelist;
export declare function matchEntityToConnectorAdminWhitelist(entityMetadata: Record<string, unknown> | null | undefined, whitelist: ConnectorAdminWhitelist | Record<string, unknown> | undefined): ConnectorAdminMatch | null;
export declare function normalizeRole(raw: string | undefined | null): RoleName;
export declare function getEntityRole(metadata: RolesWorldMetadata | undefined, entityId: string): RoleName;
export declare function getLiveEntityMetadataFromMessage(message: Memory): Record<string, unknown> | undefined;
export declare function resolveEntityRole(runtime: IAgentRuntime, _world: Awaited<ReturnType<IAgentRuntime["getWorld"]>>, metadata: RolesWorldMetadata | undefined, entityId: string, options?: ResolveEntityRoleOptions): Promise<RoleName>;
export declare function checkSenderPrivateAccess(runtime: IAgentRuntime, message: Memory): Promise<{
    entityId: UUID;
    role: RoleName;
    isOwner: boolean;
    isAdmin: boolean;
    canManageRoles: boolean;
    hasPrivateAccess: boolean;
    accessRole: RoleName | null;
    accessSource: "owner" | "manual" | "linked_manual" | null;
} | null>;
export declare function canModifyRole(actorRole: RoleName, targetCurrentRole: RoleName, newRole: RoleName): boolean;
export declare function resolveWorldForMessage(runtime: IAgentRuntime, message: Memory): Promise<{
    world: Awaited<ReturnType<IAgentRuntime["getWorld"]>>;
    metadata: RolesWorldMetadata;
} | null>;
export declare function resolveCanonicalOwnerIdForMessage(runtime: IAgentRuntime, message: Memory): Promise<string | null>;
export declare function checkSenderRole(runtime: IAgentRuntime, message: Memory): Promise<RoleCheckResult | null>;
export declare function isAgentSelf(runtime: IAgentRuntime | undefined, message: Memory | undefined): boolean;
/**
 * Injectable role-resolution seam for {@link hasRoleAccess} (#12087 Item 18).
 * Lets callers (e.g. plugin-manager/security.ts wrappers, and tests) substitute
 * the sender-role check / canonical-owner resolution without monkey-patching the
 * module.
 */
export type RoleAccessDeps = {
    checkSenderRole?: (runtime: IAgentRuntime, message: Memory) => Promise<RoleCheckResult | null>;
    resolveCanonicalOwnerIdForMessage?: (runtime: IAgentRuntime, message: Memory) => Promise<string | null | undefined>;
};
/**
 * Check whether the sender has at least the given role in the elizaOS
 * role hierarchy (OWNER > ADMIN > USER > GUEST).
 *
 * When there is no access context at all (no runtime / no sender entity — for
 * example local API calls), allow through so local-only usage follows the same
 * lenient path as plugin role gating. But when there IS a real sender whose
 * role simply cannot be resolved, use the same source-aware floor as Stage 1
 * context filtering.
 */
export declare function hasRoleAccess(runtime: IAgentRuntime | undefined, message: Memory | undefined, requiredRole: RoleName, deps?: RoleAccessDeps): Promise<boolean>;
/**
 * Persist the deployed-app owner as an EXPLICIT, auditable grant on a world's
 * metadata: `roles[ownerId] = "OWNER"` together with `roleSources[ownerId] =
 * "owner"`. Before this, the owner's OWNER status was emergent — inferred from
 * `ownership.ownerId` at read time and (at best) a bare `roles` entry with no
 * recorded source — so it could not be audited or distinguished from a manual /
 * connector grant (#9948). This records the grant and its provenance.
 *
 * Pure + idempotent: mutates `metadata` in place and returns `true` iff it
 * actually changed something (so callers only persist on a real change).
 */
export declare function recordOwnerGrant(metadata: RolesWorldMetadata, ownerId: string): boolean;
/**
 * Record an explicit, auditable role grant on a world's metadata: pairs
 * `roles[entityId] = role` with `roleSources[entityId] = source` (GUEST clears the
 * source, matching {@link setEntityRole}). Use when you hold the metadata but not
 * a Memory — {@link setEntityRole} needs a message and {@link recordOwnerGrant}
 * only records the canonical OWNER. Pure + idempotent: mutates `metadata` in place
 * and returns `true` iff it changed something (#12087 Item 11).
 */
export declare function recordRoleGrant(metadata: RolesWorldMetadata, entityId: string, role: RoleName, source?: RoleGrantSource): boolean;
export declare function setEntityRole(runtime: IAgentRuntime, message: Memory, targetEntityId: string, newRole: RoleName, source?: RoleGrantSource): Promise<Record<string, RoleName>>;
export {};
//# sourceMappingURL=roles.d.ts.map