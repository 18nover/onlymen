/**
 * Invite codes — pure helpers (no I/O), shared by the server, the admin page,
 * the CLI (scripts/invite-codes.mjs mirrors these) and unit tests.
 *
 * Format: OM-XXXX-XXXX from a 31-character alphabet with no look-alikes
 * (no 0/O, 1/I/L). 8 random characters ≈ 39.6 bits from crypto.getRandomValues
 * with rejection sampling (no modulo bias).
 */
export const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const CODE_PREFIX = "OM";
const BODY_LEN = 8;

type RandomSource = (buf: Uint8Array) => Uint8Array;
const defaultRandom: RandomSource = (buf) => globalThis.crypto.getRandomValues(buf);

/** One fresh code, e.g. "OM-7K3Q-HX9D". */
export function generateCode(random: RandomSource = defaultRandom): string {
  const n = CODE_ALPHABET.length;
  const limit = 256 - (256 % n); // reject bytes >= limit to avoid modulo bias
  let body = "";
  while (body.length < BODY_LEN) {
    for (const b of random(new Uint8Array(16))) {
      if (b < limit) body += CODE_ALPHABET[b % n];
      if (body.length === BODY_LEN) break;
    }
  }
  return `${CODE_PREFIX}-${body.slice(0, 4)}-${body.slice(4)}`;
}

/** `count` distinct codes. */
export function generateCodes(count: number, random: RandomSource = defaultRandom): string[] {
  const out = new Set<string>();
  while (out.size < count) out.add(generateCode(random));
  return [...out];
}

/**
 * Canonical form of whatever the person typed ("om 7k3q hx9d", "OM-7K3Q-HX9D ",
 * "7K3QHX9D" …) or null if it can't be a code. Look-alikes (0/O, 1/I/L) are
 * never in a real code, so they are rejected rather than guessed.
 */
export function normalizeCode(input: string | null | undefined): string | null {
  let s = String(input ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.length === BODY_LEN + CODE_PREFIX.length && s.startsWith(CODE_PREFIX)) s = s.slice(CODE_PREFIX.length);
  if (s.length !== BODY_LEN) return null;
  for (const ch of s) if (!CODE_ALPHABET.includes(ch)) return null;
  return `${CODE_PREFIX}-${s.slice(0, 4)}-${s.slice(4)}`;
}

/** Last 4 characters, shown in the admin list so Jerry can match a code. */
export function codeHint(code: string): string {
  return code.slice(-4);
}

export type InviteStatus = "active" | "used" | "revoked";

export function inviteStatus(row: { revoked_at?: unknown; use_count: number; max_uses: number }): InviteStatus {
  if (row.revoked_at) return "revoked";
  if (row.use_count >= row.max_uses) return "used";
  return "active";
}

/** Friendly messages for the sign-up form. */
export const INVITE_ERRORS = {
  missing: "Enter your invite code. OnlyMen is invite-only for now.",
  invalid: "That invite code isn't valid. Check it and try again.",
  used: "That invite code has already been used.",
  revoked: "That invite code is no longer active.",
  rateLimited: "Too many attempts. Please wait 15 minutes and try again.",
} as const;
