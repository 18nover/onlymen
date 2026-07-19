/**
 * Parse interaction blocks out of message text. This is a connector-agnostic
 * superset of the dashboard's per-feature parsers (`message-choice-parser`,
 * `message-form-parser`, `message-task-parser`, `message-followups-parser`) so
 * the exact same agent output renders identically on every surface.
 *
 * Wire markers:
 *   [FORM]\n{json}\n[/FORM]
 *   [CHOICE:<scope>( id=<id>)?]\n value=label …\n[/CHOICE]
 *   [FOLLOWUPS( id=<id>)?]\n <kind>:<payload>=<label> …\n[/FOLLOWUPS]
 *   [TASK:<threadId>]<title>[/TASK]
 *
 * Parsing is intentionally strict: a malformed block is left as plain text
 * rather than rendered as a broken control.
 */
import type { InteractionBlock } from "../../types/interactions.js";
/** Hard caps mirroring the dashboard parsers — keep a runaway template safe. */
export declare const MAX_FORM_FIELDS = 20;
export declare const MAX_FOLLOWUPS = 4;
export declare const MAX_TASK_TITLE_LEN = 200;
/** A parsed block together with the character region it occupied in the text. */
export interface InteractionRegion {
    start: number;
    end: number;
    block: InteractionBlock;
}
/** Find every interaction-block region in `text`, sorted by position, de-overlapped. */
export declare function findInteractionRegions(text: string): InteractionRegion[];
export interface ParsedInteractions {
    /** Blocks in document order. */
    blocks: InteractionBlock[];
    /** Message text with every block marker removed and whitespace tidied. */
    cleanedText: string;
}
/**
 * Parse `text` into its interaction blocks plus the human-readable text with
 * the markers stripped. The cleaned text is what a connector shows above the
 * native controls it renders from `blocks`.
 */
export declare function parseInteractionBlocks(text: string): ParsedInteractions;
/** True when `text` contains at least one interaction block. */
export declare function hasInteractionBlocks(text: string): boolean;
//# sourceMappingURL=parse.d.ts.map