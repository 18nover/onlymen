/**
 * Trajectory Export Utilities
 *
 * The original implementation targeted a Feed-specific database + HuggingFace upload pipeline.
 * In elizaOS core, this module is storage-agnostic and focuses on preparing files for downstream
 * training (JSONL / grouped JSON).
 */
import type { Trajectory } from "./types.js";
export interface ExportOptions {
    datasetName: string;
    huggingFaceToken?: string;
    startDate?: Date;
    endDate?: Date;
    agentIds?: string[];
    scenarioIds?: string[];
    minReward?: number;
    maxReward?: number;
    includeJudged?: boolean;
    maxTrajectories?: number;
    format?: "jsonl" | "parquet" | "arrow";
    splitRatio?: {
        train: number;
        validation: number;
        test: number;
    };
    trajectories?: Trajectory[];
    outputPath?: string;
    outputDir?: string;
}
export interface ExportResult {
    success: boolean;
    trajectoriesExported: number;
    datasetUrl?: string;
    error?: string;
}
export declare function exportToHuggingFace(options: ExportOptions): Promise<ExportResult>;
export declare function exportGroupedByScenario(options: ExportOptions): Promise<ExportResult>;
export declare function exportForOpenPipeART(options: ExportOptions): Promise<ExportResult>;
export declare function exportGroupedForGRPO(options: ExportOptions): Promise<ExportResult>;
//# sourceMappingURL=export.d.ts.map