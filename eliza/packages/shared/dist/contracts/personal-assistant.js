export * from "./calendar.js";
export { LIFEOPS_CONNECTOR_DEGRADATION_AXES } from "./lifeops-connector-degradation.js";
export const LIFEOPS_TIME_WINDOW_NAMES = [
    "morning",
    "afternoon",
    "evening",
    "night",
    "custom",
];
export const LIFEOPS_DEFINITION_KINDS = ["task", "habit", "routine"];
export const LIFEOPS_DEFINITION_STATUSES = [
    "active",
    "paused",
    "archived",
];
export const LIFEOPS_OCCURRENCE_STATES = [
    "pending",
    "visible",
    "snoozed",
    "completed",
    "skipped",
    "expired",
    "muted",
];
export const LIFEOPS_GOAL_STATUSES = [
    "active",
    "paused",
    "archived",
    "satisfied",
];
export const LIFEOPS_REVIEW_STATES = [
    "idle",
    "needs_attention",
    "on_track",
    "at_risk",
];
export const LIFEOPS_WORKFLOW_STATUSES = [
    "active",
    "paused",
    "archived",
];
export const LIFEOPS_WORKFLOW_RUN_STATUSES = [
    "queued",
    "running",
    "success",
    "failed",
    "cancelled",
];
export const LIFEOPS_WORKFLOW_TRIGGER_TYPES = [
    "manual",
    "schedule",
    "event",
];
/**
 * Registry of event kinds that can fire a LifeOps workflow.
 *
 * Each entry is a stable identifier ("namespace.subject.verb") emitted by a
 * detector inside the engine. Adding a new entry means adding a detector that
 * publishes matching occurrences to `runDueEventWorkflows`, and — optionally —
 * a filter shape under {@link LifeOpsEventFilters}.
 */
