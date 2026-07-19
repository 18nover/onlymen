/**
 * Shared live LLM provider selection for real integration tests.
 *
 * Extracts and generalizes the provider detection pattern used across
 * the codebase (lifeops-live-harness.ts, lifeops-llm-extraction.live.test.ts)
 * into a single reusable module.
 *
 * Usage:
 *   import { selectLiveProvider, requireLiveProvider } from "../../test/helpers/live-provider.js";
 *
 *   const provider = selectLiveProvider();            // null if none available
 *   const provider = requireLiveProvider();           // skips test if none
 *   const provider = requireLiveProvider("openai");   // skips if openai key missing
 */
export type LiveProviderName = "groq" | "openai" | "anthropic" | "google" | "openrouter" | "cli";
export type LiveProviderConfig = {
    name: LiveProviderName;
    apiKey: string;
    baseUrl: string;
    smallModel: string;
    largeModel: string;
    /** The @elizaos/plugin-* package name to register with the runtime. */
    pluginPackage: string;
    /** Env vars to set for the runtime process. */
    env: Record<string, string>;
};
declare const CLI_BACKENDS: readonly ["claude", "claude-sdk", "codex", "codex-sdk"];
type CliBackend = (typeof CLI_BACKENDS)[number];
/**
 * Sentinel used as `apiKey` for the CLI-subscription provider. The CLI backend
 * loads its own credentials from disk (~/.claude/.credentials.json or
 * ~/.codex/auth.json); no API key ever passes through eliza.
 */
export declare const CLI_SUBSCRIPTION_SENTINEL_API_KEY = "cli-subscription:no-api-key-cli-reads-own-credentials";
/**
 * The on-disk credentials file the CLI backend reads for itself. Resolved via
 * os.homedir() (which honors $HOME on POSIX) so unit tests can point it at a
 * temp directory instead of the real user profile.
 */
export declare function cliBackendCredentialsPath(backend: CliBackend): string;
/**
 * Select the first available LLM provider based on environment variables.
 * Returns null if no provider API keys are found.
 *
 * Preference order: groq (cheapest/fastest) -> openai -> anthropic -> google
 * -> openrouter -> Eliza Cloud key -> cli subscription backend (last: real
 * keys always win over the slow CLI-spawn route).
 */
export declare function selectLiveProvider(preferredProvider?: LiveProviderName): LiveProviderConfig | null;
/**
 * Select a live provider, or skip the current test if none is available.
 * Useful as a top-level call in describe/it blocks.
 */
export declare function requireLiveProvider(preferredProvider?: LiveProviderName): LiveProviderConfig;
/**
 * Check if live testing is enabled via ELIZA_LIVE_TEST or LIVE env vars.
 */
export declare function isLiveTestEnabled(): boolean;
/**
 * Returns a list of all LLM provider env var names that have keys set.
 */
export declare function availableProviderNames(): LiveProviderName[];
export {};
//# sourceMappingURL=live-provider.d.ts.map