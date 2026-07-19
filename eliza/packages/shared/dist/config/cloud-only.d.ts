/**
 * Decides whether a surface renders in cloud-only mode (no local agent shown).
 * The desktop shell runs cloud-only with the loopback agent kept solely as the
 * cloud-login proxy, so an explicit desktop `cloud` runtime mode wins over the
 * dev / injected-backend fall-throughs.
 */
export declare function shouldUseCloudOnlyBranding(options: {
    isDev: boolean;
    injectedApiBase?: string | null;
    isNativePlatform?: boolean;
    nativeRuntimeMode?: string | null;
    desktopRuntimeMode?: string | null;
}): boolean;
//# sourceMappingURL=cloud-only.d.ts.map