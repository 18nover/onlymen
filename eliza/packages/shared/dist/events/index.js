/**
 * Typed constants for eliza:* custom events dispatched across the app.
 *
 * Using these constants instead of raw strings prevents typo-driven drift
 * between producers (main.tsx, bridge, components) and consumers (AppContext,
 * EmotePicker, ChatView, etc.).
 */
// ── App lifecycle ────────────────────────────────────────────────────────
export const COMMAND_PALETTE_EVENT = "eliza:command-palette";
export const EMOTE_PICKER_EVENT = "eliza:emote-picker";
export const STOP_EMOTE_EVENT = "eliza:stop-emote";
// ── Agent / bridge ───────────────────────────────────────────────────────
export const AGENT_READY_EVENT = "eliza:agent-ready";
export const BRIDGE_READY_EVENT = "eliza:bridge-ready";
export const SHARE_TARGET_EVENT = "eliza:share-target";
export const TRAY_ACTION_EVENT = "eliza:tray-action";
// ── App state ────────────────────────────────────────────────────────────
export const APP_RESUME_EVENT = "eliza:app-resume";
export const APP_PAUSE_EVENT = "eliza:app-pause";
export const CONNECT_EVENT = "eliza:connect";
export const NETWORK_STATUS_CHANGE_EVENT = "eliza:network-status-change";
export const MOBILE_RUNTIME_MODE_CHANGED_EVENT = "eliza:mobile-runtime-mode-changed";
// ── Voice / config ───────────────────────────────────────────────────────
export const VOICE_CONFIG_UPDATED_EVENT = "eliza:voice-config-updated";
export const CHAT_AVATAR_VOICE_EVENT = "eliza:chat-avatar-voice";
export const APP_EMOTE_EVENT = "eliza:app-emote";
/**
 * Fused on-device wake (#9953 / #10351). The battery-efficient native
 * openWakeWord runtime (`libwakeword` via `wake-word-ggml.ts`) runs in the
 * agent/native process; each detected stage is forwarded to the renderer as
 * this window event, where `useWakeController` activates the bottom bar and
 * starts a turn. This is the single contract shared by the producer
 * (`@elizaos/plugin-local-inference`) and the consumer (`@elizaos/ui`
 * fused-wake-bridge) so the two halves never drift.
 */
export const FUSED_WAKE_EVENT = "eliza:fused-wake";
/** After `/api/cloud/status` — chat voice reloads config so cloud-backed TTS mode matches the server snapshot. */
export const ELIZA_CLOUD_STATUS_UPDATED_EVENT = "eliza:cloud-status-updated";
// ── Navigation ──────────────────────────────────────────────────────────
export const NAVIGATE_VIEW_EVENT = "eliza:navigate:view";
export function createNavigateViewEvent(detail) {
    return new CustomEvent(NAVIGATE_VIEW_EVENT, { detail });
}
export function dispatchNavigateViewEvent(detail) {
    if (typeof window === "undefined")
        return;
    window.dispatchEvent(createNavigateViewEvent(detail));
}
// ── View event bus ──────────────────────────────────────────────────────
export const BACKGROUND_APPLY_EVENT = "background:apply";
export const APPEARANCE_APPLY_EVENT = "appearance:apply";
export const VOICE_SETTINGS_APPLY_EVENT = "voice-settings:apply";
// ── Avatar / VRM ─────────────────────────────────────────────────────────
export const VRM_TELEPORT_COMPLETE_EVENT = "eliza:vrm-teleport-complete";
/** FirstRunShell dispatches this after queuing a post-teleport voice preview; FirstRunWizard echoes {@link VRM_TELEPORT_COMPLETE_EVENT} when VRM is off. */
export const FIRST_RUN_VOICE_PREVIEW_AWAIT_TELEPORT_EVENT = "eliza:first-run-voice-preview-await-teleport";
// ── Sidebar sync ─────────────────────────────────────────────────────────
export const SELF_STATUS_SYNC_EVENT = "eliza:self-status-refresh";
// ── Agent WebSocket shell events ─────────────────────────────────────────
export const SHELL_NAVIGATE_VIEW_WS_EVENT = "shell:navigate:view";
function readNonEmptyString(value) {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}
function readViewType(value) {
    return value === "gui" || value === "tui" || value === "xr"
        ? value
        : undefined;
}
export function normalizeShellNavigateViewPayload(data) {
    const views = Array.isArray(data.views)
        ? data.views.filter((value) => typeof value === "string" && value.length > 0)
        : undefined;
    return {
        viewId: typeof data.viewId === "string" ? data.viewId : undefined,
        viewPath: typeof data.viewPath === "string" ? data.viewPath : undefined,
        viewLabel: typeof data.viewLabel === "string" ? data.viewLabel : undefined,
        viewType: readViewType(data.viewType),
        action: typeof data.action === "string" ? data.action : undefined,
        subview: readNonEmptyString(data.subview),
        views: views && views.length > 0 ? views : undefined,
        layout: readNonEmptyString(data.layout),
        placement: readNonEmptyString(data.placement),
        alwaysOnTop: data.alwaysOnTop === true,
        ...(Object.hasOwn(data, "payload") ? { payload: data.payload } : {}),
    };
}
export function createShellNavigateViewWsFrame(payload) {
    return {
        type: SHELL_NAVIGATE_VIEW_WS_EVENT,
        ...payload,
    };
}
// ── Helpers ──────────────────────────────────────────────────────────────
/** Dispatch a typed custom event on `document`. */
export function dispatchAppEvent(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail }));
}
/** Dispatch a typed custom event on `window`. */
export function dispatchWindowEvent(name, detail) {
    if (typeof window === "undefined")
        return;
    window.dispatchEvent(new CustomEvent(name, { detail }));
}
/** Dispatch a normalized app-wide emote event on `window`. */
export function dispatchAppEmoteEvent(detail) {
    dispatchWindowEvent(APP_EMOTE_EVENT, detail);
}
export function dispatchElizaCloudStatusUpdated(detail) {
    dispatchWindowEvent(ELIZA_CLOUD_STATUS_UPDATED_EVENT, detail);
}
//# sourceMappingURL=index.js.map