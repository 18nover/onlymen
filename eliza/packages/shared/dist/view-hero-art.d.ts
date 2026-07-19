/**
 * Branded hero-image generator for plugin **views**.
 *
 * A view is a mini-app contributed by a plugin (`Plugin.views`). Each one is
 * served a square hero image at `/api/views/<id>/hero`. Real heroes live in the
 * plugin at `assets/hero.<ext>`; when a plugin ships none, the agent serves a
 * generated SVG produced here so the catalog never shows a broken or ugly tile.
 *
 * The composition is intentionally **no-blue-dominant** (the app surface forbids
 * blue accents — orange/jewel tones only) and **deterministic**: the same input
 * always yields byte-identical output, so `scripts/generate-view-heroes.mjs`
 * (which commits real heroes into plugins) and the runtime fallback render the
 * exact same art. This is the single source of truth for that art — the script
 * and the agent both import `renderViewHeroSvg` from here.
 *
 * Pure string generation only: no Node APIs, so this module stays importable
 * from the runtime-agnostic `@elizaos/shared` barrel (browser + server).
 */
export interface ViewHeroFrameInput {
    /** Stable slug used to namespace SVG gradient/filter ids. */
    id: string;
    /** Accent hue (0–359). Keep out of the pure-blue band for the app surface. */
    hue: number;
    /** Inline SVG markup for the centered line-icon glyph. */
    iconSvg: string;
    /** Display label rendered along the bottom. */
    label: string;
}
/**
 * Render the full branded hero SVG. Shared chrome (defs, background, depth
 * blobs, faint grid, accent arc, bottom label + vignette) with the icon glyph
 * slotted in. Output is deterministic and byte-identical for identical input.
 */
export declare function renderViewHeroSvg({ id, hue, iconSvg, label, }: ViewHeroFrameInput): string;
/**
 * Hand-drawn vector line-icons, centered at (0,0) spanning roughly -150..150.
 * Each inherits stroke styling from the parent <g>; fills are set explicitly
 * where a filled glyph reads better. Keyed names map to the catalog below.
 */
