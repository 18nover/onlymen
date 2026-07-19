/**
 * Merge streaming text updates that may arrive as pure deltas, cumulative
 * snapshots, or overlapping suffix/prefix fragments.
 */
/**
 * Wire protocol a chat client advertises in the stream POST body to opt into
 * delta framing (deltas + geometric snapshots instead of a full-text snapshot
 * per token). The server only switches framing when this exact literal is
 * present, so old servers ignore the unknown field and old clients keep the
 * legacy per-token `fullText`. Single source of truth for both the agent SSE
 * writer (`@elizaos/agent` chat-routes) and the UI stream client.
 */
export declare const DELTA_STREAM_PROTOCOL: "delta-v2";
export type DeltaStreamProtocol = typeof DELTA_STREAM_PROTOCOL;
export declare function mergeStreamingText(existing: string, incoming: string): string;
export declare function computeStreamingDelta(existing: string, incoming: string): string;
export type StreamingUpdateResult = {
    kind: "append" | "replace" | "unchanged";
    nextText: string;
    emittedText: string;
};
export declare function resolveStreamingUpdate(existing: string, incoming: string): StreamingUpdateResult;
//# sourceMappingURL=streaming-text.d.ts.map