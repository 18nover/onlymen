/**
 * Sub-agent hardening helpers (SOC2 A-2 + A-3).
 *
 * - `filterEnv` — explicit allowlist + token blocklist for child env.
 * - `resolveSafeCwd` — realpath validation; cwd must be under workspace or /tmp.
 * - `resolveSafeBinary` — `which` resolution against a static path whitelist.
 * - `buildSandboxedCommand` — wraps argv in sandbox-exec (macOS) or bwrap (Linux).
 */
/** Env keys that may be forwarded to a sub-agent verbatim. */
export declare const SAFE_ENV_KEYS: ReadonlySet<string>;
export interface FilterEnvOptions {
    /** Pre-validated extra env to layer on top of the allowlisted parent env. */
    extra?: Record<string, string | undefined>;
    /** Override the default `SAFE_ENV_KEYS`. */
    allow?: ReadonlySet<string>;
}
export declare function filterEnv(source: NodeJS.ProcessEnv, allow?: ReadonlySet<string>, extra?: Record<string, string | undefined>): Record<string, string>;
export declare class SubAgentCwdError extends Error {
    constructor(message: string);
}
/**
 * Resolve `cwd` to its realpath and require it to live under one of
 * the supplied workspace roots OR `/tmp`. Symlink escapes are rejected.
 */
export declare function resolveSafeCwd(cwd: string, workspaceRoots: readonly string[]): string;
export declare class SubAgentBinaryError extends Error {
    constructor(message: string);
}
/**
 * Resolve `binary` (name or path) to an absolute path under the binary
 * whitelist. PATH lookup uses `which` semantics constrained to safe dirs.
 */
export declare function resolveSafeBinary(binary: string, env?: NodeJS.ProcessEnv): string;
export interface SandboxPlan {
    cmd: string[];
    /** Identifier of the sandbox layer in use; `"none"` when no helper available. */
    sandbox: "macos-sandbox-exec" | "linux-bwrap" | "none";
}
export interface SandboxOptions {
    workspaceRoot: string;
    sessionId: string;
    /** Path to a macOS .sb profile. Required on darwin. */
    macosProfile?: string;
    /** Path to the bwrap wrapper script. Required on linux. */
    linuxWrapper?: string;
}
/**
 * Build the final argv for spawning the sub-agent, prepended by an OS
 * sandbox helper when available. Returns `sandbox: "none"` and the raw
 * argv when no helper exists (Windows, or missing profile in dev) — the
 * caller MUST log a WARN in that case.
 */
export declare function buildSandboxedCommand(argv: string[], opts: SandboxOptions): SandboxPlan;
/** True iff the `bwrap` wrapper resolved cleanly to an executable file. */
export declare function isExecutable(path: string): boolean;
/**
 * Best-effort discovery of the bundled sandbox profile paths relative to
 * the package root. Returns undefined when the file is missing so callers
 * can fall through to no-sandbox + WARN.
 */
export declare function locateBundledProfiles(packageRoot: string): {
    macosProfile?: string;
    linuxWrapper?: string;
};
export declare function which(bin: string, env?: NodeJS.ProcessEnv): string | null;
//# sourceMappingURL=sandbox.d.ts.map