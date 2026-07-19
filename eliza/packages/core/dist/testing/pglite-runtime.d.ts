/**
 * Shared PGLite runtime helper for tests.
 *
 * Creates a real AgentRuntime backed by an in-process PGLite database.
 * Use this instead of mocking the database — PGLite needs no API keys
 * and runs entirely in-process.
 *
 * Usage:
 *   let runtime: AgentRuntime;
 *   let cleanup: () => Promise<void>;
 *
 *   beforeAll(async () => {
 *     ({ runtime, cleanup } = await createTestRuntime());
 *   }, 180_000);
 *
 *   afterAll(async () => {
 *     await cleanup();
 *   });
 */
import { AgentRuntime } from "../runtime.js";
import type { Plugin } from "../types/index.js";
export interface TestRuntimeOptions {
    /** Name for the test agent character. Defaults to "TestAgent". */
    characterName?: string;
    /** Additional plugins to register (plugin-sql is always included). */
    plugins?: Plugin[];
    /** Reuse an existing PGLite data directory instead of creating a temp one. */
    pgliteDir?: string;
    /**
     * Remove the PGLite data directory during cleanup.
     * Defaults to true only when this helper created the directory.
     */
    removePgliteDirOnCleanup?: boolean;
    /**
     * Host-injected trajectory-write flush (the agent's `flushTrajectoryWrites`),
     * awaited during cleanup before the runtime stops. Injected so this core
     * `./testing` export never imports `@elizaos/agent` src (a reverse dependency
     * edge that silently degrades outside the monorepo checkout). When omitted,
     * cleanup relies on draining the trajectories service's own write queues.
     */
    flushTrajectoryWrites?: (runtime: AgentRuntime) => Promise<void>;
}
export interface TestRuntimeResult {
    runtime: AgentRuntime;
    pgliteDir: string;
    /** Stops the runtime and removes the temp PGLite directory. */
    cleanup: () => Promise<void>;
}
/**
 * Create a real AgentRuntime with a PGLite database in a temp directory.
 *
 * The runtime is fully initialized and ready for use. Call `cleanup()` in
 * afterAll to stop the runtime and remove the temp directory.
 *
 * Callers should use a generous timeout (e.g. `beforeAll(async () => { ... }, 180_000)`)
 * since PGLite initialization can take a few seconds.
 */
export declare function createTestRuntime(options?: TestRuntimeOptions): Promise<TestRuntimeResult>;
//# sourceMappingURL=pglite-runtime.d.ts.map