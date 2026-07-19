/**
 * Typed constants for eliza:* custom events dispatched across the app.
 *
 * Using these constants instead of raw strings prevents typo-driven drift
 * between producers (main.tsx, bridge, components) and consumers (AppContext,
 * EmotePicker, ChatView, etc.).
 */
import type { UiLanguage } from "../i18n/language.js";
export declare const COMMAND_PALETTE_EVENT: "eliza:command-palette";
export declare const EMOTE_PICKER_EVENT: "eliza:emote-picker";
export declare const STOP_EMOTE_EVENT: "eliza:stop-emote";
export declare const AGENT_READY_EVENT: "eliza:agent-ready";
export declare const BRIDGE_READY_EVENT: "eliza:bridge-ready";
export declare const SHARE_TARGET_EVENT: "eliza:share-target";
export declare const TRAY_ACTION_EVENT: "eliza:tray-action";
export declare const APP_RESUME_EVENT: "eliza:app-resume";
export declare const APP_PAUSE_EVENT: "eliza:app-pause";
export declare const CONNECT_EVENT: "eliza:connect";
export declare const NETWORK_STATUS_CHANGE_EVENT: "eliza:network-status-change";
export declare const MOBILE_RUNTIME_MODE_CHANGED_EVENT: "eliza:mobile-runtime-mode-changed";
/** Detail payload for {@link NETWORK_STATUS_CHANGE_EVENT}. */
export interface NetworkStatusChangeDetail {
    /** `true` when the device reports a usable network interface. */
    connected: boolean;
}
export declare const VOICE_CONFIG_UPDATED_EVENT: "eliza:voice-config-updated";
export declare const CHAT_AVATAR_VOICE_EVENT: "eliza:chat-avatar-voice";
export declare const APP_EMOTE_EVENT: "eliza:app-emote";
/**
 * Fused on-device wake (#9953 / #10351). The battery-efficient native
 * openWakeWord runtime (`libwakeword` via `wake-word-ggml.ts`) runs in the
 * agent/native process; each detected stage is forwarded to the renderer as
 * this window event, where `useWakeController` activates the bottom bar and
 * starts a turn. This is the single contract shared by the producer
 * (`@elizaos/plugin-local-inference`) and the consumer (`@elizaos/ui`
 * fused-wake-bridge) so the two halves never drift.
 */
export declare const FUSED_WAKE_EVENT: "eliza:fused-wake";
/** Which fused wake stage fired. */
export type FusedWakeStage = 
/** A trained openWakeWord head crossed threshold — terminal, no ASR confirm. */
"head-fired"
/** The generic detector raised a candidate; an ASR confirm window opens. */
 | "stage-a-candidate"
/** The short-window ASR transcript for two-stage confirmation. */
 | "stage-b-transcript";
