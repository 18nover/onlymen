/**
 * Vendor-neutral credential-proxy configuration (issue #11536, phase E3).
 *
 * The credential proxy is the NON-MODEL sibling of the model gateway (E1/E2):
 * where the model gateway fronts OpenAI-compatible traffic so raw provider
 * keys never reach the model client, the credential proxy fronts arbitrary
 * third-party APIs (github first) so a raw credential — a GitHub PAT — never
 * reaches the runtime or a spawned coding sub-agent. The agent talks to the
 * proxy with a scoped handle; the proxy injects the real credential outbound
 * (header-only) and forwards to the target. This mirrors the semantics of a
 * `@stwd/proxy-client` deployment but is deliberately vendor-neutral: any
 * broker that speaks the request shape in `client.ts` works.
 *
 * Env-var names mirror the E1/E2 `ELIZA_MODEL_GATEWAY_*` convention exactly:
 *   - `ELIZA_CREDENTIAL_PROXY_URL`         proxy base URL (may be a private
 *                                          sidecar; it is trusted operator
 *                                          config, unlike the target host).
 *   - `ELIZA_CREDENTIAL_PROXY_TOKEN`       agent-scoped bearer handle. NOT the
 *                                          raw credential.
 *   - `ELIZA_CREDENTIAL_PROXY_SIGNING_KEY` optional HMAC signing key. When set,
 *                                          every proxied request is signed
 *                                          (mirrors the broker's HMAC gate).
 *   - `ELIZA_CREDENTIAL_PROXY_STRICT`      fail-closed: refuse to proceed when a
 *                                          raw PAT is present in proxy mode.
 *   - `ELIZA_CREDENTIAL_PROXY_ROUTES`      optional JSON override of the
 *                                          per-host allowlist.
 *
 * @module features/credential-proxy/config
 */
import type { CredentialProxyRoute } from "./client.js";
export declare const CREDENTIAL_PROXY_URL_KEY = "ELIZA_CREDENTIAL_PROXY_URL";
export declare const CREDENTIAL_PROXY_TOKEN_KEY = "ELIZA_CREDENTIAL_PROXY_TOKEN";
export declare const CREDENTIAL_PROXY_SIGNING_KEY_KEY = "ELIZA_CREDENTIAL_PROXY_SIGNING_KEY";
export declare const CREDENTIAL_PROXY_STRICT_KEY = "ELIZA_CREDENTIAL_PROXY_STRICT";
export declare const CREDENTIAL_PROXY_ROUTES_KEY = "ELIZA_CREDENTIAL_PROXY_ROUTES";
/**
 * Raw VCS credential env vars that must never coexist with proxy mode in a
 * runtime or a spawned sub-agent. In strict mode their presence fails closed;
 * otherwise they are deleted before the proxy handle is injected. Scoped to
 * the git-over-https / GitHub-API credentials E3 brokers — the container
 * registry push credential (`GHCR_TOKEN`) is a distinct docker-login flow and
 * is out of scope here.
 */
export declare const CREDENTIAL_PROXY_RAW_PAT_VARS: readonly ["GITHUB_TOKEN", "GH_TOKEN", "GH_ENTERPRISE_TOKEN", "GITHUB_PAT"];
export type CredentialProxyRawPatVar = (typeof CREDENTIAL_PROXY_RAW_PAT_VARS)[number];
/**
 * Default per-host allowlist: git-over-https and the GitHub REST API. Narrow
 * by method — git smart-HTTP only uses GET (`/info/refs`) and POST
 * (`git-receive-pack` / `git-upload-pack`); the API path adds the mutating
 * verbs. Override wholesale with `ELIZA_CREDENTIAL_PROXY_ROUTES`.
 */
export declare const DEFAULT_CREDENTIAL_PROXY_ROUTES: readonly CredentialProxyRoute[];
export interface CredentialProxyConfig {
    url: string;
    token: string;
    signingKey?: string;
    strict: boolean;
    routes: readonly CredentialProxyRoute[];
}
/**
 * Minimal accessor shape. Callers pass their existing setting resolver so
 * proxy config honours the same precedence (config-env section over
 * `process.env`) as every other orchestrator setting. Not re-exported from the
 * feature barrel — the identical `GetSettingFn` from `model-gateway.ts` owns
 * that name in the core surface.
 */
type GetSettingFn = (key: string) => string | undefined;
/**
 * Thrown when strict proxy mode detects a raw PAT that would bypass the
 * broker. Named so callers (e.g. the orchestrator spawn path) can refuse the
 * spawn and surface the offending variable.
 */
export declare class CredentialProxyStrictError extends Error {
    readonly offendingVar: string;
    constructor(offendingVar: string);
}
/**
 * Resolve the active credential-proxy config, or `undefined` when proxy mode
 * is off (either the URL or token is unset). Mode is ON only when BOTH the URL
 * and token are present and non-empty — mirroring the model-gateway
 * both-or-nothing rule so a half-configured proxy never silently no-ops.
 */
export declare function resolveCredentialProxyConfig(getSetting: GetSettingFn): CredentialProxyConfig | undefined;
export {};
//# sourceMappingURL=config.d.ts.map