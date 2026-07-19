/**
 * LifeOps service constants (canonical, runtime-level).
 *
 * Plain constant tables for the personal-assistant scheduled-task / reminder /
 * connector pipelines: overview limits, Google cache TTLs, reminder metadata
 * keys, escalation timing, timezone aliases, and default policies. Depends only
 * on the LifeOps contract types (mirrored in `@elizaos/shared`); no DB, no
 * plugin imports. Consumed by `@elizaos/plugin-personal-assistant`, which keeps
 * a thin re-export shim at `lifeops/service-constants.ts` for historical
 * import paths.
 */
import type { LifeOpsReminderIntensity, LifeOpsReminderStep, LifeOpsReminderUrgency, LifeOpsWorkflowPermissionPolicy } from "../contracts/personal-assistant.js";
export declare const MAX_OVERVIEW_OCCURRENCES = 8;
export declare const MAX_OVERVIEW_REMINDERS = 6;
export declare const OVERVIEW_HORIZON_MINUTES: number;
export declare const DAY_MINUTES: number;
export declare const GOOGLE_CALENDAR_CACHE_TTL_MS: number;
export declare const GOOGLE_GMAIL_CACHE_TTL_MS: number;
export declare const GOOGLE_PRIMARY_CALENDAR_ID = "primary";
export declare const GOOGLE_GMAIL_MAILBOX = "me";
export declare const DEFAULT_GMAIL_TRIAGE_MAX_RESULTS = 12;
export declare const MAX_GMAIL_TRIAGE_MAX_RESULTS = 5000;
export declare const DEFAULT_NEXT_EVENT_LOOKAHEAD_DAYS = 30;
export declare const DEFAULT_GMAIL_SEARCH_SCAN_LIMIT = 50;
export declare const DEFAULT_GMAIL_SEARCH_CACHE_SCAN_LIMIT = 200;
export declare const DEFAULT_REMINDER_PROCESS_LIMIT = 24;
export declare const DEFAULT_WORKFLOW_PROCESS_LIMIT = 12;
export declare const GOAL_REVIEW_LOOKBACK_DAYS = 7;
export declare const GOAL_SEMANTIC_REVIEW_CACHE_TTL_MS: number;
export declare const DEFINITION_PERFORMANCE_LAST7_DAYS = 7;
export declare const DEFINITION_PERFORMANCE_LAST30_DAYS = 30;
export declare const DEFAULT_REMINDER_INTENSITY: LifeOpsReminderIntensity;
export declare const GLOBAL_REMINDER_PREFERENCE_CHANNEL_REF = "lifeops://owner/reminder-preferences";
export declare const REMINDER_INTENSITY_METADATA_KEY = "reminderIntensity";
export declare const REMINDER_INTENSITY_UPDATED_AT_METADATA_KEY = "reminderIntensityUpdatedAt";
export declare const REMINDER_INTENSITY_NOTE_METADATA_KEY = "reminderIntensityNote";
export declare const REMINDER_PREFERENCE_SCOPE_METADATA_KEY = "reminderPreferenceScope";
export declare const REMINDER_LIFECYCLE_METADATA_KEY = "lifecycle";
export declare const REMINDER_ESCALATION_INDEX_METADATA_KEY = "escalationIndex";
export declare const REMINDER_ESCALATION_REASON_METADATA_KEY = "escalationReason";
export declare const REMINDER_ESCALATION_ACTIVITY_PLATFORM_METADATA_KEY = "activityPlatform";
export declare const REMINDER_ESCALATION_ACTIVITY_ACTIVE_METADATA_KEY = "activityActive";
export declare const REMINDER_ESCALATION_STARTED_AT_METADATA_KEY = "reminderEscalationStartedAt";
export declare const REMINDER_ESCALATION_LAST_ATTEMPT_AT_METADATA_KEY = "reminderEscalationLastAttemptAt";
export declare const REMINDER_ESCALATION_LAST_CHANNEL_METADATA_KEY = "reminderEscalationLastChannel";
export declare const REMINDER_ESCALATION_LAST_OUTCOME_METADATA_KEY = "reminderEscalationLastOutcome";
export declare const REMINDER_ESCALATION_CHANNELS_METADATA_KEY = "reminderEscalationChannels";
export declare const REMINDER_ESCALATION_RESOLVED_AT_METADATA_KEY = "reminderEscalationResolvedAt";
export declare const REMINDER_ESCALATION_RESOLUTION_METADATA_KEY = "reminderEscalationResolution";
export declare const REMINDER_ESCALATION_RESOLUTION_NOTE_METADATA_KEY = "reminderEscalationResolutionNote";
export declare const REMINDER_ESCALATION_PROFILE_METADATA_KEY = "reminderEscalationProfile";
export declare const REMINDER_REVIEW_AFTER_MINUTES_METADATA_KEY = "reminderReviewAfterMinutes";
export declare const REMINDER_REVIEW_AT_METADATA_KEY = "reminderReviewAt";
export declare const REMINDER_REVIEW_REASON_METADATA_KEY = "reminderReviewReason";
export declare const REMINDER_REVIEW_STATUS_METADATA_KEY = "reminderReviewStatus";
export declare const REMINDER_REVIEW_DECISION_METADATA_KEY = "reminderReviewDecision";
export declare const REMINDER_REVIEW_RESPONDED_AT_METADATA_KEY = "reminderReviewRespondedAt";
export declare const REMINDER_REVIEW_RESPONSE_TEXT_METADATA_KEY = "reminderReviewResponseText";
export declare const REMINDER_REVIEW_CLASSIFIER_SOURCE_METADATA_KEY = "reminderReviewClassifierSource";
export declare const REMINDER_REVIEW_SEMANTIC_REASON_METADATA_KEY = "reminderReviewSemanticReason";
export declare const REMINDER_REVIEW_ESCALATED_AT_METADATA_KEY = "reminderReviewEscalatedAt";
export declare const REMINDER_REVIEW_ESCALATED_ATTEMPT_ID_METADATA_KEY = "reminderReviewEscalatedAttemptId";
export declare const REMINDER_REVIEW_ESCALATED_CHANNEL_METADATA_KEY = "reminderReviewEscalatedChannel";
export declare const REMINDER_ACTIVITY_GATE_METADATA_KEY = "reminderActivityGate";
export declare const REMINDER_ACTIVITY_GATES: readonly ["active_on_computer"];
export type ReminderActivityGate = (typeof REMINDER_ACTIVITY_GATES)[number];
export declare const REMINDER_URGENCY_METADATA_KEY = "reminderUrgency";
export declare const REMINDER_URGENCY_LEGACY_METADATA_KEY = "urgency";
export declare const reminderProcessingQueues: Map<string, Promise<void>>;
export declare const LIFEOPS_TIME_ZONE_ALIASES: Record<string, string>;
export declare const PROACTIVE_TASK_QUERY_TAGS: readonly ["queue", "repeat", "proactive"];
export declare const REMINDER_ESCALATION_DELAYS: Record<LifeOpsReminderUrgency, {
    initialMinutes: number | null;
    repeatMinutes: number | null;
}>;
export declare const DEFAULT_CALENDAR_REMINDER_STEPS: LifeOpsReminderStep[];
export declare const DEFAULT_WORKFLOW_PERMISSION_POLICY: LifeOpsWorkflowPermissionPolicy;
export declare const REMINDER_INTENSITY_CANONICAL_ALIASES: Record<string, LifeOpsReminderIntensity>;
//# sourceMappingURL=service-constants.d.ts.map