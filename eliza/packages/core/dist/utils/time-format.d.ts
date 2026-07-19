/**
 * Time formatting utilities.
 *
 * Provides functions for human-readable time display.
 *
 * @module utils/time-format
 */
/**
 * Format a timestamp as a relative time string.
 *
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Human-readable relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(Date.now() - 30000) // => "just now"
 * formatRelativeTime(Date.now() - 300000) // => "5m ago"
 * formatRelativeTime(Date.now() - 7200000) // => "2h ago"
 * formatRelativeTime(Date.now() - 86400000) // => "Yesterday"
 * formatRelativeTime(Date.now() - 604800000) // => "Jan 15" (or similar)
 * ```
 */
export declare function formatRelativeTime(timestamp: number): string;
/**
 * Format a timestamp as a verbose relative string.
 */
export declare function formatTimestamp(timestamp: number): string;
//# sourceMappingURL=time-format.d.ts.map