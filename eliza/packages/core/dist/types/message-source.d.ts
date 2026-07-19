/**
 * Well-known `source` sentinels for messages the agent originates or routes
 * internally (client chat, sub-agent, coding-agent, agent greeting), so routing
 * and gating code can branch on provenance without magic strings.
 */
export declare const MESSAGE_SOURCE_CLIENT_CHAT: "client_chat";
export declare const MESSAGE_SOURCE_SUB_AGENT: "sub_agent";
export declare const MESSAGE_SOURCE_CODING_AGENT: "coding-agent";
export declare const MESSAGE_SOURCE_AGENT_GREETING: "agent_greeting";
export declare const MESSAGE_SOURCES: {
    readonly CLIENT_CHAT: "client_chat";
    readonly SUB_AGENT: "sub_agent";
    readonly CODING_AGENT: "coding-agent";
    readonly AGENT_GREETING: "agent_greeting";
};
export type MessageSourceSentinel = (typeof MESSAGE_SOURCES)[keyof typeof MESSAGE_SOURCES];
//# sourceMappingURL=message-source.d.ts.map