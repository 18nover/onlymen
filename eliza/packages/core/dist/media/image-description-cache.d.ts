/**
 * Shared content-addressed cache for image descriptions.
 *
 * The runtime describes an image (IMAGE_DESCRIPTION vision model) from several
 * places — inbound attachment processing, on-demand `ATTACHMENT action=read`,
 * and the standalone basic-capabilities helper. Without a shared cache the same
 * image is re-described on every path and every turn, which is slow and costs
 * tokens. Keying on the resolved image URL (a `data:` URL for inline bytes, or
 * the served/remote URL) means identical bytes resolve to one cached
 * description reused everywhere.
 */
import type { IAgentRuntime } from "../types/index.js";
export interface CachedImageDescription {
    title: string;
    description: string;
    text: string;
}
export declare function imageDescriptionCacheKey(imageUrl: string): string;
/** Coerce any IMAGE_DESCRIPTION model response into a uniform description shape. */
export declare function normalizeImageDescription(response: unknown): CachedImageDescription | null;
export declare function getCachedImageDescription(runtime: IAgentRuntime, imageUrl: string): Promise<CachedImageDescription | undefined>;
export declare function setCachedImageDescription(runtime: IAgentRuntime, imageUrl: string, value: CachedImageDescription): Promise<void>;
/**
 * Describe an image, reusing and populating the shared cache. Returns the
 * cached result on a hit; otherwise calls the vision model once, caches, and
 * returns it. Returns null when the model is unavailable, errors, or yields no
 * usable description (callers decide the fallback).
 */
export declare function describeImageCached(runtime: IAgentRuntime, imageUrl: string, prompt: string): Promise<CachedImageDescription | null>;
//# sourceMappingURL=image-description-cache.d.ts.map