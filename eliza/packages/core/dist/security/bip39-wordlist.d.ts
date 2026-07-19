/**
 * Canonical BIP-39 English wordlist (2048 words, public domain — from
 * bitcoin/bips bip-0039/english.txt). Used by the seed-phrase detector to keep
 * false positives near zero: a candidate must be all-BIP-39 words AND pass the
 * BIP-39 checksum, so an ordinary English sentence of common words is rejected.
 */
export declare const BIP39_WORDLIST: readonly string[];
export declare const BIP39_WORD_SET: ReadonlySet<string>;
export declare const BIP39_WORD_INDEX: ReadonlyMap<string, number>;
/**
 * Validate a BIP-39 mnemonic: every word must be in the wordlist AND the
 * trailing checksum bits must match `SHA-256(entropy)`. The checksum is what
 * keeps false positives near zero — only ~1/2^(ENT/32) random in-wordlist
 * phrases pass, so an ordinary sentence of common words is rejected.
 */
export declare function mnemonicValid(phrase: string): boolean;
/** A detected mnemonic span: the exact substring and its position in `text`. */
export interface MnemonicSpan {
    value: string;
    start: number;
    end: number;
}
/**
 * Locate ALL non-overlapping valid BIP-39 mnemonic windows in `text`. A bare
 * regex over a word run grabs the surrounding words ("seed: abandon … about.
 * then") and fails the checksum on the wrong word count, and two adjacent
 * phrases in one run would leave the second unswapped — so this slides over the
 * candidate tokens (longest count first), requires consecutive words be
 * whitespace-adjacent (a skipped long word cannot bridge non-adjacent
 * fragments), and advances past each accepted window so every phrase is found.
 */
export declare function findAllMnemonicPhrases(text: string): MnemonicSpan[];
/** The first valid mnemonic window in `text`, or null. */
export declare function findMnemonicPhrase(text: string): string | null;
//# sourceMappingURL=bip39-wordlist.d.ts.map