/**
 * Structured KMS key identifiers for system, organization, and user-scoped security material.
 */
import { KmsError } from "./types.js";
const ID_RE = /^[A-Za-z0-9_\-.]+$/;
const PURPOSE_RE = /^[a-z0-9][a-z0-9-]*$/;
function assertId(value, label) {
    if (!ID_RE.test(value)) {
        throw new KmsError(`invalid ${label}: ${JSON.stringify(value)}`);
    }
}
function assertPurpose(value) {
    if (!PURPOSE_RE.test(value)) {
        throw new KmsError(`invalid purpose: ${JSON.stringify(value)}`);
    }
}
function assertVersion(version) {
    if (!Number.isInteger(version) || version < 1) {
        throw new KmsError(`invalid key version: ${version}`);
    }
}
export function systemKey(purpose, version = 1) {
    assertPurpose(purpose);
    assertVersion(version);
    return `system:${purpose}/v${version}`;
}
export function orgKey(orgId, purpose, version = 1) {
    assertId(orgId, "org_id");
    assertVersion(version);
    return `org:${orgId}/${purpose}/v${version}`;
}
export function userKey(userId, purpose, version = 1) {
    assertId(userId, "user_id");
    assertVersion(version);
    return `user:${userId}/${purpose}/v${version}`;
}
const KEY_RE = /^(system|org|user):([A-Za-z0-9_\-.]+)(?:\/([a-z0-9][a-z0-9-]*))?\/v(\d+)$/;
export function parseKeyId(id) {
    const match = KEY_RE.exec(id);
    if (!match)
        throw new KmsError(`malformed key id: ${id}`);
    const scope = match[1];
    const principal = match[2];
    if (!principal)
        throw new KmsError(`malformed key id: ${id}`);
    const sub = match[3];
    const version = Number(match[4]);
    assertVersion(version);
    if (scope === "system") {
        if (sub !== undefined) {
            throw new KmsError(`malformed system key id: ${id}`);
        }
        return { scope: "system", purpose: principal, version };
    }
    if (scope === "org") {
        if (sub !== "dek" && sub !== "hmac") {
            throw new KmsError(`malformed org key id: ${id}`);
        }
        return { scope: "org", orgId: principal, purpose: sub, version };
    }
    if (sub !== "connector") {
        throw new KmsError(`malformed user key id: ${id}`);
    }
    return { scope: "user", userId: principal, purpose: sub, version };
}
export function isValidKeyId(id) {
    try {
        parseKeyId(id);
        return true;
    }
    catch {
        // error-policy:J3 untrusted-input sanitizing — this is a validation predicate;
        // a `KmsError` from parseKeyId means the id is malformed, so `false` is the
        // explicit "not a valid key id" result (not a swallowed failure).
        return false;
    }
}
export function withVersion(id, version) {
    parseKeyId(id);
    assertVersion(version);
    return id.replace(/\/v\d+$/, `/v${version}`);
}
export function baseKeyId(id) {
    parseKeyId(id);
    return id.replace(/\/v\d+$/, "");
}
//# sourceMappingURL=key-namespace.js.map