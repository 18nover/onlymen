/**
 * Read-side access-control filter for memories: maps an {@link AccessContext}
 * to a scope-ladder actor, decides whether that actor may read a memory of a
 * given {@link MemoryScope}, and subtractively filters a memory array down to
 * the readable set.
 *
 * Composes with — never duplicates — Postgres RLS: RLS gates on
 * `entity_id`/`server_id`, this gates on `metadata.scope`. For the four
 * document scopes the ladder is byte-identical to the documents plugin's
 * `canReadDocumentMemory`, so that plugin can delegate here without behavior
 * change; keep the two in lockstep. An unresolved role fails closed to the
 * least-privileged `USER` tier.
 */
import { type RoleName } from "../roles.js";
import type { AccessContext, Memory, MemoryScope, UUID } from "../types/index.js";
/**
 * Read-side actor role: the core {@link RoleName} widened with the machine
 * tiers the scope ladder recognizes — `AGENT` (an agent reading its own store)
 * and `RUNTIME` (the documents read path that delegates to this ladder).
 * {@link actorFromAccessContext} only ever yields `OWNER`/`USER`/`AGENT`;
 * `RUNTIME` is supplied by the documents plugin, never minted from a message.
 */
export type ActorRole = RoleName | "AGENT" | "RUNTIME";
export interface ScopeActor {
    entityId: UUID;
    role: ActorRole;
}
/**
 * Collapse an {@link AccessContext} into the scope-ladder actor. A self-read
 * (requester is the agent) is `AGENT`; OWNER/ADMIN manage owner-scoped
 * memories; everyone else (USER/GUEST, or no role at all — e.g. a DM that
 * resolved no world) is `USER`, the least-privileged tier, so an unresolved
 * role fails closed rather than open.
 */
export declare function actorFromAccessContext(ctx: AccessContext, agentId: UUID): ScopeActor;
/**
 * Whether `actor` may read a memory of the given `scope`. For the four document
 * scopes this is byte-equivalent to the documents plugin's `canReadDocumentMemory`
 * so that plugin can delegate here without changing behavior. The generic core
 * scopes fold in: `shared`/`room` read like `global`, `private` like
 * `user-private`. `scopedEntityId` is the memory's owning entity (used only by
 * the entity-scoped tiers); `opts.scopedToEntityId` lets an OWNER read on behalf
 * of a specific entity, matching the documents filter.
 */
export declare function canReadScope(scope: MemoryScope, scopedEntityId: UUID | undefined, actor: ScopeActor, opts?: {
    scopedToEntityId?: UUID;
}): boolean;
/**
 * Filter memories down to those `ctx`'s requester may read. A pure, strictly
 * subtractive `.filter()`: it composes with (never duplicates) Postgres RLS,
 * which gates on `entity_id`/`server_id` while this gates on `metadata.scope`.
 * Scope defaults to `global` when absent; the owning entity is taken from
 * `metadata.scopedToEntityId`, else `metadata.addedBy`, else `memory.entityId`
 * (mirroring the documents plugin).
 */
export declare function filterByAccessContext(memories: Memory[], ctx: AccessContext, agentId: UUID): Memory[];
//# sourceMappingURL=filter.d.ts.map