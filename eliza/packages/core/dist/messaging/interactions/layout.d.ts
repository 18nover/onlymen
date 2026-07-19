/**
 * Project an interaction block onto platform-neutral button rows that each
 * connector maps to its native primitive (Telegram inline keyboard, Discord
 * action rows). Centralizing the projection here keeps every connector's
 * rendering consistent and the per-connector glue thin.
 *
 * Buttons round-trip via `callbackData` (the user's answer, re-injected as a
 * message) or open a `url` (link-out for secret entry and task views). A button
 * always carries exactly one of the two.
 */
import type { InteractionBlock } from "../../types/interactions.js";
import type { Content } from "../../types/primitives.js";
export interface NeutralButton {
    label: string;
    /** Re-inject this text as a user message when tapped. */
    callbackData?: string;
    /** Open this URL when tapped (link-out). */
    url?: string;
    style?: "primary" | "secondary" | "danger";
}
export interface NeutralRow {
    buttons?: NeutralButton[];
}
export interface NeutralLayout {
    /** Prompt / title shown above the controls. */
    text?: string;
    rows: NeutralRow[];
    /**
     * True when the block could not be rendered as native controls (e.g. a form
     * with no link-out URL available) and the connector should fall back to a
     * free-text reply flow.
     */
    needsFallback?: boolean;
}
export interface PlainTextFallbackOptions {
    /** Resolve an external entry URL for task or navigate blocks. */
    resolveUrl?: (block: InteractionBlock) => string | undefined;
    /** Resolve an external URL for a `navigate` followup chip. */
    resolveNavigateUrl?: (payload: string) => string | undefined;
}
export interface LayoutOptions {
    /**
     * Resolve an external entry URL for blocks that link out: secret/OAuth entry
     * and the task view. Returning undefined marks the block as needing a
     * free-text fallback (this is the designed path for `form` blocks, which have
     * no hosted page — see {@link buildInteractionUrlResolver}).
     */
    resolveUrl?: (block: InteractionBlock) => string | undefined;
    /**
     * Resolve an external URL for a `navigate` followup chip (payload is a viewId
     * or `/`-prefixed path). When provided, navigate chips render as link-out
     * buttons instead of being re-injected as a reply. Returning undefined keeps
     * the reply-callback behavior.
     */
    resolveNavigateUrl?: (payload: string) => string | undefined;
    /** Buttons per row before wrapping (Telegram ~8, Discord 5). Default 3. */
    maxButtonsPerRow?: number;
    /**
     * Native callback payload budget for reply buttons. Defaults to Telegram's
     * 64-byte `callback_data` limit; Discord passes its 100-character custom_id
     * budget so valid Discord buttons are not forced into free-text fallback.
     */
    maxCallbackBytes?: number;
}
/**
 * Copy appended to a form block's prose when it cannot render natively and no
 * link-out URL exists — the free-text fallback affordance connectors show
 * instead of a dead button (#14321).
 */
export declare const FORM_FREE_TEXT_INVITE = "Reply with your answer.";
/** Build a platform-neutral control layout for a single interaction block. */
export declare function toNeutralLayout(block: InteractionBlock, opts?: LayoutOptions): NeutralLayout;
/** Project a block onto text-only transports such as SMS/iMessage. */
export declare function toPlainTextFallback(block: InteractionBlock, opts?: PlainTextFallbackOptions): string | undefined;
/**
 * Render interaction-bearing text for button-less transports before their own
 * chunking layer sees the message. This strips every marker body and appends
 * the text fallback for each parsed block, so long form JSON cannot be split
 * into user-visible bracket fragments.
 */
export declare function renderInteractionsAsPlainText(text: string | undefined | null, opts?: PlainTextFallbackOptions): {
    text: string;
    hadBlocks: boolean;
};
/**
 * Render a full `Content` object for a text-only transport. When the runtime has
 * already normalized typed `interactions`, those blocks are authoritative; this
 * preserves out-of-band secret/OAuth requests that do not have a bracket-marker
 * text representation.
 */
export declare function renderContentInteractionsAsPlainText(content: Pick<Content, "text" | "interactions"> | undefined | null, opts?: PlainTextFallbackOptions): {
    text: string;
    hadBlocks: boolean;
};
/**
 * Build the canonical link-out resolvers connectors pass to {@link toNeutralLayout}
 * so Telegram, Discord, and any other surface produce identical URLs for task
 * and navigate blocks. `appBaseUrl` is the deployment's app/dashboard origin
 * (`ELIZA_APP_URL`, falling back to the cloud URL). Returns `undefined`
 * resolvers when no base URL is configured, which keeps the free-text fallback.
 *
 * `form` blocks are intentionally NOT resolved: there is no hosted `/forms/:id`
 * page and form specs are never persisted, so any link-out would be a dead
 * route. Leaving them unresolved routes them to the layout's free-text reply
 * fallback instead of fabricating a healthy-looking dead control (#14321).
 */
export declare function buildInteractionUrlResolver(appBaseUrl: string | undefined | null): Pick<LayoutOptions, "resolveUrl" | "resolveNavigateUrl">;
//# sourceMappingURL=layout.d.ts.map