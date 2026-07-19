export interface ElizaPathsConfig {
    dataDir: string;
    databaseDir: string;
    charactersDir: string;
    generatedDir: string;
    uploadsAgentsDir: string;
    uploadsChannelsDir: string;
}
declare class ElizaPaths {
    private cache;
    getDataDir(): string;
    getDatabaseDir(): string;
    getCharactersDir(): string;
    getGeneratedDir(): string;
    getUploadsAgentsDir(): string;
    getUploadsChannelsDir(): string;
    getAllPaths(): ElizaPathsConfig;
    clearCache(): void;
    private getPath;
}
export declare function getElizaPaths(): ElizaPaths;
export declare function getDataDir(): string;
export declare function getDatabaseDir(): string;
export declare function getCharactersDir(): string;
export declare function getGeneratedDir(): string;
export declare function getUploadsAgentsDir(): string;
export declare function getUploadsChannelsDir(): string;
export declare function getAllElizaPaths(): ElizaPathsConfig;
export declare function resetPaths(): void;
export {};
//# sourceMappingURL=paths.d.ts.map