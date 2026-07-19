/**
 * Zod schemas for the workbench todos HTTP write surface.
 *
 * Routes covered:
 *   POST /api/workbench/todos              (create)
 *   POST /api/workbench/todos/:id/complete
 *   PUT  /api/workbench/todos/:id          (update)
 *
 * GET and DELETE variants take no body.
 */
import z from "zod";
declare const WorkbenchTodoPrioritySchema: z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodNull]>;
export declare const PostWorkbenchTodoRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodNull]>>;
    isUrgent: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodString>;
    isCompleted: z.ZodOptional<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>, z.ZodTransform<{
    name: string;
    description?: string | undefined;
    priority?: string | number | null | undefined;
    isUrgent?: boolean | undefined;
    type?: string | undefined;
    isCompleted?: boolean | undefined;
    tags?: string[] | undefined;
}, {
    name: string;
    description?: string | undefined;
    priority?: string | number | null | undefined;
    isUrgent?: boolean | undefined;
    type?: string | undefined;
    isCompleted?: boolean | undefined;
    tags?: string[] | undefined;
}>>;
export declare const PostWorkbenchTodoCompleteRequestSchema: z.ZodObject<{
    isCompleted: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const PutWorkbenchTodoRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString, z.ZodNull]>>;
    isUrgent: z.ZodOptional<z.ZodBoolean>;
    type: z.ZodOptional<z.ZodString>;
    isCompleted: z.ZodOptional<z.ZodBoolean>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
