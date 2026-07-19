/**
 * Zod schemas for the simple conversation HTTP routes.
 *
 * The chat-payload routes (`POST /api/conversations/:id/messages`
 * and the `/messages/stream` SSE variant) use a dedicated
 * `readChatRequestPayload` helper and aren't migrated here — they
 * share parsing with other chat endpoints and that helper is the
 * source of truth.
 *
 * Routes covered:
 *   POST  /api/conversations
 *     { title?, includeGreeting?, lang?, metadata? }
 *   POST  /api/conversations/:id/messages/truncate
 *     { messageId, inclusive? }
 *   PATCH /api/conversations/:id
 *     { title?, generate?, metadata? | null }
 *   POST  /api/conversations/cleanup-empty
 *     { keepId? }
 */
import z from "zod";
export declare const ConversationScopeSchema: z.ZodEnum<{
    general: "general";
    "automation-coordinator": "automation-coordinator";
    "automation-workflow": "automation-workflow";
    "automation-workflow-draft": "automation-workflow-draft";
    "automation-draft": "automation-draft";
    "page-character": "page-character";
    "page-apps": "page-apps";
    "page-connectors": "page-connectors";
    "page-phone": "page-phone";
    "page-plugins": "page-plugins";
    "page-settings": "page-settings";
    "page-wallet": "page-wallet";
    "page-browser": "page-browser";
    "page-automations": "page-automations";
    "page-knowledge": "page-knowledge";
    "page-transcripts": "page-transcripts";
}>;
export declare const ConversationAutomationTypeSchema: z.ZodEnum<{
    coordinator_text: "coordinator_text";
    workflow: "workflow";
}>;
/**
 * Mirror of `ConversationMetadata` in agent/src/api/server-types.ts.
 * The server passes through `sanitizeConversationMetadata` which
 * strips empty / non-string fields, so the schema is permissive on
 * presence and strict on type.
 */
