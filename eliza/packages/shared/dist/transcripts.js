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
const TRANSCRIPT_SCOPES = new Set([
    "owner-private",
    "user-private",
    "global",
    "agent-private",
]);
/**
 * Normalize a scope value read from an untyped row/JSON boundary. Unknown,
 * missing, or corrupt values fail CLOSED to `"owner-private"` — a legacy row
 * that predates scope stamping must never widen visibility.
 */
export function normalizeTranscriptScope(scope) {
    return typeof scope === "string" && TRANSCRIPT_SCOPES.has(scope)
        ? scope
        : "owner-private";
}
export const TRANSCRIPT_CAPTURE_MODES = [
    "bot",
    "platform_import",
    "bot_free_tab_system",
    "local_mic",
    "mobile_room_mic",
    "benchmark_import",
    "imported_artifact",
    "unknown",
];
export const TRANSCRIPT_CONSENT_STATES = [
    "not_required",
    "pending",
    "granted",
    "denied",
    "revoked",
    "unknown",
];
export const TRANSCRIPT_POLICY_STATES = [
    "allowed",
    "org_blocked",
    "user_blocked",
    "unknown",
];
export const TRANSCRIPT_PERMISSION_STATES = [
    "prompt",
    "granted",
    "denied",
    "stopped",
    "revoked",
    "not_required",
    "unknown",
];
export const TRANSCRIPT_RETENTION_STATES = [
    "audio_retained",
    "audio_deleted_transcript_retained",
    "transcript_only",
    "delete_pending",
    "unknown",
];
export const TRANSCRIPT_SHARING_STATES = [
    "owner_private",
    "restricted",
    "shared",
    "public",
    "disabled",
    "unknown",
];
/** Default characters of transcript text kept for a list-row preview. */
export const TRANSCRIPT_PREVIEW_CHARS = 160;
/** Distinct speaker labels across the segments (unlabeled segments ignored). */
export function transcriptSpeakerCount(segments) {
    const labels = new Set();
    for (const s of segments)
        if (s.speakerLabel)
            labels.add(s.speakerLabel);
    return labels.size;
}
/** Recording length in ms — the largest segment end (0 when empty). */
export function transcriptDurationMs(segments) {
    let max = 0;
    for (const s of segments)
        if (s.endMs > max)
            max = s.endMs;
    return max;
}
/**
 * Render the transcript as plain, speaker-labeled lines — the exact text that is
 * mirrored into the knowledge/documents store (so search + the provider read
 * the same words a human sees) and used for previews. One line per segment:
 * `Speaker: text` (label omitted when unknown).
 */
export function transcriptPlainText(segments) {
    return segments
        .map((s) => {
        const text = s.text.trim();
        if (!text)
            return "";
        return s.speakerLabel ? `${s.speakerLabel}: ${text}` : text;
    })
        .filter((line) => line.length > 0)
        .join("\n");
}
/** A one-line preview of the transcript text, capped to `max` chars. */
export function transcriptPreview(segments, max = TRANSCRIPT_PREVIEW_CHARS) {
    const flat = segments
        .map((s) => s.text.trim())
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}
/**
 * Read the meeting list-row fields off a meeting transcript's metadata. The
 * meetings writer stores `{ platform, participants }` (see
 * plugin-meetings' meeting-transcript-writer); the participant COUNT is
 * computed here, server-side, so the list row never counts a roster array in
 * the client.
 */
function summarizeMeetingMeta(metadata) {
    const platform = typeof metadata?.platform === "string" ? metadata.platform : undefined;
    const participants = metadata?.participants;
    const participantCount = Array.isArray(participants)
        ? participants.length
        : 0;
    return platform === undefined
        ? { participantCount }
        : { platform, participantCount };
}
function recordProp(metadata, key) {
    const value = metadata?.[key];
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return undefined;
    }
    return value;
}
function stringProp(metadata, key) {
    const value = metadata?.[key];
    return typeof value === "string" ? value : undefined;
}
function booleanProp(metadata, key) {
    const value = metadata?.[key];
    return typeof value === "boolean" ? value : undefined;
}
function enumProp(value, values) {
    return value !== undefined && values.includes(value) ? value : undefined;
}
function sharingState(metadata, sharing, key) {
    const flatKey = key === "sourceAudio" ? "sourceAudioSharingState" : `${key}SharingState`;
    return enumProp(stringProp(metadata, flatKey) ?? stringProp(sharing, key), TRANSCRIPT_SHARING_STATES);
}
/**
 * Normalize capture/consent/privacy/retention metadata from a transcript.
 *
 * Writers may store either flat fields (`captureMode`, `retentionState`) or
 * nested groups (`capture.mode`, `retention.state`, `sharing.transcript`).
 * The UI renders this normalized server-provided state; it does not derive
 * policy or privacy from raw metadata on its own.
 */
