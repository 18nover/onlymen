/**
 * Normalizes an AI-SDK v5 `GenerateTextResult` (or a bare string) into the plain
 * assistant text the runtime persists and renders. Prefers a non-empty top-level
 * `text`, then the concatenation of `text`/`output_text` content parts, then the
 * `response` field, and finally falls back to the raw `text` or a JSON dump so a
 * caller never receives `undefined` even when no readable text is present.
 */
import type { GenerateTextResult } from "../../types/model.js";
export declare function getV5ModelText(raw: string | GenerateTextResult): string;
export declare function extractGenerateTextContentText(raw: GenerateTextResult): string;
//# sourceMappingURL=generate-text-result.d.ts.map