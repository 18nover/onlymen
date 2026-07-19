import { type IAgentRuntime, type Media, type Memory } from "../../types/index.js";
type AttachmentWithInlineData = Media & {
    _data?: string;
    _mimeType?: string;
    _createdAt?: number;
    redacted?: true;
};
type ReadAttachmentResult = {
    attachment: AttachmentWithInlineData;
    content: string;
    autoSelected: boolean;
};
export declare function listConversationAttachments(runtime: IAgentRuntime, message: Memory, options?: {
    maxLookback?: number;
}): Promise<AttachmentWithInlineData[]>;
export declare function resolveAttachmentSelection(_runtime: IAgentRuntime, message: Memory, attachments: Media[]): Promise<string | null>;
export declare function readAttachmentRecord(runtime: IAgentRuntime, message: Memory, attachmentId?: string | null): Promise<ReadAttachmentResult | null>;
export declare function readAttachmentRecords(runtime: IAgentRuntime, message: Memory, attachmentId?: string | null): Promise<ReadAttachmentResult[]>;
export declare function summarizeAttachment(attachment: Media): string;
export {};
//# sourceMappingURL=attachmentContext.d.ts.map