export declare const VIEW_HERO_ICONS: {
    readonly modelTester: "    <rect x=\"-110\" y=\"-110\" width=\"220\" height=\"220\" rx=\"28\"/>\n    <rect x=\"-58\" y=\"-58\" width=\"116\" height=\"116\" rx=\"14\"/>\n    <line x1=\"-110\" y1=\"-66\" x2=\"-150\" y2=\"-66\"/>\n    <line x1=\"-110\" y1=\"0\" x2=\"-150\" y2=\"0\"/>\n    <line x1=\"-110\" y1=\"66\" x2=\"-150\" y2=\"66\"/>\n    <line x1=\"110\" y1=\"-66\" x2=\"150\" y2=\"-66\"/>\n    <line x1=\"110\" y1=\"0\" x2=\"150\" y2=\"0\"/>\n    <line x1=\"110\" y1=\"66\" x2=\"150\" y2=\"66\"/>\n    <line x1=\"-66\" y1=\"-110\" x2=\"-66\" y2=\"-150\"/>\n    <line x1=\"0\" y1=\"-110\" x2=\"0\" y2=\"-150\"/>\n    <line x1=\"66\" y1=\"-110\" x2=\"66\" y2=\"-150\"/>\n    <line x1=\"-66\" y1=\"110\" x2=\"-66\" y2=\"150\"/>\n    <line x1=\"0\" y1=\"110\" x2=\"0\" y2=\"150\"/>\n    <line x1=\"66\" y1=\"110\" x2=\"66\" y2=\"150\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"14\" stroke-width=\"0\" fill=\"currentColor\"/>";
    readonly views: "    <rect x=\"-150\" y=\"-150\" width=\"130\" height=\"130\" rx=\"18\"/>\n    <rect x=\"20\" y=\"-150\" width=\"130\" height=\"130\" rx=\"18\"/>\n    <rect x=\"-150\" y=\"20\" width=\"130\" height=\"130\" rx=\"18\"/>\n    <rect x=\"20\" y=\"20\" width=\"130\" height=\"130\" rx=\"18\"/>";
    readonly focus: "    <path d=\"M0 -150 L130 -100 L130 24 C130 110 70 152 0 175 C-70 152 -130 110 -130 24 L-130 -100 Z\"/>\n    <circle cx=\"0\" cy=\"-2\" r=\"34\"/>\n    <line x1=\"-92\" y1=\"-96\" x2=\"96\" y2=\"120\"/>";
    readonly calendar: "    <rect x=\"-140\" y=\"-118\" width=\"280\" height=\"248\" rx=\"24\"/>\n    <line x1=\"-140\" y1=\"-52\" x2=\"140\" y2=\"-52\"/>\n    <line x1=\"-78\" y1=\"-150\" x2=\"-78\" y2=\"-92\"/>\n    <line x1=\"78\" y1=\"-150\" x2=\"78\" y2=\"-92\"/>\n    <circle cx=\"-66\" cy=\"6\" r=\"11\" stroke-width=\"0\" fill=\"currentColor\"/>\n    <circle cx=\"0\" cy=\"6\" r=\"11\" stroke-width=\"0\" fill=\"currentColor\"/>\n    <circle cx=\"66\" cy=\"6\" r=\"11\" stroke-width=\"0\" fill=\"currentColor\"/>\n    <circle cx=\"-66\" cy=\"72\" r=\"11\" stroke-width=\"0\" fill=\"currentColor\"/>\n    <circle cx=\"0\" cy=\"72\" r=\"11\" stroke-width=\"0\" fill=\"currentColor\"/>";
    readonly headphones: "    <path d=\"M-140 30 V-10 A140 140 0 0 1 140 -10 V30\"/>\n    <rect x=\"-160\" y=\"26\" width=\"58\" height=\"110\" rx=\"26\" fill=\"currentColor\" stroke-width=\"0\"/>\n    <rect x=\"102\" y=\"26\" width=\"58\" height=\"110\" rx=\"26\" fill=\"currentColor\" stroke-width=\"0\"/>\n    <rect x=\"-160\" y=\"26\" width=\"58\" height=\"110\" rx=\"26\"/>\n    <rect x=\"102\" y=\"26\" width=\"58\" height=\"110\" rx=\"26\"/>";
    readonly glasses: "    <circle cx=\"-86\" cy=\"20\" r=\"68\"/>\n    <circle cx=\"86\" cy=\"20\" r=\"68\"/>\n    <path d=\"M-18 20 Q0 -2 18 20\"/>\n    <line x1=\"-154\" y1=\"-12\" x2=\"-180\" y2=\"-44\"/>\n    <line x1=\"154\" y1=\"-12\" x2=\"180\" y2=\"-44\"/>";
    readonly finances: "    <polyline points=\"-150,-150 -150,150 150,150\"/>\n    <polyline points=\"-118,86 -50,-2 6,52 76,-62 132,-104\" fill=\"none\"/>\n    <circle cx=\"-50\" cy=\"-2\" r=\"13\" stroke-width=\"0\" fill=\"currentColor\"/>\n    <circle cx=\"76\" cy=\"-62\" r=\"13\" stroke-width=\"0\" fill=\"currentColor\"/>\n    <circle cx=\"132\" cy=\"-104\" r=\"13\" stroke-width=\"0\" fill=\"currentColor\"/>";
    readonly goals: "    <circle cx=\"0\" cy=\"0\" r=\"150\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"92\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"34\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"9\" stroke-width=\"0\" fill=\"currentColor\"/>";
    readonly health: "    <path d=\"M0 150 C-180 18 -120 -120 0 -52 C120 -120 180 18 0 150 Z\"/>\n    <polyline points=\"-150,-10 -64,-10 -28,-58 14,52 48,-10 150,-10\" fill=\"none\"/>";
    readonly inbox: "    <path d=\"M-150 -40 L-110 -130 H110 L150 -40 V120 A20 20 0 0 1 130 140 H-130 A20 20 0 0 1 -150 120 Z\"/>\n    <path d=\"M-150 -40 H-44 L-10 24 H10 L44 -40 H150\"/>";
    readonly messages: "    <path d=\"M-150 -120 H150 A24 24 0 0 1 174 -96 V60 A24 24 0 0 1 150 84 H-30 L-100 150 V84 H-150 A24 24 0 0 1 -174 60 V-96 A24 24 0 0 1 -150 -120 Z\"/>\n    <line x1=\"-100\" y1=\"-44\" x2=\"100\" y2=\"-44\"/>\n    <line x1=\"-100\" y1=\"16\" x2=\"40\" y2=\"16\"/>";
    readonly todos: "    <rect x=\"-150\" y=\"-150\" width=\"300\" height=\"300\" rx=\"36\"/>\n    <polyline points=\"-92,-6 -36,52 92,-78\" fill=\"none\"/>";
    readonly vectorBrowser: "    <line x1=\"-110\" y1=\"-96\" x2=\"0\" y2=\"0\"/>\n    <line x1=\"120\" y1=\"-110\" x2=\"0\" y2=\"0\"/>\n    <line x1=\"-130\" y1=\"86\" x2=\"0\" y2=\"0\"/>\n    <line x1=\"110\" y1=\"104\" x2=\"0\" y2=\"0\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"30\" fill=\"currentColor\" stroke-width=\"0\"/>\n    <circle cx=\"0\" cy=\"0\" r=\"30\"/>\n    <circle cx=\"-110\" cy=\"-96\" r=\"22\"/>\n    <circle cx=\"120\" cy=\"-110\" r=\"22\"/>\n    <circle cx=\"-130\" cy=\"86\" r=\"22\"/>\n    <circle cx=\"110\" cy=\"104\" r=\"22\"/>";
};
export type ViewHeroIconKind = keyof typeof VIEW_HERO_ICONS;
/** Deterministically pick a non-blue accent hue for an arbitrary view key. */
export declare function hueForViewKey(key: string): number;
export interface ViewHeroSource {
    id?: string;
    label: string;
    /** Lucide icon name declared by the view, used as a keyword hint. */
    icon?: string;
    tags?: readonly string[];
}
/** Pick the best-matching icon glyph for a view, defaulting to the grid. */
export declare function pickViewHeroIcon(source: ViewHeroSource): ViewHeroIconKind;
/**
 * High-level entry point: render a branded hero SVG for a view, choosing the
 * accent hue and icon glyph automatically from the view's metadata. Used by the
 * agent's hero fallback and by view scaffolding/icon-regeneration so a generated
 * hero looks the same everywhere.
 */
export declare function generateViewHeroSvgFor(source: ViewHeroSource): string;
//# sourceMappingURL=view-hero-art.d.ts.map