export function transcriptCapturePrivacyState(transcript) {
    const metadata = transcript.metadata;
    const capture = recordProp(metadata, "capture");
    const consent = recordProp(metadata, "consent");
    const policy = recordProp(metadata, "policy");
    const permission = recordProp(metadata, "permission");
    const retention = recordProp(metadata, "retention");
    const sharing = recordProp(metadata, "sharing");
    const captureMode = enumProp(stringProp(metadata, "captureMode") ?? stringProp(capture, "mode"), TRANSCRIPT_CAPTURE_MODES);
    const consentState = enumProp(stringProp(metadata, "consentState") ?? stringProp(consent, "state"), TRANSCRIPT_CONSENT_STATES);
    const policyState = enumProp(stringProp(metadata, "policyState") ?? stringProp(policy, "state"), TRANSCRIPT_POLICY_STATES);
    const permissionState = enumProp(stringProp(metadata, "permissionState") ?? stringProp(permission, "state"), TRANSCRIPT_PERMISSION_STATES);
    const sourceAudioDeleted = booleanProp(metadata, "sourceAudioDeleted") ??
        booleanProp(retention, "sourceAudioDeleted") ??
        false;
    const explicitRetentionState = enumProp(stringProp(metadata, "retentionState") ?? stringProp(retention, "state"), TRANSCRIPT_RETENTION_STATES);
    const retentionState = explicitRetentionState ??
        (sourceAudioDeleted
            ? "audio_deleted_transcript_retained"
            : transcript.audioUrl
                ? "audio_retained"
                : undefined);
    const normalizedSharing = {
        ...(sharingState(metadata, sharing, "transcript")
            ? { transcript: sharingState(metadata, sharing, "transcript") }
            : {}),
        ...(sharingState(metadata, sharing, "notes")
            ? { notes: sharingState(metadata, sharing, "notes") }
            : {}),
        ...(sharingState(metadata, sharing, "sourceAudio")
            ? { sourceAudio: sharingState(metadata, sharing, "sourceAudio") }
            : {}),
        ...(sharingState(metadata, sharing, "artifacts")
            ? { artifacts: sharingState(metadata, sharing, "artifacts") }
            : {}),
    };
    return {
        ...(captureMode ? { captureMode } : {}),
        ...(consentState ? { consentState } : {}),
        ...(policyState ? { policyState } : {}),
        ...(permissionState ? { permissionState } : {}),
        ...(retentionState ? { retentionState } : {}),
        sharing: normalizedSharing,
        sourceAudioDeleted,
        hasExplicitState: Boolean(captureMode ||
            consentState ||
            policyState ||
            permissionState ||
            explicitRetentionState ||
            sourceAudioDeleted ||
            Object.keys(normalizedSharing).length > 0),
    };
}
/** Project a full transcript to its list-row summary. */
export function summarizeTranscript(transcript) {
    return {
        id: transcript.id,
        title: transcript.title,
        createdAt: transcript.createdAt,
        durationMs: transcript.durationMs,
        speakerCount: transcript.speakerCount,
        status: transcript.status,
        source: transcript.source,
        preview: transcriptPreview(transcript.segments),
        hasAudio: Boolean(transcript.audioUrl),
        ...(transcript.source === "meeting"
            ? { meeting: summarizeMeetingMeta(transcript.metadata) }
            : {}),
    };
}
/** Flatten all segments' words into one time-ordered array (for player sync). */
export function flattenTranscriptWords(segments) {
    const out = [];
    segments.forEach((segment, segmentIndex) => {
        segment.words.forEach((word, wordIndex) => {
            out.push({ ...word, segmentIndex, wordIndex });
        });
    });
    return out;
}
/**
 * Index of the word active at playback time `ms` within a flattened, ascending
 * word list, via binary search (cheap enough to call every `timeupdate`/frame).
 * Returns the last word whose `startMs <= ms`; -1 before the first word starts.
 * A word stays "active" until the next word begins, so gaps between words keep
 * the previous word lit rather than flickering off.
 */
export function activeWordIndex(words, ms) {
    let lo = 0;
    let hi = words.length - 1;
    let found = -1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (words[mid].startMs <= ms) {
            found = mid;
            lo = mid + 1;
        }
        else {
            hi = mid - 1;
        }
    }
    return found;
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
export function validateAsrWordTimings(words, audioDurationMs = 0, toleranceMs = 1) {
    const violations = [];
    let prevEndMs = 0;
    words.forEach((w, index) => {
        const word = w.text;
        if (typeof word !== "string" || word.trim().length === 0) {
            violations.push({ index, word: String(word), reason: "empty word text" });
        }
        if (!Number.isFinite(w.startMs) || !Number.isFinite(w.endMs)) {
            violations.push({ index, word, reason: "non-finite timing" });
            return;
        }
        if (w.startMs < -toleranceMs) {
            violations.push({ index, word, reason: `startMs ${w.startMs} < 0` });
        }
        if (w.endMs < w.startMs - toleranceMs) {
            violations.push({
                index,
                word,
                reason: `endMs ${w.endMs} precedes startMs ${w.startMs}`,
            });
        }
        if (w.startMs < prevEndMs - toleranceMs) {
            violations.push({
                index,
                word,
                reason: `startMs ${w.startMs} overlaps previous end ${prevEndMs}`,
            });
        }
        if (audioDurationMs > 0 && w.endMs > audioDurationMs + toleranceMs) {
            violations.push({
                index,
                word,
                reason: `endMs ${w.endMs} exceeds audio duration ${audioDurationMs}`,
            });
        }
        prevEndMs = Math.max(prevEndMs, w.endMs);
    });
    return { ok: violations.length === 0, violations };
}
//# sourceMappingURL=transcripts.js.map