/**
 * Core ingestion pipeline for the documents capability: turns raw document text
 * into stored, embedded FRAGMENT memories. `processFragmentsSynchronously`
 * splits text into overlapping token-sized chunks, optionally contextualizes
 * each chunk through an LLM (the contextual-retrieval step, gated by
 * CTX_DOCUMENTS_ENABLED), generates embeddings (batched or one-at-a-time via the
 * runtime's TEXT_EMBEDDING model), and persists each fragment with
 * `runtime.createMemory`. A token/request rate limiter derived from
 * {@link getProviderRateLimits} throttles the calls, and 429s are retried. Also
 * exposes `extractTextFromDocument` (PDF and text extraction) and
 * `createDocumentMemory` (the parent DOCUMENT memory record).
 */
import type { Buffer } from "node:buffer";
import { type IAgentRuntime, type Memory, type UUID } from "../../types/index.js";
export declare function processFragmentsSynchronously({ runtime, documentId, fullDocumentText, agentId, contentType, roomId, entityId, worldId, documentTitle, documentMetadata, }: {
    runtime: IAgentRuntime;
    documentId: UUID;
    fullDocumentText: string;
    agentId: UUID;
    contentType?: string;
    roomId?: UUID;
    entityId?: UUID;
    worldId?: UUID;
    documentTitle?: string;
    documentMetadata?: Record<string, unknown>;
}): Promise<number>;
export declare function extractTextFromDocument(fileBuffer: Buffer, contentType: string, originalFilename: string): Promise<string>;
export declare function createDocumentMemory({ text, agentId, clientDocumentId, originalFilename, contentType, worldId, fileSize, documentId, customMetadata, }: {
    text: string;
    agentId: UUID;
    clientDocumentId: UUID;
    originalFilename: string;
    contentType: string;
    worldId: UUID;
    fileSize: number;
    documentId?: UUID;
    customMetadata?: Record<string, unknown>;
}): Memory;
//# sourceMappingURL=document-processor.d.ts.map