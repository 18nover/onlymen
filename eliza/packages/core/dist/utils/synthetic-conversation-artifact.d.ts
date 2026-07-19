/**
 * Detects whether a piece of text or a memory is a synthetic conversation
 * artifact — a compaction/summary/hybrid-ledger record the runtime generated —
 * rather than a genuine turn. The text form matches summary markers and
 * phrasing; the memory form also inspects `metadata.source` and `tags`. Used to
 * keep synthesized state out of paths that should only see real messages.
 */
import type { Memory } from "../types/memory.js";
export declare function isSyntheticConversationArtifactText(text: string): boolean;
export declare function isSyntheticConversationArtifactMemory(memory: Pick<Memory, "content" | "metadata">): boolean;
//# sourceMappingURL=synthetic-conversation-artifact.d.ts.map