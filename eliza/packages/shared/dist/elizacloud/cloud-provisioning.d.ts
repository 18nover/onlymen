/**
 * Pure env-var detector for platform-managed cloud containers. Lives in
 * `@elizaos/shared` so that `@elizaos/agent` (and other host-layer code) can
 * make this decision without dynamically importing `@elizaos/plugin-elizacloud`
 * at module scope — that pattern previously forced the cloud plugin to load
 * during container boot.
 */
export declare function isCloudProvisionedContainer(): boolean;
//# sourceMappingURL=cloud-provisioning.d.ts.map