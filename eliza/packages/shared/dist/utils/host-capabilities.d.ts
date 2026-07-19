/**
 * Detects the runtime host kind (Cloudflare Worker, Capacitor background/
 * foreground, browser, node) from an environment probe, so callers can gate
 * behavior on what the current host actually supports.
 */
export type HostCapabilityKind = "cloudflare-worker" | "capacitor-background-runner" | "capacitor-foreground-only" | "browser" | "node";
export interface HostCapabilityProbe {
    /** User agent string, when the host exposes one. */
    userAgent?: string;
    /** Whether a browser-style window global is present. */
    hasWindow?: boolean;
    /** Whether a Node/Bun-style process global is present. */
    hasProcess?: boolean;
    /** Capacitor global, when running inside a native shell. */
    capacitor?: unknown;
}
export interface HostCapabilities {
    /** Stable host classification used by tests and callers that need branching. */
    kind: HostCapabilityKind;
    /** Read/write filesystem via node:fs or equivalent. */
    fs: boolean;
    /** Can receive inbound HTTP from the public internet. */
    inbound: boolean;
    /** Host process stays alive across schedule firings. */
    longRunning: boolean;
    /** Spawns child processes via node:child_process. */
    childProcess: boolean;
    /** Raw TCP/UDP sockets via node:net, not just fetch. */
    net: boolean;
    /** True when running inside a Capacitor iOS/Android shell. */
    isMobile: boolean;
    /** True for a pure browser tab with no Capacitor or Node/Bun process. */
    isBrowser: boolean;
    /** Human-readable host label for UI banners and engine errors. */
    label: string;
}
export declare function detectHostCapabilities(probe?: HostCapabilityProbe): HostCapabilities;
//# sourceMappingURL=host-capabilities.d.ts.map