/**
 * Network-policy bridge — used by the voice-model auto-updater and the
 * model downloader to decide whether a multi-GB pull is allowed to proceed
 * without prompting the user.
 *
 * Per R5-versioning §4 (per-platform download policy):
 *
 * - Android: `NetworkCapabilities.hasCapability(NET_CAPABILITY_NOT_METERED)`.
 *   Android explicitly warns against equating cellular = metered (a user
 *   can have unmetered cellular, or a metered Wi-Fi hotspot), so the
 *   metered flag is mandatory, not derived from connection type.
 * - iOS: `NWPathMonitor.path.isExpensive` — Apple's "treat as metered" flag.
 * - Desktop (Electron/Electrobun): WinRT `NetworkCostType`, NetworkManager
 *   dbus `ActiveConnection.Metered`, or macOS `NWPathMonitor` via the
 *   native bridge.
 * - Headless server / CLI: skip auto-update entirely; explicit
 *   `eliza models update` only.
 *
 * The actual platform shims are wired in `plugin-local-inference`'s
 * `services/network-policy.ts`. This module defines the platform-agnostic
 * decision contract and ships a pure `evaluateNetworkPolicy` that lets
 * higher-level code unit-test the decision rule without a runtime.
 */
export const DEFAULT_NETWORK_POLICY_PREFERENCES = {
    autoUpdateOnWifi: true,
    autoUpdateOnCellular: false,
    autoUpdateOnMetered: false,
    quietHours: [{ start: "22:00", end: "08:00" }],
};
/** Classify the raw state into one of the five canonical classes. */
export function classifyNetwork(state) {
    if (state.connectionType === "none")
        return "unknown";
    if (state.connectionType === "cellular")
        return "cellular";
    if (state.connectionType === "wifi") {
        if (state.metered === true)
            return "wifi-metered";
        if (state.metered === false)
            return "wifi-unmetered";
        return "unknown";
    }
    if (state.connectionType === "ethernet") {
        if (state.metered === true)
            return "ethernet-metered";
        if (state.metered === false)
            return "ethernet-unmetered";
        return "unknown";
    }
    return "unknown";
}
/**
 * Apply the user prefs + estimated transfer size to a classified network
 * state. The decision rule:
 *
 * - cellular: ask unless `autoUpdateOnCellular === true`.
 * - any `*-metered`: ask unless `autoUpdateOnMetered === true`.
 * - `wifi-unmetered`: auto if `autoUpdateOnWifi === true`, else ask.
 * - `ethernet-unmetered`: always auto (desktop wired link).
 * - `unknown`: ask (mobile default; desktop callers can override).
 *
 * Quiet hours (if active) downgrade all `auto` decisions to `ask`.
 */
export function applyNetworkPolicy(klass, prefs, estimatedBytes, options) {
    if (options?.isHeadless === true) {
        return {
            class: klass,
            allow: false,
            reason: "headless-explicit-only",
            estimatedBytes,
        };
    }
    const reasonForAsk = () => {
        if (klass === "cellular")
            return "cellular-ask";
        if (klass === "wifi-metered" || klass === "ethernet-metered") {
            return "metered-ask";
        }
        return "metered-ask";
    };
    let autoAllowed;
    switch (klass) {
        case "ethernet-unmetered":
            autoAllowed = true;
            break;
        case "wifi-unmetered":
            autoAllowed = prefs.autoUpdateOnWifi;
            break;
        case "wifi-metered":
        case "ethernet-metered":
            autoAllowed = prefs.autoUpdateOnMetered;
            break;
        case "cellular":
            autoAllowed = prefs.autoUpdateOnCellular;
            break;
        case "unknown":
            autoAllowed = false;
            break;
    }
    if (autoAllowed &&
        inQuietHours(prefs.quietHours, options?.now ?? new Date())) {
        autoAllowed = false;
    }
    return {
        class: klass,
        allow: autoAllowed,
        reason: autoAllowed ? "auto" : reasonForAsk(),
        estimatedBytes,
    };
}
function parseClock(hhmm) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
    if (!m)
        return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (!Number.isFinite(h) || !Number.isFinite(min))
        return null;
    if (h < 0 || h > 23 || min < 0 || min > 59)
        return null;
    return h * 60 + min;
}
/** True if `now` falls inside any quiet-hours window. */
export function inQuietHours(windows, now) {
    if (windows.length === 0)
        return false;
    const minutes = now.getHours() * 60 + now.getMinutes();
    for (const w of windows) {
        const start = parseClock(w.start);
        const end = parseClock(w.end);
        if (start === null || end === null)
            continue;
        if (start === end)
            continue;
        if (start < end) {
            if (minutes >= start && minutes < end)
                return true;
        }
        else {
            // Window crosses midnight: e.g. 22:00 -> 08:00.
            if (minutes >= start || minutes < end)
                return true;
        }
    }
    return false;
}
/**
 * Convenience composition for callers that have a raw state + prefs +
 * estimated size in hand and want a single decision.
 */
export function evaluateNetworkPolicy(state, prefs, estimatedBytes, options) {
    return applyNetworkPolicy(classifyNetwork(state), prefs, estimatedBytes, options);
}
//# sourceMappingURL=network-policy.js.map