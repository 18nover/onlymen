/**
 * Echo-return-loss-enhancement (ERLE) measurement for the AEC stack (#12256).
 *
 * ERLE compares the near-end (raw mic) energy against the canceller's residual
 * over the same window: 10·log10(Σnear² / Σresidual²). It is the single number
 * the layered echo defense is gated on (workbench ceiling: ≥18 dB on the
 * desktop loop; the NLMS canceller reaches ~29 dB on echo-only synthetic).
 * Meaningful only over windows where the far-end (agent playback) was actually
 * driving an echo — measuring over user-speech-only audio reads ~0 dB by
 * design, since the canceller must not touch the user's voice.
 */
/**
 * ERLE in dB: 10·log10(Σnear² / Σresidual²) over the overlapping length.
 * Higher is better. Returns +Infinity when the residual is silent and 0 when
 * there is no near-end energy to enhance.
 */
export declare function computeErle(nearEnd: Float32Array, residual: Float32Array): number;
/**
 * ERLE restricted to far-end-active blocks: only spans where the (aligned)
 * far-end reference carries energy contribute to the ratio. This is the honest
 * per-utterance measurement for double-talk audio — outside the far-active
 * region there is no echo, the canceller is passthrough, and folding those
 * samples in would dilute the number toward 0 dB.
 *
 * Returns `erleDb: null` when no block was far-active (no echo present).
 */
export declare function computeFarActiveErle(nearEnd: Float32Array, residual: Float32Array, alignedFarEnd: Float32Array, options?: {
    blockSamples?: number;
    farEnergyFloor?: number;
}): {
    erleDb: number | null;
    farActiveSamples: number;
};
//# sourceMappingURL=echo-metrics.d.ts.map