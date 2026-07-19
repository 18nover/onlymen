import { type Entity, type IAgentRuntime, type Memory, type State, type UUID, type World } from "./types/index.js";
/**
 * Component-visibility filtering decides trust from each source entity's
 * RESOLVED effective role, not the raw `world.metadata.roles[sourceEntityId]`
 * literal. `resolveEntityRole` demotes a stored OWNER grant to GUEST under a
 * configured canonical owner and honors connector-admin revocation, so keying
 * off the literal would keep a stale OWNER grant trusted and leak another
 * entity's components. Because `resolveEntityRole` is async, each source
 * entity's role is batch-resolved once before the synchronous component filter;
 * only resolved ADMIN-or-higher is trusted. Returns the set of source entity ids
 * whose components are trusted for this world. (#12087 Item 16)
 */
export declare function resolveTrustedComponentSourceIds(runtime: IAgentRuntime, world: World | null, components: NonNullable<Entity["components"]>): Promise<Set<string>>;
export declare function findEntityByName(runtime: IAgentRuntime, message: Memory, state: State): Promise<Entity | null>;
export declare const createUniqueUuid: (runtime: IAgentRuntime, baseUserId: UUID | string) => UUID;
export declare function getEntityDetails({ runtime, roomId, }: {
    runtime: IAgentRuntime;
    roomId: UUID;
}): Promise<any>;
export declare function formatEntities({ entities }: {
    entities: Entity[];
}): string;
//# sourceMappingURL=entities.d.ts.map