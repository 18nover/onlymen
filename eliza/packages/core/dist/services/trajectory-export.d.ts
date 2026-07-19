export { type TrajectoryPlaintextOptions, trajectoryToPlaintext, } from "../activity-plaintext.js";
import type { ElizaNativeTrajectoryRow, TrajectoryCacheStatsRecord, TrajectoryDetailRecord, TrajectoryExportOptions, TrajectoryExportResult, TrajectoryFlattenedLlmCallRecord, TrajectoryJsonShape, TrajectoryUsageTotalsRecord } from "./trajectory-types.js";
export declare function summarizeTrajectoryUsage(trajectory: TrajectoryDetailRecord): TrajectoryUsageTotalsRecord;
export declare function summarizeTrajectoryCache(trajectory: TrajectoryDetailRecord): TrajectoryCacheStatsRecord;
export declare function resolveTrajectoryStatus(trajectory: TrajectoryDetailRecord): NonNullable<TrajectoryDetailRecord["status"]>;
export declare function iterateTrajectoryLlmCalls(trajectory: TrajectoryDetailRecord): TrajectoryFlattenedLlmCallRecord[];
export declare function buildElizaNativeTrajectoryRows(trajectories: readonly TrajectoryDetailRecord[], options?: {
    includePrompts?: boolean;
}): ElizaNativeTrajectoryRow[];
export declare function resolveJsonShape(format: TrajectoryExportOptions["format"], jsonShape: TrajectoryJsonShape | undefined): TrajectoryJsonShape;
export declare function serializeTrajectoryExport(trajectories: readonly TrajectoryDetailRecord[], options: TrajectoryExportOptions): TrajectoryExportResult;
//# sourceMappingURL=trajectory-export.d.ts.map