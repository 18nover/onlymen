/**
 * Schema-compatibility helpers for strict-grammar inference providers.
 *
 * Cerebras (and similar providers that compile JSON-schema constraints into a
 * grammar before sampling) impose two constraints OpenAI does not:
 *   1. Tool-parameter root must be `type: "object"`; root `oneOf`/`anyOf`/
 *      `enum`/`not` is rejected (error: "schema must have type 'object' and
 *      not have 'oneOf'/'anyOf'/'enum'/'not' at the top level").
 *   2. Empty-properties object schemas are rejected by the grammar compiler.
 *
 * `normalizeSchemaForCerebras(schema, true)` enforces (1) by wrapping any
 * illegal-root schema under `properties.value`, and enforces (2) by dropping
 * `properties`/`required`/`additionalProperties` when properties is empty.
 * Nested usage of `oneOf`/`anyOf`/`enum`/`not` is fine — only the root is
 * checked.
 *
 * `sanitizeFunctionNameForCerebras` replaces invalid characters with `_`.
 * Callers should keep a `{ sanitized → original }` map and rewrite tool-call
 * names on the response.
 */
export declare function sanitizeFunctionNameForCerebras(name: string): string;
export declare function normalizeSchemaForCerebras(schema: unknown, isRoot?: boolean): unknown;
//# sourceMappingURL=schema-compat.d.ts.map