/**
 * Shared browser API helpers for test setup files.
 *
 * Used by both test/setup.ts and apps/app/test/setup.ts to avoid duplicating
 * Storage, Canvas2D, and console error suppression logic.
 */
/**
 * Create an in-memory Storage implementation backed by a Map.
 */
export declare function createMemoryStorage(): Storage;
/** Type guard: does the value implement the Storage interface? */
export declare function hasStorageApi(value: unknown): value is Storage;
/**
 * Create a Canvas 2D rendering context shim for the common operations used in tests.
 */
export declare function createCanvas2DContext(): CanvasRenderingContext2D;
/**
 * Install canvas shims on HTMLCanvasElement.prototype if available.
 */
export declare function installCanvasShims(): void;
/**
 * Install HTMLMediaElement and Audio shims to avoid jsdom media warnings when
 * tests exercise preview or playback flows.
 */
export declare function installMediaElementShims(): void;
/**
 * Suppress known noisy console.error messages from React test tooling.
 */
export declare function suppressReactTestConsoleErrors(): void;
//# sourceMappingURL=browser-mocks.d.ts.map