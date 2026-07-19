/**
 * Server-safe native-platform detection.
 *
 * On Capacitor-hosted mobile, an in-process runtime boots inside the native
 * shell and Capacitor installs a global object. Plain Node/Bun and desktop
 * server processes do not.
 */
export declare function isNativeServerPlatform(): boolean;
//# sourceMappingURL=is-native-server.d.ts.map