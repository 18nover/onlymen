/**
 * Real runtime helper for integration tests.
 *
 * Extends pglite-runtime.ts with optional real LLM and connector plugins.
 * This is the primary helper for converting mocked tests to real integration tests.
 *
 * Usage:
 *   import { createRealTestRuntime } from "../../test/helpers/real-runtime.js";
 *
 *   let runtime: AgentRuntime;
 *   let cleanup: () => Promise<void>;
 *
 *   beforeAll(async () => {
 *     ({ runtime, cleanup } = await createRealTestRuntime({ withLLM: true }));
 *   }, 180_000);
 *
 *   afterAll(async () => { await cleanup(); });
 */
import { AgentRuntime } from "../runtime.js";
import type { Plugin } from "../types/index.js";
import { type LiveProviderConfig, type LiveProviderName } from "./live-provider.js";
export interface RealTestRuntimeOptions {
    /** Name for the test agent character. Defaults to "TestAgent". */
    characterName?: string;
    /** Additional plugins to register. */
    plugins?: Plugin[];
    /** Register a real LLM plugin based on available API keys. Default: false. */
    withLLM?: boolean;
    /** Preferred LLM provider (e.g., "groq" for cheapest). */
    preferredProvider?: LiveProviderName;
    /** Register Discord plugin if DISCORD_BOT_TOKEN is available. Default: false. */
    withDiscord?: boolean;
    /** Register Telegram plugin if TELEGRAM_BOT_TOKEN is available. Default: false. */
    withTelegram?: boolean;
    /** Reuse an existing PGLite data directory. */
    pgliteDir?: string;
    /** Remove PGLite dir on cleanup. Defaults to true when dir is auto-created. */
    removePgliteDirOnCleanup?: boolean;
    /**
     * Host-injected configure step for the local-embedding plugin (the agent's
     * `configureLocalEmbeddingPlugin`). Injected so this core `./testing` export
     * never imports `@elizaos/agent` src (a reverse dependency edge that silently
     * degrades outside the monorepo checkout). Only consulted on the `withLLM`
     * fallback path when no live provider is available; when omitted the embedding
     * plugin is registered as-is.
     */
    configureEmbeddingPlugin?: (plugin: Plugin) => void;
    /**
     * Host-injected trajectory-write flush (the agent's `flushTrajectoryWrites`),
     * awaited during cleanup before the runtime stops. Injected for the same
     * reason as {@link configureEmbeddingPlugin}; when omitted, cleanup relies on
     * draining the trajectories service's own write queues.
     */
    flushTrajectoryWrites?: (runtime: AgentRuntime) => Promise<void>;
}
export interface RealTestRuntimeResult {
    runtime: AgentRuntime;
    pgliteDir: string;
    /** Which LLM provider was registered (null if withLLM was false or none available). */
    providerName: LiveProviderName | null;
    /** The full provider config if an LLM was registered. */
    providerConfig: LiveProviderConfig | null;
    /** Stops the runtime and removes the temp PGLite directory. */
    cleanup: () => Promise<void>;
}
/**
 * Create a real AgentRuntime with PGLite database and optional real LLM/connectors.
 *
 * This is the go-to helper for integration tests. It creates a fully initialized
 * runtime backed by a real in-process PGLite database, with optional real LLM
 * inference and connector plugins.
 */
export declare function createRealTestRuntime(options?: RealTestRuntimeOptions): Promise<RealTestRuntimeResult>;
//# sourceMappingURL=real-runtime.d.ts.map