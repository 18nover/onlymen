/**
 * API contract for Cloud coding-container requests: the container service type
 * and the schema of coding agents a request may select (claude/codex/opencode/
 * elizaos). Shared so the Cloud API and its callers validate the same enum.
 */
import z from "zod";
export declare const CLOUD_CONTAINER_SERVICE_TYPE = "CLOUD_CONTAINER";
export declare const CloudCodingAgentSchema: z.ZodEnum<{
    claude: "claude";
    codex: "codex";
    opencode: "opencode";
    elizaos: "elizaos";
}>;
export declare const CloudCodingContainerStatusSchema: z.ZodEnum<{
    requested: "requested";
    pending: "pending";
    building: "building";
    running: "running";
    failed: "failed";
    stopped: "stopped";
}>;
export declare const CloudContainerArchitectureSchema: z.ZodEnum<{
    arm64: "arm64";
    x86_64: "x86_64";
}>;
export declare const CloudVfsSourceKindSchema: z.ZodEnum<{
    workspace: "workspace";
    project: "project";
}>;
export declare const CloudVfsFileEncodingSchema: z.ZodEnum<{
    "utf-8": "utf-8";
    base64: "base64";
}>;
export declare const CloudCodingSyncDirectionSchema: z.ZodEnum<{
    push: "push";
    pull: "pull";
    roundtrip: "roundtrip";
}>;
export declare const CloudCodingPatchFormatSchema: z.ZodEnum<{
    "unified-diff": "unified-diff";
    "json-patch": "json-patch";
}>;
export declare const CloudVfsFileSchema: z.ZodPipe<z.ZodObject<{
    path: z.ZodString;
    contents: z.ZodOptional<z.ZodString>;
    encoding: z.ZodOptional<z.ZodEnum<{
        "utf-8": "utf-8";
        base64: "base64";
    }>>;
    size: z.ZodOptional<z.ZodNumber>;
    sha256: z.ZodOptional<z.ZodString>;
    mode: z.ZodOptional<z.ZodString>;
    mtimeMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>, z.ZodTransform<{
    path: string;
    contents?: string | undefined;
    encoding?: "utf-8" | "base64" | undefined;
    size?: number | undefined;
    sha256?: string | undefined;
    mode?: string | undefined;
    mtimeMs?: number | undefined;
}, {
    path: string;
    contents?: string | undefined;
    encoding?: "utf-8" | "base64" | undefined;
    size?: number | undefined;
    sha256?: string | undefined;
    mode?: string | undefined;
    mtimeMs?: number | undefined;
}>>;
export declare const CloudVfsDeletedFileSchema: z.ZodPipe<z.ZodObject<{
    path: z.ZodString;
    sha256: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    path: string;
    sha256?: string | undefined;
}, {
    path: string;
    sha256?: string | undefined;
}>>;
export declare const CloudVfsBundleSchema: z.ZodObject<{
    sourceKind: z.ZodEnum<{
        workspace: "workspace";
        project: "project";
    }>;
    projectId: z.ZodOptional<z.ZodString>;
    workspaceId: z.ZodOptional<z.ZodString>;
    rootPath: z.ZodOptional<z.ZodString>;
    snapshotId: z.ZodOptional<z.ZodString>;
    revision: z.ZodOptional<z.ZodString>;
    files: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
        path: z.ZodString;
        contents: z.ZodOptional<z.ZodString>;
        encoding: z.ZodOptional<z.ZodEnum<{
            "utf-8": "utf-8";
            base64: "base64";
        }>>;
        size: z.ZodOptional<z.ZodNumber>;
        sha256: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodString>;
        mtimeMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodTransform<{
        path: string;
        contents?: string | undefined;
        encoding?: "utf-8" | "base64" | undefined;
        size?: number | undefined;
        sha256?: string | undefined;
        mode?: string | undefined;
        mtimeMs?: number | undefined;
    }, {
        path: string;
        contents?: string | undefined;
        encoding?: "utf-8" | "base64" | undefined;
        size?: number | undefined;
        sha256?: string | undefined;
        mode?: string | undefined;
        mtimeMs?: number | undefined;
    }>>>>;
    deletedFiles: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
        path: z.ZodString;
        sha256: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodTransform<{
        path: string;
        sha256?: string | undefined;
    }, {
        path: string;
        sha256?: string | undefined;
    }>>>>;
    manifest: z.ZodOptional<z.ZodObject<{
        fileCount: z.ZodOptional<z.ZodNumber>;
        totalBytes: z.ZodOptional<z.ZodNumber>;
        ignoredPaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strict>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export declare const PromoteVfsToCloudContainerRequestSchema: z.ZodObject<{
    source: z.ZodObject<{
        sourceKind: z.ZodEnum<{
            workspace: "workspace";
            project: "project";
        }>;
        projectId: z.ZodOptional<z.ZodString>;
        workspaceId: z.ZodOptional<z.ZodString>;
        rootPath: z.ZodOptional<z.ZodString>;
        snapshotId: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
            path: z.ZodString;
            contents: z.ZodOptional<z.ZodString>;
            encoding: z.ZodOptional<z.ZodEnum<{
                "utf-8": "utf-8";
                base64: "base64";
            }>>;
            size: z.ZodOptional<z.ZodNumber>;
            sha256: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodString>;
            mtimeMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodTransform<{
            path: string;
            contents?: string | undefined;
            encoding?: "utf-8" | "base64" | undefined;
            size?: number | undefined;
            sha256?: string | undefined;
            mode?: string | undefined;
            mtimeMs?: number | undefined;
        }, {
            path: string;
            contents?: string | undefined;
            encoding?: "utf-8" | "base64" | undefined;
            size?: number | undefined;
            sha256?: string | undefined;
            mode?: string | undefined;
            mtimeMs?: number | undefined;
        }>>>>;
        deletedFiles: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
            path: z.ZodString;
            sha256: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodTransform<{
            path: string;
            sha256?: string | undefined;
        }, {
            path: string;
            sha256?: string | undefined;
        }>>>>;
        manifest: z.ZodOptional<z.ZodObject<{
            fileCount: z.ZodOptional<z.ZodNumber>;
            totalBytes: z.ZodOptional<z.ZodNumber>;
            ignoredPaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    preferredAgent: z.ZodOptional<z.ZodEnum<{
        claude: "claude";
        codex: "codex";
        opencode: "opencode";
        elizaos: "elizaos";
    }>>;
    target: z.ZodOptional<z.ZodObject<{
        containerId: z.ZodOptional<z.ZodString>;
        workspacePath: z.ZodOptional<z.ZodString>;
        branchName: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export declare const RequestCodingAgentContainerRequestSchema: z.ZodObject<{
    agent: z.ZodDefault<z.ZodEnum<{
        claude: "claude";
        codex: "codex";
        opencode: "opencode";
        elizaos: "elizaos";
    }>>;
    promotionId: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodObject<{
        sourceKind: z.ZodEnum<{
            workspace: "workspace";
            project: "project";
        }>;
        projectId: z.ZodOptional<z.ZodString>;
        workspaceId: z.ZodOptional<z.ZodString>;
        rootPath: z.ZodOptional<z.ZodString>;
        snapshotId: z.ZodOptional<z.ZodString>;
        revision: z.ZodOptional<z.ZodString>;
        files: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
            path: z.ZodString;
            contents: z.ZodOptional<z.ZodString>;
            encoding: z.ZodOptional<z.ZodEnum<{
                "utf-8": "utf-8";
                base64: "base64";
            }>>;
            size: z.ZodOptional<z.ZodNumber>;
            sha256: z.ZodOptional<z.ZodString>;
            mode: z.ZodOptional<z.ZodString>;
            mtimeMs: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strict>, z.ZodTransform<{
            path: string;
            contents?: string | undefined;
            encoding?: "utf-8" | "base64" | undefined;
            size?: number | undefined;
            sha256?: string | undefined;
            mode?: string | undefined;
            mtimeMs?: number | undefined;
        }, {
            path: string;
            contents?: string | undefined;
            encoding?: "utf-8" | "base64" | undefined;
            size?: number | undefined;
            sha256?: string | undefined;
            mode?: string | undefined;
            mtimeMs?: number | undefined;
        }>>>>;
        deletedFiles: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
            path: z.ZodString;
            sha256: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>, z.ZodTransform<{
            path: string;
            sha256?: string | undefined;
        }, {
            path: string;
            sha256?: string | undefined;
        }>>>>;
        manifest: z.ZodOptional<z.ZodObject<{
            fileCount: z.ZodOptional<z.ZodNumber>;
            totalBytes: z.ZodOptional<z.ZodNumber>;
            ignoredPaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
        }, z.core.$strict>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strict>>;
    prompt: z.ZodOptional<z.ZodString>;
    container: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        image: z.ZodOptional<z.ZodString>;
        environmentVars: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strict>>;
    workspacePath: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export declare const CloudCodingPatchSchema: z.ZodPipe<z.ZodObject<{
    path: z.ZodString;
    format: z.ZodEnum<{
        "unified-diff": "unified-diff";
        "json-patch": "json-patch";
    }>;
    patch: z.ZodString;
    baseSha256: z.ZodOptional<z.ZodString>;
    afterSha256: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    path: string;
    format: "unified-diff" | "json-patch";
    patch: string;
    baseSha256?: string | undefined;
    afterSha256?: string | undefined;
}, {
    path: string;
    format: "unified-diff" | "json-patch";
    patch: string;
    baseSha256?: string | undefined;
    afterSha256?: string | undefined;
}>>;
export declare const SyncCloudCodingContainerRequestSchema: z.ZodObject<{
    direction: z.ZodOptional<z.ZodEnum<{
        push: "push";
        pull: "pull";
        roundtrip: "roundtrip";
    }>>;
    target: z.ZodObject<{
        sourceKind: z.ZodEnum<{
            workspace: "workspace";
            project: "project";
        }>;
        projectId: z.ZodOptional<z.ZodString>;
        workspaceId: z.ZodOptional<z.ZodString>;
        baseRevision: z.ZodOptional<z.ZodString>;
        targetRevision: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>;
    changedFiles: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
        path: z.ZodString;
        contents: z.ZodOptional<z.ZodString>;
        encoding: z.ZodOptional<z.ZodEnum<{
            "utf-8": "utf-8";
            base64: "base64";
        }>>;
        size: z.ZodOptional<z.ZodNumber>;
        sha256: z.ZodOptional<z.ZodString>;
        mode: z.ZodOptional<z.ZodString>;
        mtimeMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>, z.ZodTransform<{
        path: string;
        contents?: string | undefined;
        encoding?: "utf-8" | "base64" | undefined;
        size?: number | undefined;
        sha256?: string | undefined;
        mode?: string | undefined;
        mtimeMs?: number | undefined;
    }, {
        path: string;
        contents?: string | undefined;
        encoding?: "utf-8" | "base64" | undefined;
        size?: number | undefined;
        sha256?: string | undefined;
        mode?: string | undefined;
        mtimeMs?: number | undefined;
    }>>>>;
    deletedFiles: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
        path: z.ZodString;
        sha256: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodTransform<{
        path: string;
        sha256?: string | undefined;
    }, {
        path: string;
        sha256?: string | undefined;
    }>>>>;
    patches: z.ZodOptional<z.ZodArray<z.ZodPipe<z.ZodObject<{
        path: z.ZodString;
        format: z.ZodEnum<{
            "unified-diff": "unified-diff";
            "json-patch": "json-patch";
        }>;
        patch: z.ZodString;
        baseSha256: z.ZodOptional<z.ZodString>;
        afterSha256: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodTransform<{
        path: string;
        format: "unified-diff" | "json-patch";
        patch: string;
        baseSha256?: string | undefined;
        afterSha256?: string | undefined;
    }, {
        path: string;
        format: "unified-diff" | "json-patch";
        patch: string;
        baseSha256?: string | undefined;
        afterSha256?: string | undefined;
    }>>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>;
export type CloudCodingAgent = z.infer<typeof CloudCodingAgentSchema>;
export type CloudCodingContainerStatus = z.infer<typeof CloudCodingContainerStatusSchema>;
export type CloudContainerArchitecture = z.infer<typeof CloudContainerArchitectureSchema>;
export type CloudVfsSourceKind = z.infer<typeof CloudVfsSourceKindSchema>;
export type CloudVfsFileEncoding = z.infer<typeof CloudVfsFileEncodingSchema>;
export type CloudVfsFile = z.infer<typeof CloudVfsFileSchema>;
export type CloudVfsDeletedFile = z.infer<typeof CloudVfsDeletedFileSchema>;
export type CloudVfsBundle = z.infer<typeof CloudVfsBundleSchema>;
export type PromoteVfsToCloudContainerRequest = z.infer<typeof PromoteVfsToCloudContainerRequestSchema>;
export type RequestCodingAgentContainerRequest = z.infer<typeof RequestCodingAgentContainerRequestSchema>;
export type CloudCodingSyncDirection = z.infer<typeof CloudCodingSyncDirectionSchema>;
export type CloudCodingPatchFormat = z.infer<typeof CloudCodingPatchFormatSchema>;
export type CloudCodingPatch = z.infer<typeof CloudCodingPatchSchema>;
export type SyncCloudCodingContainerRequest = z.infer<typeof SyncCloudCodingContainerRequestSchema>;
export interface CloudCodingPromotion {
    promotionId: string;
    status: "accepted" | "uploaded";
    source: CloudVfsBundle;
    workspacePath: string;
    uploadUrl?: string;
    expiresAt?: string | null;
    createdAt: string;
    metadata?: Record<string, unknown>;
}
export interface PromoteVfsToCloudContainerResponse {
    success: boolean;
    data: CloudCodingPromotion;
    message?: string;
}
export interface CloudCodingContainerSession {
    containerId: string;
    status: CloudCodingContainerStatus;
    agent: CloudCodingAgent;
    promotionId?: string;
    workspacePath: string;
    url?: string | null;
    branchName?: string;
    createdAt: string;
    metadata?: Record<string, unknown>;
}
export interface RequestCodingAgentContainerResponse {
    success: boolean;
    data: CloudCodingContainerSession;
    message?: string;
}
export interface CloudCodingSyncResult {
    syncId: string;
    containerId: string;
    status: "accepted" | "applied" | "ready";
    direction: CloudCodingSyncDirection;
    target: SyncCloudCodingContainerRequest["target"];
    changedFiles: CloudVfsFile[];
    deletedFiles: CloudVfsDeletedFile[];
    patches: CloudCodingPatch[];
    createdAt: string;
    metadata?: Record<string, unknown>;
}
export interface SyncCloudCodingContainerResponse {
    success: boolean;
    data: CloudCodingSyncResult;
    message?: string;
}
export interface CloudCodingContainerService {
    promoteVfsToCloudContainer(request: PromoteVfsToCloudContainerRequest): Promise<PromoteVfsToCloudContainerResponse>;
    requestCodingAgentContainer(request: RequestCodingAgentContainerRequest): Promise<RequestCodingAgentContainerResponse>;
    syncCodingContainerChanges(containerId: string, request: SyncCloudCodingContainerRequest): Promise<SyncCloudCodingContainerResponse>;
}
//# sourceMappingURL=cloud-coding-containers.d.ts.map