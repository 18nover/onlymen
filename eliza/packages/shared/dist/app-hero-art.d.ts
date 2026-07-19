export interface AppHeroArtworkSource {
    name: string;
    displayName?: string | null;
    category?: string | null;
    description?: string | null;
}
export type AppHeroThemeKey = "play" | "chat" | "money" | "tools" | "world" | "ops" | "app";
export declare function getAppHeroDisplayLabel(app: AppHeroArtworkSource): string;
export declare function getAppHeroMonogram(app: AppHeroArtworkSource): string;
export declare function getAppHeroThemeKey(app: AppHeroArtworkSource): AppHeroThemeKey;
export declare function createGeneratedAppHeroSvg(app: AppHeroArtworkSource): string;
export declare function createGeneratedAppHeroDataUrl(app: AppHeroArtworkSource): string;
//# sourceMappingURL=app-hero-art.d.ts.map