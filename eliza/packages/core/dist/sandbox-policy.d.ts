/**
 * Sandbox policy — single source of truth for "may we execute local code on
 * this build?". Consulted by both the agent-orchestrator (which spawns
 * coding CLIs via PTY) and additional code-execution actions.
 *
 * Store builds forbid forking arbitrary user-installed binaries; we gate the
 * affected actions off entirely rather than letting them fail at spawn time.
 */
export declare function isLocalCodeExecutionAllowed(): boolean;
export declare function buildStoreVariantBlockedMessage(featureLabel: string): string;
//# sourceMappingURL=sandbox-policy.d.ts.map