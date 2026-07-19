/**
 * Choose how many items to include so estimated character total stays within a
 * target budget.
 *
 * WHY: Providers often fetch a superset of data, then need to keep prompt size
 * bounded. One fetch + in-memory selection avoids extra DB round trips while
 * still adapting to item size (short items -> more fit, long items -> fewer).
 */
export declare function sliceToFitBudget<T>(items: T[], estimateChars: (item: T) => number, targetChars: number, options?: {
    fromEnd?: boolean;
}): T[];
//# sourceMappingURL=slice-to-fit-budget.d.ts.map