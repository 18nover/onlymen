/**
 * @fileoverview Ollama Model Provider for Integration Testing
 *
 * Provides real inference through local Ollama instance.
 * This is used when no cloud API keys are configured.
 */
import type { GenerateTextParams, IAgentRuntime, ModelTypeName, TextEmbeddingParams } from "../types/index.js";
/**
 * Check if Ollama is available and responding
 */
export declare function isOllamaAvailable(): Promise<boolean>;
/**
 * List available models in Ollama
 */
export declare function listOllamaModels(): Promise<string[]>;
/**
 * Union type of all model parameter types for Ollama handlers
 */
type OllamaModelParams = GenerateTextParams | TextEmbeddingParams | string | null;
/**
 * Union type of all model result types for Ollama handlers
 */
type OllamaModelResult = string | number[];
/**
 * Model handler function type
 */
type ModelHandlerFn = (runtime: IAgentRuntime, params: OllamaModelParams) => Promise<OllamaModelResult>;
/**
 * Create all Ollama model handlers for registration
 */
export declare function createOllamaModelHandlers(): Partial<Record<ModelTypeName, ModelHandlerFn>>;
export {};
//# sourceMappingURL=ollama-provider.d.ts.map