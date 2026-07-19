/**
 * Deterministic, non-cryptographic string hash. Multiplies by 31 per character
 * (the classic JVM `String.hashCode` mixing), keeps the running value in int32
 * via `| 0`, and returns a non-negative number.
 *
 * Used by the hero-art generators to seed palettes/hues/offsets so the same
 * input always produces byte-identical SVG output across runs and platforms.
 * Not suitable for security or collision-sensitive use.
 */
export declare function hashString(value: string): number;
//# sourceMappingURL=string-hash.d.ts.map