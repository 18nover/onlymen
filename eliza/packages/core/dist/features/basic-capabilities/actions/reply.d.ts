import type { Action } from "../../../types/index.js";
export interface ReplyQuestionOption {
    label: string;
    description?: string;
    preview?: string;
}
export interface ReplyQuestion {
    question: string;
    header: string;
    options?: ReplyQuestionOption[];
    multiSelect?: boolean;
}
export declare const replyAction: Action;
//# sourceMappingURL=reply.d.ts.map