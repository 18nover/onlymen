/**
 * Eliza-curated local model catalog.
 *
 * Default local inference is restricted to the active Eliza-1 line:
 * eliza-1-2b, eliza-1-4b, eliza-1-9b, eliza-1-27b,
 * and eliza-1-27b-256k.
 * These ship Gemma 4 bases: E2B/E4B/12B/31B mapped onto the
 * 2B/4B/9B/27B release tiers (the 2026-06-22 cutover from the legacy
 * hybrid line — see #9033 and packages/training/scripts/training/model_registry.py
 * for the active registry). Gemma 4 is a dense SWA + shared-KV + per-layer-embedding
 * (PLE) + MQA architecture; KV is already minimal so the legacy
 * QJL/TurboQuant KV kernels are not used (stock KV), and the shipping
 * GGUF weight quant is stock Q4_K_M unless a manifest proves a tier-specific
 * PolarQuant recipe was actually applied. External Hub search remains custom/opt-in and
 * never enters first-run or default eligibility.
 * Separate-drafter MTP is still the required release shape, but runtime
 * metadata is gated until the Gemma drafter GGUFs are actually hosted.
 */
import { type HfDownloadBase } from "./hf-proxy.js";
import type { CatalogModel } from "./types.js";
export declare const ELIZA_1_HF_REPO: "elizaos/eliza-1";
export declare const ELIZA_1_TIER_IDS: readonly ["eliza-1-2b", "eliza-1-4b", "eliza-1-9b", "eliza-1-27b", "eliza-1-27b-256k"];
export type Eliza1TierId = (typeof ELIZA_1_TIER_IDS)[number];
export declare const ELIZA_1_RELEASE_TIER_IDS: readonly ["eliza-1-2b", "eliza-1-4b", "eliza-1-9b", "eliza-1-27b", "eliza-1-27b-256k"];
export declare const ELIZA_1_VISION_TIER_IDS: readonly ["eliza-1-2b", "eliza-1-4b", "eliza-1-9b", "eliza-1-27b", "eliza-1-27b-256k"];
export declare const ELIZA_1_MTP_TIER_IDS: readonly ["eliza-1-2b", "eliza-1-4b", "eliza-1-9b", "eliza-1-27b", "eliza-1-27b-256k"];
/**
 * Tiers whose Gemma MTP drafter GGUFs are present at
 * `bundles/<tier>/mtp/drafter-<tier>.gguf` in the active HF tree.
 *
 * Current HF state (2026-07-02): `bundles/2b/mtp/drafter-2b.gguf` hosts the
 * gemma4-assistant drafter converted from `google/gemma-4-E2B-it-assistant`
 * (arch `gemma4-assistant`, f16, embedding_length_out=1536; sha256
 * 0495d34e08d0…, manifest `files.mtp` + `lineage.drafter` + `evals.mtp`
 * populated — acceptance 0.84, speedup ~1.53x greedy on M4 Max Metal at
 * `--spec-draft-n-max 1`). `bundles/4b/mtp/drafter-4b.gguf` hosts the
 * drafter converted from `google/gemma-4-E4B-it-assistant` (arch
 * `gemma4-assistant`, f16, embedding_length_out=2560; sha256 e4585e558a74…,
 * manifest populated — acceptance 0.79, speedup ~1.33x greedy on M4 Max
 * Metal at `--spec-draft-n-max 1`). The remaining tiers (9b/27b) still only
 * expose legacy `dflash/` paths; add a tier here only once its
 * `mtp/drafter-<tier>.gguf` is actually hosted, so the runtime and
 * downloader never advertise or fetch missing MTP artifacts.
 */
export declare const ELIZA_1_HOSTED_MTP_TIER_IDS: readonly ["eliza-1-2b", "eliza-1-4b"];
/**
 * On-device (mobile-class) tiers. These are the tiers small enough to run on
 * a phone, so they advertise the Gemma-4 QAT `Q4_0` quant as the
 * mobile-preferred variant and ship a LiteRT `.litertlm` bundle for the
 * on-device LiteRT-LM runtime (NPU/GPU delegate). Mirrors the Kokoro-only
 * voice policy and the SD-1.5 image-gen tiering (2b/4b).
 */
export declare const ELIZA_1_ON_DEVICE_TIER_IDS: readonly ["eliza-1-2b", "eliza-1-4b"];
export declare function isOnDeviceTier(id: Eliza1TierId): boolean;
export declare const FIRST_RUN_DEFAULT_MODEL_ID: Eliza1TierId;
export declare const DEFAULT_ELIGIBLE_MODEL_IDS: ReadonlySet<string>;
export declare function isDefaultEligibleId(id: string): boolean;
/**
 * Per-tier publish-state hint. Keys are tier ids that are known to have
 * a pending Hugging Face bundle at the time the catalog snapshot was
 * cut. Tiers not listed here default to `"published"`. The recommender
 * consults this map (or a `publishStatus` field on a synthetic
 * `CatalogModel`) before recommending a first-run default — see
 * `recommendForFirstRun` and elizaOS/eliza#7629.
 *
 * This is intentionally not runtime-overridable: the qwen35 tiers below are
 * blocked until the published bytes pass the Gemma text-architecture gate.
 *
 * W3-12 audit (2026-05-14): the following areas require publish attention:
 *   - 2B vision: enabled in the catalog and canonical vision tier set;
 *     publish staging must include `vision/mmproj-2b.gguf` or manifest
 *     validation fails loudly.
 *   - Voice sub-models (wakeword, turn-detector, speaker-encoder, emotion):
 *     published under the unified elizaos/eliza-1 `voice/<model-id>/...`
 *     layout. Per-tier manifests still need to consume these paths directly
 *     where a bundle wants eager voice downloads.
 *   - Kokoro same voice preset: `af_same.bin` absent from all
 *     bundles; I7 eval showed regression. Current bundles ship af_bella
 *     and standard voices only.
 */
export declare const ELIZA_1_TIER_PUBLISH_STATUS: Readonly<Partial<Record<Eliza1TierId, "published" | "pending">>>;
export declare function eliza1TierPublishStatus(id: Eliza1TierId | string): "published" | "pending";
export declare const ELIZA_1_PLACEHOLDER_IDS: ReadonlySet<string>;
export type VoiceBackendId = "kokoro";
/**
 * Per-tier voice backend policy. Kokoro is the sole on-device TTS backend
 * for every Eliza-1 tier. At ~82M params (a single ~60-80 MB GGUF) hitting
 * ~97ms CPU TTFB it is small and fast enough to ship on phones and large
 * hosts alike, so every tier bundles exactly Kokoro.
 */
export declare const ELIZA_1_VOICE_BACKENDS: Record<Eliza1TierId, ReadonlyArray<VoiceBackendId>>;
export declare const MODEL_CATALOG: CatalogModel[];
export declare function findCatalogModel(id: string): CatalogModel | undefined;
export declare function buildHuggingFaceResolveUrlForPath(model: CatalogModel, filePath: string): string;
export interface HfResolveUrlCandidate extends HfDownloadBase {
    /** Fully-qualified URL for this candidate base. */
    url: string;
}
export declare function buildHuggingFaceResolveUrlCandidatesForPath(model: CatalogModel, filePath: string): HfResolveUrlCandidate[];
export declare function buildHuggingFaceResolveUrl(model: CatalogModel): string;
//# sourceMappingURL=catalog.d.ts.map