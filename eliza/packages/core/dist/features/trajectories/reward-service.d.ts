/**
 * Heuristic Rewards
 *
 * Use heuristic scoring to score trajectories when game knowledge isn't available.
 */
import type { Trajectory } from "./types.js";
export interface RewardServiceOptions {
    archetype?: string;
    useHeuristics?: boolean;
}
export declare class RewardService {
    private options;
    constructor(options?: RewardServiceOptions);
    scoreTrajectory(trajectory: Trajectory): Promise<number>;
    scoreTrajectoryGroup(trajectories: Trajectory[]): Promise<number[]>;
    private computeHeuristicReward;
    private normalizePnL;
    private normalizeScore;
    private normalizeScoresForGroup;
}
export declare function createRewardService(options?: RewardServiceOptions): RewardService;
export declare function scoreTrajectory(trajectory: Trajectory): Promise<number>;
export declare function scoreTrajectoryGroup(trajectories: Trajectory[]): Promise<number[]>;
//# sourceMappingURL=reward-service.d.ts.map