/** Detail payload for {@link FUSED_WAKE_EVENT} — one fused-wake stage. */
export interface FusedWakeEventDetail {
    stage: FusedWakeStage;
    /** ASR transcript for `stage-b-transcript`. */
    transcript?: string;
    /** Detector confidence in [0, 1], when known. */
    confidence?: number;
}
/** After `/api/cloud/status` — chat voice reloads config so cloud-backed TTS mode matches the server snapshot. */
export declare const ELIZA_CLOUD_STATUS_UPDATED_EVENT: "eliza:cloud-status-updated";
export interface ElizaCloudStatusUpdatedDetail {
    /** Same as cloud status `connected` (auth or API key on server). */
    connected: boolean;
    /** True only when Eliza Cloud inference is the active connection. */
    enabled: boolean;
    /** Server reports a persisted Eliza Cloud API key. */
    hasPersistedApiKey: boolean;
    /** True only when cloud voice/chat routing should actively use the proxy. */
    cloudVoiceProxyAvailable: boolean;
}
export declare const NAVIGATE_VIEW_EVENT: "eliza:navigate:view";
export type NavigateViewType = "gui" | "tui" | "xr";
export interface NavigateViewDetail {
    viewId?: string;
    viewPath?: string | null;
    viewLabel?: string;
    viewType?: NavigateViewType;
    action?: string;
    /** Sub-section to deep-link within the target view (e.g. a Settings section id). */
    subview?: string;
    views?: string[];
    layout?: string;
    placement?: string;
    alwaysOnTop?: boolean;
    /** Opaque payload handed to the target view on navigation (deep-link state). */
    payload?: unknown;
}
export type NavigateViewEvent = CustomEvent<NavigateViewDetail>;
export declare function createNavigateViewEvent(detail: NavigateViewDetail): NavigateViewEvent;
export declare function dispatchNavigateViewEvent(detail: NavigateViewDetail): void;
export declare const BACKGROUND_APPLY_EVENT: "background:apply";
/** Operation carried by a {@link BACKGROUND_APPLY_EVENT} payload. */
export type BackgroundApplyOp = "set" | "undo" | "redo" | "reset";
/** Tunable GLSL uniform patch the BACKGROUND action can send to the renderer. */
export interface BackgroundShaderUniformPatch {
    u_speed?: number;
    u_scale?: number;
    u_intensity?: number;
    u_seed?: number;
}
/** Payload broadcast on {@link BACKGROUND_APPLY_EVENT}. */
export interface BackgroundApplyPayload extends Record<string, unknown> {
    op: BackgroundApplyOp;
    /** "shader" (color field), "image" (cover image), or "glsl" (programmable shader). */
    mode?: "shader" | "image" | "glsl";
    /** 6-digit hex for shader/glsl mode. */
    color?: string;
    /** Same-origin image URL (`/api/media/...`) for image mode. */
    imageUrl?: string;
    /** Named GLSL preset id; the renderer resolves this to source. */
    presetId?: string;
    /** Uniform patch for glsl mode. */
    uniforms?: BackgroundShaderUniformPatch;
    /**
     * Named curated-catalog entry id/label the agent selected ("misty-forest").
     * The renderer resolves it against the shared background catalog to a config
     * (color / vetted image URL / named GLSL preset). Like `presetId`, this NEVER
     * carries GLSL source or an arbitrary URL — an unknown name is ignored, so a
     * crafted payload can't wedge or escape the background (#11088 / #13523).
     */
    catalogId?: string;
}
export declare const APPEARANCE_APPLY_EVENT: "appearance:apply";
/** Payload broadcast on {@link APPEARANCE_APPLY_EVENT}. */
export interface AppearanceApplyPayload extends Record<string, unknown> {
    /** Theme mode persisted by the Appearance settings section. */
    themeMode?: "light" | "dark" | "system";
    /** Accent preset id, e.g. default, amber, rose, green. */
    accentId?: string;
    /** Supported UI language code. */
    language?: UiLanguage;
    /** Whether the home time/date widget is hidden. */
    homeTimeWidgetHidden?: boolean;
}
export declare const VOICE_SETTINGS_APPLY_EVENT: "voice-settings:apply";
/**
 * Payload broadcast on {@link VOICE_SETTINGS_APPLY_EVENT}.
 *
 * The SETTINGS voice twin persists these under `messages.voice` via `/api/config`,
 * but the running capture path (useShellController.startCapture) and ChatView
 * read the localStorage mirrors VoiceSectionMount seeds — never the config blob.
 * This payload re-seeds those mirrors live so a chat-driven change reaches the
 * running shell without a Settings → Voice remount. Fields are optional so a
 * single-field write does not have to restate the whole voice config.
 */
