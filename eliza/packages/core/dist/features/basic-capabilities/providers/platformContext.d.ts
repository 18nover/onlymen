/**
 * The PLATFORM_CHAT_CONTEXT and PLATFORM_USER_CONTEXT providers: inject
 * connector-specific metadata for the current platform target. Chat context
 * carries per-connector room metadata (source, channel/thread ids, summaries,
 * output guidance) — deliberately NOT the canonical transcript, which the
 * RECENT_MESSAGES provider owns; user context carries sender identity (handles,
 * aliases, account labels). Connectors are selected by matching the message
 * source, or by overlapping explicit routing contexts when no source is set, and
 * each connector hook's result is normalized to JSON-safe ProviderValues. Recent
 * messages are stripped from the emitted prompt text but kept in `data` for
 * diagnostics.
 */
import type { Provider } from "../../../types/index.js";
export declare const PLATFORM_CHAT_CONTEXT_PROVIDER_NAME = "PLATFORM_CHAT_CONTEXT";
export declare const PLATFORM_USER_CONTEXT_PROVIDER_NAME = "PLATFORM_USER_CONTEXT";
export declare const platformChatContextProvider: Provider;
export declare const platformUserContextProvider: Provider;
//# sourceMappingURL=platformContext.d.ts.map