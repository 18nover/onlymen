/**
 * Converts an Action's `parameters` contract (the `ActionParameter[]` /
 * `ActionParameterSchema` shape) into JSON Schema. Emits a local `JsonSchema`
 * type for tool-calling and normalizes it to the core `JSONSchema` from
 * `types/model.ts` that the runtime's grammar / structured-output plumbing
 * (GBNF, planner grammar) speaks. Tolerates legacy parameter shapes (`enum` /
 * `enumValues` / `options`, `required` as a boolean or a name list,
 * `defaultValue`). Consumed by `to-tool.ts` (planner / tool definitions) and
 * `validate-tool-args.ts`.
 */
import type { Action, ActionParameter, ActionParameterSchema } from "../types/index.js";
import type { JSONSchema } from "../types/model.js";
export type JsonSchemaPrimitiveType = "string" | "number" | "integer" | "boolean" | "object" | "array";
export interface JsonSchema {
    type?: JsonSchemaPrimitiveType;
    description?: string;
    enum?: Array<string | number | boolean>;
    default?: unknown;
    properties?: Record<string, JsonSchema>;
    required?: string[];
    items?: JsonSchema;
    additionalProperties?: boolean | JsonSchema;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    oneOf?: JsonSchema[];
    anyOf?: JsonSchema[];
}
export interface ActionParametersJsonSchema extends JsonSchema {
    type: "object";
    properties: Record<string, JsonSchema>;
    required: string[];
    additionalProperties?: boolean;
}
export declare function actionParameterSchemaToJsonSchema(schema: ActionParameterSchema, options?: {
    path?: string;
    description?: string;
    enumValues?: unknown[];
}): JsonSchema;
export declare function actionParametersToJsonSchema(parameters?: ActionParameter[], options?: {
    allowAdditionalProperties?: boolean;
}): ActionParametersJsonSchema;
export declare function actionToJsonSchema(action: Action): ActionParametersJsonSchema;
/**
 * An action's `parameters` schema as a core {@link JSONSchema} (object schema
 * with `properties` / `required` / `additionalProperties`). Authoritative for
 * tool-calling, GBNF grammar generation, and post-hoc argument validation —
 * `Action` carries no `outputSchema`; `parameters` is the contract.
 */
export declare function normalizeActionJsonSchema(action: Pick<Action, "parameters" | "allowAdditionalParameters">): JSONSchema;
//# sourceMappingURL=action-schema.d.ts.map