export interface VoiceSettingsApplyPayload extends Record<string, unknown> {
    /** Continuous-chat mode: off (push-to-talk), vad-gated, or always-on. */
    continuous?: "off" | "vad-gated" | "always-on";
    /** VAD end-of-turn thresholds the capture hot path reads. */
    vadAutoStop?: {
        /** Trailing silence (ms) that ends a turn in local-ASR capture. */
        silenceMs: number;
        /** RMS amplitude (0–1) above which audio is treated as speech. */
        speechRmsThreshold: number;
    };
}
export declare const VRM_TELEPORT_COMPLETE_EVENT: "eliza:vrm-teleport-complete";
/** FirstRunShell dispatches this after queuing a post-teleport voice preview; FirstRunWizard echoes {@link VRM_TELEPORT_COMPLETE_EVENT} when VRM is off. */
export declare const FIRST_RUN_VOICE_PREVIEW_AWAIT_TELEPORT_EVENT: "eliza:first-run-voice-preview-await-teleport";
export declare const SELF_STATUS_SYNC_EVENT: "eliza:self-status-refresh";
export declare const SHELL_NAVIGATE_VIEW_WS_EVENT: "shell:navigate:view";
export type ShellNavigateViewType = "gui" | "tui" | "xr";
export interface ShellNavigateViewPayload {
    viewId?: string;
    viewPath?: string | null;
    viewLabel?: string;
    viewType?: ShellNavigateViewType;
    action?: string;
    subview?: string;
    views?: string[];
    layout?: string;
    placement?: string;
    alwaysOnTop?: boolean;
    /** Opaque target-view deep-link state, validated by the receiving view. */
    payload?: unknown;
}
export type ShellNavigateViewWsFrame = ShellNavigateViewPayload & {
    type: typeof SHELL_NAVIGATE_VIEW_WS_EVENT;
};
export declare function normalizeShellNavigateViewPayload(data: Record<string, unknown>): ShellNavigateViewPayload;
export declare function createShellNavigateViewWsFrame(payload: ShellNavigateViewPayload): ShellNavigateViewWsFrame;
export interface AppEmoteEventDetail {
    emoteId: string;
    path: string;
    duration: number;
    loop: boolean;
    showOverlay?: boolean;
}
export interface ChatAvatarVoiceEventDetail {
    mouthOpen: number;
    isSpeaking: boolean;
}
export type ElizaDocumentEventName = typeof COMMAND_PALETTE_EVENT | typeof EMOTE_PICKER_EVENT | typeof STOP_EMOTE_EVENT | typeof AGENT_READY_EVENT | typeof BRIDGE_READY_EVENT | typeof SHARE_TARGET_EVENT | typeof TRAY_ACTION_EVENT | typeof APP_RESUME_EVENT | typeof APP_PAUSE_EVENT | typeof CONNECT_EVENT | typeof NETWORK_STATUS_CHANGE_EVENT | typeof MOBILE_RUNTIME_MODE_CHANGED_EVENT;
export type ElizaWindowEventName = typeof VOICE_CONFIG_UPDATED_EVENT | typeof CHAT_AVATAR_VOICE_EVENT | typeof FUSED_WAKE_EVENT | typeof APP_EMOTE_EVENT | typeof ELIZA_CLOUD_STATUS_UPDATED_EVENT | typeof NAVIGATE_VIEW_EVENT | typeof VRM_TELEPORT_COMPLETE_EVENT | typeof FIRST_RUN_VOICE_PREVIEW_AWAIT_TELEPORT_EVENT | typeof SELF_STATUS_SYNC_EVENT;
export type ElizaEventName = ElizaDocumentEventName | ElizaWindowEventName;
/** Dispatch a typed custom event on `document`. */
export declare function dispatchAppEvent(name: ElizaDocumentEventName, detail?: unknown): void;
/** Dispatch a typed custom event on `window`. */
export declare function dispatchWindowEvent(name: ElizaWindowEventName, detail?: unknown): void;
/** Dispatch a normalized app-wide emote event on `window`. */
export declare function dispatchAppEmoteEvent(detail: AppEmoteEventDetail): void;
export declare function dispatchElizaCloudStatusUpdated(detail: ElizaCloudStatusUpdatedDetail): void;
export type AppDocumentEventName = ElizaDocumentEventName;
export type AppWindowEventName = ElizaWindowEventName;
export type AppEventName = ElizaEventName;
//# sourceMappingURL=index.d.ts.map