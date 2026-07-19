/**
 * The background-catalog NAME INDEX — the shared, code-free metadata half of the
 * curated background catalog (#13538). It lives in `@elizaos/shared` so BOTH
 * halves read one source of truth:
 *
 *  - `@elizaos/ui` (`state/ui-preferences.ts`) imports this index and attaches
 *    the concrete render sources (gradient data URLs / shader preset ids) to
 *    build `BACKGROUND_CATALOG` for the gallery + the apply channel.
 *  - `@elizaos/plugin-app-control` (the `BACKGROUND` action) imports this index
 *    to MATCH a user's request ("use the misty-forest background") to a catalog
 *    id, then names that id in the `background:apply` payload (`catalogId`).
 *
 * Crucially this index carries NO render source — no GLSL text, no image bytes,
 * no URL. It is pure metadata (id / label / description / mood / palette /
 * tags). The renderer is the only place that resolves an id to something
 * paintable, so naming a catalog entry can never smuggle code or an unvetted
 * URL across the broker (#11088 / #13523).
 */
/** How a catalog entry ultimately renders (the renderer owns the source). */
export type BackgroundCatalogKind = "color" | "glsl" | "image";
/** Pure metadata for one curated background — no render source. */
export interface BackgroundCatalogMeta {
    /** Stable slug used by the gallery, chat name-select, and tests. */
    id: string;
    /** Human-readable name (screen readers + the agent reply). */
    label: string;
    /** One-line description the agent can read to describe/pick the option. */
    description: string;
    /** How this entry renders (the renderer resolves the actual source). */
    kind: BackgroundCatalogKind;
    /** Short mood word(s) ("calm", "vivid"). */
    mood: string;
    /** Representative palette (hex) for the tile thumbnail + agent context. */
    palette: readonly string[];
    /** Search/agent tags ("nature", "forest", "warm"). */
    tags: readonly string[];
}
/**
 * The curated natural-background metadata. The renderer attaches a code-free SVG
 * gradient data URL to each of these (keyed by id).
 */
export declare const NATURAL_BACKGROUND_META: readonly BackgroundCatalogMeta[];
/**
 * The curated PHOTO-wallpaper metadata (#14 default-wallpapers): five painterly
 * scenes shipped as compressed WebP static assets from `packages/app/public/
 * wallpapers/`, distinct from {@link NATURAL_BACKGROUND_META}'s tiny gradient
 * data-URL entries. The renderer (`@elizaos/ui`) attaches the served,
 * same-origin `/wallpapers/<id>.webp` URL to each of these by id — a code-free
 * image the apply channel already trusts (same class as the Ember Night default
 * and the `/api/media/<hash>` uploads), so the confinement invariants
 * (#11088 / #13523) hold and nothing large lands in the JS bundle. Palettes are
 * sampled from the source art (dark / mid / highlight) for the tile thumbnail,
 * the FOUC seed, and theme-color harmony.
 */
export declare const PHOTO_BACKGROUND_META: readonly BackgroundCatalogMeta[];
/**
 * The named GLSL-preset metadata, mirrored as catalog entries. `id` doubles as
 * the shader preset id the renderer resolves to source (never GLSL text here).
 */
export declare const GLSL_BACKGROUND_META: readonly BackgroundCatalogMeta[];
/**
 * The full catalog name index: natural gradient images, then the curated photo
 * wallpapers, then the animated GLSL presets. Both the gallery (via
 * `@elizaos/ui`) and the agent action read this.
 */
export declare const BACKGROUND_CATALOG_INDEX: readonly BackgroundCatalogMeta[];
/**
 * The curated IMAGE metadata the agent name-select routes to: the gradient
 * natural entries plus the photo wallpapers (both `kind: "image"`). Excludes the
 * GLSL presets, which keep their dedicated shader-preset path in the BACKGROUND
 * action.
 */
export declare const IMAGE_BACKGROUND_META: readonly BackgroundCatalogMeta[];
/** The boot-default catalog id (the curated "Ember Night" gradient). */
export declare const DEFAULT_BACKGROUND_CATALOG_ID = "ember-night";
/**
 * Match a free-text / id / label reference to a catalog id. Case- and
 * whitespace-insensitive; matches by id, then exact label, then a label
 * substring (either direction). So "misty forest", "Misty Forest", "the misty
 * forest one", and "misty-forest" all resolve. Returns undefined for an unknown
 * name (callers then ignore it — consistent with the #13523 confinement rule).
 *
 * Deliberately does NOT match on generic tags ("green", "blue", "warm"): those
 * are color-like words that belong to the color parser, and tag-matching them
 * would apply an arbitrary curated image for a plain color request.
 */
export declare function matchCatalogId(ref: string | undefined): string | undefined;
/**
 * Detect whether free text names a curated IMAGE catalog background (a gradient
 * natural entry OR a photo wallpaper), returning the matched id. Only image
 * entries are matched here: the GLSL presets (aurora/lava/…) already have a
 * dedicated shader-preset path in the BACKGROUND action, so routing them through
 * name-select would change their reply/behavior. Requires a distinctive label/id
 * token to appear (not a generic tag like "warm"/"green"), so a plain color
 * request is never hijacked. Used by the action to route "use the misty-forest
 * background" or "set the reef background" to a name-select.
 */
export declare function detectCatalogId(text: string): string | undefined;
//# sourceMappingURL=catalog-index.d.ts.map