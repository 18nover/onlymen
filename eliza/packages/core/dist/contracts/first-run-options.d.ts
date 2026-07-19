/**
 * Shared first-run provider setup contracts.
 */
import type { DeploymentTargetConfig, LinkedAccountFlagsConfig, LinkedAccountProviderId, ServiceRoutingConfig } from "./service-routing.js";
export declare const CHARACTER_LANGUAGES: readonly ["en", "zh-CN", "ko", "es", "pt", "vi", "tl"];
export type CharacterLanguage = (typeof CHARACTER_LANGUAGES)[number];
export interface StylePreset {
    id: string;
    name: string;
    avatarIndex: number;
    voicePresetId: string;
    greetingAnimation: string;
    catchphrase: string;
    hint: string;
    bio: string[];
    system: string;
    adjectives: string[];
    style: {
        all: string[];
        chat: string[];
        post: string[];
    };
    topics: string[];
    postExamples: string[];
    postExamples_zhCN?: string[];
    messageExamples: Array<Array<{
        user: string;
        content: {
            text: string;
        };
    }>>;
}
export type FirstRunProviderFamily = "anthropic" | "cerebras" | "deepseek" | "elizacloud" | "gemini" | "grok" | "groq" | "mistral" | "moonshot" | "nearai" | "ollama" | "openai" | "openrouter" | "together" | "zai" | (string & {});
export type FirstRunProviderId = "anthropic" | "anthropic-subscription" | "cerebras" | "deepseek" | "deepseek-coding-subscription" | "elizacloud" | "gemini" | "gemini-subscription" | "grok" | "groq" | "kimi-coding-subscription" | "mistral" | "moonshot" | "nearai" | "ollama" | "openai" | "openai-subscription" | "openrouter" | "together" | "zai" | "zai-coding-subscription" | (string & {});
export type FirstRunProviderAuthMode = "api-key" | "cloud" | "credentials" | "local" | "subscription" | (string & {});
export type FirstRunProviderGroup = "cloud" | "local" | "subscription" | (string & {});
export interface ProviderOption {
    id: FirstRunProviderId;
    name: string;
    envKey: string | null;
    pluginName: string;
    keyPrefix: string | null;
    description: string;
    family: FirstRunProviderFamily;
    authMode: FirstRunProviderAuthMode;
    group: FirstRunProviderGroup;
    order: number;
    recommended?: boolean;
    labelKey?: string;
    storedProvider?: string;
    supportsPrimaryModelOverride?: boolean;
}
export interface CloudProviderOption {
    id: "elizacloud";
    name: string;
    description: string;
}
export interface ModelOption {
    id: string;
    name: string;
    provider: string;
    description: string;
    recommended?: boolean;
    free?: boolean;
}
export interface OpenRouterModelOption {
    id: string;
    name: string;
    description: string;
}
export interface MessageExampleContent {
    text: string;
    actions?: string[];
}
export interface MessageExample {
    user: string;
    content: MessageExampleContent;
}
export interface FirstRunConnectorConfig {
    enabled?: boolean;
    botToken?: string;
    token?: string;
    apiKey?: string;
    [key: string]: string | boolean | number | string[] | Record<string, unknown> | undefined;
}
export interface RpcProviderOption {
    id: string;
    label: string;
    envKey?: string | null;
    requiresKey?: boolean;
}
export interface InventoryProviderOption {
    id: string;
    name: string;
    description: string;
    rpcProviders: RpcProviderOption[];
}
export type SubscriptionProviderSelectionId = "anthropic-subscription" | "openai-subscription" | "gemini-subscription" | "zai-coding-subscription" | "kimi-coding-subscription" | "deepseek-coding-subscription";
export type StoredSubscriptionProviderId = "anthropic-subscription" | "openai-codex" | "gemini-cli" | "zai-coding" | "kimi-coding" | "deepseek-coding";
export declare const SUBSCRIPTION_PROVIDER_SELECTIONS: readonly [{
    readonly id: "anthropic-subscription";
    readonly storedProvider: "anthropic-subscription";
    readonly family: "anthropic";
    readonly labelKey: "providerswitcher.claudeSubscription";
}, {
    readonly id: "openai-subscription";
    readonly storedProvider: "openai-codex";
    readonly family: "openai";
    readonly labelKey: "providerswitcher.chatgptSubscription";
}, {
    readonly id: "gemini-subscription";
    readonly storedProvider: "gemini-cli";
    readonly family: "gemini";
    readonly labelKey: "providerswitcher.geminiSubscription";
}, {
    readonly id: "zai-coding-subscription";
    readonly storedProvider: "zai-coding";
    readonly family: "zai";
    readonly labelKey: "providerswitcher.zaiCodingPlan";
}, {
    readonly id: "kimi-coding-subscription";
    readonly storedProvider: "kimi-coding";
    readonly family: "moonshot";
    readonly labelKey: "providerswitcher.kimiCodingPlan";
}, {
    readonly id: "deepseek-coding-subscription";
    readonly storedProvider: "deepseek-coding";
    readonly family: "deepseek";
    readonly labelKey: "providerswitcher.deepseekCodingPlan";
}];
export declare const FIRST_RUN_PROVIDER_CATALOG: readonly [{
    readonly id: "elizacloud";
    readonly name: "Eliza Cloud";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-elizacloud";
    readonly keyPrefix: null;
    readonly description: "Managed hosting for Eliza agents and bundled infrastructure.";
    readonly family: "elizacloud";
    readonly authMode: "cloud";
    readonly group: "cloud";
    readonly order: 10;
    readonly recommended: true;
}, {
    readonly id: "anthropic-subscription";
    readonly name: "Claude Subscription";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-anthropic";
    readonly keyPrefix: null;
    readonly description: "Powers task agents via Claude Code CLI. For the main agent, use Eliza Cloud or a direct API key.";
    readonly family: "anthropic";
    readonly authMode: "subscription";
    readonly group: "subscription";
    readonly order: 20;
    readonly recommended: true;
    readonly labelKey: "providerswitcher.claudeSubscription";
    readonly storedProvider: "anthropic-subscription";
}, {
    readonly id: "openai-subscription";
    readonly name: "ChatGPT Subscription";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-openai";
    readonly keyPrefix: null;
    readonly description: "Powers Codex-backed coding agents through the official Codex surface.";
    readonly family: "openai";
    readonly authMode: "subscription";
    readonly group: "subscription";
    readonly order: 30;
    readonly recommended: true;
    readonly labelKey: "providerswitcher.chatgptSubscription";
    readonly storedProvider: "openai-codex";
}, {
    readonly id: "gemini-subscription";
    readonly name: "Gemini CLI Subscription";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-google-genai";
    readonly keyPrefix: null;
    readonly description: "Powers task agents through the authenticated Gemini CLI. No Gemini subscription token is imported into API env vars.";
    readonly family: "gemini";
    readonly authMode: "subscription";
    readonly group: "subscription";
    readonly order: 35;
    readonly labelKey: "providerswitcher.geminiSubscription";
    readonly storedProvider: "gemini-cli";
}, {
    readonly id: "zai-coding-subscription";
    readonly name: "z.ai Coding Plan";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-zai";
    readonly keyPrefix: null;
    readonly description: "Stores z.ai Coding Plan credentials for the dedicated coding endpoint only, not the general z.ai API key path.";
    readonly family: "zai";
    readonly authMode: "subscription";
    readonly group: "subscription";
    readonly order: 36;
    readonly labelKey: "providerswitcher.zaiCodingPlan";
    readonly storedProvider: "zai-coding";
}, {
    readonly id: "kimi-coding-subscription";
    readonly name: "Kimi Code";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-openai";
    readonly keyPrefix: null;
    readonly description: "Stores Kimi Code credentials for Kimi's coding endpoint only, not the Moonshot general API key path.";
    readonly family: "moonshot";
    readonly authMode: "subscription";
    readonly group: "subscription";
    readonly order: 37;
    readonly labelKey: "providerswitcher.kimiCodingPlan";
    readonly storedProvider: "kimi-coding";
}, {
    readonly id: "deepseek-coding-subscription";
    readonly name: "DeepSeek Coding Plan";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-deepseek";
    readonly keyPrefix: null;
    readonly description: "Unavailable until DeepSeek exposes a first-party coding subscription surface that can be integrated without API-key substitution.";
    readonly family: "deepseek";
    readonly authMode: "subscription";
    readonly group: "subscription";
    readonly order: 38;
    readonly labelKey: "providerswitcher.deepseekCodingPlan";
    readonly storedProvider: "deepseek-coding";
}, {
    readonly id: "anthropic";
    readonly name: "Anthropic";
    readonly envKey: "ANTHROPIC_API_KEY";
    readonly pluginName: "@elizaos/plugin-anthropic";
    readonly keyPrefix: "sk-ant-";
    readonly description: "Claude models via API key.";
    readonly family: "anthropic";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 50;
}, {
    readonly id: "openai";
    readonly name: "OpenAI";
    readonly envKey: "OPENAI_API_KEY";
    readonly pluginName: "@elizaos/plugin-openai";
    readonly keyPrefix: "sk-";
    readonly description: "GPT models via API key.";
    readonly family: "openai";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 60;
}, {
    readonly id: "openrouter";
    readonly name: "OpenRouter";
    readonly envKey: "OPENROUTER_API_KEY";
    readonly pluginName: "@elizaos/plugin-openrouter";
    readonly keyPrefix: "sk-or-";
    readonly description: "Access multiple models via one API key.";
    readonly family: "openrouter";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 70;
    readonly supportsPrimaryModelOverride: true;
}, {
    readonly id: "gemini";
    readonly name: "Gemini";
    readonly envKey: "GOOGLE_GENERATIVE_AI_API_KEY";
    readonly pluginName: "@elizaos/plugin-google-genai";
    readonly keyPrefix: null;
    readonly description: "Google's Gemini models.";
    readonly family: "gemini";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 80;
}, {
    readonly id: "grok";
    readonly name: "xAI (Grok)";
    readonly envKey: "XAI_API_KEY";
    readonly pluginName: "@elizaos/plugin-xai";
    readonly keyPrefix: "xai-";
    readonly description: "xAI's Grok models.";
    readonly family: "grok";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 90;
}, {
    readonly id: "groq";
    readonly name: "Groq";
    readonly envKey: "GROQ_API_KEY";
    readonly pluginName: "@elizaos/plugin-groq";
    readonly keyPrefix: "gsk_";
    readonly description: "Fast inference.";
    readonly family: "groq";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 100;
}, {
    readonly id: "cerebras";
    readonly name: "Cerebras";
    readonly envKey: "CEREBRAS_API_KEY";
    readonly pluginName: "@elizaos/plugin-openai";
    readonly keyPrefix: "csk-";
    readonly description: "Fast inference for open models via Cerebras.";
    readonly family: "cerebras";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 105;
}, {
    readonly id: "deepseek";
    readonly name: "DeepSeek";
    readonly envKey: "DEEPSEEK_API_KEY";
    readonly pluginName: "@elizaos/plugin-deepseek";
    readonly keyPrefix: "sk-";
    readonly description: "DeepSeek models.";
    readonly family: "deepseek";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 110;
}, {
    readonly id: "mistral";
    readonly name: "Mistral";
    readonly envKey: "MISTRAL_API_KEY";
    readonly pluginName: "@elizaos/plugin-mistral";
    readonly keyPrefix: null;
    readonly description: "Mistral AI models.";
    readonly family: "mistral";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 120;
}, {
    readonly id: "together";
    readonly name: "Together AI";
    readonly envKey: "TOGETHER_API_KEY";
    readonly pluginName: "@elizaos/plugin-together";
    readonly keyPrefix: null;
    readonly description: "Open-source model hosting.";
    readonly family: "together";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 130;
}, {
    readonly id: "ollama";
    readonly name: "Ollama";
    readonly envKey: null;
    readonly pluginName: "@elizaos/plugin-ollama";
    readonly keyPrefix: null;
    readonly description: "Local models, no API key needed.";
    readonly family: "ollama";
    readonly authMode: "local";
    readonly group: "local";
    readonly order: 140;
}, {
    readonly id: "zai";
    readonly name: "z.ai";
    readonly envKey: "ZAI_API_KEY";
    readonly pluginName: "@elizaos/plugin-zai";
    readonly keyPrefix: null;
    readonly description: "GLM models via z.ai direct API billing.";
    readonly family: "zai";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 150;
}, {
    readonly id: "nearai";
    readonly name: "NEAR AI";
    readonly envKey: "NEARAI_API_KEY";
    readonly pluginName: "@elizaos/plugin-nearai";
    readonly keyPrefix: null;
    readonly description: "TEE-backed private inference via NEAR AI Cloud.";
    readonly family: "nearai";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 155;
    readonly supportsPrimaryModelOverride: true;
}, {
    readonly id: "moonshot";
    readonly name: "Kimi / Moonshot";
    readonly envKey: "MOONSHOT_API_KEY";
    readonly pluginName: "@elizaos/plugin-openai";
    readonly keyPrefix: "sk-";
    readonly description: "Kimi models via Moonshot's OpenAI-compatible API.";
    readonly family: "moonshot";
    readonly authMode: "api-key";
    readonly group: "local";
    readonly order: 160;
    readonly supportsPrimaryModelOverride: true;
}];
export declare const DIRECT_ACCOUNT_PROVIDER_BY_FIRST_RUN_PROVIDER: {
    readonly anthropic: "anthropic-api";
    readonly openai: "openai-api";
    readonly deepseek: "deepseek-api";
    readonly zai: "zai-api";
    readonly moonshot: "moonshot-api";
    readonly cerebras: "cerebras-api";
};
export declare const FIRST_RUN_CLOUD_PROVIDER_OPTIONS: readonly [{
    readonly id: "elizacloud";
    readonly name: "Eliza Cloud";
    readonly description: "Managed cloud infrastructure. Wallets, LLMs, and RPCs included.";
}];
export type FirstRunLocalProviderId = Exclude<FirstRunProviderId, "elizacloud">;
interface FirstRunCloudModelPreferences {
    nanoModel?: string;
    smallModel?: string;
    mediumModel?: string;
    largeModel?: string;
    megaModel?: string;
    responseHandlerModel?: string;
    shouldRespondModel?: string;
    actionPlannerModel?: string;
    plannerModel?: string;
    responseModel?: string;
    mediaDescriptionModel?: string;
}
export interface FirstRunCloudManagedConnection extends FirstRunCloudModelPreferences {
    kind: "cloud-managed";
    cloudProvider: "elizacloud";
    apiKey?: string;
}
export interface FirstRunLocalProviderConnection {
    kind: "local-provider";
    provider: FirstRunLocalProviderId;
    apiKey?: string;
    primaryModel?: string;
}
export interface FirstRunRemoteProviderConnection {
    kind: "remote-provider";
    remoteApiBase: string;
    remoteAccessToken?: string;
    provider?: FirstRunLocalProviderId;
    apiKey?: string;
    primaryModel?: string;
}
export type FirstRunConnection = FirstRunCloudManagedConnection | FirstRunLocalProviderConnection | FirstRunRemoteProviderConnection;
export interface FirstRunOptions {
    names: string[];
    styles: StylePreset[];
    providers: ProviderOption[];
    cloudProviders: CloudProviderOption[];
    models: {
        nano?: ModelOption[];
        small?: ModelOption[];
        medium?: ModelOption[];
        large?: ModelOption[];
        mega?: ModelOption[];
    };
    openrouterModels?: OpenRouterModelOption[];
    inventoryProviders: InventoryProviderOption[];
    sharedStyleRules: string;
    githubOAuthAvailable?: boolean;
}
export interface FirstRunCredentialInputs {
    llmApiKey?: string;
    cloudApiKey?: string;
}
export interface FirstRunLlmPersistenceSelection extends FirstRunCloudModelPreferences {
    backend: FirstRunProviderId;
    transport: "direct" | "remote" | "cloud-proxy";
    apiKey?: string;
    primaryModel?: string;
    remoteApiBase?: string;
    remoteAccessToken?: string;
}
export type SubscriptionCredentialSource = "app" | "claude-code-cli" | "setup-token" | "codex-cli" | "gemini-cli" | "coding-plan-key" | "unavailable" | null;
export interface SubscriptionProviderStatus {
    provider: string;
    /**
     * Stable per-account ID. `"default"` for legacy single-account
     * installs; CLI/setup-token-derived rows use synthetic IDs like
     * `"claude-code-cli"`, `"codex-cli"`, `"setup-token"`.
     */
    accountId: string;
    /** User-facing label for this account. */
    label: string;
    configured: boolean;
    valid: boolean;
    expiresAt: number | null;
    source: SubscriptionCredentialSource;
    available?: boolean;
    availabilityReason?: string;
    allowedClient?: string;
    loginHint?: string;
    billingMode?: "subscription-coding-plan" | "subscription-coding-cli";
}
export interface SubscriptionStatusResponse {
    providers: SubscriptionProviderStatus[];
}
export declare function isSubscriptionProviderSelectionId(value: unknown): value is SubscriptionProviderSelectionId;
export declare function normalizeSubscriptionProviderSelectionId(value: unknown): SubscriptionProviderSelectionId | null;
export declare function getStoredSubscriptionProvider(selectionId: SubscriptionProviderSelectionId): StoredSubscriptionProviderId;
export declare function getStoredSubscriptionProviderForRequest(providerId: unknown): StoredSubscriptionProviderId | null;
export declare function getSubscriptionProviderFamily(selectionId: SubscriptionProviderSelectionId): "anthropic" | "openai" | "gemini" | "zai" | "moonshot" | "deepseek";
export declare function requiresAdditionalRuntimeProvider(providerId: unknown): boolean;
export declare function normalizeFirstRunProviderId(value: unknown): FirstRunProviderId | null;
export declare function getFirstRunProviderOption(providerId: unknown): ProviderOption | null;
export declare function getFirstRunProviderFamily(providerId: unknown): FirstRunProviderFamily | null;
export declare function getStoredFirstRunProviderId(providerId: unknown): string | null;
export declare function getDirectAccountProviderForFirstRunProvider(providerId: unknown): LinkedAccountProviderId | null;
export declare function sortFirstRunProviders(providers: readonly ProviderOption[]): ProviderOption[];
export declare function isCloudManagedConnection(connection: FirstRunConnection | null | undefined): connection is FirstRunCloudManagedConnection;
export declare function isRemoteProviderConnection(connection: FirstRunConnection | null | undefined): connection is FirstRunRemoteProviderConnection;
export declare function isLocalProviderConnection(connection: FirstRunConnection | null | undefined): connection is FirstRunLocalProviderConnection;
export declare function isFirstRunConnectionComplete(connection: FirstRunConnection | null | undefined): boolean;
export declare function readFirstRunEnvString(config: Record<string, unknown> | null | undefined, key: string): string | undefined;
export declare function readFirstRunEnvSecret(config: Record<string, unknown> | null | undefined, key: string): string | undefined;
export declare function getFirstRunProviderSignalEnvKeys(providerId: FirstRunLocalProviderId): string[];
export declare function hasExplicitCanonicalRuntimeConfig(config: Record<string, unknown> | null | undefined): boolean;
export declare function migrateLegacyRuntimeConfig<T extends Record<string, unknown>>(config: T): T;
export declare function resolveLinkedAccountsInConfig(config: Record<string, unknown> | null | undefined): LinkedAccountFlagsConfig | null;
export declare function resolveDeploymentTargetInConfig(config: Record<string, unknown> | null | undefined): DeploymentTargetConfig;
export declare function resolveServiceRoutingInConfig(config: Record<string, unknown> | null | undefined): ServiceRoutingConfig | null;
export declare function normalizePersistedFirstRunConnection(value: unknown): FirstRunConnection | null;
export declare function normalizeFirstRunCredentialInputs(value: unknown): FirstRunCredentialInputs | null;
export interface FirstRunCredentialPersistencePlan {
    llmSelection: FirstRunLlmPersistenceSelection | null;
    cloudApiKey?: string;
}
export declare function deriveFirstRunCredentialPersistencePlan(args: {
    credentialInputs?: FirstRunCredentialInputs | null;
    deploymentTarget?: DeploymentTargetConfig | null;
    serviceRouting?: ServiceRoutingConfig | null;
}): FirstRunCredentialPersistencePlan;
export declare function stripFirstRunConnectionSecrets(connection: FirstRunConnection): FirstRunConnection;
export declare function inferCompatibilityFirstRunConnection(config: Record<string, unknown> | null | undefined): FirstRunConnection | null;
export declare function inferFirstRunConnectionFromConfig(config: Record<string, unknown> | null | undefined): FirstRunConnection | null;
export declare function isCloudInferenceSelectedInConfig(config: Record<string, unknown> | null | undefined): boolean;
/**
 * Register an additional provider option at runtime.
 * Plugins should call this during initialization to add themselves to the
 * first-run provider catalog.
 */
export declare function registerProviderOption(option: ProviderOption): void;
/**
 * Get all provider options: hardcoded catalog merged with runtime-registered
 * providers. Runtime registrations override hardcoded entries with the same id.
 */
export declare function getProviderOptions(): ProviderOption[];
export {};
//# sourceMappingURL=first-run-options.d.ts.map