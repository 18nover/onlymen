/**
 * Model-file integrity verification.
 *
 * GGUF files are large (0.8 – 20 GB). Corrupted files surface as cryptic
 * llama.cpp errors much later, so we verify at install time and expose a
 * manual verify button for users who want to re-check after a system
 * event (crash, disk fill, external tool edited the file, etc).
 *
 * We don't require SHA256 from HuggingFace — HF doesn't publish per-file
 * hashes in the standard API, and hand-curating them in the catalog would
 * drift. Instead, after a successful download we compute the SHA256
 * ourselves and stash it on the InstalledModel. Re-verify compares the
 * file's current hash against the stashed one. A mismatch means the file
 * changed on disk since we installed it — user can redownload.
 *
 * For GGUF specifically we also do a cheap structural header check
 * (the file starts with the magic bytes "GGUF") so obvious truncations
 * flag instantly without having to hash a 10GB file.
 */
import type { InstalledModel } from "./types.js";
export type VerifyState = "unknown" | "ok" | "mismatch" | "missing" | "truncated";
export interface VerifyResult {
    state: VerifyState;
    /** SHA256 hex of the file as it exists now. Absent when file missing. */
    currentSha256: string | null;
    /** Hash from the registry, when available. */
    expectedSha256: string | null;
    /** Size read from the filesystem. */
    currentBytes: number | null;
}
export declare function hashFile(path: string): Promise<string>;
/**
 * Run the full verification pipeline on a model. Returns the state and
 * the freshly computed hash so the caller can persist it to the registry.
 */
export declare function verifyInstalledModel(model: InstalledModel): Promise<VerifyResult>;
/** Helper for tests — no runtime use. */
export declare function __registryPathForTests(): string;
//# sourceMappingURL=verify.d.ts.map