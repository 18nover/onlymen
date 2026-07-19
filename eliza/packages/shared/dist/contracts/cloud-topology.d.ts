export type ElizaCloudService = "inference" | "tts" | "media" | "embeddings" | "rpc";
export type ResolvedElizaCloudTopology = {
    linked: boolean;
    provider: "elizacloud" | null;
    runtime: "cloud" | "local";
    services: Record<ElizaCloudService, boolean>;
    shouldLoadPlugin: boolean;
};
export declare function isElizaCloudLinkedInConfig(config: Record<string, unknown> | null | undefined): boolean;
export declare function resolveElizaCloudTopology(config: Record<string, unknown> | null | undefined): ResolvedElizaCloudTopology;
export declare function isElizaCloudServiceSelectedInConfig(config: Record<string, unknown> | null | undefined, service: ElizaCloudService): boolean;
export declare function shouldLoadElizaCloudPluginInConfig(config: Record<string, unknown> | null | undefined): boolean;
//# sourceMappingURL=cloud-topology.d.ts.map