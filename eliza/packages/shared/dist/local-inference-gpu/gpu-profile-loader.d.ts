import { type GpuYamlId, GpuYamlProfile } from "./gpu-profile-schema.js";
/**
 * Test-only override hook. When set, `detectGpuFromNvidiaSmi` returns
 * the canned name without spawning the real subprocess. Tests pass a
 * fixture string; production code never sets this.
 *
 * Exposed via setter (not env var) so test runners that share a Node
 * process can swap the value per-test without polluting `process.env`.
 */
declare let nvidiaSmiMock: {
    kind: "name";
    value: string;
} | {
    kind: "missing";
} | {
    kind: "real";
};
/** Test-only hook — set the next `detectGpuFromNvidiaSmi` result. */
export declare function __setNvidiaSmiMockForTests(mock: typeof nvidiaSmiMock | null): void;
/**
 * Run `nvidia-smi --query-gpu=name --format=csv,noheader` and return the
 * first non-empty line, or `null` if nvidia-smi is missing / the host has
 * no NVIDIA GPU / the command fails for any other reason.
 *
 * Deliberately tolerant: this is a *recommendation* path, not a
 * licence check. Any failure means "no profile applied; use catalog
 * defaults" — never throw.
 */
export declare function detectGpuFromNvidiaSmi(): string | null;
/**
 * Map an `nvidia-smi` name line to a profile id. Strict to avoid
 * misclassifying a 3080 as a 3090, or an A100 as a 4090.
 *
 * Pattern matching is case-insensitive and tolerates the two common
 * spellings (`RTX 4090` vs `RTX4090`). Real `nvidia-smi` returns the
 * full marketing name (`NVIDIA GeForce RTX 4090`).
 */
export declare function classifyGpuName(name: string): GpuYamlId | null;
/** Path to the YAML for a given profile id. */
export declare function profileYamlPath(id: GpuYamlId): string;
/** Clear the in-memory cache. Test-only. */
export declare function __clearProfileCacheForTests(): void;
/**
 * Load + validate the YAML for a given profile id. Throws a structured
 * error on schema mismatch or unknown bundle ids — callers should
 * `try/catch` at the runtime boundary and fall back to the catalog
 * defaults.
 *
 * Cached; multiple calls for the same id parse the YAML once per
 * process lifetime.
 */
export declare function loadProfile(id: GpuYamlId): GpuYamlProfile;
/** Result of `resolveProfileForHost` — discriminated union for callers. */
export type ResolveResult = {
    ok: true;
    profile: GpuYamlProfile;
    detectedName: string;
    gpuId: GpuYamlId;
} | {
    ok: false;
    reason: "no-nvidia-gpu" | "unsupported-gpu" | "profile-load-failed";
    detectedName: string | null;
    error?: string;
};
/**
 * One-shot detection + load. Returns a discriminated result so the
 * runtime can decide between "apply YAML overrides" and "fall back to
 * the catalog defaults".
 *
 * Conservative fallback policy: if any step fails, callers should use
 * `rtx-3090` (the most conservative supported card) — but that decision
 * is *not* made here; it's the caller's call so the runtime can log
 * which fallback rule fired.
 */
export declare function resolveProfileForHost(): ResolveResult;
/**
 * Conservative fallback profile id. Used by the runtime when detection
 * fails and the operator has opted into "always apply some profile".
 * Returns the lowest-spec supported card so flags are safe everywhere.
 */
export declare const FALLBACK_PROFILE_ID: GpuYamlId;
export {};
//# sourceMappingURL=gpu-profile-loader.d.ts.map