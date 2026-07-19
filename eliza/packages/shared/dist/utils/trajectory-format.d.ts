/** Display formatters for trajectory logs: human-readable durations (ms/s/m) and timestamps, for the trajectory viewer UI. */
export declare function formatTrajectoryDuration(ms: number | null): string;
export declare function formatTrajectoryTimestamp(iso: string, mode: "smart" | "detailed"): string;
export declare function formatTrajectoryTokenCount(count: number | undefined, options: {
    emptyLabel: string;
}): string;
//# sourceMappingURL=trajectory-format.d.ts.map