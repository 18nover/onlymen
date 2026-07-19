/**
 * Pure data inspection helpers shared between plugin auto-enable predicates,
 * host-app config sync code, and the agent runtime.
 *
 * These live in @elizaos/core (not @elizaos/shared) so plugin packages can
 * import them without dragging the app/shared layer into their dep graph —
 * external plugins published to npm only need @elizaos/core.
 */
/**
 * True when a connector configuration block is present and "configured
 * enough" for the connector plugin to do real work. The exact criteria are
 * connector-specific (e.g. bluebubbles needs both serverUrl and password,
 * imessage just needs cliPath OR dbPath OR enabled:true) but the broad
 * pattern is:
 *   - block exists, is an object, and isn't `enabled: false`
 *   - has at least one of { botToken, token, apiKey } — the universal case
 *   - OR matches the connector-specific shape (per-case branches below)
 *
 * Used by per-plugin `auto-enable.ts` predicates that just want to delegate
 * "is this connector wired?" to a single source of truth, and by app-side
 * config-routing code that needs to mirror the same check.
 */
export declare function isConnectorConfigured(connectorName: string, connectorConfig: unknown): boolean;
/**
 * Per-destination shape check for streaming plugins (twitch, youtube,
 * customRtmp, pumpfun, x, rtmpSources). Same pattern as `isConnectorConfigured`
 * — pure data inspection, no transitive imports.
 */
export declare function isStreamingDestinationConfigured(destName: string, destConfig: unknown): boolean;
/**
 * WeChat connector detection. Top-level `apiKey` is caught by the universal
 * check in `isConnectorConfigured`; this helper handles the multi-account
 * variant where each account in `config.accounts.*.apiKey` is checked.
 */
export declare function isWechatConfigured(config: Record<string, unknown> | null | undefined): boolean;
//# sourceMappingURL=connector-config.d.ts.map