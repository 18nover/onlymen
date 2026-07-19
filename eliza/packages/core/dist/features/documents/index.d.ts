/**
 * Barrel and plugin factory for the documents capability — elizaOS's native RAG
 * (document ingestion + retrieval). `createDocumentsPlugin` assembles the
 * `Plugin` that registers {@link DocumentService}, {@link documentsProvider},
 * and the DOCUMENT action, and disposes the service on unload. The
 * `documentsPlugin` / `documentsPluginCore` (provider-only) /
 * `documentsPluginHeadless` presets toggle the action and provider surfaces.
 * The module also re-exports the feature's public API: BM25 scoring, URL
 * ingestion, recall embedding, and the shared types.
 */
import type { Plugin } from "../../types/index.js";
export interface DocumentsPluginConfig {
    enableActions?: boolean;
    enableProviders?: boolean;
}
export declare function createDocumentsPlugin(config?: DocumentsPluginConfig): Plugin;
export declare const documentsPlugin: Plugin;
export declare const documentsPluginCore: Plugin;
export declare const documentsPluginHeadless: Plugin;
export default documentsPlugin;
export { documentAction, documentActions } from "./actions.js";
export type { Bm25Document, Bm25Options, Bm25Score } from "./bm25.js";
export { bm25Scores, normalizeBm25Scores, tokenize } from "./bm25.js";
export { documentsProvider } from "./provider.js";
export { aliasRecallQuery, embedRecallQuery } from "./recall-embed.js";
export type { SearchMode } from "./service.js";
export { DocumentService } from "./service.js";
export * from "./types.js";
export type { FetchDocumentFromUrlOptions, FetchedDocumentUrl, FetchedDocumentUrlKind, } from "./url-ingest.js";
export { __setDocumentUrlFetchImplForTests, fetchDocumentFromUrl, isYouTubeUrl, } from "./url-ingest.js";
//# sourceMappingURL=index.d.ts.map