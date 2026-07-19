function trimEnvValue(value) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
}
/**
 * App entrypoints should consistently default to the app namespace even
 * when they bypass the CLI/profile bootstrap path.
 */
export function ensureNamespaceDefaults(env = globalThis.process?.env) {
    if (!env)
        return;
    if (!trimEnvValue(env.ELIZA_NAMESPACE)) {
        env.ELIZA_NAMESPACE = "eliza";
    }
}
ensureNamespaceDefaults();
//# sourceMappingURL=namespace-defaults.js.map