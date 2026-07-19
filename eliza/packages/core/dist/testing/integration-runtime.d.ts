/**
 * @fileoverview Integration Runtime Factory
 *
 * Creates real AgentRuntime instances for integration testing with:
 * - Real PGLite/Postgres database (via @elizaos/plugin-sql)
 * - Real inference providers (Ollama, OpenAI, Anthropic, etc.)
 *
 * NO MOCKS. Tests require real infrastructure.
 */
import type { Character, IAgentRuntime, IDatabaseAdapter, Plugin, UUID } from "../types/index.js";
import { type InferenceProviderInfo } from "./inference-provider.js";
/**
 * Configuration for creating an integration test runtime
 */
export interface IntegrationTestConfig {
    /** Character configuration for the test agent */
    character?: Partial<Character>;
    /** Additional plugins to load */
    plugins?: Plugin[];
    /**
     * Database adapter - REQUIRED for integration tests.
     * Use @elizaos/plugin-sql to create one.
     */
    databaseAdapter: IDatabaseAdapter;
    /** Skip inference provider check (for database-only tests) */
    skipInferenceCheck?: boolean;
    /** Timeout for initialization in ms (default: 30000) */
    initTimeout?: number;
}
/**
 * Result from creating an integration test runtime
 */
export interface IntegrationTestResult {
    /** The fully initialized AgentRuntime */
    runtime: IAgentRuntime;
    /** Agent ID for this test */
    agentId: UUID;
    /** The inference provider being used */
    inferenceProvider: InferenceProviderInfo | null;
    /** Cleanup function to call after test */
    cleanup: () => Promise<void>;
}
/**
 * Default test character for integration tests
 */
export declare const DEFAULT_TEST_CHARACTER: Character;
/**
 * Creates a fully initialized AgentRuntime for integration testing.
 */
export declare function createIntegrationTestRuntime(config: IntegrationTestConfig): Promise<IntegrationTestResult>;
/**
 * Convenience wrapper that handles setup and cleanup automatically.
 */
export declare function withTestRuntime<T>(testFn: (runtime: IAgentRuntime, agentId: UUID) => Promise<T>, config: IntegrationTestConfig): Promise<T>;
//# sourceMappingURL=integration-runtime.d.ts.map