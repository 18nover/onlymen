/**
 * Ambient declaration supplying the `act` signature for `react-test-renderer`,
 * which ships no bundled types.
 */
declare module "react-test-renderer" {
    function act<T>(callback: () => T | Promise<T>): Promise<Awaited<T>>;
}
//# sourceMappingURL=react-test-renderer-module.d.ts.map