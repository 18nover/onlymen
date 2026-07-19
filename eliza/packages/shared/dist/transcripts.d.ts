/**
 * Transcripts — the canonical contract for a recorded + transcribed session.
 *
 * One shape, shared across every layer: the ASR/diarization pipeline that
 * PRODUCES a transcript (plugin-local-inference), the service that STORES it and
 * mirrors its text into the knowledge/documents store, the API route + client
 * that TRANSPORT it, and the Transcripts view that PLAYS it back with
 * word-synced highlighting. Keeping the shape here (pure, browser- + node-safe)
 * means the word-timing model is defined exactly once.
 *
 * Timing convention: every `startMs`/`endMs` is milliseconds from the START of
 * the recording's audio (0 = first sample), so the same numbers drive both the
 * stored record and the `<audio>.currentTime`-based player highlight.
 */
/** A single transcribed word with playback-synced timing (ms from audio start). */
export interface TranscriptWord {
    text: string;
    startMs: number;
    endMs: number;
    /** ASR confidence 0..1, when the backend reports it. */
    confidence?: number;
}
/**
 * One diarized, word-timed span — a single speaker's contiguous utterance.
 * `words` is empty only when the ASR backend supplied no per-word timing (the
 * player then falls back to segment-level highlighting).
 */
export interface TranscriptSegment {
    id: string;
    /** Stable speaker label within this transcript (e.g. "Speaker 1" or a name). */
    speakerLabel?: string;
    /** Resolved elizaOS entity id when the voice was recognized (evidence-linked). */
    speakerEntityId?: string;
    startMs: number;
    endMs: number;
    /** Segment text (the join of `words`, or raw ASR text when words are absent). */
    text: string;
    words: TranscriptWord[];
    confidence?: number;
}
export type TranscriptSource = "voice-session" | "import" | "call" | "meeting" | "unknown";
/** Visibility scope — mirrors the documents store's `DocumentVisibilityScope`. */
export type TranscriptScope = "owner-private" | "user-private" | "global" | "agent-private";
/**
 * Normalize a scope value read from an untyped row/JSON boundary. Unknown,
 * missing, or corrupt values fail CLOSED to `"owner-private"` — a legacy row
 * that predates scope stamping must never widen visibility.
 */
export declare function normalizeTranscriptScope(scope: unknown): TranscriptScope;
export type TranscriptStatus = "recording" | "processing" | "ready" | "failed";
/** A recorded + transcribed session: audio + word-timed diarized segments. */
export interface Transcript {
    id: string;
    title: string;
    /** Epoch ms when recording started. */
    createdAt: number;
    /** Epoch ms when the session ended; absent while still recording. */
    endedAt?: number;
    /** Epoch ms of the most recent user edit to the transcript text. */
    editedAt?: number;
    durationMs: number;
    /** Served audio URL (content-addressed media store); absent if not retained. */
    audioUrl?: string;
    audioContentType?: string;
    segments: TranscriptSegment[];
    source: TranscriptSource;
    scope: TranscriptScope;
    status: TranscriptStatus;
    /** The mirrored documents/knowledge item id (the searchable text copy). */
    knowledgeDocumentId?: string;
    /** Distinct speaker count across segments. */
    speakerCount: number;
    metadata?: Record<string, unknown>;
    /**
     * Present (true) only on a served DTO whose content is the PII-scrubbed
     * variant of the artifact, selected for a redacted-grant viewer (#14781).
     * A redacted serve always withholds `audioUrl` (audio is never redacted in
     * v1). Never stored — stored records link variants via
     * `metadata.redactionOf` / row `metadata.redactedVariantId` instead.
     */
    redacted?: true;
}
/**
 * Meeting-specific list-row fields, computed server-side from a meeting
 * transcript's metadata (never derived on the client). Present only on
 * `source: "meeting"` summaries.
 */
