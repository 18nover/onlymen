/**
 * Streaming one-shot playback→mic delay calibration (#9583/#9586, extracted
 * from the live diarization session for the desktop AEC work in #12256).
 *
 * While the far-end (agent TTS playback) is active, near/far windows are
 * accumulated; once ~1 s of playback-active audio is buffered, the bulk
 * transport lag is recovered by normalized cross-correlation
 * (`estimateEchoDelaySamples`) and — if confident and not pinned at the search
 * ceiling — replaces the static seed. One-shot: a device's speaker→mic path is
 * stable, so the first confident estimate is locked and re-measurement stops.
 *
 * Constants are shared verbatim with Pipeline A's historical values; both the
 * live diarization session and the desktop far-end service calibrate through
 * this class so the contract (confidence ≥0.3, 500 ms search, cap-edge
 * rejection) cannot drift between consumers.
 */
/** Accumulate this many playback-active samples before estimating the delay
 * (1 s @16 kHz — enough correlated echo overlap for a stable cross-correlation
 * even when the transport lag eats several hundred ms of the window). */
export declare const ECHO_CAL_TARGET_SAMPLES = 16000;
/** Bound the rolling calibration window so a long talk-over doesn't grow it. */
export declare const ECHO_CAL_MAX_SAMPLES = 24000;
/** Accept a calibrated delay only above this normalized cross-correlation; below
 * it the near/far are independent (user talking, no echo) — keep the seed. */
export declare const ECHO_CAL_MIN_CONFIDENCE = 0.3;
/** Largest playback→mic delay to search (500 ms @16 kHz). The Pixel 6a WebView
 * pump path measured ~381–408 ms end-to-end (#11373 device evidence). */
export declare const ECHO_CAL_MAX_LAG_SAMPLES = 8000;
/** Reject locks within one frame of the search ceiling: a cap-edge peak means
 * the true delay is likely beyond the searched range, and a one-shot lock on
 * it would pin a wrong alignment forever. Keep observing instead. */
export declare const ECHO_CAL_CAP_EDGE_SAMPLES = 320;
/** Far-end mean-square floor below which a frame is "no playback" (skip). */
export declare const ECHO_CAL_FAR_ENERGY_FLOOR = 1e-7;
export interface EchoDelayState {
    delaySamples: number;
    confidence: number;
    calibrated: boolean;
}
export declare class StreamingEchoDelayCalibrator {
    private delay;
    private conf;
    private locked;
    /** Rolling near/far windows accumulated only while the far-end is active,
     * used once to estimate the delay. Cleared after an estimate and on
     * {@link resetWindow}. */
    private calNear;
    private calFar;
    private calSampleCount;
    constructor(seedDelaySamples: number);
    get delaySamples(): number;
    get confidence(): number;
    get calibrated(): boolean;
    state(): EchoDelayState;
    /**
     * Feed one mic frame plus the RAW (delay-0) far-end read for the same window.
     * Calibration recovers the delay, so callers must not pre-apply the value
     * under measurement. No-op once locked or when the far-end is silent.
     */
    observe(nearPcm: Float32Array, farPcm: Float32Array): void;
    /** Drop the in-progress accumulation window (playback stopped / barge-in —
     * it would otherwise straddle a playback gap). The learned delay is kept. */
    resetWindow(): void;
}
//# sourceMappingURL=delay-calibrator.d.ts.map