/**
 * AgentEventService bridge
 *
 * The runtime emits coarse lifecycle telemetry on the {@link EventType} bus
 * (`RUN_STARTED`, `ACTION_STARTED`, `EVALUATOR_STARTED`, …). Separately,
 * {@link AgentEventService} exposes a fully-typed per-run stream taxonomy
 * (`lifecycle | action | evaluator | tool | provider | …`) that the agent HTTP
 * server broadcasts to WS clients as `agent_event` messages.
 *
 * Historically the `AgentEventService` `action` / `evaluator` / `lifecycle`
 * streams were dead — the `emit*` helpers existed but had no call sites, so the
 * WS channel never carried per-turn phase data. This module is the single
 * bridge that maps the {@link EventType} bus → `AgentEventService` streams
 * (option (b) from issue #8813): one place to wire, every existing event lights
 * up for free, and the streams become reusable beyond the chat indicator.
 *
 * The bridge is intentionally defensive: it resolves `AgentEventService`
 * lazily, no-ops when the service is not hosted (core-only tests, headless
 * tools), and never throws back into the hot message loop.
 */
import type { ActionEventPayload, EvaluatorEventPayload, MessagePayload, RunEventPayload } from "../types/events.js";
export declare const CONNECTOR_MESSAGE_RECEIVED_EVENT_TYPES: readonly ["line:message_received", "GOOGLE_CHAT_MESSAGE_RECEIVED", "TWITCH_MESSAGE_RECEIVED", "NOSTR_MESSAGE_RECEIVED"];
/**
 * Bridge connector-specific inbound message events that do not yet emit the
 * canonical `EventType.MESSAGE_RECEIVED` payload. This is intentionally
 * activity/notification-only: it never runs the message loop or sends replies.
 */
export declare function bridgeConnectorMessageReceivedToStreams(eventType: string, payload: unknown): Promise<void>;
/**
 * Bridge `MESSAGE_RECEIVED` → AgentEventService `message` stream and, for real
 * external connector traffic, a canonical user-facing notification.
 */
export declare function bridgeMessageReceivedToStreams(payload: MessagePayload): Promise<void>;
/**
 * Bridge `ACTION_STARTED` → AgentEventService `action` + `lifecycle` streams.
 */
export declare function bridgeActionStartedToStreams(payload: ActionEventPayload): void;
/**
 * Bridge `ACTION_COMPLETED` → AgentEventService `action` + `lifecycle` streams.
 */
export declare function bridgeActionCompletedToStreams(payload: ActionEventPayload): void;
/**
 * Bridge `RUN_STARTED` → AgentEventService `lifecycle` stream.
 */
export declare function bridgeRunStartedToStreams(payload: RunEventPayload): void;
/**
 * Bridge `RUN_ENDED` → AgentEventService `lifecycle` stream.
 */
export declare function bridgeRunEndedToStreams(payload: RunEventPayload): void;
/**
 * Bridge `EVALUATOR_STARTED` → AgentEventService `evaluator` stream.
 */
export declare function bridgeEvaluatorStartedToStreams(payload: EvaluatorEventPayload): void;
/**
 * Bridge `EVALUATOR_COMPLETED` → AgentEventService `evaluator` stream.
 */
export declare function bridgeEvaluatorCompletedToStreams(payload: EvaluatorEventPayload): void;
//# sourceMappingURL=agent-event-bridge.d.ts.map