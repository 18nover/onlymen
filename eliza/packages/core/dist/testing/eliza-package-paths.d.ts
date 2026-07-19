export declare function resolveModuleEntry(basePath: string): string;
export declare function getInstalledPackageRoot(packageName: string, fromDir?: string): string | undefined;
export declare function getInstalledPackageEntry(packageName: string, repoRoot: string, subpath?: "node"): string | undefined;
export declare function getInstalledPackageNamedExport<T>(packageName: string, exportName: string, repoRoot: string, subpath?: "node"): Promise<T>;
export declare function getElizaCoreEntry(repoRoot: string): string | undefined;
export declare function getAutonomousSourceRoot(repoRoot: string): string | undefined;
export declare function getAppCoreSourceRoot(repoRoot: string): string | undefined;
export declare function getSharedSourceRoot(repoRoot: string): string | undefined;
export declare function getUiSourceRoot(repoRoot: string): string | undefined;
//# sourceMappingURL=eliza-package-paths.d.ts.map