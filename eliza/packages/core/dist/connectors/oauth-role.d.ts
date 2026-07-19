/**
 * Shared helper for connector plugins that resolve the requested account role
 * from an OAuth start flow's metadata.
 *
 * The connector setup UI threads the user's intent (`OWNER`, `AGENT`, or
 * `TEAM`) through `startConnectorAccountOAuth({ metadata: { requestedRole } })`.
 * The cloud-side OAuth pipeline carries that metadata into the
 * `completeOAuth` callback, where each plugin needs to read it and pin the
 * resulting `ConnectorAccount` to the right role.
 *
 * Without this helper each plugin's `completeOAuth` reimplemented the same
 * literal-string narrowing block — and the legacy default of hardcoded
 * `role: "OWNER"` ignored the requested role entirely.
 */
import type { ConnectorAccountRole } from "./account-manager.js";
/**
 * Reads `requestedRole` from an OAuth flow's metadata and returns it as a
 * canonical `ConnectorAccountRole`. Defaults to `"OWNER"` when the field is
 * absent, undefined, or not one of the three canonical values.
 *
 * Emits a debug-level log when a non-empty `requestedRole` was supplied but
 * could not be matched to a canonical role — so misconfiguration surfaces in
 * development without polluting production output. The `src` tag follows the
 * `plugin:<name>:connector` convention used elsewhere in the codebase.
 */
export declare function readRequestedConnectorRole(metadata: Record<string, unknown> | null | undefined, src: string): ConnectorAccountRole;
//# sourceMappingURL=oauth-role.d.ts.map