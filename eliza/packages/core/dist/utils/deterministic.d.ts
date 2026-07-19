/**
 * Seeded deterministic helpers: an FNV-1a string hash, a reproducible PRNG, and
 * seed-driven shuffle/sample/pick plus example-name generation, all keyed by a
 * string or number seed so the same seed always yields the same result. Also
 * provides stableStringify — key-order-independent JSON for stable hashing/IDs.
 */
export declare function buildDeterministicSeed(...parts: Array<string | number | null | undefined>): string;
export declare function hashStringToUint32(value: string): number;
export declare function createDeterministicRandom(seed: string | number): () => number;
export declare function deterministicShuffle<T>(items: readonly T[], seed: string | number): T[];
export declare function deterministicSample<T>(items: readonly T[], count: number, seed: string | number): T[];
export declare function deterministicPick<T>(items: readonly T[], seed: string | number): T | undefined;
export declare function getDeterministicNames(count: number, seed: string | number): string[];
export declare function stableStringify(value: unknown): string;
//# sourceMappingURL=deterministic.d.ts.map