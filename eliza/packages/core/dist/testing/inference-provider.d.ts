/**
 * @fileoverview Inference Provider Detection and Validation
 *
 * Detects available inference providers and ensures tests have access to
 * real inference capabilities. Throws errors if no provider is found.
 */
/**
 * Detected inference provider information
 */
export interface InferenceProviderInfo {
    /** Provider name (e.g., "ollama", "openai", "anthropic") */
    name: string;
    /** Whether the provider is available */
    available: boolean;
    /** Endpoint URL if applicable */
    endpoint?: string;
    /** Available models if detectable */
    models?: string[];
    /** Error message if provider check failed */
    error?: string;
}
/**
 * Result of inference provider detection
 */
export interface InferenceProviderDetectionResult {
    /** Whether any inference provider is available */
    hasProvider: boolean;
    /** The primary provider to use */
    primaryProvider: InferenceProviderInfo | null;
    /** All detected providers */
    allProviders: InferenceProviderInfo[];
    /** Summary message for logging */
    summary: string;
}
/**
 * Detect all available inference providers
 */
export declare function detectInferenceProviders(): Promise<InferenceProviderDetectionResult>;
/**
 * Validate that an inference provider is available for testing.
 * Throws an error with helpful instructions if no provider is found.
 */
export declare function requireInferenceProvider(): Promise<InferenceProviderInfo>;
/**
 * Check if any inference provider is available without throwing
 */
export declare function hasInferenceProvider(): Promise<boolean>;
//# sourceMappingURL=inference-provider.d.ts.map