export const LIFEOPS_EVENT_KINDS = [
    "calendar.event.ended",
    "gmail.message.received",
    "gmail.thread.needs_response",
    "lifeops.sleep.onset_candidate",
    "lifeops.sleep.detected",
    "lifeops.sleep.ended",
    "lifeops.wake.observed",
    "lifeops.wake.confirmed",
    "lifeops.nap.detected",
    "lifeops.bedtime.imminent",
    "lifeops.regularity.changed",
];
export const LIFEOPS_NEGOTIATION_STATES = [
    "initiated",
    "proposals_sent",
    "awaiting_response",
    "confirmed",
    "cancelled",
];
export const LIFEOPS_PROPOSAL_STATUSES = [
    "pending",
    "accepted",
    "declined",
    "expired",
];
export const LIFEOPS_PROPOSAL_PROPOSERS = [
    "agent",
    "owner",
    "counterparty",
];
export const LIFEOPS_CONNECTOR_PROVIDERS = [
    "google",
    "x",
    "telegram",
    "discord",
    "twilio",
    "signal",
    "whatsapp",
    "imessage",
    "apple_calendar",
    "strava",
    "fitbit",
    "withings",
    "oura",
];
export const LIFEOPS_CONNECTOR_MODES = [
    "local",
    "remote",
    "cloud_managed",
];
export const LIFEOPS_CONNECTOR_SIDES = ["owner", "agent"];
export const LIFEOPS_CONNECTOR_EXECUTION_TARGETS = ["local", "cloud"];
export const LIFEOPS_CONNECTOR_SOURCES_OF_TRUTH = [
    "local_storage",
    "cloud_connection",
    "connector_account",
];
export const LIFEOPS_GOOGLE_CAPABILITIES = [
    "google.basic_identity",
    "google.calendar.read",
    "google.calendar.write",
    "google.gmail.triage",
    "google.gmail.send",
    "google.gmail.manage",
];
export const LIFEOPS_X_CAPABILITIES = [
    "x.read",
    "x.write",
    "x.dm.read",
    "x.dm.write",
];
export const LIFEOPS_HEALTH_CONNECTOR_PROVIDERS = [
    "strava",
    "fitbit",
    "withings",
    "oura",
];
export const LIFEOPS_HEALTH_CONNECTOR_CAPABILITIES = [
    "health.activity.read",
    "health.workouts.read",
    "health.sleep.read",
    "health.readiness.read",
    "health.body.read",
    "health.vitals.read",
];
export const LIFEOPS_HEALTH_METRICS = [
    "steps",
    "active_minutes",
    "sleep_hours",
    "sleep_score",
    "readiness_score",
    "heart_rate",
    "resting_heart_rate",
    "heart_rate_variability",
    "calories",
    "distance_meters",
    "weight_kg",
    "body_fat_percent",
    "blood_pressure_systolic",
    "blood_pressure_diastolic",
    "blood_oxygen_percent",
    "respiratory_rate",
    "body_temperature_celsius",
];
export const LIFEOPS_SIGNAL_CAPABILITIES = [
    "signal.read",
    "signal.send",
];
export const LIFEOPS_DISCORD_CAPABILITIES = [
    "discord.read",
    "discord.send",
];
export const LIFEOPS_TELEGRAM_CAPABILITIES = [
    "telegram.read",
    "telegram.send",
];
// ---------------------------------------------------------------------------
// Side-aware capability policy
// Owner side = assistive (read-only). Agent side = autonomous (read + send).
// ---------------------------------------------------------------------------
export function capabilitiesForSide(allCapabilities, side) {
    if (side === "agent")
        return [...allCapabilities];
    return allCapabilities.filter((c) => c.endsWith(".read"));
}
export const LIFEOPS_REMINDER_CHANNELS = [
    "in_app",
    "sms",
    "voice",
    "telegram",
    "discord",
    "signal",
    "whatsapp",
    "imessage",
    "email",
    "push",
];
export const LIFEOPS_CHANNEL_TYPES = [
    "in_app",
    "sms",
    "voice",
    "telegram",
    "discord",
    "signal",
    "whatsapp",
    "imessage",
    "x",
    "browser",
    "email",
    "push",
    // Note: "cloud" in LIFEOPS_REMINDER_CHANNELS is a deployment target, not a user-facing delivery channel
];
export const LIFEOPS_PRIVACY_CLASSES = ["private", "shared", "public"];
export const LIFEOPS_DOMAINS = ["user_lifeops", "agent_ops"];
export const LIFEOPS_SUBJECT_TYPES = ["owner", "agent"];
export const LIFEOPS_VISIBILITY_SCOPES = [
    "owner_only",
    "agent_and_admin",
    "owner_agent_admin",
];
export const LIFEOPS_CONTEXT_POLICIES = [
    "never",
    "explicit_only",
    "sidebar_only",
    "allowed_in_private_chat",
];
export const LIFEOPS_REMINDER_URGENCY_LEVELS = [
    "low",
    "medium",
    "high",
    "critical",
];
export const LIFEOPS_REMINDER_INTENSITIES = [
    "minimal",
    "normal",
    "persistent",
    "high_priority_only",
];
export const LIFEOPS_REMINDER_INTENSITY_COMPATIBILITY_VALUES = [
    "paused",
    "low",
    "high",
];
export const LIFEOPS_REMINDER_PREFERENCE_SOURCES = [
    "default",
    "global_policy",
    "definition_metadata",
];
export const LIFEOPS_OWNER_TYPES = [
    "definition",
    "occurrence",
    "goal",
    "workflow",
    "calendar_event",
    "gmail_message",
    "connector",
    "channel_policy",
    "browser_session",
    "circadian_state",
];
export const LIFEOPS_AUDIT_EVENT_TYPES = [
    "definition_created",
    "definition_updated",
    "definition_deleted",
    "occurrence_generated",
    "occurrence_completed",
    "occurrence_skipped",
    "occurrence_snoozed",
    "goal_created",
    "goal_updated",
    "goal_deleted",
    "goal_reviewed",
    "calendar_event_created",
    "calendar_event_updated",
    "calendar_event_deleted",
    "gmail_triage_synced",
    "gmail_reply_drafted",
    "gmail_reply_sent",
    "gmail_message_sent",
    "reminder_due",
    "reminder_delivered",
    "reminder_blocked",
    "reminder_escalation_started",
    "reminder_escalation_resolved",
    "workflow_created",
    "workflow_updated",
    "workflow_run",
    "connector_grant_updated",
    "channel_policy_updated",
    "browser_session_created",
    "browser_session_updated",
    "x_post_sent",
    "seeding_offered",
    "circadian_event_emitted",
    "manual_override_accepted",
];
export const LIFEOPS_ACTORS = [
    "agent",
    "user",
    "workflow",
    "connector",
];
export const LIFEOPS_WEBSITE_ACCESS_UNLOCK_MODES = [
    "fixed_duration",
    "until_manual_lock",
    "until_callback",
];
// Generic browser-companion + packaging contracts live in
// `@elizaos/plugin-browser/contracts`. `LIFEOPS_BROWSER_KINDS`,
// `LifeOpsBrowserKind`, `LIFEOPS_BROWSER_ACTION_KINDS`,
// `LifeOpsBrowserActionKind`, and `LifeOpsBrowserAction` remain here
// because workflow-linked session shapes below still reference them.
export const LIFEOPS_BROWSER_KINDS = ["chrome", "safari"];
export const LIFEOPS_BROWSER_ACTION_KINDS = [
    "open",
    "navigate",
    "focus_tab",
    "back",
    "forward",
    "reload",
    "click",
    "type",
    "submit",
    "read_page",
    "extract_links",
    "extract_forms",
];
export const LIFEOPS_REMINDER_ATTEMPT_OUTCOMES = [
    "delivered",
    "delivered_read",
    "delivered_unread",
    "blocked_policy",
    "blocked_quiet_hours",
    "blocked_urgency",
    "blocked_acknowledged",
    "blocked_connector",
    "skipped_duplicate",
];
export const LIFEOPS_ACTIVITY_SIGNAL_SOURCES = [
    "app_lifecycle",
    "page_visibility",
    "desktop_power",
    "desktop_interaction",
    "connector_activity",
    "imessage_outbound",
    "mobile_device",
    "mobile_health",
];
/**
 * `true` when `source` is one of the built-in `LIFEOPS_ACTIVITY_SIGNAL_SOURCES`
 * (carries a typed payload schema + reliability weight). Callers narrow an open
 * `LifeOpsActivitySignalSourceName` to the closed union before reaching the
 * built-in mapper/reliability tables; a contributed source is dispatched
 * through its `SignalSourceRegistry` entry instead.
 */
