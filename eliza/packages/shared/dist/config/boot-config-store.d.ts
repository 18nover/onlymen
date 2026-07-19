/**
 * Store-only boot config entry, safe for Bun/Node API paths.
 *
 * UI packages may augment the shape with component implementations, but the
 * shared runtime only needs a process-global config object and a few common
 * fields used by API clients and asset helpers.
 */
import type { BrandingConfig } from "./branding.js";
export { resolveAliasedEnvValue } from "@elizaos/core";
export interface BundledVrmAsset {
    title: string;
    slug: string;
}
export interface CharacterCatalogData {
    assets: CharacterAssetEntry[];
    injectedCharacters: InjectedCharacterEntry[];
}
export interface CharacterAssetEntry {
    id: number;
    slug: string;
    title: string;
    sourceName: string;
}
export interface InjectedCharacterEntry {
    catchphrase: string;
    name: string;
    avatarAssetId: number;
    voicePresetId?: string;
}
export interface ResolvedCharacterAsset extends CharacterAssetEntry {
    compressedVrmPath: string;
    rawVrmPath: string;
    previewPath: string;
    backgroundPath: string;
    sourceVrmFilename: string;
}
export interface ResolvedInjectedCharacter extends InjectedCharacterEntry {
    avatarAsset: ResolvedCharacterAsset;
}
export interface ClientMiddleware {
    forceFreshFirstRun?: boolean;
    preferLocalProvider?: boolean;
    desktopPermissions?: boolean;
}
export interface AppBootConfig {
    branding: Partial<BrandingConfig>;
    assetBaseUrl?: string;
    defaultApps?: readonly string[];
    apiBase?: string;
    apiToken?: string;
    cloudApiBase?: string;
    vrmAssets?: BundledVrmAsset[];
    firstRunStyles?: unknown[];
    /** Default-on shared cloud tier; false is the dedicated-direct kill-switch. */
    preferSharedCloudTier?: boolean;
    characterCatalog?: CharacterCatalogData;
    envAliases?: readonly (readonly [string, string])[];
    clientMiddleware?: ClientMiddleware;
    [key: string]: unknown;
}
export declare const DEFAULT_BOOT_CONFIG: AppBootConfig;
export declare function setBootConfig(config: AppBootConfig): void;
export declare function getBootConfig(): AppBootConfig;
export declare function resolveCharacterCatalog(catalog: CharacterCatalogData): {
    assets: ResolvedCharacterAsset[];
    assetCount: number;
    defaultAsset: ResolvedCharacterAsset | null;
    injectedCharacters: ResolvedInjectedCharacter[];
    injectedCharacterCount: number;
    getAsset: (id: number) => ResolvedCharacterAsset | null;
    getInjectedCharacter: (catchphrase: string) => ResolvedInjectedCharacter | null;
};
//# sourceMappingURL=boot-config-store.d.ts.map