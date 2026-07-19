/**
 * ClaudeCodeSubAgentService — spawns `claude` CLI as a subprocess and
 * exposes session/prompt/output/terminate over host-RPC.
 *
 * SOC2 hardening (A-2 / A-3 / O-8):
 *   - Env passed to the child is a strict allowlist (`SAFE_ENV_KEYS`),
 *     with a defensive credential/token regex blocklist on top.
 *   - `cwd` is resolved via `realpath` and must live under the agent
 *     workspace (or `/tmp`).
 *   - `binary` is resolved via PATH-restricted lookup; only paths under
 *     a static dir whitelist are accepted.
 *   - Spawn is wrapped in `sandbox-exec` (macOS) or bwrap (Linux). When
 *     the helper is missing we log a WARN and fall through to
 *     allowlist-only spawn — dev boxes still work, prod deploys treat
 *     the WARN as a P1 fix.
 *   - A redacted transcript is recorded per session for audit; the
 *     transcript hash + byte count are emitted to the audit pipeline.
 */
import type { AuditDispatcher } from "@elizaos/security";
import type { JsonValue } from "../index.js";
import { SessionRecorder } from "./session-recorder.js";
export interface ClaudeCodeSession {
    sessionId: string;
    createdAt: number;
    cwd: string;
    model?: string;
    binary: string;
    proc: ReturnType<typeof Bun.spawn>;
    output: string[];
    recorder: SessionRecorder;
    sandbox: string;
}
export interface CreateSessionParams {
    cwd: string;
    model?: string;
    /** Override the claude CLI binary name/path. Default: "claude". */
    binary?: string;
    /** Initial prompt to send after the session boots. */
    initialPrompt?: string;
    /** Explicit, pre-validated env overrides (must not contain sensitive keys). */
    extraEnv?: Record<string, string>;
}
export interface SendPromptParams {
    sessionId: string;
    prompt: string;
}
export interface GetOutputParams {
    sessionId: string;
    /** Drain mode: return all output, or just the new lines since last call. */
    mode?: "all" | "since-last";
}
export interface TerminateParams {
    sessionId: string;
}
export interface ServiceOptions {
    /** Allowed workspace roots for `cwd` validation. */
    workspaceRoots?: readonly string[];
    /** Audit sink for spawn / session-record events. */
    auditDispatcher?: AuditDispatcher;
    /** Actor id captured on audit events. */
    actorId?: string;
}
export declare class ClaudeCodeSubAgentService {
    static readonly serviceType = "sub-agent.claude-code";
    static readonly rpcMethods: readonly ["createSession", "sendPrompt", "getOutput", "terminate", "listSessions"];
    static readonly capabilityDescription = "Drives the Claude Code CLI in an isolated subprocess.";
    readonly capabilityDescription = "Drives the Claude Code CLI in an isolated subprocess.";
    private readonly sessions;
    private readonly outputCursors;
    private nextSessionId;
    private workspaceRoots;
    private auditDispatcher;
    private actorId;
    private bundledProfiles;
    constructor(opts?: ServiceOptions);
    static start(runtime: unknown): Promise<ClaudeCodeSubAgentService>;
    stop(): Promise<void>;
    createSession(params: CreateSessionParams): Promise<JsonValue>;
    sendPrompt(params: SendPromptParams): Promise<JsonValue>;
    getOutput(params: GetOutputParams): Promise<JsonValue>;
    terminate(params: TerminateParams): Promise<JsonValue>;
    listSessions(): Promise<JsonValue>;
    private requireSession;
    private pumpStdout;
}
//# sourceMappingURL=sub-agent-service.d.ts.map