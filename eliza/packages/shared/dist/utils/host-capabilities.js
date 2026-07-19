function readDefaultHostCapabilityProbe() {
    return {
        userAgent: typeof navigator !== "undefined" &&
            typeof navigator?.userAgent === "string"
            ? navigator.userAgent
            : undefined,
        hasWindow: typeof window !== "undefined",
        hasProcess: typeof process !== "undefined",
        capacitor: Reflect.get(globalThis, "Capacitor"),
    };
}
/**
 * The Capacitor WEB shim is present in EVERY browser tab — including a desktop
 * or web app that runs a local agent in-page — where `getPlatform()` is `"web"`
 * and `isNativePlatform()` is `false`. That is NOT a mobile host: classifying it
 * as `capacitor-foreground-only` (no fs, short-lived) wrongly refuses to start
 * long-running/fs workflows + scheduled tasks on desktop web. Only a real iOS/
 * Android shell counts as mobile. A bare probe object with no platform methods
 * (test fixtures, and any shell that doesn't expose them) keeps the prior
 * mobile classification so existing native detection is unchanged.
 */
function isNativeCapacitorShell(capacitor) {
    if (!capacitor || typeof capacitor !== "object")
        return false;
    const cap = capacitor;
    if (typeof cap.isNativePlatform === "function")
        return cap.isNativePlatform();
    if (typeof cap.getPlatform === "function") {
        const platform = cap.getPlatform();
        return platform === "ios" || platform === "android";
    }
    return true;
}
function hasCapacitorBackgroundRunner(capacitor) {
    if (!capacitor || typeof capacitor !== "object") {
        return false;
    }
    const plugins = Reflect.get(capacitor, "Plugins");
    const bgRunner = plugins && typeof plugins === "object"
        ? Reflect.get(plugins, "BackgroundRunner")
        : undefined;
    return typeof bgRunner === "object" && bgRunner !== null;
}
export function detectHostCapabilities(probe = readDefaultHostCapabilityProbe()) {
    if (probe.userAgent?.includes("Cloudflare-Workers")) {
        return {
            kind: "cloudflare-worker",
            fs: false,
            inbound: true,
            longRunning: false,
            childProcess: false,
            net: false,
            isMobile: false,
            isBrowser: false,
            label: "Cloudflare Worker",
        };
    }
    if (probe.capacitor &&
        typeof probe.capacitor === "object" &&
        isNativeCapacitorShell(probe.capacitor)) {
        const hasBgRunner = hasCapacitorBackgroundRunner(probe.capacitor);
        return {
            kind: hasBgRunner
                ? "capacitor-background-runner"
                : "capacitor-foreground-only",
            fs: false,
            inbound: false,
            longRunning: hasBgRunner,
            childProcess: false,
            net: false,
            isMobile: true,
            isBrowser: false,
            label: hasBgRunner
                ? "Mobile (Capacitor + BackgroundRunner)"
                : "Mobile (Capacitor, foreground-only)",
        };
    }
    if (probe.hasWindow && !probe.hasProcess) {
        return {
            kind: "browser",
            fs: false,
            inbound: false,
            longRunning: false,
            childProcess: false,
            net: false,
            isMobile: false,
            isBrowser: true,
            label: "Browser",
        };
    }
    return {
        kind: "node",
        fs: true,
        inbound: true,
        longRunning: true,
        childProcess: true,
        net: true,
        isMobile: false,
        isBrowser: false,
        label: "Node",
    };
}
//# sourceMappingURL=host-capabilities.js.map