export declare const ConversationMetadataSchema: z.ZodObject<{
    scope: z.ZodOptional<z.ZodEnum<{
        general: "general";
        "automation-coordinator": "automation-coordinator";
        "automation-workflow": "automation-workflow";
        "automation-workflow-draft": "automation-workflow-draft";
        "automation-draft": "automation-draft";
        "page-character": "page-character";
        "page-apps": "page-apps";
        "page-connectors": "page-connectors";
        "page-phone": "page-phone";
        "page-plugins": "page-plugins";
        "page-settings": "page-settings";
        "page-wallet": "page-wallet";
        "page-browser": "page-browser";
        "page-automations": "page-automations";
        "page-knowledge": "page-knowledge";
        "page-transcripts": "page-transcripts";
    }>>;
    automationType: z.ZodOptional<z.ZodEnum<{
        coordinator_text: "coordinator_text";
        workflow: "workflow";
    }>>;
    taskId: z.ZodOptional<z.ZodString>;
    triggerId: z.ZodOptional<z.ZodString>;
    workflowId: z.ZodOptional<z.ZodString>;
    workflowName: z.ZodOptional<z.ZodString>;
    draftId: z.ZodOptional<z.ZodString>;
    pageId: z.ZodOptional<z.ZodString>;
    sourceConversationId: z.ZodOptional<z.ZodString>;
    terminalBridgeConversationId: z.ZodOptional<z.ZodString>;
    waifuChatOwnerWallet: z.ZodOptional<z.ZodString>;
    waifuChatRole: z.ZodOptional<z.ZodEnum<{
        user: "user";
        admin: "admin";
        guest: "guest";
    }>>;
}, z.core.$strict>;
export declare const PostConversationRequestSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    includeGreeting: z.ZodOptional<z.ZodBoolean>;
    lang: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodObject<{
        scope: z.ZodOptional<z.ZodEnum<{
            general: "general";
            "automation-coordinator": "automation-coordinator";
            "automation-workflow": "automation-workflow";
            "automation-workflow-draft": "automation-workflow-draft";
            "automation-draft": "automation-draft";
            "page-character": "page-character";
            "page-apps": "page-apps";
            "page-connectors": "page-connectors";
            "page-phone": "page-phone";
            "page-plugins": "page-plugins";
            "page-settings": "page-settings";
            "page-wallet": "page-wallet";
            "page-browser": "page-browser";
            "page-automations": "page-automations";
            "page-knowledge": "page-knowledge";
            "page-transcripts": "page-transcripts";
        }>>;
        automationType: z.ZodOptional<z.ZodEnum<{
            coordinator_text: "coordinator_text";
            workflow: "workflow";
        }>>;
        taskId: z.ZodOptional<z.ZodString>;
        triggerId: z.ZodOptional<z.ZodString>;
        workflowId: z.ZodOptional<z.ZodString>;
        workflowName: z.ZodOptional<z.ZodString>;
        draftId: z.ZodOptional<z.ZodString>;
        pageId: z.ZodOptional<z.ZodString>;
        sourceConversationId: z.ZodOptional<z.ZodString>;
        terminalBridgeConversationId: z.ZodOptional<z.ZodString>;
        waifuChatOwnerWallet: z.ZodOptional<z.ZodString>;
        waifuChatRole: z.ZodOptional<z.ZodEnum<{
            user: "user";
            admin: "admin";
            guest: "guest";
        }>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare const PostConversationTruncateRequestSchema: z.ZodPipe<z.ZodObject<{
    messageId: z.ZodString;
    inclusive: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>, z.ZodTransform<{
    inclusive?: boolean | undefined;
    messageId: string;
}, {
    messageId: string;
    inclusive?: boolean | undefined;
}>>;
export declare const PatchConversationRequestSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    generate: z.ZodOptional<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        scope: z.ZodOptional<z.ZodEnum<{
            general: "general";
            "automation-coordinator": "automation-coordinator";
            "automation-workflow": "automation-workflow";
            "automation-workflow-draft": "automation-workflow-draft";
            "automation-draft": "automation-draft";
            "page-character": "page-character";
            "page-apps": "page-apps";
            "page-connectors": "page-connectors";
            "page-phone": "page-phone";
            "page-plugins": "page-plugins";
            "page-settings": "page-settings";
            "page-wallet": "page-wallet";
            "page-browser": "page-browser";
            "page-automations": "page-automations";
            "page-knowledge": "page-knowledge";
            "page-transcripts": "page-transcripts";
        }>>;
        automationType: z.ZodOptional<z.ZodEnum<{
            coordinator_text: "coordinator_text";
            workflow: "workflow";
        }>>;
        taskId: z.ZodOptional<z.ZodString>;
        triggerId: z.ZodOptional<z.ZodString>;
        workflowId: z.ZodOptional<z.ZodString>;
        workflowName: z.ZodOptional<z.ZodString>;
        draftId: z.ZodOptional<z.ZodString>;
        pageId: z.ZodOptional<z.ZodString>;
        sourceConversationId: z.ZodOptional<z.ZodString>;
        terminalBridgeConversationId: z.ZodOptional<z.ZodString>;
        waifuChatOwnerWallet: z.ZodOptional<z.ZodString>;
        waifuChatRole: z.ZodOptional<z.ZodEnum<{
            user: "user";
            admin: "admin";
            guest: "guest";
        }>>;
    }, z.core.$strict>, z.ZodNull]>>;
}, z.core.$strict>;
export declare const PostConversationCleanupEmptyRequestSchema: z.ZodPipe<z.ZodObject<{
    keepId: z.ZodOptional<z.ZodString>;
}, z.core.$strict>, z.ZodTransform<{
    keepId: string;
} | {
    keepId?: undefined;
}, {
    keepId?: string | undefined;
}>>;
/**
 * POST /api/conversations/dev/seed-messages (dev-only, 404 in production).
 * Shape of the backdated message-corpus seed request; bounds keep a fat-finger
 * from generating an unbounded corpus in one call.
 */
export declare const PostSeedMessagesRequestSchema: z.ZodObject<{
    conversations: z.ZodOptional<z.ZodNumber>;
    messagesPerConversation: z.ZodOptional<z.ZodNumber>;
    spanMonths: z.ZodOptional<z.ZodNumber>;
    factsPerConversation: z.ZodOptional<z.ZodNumber>;
    seed: z.ZodOptional<z.ZodNumber>;
}, z.core.$strict>;
export type ConversationMetadataInput = z.infer<typeof ConversationMetadataSchema>;
export type ConversationScope = z.infer<typeof ConversationScopeSchema>;
export type ConversationAutomationType = z.infer<typeof ConversationAutomationTypeSchema>;
export type ConversationMetadata = z.infer<typeof ConversationMetadataSchema>;
export type PostConversationRequest = z.infer<typeof PostConversationRequestSchema>;
export type PostConversationTruncateRequest = z.infer<typeof PostConversationTruncateRequestSchema>;
export type PatchConversationRequest = z.infer<typeof PatchConversationRequestSchema>;
export type PostConversationCleanupEmptyRequest = z.infer<typeof PostConversationCleanupEmptyRequestSchema>;
export type PostSeedMessagesRequest = z.infer<typeof PostSeedMessagesRequestSchema>;
//# sourceMappingURL=conversation-routes.d.ts.map