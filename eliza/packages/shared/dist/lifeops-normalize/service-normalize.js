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
import { stringToUuid } from "@elizaos/core";
import { LIFEOPS_CONTEXT_POLICIES, LIFEOPS_DOMAINS, LIFEOPS_PRIVACY_CLASSES, LIFEOPS_REMINDER_URGENCY_LEVELS, LIFEOPS_SUBJECT_TYPES, LIFEOPS_VISIBILITY_SCOPES, } from "../contracts/personal-assistant.js";
import { LIFEOPS_TIME_ZONE_ALIASES } from "../lifeops-constants/index.js";
import { LifeOpsServiceError } from "./service-error.js";
import { isValidTimeZone, resolveDefaultTimeZone } from "./time-zone.js";
export function lifeOpsErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
export function fail(status, message, code) {
    throw new LifeOpsServiceError(status, message, code);
}
export function defaultOwnerEntityId(runtime) {
    return stringToUuid(`${requireAgentId(runtime)}-admin-entity`);
}
export function normalizeLifeOpsDomain(value, fallback) {
    return normalizeEnumValue(value, "ownership.domain", LIFEOPS_DOMAINS, fallback);
}
export function normalizeLifeOpsSubjectType(value, fallback) {
    return normalizeEnumValue(value, "ownership.subjectType", LIFEOPS_SUBJECT_TYPES, fallback);
}
export function normalizeLifeOpsVisibilityScope(value, fallback) {
    return normalizeEnumValue(value, "ownership.visibilityScope", LIFEOPS_VISIBILITY_SCOPES, fallback);
}
export function normalizeLifeOpsContextPolicy(value, fallback) {
    return normalizeEnumValue(value, "ownership.contextPolicy", LIFEOPS_CONTEXT_POLICIES, fallback);
}
export function requireAgentId(runtime) {
    const agentId = runtime.agentId;
    if (typeof agentId !== "string" || agentId.trim().length === 0) {
        fail(500, "agent runtime is missing agentId");
    }
    return agentId;
}
export function requireNonEmptyString(value, field) {
    if (typeof value !== "string") {
        fail(400, `${field} must be a string`);
    }
    const normalized = value.trim();
    if (normalized.length === 0) {
        fail(400, `${field} is required`);
    }
    return normalized;
}
export function normalizeOptionalString(value) {
    if (typeof value !== "string")
        return undefined;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
}
export function normalizeOptionalBoolean(value, field) {
    if (value === undefined) {
        return undefined;
    }
    if (typeof value === "boolean") {
        return value;
    }
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        if (normalized === "true" || normalized === "1") {
            return true;
        }
        if (normalized === "false" || normalized === "0") {
            return false;
        }
    }
    fail(400, `${field} must be a boolean`);
}
export function normalizeIsoString(value, field) {
    const text = requireNonEmptyString(value, field);
    const parsed = Date.parse(text);
    if (!Number.isFinite(parsed)) {
        fail(400, `${field} must be a valid ISO datetime`);
    }
    return new Date(parsed).toISOString();
}
export function normalizeOptionalIsoString(value, field) {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    return normalizeIsoString(value, field);
}
export function normalizeFiniteNumber(value, field) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string" && value.trim().length > 0) {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    fail(400, `${field} must be a finite number`);
}
export function normalizeOptionalMinutes(value, field) {
    if (value === null || value === undefined || value === "")
        return undefined;
    const minutes = Math.trunc(normalizeFiniteNumber(value, field));
    if (minutes < 0) {
        fail(400, `${field} must be zero or greater`);
    }
    return minutes;
}
export function normalizePositiveInteger(value, field) {
    const number = Math.trunc(normalizeFiniteNumber(value, field));
    if (number <= 0) {
        fail(400, `${field} must be greater than zero`);
    }
    return number;
}
export function normalizeOptionalNonNegativeInteger(value, field) {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    const number = Math.trunc(normalizeFiniteNumber(value, field));
    if (number < 0) {
        fail(400, `${field} must be zero or greater`);
    }
    return number;
}
export function normalizeOptionalFiniteNumber(value, field) {
    if (value === null || value === undefined || value === "") {
        return null;
    }
    return normalizeFiniteNumber(value, field);
}
export function normalizeEnumValue(value, field, allowed, fallback) {
    if (fallback !== undefined &&
        (value === undefined || value === null || value === "")) {
        return fallback;
    }
    const text = requireNonEmptyString(value, field);
    if (!allowed.includes(text)) {
        fail(400, `${field} must be one of: ${allowed.join(", ")}`);
    }
    return text;
}
export function normalizeValidTimeZone(value, field, fallback = resolveDefaultTimeZone()) {
    if (value === undefined || value === null) {
        return fallback;
    }
    if (typeof value !== "string") {
        fail(400, `${field} must be a valid IANA time zone`);
    }
    const candidate = value.trim();
    if (candidate.length === 0) {
        return fallback;
    }
    const normalized = LIFEOPS_TIME_ZONE_ALIASES[candidate.toLowerCase()] ?? candidate;
    if (!isValidTimeZone(normalized)) {
        fail(400, `${field} must be a valid IANA time zone`);
    }
    return normalized;
}
export function normalizePriority(value, current = 3) {
    if (value === undefined)
        return current;
    const priority = Math.trunc(normalizeFiniteNumber(value, "priority"));
    if (priority < 1 || priority > 5) {
        fail(400, "priority must be between 1 and 5");
    }
    return priority;
}
export function normalizePrivacyClass(value, field = "privacyClass", current = "private") {
    if (value === undefined) {
        return current;
    }
    return normalizeEnumValue(value, field, LIFEOPS_PRIVACY_CLASSES);
}
export function normalizePhoneNumber(value, field) {
    const raw = requireNonEmptyString(value, field);
    const digits = raw.replace(/[^\d+]/g, "");
    if (digits.startsWith("+")) {
        const normalized = `+${digits.slice(1).replace(/\D/g, "")}`;
        if (!/^\+\d{10,15}$/.test(normalized)) {
            fail(400, `${field} must be a valid E.164 phone number`);
        }
        return normalized;
    }
    const plainDigits = digits.replace(/\D/g, "");
    if (/^\d{10}$/.test(plainDigits)) {
        return `+1${plainDigits}`;
    }
    if (/^1\d{10}$/.test(plainDigits)) {
        return `+${plainDigits}`;
    }
    fail(400, `${field} must be a valid phone number`);
}
export function normalizeReminderUrgency(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
        return "medium";
    }
    return normalizeEnumValue(value, "urgency", LIFEOPS_REMINDER_URGENCY_LEVELS);
}
//# sourceMappingURL=service-normalize.js.map