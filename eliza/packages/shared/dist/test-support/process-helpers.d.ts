/** Test helper: builds a lightweight mock `ChildProcess` that emits a scripted error or close event, so consumer tests can drive process-spawn code without spawning real processes. */
import type { ChildProcess } from "node:child_process";
type MockSpawnOptions = {
    exitCode: number;
    stderrOutput?: string;
    emitError?: Error;
};
/**
 * Create a lightweight mocked ChildProcess that emits either an error event
 * or a close event (with optional stderr output) on the next tick.
 */
export declare function createMockChildProcess(options: MockSpawnOptions): ChildProcess;
export {};
//# sourceMappingURL=process-helpers.d.ts.map