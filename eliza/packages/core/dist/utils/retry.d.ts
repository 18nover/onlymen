/**
 * Retry and backoff utilities for robust async operations.
 *
 * Provides:
 * - Exponential backoff with jitter
 * - Configurable retry logic
 * - Abort signal support
 *
 * @module utils/retry
 */
/**
 * Sleep for a specified duration.
 *
 * @param ms - Milliseconds to sleep
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Sleep with abort signal support.
 *
 * @param ms - Milliseconds to sleep
 * @param abortSignal - Optional signal to abort sleep
 * @throws If aborted
 */
export declare function sleepWithAbort(ms: number, abortSignal?: AbortSignal): Promise<void>;
/**
 * Configuration for exponential backoff.
 */
export type BackoffPolicy = {
    /** Initial delay in milliseconds */
    initialMs: number;
    /** Maximum delay in milliseconds */
    maxMs: number;
    /** Multiplier for each attempt */
    factor: number;
    /** Random jitter factor (0-1) */
    jitter: number;
};
/**
 * Compute the backoff delay for a given attempt.
 *
 * @param policy - Backoff policy configuration
 * @param attempt - Attempt number (1-based)
 * @returns Delay in milliseconds
 */
export declare function computeBackoff(policy: BackoffPolicy, attempt: number): number;
/**
 * Basic retry configuration.
 */
export type RetryConfig = {
    /** Maximum number of attempts */
    attempts?: number;
    /** Minimum delay between retries in ms */
    minDelayMs?: number;
    /** Maximum delay between retries in ms */
    maxDelayMs?: number;
    /** Random jitter factor (0-1) */
    jitter?: number;
};
/**
 * Information about a retry attempt.
 */
export type RetryInfo = {
    /** Current attempt number */
    attempt: number;
    /** Maximum attempts configured */
    maxAttempts: number;
    /** Delay before this retry in ms */
    delayMs: number;
    /** The error that triggered the retry */
    err: unknown;
    /** Optional label for logging */
    label?: string;
};
/**
 * Full retry options including callbacks.
 */
export type RetryOptions = RetryConfig & {
    /** Label for logging/debugging */
    label?: string;
    /** Custom function to determine if error should trigger retry */
    shouldRetry?: (err: unknown, attempt: number) => boolean;
    /** Custom function to extract retry-after from error */
    retryAfterMs?: (err: unknown) => number | undefined;
    /** Callback called before each retry */
    onRetry?: (info: RetryInfo) => void;
};
/**
 * Resolve retry configuration with defaults.
 *
 * @param defaults - Default configuration
 * @param overrides - Override values
 * @returns Fully resolved configuration
 */
export declare function resolveRetryConfig(defaults?: Required<RetryConfig>, overrides?: RetryConfig): Required<RetryConfig>;
/**
 * Execute an async function with automatic retries.
 *
 * Supports two calling styles:
 * 1. Simple: `retryAsync(fn, attempts, initialDelayMs)`
 * 2. Full options: `retryAsync(fn, { attempts, minDelayMs, ... })`
 *
 * @example
 * ```ts
 * // Simple usage
 * const result = await retryAsync(() => fetch(url), 3, 1000);
 *
 * // Full options
 * const result = await retryAsync(
 *   () => fetch(url),
 *   {
 *     attempts: 5,
 *     minDelayMs: 500,
 *     maxDelayMs: 30000,
 *     jitter: 0.2,
 *     shouldRetry: (err) => isRetryable(err),
 *     onRetry: ({ attempt, delayMs }) => log(`Retry ${attempt} in ${delayMs}ms`)
 *   }
 * );
 * ```
 *
 * @param fn - Async function to execute
 * @param attemptsOrOptions - Number of attempts or full options
 * @param initialDelayMs - Initial delay (only used with simple calling style)
 * @returns Promise resolving to function result
 * @throws Last error after all retries exhausted
 */
export declare function retryAsync<T>(fn: () => Promise<T>, attemptsOrOptions?: number | RetryOptions, initialDelayMs?: number): Promise<T>;
//# sourceMappingURL=retry.d.ts.map