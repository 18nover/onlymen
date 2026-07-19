/**
 * Content Pack manifest and types.
 *
 * A content pack bundles visual assets (VRM, background, color scheme),
 * personality data, and optional stream overlay into a single installable unit.
 * Packs are loaded from the splash page before first-run setup begins.
 */
// ── Validation ──────────────────────────────────────────────────────
const PACK_ID_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{3,8}$/;
export function validateContentPackManifest(data) {
    const errors = [];
    if (!data || typeof data !== "object" || Array.isArray(data)) {
        errors.push({ field: "root", message: "Manifest must be a JSON object" });
        return errors;
    }
    const manifest = data;
    // Required fields
    if (typeof manifest.id !== "string" || !manifest.id.trim()) {
        errors.push({ field: "id", message: "Pack id is required" });
    }
    else if (!PACK_ID_PATTERN.test(manifest.id)) {
        errors.push({
            field: "id",
            message: "Pack id must be kebab-case (lowercase letters, numbers, hyphens)",
        });
    }
    if (typeof manifest.name !== "string" || !manifest.name.trim()) {
        errors.push({ field: "name", message: "Pack name is required" });
    }
    if (typeof manifest.version !== "string" || !manifest.version.trim()) {
        errors.push({ field: "version", message: "Pack version is required" });
    }
    // Assets validation
    const assets = manifest.assets && typeof manifest.assets === "object"
        ? manifest.assets
        : null;
    if (!assets) {
        errors.push({ field: "assets", message: "Assets object is required" });
        return errors;
    }
    // VRM validation
    if (assets.vrm != null) {
        const vrm = typeof assets.vrm === "object" && !Array.isArray(assets.vrm)
            ? assets.vrm
            : null;
        if (!vrm) {
            errors.push({ field: "assets.vrm", message: "VRM must be an object" });
        }
        else {
            if (typeof vrm.file !== "string" || !vrm.file.trim()) {
                errors.push({
                    field: "assets.vrm.file",
                    message: "VRM file path is required",
                });
            }
            if (typeof vrm.slug !== "string" || !vrm.slug.trim()) {
                errors.push({
                    field: "assets.vrm.slug",
                    message: "VRM slug is required",
                });
            }
        }
    }
    // Color scheme validation
    if (assets.colorScheme != null) {
        const cs = typeof assets.colorScheme === "object" &&
            !Array.isArray(assets.colorScheme)
            ? assets.colorScheme
            : null;
        if (!cs) {
            errors.push({
                field: "assets.colorScheme",
                message: "Color scheme must be an object",
            });
        }
        else {
            for (const key of [
                "accent",
                "bg",
                "card",
                "border",
                "text",
                "textMuted",
            ]) {
                if (typeof cs[key] === "string" &&
                    !HEX_COLOR_PATTERN.test(cs[key])) {
                    errors.push({
                        field: `assets.colorScheme.${key}`,
                        message: `Color value must be a valid hex color (e.g. #ff00ff)`,
                    });
                }
            }
        }
    }
    return errors;
}
// ── Constants ───────────────────────────────────────────────────────
/** Manifest filename expected at the root of a content pack */
export const CONTENT_PACK_MANIFEST_FILENAME = "pack.json";
/** Maximum pack file size (100 MB) */
export const CONTENT_PACK_MAX_SIZE_BYTES = 100 * 1024 * 1024;
//# sourceMappingURL=content-pack.js.map