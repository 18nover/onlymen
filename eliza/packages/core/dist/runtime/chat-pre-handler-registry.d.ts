/**
 * Chat pre-handler registry.
 *
 * A per-agent store of {@link ChatPreHandler}s, registered from
 * `Plugin.chatPreHandlers`. `drain` runs them in descending `priority` order
 * and returns the first non-null result, mirroring the per-agent isolation of
 * the shortcut registry.
 */
import type { ChatPreHandler, ChatPreHandlerContext, ChatPreHandlerResult } from "../types/chat-pre-handler.js";
export declare class ChatPreHandlerRegistry {
    private readonly byId;
    register(handler: ChatPreHandler): void;
    registerMany(handlers: readonly ChatPreHandler[]): void;
    unregister(id: string): void;
    clear(): void;
    /** Handlers sorted by descending priority (ties keep insertion order). */
    list(): ChatPreHandler[];
    get size(): number;
    /** Run handlers by priority; the first non-null result wins. */
    drain(ctx: ChatPreHandlerContext): Promise<ChatPreHandlerResult | null>;
}
//# sourceMappingURL=chat-pre-handler-registry.d.ts.map