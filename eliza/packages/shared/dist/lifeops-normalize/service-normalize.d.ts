/**
 * LifeOps normalize/validation primitives (runtime-level, pure).
 *
 * Input normalization + validation helpers for the personal-assistant
 * pipelines: enum coercion, string/number/boolean/ISO/timezone/phone
 * normalization, and the owner-entity id derivation. Depends only on
 * `@elizaos/core`, the LifeOps contract types/constants, and the time-zone +
 * service-error primitives (all in `@elizaos/shared`). No DB, no plugin
 * imports. Consumed by `@elizaos/plugin-personal-assistant`, which keeps a thin
 * re-export shim at `lifeops/service-normalize.ts` for historical import paths.
 */
import { type IAgentRuntime } from "@elizaos/core";
import type { LifeOpsContextPolicy, LifeOpsDomain, LifeOpsPrivacyClass, LifeOpsReminderUrgency, LifeOpsSubjectType, LifeOpsVisibilityScope } from "../contracts/personal-assistant.js";
export declare function lifeOpsErrorMessage(error: unknown): string;
export declare function fail(status: number, message: string, code?: string): never;
export declare function defaultOwnerEntityId(runtime: IAgentRuntime): string;
export declare function normalizeLifeOpsDomain(value: unknown, fallback: LifeOpsDomain): LifeOpsDomain;
export declare function normalizeLifeOpsSubjectType(value: unknown, fallback: LifeOpsSubjectType): LifeOpsSubjectType;
export declare function normalizeLifeOpsVisibilityScope(value: unknown, fallback: LifeOpsVisibilityScope): LifeOpsVisibilityScope;
export declare function normalizeLifeOpsContextPolicy(value: unknown, fallback: LifeOpsContextPolicy): LifeOpsContextPolicy;
export declare function requireAgentId(runtime: IAgentRuntime): string;
export declare function requireNonEmptyString(value: unknown, field: string): string;
export declare function normalizeOptionalString(value: unknown): string | undefined;
export declare function normalizeOptionalBoolean(value: unknown, field: string): boolean | undefined;
export declare function normalizeIsoString(value: unknown, field: string): string;
export declare function normalizeOptionalIsoString(value: unknown, field: string): string | undefined;
export declare function normalizeFiniteNumber(value: unknown, field: string): number;
export declare function normalizeOptionalMinutes(value: unknown, field: string): number | undefined;
export declare function normalizePositiveInteger(value: unknown, field: string): number;
export declare function normalizeOptionalNonNegativeInteger(value: unknown, field: string): number | null;
export declare function normalizeOptionalFiniteNumber(value: unknown, field: string): number | null;
export declare function normalizeEnumValue<T extends string>(value: unknown, field: string, allowed: readonly T[], fallback?: T): T;
export declare function normalizeValidTimeZone(value: unknown, field: string, fallback?: string): string;
export declare function normalizePriority(value: unknown, current?: number): number;
export declare function normalizePrivacyClass(value: unknown, field?: string, current?: LifeOpsPrivacyClass): LifeOpsPrivacyClass;
export declare function normalizePhoneNumber(value: unknown, field: string): string;
export declare function normalizeReminderUrgency(value: unknown): LifeOpsReminderUrgency;
//# sourceMappingURL=service-normalize.d.ts.map