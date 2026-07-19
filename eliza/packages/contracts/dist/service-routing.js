/**
 * Service-routing type contracts.
 *
 * Describes which backend serves each capability (LLM text, TTS, media,
 * embeddings, RPC) and the linked-account records that own credentials.
 * Pure types only — normalizers and builders live in @elizaos/core.
 */
export const LINKED_ACCOUNT_STATUSES = ['linked', 'unlinked'];
export const LINKED_ACCOUNT_SOURCES = ['api-key', 'oauth', 'credentials', 'subscription'];
/**
 * Restricted set of provider IDs that can own multi-account credential
 * records. Cloud-managed providers (`elizacloud`, etc.) use the legacy
 * {@link LinkedAccountFlagConfig} flag instead.
 */
export const LINKED_ACCOUNT_PROVIDER_IDS = [
    'anthropic-subscription',
    'openai-codex',
    'gemini-cli',
    'zai-coding',
    'kimi-coding',
    'deepseek-coding',
    'anthropic-api',
    'openai-api',
    'deepseek-api',
    'zai-api',
    'moonshot-api',
    'cerebras-api',
];
export const LINKED_ACCOUNT_ACCOUNT_SOURCES = ['oauth', 'api-key'];
export const LINKED_ACCOUNT_HEALTH_STATES = [
    'ok',
    'rate-limited',
    'needs-reauth',
    'invalid',
    'unknown',
    'expired',
];
/** Services whose transport and backend can be selected independently. */
export const SERVICE_CAPABILITIES = ['llmText', 'tts', 'media', 'embeddings', 'rpc'];
export const SERVICE_TRANSPORTS = ['direct', 'cloud-proxy', 'remote'];
export const SERVICE_ROUTE_ACCOUNT_STRATEGIES = [
    'priority',
    'round-robin',
    'least-used',
    'quota-aware',
    // Reset-timestamp-aware: prefer the account whose weekly budget refunds
    // SOONEST, because spending a budget that's about to reset costs the least
    // (accounts that just reset are held in reserve). Falls back to
    // least-recently-used when reset instants are unknown.
    'reset-soonest',
    // Weekly-drain strategy: explicit hand-set priorities win first, otherwise
    // spend the account/model bucket whose weekly reset arrives soonest, then
    // lower utilization, with subscription end as the final-days booster.
    'drain-soonest-reset',
];
//# sourceMappingURL=service-routing.js.map