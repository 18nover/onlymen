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
export const MEETING_PLATFORMS = [
    "google_meet",
    "teams",
    "zoom",
    "discord",
];
export const DEFAULT_MEETING_AUTO_LEAVE = {
    waitingRoomTimeoutMs: 5 * 60 * 1000,
    noOneJoinedTimeoutMs: 10 * 60 * 1000,
    everyoneLeftTimeoutMs: 2 * 60 * 1000,
};
/** Default upper bound for a browser-bot meeting session: 60 minutes. */
export const DEFAULT_MEETING_MAX_DURATION_MS = 60 * 60 * 1000;
/** Runtime event emitted when a meeting transcript is finalized and readable. */
export const MEETING_TRANSCRIPT_FINALIZED_EVENT = "meeting.transcript.finalized";
/**
 * Percent-decode a URL segment, returning null (never throwing) on a malformed
 * escape like a lone `%`. `decodeURIComponent` throws `URIError` on such input,
 * and this parser runs on every keystroke in the Transcripts view + inside
 * JOIN_MEETING.validate and POST /api/meetings, so a bad character must degrade
 * to "not a recognizable meeting link", not crash the surface.
 */
function safeDecodeUriComponent(value) {
    try {
        return decodeURIComponent(value);
    }
    catch {
        // error-policy:J3 malformed percent-escape -> not a recognizable link
        return null;
    }
}
const MEET_URL_RE = /^https?:\/\/meet\.google\.com\/([a-z]{3}-?[a-z]{4}-?[a-z]{3})(?:\?.*)?$/i;
const TEAMS_URL_RE = /^https?:\/\/(?:[\w-]+\.)?teams\.(?:microsoft|live)\.com\/(?:v2\/)?(?:l\/)?meet(?:up-join)?\/([^?\s]+)/i;
const TEAMS_SHORT_RE = /^https?:\/\/teams\.microsoft\.com\/meet\/(\d+)/i;
const ZOOM_URL_RE = /^https?:\/\/(?:[\w-]+\.)?zoom\.us\/(?:j|w|wc)\/(?:join\/)?(\d{9,12})(?:[/?]|$)/i;
const ZOOM_APP_RE = /^https?:\/\/app\.zoom\.us\/wc\/(\d{9,12})\/join/i;
/**
 * Classify a meeting URL and extract the platform-native id. Returns null for
 * URLs that are not a recognizable Meet/Teams/Zoom meeting link. Discord
 * "meetings" are voice channels and never arrive as URLs here.
 */
export function parseMeetingUrl(raw) {
    const url = raw.trim();
    const meet = MEET_URL_RE.exec(url);
    if (meet) {
        // MEET_URL_RE is case-insensitive, so lowercase the parsed id before
        // canonicalizing — otherwise `ABC-DEFG-HIJ` and `abc-defg-hij` produce
        // different native ids and the already_joined dedup can be bypassed by case.
        const id = meet[1].toLowerCase().replace(/-/g, "");
        const canonical = `${id.slice(0, 3)}-${id.slice(3, 7)}-${id.slice(7)}`;
        return {
            platform: "google_meet",
            meetingUrl: `https://meet.google.com/${canonical}`,
            nativeMeetingId: canonical,
        };
    }
    const zoomApp = ZOOM_APP_RE.exec(url);
    if (zoomApp) {
        return { platform: "zoom", meetingUrl: url, nativeMeetingId: zoomApp[1] };
    }
    const zoom = ZOOM_URL_RE.exec(url);
    if (zoom) {
        // The web client join URL; preserves ?pwd= and other params.
        const parsed = new URL(url);
        const pwd = parsed.searchParams.get("pwd");
        const joinUrl = `https://app.zoom.us/wc/${zoom[1]}/join${pwd ? `?pwd=${encodeURIComponent(pwd)}` : ""}`;
        return { platform: "zoom", meetingUrl: joinUrl, nativeMeetingId: zoom[1] };
    }
    const teamsShort = TEAMS_SHORT_RE.exec(url);
    if (teamsShort) {
        return {
            platform: "teams",
            meetingUrl: url,
            nativeMeetingId: teamsShort[1],
        };
    }
    const teams = TEAMS_URL_RE.exec(url);
    if (teams) {
        const decoded = safeDecodeUriComponent(teams[1]);
        if (decoded === null)
            return null;
        return {
            platform: "teams",
            meetingUrl: url,
            nativeMeetingId: decoded.slice(0, 128),
        };
    }
    return null;
}
/** Human-readable platform names for UI badges and logs. */
export const MEETING_PLATFORM_LABELS = {
    google_meet: "Google Meet",
    teams: "Microsoft Teams",
    zoom: "Zoom",
    discord: "Discord",
};
//# sourceMappingURL=meetings.js.map