/**
 * Device-fit selector for the one forced local model (eliza-1).
 *
 * The product rule (see `packages/ui/docs/local-model-simplification/README.md`):
 * **always run the biggest eliza-1 tier we can, balanced against a 128k context
 * target, with every memory optimization applied** so the floors are as low as
 * physics allows:
 *
 *  - **TurboQuant weights** — the catalog `sizeGb` per tier already reflects the
 *    TurboQuant-compressed GGUF (e.g. a 2B model is 1.4 GB, not ~4 GB bf16).
 *  - **Stock q8_0 KV-cache** — Gemma 4's KV is already minimal by construction
 *    (MQA = 1 KV head, windowed sliding-window attention on most layers, and
 *    shared-KV layers reusing earlier KV), so a 128k window fits in a fraction
 *    of a GB at stock q8_0 without the legacy QJL/Polar kernels. The head_dim=128
 *    QJL kernel does not apply to Gemma's dual head dims (512 global / 256 swa)
 *    and is not used. KV quant is forced, never a user option.
 *
 * `minRamGb` per tier is therefore "TurboQuant weights + a 128k q8_0 KV cache +
 * runtime/OS overhead". Picking the largest tier whose `minRamGb` fits free RAM
 * is exactly "biggest model that still gets a 128k window".
 *
 * **Dynamic fit-to-RAM context (#8809 M10b).** Picking the largest tier whose
 * static `minRamGb` floor fits is the coarse gate. On top of that we compute the
 * *largest context window that actually fits the device's free RAM* for the
 * chosen tier, from the per-token q8_0 KV rate (`kvBytesPerTokenForTier`) rather
 * than only honouring the catalog ceiling. On a roomy host that is the tier's
 * native window; on a host that clears the weights+overhead floor but not a full
 * 128k cache, the window shrinks to the largest 4k-stepped size that fits. The
 * tier choice never drops below 2B (0.8B is gone); when even a minimum window
 * (`ELIZA_1_MIN_LOCAL_CONTEXT`) cannot fit any tier, we return `null`, which the
 * caller reads as "this modality should route to Cloud" (the AUTO policy).
 */
import type { Eliza1TierId } from "./catalog.js";
/** The KV-cache quantization eliza-1 always uses on-device. Gemma 4's KV is
 * already minimal (MQA + windowed-SWA + shared-KV), so stock q8_0 is sufficient;
 * the legacy head_dim=128 QJL kernel is incompatible with Gemma's dual head dims
 * (512 global / 256 swa) and is not used. */
export declare const ELIZA_1_KV_QUANT: "q8_0";
/** The consumer context target. We never advertise less than this if it fits. */
export declare const ELIZA_1_CONTEXT_TARGET = 131072;
/** Floor below which a cramped local window is worse than routing to Cloud. */
export declare const ELIZA_1_MIN_LOCAL_CONTEXT = 8192;
export interface Eliza1Fit {
    /** The chosen tier (always the largest that fits the policy). */
    tierId: Eliza1TierId;
    /** The context window to load — native target when it fits, else downscaled. */
    contextLength: number;
    /** The KV quant to load with (stock q8_0 on-device — Gemma KV is already minimal). */
    kvQuant: typeof ELIZA_1_KV_QUANT;
    /** True when context was reduced below the tier's native window to fit RAM. */
    contextDownscaled: boolean;
    /** Per-token q8_0 KV footprint used to compute the window (bytes). */
    kvBytesPerToken: number;
    /**
     * The largest 4k-stepped window that fits free RAM for this tier at the q8_0
     * KV rate, before clamping to the tier's native ceiling. Equals
     * `contextLength` once clamped on roomy hosts; larger than `contextLength`
     * only when free RAM could hold more than the tier's native window.
     */
    maxFittingContext: number;
    /** Why this tier — surfaced in diagnostics, never as a user control. */
    reason: "native-fit" | "context-downscaled";
}
/**
 * Pick the best on-device eliza-1 configuration for a device with `freeRamGb` of
 * usable RAM (Apple-silicon unified RAM, discrete-GPU VRAM, or CPU RAM — the
 * caller normalizes this, e.g. via the device-tier classifier).
 *
 * Returns `null` when nothing acceptable fits locally → the caller routes this
 * modality to Cloud (AUTO). Never returns a tier smaller than 2B (0.8B is gone).
 */
export declare function selectBestEliza1Fit(freeRamGb: number): Eliza1Fit | null;
//# sourceMappingURL=device-fit.d.ts.map