/**
 * Serialize an interaction block back to its bracket-marker wire form. The
 * inverse of `parse` for the text-borne blocks (form / choice / followups /
 * task); lets an action build a block programmatically and emit it without
 * hand-writing markers. `secret` blocks have no text form (they travel via the
 * sensitive-request dispatch registry) and serialize to an empty string.
 */
import type { InteractionBlock } from "../../types/interactions.js";
/** Serialize a block to its wire marker. `secret` blocks return "". */
export declare function serializeInteractionBlock(block: InteractionBlock): string;
/** Append a block's marker to `text` (with a separating blank line when needed). */
export declare function appendInteractionBlock(text: string, block: InteractionBlock): string;
//# sourceMappingURL=serialize.d.ts.map