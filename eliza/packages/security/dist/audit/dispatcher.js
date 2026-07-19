/**
 * Audit dispatcher for validating privileged-action events and fanning them out to sinks.
 */
import { isAuditAction } from "./actions.js";
import { AuditEventSchema, newEventId, nowIso, } from "./types.js";
/**
 * Per-action-prefix metadata allowlist. Keys not on the matching prefix's
 * list are dropped before fan-out. Use this to keep raw PII out of audit
 * sinks — emit `email_hash` instead of `email`, `ip` instead of geo, etc.
 */
const METADATA_ALLOWLIST = {
    "auth.": new Set(["ip", "ua", "email_hash", "method", "provider", "reason"]),
    "api_key.": new Set(["key_id", "scopes", "reason", "name"]),
    "secret.": new Set(["secret_id", "key_path", "reason"]),
    "plugin.": new Set([
        "plugin_id",
        "version",
        "grant_id",
        "scopes",
        "reason",
        "surface",
        "target",
        "permission",
    ]),
    "agent.": new Set([
        "agent_id",
        "model",
        "reason",
        "session_id",
        "binary",
        "cwd",
        "transcript_hash",
        "transcript_bytes",
        "sandbox",
    ]),
    "vision.": new Set(["reason", "provider", "session_id", "agent_id"]),
    "payment.": new Set([
        "payment_id",
        "amount_minor",
        "currency",
        "provider",
        "reason",
    ]),
    "redemption.": new Set([
        "redemption_id",
        "amount_minor",
        "currency",
        "reason",
    ]),
    "admin.": new Set(["target_user_id", "policy_id", "reason"]),
    "data.": new Set(["request_id", "subject_id", "scope", "reason"]),
    "kms.": new Set(["key_id", "version", "algorithm", "reason"]),
};
function allowlistFor(action) {
    for (const prefix of Object.keys(METADATA_ALLOWLIST)) {
        if (action.startsWith(prefix))
            return METADATA_ALLOWLIST[prefix];
    }
    return undefined;
}
export function redactMetadata(action, metadata) {
    if (!metadata)
        return undefined;
    const allow = allowlistFor(action);
    if (!allow)
        return undefined;
    const out = {};
    for (const [k, v] of Object.entries(metadata)) {
        if (allow.has(k))
            out[k] = v;
    }
    return Object.keys(out).length > 0 ? out : undefined;
}
export class AuditDispatcher {
    sinks;
    onSinkError;
    constructor(opts) {
        this.sinks = [...opts.sinks];
        this.onSinkError =
            opts.onSinkError ??
                ((err) => {
                    process.stderr.write(`[audit] sink ${err.sink} failed: ${err.error.message}\n`);
                });
    }
    addSink(sink) {
        this.sinks.push(sink);
    }
    /**
     * Build, validate, redact, and fan out an event. One sink failing does NOT
     * prevent the others from receiving the event; failures are surfaced via
     * `onSinkError`.
     */
    async emit(input) {
        if (!isAuditAction(input.action)) {
            throw new Error(`unknown audit action: ${input.action}`);
        }
        const action = input.action;
        const event = {
            event_id: newEventId(),
            ts: nowIso(),
            actor: input.actor,
            action,
            result: input.result,
            resource: input.resource ?? null,
            ...(input.ip !== undefined ? { ip: input.ip } : {}),
            ...(input.user_agent !== undefined
                ? { user_agent: input.user_agent }
                : {}),
            ...(input.request_id !== undefined
                ? { request_id: input.request_id }
                : {}),
            ...(input.org_id !== undefined ? { org_id: input.org_id } : {}),
        };
        const redacted = redactMetadata(action, input.metadata);
        if (redacted)
            event.metadata = redacted;
        // Schema-validate as a final guard against drift.
        AuditEventSchema.parse(event);
        await Promise.all(this.sinks.map(async (sink) => {
            try {
                await sink.emit(event);
            }
            catch (err) {
                // error-policy:J7 diagnostics-must-not-kill-the-loop — one sink's
                // delivery failure must not suppress the other sinks or the caller's
                // privileged action, but a dropped audit event is a compliance
                // failure, so it is surfaced via onSinkError (never silently
                // swallowed).
                this.onSinkError({
                    sink: sink.name,
                    error: err instanceof Error ? err : new Error(String(err)),
                }, event);
            }
        }));
        return event;
    }
}
//# sourceMappingURL=dispatcher.js.map