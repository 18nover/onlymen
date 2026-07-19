/**
 * Trigger scheduling math: parses 5-field cron expressions (with `N/step`,
 * range, list, and the Sunday-as-7 alias), computes the next matching run time
 * in a given timezone (honoring POSIX day-of-month/day-of-week OR-semantics and
 * DST fall-back dedupe), and resolves interval/once/cron/event triggers to
 * their next-run timing. Cron parsing returns null on malformed input; interval
 * values are clamped to [MIN, MAX]_TRIGGER_INTERVAL_MS.
 */
import type { TriggerConfig } from "../types/trigger.js";
export declare const MIN_TRIGGER_INTERVAL_MS = 60000;
export declare const MAX_TRIGGER_INTERVAL_MS: number;
export declare const DISABLED_TRIGGER_INTERVAL_MS: number;
interface CronSchedule {
    minute: Set<number>;
    hour: Set<number>;
    dayOfMonth: Set<number>;
    month: Set<number>;
    dayOfWeek: Set<number>;
    /**
     * Standard (POSIX/Vixie) cron day semantics: when BOTH day-of-month and
     * day-of-week are restricted (the field does not start with `*`), a
     * candidate matches when EITHER field matches; otherwise both must match.
     * `0 0 13 * 5` therefore fires on every 13th AND every Friday — not only
     * on Friday-the-13th.
     */
    dayOfMonthRestricted: boolean;
    dayOfWeekRestricted: boolean;
}
export declare function normalizeTriggerIntervalMs(intervalMs: number): number;
export declare function parseCronExpression(expression: string): CronSchedule | null;
export declare function computeNextCronRunAtMs(expression: string, fromMs: number, timezone?: string): number | null;
export declare function parseScheduledAtIso(scheduledAtIso: string): number | null;
export interface TriggerTiming {
    updatedAt: number;
    updateIntervalMs: number;
    nextRunAtMs: number;
}
export declare function resolveTriggerTiming(trigger: TriggerConfig, nowMs: number): TriggerTiming | null;
export {};
//# sourceMappingURL=triggerScheduling.d.ts.map