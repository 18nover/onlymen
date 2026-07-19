/**
 * Workspace-folder config persisted in `<stateDir>/workspace-folder.json`.
 *
 * Bridges the Electrobun renderer (writes after a successful workspace-folder
 * pick or bookmark resolve) and the agent runtime (reads at boot to seed
 * `ELIZA_WORKSPACE_DIR`). Both sides run as separate processes and can't
 * see each other's in-memory state, so a JSON file in the shared per-user
 * state dir is the cheapest reliable bridge.
 *
 * The renderer also keeps its own localStorage copy (see
 * `packages/ui/src/storage/workspace-folder.ts`) for renderer UX (button
 * enablement, re-prompt logic). That copy is renderer-only; this JSON file
 * is what crosses the process boundary.
 */
export interface WorkspaceFolderConfig {
    path: string;
    bookmark: string | null;
    updatedAt: string;
}
export declare function workspaceFolderConfigPath(env?: NodeJS.ProcessEnv): string;
export declare function readWorkspaceFolderConfig(env?: NodeJS.ProcessEnv): WorkspaceFolderConfig | null;
export declare function writeWorkspaceFolderConfig(value: Omit<WorkspaceFolderConfig, "updatedAt">, env?: NodeJS.ProcessEnv): WorkspaceFolderConfig;
export declare function clearWorkspaceFolderConfig(env?: NodeJS.ProcessEnv): void;
//# sourceMappingURL=workspace-folder-config.d.ts.map