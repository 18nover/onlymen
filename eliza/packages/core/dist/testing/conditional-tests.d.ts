/**
 * Condition-gated wrappers around Vitest's describe/it/test that fall back to
 * the `.skip` variant when the predicate is false, letting suites opt out of a
 * block without scattering inline `if` guards.
 */
import { describe, it, test } from "vitest";
type DescribeFn = typeof describe;
type ItFn = typeof it;
type TestFn = typeof test;
export declare function describeIf(condition: boolean): DescribeFn;
export declare function itIf(condition: boolean): ItFn;
export declare function testIf(condition: boolean): TestFn;
export {};
//# sourceMappingURL=conditional-tests.d.ts.map