/**
 * UI registry host — the pluggable store backing module-scope UI registries
 * (overlay apps, app-shell pages, settings sections). Registries call
 * `getUiRegistryStore(key, create)` to obtain a stable per-key store; hosts can
 * swap the backing implementation (SSR isolation, test reset) via
 * `provideUiRegistryHost`.
 *
 * Lives in `@elizaos/shared` so both the React `@elizaos/ui` package and Node
 * code (app registration surfaces) reference one canonical store singleton
 * without the Node side importing the React package.
 */
export interface UiRegistryHost {
    getStore<T>(key: string, create: () => T): T;
}
export declare function provideUiRegistryHost(host: UiRegistryHost): void;
export declare function getUiRegistryStore<T>(key: string, create: () => T): T;
export declare function resetUiRegistryHostForTests(): void;
//# sourceMappingURL=registry-host.d.ts.map