/**
 * Zod schemas for the apps-favorites HTTP routes — the per-user
 * favorited-apps store. Fourth migration in the typed-routes
 * initiative; same template as the rest.
 *
 * Routes covered:
 *   GET  /api/apps/favorites
 *     200: { favoriteApps: string[] }            (no body to validate)
 *   PUT  /api/apps/favorites
 *     body: { appName: string, isFavorite: boolean }
 *     200:  { favoriteApps: string[] }
 *   POST /api/apps/favorites/replace
 *     body: { favoriteAppNames: string[] }
 *     200:  { favoriteApps: string[] }
 *
 * Server-side, all three routes already pipe their writes through
 * `sanitizeFavoriteAppNames(...)` — the schema's job is to reject
 * malformed inputs at the wire boundary; sanitization stays as a
 * second pass on top of validated data.
 */
import z from "zod";
export declare const PutFavoriteAppRequestSchema: z.ZodPipe<z.ZodPipe<z.ZodObject<{
    appName: z.ZodString;
    isFavorite: z.ZodBoolean;
}, z.core.$strict>, z.ZodTransform<{
    appName: string;
    isFavorite: boolean;
}, {
    appName: string;
    isFavorite: boolean;
}>>, z.ZodObject<{
    appName: z.ZodString;
    isFavorite: z.ZodBoolean;
}, z.core.$strict>>;
export declare const PostReplaceFavoritesRequestSchema: z.ZodObject<{
    favoriteAppNames: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export declare const FavoritesResponseSchema: z.ZodObject<{
    favoriteApps: z.ZodArray<z.ZodString>;
}, z.core.$strict>;
export type PutFavoriteAppRequest = z.infer<typeof PutFavoriteAppRequestSchema>;
export type PostReplaceFavoritesRequest = z.infer<typeof PostReplaceFavoritesRequestSchema>;
export type FavoritesResponse = z.infer<typeof FavoritesResponseSchema>;
//# sourceMappingURL=apps-favorites-routes.d.ts.map