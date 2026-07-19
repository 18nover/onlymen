/**
 * Project registry persisted in `<stateDir>/projects.json`.
 *
 * A Project is a named, durable binding to a local working directory (and, when
 * known, its git remote/branch): the first-class replacement for the single
 * global workspace-folder config (`workspace-folder-config.ts`), which handled
 * only the degenerate one-project case and got overwritten on every re-pick.
 *
 * Storage is a JSON file rather than a DB table on purpose: workspace resolution
 * runs at module-import time (`workspace-resolution.ts`) before any DB exists,
 * and the Electrobun renderer writes the active project cross-process pre-boot.
 * A file in the shared per-user state dir is the only bridge both sides can see.
 * This mirrors `workspace-folder-config.ts` in shape and atomic-write style.
 *
 * `localPath` is the identity key for a project (realpath-compared against a
 * task's resolved workdir to bind it). `cloudAppId` binds the project to an
 * Eliza Cloud app: the orchestrator broker writes it here on an `apps.create`
 * success for a task on this project (#14119), and a later task reads it back to
 * update that app instead of minting a duplicate. The VFS `projectId`
 * (`virtual-filesystem.ts`) is a separate workbench-sandbox namespace and is
 * intentionally unrelated to a ProjectRecord id.
 */
export interface ProjectRecord {
    id: string;
    name: string;
    /** Realpath-resolved local working directory. The project's identity key. */
    localPath: string;
    repoUrl?: string;
    defaultBranch?: string;
    /**
     * elizaOS world this project's memory/knowledge is partitioned into, so a
     * subagent working project B never sees project A's injected context (#13776
     * design D3): a free partition in the existing memory schema, no column
     * change. Derived per-agent via core's `projectWorldId(agentId, id)` — the
     * single source of truth (#14171) — as `stringToUuid("project:<id>:<agentId>")`;
     * Worlds are agent-scoped (`World.agentId`), so two agents on the same project
     * get distinct worlds. Persisted so future project CRUD/UI can read it without
     * re-deriving; the orchestrator task bind seam stamps the same core derivation
     * onto each task.
     */
    worldId?: string;
    /** macOS security-scoped bookmark for the picked folder, when present. */
    bookmark?: string | null;
    /** The Eliza Cloud app this project owns, if any. Written back by the
     * orchestrator broker on an `apps.create` success for a task bound to this
     * project (#14119); read to update the existing app rather than duplicate it. */
    cloudAppId?: string;
    createdAt: string;
    lastOpenedAt: string;
}
/**
 * `stringToUuid` seed prefix for a project's memory world, mirroring
 * `PROJECT_WORLD_PREFIX` in `project-memory-scope.ts` where the canonical
 * derivation lives. Kept next to the record it stamps for documentation, but
 * the world itself is derived ONLY through core's per-agent
 * `projectWorldId(agentId, id)` (#14171) — `stringToUuid("project:<id>:<agentId>")`
 * — never `stringToUuid(prefix + id)` alone, which would drop the agent scope
 * and reintroduce the cross-agent collision #14171 fixed.
 */
export declare const PROJECT_WORLD_ID_PREFIX = "project:";
export interface ProjectRegistry {
    version: 1;
    activeProjectId: string | null;
    projects: ProjectRecord[];
}
export declare function projectRegistryPath(env?: NodeJS.ProcessEnv): string;
/**
 * Read the registry, returning `null` when absent or malformed. When no
 * `projects.json` exists but a legacy `workspace-folder.json` does, synthesize a
 * single in-memory active project from it so callers migrating off the old
 * single-folder config keep working — WITHOUT writing the file (a write on read
 * would race the renderer and mint an id the renderer never chose).
 */
export declare function readProjectRegistry(env?: NodeJS.ProcessEnv): ProjectRegistry | null;
/**
 * Atomic write: same tmp-file-then-rename pattern as workspace-folder-config.
 *
 * Cross-process read-modify-write of `projects.json` is unlocked — atomic rename
 * prevents torn writes, not interleaved updates from the agent runtime and the
 * desktop picker racing. This is the accepted precedent from
 * `workspace-folder-config.ts`: the registry is low-write (a folder pick, a task
 * bind) and last-writer-wins is tolerable for a per-user config.
 *
 * Refuses to overwrite a present, newer-schema file: when `projects.json`
 * carries a `version` greater than the one being written, the on-disk data
 * belongs to a build the current process cannot represent, so replacing it with
 * a downgraded `version: 1` snapshot would silently drop the user's projects.
 * Throwing surfaces the mismatch instead of clobbering forward-compat state.
 */
export declare function writeProjectRegistry(registry: ProjectRegistry, env?: NodeJS.ProcessEnv): ProjectRegistry;
/**
 * Insert or update a project keyed by `localPath` identity, persist, and return
 * the upserted record. An existing project's id/createdAt are preserved; the
 * caller's other fields overwrite. Does NOT change the active project — call
 * {@link setActiveProject} for that.
 */
export declare function upsertProject(input: Omit<ProjectRecord, "id" | "createdAt" | "lastOpenedAt"> & Partial<Pick<ProjectRecord, "id" | "createdAt" | "lastOpenedAt">>, env?: NodeJS.ProcessEnv): ProjectRecord;
/**
 * Mark a project active and stamp its `lastOpenedAt`. Returns the active record,
 * or `null` when the id is unknown (the registry is left unchanged).
 */
export declare function setActiveProject(projectId: string, env?: NodeJS.ProcessEnv): ProjectRecord | null;
/** The active project, or `null` when the registry is absent/has no active id. */
export declare function getActiveProject(env?: NodeJS.ProcessEnv): ProjectRecord | null;
/** Look up a project by id, or `null` when absent. */
export declare function getProjectById(projectId: string, env?: NodeJS.ProcessEnv): ProjectRecord | null;
//# sourceMappingURL=project-registry.d.ts.map