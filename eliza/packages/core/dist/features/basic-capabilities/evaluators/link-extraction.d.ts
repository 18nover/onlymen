import { fetchWithSsrfGuard } from "../../../network/index.js";
import type { Evaluator } from "../../../types/index.js";
interface LinkRecord {
    url: string;
    title: string;
    summary: string;
}
interface LinkExtractionPrepared {
    links: LinkRecord[];
}
interface LinkExtractionOutput {
    processed: boolean;
}
/**
 * DNS + transport injection for the guarded preview fetch — the deterministic-test
 * seam. On a Node-like runtime `fetchWithSsrfGuard` defaults to the node-pinned
 * transport (its DNS-rebinding defense), which bypasses a stubbed `globalThis.fetch`
 * by design; tests therefore inject the pinned pair here to drive the REAL guard
 * over a deterministic wire rather than stubbing a fetch the guard never calls.
 * Undefined in production — the guard uses its node defaults.
 */
type LinkPreviewTransport = Pick<Parameters<typeof fetchWithSsrfGuard>[0], "fetchImpl" | "lookupFn" | "pinnedFetchImpl">;
/** Test seam — inject (or clear with `undefined`) the guarded preview transport. */
export declare function _setLinkPreviewTransportForTests(transport: LinkPreviewTransport | undefined): void;
export declare const linkExtractionEvaluator: Evaluator<LinkExtractionOutput, LinkExtractionPrepared>;
export {};
//# sourceMappingURL=link-extraction.d.ts.map