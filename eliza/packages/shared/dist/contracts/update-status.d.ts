/**
 * Contract for agent self-update status: release channels, install method, and
 * the zod schemas that validate update-check responses. Shared so the updater
 * and the settings UI agree on channels and how the agent was installed.
 */
import z from "zod";
import type { ReleaseChannel } from "./config.js";
export declare const ReleaseChannelSchema: z.ZodEnum<{
    beta: "beta";
    stable: "stable";
    nightly: "nightly";
}>;
export declare const AgentInstallMethodSchema: z.ZodEnum<{
    unknown: "unknown";
    "npm-global": "npm-global";
    "bun-global": "bun-global";
    homebrew: "homebrew";
    snap: "snap";
    apt: "apt";
    flatpak: "flatpak";
    "local-dev": "local-dev";
}>;
export type AgentInstallMethod = z.infer<typeof AgentInstallMethodSchema>;
export type AgentUpdateAuthority = "npm" | "bun" | "homebrew" | "snap" | "apt" | "flatpak" | "local-dev" | "unknown" | "package-manager" | "os-package-manager" | "developer" | "operator";
export declare const AgentUpdateAuthoritySchema: z.ZodEnum<{
    "package-manager": "package-manager";
    "os-package-manager": "os-package-manager";
    developer: "developer";
    operator: "operator";
}>;
export declare const AgentUpdateNextActionSchema: z.ZodEnum<{
    none: "none";
    "run-package-manager-command": "run-package-manager-command";
    "run-git-pull": "run-git-pull";
    "review-installation": "review-installation";
}>;
export type AgentUpdateNextAction = z.infer<typeof AgentUpdateNextActionSchema>;
export declare const AgentUpdateStatusSchema: z.ZodObject<{
    currentVersion: z.ZodString;
    channel: z.ZodEnum<{
        beta: "beta";
        stable: "stable";
        nightly: "nightly";
    }>;
    installMethod: z.ZodUnion<[z.ZodEnum<{
        unknown: "unknown";
        "npm-global": "npm-global";
        "bun-global": "bun-global";
        homebrew: "homebrew";
        snap: "snap";
        apt: "apt";
        flatpak: "flatpak";
        "local-dev": "local-dev";
    }>, z.ZodString]>;
    updateAuthority: z.ZodOptional<z.ZodEnum<{
        "package-manager": "package-manager";
        "os-package-manager": "os-package-manager";
        developer: "developer";
        operator: "operator";
    }>>;
    nextAction: z.ZodOptional<z.ZodEnum<{
        none: "none";
        "run-package-manager-command": "run-package-manager-command";
        "run-git-pull": "run-git-pull";
        "review-installation": "review-installation";
    }>>;
    canAutoUpdate: z.ZodOptional<z.ZodBoolean>;
    canExecuteUpdate: z.ZodOptional<z.ZodBoolean>;
    remoteDisplay: z.ZodOptional<z.ZodBoolean>;
    updateCommand: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    updateInstructions: z.ZodOptional<z.ZodString>;
    updateAvailable: z.ZodBoolean;
    latestVersion: z.ZodNullable<z.ZodString>;
    channels: z.ZodRecord<z.ZodEnum<{
        beta: "beta";
        stable: "stable";
        nightly: "nightly";
    }>, z.ZodNullable<z.ZodString>>;
    distTags: z.ZodRecord<z.ZodEnum<{
        beta: "beta";
        stable: "stable";
        nightly: "nightly";
    }>, z.ZodString>;
    lastCheckAt: z.ZodNullable<z.ZodString>;
    error: z.ZodNullable<z.ZodString>;
}, z.core.$strict>;
export interface AgentUpdateStatus {
    currentVersion: string;
    channel: ReleaseChannel;
    installMethod: AgentInstallMethod | (string & {});
    updateAuthority?: Extract<AgentUpdateAuthority, "package-manager" | "os-package-manager" | "developer" | "operator">;
    nextAction?: AgentUpdateNextAction;
    canAutoUpdate?: boolean;
    canExecuteUpdate?: boolean;
    remoteDisplay?: boolean;
    updateCommand?: string | null;
    updateInstructions?: string;
    updateAvailable: boolean;
    latestVersion: string | null;
    channels: Record<ReleaseChannel, string | null>;
    distTags: Record<ReleaseChannel, string>;
    lastCheckAt: string | null;
    error: string | null;
}
//# sourceMappingURL=update-status.d.ts.map