export function isBuiltinActivitySignalSource(source) {
    return LIFEOPS_ACTIVITY_SIGNAL_SOURCES.includes(source);
}
export const LIFEOPS_ACTIVITY_SIGNAL_STATES = [
    "active",
    "idle",
    "background",
    "locked",
    "sleeping",
];
export const LIFEOPS_HEALTH_SIGNAL_SOURCES = [
    "healthkit",
    "health_connect",
    "strava",
    "fitbit",
    "withings",
    "oura",
];
export const LIFEOPS_HEALTH_CONNECTOR_REASONS = [
    "connected",
    "disconnected",
    "config_missing",
    "needs_reauth",
    "sync_failed",
];
export const LIFEOPS_HEALTH_SLEEP_STAGES = [
    "awake",
    "light",
    "deep",
    "rem",
    "restless",
    "unknown",
];
export const LIFEOPS_TELEMETRY_FAMILIES = [
    "device_presence_event",
    "desktop_power_event",
    "desktop_idle_sample",
    "browser_focus_window",
    "mobile_health_snapshot",
    "mobile_device_snapshot",
    "message_activity_event",
    "status_activity_event",
    "charging_event",
    "screen_time_summary",
    "manual_override_event",
];
export const LIFEOPS_CIRCADIAN_STATES = [
    "awake",
    "winding_down",
    "sleeping",
    "waking",
    "napping",
    "unclear",
];
export const LIFEOPS_UNCLEAR_REASONS = [
    "no_signals",
    "contradictory_signals",
    "insufficient_history",
    "permission_blocked",
    "signal_outage",
    "boot_cold_start",
    "stale_state",
];
export const LIFEOPS_GMAIL_RECOMMENDATION_KINDS = [
    "reply",
    "archive",
    "mark_read",
    "review_spam",
];
export const LIFEOPS_GMAIL_BULK_OPERATIONS = [
    "archive",
    "trash",
    "delete",
    "report_spam",
    "mark_read",
    "mark_unread",
    "apply_label",
    "remove_label",
];
export const LIFEOPS_GMAIL_MANAGE_EXECUTION_MODES = [
    "proposal",
    "dry_run",
    "execute",
];
export const LIFEOPS_GMAIL_MANAGE_STATUSES = [
    "proposed",
    "dry_run",
    "approved",
    "executed",
    "partial",
    "failed",
    "cancelled",
];
export const LIFEOPS_GMAIL_MANAGE_UNDO_STATUSES = [
    "not_available",
    "available",
    "completed",
    "expired",
    "failed",
];
export const LIFEOPS_GMAIL_SPAM_REVIEW_STATUSES = [
    "pending",
    "confirmed_spam",
    "not_spam",
    "dismissed",
];
export const LIFEOPS_GMAIL_DRAFT_TONES = ["brief", "neutral", "warm"];
export const LIFEOPS_INBOX_CHANNELS = [
    "gmail",
    "x_dm",
    "discord",
    "telegram",
    "signal",
    "imessage",
    "whatsapp",
    "sms",
];
/**
 * The connector-backed feeds the inbox aggregates. `chat` covers every
 * memory-backed chat channel (Discord/Telegram/Signal/iMessage/WhatsApp/SMS —
 * one local scan); `gmail` and `x_dm` are the remote connector seams.
 */
