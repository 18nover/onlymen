/**
 * USER_EMOTION_SIGNAL — surfaces the fused user-emotion read (voice + text)
 * into the planner prompt as a one-line `USER_SIGNAL: ...` context entry.
 *
 * Per R3-emotion.md §3 ("Downstream consumers" item 1) and the I3 brief:
 * opt-in, additive, never gates action selection — emotion is a hint, not a
 * guard. We only emit the line when the *fused* attribution carries
 * `confidence > 0.6`; below that we stay silent (the planner is sensitive to
 * prompt-cache stability, so the empty-result shape is the same bytes every
 * turn the signal isn't present).
 *
 * Two signal sources:
 *   - voice (acoustic) — written into `Memory.metadata.voice.emotion` by
 *     the local-inference engine bridge on `isFinal` transcript snapshots,
 *   - text (lexical) — the Stage-1 `emotion` field-evaluator value, which
 *     rides on `Content.emotion` (the dynamic property channel).
 *
 * Fusion is done in `attributeVoiceEmotion()` (single fusion point, R3 §3
 * "Two confidence scores, no fusion rule" risk). This provider is read-only
 * — it never re-fuses, it just reports what the bridge already computed.
 *
 * Opt-out via runtime setting `ELIZA_VOICE_EMOTION_INTO_PLANNER` (set to
 * `"0"` to suppress). The opt-in default matches the R3-emotion §3 design:
 * planner sees the hint by default, the user can turn it off.
 */
import type { Provider } from "../../../types/index.js";
export declare const userEmotionSignalProvider: Provider;
//# sourceMappingURL=userEmotionSignal.d.ts.map