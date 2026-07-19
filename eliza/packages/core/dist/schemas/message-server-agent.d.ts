/**
 * Junction table descriptor for `message_server_agents` — the many-to-many link
 * between message servers and the agents attached to them, keyed by the
 * composite PK (message_server_id, agent_id). Portable `SchemaTable` shape
 * assembled by `buildBaseTables` and materialized by the plugin-sql / localdb
 * adapters.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the message_server_agents table.
 * Junction table with composite primary key.
 */
export declare const messageServerAgentSchema: SchemaTable;
//# sourceMappingURL=message-server-agent.d.ts.map