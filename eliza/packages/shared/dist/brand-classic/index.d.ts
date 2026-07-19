/**
 * Eliza Classic brand tokens: asset base path + resolver, canonical colors, and
 * logo references for the Classic variant. Parallel to the default `brand/`
 * tokens; surfaces select one variant at render time.
 */
export declare const BRAND_ASSET_BASE_PATH: "/brand";
export declare function brandAssetPath(path: string, basePath?: "/brand"): string;
export declare const brandColors: {
    readonly orange: "#FF5800";
    readonly blue: "#0B35F1";
    readonly black: "#000000";
    readonly white: "#FFFFFF";
};
export declare const brandLogos: {
    readonly elizaOsTextBlack: "/brand/logos/elizaOS_text_black.svg";
    readonly elizaOsTextWhite: "/brand/logos/elizaOS_text_white.svg";
    readonly elizaLogotext: "/brand/logos/eliza_logotext.svg";
    readonly elizaLogotextBlack: "/brand/logos/eliza_logotext_black.svg";
    readonly elizaTextBlack: "/brand/logos/eliza_text_black.svg";
    readonly elizaTextWhite: "/brand/logos/eliza_text_white.svg";
    readonly elizaCloudLogotext: "/brand/logos/elizacloud_logotext.svg";
    readonly elizaCloudLogotextBlack: "/brand/logos/elizacloud_logotext_black.svg";
    readonly elizaCloudTextBlack: "/brand/logos/elizacloud_text_black.svg";
    readonly elizaCloudTextWhite: "/brand/logos/elizacloud_text_white.svg";
    readonly elizaOsLogotext: "/brand/logos/elizaos_logotext.svg";
    readonly elizaOsLogotextBlack: "/brand/logos/elizaos_logotext_black.svg";
    readonly logoBlueBlackBg: "/brand/logos/logo_blue_blackbg.svg";
    readonly logoBlueNoBg: "/brand/logos/logo_blue_nobg.svg";
    readonly logoOrangeBlackBg: "/brand/logos/logo_orange_blackbg.svg";
    readonly logoOrangeNoBg: "/brand/logos/logo_orange_nobg.svg";
    readonly logoWhiteBlackBg: "/brand/logos/logo_white_blackbg.svg";
    readonly logoWhiteBlueBg: "/brand/logos/logo_white_bluebg.svg";
    readonly logoWhiteGrayBg: "/brand/logos/logo_white_graybg.svg";
    readonly logoWhiteNoBg: "/brand/logos/logo_white_nobg.svg";
    readonly logoWhiteOrangeBg: "/brand/logos/logo_white_orangebg.svg";
};
export declare const brandFavicons: {
    readonly ico: "/brand/favicons/favicon.ico";
    readonly svg: "/brand/favicons/favicon.svg";
    readonly png16: "/brand/favicons/favicon-16x16.png";
    readonly png32: "/brand/favicons/favicon-32x32.png";
    readonly appleTouchIcon: "/brand/favicons/apple-touch-icon.png";
    readonly androidChrome192: "/brand/favicons/android-chrome-192x192.png";
    readonly androidChrome512: "/brand/favicons/android-chrome-512x512.png";
};
export declare const brandConcepts: {
    readonly billboard: "/brand/concepts/billboard_concept.jpg";
    readonly chibiUsb: "/brand/concepts/chibi_usb_concept.jpg";
    readonly miniPc: "/brand/concepts/concept_minipc.jpg";
    readonly phone: "/brand/concepts/concept_phone.jpg";
    readonly usbDrive: "/brand/concepts/concept_usbdrive.jpg";
};
export declare const brandCloudBackgrounds: {
    readonly poster: "/brand/background/clouds_background.jpg";
    readonly sourceMp4: "/brand/background/Clouds_Loop_HQ_1080p.mp4";
    readonly sourceMobileMp4: "/brand/background/Clouds_Loop_Mobile_480p.mp4";
    readonly optimized: {
        readonly clouds1x360pMp4: "/brand/background/optimized/clouds_1x_360p.mp4";
        readonly clouds1x360pWebm: "/brand/background/optimized/clouds_1x_360p.webm";
        readonly clouds1x480pMp4: "/brand/background/optimized/clouds_1x_480p.mp4";
        readonly clouds1x480pWebm: "/brand/background/optimized/clouds_1x_480p.webm";
        readonly clouds1x720pMp4: "/brand/background/optimized/clouds_1x_720p.mp4";
        readonly clouds1x720pWebm: "/brand/background/optimized/clouds_1x_720p.webm";
        readonly clouds1x1080pMp4: "/brand/background/optimized/clouds_1x_1080p.mp4";
        readonly clouds1x1080pWebm: "/brand/background/optimized/clouds_1x_1080p.webm";
        readonly clouds4x360pMp4: "/brand/background/optimized/clouds_4x_360p.mp4";
        readonly clouds4x360pWebm: "/brand/background/optimized/clouds_4x_360p.webm";
        readonly clouds4x480pMp4: "/brand/background/optimized/clouds_4x_480p.mp4";
        readonly clouds4x480pWebm: "/brand/background/optimized/clouds_4x_480p.webm";
        readonly clouds4x720pMp4: "/brand/background/optimized/clouds_4x_720p.mp4";
        readonly clouds4x720pWebm: "/brand/background/optimized/clouds_4x_720p.webm";
        readonly clouds4x1080pMp4: "/brand/background/optimized/clouds_4x_1080p.mp4";
        readonly clouds4x1080pWebm: "/brand/background/optimized/clouds_4x_1080p.webm";
        readonly clouds8x360pMp4: "/brand/background/optimized/clouds_8x_360p.mp4";
        readonly clouds8x360pWebm: "/brand/background/optimized/clouds_8x_360p.webm";
        readonly clouds8x480pMp4: "/brand/background/optimized/clouds_8x_480p.mp4";
        readonly clouds8x480pWebm: "/brand/background/optimized/clouds_8x_480p.webm";
        readonly clouds8x720pMp4: "/brand/background/optimized/clouds_8x_720p.mp4";
        readonly clouds8x720pWebm: "/brand/background/optimized/clouds_8x_720p.webm";
        readonly clouds8x1080pMp4: "/brand/background/optimized/clouds_8x_1080p.mp4";
        readonly clouds8x1080pWebm: "/brand/background/optimized/clouds_8x_1080p.webm";
    };
};
export declare const brandAssets: {
    readonly basePath: "/brand";
    readonly colors: {
        readonly orange: "#FF5800";
        readonly blue: "#0B35F1";
        readonly black: "#000000";
        readonly white: "#FFFFFF";
    };
    readonly logos: {
        readonly elizaOsTextBlack: "/brand/logos/elizaOS_text_black.svg";
        readonly elizaOsTextWhite: "/brand/logos/elizaOS_text_white.svg";
        readonly elizaLogotext: "/brand/logos/eliza_logotext.svg";
        readonly elizaLogotextBlack: "/brand/logos/eliza_logotext_black.svg";
        readonly elizaTextBlack: "/brand/logos/eliza_text_black.svg";
        readonly elizaTextWhite: "/brand/logos/eliza_text_white.svg";
        readonly elizaCloudLogotext: "/brand/logos/elizacloud_logotext.svg";
        readonly elizaCloudLogotextBlack: "/brand/logos/elizacloud_logotext_black.svg";
        readonly elizaCloudTextBlack: "/brand/logos/elizacloud_text_black.svg";
        readonly elizaCloudTextWhite: "/brand/logos/elizacloud_text_white.svg";
        readonly elizaOsLogotext: "/brand/logos/elizaos_logotext.svg";
        readonly elizaOsLogotextBlack: "/brand/logos/elizaos_logotext_black.svg";
        readonly logoBlueBlackBg: "/brand/logos/logo_blue_blackbg.svg";
        readonly logoBlueNoBg: "/brand/logos/logo_blue_nobg.svg";
        readonly logoOrangeBlackBg: "/brand/logos/logo_orange_blackbg.svg";
        readonly logoOrangeNoBg: "/brand/logos/logo_orange_nobg.svg";
        readonly logoWhiteBlackBg: "/brand/logos/logo_white_blackbg.svg";
        readonly logoWhiteBlueBg: "/brand/logos/logo_white_bluebg.svg";
        readonly logoWhiteGrayBg: "/brand/logos/logo_white_graybg.svg";
        readonly logoWhiteNoBg: "/brand/logos/logo_white_nobg.svg";
        readonly logoWhiteOrangeBg: "/brand/logos/logo_white_orangebg.svg";
    };
    readonly favicons: {
        readonly ico: "/brand/favicons/favicon.ico";
        readonly svg: "/brand/favicons/favicon.svg";
        readonly png16: "/brand/favicons/favicon-16x16.png";
        readonly png32: "/brand/favicons/favicon-32x32.png";
        readonly appleTouchIcon: "/brand/favicons/apple-touch-icon.png";
        readonly androidChrome192: "/brand/favicons/android-chrome-192x192.png";
        readonly androidChrome512: "/brand/favicons/android-chrome-512x512.png";
    };
    readonly concepts: {
        readonly billboard: "/brand/concepts/billboard_concept.jpg";
        readonly chibiUsb: "/brand/concepts/chibi_usb_concept.jpg";
        readonly miniPc: "/brand/concepts/concept_minipc.jpg";
        readonly phone: "/brand/concepts/concept_phone.jpg";
        readonly usbDrive: "/brand/concepts/concept_usbdrive.jpg";
    };
    readonly cloudBackgrounds: {
        readonly poster: "/brand/background/clouds_background.jpg";
        readonly sourceMp4: "/brand/background/Clouds_Loop_HQ_1080p.mp4";
        readonly sourceMobileMp4: "/brand/background/Clouds_Loop_Mobile_480p.mp4";
        readonly optimized: {
            readonly clouds1x360pMp4: "/brand/background/optimized/clouds_1x_360p.mp4";
            readonly clouds1x360pWebm: "/brand/background/optimized/clouds_1x_360p.webm";
            readonly clouds1x480pMp4: "/brand/background/optimized/clouds_1x_480p.mp4";
            readonly clouds1x480pWebm: "/brand/background/optimized/clouds_1x_480p.webm";
            readonly clouds1x720pMp4: "/brand/background/optimized/clouds_1x_720p.mp4";
            readonly clouds1x720pWebm: "/brand/background/optimized/clouds_1x_720p.webm";
            readonly clouds1x1080pMp4: "/brand/background/optimized/clouds_1x_1080p.mp4";
            readonly clouds1x1080pWebm: "/brand/background/optimized/clouds_1x_1080p.webm";
            readonly clouds4x360pMp4: "/brand/background/optimized/clouds_4x_360p.mp4";
            readonly clouds4x360pWebm: "/brand/background/optimized/clouds_4x_360p.webm";
            readonly clouds4x480pMp4: "/brand/background/optimized/clouds_4x_480p.mp4";
            readonly clouds4x480pWebm: "/brand/background/optimized/clouds_4x_480p.webm";
            readonly clouds4x720pMp4: "/brand/background/optimized/clouds_4x_720p.mp4";
            readonly clouds4x720pWebm: "/brand/background/optimized/clouds_4x_720p.webm";
            readonly clouds4x1080pMp4: "/brand/background/optimized/clouds_4x_1080p.mp4";
            readonly clouds4x1080pWebm: "/brand/background/optimized/clouds_4x_1080p.webm";
            readonly clouds8x360pMp4: "/brand/background/optimized/clouds_8x_360p.mp4";
            readonly clouds8x360pWebm: "/brand/background/optimized/clouds_8x_360p.webm";
            readonly clouds8x480pMp4: "/brand/background/optimized/clouds_8x_480p.mp4";
            readonly clouds8x480pWebm: "/brand/background/optimized/clouds_8x_480p.webm";
            readonly clouds8x720pMp4: "/brand/background/optimized/clouds_8x_720p.mp4";
            readonly clouds8x720pWebm: "/brand/background/optimized/clouds_8x_720p.webm";
            readonly clouds8x1080pMp4: "/brand/background/optimized/clouds_8x_1080p.mp4";
            readonly clouds8x1080pWebm: "/brand/background/optimized/clouds_8x_1080p.webm";
        };
    };
};
//# sourceMappingURL=index.d.ts.map