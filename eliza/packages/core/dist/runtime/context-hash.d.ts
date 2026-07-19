export type StableJsonValue = string | number | boolean | null | readonly StableJsonValue[] | {
    readonly [key: string]: StableJsonValue | undefined;
};
export interface HashablePromptSegment {
    content: string;
    stable?: boolean;
    id?: string;
    label?: string;
    metadata?: StableJsonValue;
}
export interface SegmentHash {
    index: number;
    hash: string;
    contentHash: string;
    stable: boolean;
}
export interface PrefixHash {
    index: number;
    hash: string;
    segmentHash: string;
}
export declare function hashString(value: string): string;
export declare function stableJsonStringify(value: unknown): string;
export declare function hashStableJson(value: unknown): string;
export declare function hashPromptSegment(segment: HashablePromptSegment): SegmentHash;
export declare function hashPromptSegments(segments: readonly HashablePromptSegment[]): SegmentHash[];
export declare function computePrefixHashes(segments: readonly HashablePromptSegment[]): PrefixHash[];
//# sourceMappingURL=context-hash.d.ts.map