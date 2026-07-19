/**
 * @fileoverview Test Helper Utilities
 *
 * Pure utility functions for testing that don't involve mocking.
 * These are helpers for creating test data, assertions, and common patterns.
 */
import type { Character, Content, Memory, UUID } from "../types/index.js";
/**
 * Generate a random UUID for testing
 */
export declare function generateTestId(): UUID;
/**
 * Parameters for creating a test memory
 */
interface CreateTestMemoryParams {
    entityId?: UUID;
    roomId?: UUID;
    agentId?: UUID;
    content: Content | string;
}
/**
 * Create a test memory object with sensible defaults
 */
export declare function createTestMemory(params: CreateTestMemoryParams): Memory;
/**
 * Create a minimal test character
 */
export declare function createTestCharacter(overrides?: Partial<Character>): Character;
/**
 * Options for waitFor utility
 */
interface WaitForOptions {
    timeout?: number;
    interval?: number;
}
/**
 * Wait for a condition to be true with timeout
 */
export declare function waitFor(condition: () => boolean | Promise<boolean>, options?: WaitForOptions): Promise<void>;
/**
 * Expect a promise to reject with an error
 */
export declare function expectRejection(promise: Promise<unknown>, expectedMessage?: string | RegExp): Promise<Error>;
/**
 * Options for retry utility
 */
interface RetryOptions {
    maxRetries?: number;
    baseDelay?: number;
}
/**
 * Retry a function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
/**
 * Result of measuring execution time
 */
interface MeasureTimeResult<T> {
    result: T;
    durationMs: number;
}
/**
 * Measure execution time of an async function
 */
export declare function measureTime<T>(fn: () => Promise<T>): Promise<MeasureTimeResult<T>>;
/**
 * Test data generators
 */
export declare const testDataGenerators: {
    /** Generate a random UUID */
    uuid: () => UUID;
    /** Generate a random string */
    randomString: (length?: number) => string;
    /** Generate a random sentence */
    randomSentence: () => string;
};
export {};
//# sourceMappingURL=test-helpers.d.ts.map