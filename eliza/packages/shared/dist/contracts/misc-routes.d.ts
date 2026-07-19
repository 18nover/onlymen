/**
 * Zod schemas for miscellaneous HTTP routes — share intake, agent event
 * ingest, terminal run, and custom-actions CRUD.
 *
 * Routes covered (body-bearing only — /api/restart and the GET
 * variants don't read a body):
 *
 *   POST /api/ingest/share        { source?, title?, url?, text? }
 *   POST /api/agent/event         { stream, data?, roomId? }
 *   POST /api/terminal/run        { command, clientId?, terminalToken?,
 *                                   captureOutput? }
 *   POST /api/custom-actions      (full CustomActionDef create body)
 *   POST /api/custom-actions/generate { prompt }
 *   POST /api/custom-actions/:id/test  { params? }
 *   PUT  /api/custom-actions/:id  (partial update — handler is the only
 *                                   discriminated field; everything else is
 *                                   optional and falls back to existing values)
 */
import z from "zod";
/**
 * Share intake from OS share-sheets / browser-extension etc. Every
 * field is optional; the handler builds a suggested prompt from
 * whichever fields are present. Keep the schema lenient.
 */
export declare const PostIngestShareRequestSchema: z.ZodObject<{
    source: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    text: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
export declare const PostAgentEventRequestSchema: z.ZodPipe<z.ZodObject<{
    stream: z.ZodString;
    data: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    roomId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    roomId?: string | undefined;
    data?: Record<string, unknown> | undefined;
    stream: string;
}, {
    stream: string;
    data?: Record<string, unknown> | undefined;
    roomId?: string | undefined;
}>>;
/**
 * Terminal command execution. `clientId` is intentionally `unknown` at
 * the wire — `resolveTerminalRunClientId` accepts string, number, or
 * structured wrappers for compatibility with multiple call sites.
 * The other invariants (single-line, max 4096 chars, control chars)
 * are checked in the handler since they share the rejection path with
 * other mechanisms.
 */
export declare const PostTerminalRunRequestSchema: z.ZodObject<{
    command: z.ZodString;
    clientId: z.ZodOptional<z.ZodUnknown>;
    terminalToken: z.ZodOptional<z.ZodString>;
    captureOutput: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export declare const CustomActionHandlerSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"http">;
    method: z.ZodString;
    url: z.ZodString;
    headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    bodyTemplate: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"shell">;
    command: z.ZodString;
}, z.core.$strict>, z.ZodObject<{
    type: z.ZodLiteral<"code">;
    code: z.ZodString;
}, z.core.$strict>], "type">;
export declare const PostCustomActionRequestSchema: z.ZodPipe<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    similes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    parameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        required: z.ZodBoolean;
    }, z.core.$strict>>>;
    handler: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"http">;
        method: z.ZodString;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        bodyTemplate: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"shell">;
        command: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"code">;
        code: z.ZodString;
    }, z.core.$strict>], "type">;
    enabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodTransform<{
    name: string;
    description: string;
    similes: string[];
    parameters: {
        name: string;
        description: string;
        required: boolean;
    }[];
    handler: {
        type: "http";
        method: string;
        url: string;
        headers?: Record<string, string> | undefined;
        bodyTemplate?: string | undefined;
    } | {
        type: "shell";
        command: string;
    } | {
        type: "code";
        code: string;
    };
    enabled: boolean;
}, {
    name: string;
    description: string;
    handler: {
        type: "http";
        method: string;
        url: string;
        headers?: Record<string, string> | undefined;
        bodyTemplate?: string | undefined;
    } | {
        type: "shell";
        command: string;
    } | {
        type: "code";
        code: string;
    };
    similes?: string[] | undefined;
    parameters?: {
        name: string;
        description: string;
        required: boolean;
    }[] | undefined;
    enabled?: boolean | undefined;
}>>;
export declare const PostCustomActionGenerateRequestSchema: z.ZodPipe<z.ZodObject<{
    prompt: z.ZodString;
}, z.core.$strict>, z.ZodTransform<{
    prompt: string;
}, {
    prompt: string;
}>>;
export declare const PostCustomActionTestRequestSchema: z.ZodObject<{
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strict>;
/**
 * PUT update — every field optional, handler optional but if present
 * must be a full discriminated handler. Existing handler is preserved
 * server-side when this field is absent.
 */
export declare const PutCustomActionRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    similes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    parameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        required: z.ZodBoolean;
    }, z.core.$strict>>>;
    handler: z.ZodOptional<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"http">;
        method: z.ZodString;
        url: z.ZodString;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        bodyTemplate: z.ZodOptional<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"shell">;
        command: z.ZodString;
    }, z.core.$strict>, z.ZodObject<{
        type: z.ZodLiteral<"code">;
        code: z.ZodString;
    }, z.core.$strict>], "type">>;
    enabled: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
export type PostIngestShareRequest = z.infer<typeof PostIngestShareRequestSchema>;
export type PostAgentEventRequest = z.infer<typeof PostAgentEventRequestSchema>;
export type PostTerminalRunRequest = z.infer<typeof PostTerminalRunRequestSchema>;
export type PostCustomActionRequest = z.infer<typeof PostCustomActionRequestSchema>;
export type PostCustomActionGenerateRequest = z.infer<typeof PostCustomActionGenerateRequestSchema>;
export type PostCustomActionTestRequest = z.infer<typeof PostCustomActionTestRequestSchema>;
export type PutCustomActionRequest = z.infer<typeof PutCustomActionRequestSchema>;
//# sourceMappingURL=misc-routes.d.ts.map