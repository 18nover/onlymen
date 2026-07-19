/**
 * Simplified per-GPU configuration profiles for the Eliza-1 model family.
 *
 * These profiles describe hardware capabilities and llama-server flag
 * recommendations for four supported NVIDIA cards. They are intentionally
 * separate from the richer YAML-backed `GpuYamlProfile` system in
 * `gpu-profile-loader.ts` — the JSON-style data here is bundled inline
 * (no fs reads, no YAML parser) so it is safe in every environment:
 * mobile runtimes, edge bundles, and server contexts.
 *
 * Selection: use `selectBestProfile(vramGb, cudaCompute)` to pick the
 * most capable profile the detected GPU qualifies for. The result feeds
 * `buildLlamaCppArgs()` to produce a ready-to-use argv array for
 * llama-server. Caller must fill in `--model <path>` separately — this
 * module never references model files.
 *
 * Override: set `ELIZA_GPU_PROFILE=<id>` (e.g. `rtx-4090`) to bypass
 * auto-detection and force a specific profile. `autoSelectProfile()` in
 * `detect.ts` respects this variable.
 *
 * Supported ids: `rtx-3090`, `rtx-4090`, `rtx-5090`, `h200`.
 */
/** GPU feature flags that affect quantisation and kernel availability. */
export type GpuFeature = "fp16" | "bf16" | "int8" | "int4" | "fp8" | "fp4";
/** Simplified GPU profile — JSON-safe, bundle-friendly. */
export interface GpuProfile {
    /** Canonical profile id, e.g. `"rtx-4090"`. */
    id: string;
    /** Human-readable card name shown to the user. */
    display_name: string;
    /** Total VRAM in GiB. */
    vram_gb: number;
    /**
     * CUDA compute capability as a dotted version string, e.g. `"8.9"`.
     * Used for numeric comparison in `selectBestProfile`.
     */
    cuda_compute: string;
    /** Quantisation / precision features the GPU supports. */
    features: GpuFeature[];
    /** Recommended Eliza-1 tier ids for common workloads. */
    recommended_tiers: {
        primary: string | null;
        secondary: string | null;
        heavy: string | null;
    };
    /** llama-server flags for this card. */
    llama_cpp_flags: {
        n_gpu_layers: number;
        tensor_split: number[] | null;
        flash_attn: boolean;
        use_mmap: boolean;
        numa: boolean;
    };
    /** MTP speculative-decoding settings. */
    mtp: {
        enabled: boolean;
        drafter_tier: string;
        speculative_window: number;
    };
    /** Maximum recommended context window in tokens. */
    ctx_size_tokens: number;
    /** Free-text notes for operators / documentation. */
    notes: string;
}
/**
 * All built-in profiles keyed by id.
 *
 * Data is inlined — no fs reads at runtime — so the map is available in
 * every environment (mobile, edge, server) without extra IO.
 */
export declare const GPU_PROFILES: Record<string, GpuProfile>;
/**
 * Look up a profile by its canonical id. Returns `null` when the id is
 * not in the built-in registry (including when the caller passes an
 * unrecognised override id from `ELIZA_GPU_PROFILE`).
 */
export declare function getGpuProfile(id: string): GpuProfile | null;
/**
 * Return the best-fit profile for a detected GPU.
 *
 * "Best fit" = the profile with the highest `vram_gb` that still
 * satisfies both of:
 *   1. `profile.vram_gb <= vramGb`   (card has at least as much VRAM)
 *   2. `profile.cuda_compute <= cudaCompute`  (card meets compute level)
 *
 * Returns `null` when no profile fits (e.g. only 8 GB VRAM — below all
 * supported cards).
 */
export declare function selectBestProfile(vramGb: number, cudaCompute: string): GpuProfile | null;
/**
 * Produce a `llama-server` argv array from a profile.
 *
 * Flags produced (in order):
 *   --n-gpu-layers <N>
 *   --flash-attn             (when flash_attn is true)
 *   --no-mmap                (when use_mmap is false)
 *   --numa                   (when numa is true)
 *   --ctx-size <N>
 *
 * Any value in `overrides` replaces the corresponding profile field
 * before the flags are built — useful for per-call adjustments without
 * modifying the shared profile object.
 *
 * Note: `--model <path>` is intentionally omitted. Callers must append
 * it themselves so this function never needs to touch model files.
 */
export declare function buildLlamaCppArgs(profile: GpuProfile, overrides?: Partial<GpuProfile["llama_cpp_flags"]> & {
    ctx_size_tokens?: number;
}): string[];
//# sourceMappingURL=gpu-tier-profiles.d.ts.map