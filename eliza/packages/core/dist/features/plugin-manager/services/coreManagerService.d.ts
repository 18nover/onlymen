import type { IAgentRuntime } from "../../../types/runtime.js";
import type { ServiceTypeName } from "../../../types/service.js";
import { Service } from "../../../types/service.js";
export interface UpstreamMetadata {
    $schema: "eliza-upstream-v1";
    source: string;
    gitUrl: string;
    branch: string;
    commitHash: string;
    ejectedAt: string;
    npmPackage: string;
    npmVersion: string;
    lastSyncAt: string | null;
    localCommits: number;
}
export interface CoreEjectResult {
    success: boolean;
    ejectedPath: string;
    upstreamCommit: string;
    error?: string;
}
export interface CoreSyncResult {
    success: boolean;
    ejectedPath: string;
    upstreamCommits: number;
    localChanges: boolean;
    conflicts: string[];
    commitHash: string;
    error?: string;
}
export interface CoreReinjectResult {
    success: boolean;
    removedPath: string;
    error?: string;
}
export interface CoreStatus {
    ejected: boolean;
    ejectedPath: string;
    monorepoPath: string;
    corePackagePath: string;
    coreDistPath: string;
    version: string;
    npmVersion: string;
    commitHash: string | null;
    localChanges: boolean;
    upstream: UpstreamMetadata | null;
}
export declare class CoreManagerService extends Service {
    static serviceType: ServiceTypeName;
    capabilityDescription: string;
    private ejectLock;
    static start(runtime: IAgentRuntime): Promise<CoreManagerService>;
    stop(): Promise<void>;
    private serialise;
    private coreBaseDir;
    private coreMonorepoDir;
    private corePackageDir;
    private coreDistDir;
    private upstreamFilePath;
    private tsconfigFilePath;
    private isWithinEjectedCoreDir;
    private gitStdout;
    private readCorePackageVersion;
    private resolveInstalledCoreVersion;
    private readUpstreamMetadata;
    private writeUpstreamMetadata;
    private readTsconfig;
    private writeTsconfigCorePaths;
    private runCoreInstallAndBuild;
    private ensureEjectedCoreExists;
    ejectCore(): Promise<CoreEjectResult>;
    syncCore(): Promise<CoreSyncResult>;
    reinjectCore(): Promise<CoreReinjectResult>;
    getCoreStatus(): Promise<CoreStatus>;
}
//# sourceMappingURL=coreManagerService.d.ts.map