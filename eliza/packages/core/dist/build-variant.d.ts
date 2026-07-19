/**
 * Build variant — store vs direct.
 *
 * `store` builds (Mac App Store, Microsoft Store, Flathub, etc.) run inside
 * an OS sandbox that forbids forking arbitrary user-installed binaries and
 * restricts filesystem reach to the app's container plus user-granted folders.
 *
 * `direct` builds are the unrestricted user-download artifacts.
 *
 * Resolution: `ELIZA_BUILD_VARIANT` → default `direct`. The variant is
 * decided at process start; we do not refresh it mid-run.
 */
export declare const BUILD_VARIANTS: readonly ["store", "direct"];
export type BuildVariant = (typeof BUILD_VARIANTS)[number];
export declare const DEFAULT_BUILD_VARIANT: BuildVariant;
export declare function getBuildVariant(): BuildVariant;
export declare function getDirectDownloadUrl(): string;
export declare function isStoreBuild(): boolean;
export declare function isDirectBuild(): boolean;
/** Test hook only. Resets cached variant so tests can swap env vars. */
export declare function _resetBuildVariantForTests(): void;
//# sourceMappingURL=build-variant.d.ts.map