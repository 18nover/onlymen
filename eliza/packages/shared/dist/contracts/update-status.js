/**
 * Contract for agent self-update status: release channels, install method, and
 * the zod schemas that validate update-check responses. Shared so the updater
 * and the settings UI agree on channels and how the agent was installed.
 */
import z from "zod";
export const ReleaseChannelSchema = z.enum(["stable", "beta", "nightly"]);
export const AgentInstallMethodSchema = z.enum([
    "npm-global",
    "bun-global",
    "homebrew",
    "snap",
    "apt",
    "flatpak",
    "local-dev",
    "unknown",
]);
export const AgentUpdateAuthoritySchema = z.enum([
    "package-manager",
    "os-package-manager",
    "developer",
    "operator",
]);
export const AgentUpdateNextActionSchema = z.enum([
    "run-package-manager-command",
    "run-git-pull",
    "review-installation",
    "none",
]);
export const AgentUpdateStatusSchema = z
    .object({
    currentVersion: z.string(),
    channel: ReleaseChannelSchema,
    installMethod: AgentInstallMethodSchema.or(z.string()),
    updateAuthority: AgentUpdateAuthoritySchema.optional(),
    nextAction: AgentUpdateNextActionSchema.optional(),
    canAutoUpdate: z.boolean().optional(),
    canExecuteUpdate: z.boolean().optional(),
    remoteDisplay: z.boolean().optional(),
    updateCommand: z.string().nullable().optional(),
    updateInstructions: z.string().optional(),
    updateAvailable: z.boolean(),
    latestVersion: z.string().nullable(),
    channels: z.record(ReleaseChannelSchema, z.string().nullable()),
    distTags: z.record(ReleaseChannelSchema, z.string()),
    lastCheckAt: z.string().nullable(),
    error: z.string().nullable(),
})
    .strict();
//# sourceMappingURL=update-status.js.map