/**
 * ART Format Conversion
 *
 * Converts our rich trajectory format to ART-compatible format.
 *
 * Key insight from ART examples:
 * - Trajectories are MESSAGE ARRAYS (system/user/assistant)
 * - Metadata is separate (for judge context)
 * - Single reward per trajectory
 * - Grouping by scenario for GRPO
 */
import type { ARTTrajectory, ChatMessage, Trajectory, TrajectoryGroup } from "./types.js";
/**
 * Convert rich trajectory to ART message format.
 */
export declare function toARTMessages(trajectory: Trajectory): ChatMessage[];
export declare function toARTTrajectory(trajectory: Trajectory): ARTTrajectory;
export declare function groupTrajectories(trajectories: Trajectory[]): TrajectoryGroup[];
export declare function extractSharedPrefix(trajectories: Trajectory[]): ChatMessage[];
export declare function removeSharedPrefix(messages: ChatMessage[], sharedPrefix: ChatMessage[]): ChatMessage[];
export declare function prepareForRULER(group: TrajectoryGroup): {
    sharedPrefix: ChatMessage[];
    suffixes: ChatMessage[][];
    metadata: ARTTrajectory["metadata"][];
};
export declare function toARTJSONL(trajectory: Trajectory): string;
export declare function validateARTCompatibility(trajectory: Trajectory): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
//# sourceMappingURL=art-format.d.ts.map