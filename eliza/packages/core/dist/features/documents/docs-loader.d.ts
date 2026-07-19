import type { UUID } from "../../types/index.js";
import type { AddDocumentOptions, DocumentAddedByRole, DocumentAddedFrom, DocumentVisibilityScope } from "./types.js";
/** Minimal interface of DocumentService used by this module, avoids circular import with service.ts. */
interface DocumentServiceLike {
    addDocument(options: AddDocumentOptions): Promise<{
        clientDocumentId: string;
        storedDocumentMemoryId: UUID;
        fragmentCount: number;
    }>;
}
export declare function getDocumentsPath(runtimePath?: string): string;
export declare function loadDocumentsFromPath(service: DocumentServiceLike, agentId: UUID, worldId?: UUID, documentsPath?: string, options?: {
    roomId?: UUID;
    entityId?: UUID;
    scope?: DocumentVisibilityScope;
    scopedToEntityId?: UUID;
    addedBy?: UUID;
    addedByRole?: DocumentAddedByRole;
    addedFrom?: DocumentAddedFrom;
    metadata?: Record<string, unknown>;
}): Promise<{
    total: number;
    successful: number;
    failed: number;
}>;
export declare function addDocumentFromFilePath({ service, agentId, worldId, roomId, entityId, filePath, scope, scopedToEntityId, addedBy, addedByRole, addedFrom, metadata, }: {
    service: DocumentServiceLike;
    agentId: UUID;
    worldId?: UUID;
    roomId?: UUID;
    entityId?: UUID;
    filePath: string;
    scope?: DocumentVisibilityScope;
    scopedToEntityId?: UUID;
    addedBy?: UUID;
    addedByRole?: DocumentAddedByRole;
    addedFrom?: DocumentAddedFrom;
    metadata?: Record<string, unknown>;
}): Promise<{
    clientDocumentId: string;
    storedDocumentMemoryId: UUID;
    fragmentCount: number;
}>;
export declare function getDocumentFileContentType(extension: string): string | null;
export {};
//# sourceMappingURL=docs-loader.d.ts.map