/**
 * Single-source SSE contract for the chat turn: the phases the agent reports
 * mid-turn and the discriminator it returns when a turn fails. Both the agent
 * server (chat/conversation SSE emission) and the UI client (SSE parsing +
 * render) import these here so the wire format is declared exactly once and the
 * two sides cannot drift (#12409, parent #12093).
 */
export {};
//# sourceMappingURL=chat.js.map