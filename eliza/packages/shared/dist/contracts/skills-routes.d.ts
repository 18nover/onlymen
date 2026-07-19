/**
 * Zod schemas for the skills HTTP routes — local skill management
 * (catalog install/uninstall, scaffold, edit, enable/disable,
 * marketplace surface).
 *
 * Routes covered (body-bearing only — no-body POSTs like
 * `/api/skills/refresh` and `/api/skills/catalog/refresh` need no
 * schema):
 *
 *   POST /api/skills/catalog/install
 *     body: { slug: string, version?: string }
 *   POST /api/skills/catalog/uninstall
 *     body: { slug: string }
 *   POST /api/skills/:id/acknowledge
 *     body: { enable?: boolean }
 *   POST /api/skills/create
 *     body: { name: string, description?: string }
 *   PUT  /api/skills/:id/source
 *     body: { content: string }
 *   POST /api/skills/marketplace/install
 *     body: { slug?, githubUrl?, repository?, path?, name?,
 *             description?, source?: 'clawhub'|'manual' }
 *     (refine: at least one of slug/githubUrl/repository required)
 *   POST /api/skills/marketplace/uninstall
 *     body: { id: string }
 */
import z from "zod";
export declare const PostSkillCatalogInstallRequestSchema: z.ZodPipe<z.ZodObject<{
    slug: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    version?: string | undefined;
    slug: string;
}, {
    slug: string;
    version?: string | undefined;
}>>;
export declare const PostSkillCatalogUninstallRequestSchema: z.ZodPipe<z.ZodObject<{
    slug: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    slug: string;
}, {
    slug: string;
}>>;
export declare const PostSkillAcknowledgeRequestSchema: z.ZodObject<{
    enable: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const PostSkillCreateRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    description?: string | undefined;
    name: string;
}, {
    name: string;
    description?: string | undefined;
}>>;
export declare const PutSkillSourceRequestSchema: z.ZodObject<{
    content: z.ZodString;
}, z.core.$strict>;
declare const MarketplaceInstallSourceSchema: z.ZodEnum<{
    manual: "manual";
    clawhub: "clawhub";
}>;
/**
 * Marketplace install accepts three mutually-exclusive identifying
 * inputs: slug (ClawHub-native install), githubUrl, or repository.
 * The route handler picks a path based on which is present, so the
 * schema only enforces the "at least one" invariant. Optional
 * descriptive fields are absorbed when whitespace-only.
 */
export declare const PostMarketplaceInstallRequestSchema: z.ZodPipe<z.ZodObject<{
    slug: z.ZodOptional<z.ZodString>;
    githubUrl: z.ZodOptional<z.ZodString>;
    repository: z.ZodOptional<z.ZodString>;
    path: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodEnum<{
        manual: "manual";
        clawhub: "clawhub";
    }>>;
}, z.core.$strict>, z.ZodTransform<{
    source?: "manual" | "clawhub" | undefined;
    description?: string | undefined;
    name?: string | undefined;
    path?: string | undefined;
    repository?: string | undefined;
    githubUrl?: string | undefined;
    slug?: string | undefined;
}, {
    slug?: string | undefined;
    githubUrl?: string | undefined;
    repository?: string | undefined;
    path?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    source?: "manual" | "clawhub" | undefined;
}>>;
export declare const PostMarketplaceUninstallRequestSchema: z.ZodPipe<z.ZodObject<{
    id: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    id: string;
}, {
    id: string;
}>>;
export type PostSkillCatalogInstallRequest = z.infer<typeof PostSkillCatalogInstallRequestSchema>;
export type PostSkillCatalogUninstallRequest = z.infer<typeof PostSkillCatalogUninstallRequestSchema>;
export type PostSkillAcknowledgeRequest = z.infer<typeof PostSkillAcknowledgeRequestSchema>;
export type PostSkillCreateRequest = z.infer<typeof PostSkillCreateRequestSchema>;
export type PutSkillSourceRequest = z.infer<typeof PutSkillSourceRequestSchema>;
export type PostMarketplaceInstallRequest = z.infer<typeof PostMarketplaceInstallRequestSchema>;
export type PostMarketplaceUninstallRequest = z.infer<typeof PostMarketplaceUninstallRequestSchema>;
export type MarketplaceInstallSource = z.infer<typeof MarketplaceInstallSourceSchema>;
export {};
//# sourceMappingURL=skills-routes.d.ts.map