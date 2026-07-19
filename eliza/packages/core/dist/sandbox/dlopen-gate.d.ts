/**
 * `bun:ffi.dlopen()` gate for store-distributed builds.
 *
 * Mac App Store distribution requires the hardened-runtime entitlement
 * `com.apple.security.cs.disable-library-validation` to be **false**: every
 * Mach-O the process loads must be signed by Apple or by the same Team ID
 * that signed the app. The OS enforces this at `dlopen()` time, so any code
 * path that calls into `bun:ffi`'s `dlopen()` with a non-bundle-local path
 * fails at runtime in store builds (and is a sandbox-escape vector in worst
 * cases).
 *
 * This module is the runtime-side counterpart to that entitlement. Every
 * call site that touches `bun:ffi.dlopen()` (or a wrapper around it) MUST
 * call {@link assertDlopenPathAllowed} immediately before the load. The
 * gate is a **hard assertion** in store builds — it throws — and is bypassed
 * in direct builds where the user owns the install and we trust the filesystem.
 *
 * What "bundle-local" means on macOS: the resolved absolute library path
 * must live under `<...>/<Name>.app/Contents/` (covers
 * `Contents/MacOS`, `Contents/Resources`, `Contents/Frameworks`, and any
 * other bundle sub-directory).
 *
 * Out of scope:
 * - `node-llama-cpp`, etc. — these load native modules
 *   through Node's `process.dlopen` / `require()`-driven `.node` loader,
 *   not through `bun:ffi`. They are governed separately by the Node
 *   loader's own search path and by signing on the bundled `.node`
 *   artifacts.
 * - Non-darwin platforms — this gate enforces the macOS App Sandbox
 *   library-validation rule only. Linux/Windows distribution constraints use
 *   their own loader and signing policies.
 */
/**
 * True when `libraryPath` resolves to an absolute path inside the running
 * app bundle's `Contents/` tree. Returns false for:
 * - relative paths (PATH-resolved or unanchored loads),
 * - paths that resolve outside the bundle (including `..` escapes),
 * - any path when the process is not running from an `.app` bundle.
 *
 * Pure function: no side effects, suitable for callers that just want to
 * probe a path. Most production callers should use
 * {@link assertDlopenPathAllowed} instead, which encodes the store-build
 * vs direct-build policy.
 */
export declare function isPathInsideAppBundle(libraryPath: string): boolean;
/**
 * Hard assertion gate for `bun:ffi.dlopen()` calls.
 *
 * - **Direct build (any platform):** bypassed. The user owns the install; we
 *   trust the filesystem and the library's own signing/integrity story.
 * - **Store build on non-darwin:** bypassed for this iteration. macOS App
 *   Sandbox is the only platform whose library-validation policy this
 *   module enforces today. Linux/Windows store variants will get their
 *   own enforcement when those distribution targets land.
 * - **Store build on darwin, no resolvable bundle:** bypassed. Treated as a
 *   dev/source-tree run; the gate does not break unbundled execution.
 * - **Store build on darwin, bundle resolved:** throws unless
 *   `libraryPath` is an absolute path inside the running `.app` bundle.
 *
 * @throws {Error} when called in a store build on darwin with a resolvable
 *   bundle and a non-bundle-local path.
 */
export declare function assertDlopenPathAllowed(libraryPath: string): void;
/**
 * Test hook. Override the resolved bundle root so tests can simulate a
 * store-build environment without controlling `process.execPath`.
 *
 * Pass `null` to clear the override (next call resolves from `execPath`
 * again — which typically yields `null` in CI/dev). Pass an absolute path
 * to pin the bundle root to that value (must point at the `Contents/`
 * directory).
 */
export declare function _setAppBundleRootForTests(root: string | null): void;
//# sourceMappingURL=dlopen-gate.d.ts.map