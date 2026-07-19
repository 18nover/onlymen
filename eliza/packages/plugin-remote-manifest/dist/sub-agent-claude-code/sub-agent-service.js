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
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSandboxedCommand, filterEnv, locateBundledProfiles, resolveSafeBinary, resolveSafeCwd, SAFE_ENV_KEYS, } from "./sandbox.js";
import { pruneOldSessions, SessionRecorder } from "./session-recorder.js";
/**
 * Compute the package root (parent of `src/` or `dist/`) so we can find
 * the bundled sandbox profiles regardless of build vs source mode.
 */
function packageRoot() {
    // This module lives at <pkg>/{src,dist}/sub-agent-claude-code/sub-agent-service.*
    // so the plugin-remote-manifest package root is three levels up; the bundled
    // sandbox profiles ship at <pkg>/sandbox/.
    const here = fileURLToPath(import.meta.url);
    return dirname(dirname(dirname(here)));
}
export class ClaudeCodeSubAgentService {
    static serviceType = "sub-agent.claude-code";
    static rpcMethods = [
        "createSession",
        "sendPrompt",
        "getOutput",
        "terminate",
        "listSessions",
    ];
    static capabilityDescription = "Drives the Claude Code CLI in an isolated subprocess.";
    capabilityDescription = ClaudeCodeSubAgentService.capabilityDescription;
    sessions = new Map();
    outputCursors = new Map();
    nextSessionId = 1;
    workspaceRoots;
    auditDispatcher;
    actorId;
    bundledProfiles = locateBundledProfiles(packageRoot());
    constructor(opts = {}) {
        this.workspaceRoots = opts.workspaceRoots ?? defaultWorkspaceRoots();
        this.auditDispatcher = opts.auditDispatcher;
        this.actorId = opts.actorId;
    }
    static async start(runtime) {
        const opts = extractServiceOptions(runtime);
        const svc = new ClaudeCodeSubAgentService(opts);
        // Fire-and-forget retention sweep at boot.
        try {
            pruneOldSessions();
        }
        catch (error) {
            // error-policy:J6 best-effort teardown — boot must proceed even if the
            // retention sweep cannot run, but a boot-time prune failure (e.g. the
            // sessions root being unreadable) is a real signal, not a no-op, so it is
            // surfaced on stderr instead of being swallowed as "non-critical".
            const cause = error instanceof Error ? error : new Error(String(error));
            process.stderr.write(`[sub-agent] WARN: boot retention prune failed: ${cause.message}\n`);
        }
        return svc;
    }
    async stop() {
        for (const session of this.sessions.values()) {
            try {
                session.proc.kill("SIGTERM");
            }
            catch {
                // error-policy:J6 best-effort teardown — killing an already-exited
                // child throws ESRCH; the process is gone, which is the desired
                // post-condition, so nothing is masked by continuing to finalize.
            }
            await session.recorder.finalize();
        }
        this.sessions.clear();
        this.outputCursors.clear();
    }
    async createSession(params) {
        const sessionId = `cc-${this.nextSessionId++}-${Date.now()}`;
        const safeCwd = resolveSafeCwd(params.cwd, this.workspaceRoots);
        const safeBinary = resolveSafeBinary(params.binary ?? "claude");
        const args = ["--print"];
        if (params.model)
            args.push("--model", params.model);
        const sandboxPlan = buildSandboxedCommand([safeBinary, ...args], {
            workspaceRoot: safeCwd,
            sessionId,
            ...this.bundledProfiles,
        });
        if (sandboxPlan.sandbox === "none") {
            process.stderr.write(`[sub-agent] WARN: no OS sandbox available on ${process.platform}; spawning with env-allowlist only.\n`);
        }
        const env = filterEnv(process.env, SAFE_ENV_KEYS, params.extraEnv ?? {});
        const recorder = new SessionRecorder({
            sessionId,
            ...(this.auditDispatcher
                ? { auditDispatcher: this.auditDispatcher }
                : {}),
            ...(this.actorId ? { actorId: this.actorId } : {}),
        });
        if (this.auditDispatcher) {
            await this.auditDispatcher.emit({
                actor: {
                    type: this.actorId ? "user" : "system",
                    id: this.actorId ?? "agent",
                },
                action: "agent.spawn",
                result: "success",
                resource: { type: "sub-agent.session", id: sessionId },
                metadata: {
                    session_id: sessionId,
                    binary: safeBinary,
                    cwd: safeCwd,
                    sandbox: sandboxPlan.sandbox,
                },
            });
        }
        const [cmd0, ...cmdRest] = sandboxPlan.cmd;
        if (!cmd0)
            throw new Error("Empty sandbox command");
        const proc = Bun.spawn({
            cmd: [cmd0, ...cmdRest],
            stdin: "pipe",
            stdout: "pipe",
            stderr: "pipe",
            cwd: safeCwd,
            env,
        });
        const session = {
            sessionId,
            createdAt: Date.now(),
            cwd: safeCwd,
            ...(params.model ? { model: params.model } : {}),
            binary: safeBinary,
            proc,
            output: [],
            recorder,
            sandbox: sandboxPlan.sandbox,
        };
        this.sessions.set(sessionId, session);
        this.outputCursors.set(sessionId, 0);
        // Pump stdout into the session's output buffer.
        void this.pumpStdout(session);
        if (params.initialPrompt) {
            await this.sendPrompt({ sessionId, prompt: params.initialPrompt });
        }
        return {
            sessionId,
            createdAt: session.createdAt,
            sandbox: sandboxPlan.sandbox,
        };
    }
    async sendPrompt(params) {
        const session = this.requireSession(params.sessionId);
        session.recorder.record(`> ${params.prompt}`);
        const writer = session.proc.stdin;
        writer.write(`${params.prompt}\n`);
        return { ok: true };
    }
    async getOutput(params) {
        const session = this.requireSession(params.sessionId);
        const mode = params.mode ?? "since-last";
        if (mode === "all") {
            return { lines: [...session.output] };
        }
        const cursor = this.outputCursors.get(params.sessionId) ?? 0;
        const newLines = session.output.slice(cursor);
        this.outputCursors.set(params.sessionId, session.output.length);
        return { lines: newLines };
    }
    async terminate(params) {
        const session = this.sessions.get(params.sessionId);
        if (!session)
            return { terminated: false };
        try {
            session.proc.kill("SIGTERM");
        }
        catch {
            // error-policy:J6 best-effort teardown — an already-exited child throws
            // ESRCH on kill; the process is already gone so termination succeeded.
        }
        await session.recorder.finalize();
        this.sessions.delete(params.sessionId);
        this.outputCursors.delete(params.sessionId);
        return { terminated: true };
    }
    async listSessions() {
        return {
            sessions: Array.from(this.sessions.values()).map((s) => ({
                sessionId: s.sessionId,
                createdAt: s.createdAt,
                cwd: s.cwd,
                model: s.model ?? null,
                sandbox: s.sandbox,
            })),
        };
    }
    requireSession(id) {
        const session = this.sessions.get(id);
        if (!session)
            throw new Error(`Unknown session: ${id}`);
        return session;
    }
    async pumpStdout(session) {
        if (!session.proc.stdout)
            return;
        const reader = session.proc.stdout.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        try {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                if (!value)
                    continue;
                buffer += decoder.decode(value, { stream: true });
                let nl = buffer.indexOf("\n");
                while (nl !== -1) {
                    const line = buffer.slice(0, nl);
                    buffer = buffer.slice(nl + 1);
                    session.output.push(line);
                    session.recorder.record(line);
                    nl = buffer.indexOf("\n");
                }
            }
            if (buffer.length > 0) {
                session.output.push(buffer);
                session.recorder.record(buffer);
            }
        }
        finally {
            reader.releaseLock?.();
        }
    }
}
function defaultWorkspaceRoots() {
    const roots = [];
    const env = process.env;
    for (const key of ["ELIZA_WORKSPACE_DIR", "ELIZA_STATE_DIR"]) {
        const v = env[key];
        if (v)
            roots.push(resolve(v));
    }
    // Fallback: process cwd.
    roots.push(process.cwd());
    return roots;
}
function extractServiceOptions(runtime) {
    if (!runtime || typeof runtime !== "object")
        return {};
    const r = runtime;
    return {
        ...(r.auditDispatcher ? { auditDispatcher: r.auditDispatcher } : {}),
        ...(typeof r.actorId === "string" ? { actorId: r.actorId } : {}),
    };
}
//# sourceMappingURL=sub-agent-service.js.map