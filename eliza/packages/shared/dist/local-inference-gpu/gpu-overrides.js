import { getRecommendationsByTier, } from "./gpu-profile-schema.js";
/**
 * Compute the runtime override patch for a (bundle, profile) pair.
 *
 * - If the YAML has a `bundle_recommendations[<bundleId>]` entry, return
 *   `applied` with the merged MTP + bundle flags.
 * - If not, return `no-recommendation` — runtime keeps catalog defaults.
 *
 * Pure: no IO, no logging. Safe to call repeatedly.
 */
export function getGpuOverrides(input) {
    const { profile, bundleId } = input;
    const recs = getRecommendationsByTier(profile);
    const rec = recs[bundleId];
    if (!rec) {
        return { kind: "no-recommendation", bundleId, gpuId: profile.gpu_id };
    }
    return {
        kind: "applied",
        bundleId,
        gpuId: profile.gpu_id,
        overrides: bundleToOverrides(rec, profile),
    };
}
function bundleToOverrides(rec, profile) {
    const out = {
        contextSize: rec.ctx_size,
        parallel: rec.parallel,
        batchSize: rec.batch_size,
        ubatchSize: rec.ubatch_size,
        nGpuLayers: rec.n_gpu_layers,
        flashAttention: rec.flash_attention,
        cacheTypeK: rec.kv_cache_k,
        cacheTypeV: rec.kv_cache_v,
    };
    if (rec.mlock !== undefined)
        out.mlock = rec.mlock;
    if (profile.mtp.enabled) {
        out.draftMin = profile.mtp.draft_min;
        out.draftMax = profile.mtp.draft_max;
        out.draftGpuLayers = profile.mtp.draft_gpu_layers;
    }
    return out;
}
/**
 * Documented 5-line integration patch for
 * `packages/app-core/src/services/local-inference/ffi-streaming-backend.ts`.
 *
 * **NOT applied here.** Another agent owns ffi-streaming-backend.ts. Producing
 * the diff in a string keeps the integration point reviewable without
 * touching the locked file.
 *
 * Target site: inside `buildLaunchArgs` (or wherever the catalog
 * `runtime.optimizations` is merged into the final spawn config),
 * after the catalog defaults are loaded and before flags are flattened
 * to argv.
 *
 * ```ts
 * // After: const plan = buildPlanFromCatalog(model, env);
 * // Add:
 * if (plan.acceleration?.backend === "cuda") {
 *   const host = resolveProfileForHost();
 *   if (host.ok) {
 *     const patch = getGpuOverrides({ profile: host.profile, bundleId: model.id as Eliza1TierId });
 *     if (patch.kind === "applied") Object.assign(plan, patch.overrides);
 *   }
 * }
 * ```
 *
 * `resolveProfileForHost` is from `gpu-profile-loader.ts`;
 * `getGpuOverrides` is the function above. The merge is a shallow
 * `Object.assign` because every field of `MtpServerOverrides` is a
 * leaf scalar — there are no nested objects to deep-merge.
 */
export const MTP_SERVER_PATCH_DOCS = "see comment block above MTP_SERVER_PATCH_DOCS";
//# sourceMappingURL=gpu-overrides.js.map