/**
 * REPLY_CONTEXT provider — when the incoming message is an explicit reply to
 * an earlier message (`content.inReplyTo`), pulls that replied-to message plus
 * a small window of surrounding turns into the prompt so the model reads the
 * reply against the exchange it belongs to, not just the tail of the recent
 * transcript. The reply id reaches `content.inReplyTo` from the dashboard reply
 * affordance (the API boundary lifts `metadata.replyToMessageId` into it — see
 * packages/agent buildUserMessages) and from connectors that map platform reply
 * threading onto the field.
 *
 * Renders nothing on ordinary (non-reply) turns — the only cost on the happy
 * path is one field check. Surrounding turns already visible in the
 * RECENT_MESSAGES window are deduped away so the transcript is never repeated;
 * the replied-to message itself is always identified (one bounded line) because
 * the transcript format gives the model no other way to tell WHICH earlier
 * message the user meant. A reply id that resolves to another room is ignored —
 * same forged-pivot guard as the conversation `?around` window.
 */
import type { Provider } from "../../../types/index.js";
/** Turns fetched on EACH side of the replied-to message. */
export declare const REPLY_CONTEXT_WINDOW_RADIUS = 3;
export declare const replyContextProvider: Provider;
//# sourceMappingURL=replyContext.d.ts.map