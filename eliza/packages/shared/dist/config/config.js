export function isCloudActiveFromProviders(providers) {
    if (!Array.isArray(providers) || providers.length === 0) {
        return false;
    }
    return providers.includes("elizacloud");
}
export function migrateCloudEnabledToProviders(config) {
    const cloudEnabled = config.cloud?.enabled === true;
    if (!cloudEnabled) {
        return config;
    }
    const existingProviders = Array.isArray(config.providers)
        ? config.providers
        : [];
    if (existingProviders.includes("elizacloud")) {
        return config;
    }
    return {
        ...config,
        providers: [...existingProviders, "elizacloud"],
    };
}
//# sourceMappingURL=config.js.map