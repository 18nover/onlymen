/**
 * Canonical meeting artifacts (#12487).
 *
 * This is the durable meeting-record shape that can be produced by platform
 * bots, bot-free capture, local/system/mobile/room microphones, cloud-agent
 * capture, and imported benchmark corpora. The contract stays pure and
 * browser-safe so adapters, app-core, UI, and benchmarks can all validate the
 * same artifact without importing runtime/native code.
 */
import type { MeetingPlatform } from "./meetings.js";
import type { TranscriptSegment } from "./transcripts.js";
export declare const MEETING_ARTIFACT_SCHEMA_VERSION: "eliza.meeting_artifact.v1";
export declare const MEETING_ARTIFACT_CAPTURE_MODES: readonly ["platform_bot", "bot_free_browser", "local_capture", "cloud_agent_capture", "imported_corpus"];
export declare const MEETING_ARTIFACT_SOURCE_STREAM_KINDS: readonly ["local_mic", "system_audio", "tab_audio", "bot_participant_audio", "mixed_room_mic", "recording", "imported_corpus_audio", "mobile_mic", "cloud_agent_audio"];
export declare const MEETING_SPEAKER_NAME_PROVENANCE: readonly ["platform", "calendar", "self_introduction", "user_correction", "voice_profile", "llm_inference", "unknown"];
export type MeetingArtifactCaptureMode = (typeof MEETING_ARTIFACT_CAPTURE_MODES)[number];
export type MeetingArtifactSourceStreamKind = (typeof MEETING_ARTIFACT_SOURCE_STREAM_KINDS)[number];
export type MeetingArtifactPlatform = MeetingPlatform | "local" | "imported_corpus" | "unknown";
export type MeetingConsentState = "unknown" | "granted" | "denied" | "not_required" | "redacted";
export type MeetingSpeakerNameProvenance = (typeof MEETING_SPEAKER_NAME_PROVENANCE)[number];
export type MeetingEntityBindingStatus = "active" | "merged" | "split" | "deleted" | "revoked" | "unknown";
export interface MeetingArtifactConsent {
    state: MeetingConsentState;
    evidence?: string;
    grantedByEntityId?: string;
    grantedAt?: string;
}
export interface MeetingArtifactRetentionPolicy {
    retainAudio: boolean;
    retainTranscript: boolean;
    scope: "owner-private" | "user-private" | "agent-private" | "global";
    expiresAt?: string;
}
export interface MeetingArtifactMediaRef {
    /** Canonical `Media.id`; do not add a second file id namespace. */
    id: string;
    /** Served media-store URL, normally `/api/media/<sha256>.<ext>`. */
    url: string;
    mimeType: string;
    checksum?: string;
    durationMs?: number;
    title?: string;
}
export interface MeetingArtifactSourceStream {
    id: string;
    kind: MeetingArtifactSourceStreamKind;
    mediaRefId: string;
    label?: string;
    platformParticipantId?: string;
    channel?: number;
}
export interface MeetingArtifactPlatformParticipant {
    id: string;
    displayName?: string;
    sessionId?: string;
    tileId?: string;
    joinedAtMs?: number;
    leftAtMs?: number;
}
export interface MeetingArtifactSpeakerName {
    displayName: string;
    provenance: MeetingSpeakerNameProvenance;
    confidence: number;
    evidenceSpanIds?: string[];
}
export interface MeetingArtifactDiarizedSpeaker {
    id: string;
    sourceStreamIds: string[];
    platformParticipantIds?: string[];
    entityBindingId?: string;
    name?: MeetingArtifactSpeakerName;
    status?: "active" | "unknown" | "merged" | "split" | "deleted";
}
export interface MeetingArtifactEntityBinding {
    id: string;
    diarizedSpeakerId: string;
    entityId: string | null;
    status: MeetingEntityBindingStatus;
    confidence: number;
    provenance: MeetingSpeakerNameProvenance;
    mergedIntoEntityId?: string;
    splitFromEntityId?: string;
    deletedAt?: string;
}
export interface MeetingArtifactCorrection {
    atMs: number;
    correctedByEntityId?: string;
    previousText?: string;
    previousSpeakerId?: string;
    reason: "rename" | "merge" | "split" | "delete" | "text_edit";
}
export interface MeetingArtifactWord {
    text: string;
    startMs: number;
    endMs: number;
    confidence?: number;
    speakerId?: string;
    sourceStreamId?: string;
}
export interface MeetingArtifactTranscriptSpan {
    id: string;
    startMs: number;
    endMs: number;
    text: string;
    words: MeetingArtifactWord[];
    speakerId?: string;
    platformParticipantId?: string;
    sourceStreamId: string;
    confidence?: number;
    overlap?: boolean;
    correctionHistory?: MeetingArtifactCorrection[];
}
export interface MeetingArtifactGroundedText {
    id: string;
    text: string;
    transcriptSpanIds: string[];
    confidence?: number;
}
export interface MeetingArtifactActionItem extends MeetingArtifactGroundedText {
    assigneeEntityId?: string;
    dueAt?: string;
    status?: "open" | "done" | "dismissed";
}
export interface MeetingArtifactEvidence {
    id: string;
    kind: "media" | "log" | "metrics" | "screenshot" | "video" | "benchmark_report";
    mediaRefId?: string;
    transcriptSpanIds?: string[];
    description?: string;
}
export interface MeetingArtifact {
    schemaVersion: typeof MEETING_ARTIFACT_SCHEMA_VERSION;
    artifactId: string;
    meeting: {
        id: string;
        platform: MeetingArtifactPlatform;
        captureMode: MeetingArtifactCaptureMode;
        title?: string;
        nativeMeetingId?: string;
        startedAt?: string;
        endedAt?: string;
        consent: MeetingArtifactConsent;
        retentionPolicy: MeetingArtifactRetentionPolicy;
    };
    media: MeetingArtifactMediaRef[];
    sourceStreams: MeetingArtifactSourceStream[];
    platformParticipants: MeetingArtifactPlatformParticipant[];
    diarizedSpeakers: MeetingArtifactDiarizedSpeaker[];
    entityBindings: MeetingArtifactEntityBinding[];
    transcriptSpans: MeetingArtifactTranscriptSpan[];
    notes: MeetingArtifactGroundedText[];
    actionItems: MeetingArtifactActionItem[];
    decisions: MeetingArtifactGroundedText[];
    evidenceArtifacts: MeetingArtifactEvidence[];
    provenance?: {
        createdAt?: string;
        generator?: string;
        benchmarkCorpus?: string;
        license?: string;
        citation?: string;
    };
}
export interface MeetingArtifactValidation {
    valid: boolean;
    errors: string[];
}
export declare function validateMeetingArtifact(value: unknown): MeetingArtifactValidation;
export declare function assertValidMeetingArtifact(value: unknown): asserts value is MeetingArtifact;
export declare function meetingArtifactToTranscriptSegments(artifact: MeetingArtifact): TranscriptSegment[];
export declare function buildMeetingArtifactFixtures(): Record<string, MeetingArtifact>;
//# sourceMappingURL=meeting-artifacts.d.ts.map