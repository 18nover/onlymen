import { type IAgentRuntime } from "../../types/index.js";
interface TextGenerationResult {
    text: string;
    usage: {
        inputTokens?: number;
        outputTokens?: number;
        totalTokens?: number;
    };
    finishReason?: string;
    response?: {
        id?: string;
        modelId?: string;
    };
}
import type { TextGenerationOptions } from "./types.js";
export declare function generateTextEmbedding(runtime: IAgentRuntime, text: string): Promise<{
    embedding: number[];
}>;
export declare function generateTextEmbeddingsBatch(runtime: IAgentRuntime, texts: string[], batchSize?: number): Promise<Array<{
    embedding: number[] | null;
    success: boolean;
    error?: unknown;
    index: number;
}>>;
export declare function generateText(runtime: IAgentRuntime, prompt: string, system?: string, overrideConfig?: TextGenerationOptions): Promise<TextGenerationResult>;
export {};
//# sourceMappingURL=llm.d.ts.map