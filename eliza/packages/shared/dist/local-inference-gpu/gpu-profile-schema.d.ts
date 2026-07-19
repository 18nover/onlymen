/**
 * Zod schema for the per-GPU YAML profile files in
 * `packages/shared/src/local-inference-gpu/profiles/*.yaml`.
 *
 * The YAML files are the source of truth for *per-bundle* deployment
 * recommendations on a given card (n_gpu_layers, ctx_size, parallel,
 * batch sizing, KV cache types, expected TPS). The card-level
 * descriptive metadata (vram, bandwidth, FP8 support) is duplicated
 * here so a single YAML round-trip captures everything an operator
 * needs to deploy and verify.
 *
 * The runtime card-level descriptor in
 * `packages/shared/src/local-inference/gpu-profiles.ts` is the *other*
 * source of truth — it carries the same constants but is tree-shakable
 * and import-safe in environments without YAML / file IO (mobile
 * runtime, edge bundles). At load time we cross-validate the two so
 * they cannot drift silently.
 */
import { z } from "zod";
import { type Eliza1TierId } from "../local-inference/catalog.js";
/**
 * Card ids — must match `GpuProfileId` in
 * `packages/shared/src/local-inference/gpu-profiles.ts`. Duplicated here
 * to keep this schema module standalone (no runtime import cycle).
 */
