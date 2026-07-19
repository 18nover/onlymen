/**
 * Bridges the advanced-memory providers to the trajectory recorder: forwards a
 * provider-access telemetry record (name, purpose, data, query) to the
 * "trajectories" service so a captured run shows what context each memory
 * provider injected. Resolves the trajectory step id from the message metadata
 * or the ambient trajectory context, no-ops when neither is present, and
 * swallows every error so telemetry never interrupts the message path.
 */
import type { IAgentRuntime, Memory } from "../../types/index.js";
export declare function logAdvancedMemoryTrajectory(params: {
    runtime: IAgentRuntime;
    message?: Memory;
    providerName: string;
    purpose: string;
    data: Record<string, string | number | boolean | null>;
    query?: Record<string, string | number | boolean | null>;
}): void;
//# sourceMappingURL=trajectory.d.ts.map