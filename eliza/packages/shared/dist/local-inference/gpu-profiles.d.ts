/**
 * Per-GPU deployment profiles for single-GPU Eliza-1 servers.
 *
 * Scope: ONE GPU per host. We do not target NVLink, tensor-parallel splits,
 * or multi-tenant datacenter workloads. The product target is "one
 * conversation at a time on a single GPU box" — `--parallel N` can still go
 * higher than on a phone, but the model is not split across cards.
 *
 * These profiles are *recommendations* — the runtime selects a bundle by id
 * and then maps the host's GPU to a `GpuProfile` to fill in llama-server
 * flags (KV cache types, n-gpu-layers, batch sizing, MTP draft range,
 * mlock). A non-NVIDIA host returns `null` and the runtime falls back to
 * the catalog defaults.
 *
 * The KV cache type names match `LocalRuntimeKernel` / the llama.cpp fork
 * kernel handles (`qjl1_256`, `q4_polar`, `turbo3_0`, `turbo4_0`, `q8_0`,
 * `f16`) so that `appendOptimizationFlags` + `applyGpuProfile` can pass
 * them straight through to `--cache-type-k` / `--cache-type-v`.
 *
 * The active mobile/local release exposes Eliza-1 2b, 4b, 9b, and 27b
 * tiers, with larger cards recommended toward the biggest installed bundle
 * that leaves memory headroom.
 */
import type { Eliza1TierId } from "./catalog.js";
export type GpuProfileId = "rtx-3090" | "rtx-4090" | "rtx-5090" | "h200";
/**
 * KV cache type names accepted by `llama-server --cache-type-k/-v`. Mirrors
 * the strings the buun-llama-cpp fork advertises in `CAPABILITIES.json`.
 * Kept as a string literal union so a profile's choice is checked at
 * compile time and propagates into the bundle manifest's `requiresKernel`
 * set.
 */
export type KvCacheType = "f16" | "q8_0" | "q4_0" | "qjl1_256" | "q4_polar" | "turbo3_0" | "turbo4_0";
export interface GpuProfile {
    id: GpuProfileId;
    /** Human-readable vendor card name shown to the operator. */
    displayName: string;
    /** Total VRAM in GiB. Used for headroom math + recommendations. */
    vramGb: number;
    /** CUDA compute capability, e.g. `"sm_86"`. */
    computeCapability: string;
    /** Peak HBM/GDDR bandwidth in GB/s — feeds the perf estimator. */
    memoryBandwidthGBs: number;
    /** Whether the GPU has hardware FP8 (Ada/Hopper/Blackwell). */
    fp8: boolean;
    /**
     * Recommended catalog bundle ids for single-GPU deployment on this card.
     * Ordered by quality: first entry is the "best fit" for the card; later
     * entries are smaller fallbacks that still leave headroom. The recommender
     * picks the first id that the user has installed.
     */
    recommendedBundles: ReadonlyArray<Eliza1TierId>;
    /** Inference flags. */
    flashAttn: boolean;
    /** `--cache-type-k` value. */
    kvCacheTypeK: KvCacheType;
    /** `--cache-type-v` value. */
    kvCacheTypeV: KvCacheType;
    /**
     * `--n-gpu-layers` — `-1` for "all layers on GPU". Single-GPU only; we
     * never split layers across two cards.
     */
    nGpuLayers: number;
    /**
     * `--ctx-size`. Always sized to the bundle's `contextLength`, but the
     * profile records the *recommended* max for the card.
     */
    contextSize: number;
    /** `--parallel N` continuous-batching slots. */
    parallel: number;
    /** `--batch-size N` logical batch. */
    batchSize: number;
    /** `--ubatch-size N` physical micro-batch. */
    ubatchSize: number;
    /** MTP speculative-decoding draft range. */
    mtpDraftMin: number;
    mtpDraftMax: number;
    /** `--mlock` — pin model pages in RAM. */
    mlock: boolean;
    /** `--no-mmap` — disable mmap loading. */
    noMmap: boolean;
    /**
     * Force KV spill to CPU (`--no-kv-offload`). Only useful on cards that
     * cannot hold the full KV cache. The 141 GiB H200 sets this to `false`;
     * the 24 GiB cards can opt in for very long contexts.
     */
    kvSpillToCpu: boolean;
}
export declare const GPU_PROFILES: Readonly<Record<GpuProfileId, GpuProfile>>;
export declare const GPU_PROFILE_IDS: ReadonlyArray<GpuProfileId>;
/**
 * Match an `nvidia-smi --query-gpu=name` output line to a profile. Returns
 * `null` when the card is not in the supported set; callers should fall
 * back to the catalog defaults in that case rather than guess.
 *
 * The patterns are intentionally strict to avoid mis-classifying a 3080
 * as a 3090, or an A100 as a 4090.
 */
export declare function matchGpuProfile(gpuName: string): GpuProfileId | null;
/**
 * Returns the headroom (in GiB) a profile reserves for the OS / driver /
 * activations / drafter / N parallel-slot KV. Used for sizing checks
 * before promoting a bundle to "fits" on a card.
 *
 * The figures are deliberate per-tier reserves, not a formula — different
 * cards have different driver overheads (Windows display drivers steal
 * ~1 GiB before workloads even start; H200 SXM has none).
 */
export declare function reservedHeadroomGb(profile: GpuProfile): number;
//# sourceMappingURL=gpu-profiles.d.ts.map