/**
 * Optional-capability bridge to the "relationships" service for identity-cluster
 * resolution: `getRelatedEntityIds` expands an entity id to its cluster members
 * and `resolvePrimaryEntityId` collapses an alias to its canonical primary id.
 * Degrades to the identity function when the service, or the relevant method, is
 * absent, so callers can treat clustering as best-effort.
 */
import type { IAgentRuntime, UUID } from "./types/index.js";
export declare function getRelatedEntityIds(runtime: IAgentRuntime, entityId: UUID): Promise<UUID[]>;
export declare function resolvePrimaryEntityId(runtime: IAgentRuntime, entityId: UUID): Promise<UUID>;
//# sourceMappingURL=identity-clusters.d.ts.map