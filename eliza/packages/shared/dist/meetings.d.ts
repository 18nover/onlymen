/**
 * Meetings — the canonical contract for agent-attended meetings.
 *
 * One shape shared across every layer: the meeting bot that JOINS a call
 * (plugin-meetings platform adapters), the pipeline that TRANSCRIBES it into
 * `Transcript` records (see ./transcripts.ts), the API routes + client that
 * TRANSPORT session state, and the UI that renders live + archived meeting
 * transcripts. Pure, browser- + node-safe: types, constants, and URL parsing
 * only — no runtime imports.
 *
 * Platform bots join as anonymous guests (bot name only, no OAuth); calendar
 * integration and post-hoc artifacts remain the OAuth surfaces.
 */
import type { Transcript, TranscriptSegment } from "./transcripts.js";
/** Platforms an agent can attend. Browser-bot: meet/teams/zoom. Native RX: discord. */
export type MeetingPlatform = "google_meet" | "teams" | "zoom" | "discord";
export declare const MEETING_PLATFORMS: readonly MeetingPlatform[];
/** Lifecycle of one attended meeting session. */
export type MeetingSessionStatus = "requested" | "joining" | "awaiting_admission" | "active" | "leaving" | "ended" | "failed";
/** Why a session left/ended (mirrors the platform flow's leave reasons). */
export type MeetingEndReason = "normal_completion" | "requested_stop" | "duration_cap_reached" | "ended_due_to_spend_cap" | "removed_by_admin" | "left_alone_timeout" | "startup_alone_timeout" | "admission_timeout" | "admission_rejected" | "join_failed" | "error";
/** Auto-leave timeouts, all milliseconds. */
export interface MeetingAutoLeaveConfig {
    /** Give up if not admitted from the waiting room within this window. */
    waitingRoomTimeoutMs: number;
    /** Leave if nobody else ever joined. */
    noOneJoinedTimeoutMs: number;
    /** Leave after everyone else has left. */
    everyoneLeftTimeoutMs: number;
}
export declare const DEFAULT_MEETING_AUTO_LEAVE: MeetingAutoLeaveConfig;
/** Default upper bound for a browser-bot meeting session: 60 minutes. */
export declare const DEFAULT_MEETING_MAX_DURATION_MS: number;
/**
 * Owner-side context for post-meeting "ghost attendance" processing. Meeting
 * capture owns the transcript; LifeOps owns what to do with it for the owner.
 */
export interface MeetingGhostAttendanceContext {
    ownerUserId: string;
    ownerDisplayName: string;
    requestedBy?: string;
    careAbouts: string[];
    calendarId?: string;
    approvalTtlMs?: number;
    attendees?: Array<{
        name: string;
        email?: string;
    }>;
}
/** Input contract to start a bot (the request side of POST /api/meetings). */
export interface MeetingJoinRequest {
    platform: MeetingPlatform;
    meetingUrl: string;
    /** Display name the bot joins under. */
    botName?: string;
    /** BCP-47 hint for ASR; auto-detect when absent. */
    language?: string;
    autoLeave?: Partial<MeetingAutoLeaveConfig>;
    /** Retain the meeting audio on the transcript record (default true). */
    retainAudio?: boolean;
    /**
     * Optional lower per-session cap in milliseconds. The service rejects values
     * above its configured maximum before launching the bot.
     */
    maxDurationMs?: number;
    /** Calendar event that prompted the join, when auto-joined. */
    calendarEventId?: string;
    /**
     * Optional LifeOps post-processing context: when present, a finalized
     * transcript can be analyzed as a meeting the owner skipped.
     */
    ghostAttendance?: MeetingGhostAttendanceContext;
}
/** Metering state exposed so routes/UI can prove a meeting is spend-bounded. */
export interface MeetingBillingState {
    status: "unmetered" | "reserved" | "spend_cap_reached" | "reconciled";
    reservedMs: number;
    consumedMs: number;
    capMs?: number;
    reservationIds?: string[];
    error?: string;
}
/** A participant observed in the meeting roster. */
export interface MeetingParticipant {
    /** Stable id within the session (platform participant id or synthesized). */
    id: string;
    displayName: string;
    /** Resolved elizaOS entity id, when identity binding succeeded. */
    entityId?: string;
    joinedAtMs?: number;
    leftAtMs?: number;
}
/** One attended meeting session — the API/UI projection of bot state. */
export interface MeetingSession {
    id: string;
    platform: MeetingPlatform;
    meetingUrl: string;
    /** Platform-native meeting id (e.g. Meet's xxx-xxxx-xxx). */
    nativeMeetingId: string;
    botName: string;
    status: MeetingSessionStatus;
    endReason?: MeetingEndReason;
    /** Present when status is "failed" (or ended with error). */
    errorMessage?: string;
    /** Epoch ms timestamps for the lifecycle edges. */
    requestedAt: number;
    activeAt?: number;
    endedAt?: number;
    /** elizaOS room this meeting's memories/transcript hang off. */
    roomId?: string;
    /** The live/final Transcript record id (source "meeting"). */
    transcriptId?: string;
    /**
     * Present (true) on a served session DTO when the viewer's transcript
     * disclosure resolved to the redacted variant (#14781): `transcriptId` stays
     * usable (the transcripts API serves that viewer the variant under the same
     * id) and the client renders a redacted badge. Never stored.
     */
    transcriptRedacted?: true;
    participants: MeetingParticipant[];
    calendarEventId?: string;
    /** Maximum duration approved for this session, in milliseconds. */
    maxDurationMs?: number;
    billing?: MeetingBillingState;
    metadata?: Record<string, unknown>;
}
/**
 * Live transcript event pushed over the agent WebSocket while a meeting is
 * active. `confirmed` segments are stable (LocalAgreement-confirmed);
 * `pending` is the mutable tail and replaces any prior pending state.
 */
export interface MeetingTranscriptEvent {
    type: "meeting-transcript";
    sessionId: string;
    transcriptId: string;
    confirmed: TranscriptSegment[];
    pending: TranscriptSegment[];
}
/** Session lifecycle event pushed over the agent WebSocket. */
export interface MeetingStatusEvent {
    type: "meeting-status";
    session: MeetingSession;
}
export type MeetingWsEvent = MeetingTranscriptEvent | MeetingStatusEvent;
/** Runtime event emitted when a meeting transcript is finalized and readable. */
export declare const MEETING_TRANSCRIPT_FINALIZED_EVENT = "meeting.transcript.finalized";
export interface MeetingTranscriptFinalizedPayload {
    session: MeetingSession;
    transcript: Transcript;
    ghostAttendance?: MeetingGhostAttendanceContext;
}
/** Result of parsing a user-supplied meeting URL. */
export interface ParsedMeetingUrl {
    platform: MeetingPlatform;
    /** Canonical URL the bot should navigate to. */
    meetingUrl: string;
    nativeMeetingId: string;
}
/**
 * Classify a meeting URL and extract the platform-native id. Returns null for
 * URLs that are not a recognizable Meet/Teams/Zoom meeting link. Discord
 * "meetings" are voice channels and never arrive as URLs here.
 */
export declare function parseMeetingUrl(raw: string): ParsedMeetingUrl | null;
/** Human-readable platform names for UI badges and logs. */
export declare const MEETING_PLATFORM_LABELS: Record<MeetingPlatform, string>;
//# sourceMappingURL=meetings.d.ts.map