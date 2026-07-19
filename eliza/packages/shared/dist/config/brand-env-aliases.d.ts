export type BrandEnvAliasPair = readonly [brandKey: string, elizaKey: string];
export declare const BRAND_ENV_ALIAS_DEFINITIONS: readonly [{
    readonly brandSuffix: "NAMESPACE";
    readonly elizaKey: "ELIZA_NAMESPACE";
}, {
    readonly brandSuffix: "STATE_DIR";
    readonly elizaKey: "ELIZA_STATE_DIR";
}, {
    readonly brandSuffix: "CONFIG_PATH";
    readonly elizaKey: "ELIZA_CONFIG_PATH";
}, {
    readonly brandSuffix: "OAUTH_DIR";
    readonly elizaKey: "ELIZA_OAUTH_DIR";
}, {
    readonly brandSuffix: "PLATFORM";
    readonly elizaKey: "ELIZA_PLATFORM";
}, {
    readonly brandSuffix: "AGENT_ORCHESTRATOR";
    readonly elizaKey: "ELIZA_AGENT_ORCHESTRATOR";
}, {
    readonly brandSuffix: "CLOUD_PROVISIONED";
    readonly elizaKey: "ELIZA_CLOUD_PROVISIONED";
}, {
    readonly brandSuffix: "CLOUD_MANAGED_AGENTS_API_SEGMENT";
    readonly elizaKey: "ELIZA_CLOUD_MANAGED_AGENTS_API_SEGMENT";
}, {
    readonly brandSuffix: "CHAT_GENERATION_TIMEOUT_MS";
    readonly elizaKey: "ELIZA_CHAT_GENERATION_TIMEOUT_MS";
}, {
    readonly brandSuffix: "SKIP_LOCAL_PLUGIN_ROLES";
    readonly elizaKey: "ELIZA_SKIP_LOCAL_PLUGIN_ROLES";
}, {
    readonly brandSuffix: "SETTINGS_DEBUG";
    readonly elizaKey: "ELIZA_SETTINGS_DEBUG";
}, {
    readonly brandSuffix: "SETTINGS_DEBUG";
    readonly elizaKey: "VITE_ELIZA_SETTINGS_DEBUG";
    readonly vite: true;
}, {
    readonly brandSuffix: "GOOGLE_OAUTH_DESKTOP_CLIENT_ID";
    readonly elizaKey: "ELIZA_GOOGLE_OAUTH_DESKTOP_CLIENT_ID";
}, {
    readonly brandSuffix: "APP_ROUTE_PLUGIN_MODULES";
    readonly elizaKey: "ELIZA_APP_ROUTE_PLUGIN_MODULES";
}, {
    readonly brandSuffix: "API_TOKEN";
    readonly elizaKey: "ELIZA_API_TOKEN";
}, {
    readonly brandSuffix: "API_BIND";
    readonly elizaKey: "ELIZA_API_BIND";
}, {
    readonly brandSuffix: "API_EXPOSE_PORT";
    readonly elizaKey: "ELIZA_API_EXPOSE_PORT";
}, {
    readonly brandSuffix: "PAIRING_DISABLED";
    readonly elizaKey: "ELIZA_PAIRING_DISABLED";
}, {
    readonly brandSuffix: "ALLOWED_ORIGINS";
    readonly elizaKey: "ELIZA_ALLOWED_ORIGINS";
}, {
    readonly brandSuffix: "ALLOWED_HOSTS";
    readonly elizaKey: "ELIZA_ALLOWED_HOSTS";
}, {
    readonly brandSuffix: "ALLOW_NULL_ORIGIN";
    readonly elizaKey: "ELIZA_ALLOW_NULL_ORIGIN";
}, {
    readonly brandSuffix: "ALLOW_WS_QUERY_TOKEN";
    readonly elizaKey: "ELIZA_ALLOW_WS_QUERY_TOKEN";
}, {
    readonly brandSuffix: "DISABLE_AUTO_API_TOKEN";
    readonly elizaKey: "ELIZA_DISABLE_AUTO_API_TOKEN";
}, {
    readonly brandSuffix: "WALLET_EXPORT_TOKEN";
    readonly elizaKey: "ELIZA_WALLET_EXPORT_TOKEN";
}, {
    readonly brandSuffix: "TERMINAL_RUN_TOKEN";
    readonly elizaKey: "ELIZA_TERMINAL_RUN_TOKEN";
}, {
    readonly brandSuffix: "API_BASE";
    readonly elizaKey: "ELIZA_API_BASE";
}, {
    readonly brandSuffix: "API_BASE_URL";
    readonly elizaKey: "ELIZA_API_BASE_URL";
}, {
    readonly brandSuffix: "DESKTOP_API_BASE";
    readonly elizaKey: "ELIZA_DESKTOP_API_BASE";
}, {
    readonly brandSuffix: "DESKTOP_TEST_API_BASE";
    readonly elizaKey: "ELIZA_DESKTOP_TEST_API_BASE";
}, {
    readonly brandSuffix: "DESKTOP_SKIP_EMBEDDED_AGENT";
    readonly elizaKey: "ELIZA_DESKTOP_SKIP_EMBEDDED_AGENT";
}, {
    readonly brandSuffix: "RENDERER_URL";
    readonly elizaKey: "ELIZA_RENDERER_URL";
}, {
    readonly brandSuffix: "CLOUD_TTS_DISABLED";
    readonly elizaKey: "ELIZA_CLOUD_TTS_DISABLED";
}, {
    readonly brandSuffix: "CLOUD_MEDIA_DISABLED";
    readonly elizaKey: "ELIZA_CLOUD_MEDIA_DISABLED";
}, {
    readonly brandSuffix: "CLOUD_EMBEDDINGS_DISABLED";
    readonly elizaKey: "ELIZA_CLOUD_EMBEDDINGS_DISABLED";
}, {
    readonly brandSuffix: "CLOUD_RPC_DISABLED";
    readonly elizaKey: "ELIZA_CLOUD_RPC_DISABLED";
}, {
    readonly brandSuffix: "DISABLE_LOCAL_EMBEDDINGS";
    readonly elizaKey: "ELIZA_DISABLE_LOCAL_EMBEDDINGS";
}, {
    readonly brandSuffix: "DISABLE_EDGE_TTS";
    readonly elizaKey: "ELIZA_DISABLE_EDGE_TTS";
}, {
    readonly brandSuffix: "UI_PORT";
    readonly elizaKey: "ELIZA_UI_PORT";
}, {
    readonly brandSuffix: "PORT";
    readonly elizaKey: "ELIZA_PORT";
    readonly syncElizaKey: "ELIZA_UI_PORT";
}, {
    readonly brandSuffix: "API_PORT";
    readonly elizaKey: "ELIZA_API_PORT";
}, {
    readonly brandSuffix: "HOME_PORT";
    readonly elizaKey: "ELIZA_HOME_PORT";
}, {
    readonly brandSuffix: "GATEWAY_PORT";
    readonly elizaKey: "ELIZA_GATEWAY_PORT";
}, {
    readonly brandSuffix: "BRIDGE_PORT";
    readonly elizaKey: "ELIZA_BRIDGE_PORT";
}];
export declare function normalizeBrandEnvPrefix(prefix: string | undefined): string;
export declare function buildBrandEnvAliases(prefix: string): BrandEnvAliasPair[];
export declare function buildBrandEnvSyncAliases(prefix: string): BrandEnvAliasPair[];
//# sourceMappingURL=brand-env-aliases.d.ts.map