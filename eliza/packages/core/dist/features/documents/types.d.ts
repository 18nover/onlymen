/**
 * Type and schema definitions for the documents capability: the stored-document
 * shape, document/fragment memory metadata, visibility scopes, added-by role and
 * source enums, load results, and the `ModelConfigSchema` zod schema (embedding /
 * text-provider selection, rate-limit knobs, and startup-load config). Also
 * registers the `DOCUMENTS: "documents"` entry into the runtime
 * `ServiceTypeRegistry`. Shared across `service.ts`, `provider.ts`, and the
 * document processors.
 */
import z from "zod";
import type { Content, DocumentMetadata, FragmentMetadata, MemoryType, UUID } from "../../types/index.js";
/**
 * Local metadata type for stored document items.
 * Uses a permissive record type to avoid conflicts between TypeScript and protobuf MemoryMetadata types.
 */
export type StoredDocumentMetadata = Record<string, unknown>;
/**
 * Stored document item with content, metadata, and optional similarity score.
 * Used for document retrieval results and internal document processing.
 */
export interface StoredDocument {
    id: UUID;
    content: Content;
    metadata?: StoredDocumentMetadata;
    worldId?: UUID;
    similarity?: number;
}
export declare const ModelConfigSchema: z.ZodObject<{
    EMBEDDING_PROVIDER: z.ZodOptional<z.ZodEnum<{
        local: "local";
        openai: "openai";
        google: "google";
    }>>;
    TEXT_PROVIDER: z.ZodOptional<z.ZodEnum<{
        anthropic: "anthropic";
        openai: "openai";
        google: "google";
        openrouter: "openrouter";
    }>>;
    OPENAI_API_KEY: z.ZodOptional<z.ZodString>;
    ANTHROPIC_API_KEY: z.ZodOptional<z.ZodString>;
    OPENROUTER_API_KEY: z.ZodOptional<z.ZodString>;
    GOOGLE_API_KEY: z.ZodOptional<z.ZodString>;
    OPENAI_BASE_URL: z.ZodOptional<z.ZodString>;
    ANTHROPIC_BASE_URL: z.ZodOptional<z.ZodString>;
    OPENROUTER_BASE_URL: z.ZodOptional<z.ZodString>;
    GOOGLE_BASE_URL: z.ZodOptional<z.ZodString>;
    TEXT_EMBEDDING_MODEL: z.ZodString;
    TEXT_MODEL: z.ZodOptional<z.ZodString>;
    MAX_INPUT_TOKENS: z.ZodPipe<z.ZodUnion<[z.ZodString, z.ZodNumber]>, z.ZodTransform<number, string | number>>;
    MAX_OUTPUT_TOKENS: z.ZodPipe<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, z.ZodTransform<number, string | number | undefined>>;
    EMBEDDING_DIMENSION: z.ZodPipe<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, z.ZodTransform<number, string | number | undefined>>;
    LOAD_DOCS_ON_STARTUP: z.ZodDefault<z.ZodBoolean>;
    CTX_DOCUMENTS_ENABLED: z.ZodDefault<z.ZodBoolean>;
    RATE_LIMIT_ENABLED: z.ZodDefault<z.ZodBoolean>;
    MAX_CONCURRENT_REQUESTS: z.ZodPipe<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, z.ZodTransform<number, string | number | undefined>>;
    REQUESTS_PER_MINUTE: z.ZodPipe<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, z.ZodTransform<number, string | number | undefined>>;
    TOKENS_PER_MINUTE: z.ZodPipe<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, z.ZodTransform<number, string | number | undefined>>;
    BATCH_DELAY_MS: z.ZodPipe<z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>, z.ZodTransform<number, string | number | undefined>>;
}, z.core.$strip>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export interface ProviderRateLimits {
    maxConcurrentRequests: number;
    requestsPerMinute: number;
    tokensPerMinute?: number;
    provider: string;
    rateLimitEnabled: boolean;
    batchDelayMs: number;
}
export interface TextGenerationOptions {
    provider?: "anthropic" | "openai" | "openrouter" | "google";
    modelName?: string;
    maxTokens?: number;
    cacheDocument?: string;
    cacheOptions?: {
        type: "ephemeral";
    };
    autoCacheContextualRetrieval?: boolean;
}
export interface AddDocumentOptions {
    agentId?: UUID;
    worldId: UUID;
    roomId: UUID;
    entityId: UUID;
    clientDocumentId: UUID;
    contentType: string;
    originalFilename: string;
    content: string;
    scope?: DocumentVisibilityScope;
    scopedToEntityId?: UUID;
    addedBy?: UUID;
    addedByRole?: DocumentAddedByRole;
    addedFrom?: DocumentAddedFrom;
    metadata?: Record<string, unknown>;
}
declare module "../../types/service.ts" {
    interface ServiceTypeRegistry {
        DOCUMENTS: "documents";
    }
}
export declare const DocumentServiceType: {
    DOCUMENTS: "documents";
};
export type DocumentVisibilityScope = "global" | "owner-private" | "user-private" | "agent-private";
export type DocumentAddedByRole = "OWNER" | "ADMIN" | "USER" | "AGENT" | "RUNTIME";
export type DocumentAddedFrom = "import" | "chat" | "upload" | "url" | "file" | "agent-autonomous" | "runtime-internal" | "lifeops" | "default-seed" | "character";
export interface DocumentMetadataExtended extends Record<string, unknown> {
    type: string;
    source: string;
    title?: string;
    filename?: string;
    fileExt?: string;
    fileType?: string;
    fileSize?: number;
}
export interface DocumentMemoryMetadata extends DocumentMetadata, Record<string, unknown> {
    type: typeof MemoryType.DOCUMENT;
    documentId: UUID;
    source: string;
    scope?: DocumentVisibilityScope;
    scopedToEntityId?: UUID;
    addedBy?: UUID;
    addedByRole?: DocumentAddedByRole;
    addedFrom?: DocumentAddedFrom;
    addedAt?: number;
    title?: string;
    filename?: string;
    originalFilename?: string;
    fileExt?: string;
    fileType?: string;
    contentType?: string;
    fileSize?: number;
    textBacked?: boolean;
    timestamp?: number;
    editedAt?: number;
    /** Served original-bytes file (content-addressed) linked to this document. */
    mediaUrl?: string;
    /** Served original-bytes file (content-addressed) linked to this document. */
    mediaHash?: string;
    /** Served original-bytes file (content-addressed) linked to this document. */
    mediaFileName?: string;
}
export interface DocumentFragmentMemoryMetadata extends FragmentMetadata, Record<string, unknown> {
    type: typeof MemoryType.FRAGMENT;
    documentId: UUID;
    scope?: DocumentVisibilityScope;
    scopedToEntityId?: UUID;
    addedBy?: UUID;
    addedByRole?: DocumentAddedByRole;
    addedFrom?: DocumentAddedFrom;
    addedAt?: number;
    position: number;
    source?: string;
    documentTitle?: string;
    timestamp?: number;
}
export interface DocumentsConfig {
    CTX_DOCUMENTS_ENABLED: boolean;
    LOAD_DOCS_ON_STARTUP: boolean;
    MAX_INPUT_TOKENS?: string | number;
    MAX_OUTPUT_TOKENS?: string | number;
    EMBEDDING_PROVIDER?: string;
    TEXT_PROVIDER?: string;
    TEXT_EMBEDDING_MODEL?: string;
    RATE_LIMIT_ENABLED?: boolean;
    MAX_CONCURRENT_REQUESTS?: number;
    REQUESTS_PER_MINUTE?: number;
    TOKENS_PER_MINUTE?: number;
    BATCH_DELAY_MS?: number;
}
export interface LoadResult {
    successful: number;
    failed: number;
    errors?: Array<{
        filename: string;
        error: string;
    }>;
}
export interface ExtendedMemoryMetadata extends Record<string, unknown> {
    type?: string;
    scope?: DocumentVisibilityScope;
    scopedToEntityId?: string;
    userId?: string;
    agentId?: string;
    title?: string;
    filename?: string;
    path?: string;
    description?: string;
    fileExt?: string;
    timestamp?: number;
    contentType?: string;
    documentId?: string;
    source?: string;
    fileType?: string;
    fileSize?: number;
    position?: number;
    originalFilename?: string;
    url?: string;
}
//# sourceMappingURL=types.d.ts.map