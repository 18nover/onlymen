/**
 * Typed contract for the in-tab kit installed by BROWSER_TAB_PRELOAD_SCRIPT.
 *
 * The kit lives at `window.__elizaTabKit` inside every <electrobun-webview>
 * tab and provides:
 *   - a visual cursor overlay the user sees moving as the agent works,
 *   - faithful pointer-event sequences (vs the bare `element.click()` of the
 *     legacy command path),
 *   - keyboard-accurate typing that triggers React controlled-input change
 *     detection.
 *
 * The host (running in the main webview) calls these via short
 * `tag.executeJavascript(...)` snippets that reference `window.__elizaTabKit.*`.
 * The original `__elizaTabExec(requestId, script)` channel is unchanged — the
 * kit is additive.
 *
 * Synthetic events have `isTrusted === false` (not forge-able from script).
 * That's acceptable for React-driven sites and most Web3 UIs; sites that
 * specifically gate on `isTrusted` cannot be driven by this kit; callers must
 * use a CDP-backed browser automation path for those pages.
 */
export {};
//# sourceMappingURL=browser-tab-kit-types.js.map