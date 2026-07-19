/**
 * Vector-store table descriptor backing memory similarity search: one embedding
 * row per memory (enforced 1:1 by `unique_embedding_memory`), with a dedicated
 * column per supported width (384–3072) so a single table serves every model's
 * dimension. Portable `SchemaTable` shape assembled by `buildBaseTables`
 * (`schemas/index.ts`) and materialized by the plugin-sql / localdb adapters.
 */
import type { SchemaTable } from "../types/schema.js";
/**
 * Abstract schema for the embeddings table.
 * Contains 6 vector columns for different dimensions (384, 512, 768, 1024, 1536, 3072).
 */
export declare const embeddingSchema: SchemaTable;
//# sourceMappingURL=embedding.d.ts.map