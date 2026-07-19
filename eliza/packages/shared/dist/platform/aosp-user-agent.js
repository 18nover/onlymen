/**
 * Shared AOSP renderer detection.
 *
 * The Android framework appends the framework marker `ElizaOS/<tag>` only on
 * Eliza-derived AOSP system images. White-label builds may append additional
 * brand markers, but they still carry this base marker.
 */
export function userAgentHasElizaOSMarker(userAgent) {
    if (typeof userAgent !== "string" || userAgent.length === 0)
        return false;
    return /\bElizaOS\/\S/.test(userAgent);
}
export const isAospElizaUserAgent = userAgentHasElizaOSMarker;
//# sourceMappingURL=aosp-user-agent.js.map