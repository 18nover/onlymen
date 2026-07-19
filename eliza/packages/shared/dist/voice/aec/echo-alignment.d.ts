/**
 * Whole-utterance echo alignment for the desktop batch ASR path (#12256).
 *
 * The streaming AEC path (Pipeline A) aligns per mic frame because both mic
 * and playback frames carry timestamps in the same clock. The desktop loop's
 * ASR ingest instead receives a whole recorded utterance with NO per-sample
 * timestamps, while the far-end (TTS playback tapped in the renderer) is
 * timestamped in the renderer's `performance.now()` domain — an epoch the
 * server does not share. The bulk near↔far alignment therefore has to be
 * recovered from the audio itself: this module finds the offset that best
 * places the near-end inside a far-end window by normalized cross-correlation,
 * decimated for a cheap coarse pass and refined at full rate.
 *
 * `estimateEchoDelaySamples` (echo-delay.ts) stays the per-frame streaming
 * calibrator; this is its offline, long-window sibling. Same confidence
 * contract: a low peak correlation means the two signals are independent (no
 * echo present) and the caller must not cancel against a spurious alignment.
 */
export interface EchoAlignmentEstimate {
    /** Best placement of the near-end inside `far`: near[i] ≈ g · far[i + offsetSamples]. */
    offsetSamples: number;
    /** Peak normalized cross-correlation at that offset, clamped to [0, 1]. */
    confidence: number;
    /** Samples of genuine near/far overlap at the winning offset. */
    overlapSamples: number;
}
export interface EchoAlignmentOptions {
    /** Largest `offsetSamples` to search. Default `far.length − minOverlapSamples`. */
    maxOffsetSamples?: number;
    /** Minimum near/far overlap for an offset to be considered. Default 4000 (250 ms @16 kHz). */
    minOverlapSamples?: number;
    /** Coarse-pass decimation factor (box mean). Default 16 (16 kHz → 1 kHz envelope). */
    coarseDecimation?: number;
}
/**
 * Find where the near-end utterance sits inside the far-end window:
 * `near[i] ≈ g · far[i + offset]`, searching `offset ∈ [0, maxOffsetSamples]`.
 * Two passes — decimated coarse search over the whole range, then a full-rate
 * refinement around the coarse peak — so a multi-second utterance against a
 * multi-second window stays tens of milliseconds of CPU, not seconds.
 */
export declare function estimateEchoAlignment(near: Float32Array, far: Float32Array, options?: EchoAlignmentOptions): EchoAlignmentEstimate;
//# sourceMappingURL=echo-alignment.d.ts.map