export const LIFEOPS_INBOX_SOURCES = ["chat", "gmail", "x_dm"];
export const LIFEOPS_INBOX_SOURCE_STATES = [
    "ok",
    "degraded",
    "disconnected",
];
export const LIFEOPS_INBOX_CACHE_MODES = [
    "read-through",
    "refresh",
    "cache-only",
];
export const LIFEOPS_GOOGLE_CONNECTOR_REASONS = [
    "connected",
    "disconnected",
    "config_missing",
    "token_missing",
    "needs_reauth",
];
// ---------------------------------------------------------------------------
// Messaging connector types (Signal, Discord, Telegram)
// ---------------------------------------------------------------------------
export const LIFEOPS_MESSAGING_CONNECTOR_REASONS = [
    "connected",
    "disconnected",
    "pairing",
    "auth_pending",
    "auth_expired",
    "session_revoked",
];
export const LIFEOPS_OWNER_BROWSER_ACCESS_SOURCES = [
    "lifeops_browser",
    "desktop_browser",
    "discord_desktop",
];
export const LIFEOPS_OWNER_BROWSER_TAB_STATES = [
    "missing",
    "background_discord",
    "discord_open",
    "dm_inbox_visible",
];
export const LIFEOPS_OWNER_BROWSER_AUTH_STATES = [
    "unknown",
    "logged_out",
    "logged_in",
];
export const LIFEOPS_OWNER_BROWSER_NEXT_ACTIONS = [
    "none",
    "connect_browser",
    "open_extension_popup",
    "enable_browser_access",
    "enable_browser_control",
    "open_discord",
    "open_dm_inbox",
    "focus_discord_manually",
    "focus_dm_inbox_manually",
    "log_in",
    "open_desktop_browser",
    "relaunch_discord",
];
export const LIFEOPS_TELEGRAM_AUTH_STATES = [
    "idle",
    "waiting_for_provisioning_code",
    "waiting_for_code",
    "waiting_for_password",
    "connected",
    "error",
];
export const LIFEOPS_GOAL_SUGGESTION_KINDS = [
    "create_support",
    "focus_now",
    "resolve_overdue",
    "review_progress",
    "tighten_cadence",
];
/**
 * User-attested circadian override. Emitted with maximum reliability weight;
 * force-transitions the state machine. See `sleep-wake-spec.md` §2 (manual
 * override row in the transition table).
 */
export const LIFEOPS_MANUAL_OVERRIDE_KINDS = [
    "going_to_bed",
    "just_woke_up",
];
export const LIFEOPS_BROWSER_SESSION_STATUSES = [
    "awaiting_confirmation",
    "queued",
    "running",
    "done",
    "cancelled",
    "failed",
];
// ── Additional contracts (relationships, X read, cross-channel, screen time,
//    scheduling, dossier, iMessage, WhatsApp).
// ── Message channels ─────────────────────────────────────────────────────────
export const LIFEOPS_MESSAGE_CHANNELS = [
    "email",
    "telegram",
    "discord",
    "signal",
    "sms",
    "twilio_voice",
    "imessage",
    "whatsapp",
    "x_dm",
];
// ── Follow-up statuses ───────────────────────────────────────────────────────
export const LIFEOPS_FOLLOW_UP_STATUSES = [
    "pending",
    "completed",
    "snoozed",
    "cancelled",
];
// ── X feed types ─────────────────────────────────────────────────────────────
export const LIFEOPS_X_FEED_TYPES = [
    "home_timeline",
    "mentions",
    "search",
];
export const LIFEOPS_SCREEN_TIME_RANGES = [
    "today",
    "this-week",
    "7d",
    "30d",
];
//# sourceMappingURL=personal-assistant.js.map