/**
 * nlms-echo-canceller.ts — PCM acoustic echo cancellation for the live
 * half-duplex voice pipeline (#9455).
 *
 * When the agent speaks, its TTS playback leaks back into the microphone and
 * corrupts ASR / VAD / diarization (the agent hears itself). This is a
 * single-channel adaptive echo canceller: a normalized least-mean-squares
 * (NLMS) FIR filter models the playback→mic acoustic path and subtracts the
 * estimated echo from the near-end (mic) signal sample-by-sample.
 *
 *   near-end d[n] = local_speech[n] + echo[n]        (the raw mic)
 *   far-end  x[n] = agent TTS playback (the reference)
 *   estimate ŷ[n] = Σ_k w[k]·x[n−k]                  (modeled echo)
 *   output   e[n] = d[n] − ŷ[n]                       (echo-cancelled mic → ASR)
 *   update   w[k] += μ·e[n]·x[n−k] / (‖x‖² + ε)       (NLMS adaptation)
 *
 * All audio is 16 kHz mono Float32 [-1, 1] — the pipeline's internal format
 * (see audio-frame-consumer.ts). The filter length must cover the
 * playback→mic delay plus the room's reverberation tail; for tails longer than
 * the filter, calibrate `delaySamples` (the bulk transport delay) so the
 * adaptive taps only have to model the short residual impulse.
 *
 * Scope: this targets the dominant failure mode — the agent transcribing its
 * own TTS while the *user is silent* (echo-only), where it achieves ~29 dB of
 * echo-return-loss-enhancement. A far-end-vs-near-end double-talk detector
 * freezes adaptation when a local talker is active so the filter cannot learn
 * (and cancel) the user's voice; barge-in itself is handled upstream by the
 * barge-in detector (which stops playback). Full double-talk residual-echo
 * suppression is AEC3-class work and intentionally out of scope here.
 *
 * Pure DSP, zero dependencies — verified by nlms-echo-canceller.test.ts
 * (ERLE on synthetic echo, passthrough, stability, reset).
 */
export interface NlmsEchoCancellerOptions {
    /** Adaptive FIR length in samples. 256 ≈ 16 ms of impulse response @16 kHz. */
    filterTaps?: number;
    /** NLMS step size in (0, 2). Larger = faster adaptation, less stable. */
    mu?: number;
    /** Regularization added to the reference energy to avoid divide-by-zero. */
    epsilon?: number;
    /**
     * Bulk playback→mic transport delay in samples. The reference is consumed
     * `delaySamples` ahead of the near-end so the adaptive taps only model the
     * residual room impulse, not the (potentially large) transport latency.
     */
    delaySamples?: number;
    /**
     * Double-talk detector ratio. When the smoothed near-end power exceeds
     * `dtdRatio`× the smoothed far-end reference power (a passive echo path
     * attenuates, so echo power stays below the reference), a local talker is
     * assumed active and adaptation is frozen so the filter cannot learn (and
     * cancel) the user's voice. Set 0 to disable.
     */
    dtdRatio?: number;
    /**
     * Opt-in nonlinear residual-echo suppressor (#9583/#9649). After the linear
     * NLMS subtracts the modeled echo, an echo-only frame (the agent is speaking,
     * the user is NOT — far-end power exceeds near-end power and no double-talk)
     * still carries the residual echo the finite-length filter could not remove.
     * When enabled, the residual on those frames is scaled toward zero. It is
     * **default-off** and never engages during double-talk or near-end-dominant
     * frames, so it can never attenuate the user's voice. Pass `true` for the
     * default gain or `{ gain }` to tune.
     */
    residualSuppression?: boolean | ResidualSuppressionOptions;
}
export interface ResidualSuppressionOptions {
    /**
     * Gain (0,1] applied to the residual on echo-only frames. Lower = stronger
     * suppression. Default 0.15 (~−16 dB) — aggressive enough to flatten residual
     * echo while leaving headroom for the gate's hysteresis.
     */
    gain?: number;
}
export declare class NlmsEchoCanceller {
    private readonly w;
    private readonly x;
    private readonly taps;
    private readonly mu;
    private readonly eps;
    private readonly delay;
    private readonly dtdRatio;
    /** Residual-suppressor gain, or null when the suppressor is disabled (default). */
    private readonly resGain;
    /** Pending far-end samples not yet aligned to a near-end sample (delay line). */
    private readonly delayLine;
    private xEnergy;
    private peakXEnergy;
    private pNear;
    private pFar;
    private hangover;
    private lastEchoPow;
    /** Stay frozen ~30 ms after the last double-talk trigger so the filter is not
     * corrupted by the bursty onset/offset of the near-end talker. */
    private static readonly HANGOVER_SAMPLES;
    /** Per-sample decay of the far-end energy envelope (~1 s time constant) so a
     * short TTS pause keeps the far-end-active gate closed through the gap. */
    private static readonly PEAK_DECAY;
    /** Far-end is "active" only when the instantaneous ‖x‖² is within this
     * fraction (−20 dB) of the recent envelope. Below it there is no echo to
     * learn, so adaptation freezes (see process()). */
    private static readonly FAR_ACTIVITY_FRAC;
    /** NLMS regularization as a fraction of the far-end envelope. Keeps the step
     * bounded when ‖x‖² momentarily underflows, so a quiet far-end passage can't
     * make the normaliser collapse to the absolute `eps` and blow the filter up. */
    private static readonly REG_FRAC;
    private lastResidualPow;
    constructor(opts?: NlmsEchoCancellerOptions);
    /**
     * Cancel echo from one block of mic audio.
     *
     * @param nearEnd raw mic block (local speech + echo), Float32 [-1, 1]
     * @param farEnd  agent playback reference for the same time window. Pass an
     *                empty/zero array when the agent is NOT speaking — the filter
     *                then passes the mic through unchanged (output ≈ input).
     * @returns echo-cancelled near-end block (same length as `nearEnd`).
     */
    process(nearEnd: Float32Array, farEnd: Float32Array): Float32Array;
    /**
     * Advance cheap detector/reference state while the far-end is silent without
     * running the FIR echo-estimation loop. Learned filter weights are preserved,
     * but stale playback samples are removed from the delay line/ring so the next
     * non-empty reference frame cannot subtract an echo estimate from a previous
     * utterance.
     */
    observeFarEndSilence(nearEnd: Float32Array): void;
    /** Echo-return-loss-enhancement (dB) over the last processed block. Higher is
     * better; >10 dB is a meaningful cancellation. Returns 0 when there is no
     * modeled echo (agent silent) so a passthrough block reads as "no gain". */
    get lastErleDb(): number;
    /** Reset adaptation (e.g. when the playback path changes). */
    reset(): void;
    /** Shift a new far-end sample into the ring buffer, maintaining ‖x‖²
     * incrementally (drop the oldest sample's energy, add the newest). */
    private pushRef;
}
//# sourceMappingURL=nlms-echo-canceller.d.ts.map