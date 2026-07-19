/**
 * Per-model-type user override: "for TEXT_LARGE, prefer this provider".
 *
 * Persisted to `$STATE_DIR/local-inference/routing.json` and read by the
 * router-handler (see `router-handler.ts`) to pick a provider at dispatch
 * time. When a slot has no override, the runtime's native priority order
 * wins — i.e. this is layered over the existing registration priority
 * rather than replacing it.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { localInferenceRoot } from "./paths.js";
/**
 * The full set of selectable policies, in display order. Kept as a runtime
 * value (not just a type) so route-layer validation and the settings UI share
 * one source of truth for "which policies are accepted".
 *
 * `local-only` / `cloud-only` are the canonical per-slot replacements for the
 * global `ELIZA_LOCAL_ONLY` env hack: `local-only` is a hard guarantee (never
 * falls through to cloud), `cloud-only` never dispatches on-device.
 */
export const ROUTING_POLICIES = [
    "manual",
    "auto",
    "local-only",
    "cloud-only",
    "cheapest",
    "fastest",
    "prefer-local",
    "round-robin",
];
export function isRoutingPolicy(value) {
    return (typeof value === "string" &&
        ROUTING_POLICIES.includes(value));
}
export const DEFAULT_ROUTING_POLICY = "prefer-local";
const EMPTY = { preferredProvider: {}, policy: {} };
function routingPath() {
    return path.join(localInferenceRoot(), "routing.json");
}
async function ensureRoot() {
    await fs.mkdir(localInferenceRoot(), { recursive: true });
}
export async function readRoutingPreferences() {
    try {
        const raw = await fs.readFile(routingPath(), "utf8");
        const parsed = JSON.parse(raw);
        if (parsed?.version !== 1 || !parsed.preferences)
            return EMPTY;
        return {
            preferredProvider: parsed.preferences.preferredProvider,
            policy: parsed.preferences.policy,
        };
    }
    catch {
        return EMPTY;
    }
}
export async function writeRoutingPreferences(prefs) {
    await ensureRoot();
    const payload = { version: 1, preferences: prefs };
    const tmp = `${routingPath()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(payload, null, 2), "utf8");
    await fs.rename(tmp, routingPath());
}
export async function setPreferredProvider(slot, provider) {
    const current = await readRoutingPreferences();
    const next = {
        preferredProvider: { ...current.preferredProvider },
        policy: { ...current.policy },
    };
    if (provider) {
        next.preferredProvider[slot] = provider;
    }
    else {
        delete next.preferredProvider[slot];
    }
    await writeRoutingPreferences(next);
    return next;
}
export async function setPolicy(slot, policy) {
    const current = await readRoutingPreferences();
    const next = {
        preferredProvider: { ...current.preferredProvider },
        policy: { ...current.policy },
    };
    if (policy) {
        next.policy[slot] = policy;
    }
    else {
        delete next.policy[slot];
    }
    await writeRoutingPreferences(next);
    return next;
}
//# sourceMappingURL=routing-preferences.js.map