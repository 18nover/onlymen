/**
 * Factory and type guards for {@link Memory} records: `createMessageMemory`
 * stamps a MESSAGE-metadata memory (scope derived from whether an `agentId` is
 * present), and the `is*Metadata` / `is*Memory` guards discriminate a record's
 * kind by its `MemoryType` tag so storage, embedding, and retrieval can branch
 * on it. `isCustomMetadata` is the catch-all for any type outside the four known
 * kinds. The types come from `./types` (`types/memory.ts`); this module holds
 * only the runtime helpers over them.
 */
import { type Content, type CustomMetadata, type DescriptionMetadata, type DocumentMetadata, type FragmentMetadata, type Memory, type MemoryMetadata, type MessageMemory, type MessageMetadata, type UUID } from "./types/index.js";
export declare function createMessageMemory(params: {
    id?: UUID;
    entityId: UUID;
    agentId?: UUID;
    roomId: UUID;
    content: Content & {
        text: string;
    };
    embedding?: number[];
}): MessageMemory;
export declare function isDocumentMetadata(metadata: MemoryMetadata): metadata is DocumentMetadata;
/**
 * Type guard to check if a memory metadata is a FragmentMetadata
 * @param metadata The metadata to check
 * @returns True if the metadata is a FragmentMetadata
 */
export declare function isFragmentMetadata(metadata: MemoryMetadata): metadata is FragmentMetadata;
export declare function isMessageMetadata(metadata: MemoryMetadata): metadata is MessageMetadata;
/**
 * Type guard to check if a memory metadata is a DescriptionMetadata
 * @param metadata The metadata to check
 * @returns True if the metadata is a DescriptionMetadata
 */
export declare function isDescriptionMetadata(metadata: MemoryMetadata): metadata is DescriptionMetadata;
export declare function isCustomMetadata(metadata: MemoryMetadata): metadata is CustomMetadata;
/**
 * Memory type guard for document memories
 */
export declare function isDocumentMemory(memory: Memory): memory is Memory & {
    metadata: DocumentMetadata;
};
/**
 * Memory type guard for fragment memories
 */
export declare function isFragmentMemory(memory: Memory): memory is Memory & {
    metadata: FragmentMetadata;
};
export declare function getMemoryText(memory: Memory, defaultValue?: string): string;
//# sourceMappingURL=memory.d.ts.map