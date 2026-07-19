/**
 * SandboxRegistry — self-registers a cloud-provisioned container in the shared
 * Redis so the multi-tenant gateways (`gateway-discord`, `gateway-webhook`) can
 * resolve `agent_id -> server URL` and forward inbound platform messages to
 * THIS container.
 *
 * It writes two Redis keys with a short TTL; a periodic heartbeat refreshes the
 * TTL while the container is alive, and `unregister()` deletes them on graceful
 * shutdown if they still point at this container. If the container crashes, the
 * keys expire naturally and the gateways stop routing to a dead address.
 *
 *   server:<serverName>:url = <serverUrl>   (resolver address)
 *   agent:<agentId>:server  = <serverName>  (agent -> server pointer)
 *
 * Two transports are supported, selected by the URL scheme so the same registry
 * works before and after the managed Redis is migrated off Upstash:
 *   - `http(s)://` — Upstash REST API via `fetch` (the pipeline endpoint applies
 *     both SET-with-EX commands atomically server-side).
 *   - `redis(s)://` — native RESP over a TCP socket (e.g. a Railway Redis public
 *     proxy). Auth is carried inline in the URL, so no separate token is
 *     required. This mirrors what the gateways already do (`gateway-discord` /
 *     `gateway-webhook` both speak native TCP Redis).
 * Neither path adds a runtime dependency (this module is also bundled for
 * mobile via the agent): REST uses `fetch`, TCP uses the `node:net` builtin.
 */
export interface SandboxRegistryConfig {
    redisUrl: string;
    /**
     * Bearer token for the Upstash REST transport. Not required (and ignored)
     * for a `redis://` / `rediss://` URL, which carries auth inline.
     */
    redisToken?: string;
    agentId: string;
    serverName: string;
    serverUrl: string;
    /**
     * TTL for both Redis keys in seconds. Keep this at least 3x the heartbeat
     * interval so one missed tick does not expire a healthy container.
     */
    ttlSeconds: number;
}
export declare class SandboxRegistry {
    private readonly config;
    private heartbeatTimer;
    private readonly tcp;
    constructor(config: SandboxRegistryConfig);
    register(): Promise<void>;
    refresh(): Promise<void>;
    unregister(): Promise<void>;
    startHeartbeat(intervalMs: number): void;
    stopHeartbeat(): void;
    /**
     * Atomic two-key write. Both keys must succeed together — partial state
     * would let gateways resolve `agent:X:server` to a stale `server:Y:url`
     * value or miss a routing entry whose other half was just renewed. REST uses
     * the Upstash pipeline endpoint; TCP pipelines both commands on one socket.
     */
    private writeKeys;
    private get;
    private command;
    private pipeline;
    /**
     * Execute one or more commands over a native RESP/TCP connection and return
     * the per-command replies (AUTH/SELECT preamble replies are stripped). One
     * short-lived connection per call keeps the lifecycle trivial — the registry
     * only writes twice per heartbeat (every 30s), so connection churn is
     * negligible and there is no socket to leak if the container is killed.
     */
    private tcpExec;
}
/**
 * Reads the SANDBOX_REGISTRY_* and SANDBOX_* env vars and returns a fully
 * wired `SandboxRegistry`, or `null` if the sandbox context is not configured
 * (e.g. local dev, non-Hetzner deployment). Caller must call `register()` and
 * `startHeartbeat(...)` after a successful boot.
 *
 * This is the FEATURE FLAG for container self-registration: when the required
 * env vars are absent (every non-provisioned runtime), this returns null and
 * the runtime behaves exactly as before. Only a cloud-provisioned container
 * carrying the full SANDBOX_REGISTRY_* set will register. A `redis://` URL
 * needs no token (auth is inline); a `http(s)://` Upstash URL requires one.
 */
export declare function buildSandboxRegistryFromEnv(env?: NodeJS.ProcessEnv, ttlSeconds?: number): SandboxRegistry | null;
//# sourceMappingURL=sandbox-registry.d.ts.map