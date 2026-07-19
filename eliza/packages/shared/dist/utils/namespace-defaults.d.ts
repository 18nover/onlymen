/**
 * Resolves the app namespace default from `ELIZA_NAMESPACE`, so white-label
 * entrypoints (Milady, Eliza) consistently fall back to their own namespace
 * rather than a hardcoded one.
 */
type NamespaceDefaultsEnv = {
    ELIZA_NAMESPACE?: string;
};
/**
 * App entrypoints should consistently default to the app namespace even
 * when they bypass the CLI/profile bootstrap path.
 */
export declare function ensureNamespaceDefaults(env?: NamespaceDefaultsEnv | undefined): void;
export {};
//# sourceMappingURL=namespace-defaults.d.ts.map