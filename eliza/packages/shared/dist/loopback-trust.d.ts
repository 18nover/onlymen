/**
 * Same-machine ("loopback") request trust evaluation.
 *
 * This is a SECURITY BOUNDARY: it decides whether an unauthenticated HTTP
 * request is allowed to act as the local dashboard owner. Previously the exact
 * same logic was triplicated across `@elizaos/app-core` (`compat-route-shared`)
 * and `@elizaos/agent` (`server-helpers-auth`), with subtly divergent env-policy
 * gates and a non-equivalent `isLoopbackBindHost`. The divergence was a parity
 * hazard, so the logic is unified here and parameterised so each consumer keeps
 * its EXACT prior trust decisions.
 *
 * The two consumers differ ONLY in their policy gates, expressed via
 * {@link LoopbackTrustOptions}:
 *  - app-core: requireLocalAuthEnv + devAuthBypassEnv, cloudCheck "env"
 *    (`ELIZA_CLOUD_PROVISIONED === "1"` through the boot alias table).
 *  - agent:    requireLocalAuthEnv (no dev bypass), cloudCheck "container"
 *    (`isCloudProvisionedContainer()` — flag AND a provisioning token).
 *
 * The host/origin classification (`isLoopbackBindHost`) is the canonical strict
 * implementation from `runtime-env.ts` for BOTH consumers. For app-core this is
 * byte-identical (it already imported the shared helper). For the agent this is
 * a strict tightening in the safe direction: the agent's hand-rolled copy
 * accepted any `127.*`-prefixed host string (e.g. the DNS-rebinding host
 * `127.0.0.1.evil.com`), which the strict parser correctly rejects. The change
 * can only ever turn a previously-trusted request into an untrusted one, never
 * the reverse.
 */
import type http from "node:http";
export interface LoopbackTrustOptions {
    /**
     * When true, deny local trust if `ELIZA_REQUIRE_LOCAL_AUTH === "1"`. On-device
     * local agents (Android) set this flag alongside a per-boot API token because
     * the loopback interface is shared with every other app on the device, so
     * loopback alone is NOT a trust signal there.
     */
    requireLocalAuthEnv: boolean;
    /**
     * When true, `ELIZA_DEV_AUTH_BYPASS === "1"` in a development `NODE_ENV`
     * overrides {@link requireLocalAuthEnv}, restoring local trust for the dev
     * dashboard. Only app-core honours this; the agent never does.
     */
    devAuthBypassEnv: boolean;
    /**
     * Cloud-container detection strategy. `"env"` trusts the raw
     * `ELIZA_CLOUD_PROVISIONED` flag; `"container"` requires the flag AND a
     * provisioning token (see {@link isCloudProvisionedContainer}). These are
     * DIFFERENT semantics — do not swap them between consumers.
     */
    cloudCheck: "env" | "container";
}
/**
 * True when any proxy-style client-IP header carries a non-loopback (or
 * unparseable) address. A request that reaches a same-machine listener but
 * advertises a remote client behind a proxy must NOT be granted local trust.
 */
export declare function proxyClientHeaderBlocksLocalTrust(headers: http.IncomingHttpHeaders): boolean;
/**
 * True when the TCP peer address is a loopback address. Note this is stricter
 * than {@link isLoopbackBindHost}: it matches only fully-normalised loopback
 * addresses (no host:port or URL forms), since `socket.remoteAddress` is always
 * a bare IP.
 */
export declare function isLoopbackRemoteAddress(remoteAddress: string | null | undefined): boolean;
/**
 * Same-machine dashboard access. Intentionally stricter than a bare
 * `remoteAddress` check: the browser must also target a loopback Host and must
 * not present cross-site browser metadata or proxy client-IP headers.
 *
 * Each consumer supplies {@link LoopbackTrustOptions} matching its historical
 * policy gates; the host/origin/proxy classification is identical for all.
 */
export declare function isTrustedLocalRequest(req: Pick<http.IncomingMessage, "headers" | "socket">, options: LoopbackTrustOptions): boolean;
//# sourceMappingURL=loopback-trust.d.ts.map