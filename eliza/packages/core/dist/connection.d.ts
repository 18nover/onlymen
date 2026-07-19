/**
 * Standalone connection management: ensure entity/world/room/participants.
 * Batch-first: ensureConnections does 4 batch operations (upsertEntities, upsertWorlds,
 * upsertRooms, createRoomParticipants per room); ensureConnection is a single-connection wrapper.
 * Use these directly with adapter, or via runtime.ensureConnection() which delegates here.
 *
 * WHY standalone + batch: Callers can ensure many connections in one go without going through
 * the runtime; batch APIs reduce DB round-trips. Safe to use from both Node and edge entry points.
 */
import type { JsonValue, UUID } from "./types/index.js";
import { ChannelType } from "./types/index.js";
import type { IDatabaseAdapter } from "./types/database.js";
export interface EnsureConnectionParams {
    agentId: UUID;
    entityId: UUID;
    roomId: UUID;
    roomName?: string;
    /** Required if messageServerId is not provided. */
    worldId?: UUID;
    worldName?: string;
    userName?: string;
    name?: string;
    source: string;
    type?: ChannelType | string;
    channelId?: string;
    messageServerId?: UUID;
    userId?: UUID;
    metadata?: Record<string, JsonValue>;
}
export interface EnsureConnectionsParams {
    agentId: UUID;
    connections: EnsureConnectionParams[];
}
export interface EnsureConnectionsResult {
    createdRoomParticipants: number;
}
/**
 * Batch: upsert entities, worlds, rooms; then add participants per room.
 * Uses 4 batch operations (upsertEntities, upsertWorlds, upsertRooms, createRoomParticipants per room).
 * WHY batch: Minimizes round-trips when syncing many connections (e.g. many users/rooms at once).
 */
export declare function ensureConnections(adapter: IDatabaseAdapter, params: EnsureConnectionsParams): Promise<EnsureConnectionsResult>;
/**
 * Single-connection wrapper around ensureConnections.
 * WHY: Convenience for the common case of ensuring one entity/room; runtime.ensureConnection() uses this.
 */
export declare function ensureConnection(adapter: IDatabaseAdapter, params: EnsureConnectionParams): Promise<EnsureConnectionsResult>;
//# sourceMappingURL=connection.d.ts.map