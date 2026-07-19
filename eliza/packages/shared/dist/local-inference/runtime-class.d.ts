/**
 * Local-inference runtime-class discriminator.
 *
 * The local stack is Eliza-1 only: every text model is an Eliza-1 bundle served
 * by the fused `libelizainference` (`desktop-fused-ffi-backend-runtime.ts`). The
 * fused context is anchored at a *bundle root* (`ffi.create(bundleRoot)` →
 * `<bundleRoot>/text/*.gguf`) and the full optimization stack rides along:
 * embedded draft head speculative decoding, stock q8_0 KV cache, native
 * tokenization over the resident Gemma 4 (eliza-1) vocab, and fused
 * voice/vision. It cannot load an arbitrary single GGUF — the vocab and the KV
 * cache layout are tokenizer/format-specific to Eliza-1.
 *
 * The discriminator is retained as a single-valued type so external importers
 * keep resolving; there is no longer a second runtime class to branch on.
 */
import type { CatalogModel, InstalledModel } from "./types.js";
/**
 * Which desktop text runtime a model is served by. The local stack is Eliza-1
 * only, so this is a single constant (`"fused-eliza1"`); the generic-GGUF
 * runtime class was removed with the multi-model machinery (#8808).
 */
export type RuntimeClass = "fused-eliza1";
/** Every catalog entry in the Eliza-1-only stack is served by the fused runtime. */
export declare function classifyCatalogModelRuntimeClass(_model: Pick<CatalogModel, "id" | "bundleManifestFile" | "runtimeRole">): RuntimeClass;
/** Every installed model in the Eliza-1-only stack is served by the fused runtime. */
export declare function classifyInstalledModelRuntimeClass(_model: Pick<InstalledModel, "id" | "bundleRoot" | "runtimeClass">): RuntimeClass;
/** Backfill `runtimeClass` on an installed-model entry that predates the field. */
export declare function withRuntimeClass(model: InstalledModel): InstalledModel;
//# sourceMappingURL=runtime-class.d.ts.map