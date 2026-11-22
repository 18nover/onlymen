/**
 * Retired profile fields and tag values (ONL-11 cleanup).
 *
 * The database is shared with the production build, so nothing is dropped or
 * rewritten: this branch simply never shows or edits these values. On save,
 * whatever retired keys an account already has are carried over untouched.
 * Candidates for a later, owner-approved data cleanup (see docs/CLEANUP.md).
 */
export const RETIRED_PROFILE_KEYS = ["rates", "services", "position"] as const;
export const RETIRED_LIVE_KEYS = ["privateRate"] as const;

/** Tag values no longer offered; hidden wherever stored tags are displayed. */
export const RETIRED_TAGS = new Set(["dinner dates", "events & travel", "right now", "dates", "discreet"]);

export const visibleTags = (xs: readonly string[]) => xs.filter((x) => !RETIRED_TAGS.has(String(x).trim().toLowerCase()));

type Obj = Record<string, unknown>;

/** A copy without retired keys, with retired tag values hidden from tag lists. */
export function scrubProfile<T extends Obj>(p: T): T {
  const out: Obj = { ...p };
  for (const k of RETIRED_PROFILE_KEYS) delete out[k];
  for (const k of ["lookingFor", "interests", "tribes"]) if (Array.isArray(out[k])) out[k] = visibleTags(out[k] as string[]);
  return out as T;
}

export function scrubLive<T extends Obj>(l: T): T {
  const out: Obj = { ...l };
  for (const k of RETIRED_LIVE_KEYS) delete out[k];
  return out as T;
}

/** Retired keys present on the stored row, to carry over on save (no data loss in the shared DB). */
export function retiredCarry(stored: Obj, keys: readonly string[]): Obj {
  return Object.fromEntries(keys.filter((k) => k in stored).map((k) => [k, stored[k]]));
}

/**
 * Hidden tag values a stored list had, to carry over on save so the shared
 * DB keeps them even though this build never shows them.
 */
export function carryHiddenTags(stored: unknown, next: unknown): string[] | undefined {
  if (!Array.isArray(next)) return undefined;
  const hidden = Array.isArray(stored) ? (stored as unknown[]).map(String).filter((x) => RETIRED_TAGS.has(x.trim().toLowerCase())) : [];
  return [...(next as string[]), ...hidden.filter((h) => !(next as string[]).includes(h))];
}