export interface TranscriptSummaryMeetingMeta {
    /** Meeting platform (a {@link MeetingPlatform} value) for the row badge. */
    platform?: string;
    /** Roster size at finalize — the "N participants" the list row shows. */
    participantCount: number;
}
export declare const TRANSCRIPT_CAPTURE_MODES: readonly ["bot", "platform_import", "bot_free_tab_system", "local_mic", "mobile_room_mic", "benchmark_import", "imported_artifact", "unknown"];
export type TranscriptCaptureMode = (typeof TRANSCRIPT_CAPTURE_MODES)[number];
export declare const TRANSCRIPT_CONSENT_STATES: readonly ["not_required", "pending", "granted", "denied", "revoked", "unknown"];
export type TranscriptConsentState = (typeof TRANSCRIPT_CONSENT_STATES)[number];
export declare const TRANSCRIPT_POLICY_STATES: readonly ["allowed", "org_blocked", "user_blocked", "unknown"];
export type TranscriptPolicyState = (typeof TRANSCRIPT_POLICY_STATES)[number];
export declare const TRANSCRIPT_PERMISSION_STATES: readonly ["prompt", "granted", "denied", "stopped", "revoked", "not_required", "unknown"];
export type TranscriptPermissionState = (typeof TRANSCRIPT_PERMISSION_STATES)[number];
export declare const TRANSCRIPT_RETENTION_STATES: readonly ["audio_retained", "audio_deleted_transcript_retained", "transcript_only", "delete_pending", "unknown"];
export type TranscriptRetentionState = (typeof TRANSCRIPT_RETENTION_STATES)[number];
export declare const TRANSCRIPT_SHARING_STATES: readonly ["owner_private", "restricted", "shared", "public", "disabled", "unknown"];
export type TranscriptSharingState = (typeof TRANSCRIPT_SHARING_STATES)[number];
export interface TranscriptCaptureSharingState {
    transcript?: TranscriptSharingState;
    notes?: TranscriptSharingState;
    sourceAudio?: TranscriptSharingState;
    artifacts?: TranscriptSharingState;
}
export interface TranscriptCapturePrivacyState {
    captureMode?: TranscriptCaptureMode;
    consentState?: TranscriptConsentState;
    policyState?: TranscriptPolicyState;
    permissionState?: TranscriptPermissionState;
    retentionState?: TranscriptRetentionState;
    sharing: TranscriptCaptureSharingState;
    sourceAudioDeleted: boolean;
    /** True only when metadata explicitly carried policy/privacy fields. */
    hasExplicitState: boolean;
}
/** Compact list-row projection for the transcripts index. */
export interface TranscriptSummary {
    id: string;
    title: string;
    createdAt: number;
    durationMs: number;
    speakerCount: number;
    status: TranscriptStatus;
    /** How the transcript was captured — drives meeting-aware row rendering. */
    source: TranscriptSource;
    /** First slice of the transcript text, for the list row. */
    preview: string;
    hasAudio: boolean;
    /** Server-computed meeting fields; present only for `source: "meeting"`. */
    meeting?: TranscriptSummaryMeetingMeta;
    /** Present (true) when this row's preview is served from the redacted variant (#14781). */
    redacted?: true;
}
/** Default characters of transcript text kept for a list-row preview. */
export declare const TRANSCRIPT_PREVIEW_CHARS = 160;
/** Distinct speaker labels across the segments (unlabeled segments ignored). */
export declare function transcriptSpeakerCount(segments: ReadonlyArray<TranscriptSegment>): number;
/** Recording length in ms — the largest segment end (0 when empty). */
export declare function transcriptDurationMs(segments: ReadonlyArray<TranscriptSegment>): number;
/**
 * Render the transcript as plain, speaker-labeled lines — the exact text that is
 * mirrored into the knowledge/documents store (so search + the provider read
 * the same words a human sees) and used for previews. One line per segment:
 * `Speaker: text` (label omitted when unknown).
 */
export declare function transcriptPlainText(segments: ReadonlyArray<TranscriptSegment>): string;
/** A one-line preview of the transcript text, capped to `max` chars. */
export declare function transcriptPreview(segments: ReadonlyArray<TranscriptSegment>, max?: number): string;
/**
 * Normalize capture/consent/privacy/retention metadata from a transcript.
 *
 * Writers may store either flat fields (`captureMode`, `retentionState`) or
 * nested groups (`capture.mode`, `retention.state`, `sharing.transcript`).
 * The UI renders this normalized server-provided state; it does not derive
 * policy or privacy from raw metadata on its own.
 */
export declare function transcriptCapturePrivacyState(transcript: Transcript): TranscriptCapturePrivacyState;
/** Project a full transcript to its list-row summary. */
export declare function summarizeTranscript(transcript: Transcript): TranscriptSummary;
/** A word flattened across segments, carrying its origin indices for the UI. */
export interface FlatTranscriptWord extends TranscriptWord {
    segmentIndex: number;
    wordIndex: number;
}
/** Flatten all segments' words into one time-ordered array (for player sync). */
export declare function flattenTranscriptWords(segments: ReadonlyArray<TranscriptSegment>): FlatTranscriptWord[];
/**
 * Index of the word active at playback time `ms` within a flattened, ascending
 * word list, via binary search (cheap enough to call every `timeupdate`/frame).
 * Returns the last word whose `startMs <= ms`; -1 before the first word starts.
 * A word stays "active" until the next word begins, so gaps between words keep
 * the previous word lit rather than flickering off.
 */
export declare function activeWordIndex(words: ReadonlyArray<FlatTranscriptWord>, ms: number): number;
/** A single invariant violation found by {@link validateAsrWordTimings}. */
export interface WordTimingViolation {
    index: number;
    word: string;
    reason: string;
}
/** Result of validating a word-timed sequence against the player contract. */
export interface WordTimingValidation {
    ok: boolean;
    violations: WordTimingViolation[];
}
/**
 * Validate per-word timings against the contract the transcript player relies
 * on — and that the fused ASR v12 (`eliza_inference_asr_transcribe_timed`) MUST
 * satisfy for its output to be playable:
 *
 *   - every word has non-empty text and finite `0 <= startMs <= endMs`,
 *   - spans are ordered and non-overlapping (each word starts no earlier than
 *     the previous word ends, within `toleranceMs`),
 *   - every span lies within `[0, audioDurationMs]` (the exact decoded audio
 *     length, `1000 * n_samples / sample_rate`).
 *
 * Pass `audioDurationMs = 0` to skip the upper-bound check. `toleranceMs`
 * absorbs the integer rounding the native char-proportional timing applies at
 * word boundaries. The same function gates the player highlight, the ASR bench,
 * and the real-audio FFI test so all three agree on what "well-formed" means.
 */
export declare function validateAsrWordTimings(words: ReadonlyArray<TranscriptWord>, audioDurationMs?: number, toleranceMs?: number): WordTimingValidation;
//# sourceMappingURL=transcripts.d.ts.map