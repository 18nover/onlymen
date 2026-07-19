/**
 * Agent provisioning: migrations, agent/entity/room setup, embedding dimension.
 * Runs once at deploy/daemon boot; not part of runtime.initialize().
 * Export from node entry point only (not browser/edge).
 *
 * WHY this module exists:
 * - Keeps the runtime a lean request handler; heavy one-time setup lives here.
 * - Edge and ephemeral runtimes can skip provisioning entirely (they don't import this).
 * - Daemon entry points call provisionAgent() once after initialize().
 */
import type { Character, UUID } from "./types/index.js";
import type { IDatabaseAdapter } from "./types/database.js";
import type { IAgentRuntime } from "./types/runtime.js";
export interface ProvisionAgentOptions {
    /** Run plugin schema migrations (DDL). Default true for daemon. */
    runMigrations?: boolean;
}
/**
 * Run plugin migrations (DDL) using the runtime's adapter and registered plugins.
 * WHY standalone: Migrations are a one-time basic-capabilities step; not part of initialize()
 * so ephemeral/edge runtimes never run them. process.env guards allow safe use in Node only.
 */
export declare function runPluginMigrations(runtime: IAgentRuntime): Promise<void>;
/**
 * Ensure agent row exists, then entity, self-room, and self-participant.
 * Uses batch adapter APIs (getAgentsByIds, createEntities, getRoomsByIds, etc.).
 * WHY: Agent must exist before the runtime can store memories/tasks; self-room and
 * participant are required for core conversation flow.
 */
export declare function ensureAgentInfrastructure(runtime: IAgentRuntime): Promise<void>;
/**
 * Set embedding dimension on the adapter from config (no LLM call).
 * Reads EMBEDDING_DIMENSIONS (plural, what the runtime embedder uses) or
 * EMBEDDING_DIMENSION (singular); plural wins on conflict. Skips if neither set.
 * WHY no LLM: Avoids a model call at boot; set the dimension in character
 * settings when using this path. If unset, embedding search may fail until dimension is set.
 */
export declare function ensureEmbeddingDimension(runtime: IAgentRuntime): Promise<void>;
/**
 * Orchestrator: run migrations (optional), ensure agent/entity/room/participant, set embedding dimension.
 * Call after runtime.initialize() in daemon mode.
 * WHY separate from initialize(): Ephemeral and edge runtimes do not call this;
 * only long-lived daemons run it once at boot.
 */
export declare function provisionAgent(runtime: IAgentRuntime, options?: ProvisionAgentOptions): Promise<void>;
/**
 * Read agent from DB and merge settings/secrets into the given character.
 * Returns a new Character; does not mutate the input.
 * If no agent exists in DB, returns the character unchanged.
 * Call before constructing the runtime so the runtime gets merged settings.
 * WHY before runtime: The runtime constructor does not touch the DB; the host
 * loads DB-backed config once and passes the merged character in.
 */
export declare function mergeDbSettings(character: Character, adapter: IDatabaseAdapter, agentId: UUID): Promise<Character>;
//# sourceMappingURL=provisioning.d.ts.map