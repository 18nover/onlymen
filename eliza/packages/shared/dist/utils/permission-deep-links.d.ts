/**
 * macOS Privacy & Security pane deep-link table.
 *
 * Maps permission ids to the `x-apple.systempreferences:` URL that opens the
 * exact pane the user needs to grant access. The chat permission card calls
 * `openPermissionSettings(id)` when a permission is denied and the user
 * clicks "Open System Settings".
 *
 * Win32 / Linux: returns with a console warning. Native equivalents (Windows
 * `ms-settings:privacy-*`, GNOME `gnome-control-center privacy`, etc.) can
 * be wired in when those platforms gain real support — until then the chat
 * surface advertises the limitation up-front.
 */
import type { PermissionId } from "../contracts/permissions.js";
export declare function getMacPermissionDeepLink(id: PermissionId): string;
type Platform = "darwin" | "win32" | "linux" | "unknown";
export interface OpenPermissionSettingsDeps {
    /**
     * Optional opener. Injected for tests; defaults to `window.open` in the
     * browser/electron renderer. On Node-only contexts the caller must inject
     * something (e.g. `child_process.exec("open ...")`).
     */
    open?: (url: string) => void | Promise<void>;
    /** Override platform detection (tests). */
    platform?: Platform;
}
/**
 * Open the system settings pane for the given permission. Resolves once the
 * opener has been invoked (it doesn't wait for the user). Win32 / Linux:
 * warns and returns because this table only defines macOS system settings deep
 * links today.
 */
export declare function openPermissionSettings(id: PermissionId, deps?: OpenPermissionSettingsDeps): Promise<void>;
export {};
//# sourceMappingURL=permission-deep-links.d.ts.map