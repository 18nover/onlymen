/**
 * Extracts the user's actual request text from a message `Memory`. Unwraps the
 * document-augmentation `<user_request>` envelope, strips a trailing
 * `[language instruction: ...]` suffix, and caps oversized input. Prefers a
 * connector's `currentMessageText` over the rendered `text`, and offers a
 * lowercased, whitespace-collapsed variant for matching.
 */
import type { Memory } from "../types/memory.js";
export declare function extractUserText(raw: string): string;
export declare function getUserMessageText(message: Pick<Memory, "content"> | null | undefined): string;
export declare function normalizeUserMessageText(message: Pick<Memory, "content"> | null | undefined): string;
/**
 * Returns true when a message's rendered `content.text` carries the document
 * augmentation envelope (the `Answer the user request using the contextual
 * documents ...` preamble wrapping the real text in `<user_request>` tags).
 *
 * The envelope is a model-facing wrapper: it is added right before the LLM
 * prompt is assembled so retrieved document context reaches the model. It must
 * never be persisted or echoed back to a client, or it renders as raw XML in
 * the user's own chat bubble and re-enters context on later turns as history.
 */
export declare function hasDocumentAugmentationEnvelope(text: unknown): boolean;
/**
 * Produces a persist-safe copy of an inbound user `Memory` whose `content.text`
 * has been stripped of the document augmentation envelope. The wrapper is added
 * transiently for the current turn's LLM prompt; the stored memory (and its
 * embedding) must hold the clean user text so the UI echo, message history, and
 * subsequent-turn context all see what the user actually typed.
 *
 * Returns the original reference unchanged when there is no envelope to strip,
 * so callers on the hot path pay nothing for the common (unaugmented) case and
 * the live in-flight message keeps its wrap for the current LLM call.
 */
export declare function stripAugmentationForPersistence<T extends Pick<Memory, "content">>(message: T): T;
//# sourceMappingURL=message-text.d.ts.map