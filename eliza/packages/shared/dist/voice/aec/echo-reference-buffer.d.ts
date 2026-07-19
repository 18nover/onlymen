/**
 * Echo-reference alignment buffer (#9583, follow-up to #9455/#9586).
 *
 * The NLMS echo canceller's `process(nearEnd, farEnd)` needs the far-end
 * (the agent's TTS playback) **time-aligned** to the current mic frame: the
 * echo in `nearEnd[t]` is the room-filtered playback from `t − delay`, where
 * `delay` is the bulk playback→mic transport delay (estimated by
 * {@link estimateEchoDelaySamples} in `echo-delay.ts`).
 *
 * The caller renders playback PCM in real time and `push()`es it here as it goes;
 * per mic frame it then asks for the aligned far-end slice. This is the
 * "caller must supply the reference" primitive the consumer seam was missing —
 * a fixed-capacity delay line, pure logic (no FFI, no device, no audio I/O).
 * Samples not yet rendered, or already evicted past capacity, are zero-filled
 * (no echo reference ⇒ the adaptive filter simply has nothing to cancel there).
 */
export interface EchoReferenceBufferOptions {
    /**
     * Ring-buffer capacity in samples. Must comfortably exceed
     * `maxDelaySamples + frameLength`. Default 24000 (1.5 s @ 16 kHz).
     */
    capacitySamples?: number;
    /** Sample rate for timestamp-based push/read helpers. Default 16000. */
    sampleRateHz?: number;
}
export declare class EchoReferenceBuffer {
    private readonly buffer;
    private readonly valid;
    private readonly capacity;
    private readonly sampleRateHz;
    /** Total samples ever pushed (monotonic); the logical "now" cursor. */
    private pushed;
    /** Timestamp mapped to absolute sample 0 for timestamp-aware playback. */
    private originMs;
    constructor(options?: EchoReferenceBufferOptions);
    /** Append rendered playback (far-end) PCM as it is produced. */
    push(playback: Float32Array): void;
    /**
     * Store rendered playback at its capture/render timestamp. This preserves
     * real gaps between playback bursts instead of treating chunks as contiguous.
     */
    pushAt(timestampMs: number, playback: Float32Array): void;
    /**
     * The far-end reference frame aligned to a mic frame of `length` samples
     * captured `delaySamples` after the corresponding playback. Returns the
     * playback window `[pushed − delaySamples − length, pushed − delaySamples)`.
     * Indices before the retained window (not yet pushed, or evicted past
     * capacity) are zero-filled.
     */
    referenceFor(length: number, delaySamples: number): Float32Array;
    /**
     * Reference aligned to a mic frame starting at `timestampMs`.
     * Returns playback `[timestampMs - delay, timestampMs - delay + length)`.
     */
    referenceAt(timestampMs: number, length: number, delaySamples: number): Float32Array;
    /** Samples pushed so far (the monotonic stream position). */
    get position(): number;
    /** Drop all buffered playback (e.g. on a new turn / barge-in flush). */
    reset(): void;
    private sampleIndexFor;
    private writeAt;
    private clearRange;
    private readWindow;
}
//# sourceMappingURL=echo-reference-buffer.d.ts.map