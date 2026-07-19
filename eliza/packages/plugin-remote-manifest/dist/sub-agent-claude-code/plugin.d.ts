/**
 * @elizaos/plugin-sub-agent-claude-code
 *
 * Reference remote-mode sub-agent plugin. Shipped as a workspace
 * package so the agent's `installRemotePlugin(plugin, { source: {
 * kind: "workspace", pkgName: "@elizaos/plugin-sub-agent-claude-code"
 * } })` can drop it in without writing any worker source on the fly.
 *
 * The agent typically constructs the Plugin object like:
 *
 * ```ts
 * import { plugin } from "@elizaos/plugin-sub-agent-claude-code";
 * await runtime.installRemotePlugin(plugin, {
 *   source: { kind: "workspace", pkgName: "@elizaos/plugin-sub-agent-claude-code" },
 *   lifetime: "session",
 * });
 * await runtime.getService("sub-agent.claude-code").createSession({
 *   cwd: "/path/to/project",
 *   initialPrompt: "list files in src/",
 * });
 * ```
 *
 * The plugin opts into `role: "sub-agent"` and `isolation: "isolated-process"`
 * so the host's AdaptiveWorkerRunner spawns it via Bun.spawn rather than as
 * a Worker. That guarantees a crash in the Claude Code CLI doesn't bring
 * down the agent process.
 */
import { ClaudeCodeSubAgentService } from "./sub-agent-service.js";
export declare const plugin: {
    name: string;
    description: string;
    mode: "remote";
    services: (typeof ClaudeCodeSubAgentService)[];
    remote: {
        role: "sub-agent";
        permissions: {
            bun: {
                network: "allowlist";
                networkAllowlist: string[];
                fs: "readwrite";
                fsAllowlist: string[];
                process: boolean;
                env: string[];
            };
            host: {
                services: never[];
                models: never[];
                events: string[];
                memory: "none";
            };
        };
        isolation: "isolated-process";
        worker: {
            relativePath: string;
        };
        deployment: {
            preferred: "auto";
            allowedTargets: ("host" | "cloud")[];
            requiresProcess: boolean;
        };
        lifetime: "session";
        subAgent: {
            runner: "claude-code";
            promptInjection: "stdin-only";
        };
    };
};
export default plugin;
//# sourceMappingURL=plugin.d.ts.map