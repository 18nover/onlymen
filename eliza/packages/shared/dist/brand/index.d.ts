/**
 * @elizaos/shared/brand
 *
 * Canonical brand tokens and asset paths. Every elizaOS surface — homepages,
 * cloud frontend, docs, app, electrobun — sources its logos, cloud video,
 * and color palette from here so the look stays in sync.
 *
 * Asset *bytes* are duplicated into each consumer's `public/` at sync time
 * (see `scripts/sync-to-public.mjs`). This module exports only the constants
 * needed at runtime: colors, font stacks, and the on-disk paths the sync
 * script will produce.
 */
/**
 * Canonical external URLs for every Eliza surface. Import from here instead
 * of hardcoding strings so a domain change is a one-line edit.
 */
export declare const EXTERNAL_URLS: {
    readonly marketing: "https://eliza.app";
    readonly app: "https://app.elizacloud.ai";
    readonly cloud: "https://elizacloud.ai";
    readonly os: "https://os.elizacloud.ai";
    readonly docs: "https://docs.elizaos.ai";
    readonly github: "https://github.com/elizaOS/eliza";
    readonly discord: "https://discord.gg/eliza";
    readonly twitter: "https://x.com/elizaos";
};
export type ExternalUrlKey = keyof typeof EXTERNAL_URLS;
export declare const BRAND_COLORS: {
    readonly blue: "#0B35F1";
    readonly orange: "#FF5800";
    readonly white: "#FFFFFF";
    readonly black: "#000000";
    readonly gray: "#D1D0D4";
};
export type BrandColor = keyof typeof BRAND_COLORS;
/**
 * Per-surface theme. Each maps to a `.theme-*` class defined in
 * `packages/ui/src/styles/base.css`.
 */
export declare const SURFACE_THEMES: {
    readonly cloud: {
        readonly themeClass: "theme-cloud";
        readonly background: "#000000";
        readonly text: "#FFFFFF";
    };
    readonly os: {
        readonly themeClass: "theme-os";
        readonly background: "#0B35F1";
        readonly text: "#FFFFFF";
    };
    readonly app: {
        readonly themeClass: "theme-app";
        readonly background: "#FF5800";
        readonly text: "#000000";
    };
};
export type Surface = keyof typeof SURFACE_THEMES;
export declare const FONT_STACK = "\"Poppins\", system-ui, -apple-system, \"Segoe UI\", Arial, sans-serif";
export declare const FONT_WEIGHTS: readonly [400, 500, 600, 700, 800];
/**
 * Default public-relative paths for the synced assets. Each consumer that
 * runs the sync script ends up with files at exactly these paths.
 */
export declare const BRAND_PATHS: {
    readonly logos: "/brand/logos";
    readonly banners: "/brand/banners";
    readonly ogembeds: "/brand/ogembeds";
    readonly concepts: "/brand/concepts";
    readonly background: "/brand/background";
    readonly favicons: "/brand/favicons";
};
export declare const BRAND_FAVICONS: {
    readonly ico: "/brand/favicons/favicon.ico";
    readonly svg: "/brand/favicons/favicon.svg";
    readonly png16: "/brand/favicons/favicon-16x16.png";
    readonly png32: "/brand/favicons/favicon-32x32.png";
    readonly appleTouchIcon: "/brand/favicons/apple-touch-icon.png";
    readonly androidChrome192: "/brand/favicons/android-chrome-192x192.png";
    readonly androidChrome512: "/brand/favicons/android-chrome-512x512.png";
};
export declare const CONCEPT_PRODUCT_IMAGES: {
    readonly billboard: "/brand/concepts/billboard_concept_1200.jpg";
    readonly chibiUsb: "/brand/concepts/chibi_usb_concept_900.jpg";
    readonly miniPc: "/brand/concepts/concept_minipc_900.jpg";
    readonly phone: "/brand/concepts/concept_phone_800.jpg";
    readonly usbDrive: "/brand/concepts/concept_usbdrive_900.jpg";
};
export declare const CLOUD_BACKGROUND_ASSETS: {
    readonly poster: "/brand/background/clouds_background.jpg";
    readonly source1080pMp4: "/brand/background/Clouds_Loop_HQ_1080p.mp4";
    readonly sourceMobile480pMp4: "/brand/background/Clouds_Loop_Mobile_480p.mp4";
};
/**
 * The canonical logo variants. File names match `assets/logos/`. Pick the
 * one that fits the surface theme contrast.
 */
export declare const LOGO_FILES: {
    readonly cloudBlack: "elizacloud_logotext_black.svg";
    readonly cloudWhite: "elizacloud_logotext.svg";
    readonly cloudTextBlack: "elizacloud_text_black.svg";
    readonly cloudTextWhite: "elizacloud_text_white.svg";
    readonly osBlack: "elizaOS_text_black.svg";
    readonly osWhite: "elizaOS_text_white.svg";
    readonly osLockupBlack: "elizaos_logotext_black.svg";
    readonly osLockupWhite: "elizaos_logotext.svg";
    readonly elizaBlack: "eliza_text_black.svg";
    readonly elizaWhite: "eliza_text_white.svg";
    readonly elizaLockupBlack: "eliza_logotext_black.svg";
    readonly elizaLockupWhite: "eliza_logotext.svg";
    readonly markBlueNoBg: "logo_blue_nobg.svg";
    readonly markBlueBlackBg: "logo_blue_blackbg.svg";
    readonly markOrangeNoBg: "logo_orange_nobg.svg";
    readonly markOrangeBlackBg: "logo_orange_blackbg.svg";
    readonly markWhiteNoBg: "logo_white_nobg.svg";
    readonly markWhiteBlackBg: "logo_white_blackbg.svg";
    readonly markWhiteBlueBg: "logo_white_bluebg.svg";
    readonly markWhiteOrangeBg: "logo_white_orangebg.svg";
    readonly markWhiteGrayBg: "logo_white_graybg.svg";
};
export type LogoVariant = keyof typeof LOGO_FILES;
export declare const BANNER_FILES: {
    readonly eliza: "eliza_banner.svg";
    readonly cloud: "elizacloud_banner.svg";
    readonly os: "elizaos_banner.svg";
};
export declare const OG_EMBED_FILES: {
    readonly eliza: "eliza_ogembed.png";
    readonly cloud: "elizacloud_ogembed.png";
    readonly os: "elizaos_ogembed.png";
};
//# sourceMappingURL=index.d.ts.map