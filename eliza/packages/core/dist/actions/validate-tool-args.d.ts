/**
 * Post-hoc validation of model-produced tool arguments against an Action's
 * parameter JSON Schema (from `actionToJsonSchema`). Checks type / enum / numeric
 * bounds / string pattern, enforces required fields and the additionalProperties
 * policy, and fills declared defaults, collecting human-readable error strings
 * rather than throwing. `validateSchema` is exported for verifying whole
 * structured outputs (e.g. remote-model planner JSON) too. Untrusted plugin
 * `pattern`s are compiled defensively and bounded by input length to blunt ReDoS,
 * since a JS regex runs synchronously and cannot be interrupted.
 */
import type { Action } from "../types/index.js";
import { type JsonSchema } from "./action-schema.js";
export type { JsonSchema } from "./action-schema.js";
export interface ValidateToolArgsResult {
    valid: boolean;
    args: Record<string, unknown> | undefined;
    errors: string[];
}
/**
 * Defensively compile + test an untrusted `pattern` (from a plugin parameter
 * schema) against `value`. The pattern may be an invalid regex (which would
 * otherwise throw an uncaught SyntaxError) or a ReDoS pattern. Returns ok:true
 * on match; ok:false with a reason when it doesn't match, the pattern is
 * invalid, or the value is too long to test safely.
 */
export declare function testSchemaPattern(pattern: string, value: string): {
    ok: true;
} | {
    ok: false;
    reason: string;
};
/**
 * Walk a JSON Schema against `value`, appending human-readable error strings
 * to `errors`. Exposed for callers that need to verify whole structured
 * outputs (e.g. remote-model planner JSON before action dispatch), not just
 * per-action tool arguments — the same logic powers {@link validateToolArgs}.
 */
export declare function validateSchema(schema: JsonSchema, value: unknown, path: string, errors: string[]): unknown;
export declare function validateToolArgs(action: Action, args: unknown): ValidateToolArgsResult;
//# sourceMappingURL=validate-tool-args.d.ts.map