/**
 * Shortcut registry + matcher (#8791).
 *
 * `ShortcutRegistry` is a per-agent store of `ShortcutDefinition`s (mirroring
 * the per-agentId pattern of the slash-command registry). `matchShortcut` is a
 * pure, tiered matcher:
 *
 *   1. Explicit tier — slash/`!` aliases, exact/prefix. Unambiguous, confidence 1.
 *   2. Natural tier  — anchored regex / slot-template patterns over normalized
 *      text (ASR-tolerant), with a confidence floor and ambiguity refusal.
 *
 * Explicit always wins. Natural matches that tie within an epsilon are refused
 * (return null) so the turn falls through to the LLM instead of guessing.
 */
import type { ShortcutDefinition, ShortcutMatch, ShortcutMatchContext } from "../types/shortcut.js";
/** Natural-language matches below this confidence never short-circuit. */
export declare const SHORTCUT_CONFIDENCE_FLOOR = 0.6;
/** Two natural matches within this confidence gap are "ambiguous" → defer to LLM. */
export declare const SHORTCUT_AMBIGUITY_EPSILON = 0.1;
/**
 * Normalize text for natural-language matching: lowercase, strip surrounding
 * whitespace, drop leading wake/filler words and a trailing "please", remove
 * punctuation an ASR transcript wouldn't reliably produce, and collapse runs of
 * whitespace. Slash/`!` prefixes are NOT normalized away (explicit matching uses
 * the raw text).
 */
export declare function normalizeForMatch(text: string): string;
/**
 * Compile a slot template like `"open {section}"` to an anchored regex with
 * named capture groups. Slots capture whole words (joined by single spaces) and
 * never include the separating whitespace, so `"open settings"` → `section:
 * "settings"` and `"set thinking to high"` → `field: "thinking"`, `level: "high"`.
 */
export declare function compileTemplate(template: string): RegExp;
/**
 * Expose the command behind a connector-native mention to the deterministic
 * shortcut gate. Inner mentions remain arguments.
 */
export declare function stripLeadingMentionForShortcut(text: string): string;
/**
 * Match `text` against `definitions`. Returns the resolved shortcut + extracted
 * slots + confidence, or `null` when nothing matches confidently/unambiguously.
 */
export declare function matchShortcut(definitions: readonly ShortcutDefinition[], text: string, context?: ShortcutMatchContext): ShortcutMatch | null;
/**
 * Per-agent shortcut store. Mirrors the slash-command registry's per-agentId
 * isolation so multi-agent deployments don't share shortcut state.
 */
export declare class ShortcutRegistry {
    private readonly byId;
    register(definition: ShortcutDefinition): void;
    registerMany(definitions: readonly ShortcutDefinition[]): void;
    unregister(id: string): void;
    clear(): void;
    list(): ShortcutDefinition[];
    get size(): number;
    match(text: string, context?: ShortcutMatchContext): ShortcutMatch | null;
}
//# sourceMappingURL=shortcut-registry.d.ts.map