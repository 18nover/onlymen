/**
 * Builds the contextual-chunk-enrichment prompts for document ingestion — the
 * "contextual retrieval" step that situates each chunk within its document
 * before embedding. Exposes content-type-aware system and user prompt builders
 * (default / code / pdf / math / technical), MIME-type→template selection,
 * token-target sizing, and the heuristics (`containsMathematicalContent`,
 * `isTechnicalDocumentation`) that choose a template. Consumed by
 * document-processor.ts when CTX_DOCUMENTS_ENABLED is set.
 */
export declare const DEFAULT_CHUNK_TOKEN_SIZE = 500;
export declare const DEFAULT_CHUNK_OVERLAP_TOKENS = 100;
export declare const DEFAULT_CHARS_PER_TOKEN = 3.5;
export declare const CONTEXT_TARGETS: {
    DEFAULT: {
        MIN_TOKENS: number;
        MAX_TOKENS: number;
    };
    PDF: {
        MIN_TOKENS: number;
        MAX_TOKENS: number;
    };
    MATH_PDF: {
        MIN_TOKENS: number;
        MAX_TOKENS: number;
    };
    CODE: {
        MIN_TOKENS: number;
        MAX_TOKENS: number;
    };
    TECHNICAL: {
        MIN_TOKENS: number;
        MAX_TOKENS: number;
    };
};
type ContentType = "default" | "code" | "pdf" | "math" | "technical";
interface BuildPromptArgs {
    contentType: ContentType;
    includeFullDocument: boolean;
}
export declare function buildEnrichmentSystemPrompt(args: {
    contentType: ContentType;
}): string;
export declare function buildEnrichmentPrompt(args: BuildPromptArgs): string;
export declare const SYSTEM_PROMPT: string;
export declare const SYSTEM_PROMPTS: {
    DEFAULT: string;
    CODE: string;
    PDF: string;
    MATH_PDF: string;
    TECHNICAL: string;
};
export declare const CONTEXTUAL_CHUNK_ENRICHMENT_PROMPT_TEMPLATE: string;
export declare const CACHED_CHUNK_PROMPT_TEMPLATE: string;
export declare const CACHED_CODE_CHUNK_PROMPT_TEMPLATE: string;
export declare const CACHED_MATH_PDF_PROMPT_TEMPLATE: string;
export declare const CACHED_TECHNICAL_PROMPT_TEMPLATE: string;
export declare const MATH_PDF_PROMPT_TEMPLATE: string;
export declare const CODE_PROMPT_TEMPLATE: string;
export declare const TECHNICAL_PROMPT_TEMPLATE: string;
export declare function getContextualizationPrompt(docContent: string, chunkContent: string, minTokens?: number, maxTokens?: number, promptTemplate?: string): string;
export declare function getCachingContextualizationPrompt(chunkContent: string, contentType?: string, minTokens?: number, maxTokens?: number): {
    prompt: string;
    systemPrompt: string;
};
export declare function getPromptForMimeType(mimeType: string, docContent: string, chunkContent: string): string;
export declare function getCachingPromptForMimeType(mimeType: string, chunkContent: string): {
    prompt: string;
    systemPrompt: string;
};
export declare function getChunkWithContext(chunkContent: string, generatedContext: string): string;
export {};
//# sourceMappingURL=ctx-embeddings.d.ts.map