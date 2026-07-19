/**
 * Game-Knowledge Rewards
 *
 * Compute rewards using perfect game information for RL training.
 *
 * @remarks These helpers are intentionally lightweight; environments can provide richer
 * reward computation by writing into `trajectory.totalReward` and `step.reward`.
 */
import type { JsonValue, Trajectory, TrajectoryStep } from "./types.js";
export declare function computeTrajectoryReward(trajectory: Trajectory): number;
export declare function computeStepReward(step: TrajectoryStep): number;
export declare function buildGameStateFromDB(_trajectoryId: string): Promise<Record<string, JsonValue>>;
export declare function recomputeTrajectoryRewards(_trajectoryIds: string[]): Promise<void>;
//# sourceMappingURL=game-rewards.d.ts.map