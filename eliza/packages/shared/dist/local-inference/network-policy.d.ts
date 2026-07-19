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
/**
 * Five canonical network classes. Platform-specific connection types
 * collapse into one of these. `unknown` is reserved for platforms where
 * the OS does not expose enough information to disambiguate; the policy
 * decision for `unknown` is intentionally platform-specific (see
 * `applyNetworkPolicy`).
 */
export type NetworkClass = "wifi-unmetered" | "wifi-metered" | "ethernet-unmetered" | "ethernet-metered" | "cellular" | "unknown";
/**
 * Reason the policy reached its `allow` decision. Distinguishes the three
 * dialogs the UI may need to show.
 */
export type NetworkPolicyReason = "auto" | "metered-ask" | "cellular-ask" | "headless-explicit-only";
export interface NetworkPolicyDecision {
    readonly class: NetworkClass;
    /** Whether the download may proceed without prompting the user. */
    readonly allow: boolean;
    /** When `allow === false`, the UI must show a confirm dialog. */
    readonly reason: NetworkPolicyReason;
    /** Estimated bytes to transfer — used in the confirm dialog. */
    readonly estimatedBytes: number;
}
/**
 * User-facing toggles that override the default policy. Persisted in
 * `eliza.json` via `voiceUpdatePolicy`. The cellular toggle is OWNER-only
 * (D6 / R5-versioning §5.4).
 */
export interface NetworkPolicyPreferences {
    /** Auto-update on Wi-Fi when unmetered. Default: true. */
    readonly autoUpdateOnWifi: boolean;
    /** Auto-update on cellular. OWNER-only toggle. Default: false. */
    readonly autoUpdateOnCellular: boolean;
    /** Auto-update on any metered link. Default: false. */
    readonly autoUpdateOnMetered: boolean;
    /**
     * Quiet hours when auto-update is suppressed. Local clock. Empty array
     * = no quiet hours. Each entry is `{ start: "HH:MM", end: "HH:MM" }`,
     * inclusive of `start`, exclusive of `end`. Crossing midnight is
     * permitted (`{ start: "22:00", end: "08:00" }`).
     */
    readonly quietHours: ReadonlyArray<{
        start: string;
        end: string;
    }>;
}
export declare const DEFAULT_NETWORK_POLICY_PREFERENCES: NetworkPolicyPreferences;
/**
 * Raw network state as reported by the platform shim. Producers fill in
 * what they know; the decision rule treats absent fields as "unknown".
 */
export interface RawNetworkState {
    readonly connectionType: "wifi" | "ethernet" | "cellular" | "none" | "unknown";
    /**
     * True when the OS reports the link as metered. On Android this maps to
     * `!NET_CAPABILITY_NOT_METERED`; on iOS to `path.isExpensive`; on
     * Windows to `NetworkCostType.{Fixed,Variable}`; on Linux to
     * NetworkManager's `Metered: yes`.
     */
    readonly metered: boolean | null;
}
/** Classify the raw state into one of the five canonical classes. */
export declare function classifyNetwork(state: RawNetworkState): NetworkClass;
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
export declare function applyNetworkPolicy(klass: NetworkClass, prefs: NetworkPolicyPreferences, estimatedBytes: number, options?: {
    now?: Date;
    isHeadless?: boolean;
}): NetworkPolicyDecision;
/** True if `now` falls inside any quiet-hours window. */
export declare function inQuietHours(windows: ReadonlyArray<{
    start: string;
    end: string;
}>, now: Date): boolean;
/**
 * Convenience composition for callers that have a raw state + prefs +
 * estimated size in hand and want a single decision.
 */
export declare function evaluateNetworkPolicy(state: RawNetworkState, prefs: NetworkPolicyPreferences, estimatedBytes: number, options?: {
    now?: Date;
    isHeadless?: boolean;
}): NetworkPolicyDecision;
//# sourceMappingURL=network-policy.d.ts.map