export type PostWorkbenchTodoRequest = z.infer<typeof PostWorkbenchTodoRequestSchema>;
export type PostWorkbenchTodoCompleteRequest = z.infer<typeof PostWorkbenchTodoCompleteRequestSchema>;
export type PutWorkbenchTodoRequest = z.infer<typeof PutWorkbenchTodoRequestSchema>;
export type WorkbenchTodoPriority = z.infer<typeof WorkbenchTodoPrioritySchema>;
export declare const PostWorkbenchVfsProjectRequestSchema: z.ZodPipe<z.ZodObject<{
    projectId: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    projectId: string;
}, {
    projectId: string;
}>>;
export declare const PutWorkbenchVfsFileRequestSchema: z.ZodPipe<z.ZodObject<{
    path: z.ZodString;
    content: z.ZodString;
    encoding: z.ZodOptional<z.ZodEnum<{
        "utf-8": "utf-8";
        base64: "base64";
    }>>;
}, z.core.$strict>, z.ZodTransform<{
    path: string;
    content: string;
    encoding?: "utf-8" | "base64" | undefined;
}, {
    path: string;
    content: string;
    encoding?: "utf-8" | "base64" | undefined;
}>>;
export declare const PostWorkbenchVfsSnapshotRequestSchema: z.ZodObject<{
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PostWorkbenchVfsRollbackRequestSchema: z.ZodPipe<z.ZodObject<{
    snapshotId: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    snapshotId: string;
}, {
    snapshotId: string;
}>>;
export declare const PostWorkbenchVfsCompilePluginRequestSchema: z.ZodPipe<z.ZodObject<{
    entry: z.ZodString;
    outFile: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodEnum<{
        esm: "esm";
        cjs: "cjs";
    }>>;
    target: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    target?: string | undefined;
    outFile?: string | undefined;
    entry: string;
    format?: "esm" | "cjs" | undefined;
}, {
    entry: string;
    outFile?: string | undefined;
    format?: "esm" | "cjs" | undefined;
    target?: string | undefined;
}>>;
export declare const PostWorkbenchVfsLoadPluginRequestSchema: z.ZodPipe<z.ZodObject<{
    entry: z.ZodString;
    outFile: z.ZodOptional<z.ZodString>;
    compileFirst: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodTransform<{
    outFile?: string | undefined;
    entry: string;
    compileFirst?: boolean | undefined;
}, {
    entry: string;
    outFile?: string | undefined;
    compileFirst?: boolean | undefined;
}>>;
export declare const PostWorkbenchVfsPromoteToCloudRequestSchema: z.ZodPipe<z.ZodObject<{
    snapshotId: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    preferredAgent: z.ZodOptional<z.ZodEnum<{
        claude: "claude";
        codex: "codex";
        opencode: "opencode";
        elizaos: "elizaos";
    }>>;
    workspacePath: z.ZodOptional<z.ZodString>;
    branchName: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strict>, z.ZodTransform<{
    branchName?: string | undefined;
    workspacePath?: string | undefined;
    snapshotId?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    preferredAgent?: "claude" | "codex" | "opencode" | "elizaos" | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    snapshotId?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    preferredAgent?: "claude" | "codex" | "opencode" | "elizaos" | undefined;
    workspacePath?: string | undefined;
    branchName?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>>;
export declare const PostWorkbenchVfsGitRequestSchema: z.ZodPipe<z.ZodObject<{
    action: z.ZodEnum<{
        status: "status";
        push: "push";
        fetch: "fetch";
        pull: "pull";
        init: "init";
        clone: "clone";
        add: "add";
        remove: "remove";
        commit: "commit";
        log: "log";
        branch: "branch";
        checkout: "checkout";
    }>;
    url: z.ZodOptional<z.ZodString>;
    remote: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    ref: z.ZodOptional<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
    authorName: z.ZodOptional<z.ZodString>;
    authorEmail: z.ZodOptional<z.ZodString>;
    paths: z.ZodOptional<z.ZodArray<z.ZodString>>;
    filepath: z.ZodOptional<z.ZodString>;
    defaultBranch: z.ZodOptional<z.ZodString>;
    singleBranch: z.ZodOptional<z.ZodBoolean>;
    depth: z.ZodOptional<z.ZodNumber>;
    force: z.ZodOptional<z.ZodBoolean>;
    auth: z.ZodOptional<z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        token: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>, z.ZodTransform<{
    auth?: {
        username?: string | undefined;
        password?: string | undefined;
        token?: string | undefined;
    } | undefined;
    paths?: string[] | undefined;
    defaultBranch?: string | undefined;
    filepath?: string | undefined;
    authorEmail?: string | undefined;
    authorName?: string | undefined;
    message?: string | undefined;
    ref?: string | undefined;
    branch?: string | undefined;
    remote?: string | undefined;
    url?: string | undefined;
    action: "status" | "push" | "fetch" | "pull" | "init" | "clone" | "add" | "remove" | "commit" | "log" | "branch" | "checkout";
    singleBranch?: boolean | undefined;
    depth?: number | undefined;
    force?: boolean | undefined;
}, {
    action: "status" | "push" | "fetch" | "pull" | "init" | "clone" | "add" | "remove" | "commit" | "log" | "branch" | "checkout";
    url?: string | undefined;
    remote?: string | undefined;
    branch?: string | undefined;
    ref?: string | undefined;
    message?: string | undefined;
    authorName?: string | undefined;
    authorEmail?: string | undefined;
    paths?: string[] | undefined;
    filepath?: string | undefined;
    defaultBranch?: string | undefined;
    singleBranch?: boolean | undefined;
    depth?: number | undefined;
    force?: boolean | undefined;
    auth?: {
        username?: string | undefined;
        password?: string | undefined;
        token?: string | undefined;
    } | undefined;
}>>;
export type PostWorkbenchVfsProjectRequest = z.infer<typeof PostWorkbenchVfsProjectRequestSchema>;
export type PutWorkbenchVfsFileRequest = z.infer<typeof PutWorkbenchVfsFileRequestSchema>;
export type PostWorkbenchVfsSnapshotRequest = z.infer<typeof PostWorkbenchVfsSnapshotRequestSchema>;
export type PostWorkbenchVfsRollbackRequest = z.infer<typeof PostWorkbenchVfsRollbackRequestSchema>;
export type PostWorkbenchVfsCompilePluginRequest = z.infer<typeof PostWorkbenchVfsCompilePluginRequestSchema>;
export type PostWorkbenchVfsLoadPluginRequest = z.infer<typeof PostWorkbenchVfsLoadPluginRequestSchema>;
export type PostWorkbenchVfsPromoteToCloudRequest = z.infer<typeof PostWorkbenchVfsPromoteToCloudRequestSchema>;
export type PostWorkbenchVfsGitRequest = z.infer<typeof PostWorkbenchVfsGitRequestSchema>;
export {};
//# sourceMappingURL=workbench-routes.d.ts.map