export declare const GpuYamlId: z.ZodEnum<{
    "rtx-3090": "rtx-3090";
    "rtx-4090": "rtx-4090";
    "rtx-5090": "rtx-5090";
    h200: "h200";
}>;
export type GpuYamlId = z.infer<typeof GpuYamlId>;
/** KV cache type strings accepted by `llama-server --cache-type-k/-v`. */
export declare const KvCacheType: z.ZodEnum<{
    q8_0: "q8_0";
    f16: "f16";
    q4_0: "q4_0";
    qjl1_256: "qjl1_256";
    q4_polar: "q4_polar";
    turbo3_0: "turbo3_0";
    turbo4_0: "turbo4_0";
}>;
export type KvCacheType = z.infer<typeof KvCacheType>;
export declare const KernelName: z.ZodEnum<{
    mtp: "mtp";
    turbo3: "turbo3";
    turbo4: "turbo4";
    turbo3_tcq: "turbo3_tcq";
    qjl_full: "qjl_full";
    polarquant: "polarquant";
}>;
export type KernelName = z.infer<typeof KernelName>;
/** Per-bundle llama-server flag bundle. */
export declare const BundleRecommendation: z.ZodObject<{
    n_gpu_layers: z.ZodNumber;
    ctx_size: z.ZodNumber;
    parallel: z.ZodNumber;
    batch_size: z.ZodNumber;
    ubatch_size: z.ZodNumber;
    kv_cache_k: z.ZodEnum<{
        q8_0: "q8_0";
        f16: "f16";
        q4_0: "q4_0";
        qjl1_256: "qjl1_256";
        q4_polar: "q4_polar";
        turbo3_0: "turbo3_0";
        turbo4_0: "turbo4_0";
    }>;
    kv_cache_v: z.ZodEnum<{
        q8_0: "q8_0";
        f16: "f16";
        q4_0: "q4_0";
        qjl1_256: "qjl1_256";
        q4_polar: "q4_polar";
        turbo3_0: "turbo3_0";
        turbo4_0: "turbo4_0";
    }>;
    flash_attention: z.ZodBoolean;
    mlock: z.ZodOptional<z.ZodBoolean>;
    estimated_decode_tps: z.ZodNumber;
    estimated_prefill_tps: z.ZodNumber;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type BundleRecommendation = z.infer<typeof BundleRecommendation>;
export declare const MtpTuning: z.ZodObject<{
    enabled: z.ZodBoolean;
    draft_min: z.ZodNumber;
    draft_max: z.ZodNumber;
    draft_gpu_layers: z.ZodNumber;
}, z.core.$strip>;
export type MtpTuning = z.infer<typeof MtpTuning>;
export declare const VerifyRecipe: z.ZodObject<{
    build_target: z.ZodString;
    cuda_arch: z.ZodNumber;
    cmake_flags: z.ZodArray<z.ZodString>;
    expected_kernels: z.ZodArray<z.ZodEnum<{
        mtp: "mtp";
        turbo3: "turbo3";
        turbo4: "turbo4";
        turbo3_tcq: "turbo3_tcq";
        qjl_full: "qjl_full";
        polarquant: "polarquant";
    }>>;
    unavailable_kernels: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        mtp: "mtp";
        turbo3: "turbo3";
        turbo4: "turbo4";
        turbo3_tcq: "turbo3_tcq";
        qjl_full: "qjl_full";
        polarquant: "polarquant";
    }>>>;
    warn_on_kernel_absent: z.ZodOptional<z.ZodBoolean>;
    smoke_bundle: z.ZodString;
    tolerance_pct: z.ZodNumber;
}, z.core.$strip>;
export type VerifyRecipe = z.infer<typeof VerifyRecipe>;
/** Full per-GPU YAML profile. */
export declare const GpuYamlProfile: z.ZodObject<{
    gpu_id: z.ZodEnum<{
        "rtx-3090": "rtx-3090";
        "rtx-4090": "rtx-4090";
        "rtx-5090": "rtx-5090";
        h200: "h200";
    }>;
    gpu_arch: z.ZodString;
    vram_gb: z.ZodNumber;
    mem_bandwidth_gbps: z.ZodNumber;
    fp8_supported: z.ZodBoolean;
    fp4_supported: z.ZodBoolean;
    nvlink: z.ZodBoolean;
    bundle_recommendations: z.ZodRecord<z.ZodString, z.ZodObject<{
        n_gpu_layers: z.ZodNumber;
        ctx_size: z.ZodNumber;
        parallel: z.ZodNumber;
        batch_size: z.ZodNumber;
        ubatch_size: z.ZodNumber;
        kv_cache_k: z.ZodEnum<{
            q8_0: "q8_0";
            f16: "f16";
            q4_0: "q4_0";
            qjl1_256: "qjl1_256";
            q4_polar: "q4_polar";
            turbo3_0: "turbo3_0";
            turbo4_0: "turbo4_0";
        }>;
        kv_cache_v: z.ZodEnum<{
            q8_0: "q8_0";
            f16: "f16";
            q4_0: "q4_0";
            qjl1_256: "qjl1_256";
            q4_polar: "q4_polar";
            turbo3_0: "turbo3_0";
            turbo4_0: "turbo4_0";
        }>;
        flash_attention: z.ZodBoolean;
        mlock: z.ZodOptional<z.ZodBoolean>;
        estimated_decode_tps: z.ZodNumber;
        estimated_prefill_tps: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    mtp: z.ZodObject<{
        enabled: z.ZodBoolean;
        draft_min: z.ZodNumber;
        draft_max: z.ZodNumber;
        draft_gpu_layers: z.ZodNumber;
    }, z.core.$strip>;
    verify_recipe: z.ZodObject<{
        build_target: z.ZodString;
        cuda_arch: z.ZodNumber;
        cmake_flags: z.ZodArray<z.ZodString>;
        expected_kernels: z.ZodArray<z.ZodEnum<{
            mtp: "mtp";
            turbo3: "turbo3";
            turbo4: "turbo4";
            turbo3_tcq: "turbo3_tcq";
            qjl_full: "qjl_full";
            polarquant: "polarquant";
        }>>;
        unavailable_kernels: z.ZodDefault<z.ZodArray<z.ZodEnum<{
            mtp: "mtp";
            turbo3: "turbo3";
            turbo4: "turbo4";
            turbo3_tcq: "turbo3_tcq";
            qjl_full: "qjl_full";
            polarquant: "polarquant";
        }>>>;
        warn_on_kernel_absent: z.ZodOptional<z.ZodBoolean>;
        smoke_bundle: z.ZodString;
        tolerance_pct: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export type GpuYamlProfile = z.infer<typeof GpuYamlProfile>;
/**
 * Validate that every bundle id in `bundle_recommendations` is a real
 * Eliza-1 tier id. Returns the list of offending keys (empty when OK).
 *
 * Kept out of the zod schema itself because `record(z.string(), …)` is
 * the right shape for forward-compat — the YAML may reference a new
 * tier id before the catalog enum is bumped, and we want a clear error
 * rather than a cryptic union-mismatch.
 */
export declare function bundleIdsInProfileMatchCatalog(profile: GpuYamlProfile): {
    ok: boolean;
    unknown: string[];
};
/** Narrowed mapping of tier id -> recommendation, after catalog validation. */
export declare function getRecommendationsByTier(profile: GpuYamlProfile): Partial<Record<Eliza1TierId, BundleRecommendation>>;
//# sourceMappingURL=gpu-profile-schema.d.ts.map