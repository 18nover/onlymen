/**
 * Abstract database schemas — the canonical data model for elizaOS.
 *
 * These SchemaTable objects define the structure of all core tables in a
 * database-agnostic format. Use buildBaseTables(adapter) to convert them
 * into concrete Drizzle table objects for a specific dialect.
 *
 * This module also exports advanced memory schemas (longTermMemories,
 * sessionSummaries, memoryAccessLogs) which are part of the enhanced
 * memory subsystem.
 */
import { longTermMemories, memoryAccessLogs, sessionSummaries } from "../features/advanced-memory/schemas/index.js";
import type { BuildTableFn, DialectAdapter } from "../types/schema-builder.js";
import { agentSchema } from "./agent.js";
import { cacheSchema } from "./cache.js";
import { channelSchema } from "./channel.js";
import { channelParticipantSchema } from "./channel-participant.js";
import { componentSchema } from "./component.js";
import { embeddingSchema } from "./embedding.js";
import { entitySchema } from "./entity.js";
import { entityIdentitySchema, entityMergeCandidateSchema, factCandidateSchema } from "./entity-identity.js";
export type { EntityMergeCandidateStatus, FactCandidateKind, FactCandidateStatus, } from "./entity-identity.js";
import { logSchema } from "./log.js";
import { memorySchema } from "./memory.js";
import { messageSchema } from "./message.js";
import { messageServerSchema } from "./message-server.js";
import { messageServerAgentSchema } from "./message-server-agent.js";
import { pairingAllowlistSchema } from "./pairing-allowlist.js";
import { pairingRequestSchema } from "./pairing-request.js";
import { participantSchema } from "./participant.js";
import { relationshipSchema } from "./relationship.js";
import { roomSchema } from "./room.js";
import { serverSchema } from "./server.js";
import { taskSchema } from "./task.js";
import { worldSchema } from "./world.js";
export { agentSchema, cacheSchema, channelParticipantSchema, channelSchema, componentSchema, embeddingSchema, entityIdentitySchema, entityMergeCandidateSchema, entitySchema, factCandidateSchema, logSchema, longTermMemories, memoryAccessLogs, memorySchema, messageSchema, messageServerAgentSchema, messageServerSchema, pairingAllowlistSchema, pairingRequestSchema, participantSchema, relationshipSchema, roomSchema, serverSchema, sessionSummaries, taskSchema, worldSchema, };
/**
 * Type for the object returned by buildBaseTables().
 * Represents all 20 core database tables as ORM table objects.
 */
export interface BaseTables {
    agent: unknown;
    cache: unknown;
    channel: unknown;
    channelParticipant: unknown;
    component: unknown;
    embedding: unknown;
    entity: unknown;
    log: unknown;
    memory: unknown;
    message: unknown;
    messageServer: unknown;
    messageServerAgent: unknown;
    pairingAllowlist: unknown;
    pairingRequest: unknown;
    participant: unknown;
    relationship: unknown;
    room: unknown;
    server: unknown;
    task: unknown;
    world: unknown;
}
/**
 * Factory: build all 20 base tables using the given dialect adapter and buildTable function.
 *
 * This is the single source of truth for the elizaOS data model. Plugins
 * import this function and pass their dialect adapter (pgAdapter, mysqlAdapter)
 * to get concrete ORM table objects.
 *
 * The buildTable function is provided by the plugin (e.g., from plugin-sql).
 *
 * @param buildTable - The buildTable function from the plugin
 * @param adapter - The dialect-specific adapter (pgAdapter or mysqlAdapter).
 * @returns An object with all 20 tables, keyed by camelCase name.
 */
export declare function buildBaseTables(buildTable: BuildTableFn, adapter: DialectAdapter): BaseTables;
//# sourceMappingURL=index.d.ts.map