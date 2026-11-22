/**
 * Creator ID verification + 2257 (ONL-9): pure rules (no I/O), unit-tested.
 *
 * Status machine (om_verification.status):
 *   not_started --submit--> pending --approve--> approved
 *                              \--reject---> rejected --(new attempt)--> not_started …
 *   approved --revoke (admin, with reason)--> rejected
 * om_account.verification_status mirrors the latest attempt
 * ('pending' is stored there as 'pending_review', the older name).
 */
export type VStatus = "not_started" | "pending" | "approved" | "rejected";
export type AccountVStatus = "not_started" | "pending_review" | "approved" | "rejected";
export type VAction = "submit" | "approve" | "reject" | "revoke";
export type IdType = "passport" | "drivers_license" | "national_id" | "state_id";
export type FileKind = "id_front" | "id_back" | "selfie_with_id";

export const V_STATUSES: readonly VStatus[] = ["not_started", "pending", "approved", "rejected"];
export const ID_TYPES: readonly IdType[] = ["passport", "drivers_license", "national_id", "state_id"];
export const FILE_KINDS: readonly FileKind[] = ["id_front", "id_back", "selfie_with_id"];
export const ID_TYPE_LABEL: Record<IdType, string> = { passport: "Passport", drivers_license: "Driver's license", national_id: "National ID card", state_id: "State ID card" };
export const FILE_KIND_LABEL: Record<FileKind, string> = { id_front: "ID — front", id_back: "ID — back", selfie_with_id: "Selfie holding ID" };

export const flagOn = (v: string | undefined | null) => String(v ?? "").trim().toLowerCase() === "on";

const NEXT: Record<VStatus, Partial<Record<VAction, VStatus>>> = {
  not_started: { submit: "pending" },
  pending: { approve: "approved", reject: "rejected" },
  approved: { revoke: "rejected" },
  rejected: {},
};

/** Who may take each action. Providers (vendor webhooks) act like staff. */
const ACTOR: Record<VAction, "creator" | "staff"> = { submit: "creator", approve: "staff", reject: "staff", revoke: "staff" };

export type Transition = { ok: true; to: VStatus } | { ok: false; error: string };

export function transition(from: VStatus, action: VAction, actor: "creator" | "staff", opts: { reason?: string } = {}): Transition {
  if (ACTOR[action] !== actor) return { ok: false, error: "Not allowed." };
  const to = NEXT[from]?.[action];
  if (!to) return { ok: false, error: `Can't ${action} a verification that is ${from.replace("_", " ")}.` };
  if ((action === "reject" || action === "revoke") && !(opts.reason ?? "").trim()) return { ok: false, error: "Give a reason." };
  return { ok: true, to };
}

/**
 * Own-verification rule. Approving/rejecting your OWN verification is refused
 * unless ONLYMEN_KYC_SELF_REVIEW=on (solo operator). Allowed self-reviews are
 * tagged so the audit note says so. Revoking your own approval is always allowed.
 */
export function selfReviewCheck(o: { actorId: string; subjectUserId: string; action: Exclude<VAction, "submit">; selfReviewOn: boolean }): { ok: true; self: boolean } | { ok: false; error: string } {
  const self = o.actorId === o.subjectUserId;
  if (self && o.action !== "revoke" && !o.selfReviewOn) return { ok: false, error: "You can't review your own verification. Ask another admin, or see docs/VERIFICATION.md." };
  return { ok: true, self };
}

export const SELF_REVIEW_TAG = "self-review";

/** Audit note for a decision: reason (if any), prefixed with the self-review tag when applicable. */
export function decisionNote(reason: string | undefined, self: boolean): string | null {
  const r = (reason ?? "").trim().slice(0, 180);
  if (self) return r ? `${SELF_REVIEW_TAG}: ${r}` : SELF_REVIEW_TAG;
  return r || null;
}

export function toAccountStatus(s: VStatus | null | undefined): AccountVStatus {
  if (s === "pending") return "pending_review";
  if (s === "approved" || s === "rejected") return s;
  return "not_started";
}

/** Can this creator publish explicit content / go live? Only with an approved verification (when the flag is on). */
export function mayPublishExplicit(opts: { flag: boolean; accountType: string; accountStatus: string | null | undefined }): boolean {
  if (!opts.flag) return true;
  return opts.accountType === "creator" && opts.accountStatus === "approved";
}

export const VERIFY_PATH = "/me/verify";
export const VERIFY_REQUIRED_MSG = `Verify your ID first. Only ID-verified creators can go live or post explicit photos. Go to ${VERIFY_PATH}.`;

/**
 * Server-side enforcement for a profile save. Returns an error message when the
 * save would start a live session or newly mark a photo explicit without an
 * approved verification; null when allowed. Already-live sessions can still be
 * ended, and photos already marked explicit are left alone.
 */
export function explicitPublishViolation(o: { flag: boolean; accountType: string; accountStatus: string; startingLive: boolean; newlyExplicit: boolean }): string | null {
  if (!o.flag || mayPublishExplicit(o)) return null;
  return o.startingLive || o.newlyExplicit ? VERIFY_REQUIRED_MSG : null;
}

// ------------------------------------------------------------------ submission

export function ageOn(dob: string, now = new Date()): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  let age = now.getUTCFullYear() - y;
  if (now.getUTCMonth() + 1 < mo || (now.getUTCMonth() + 1 === mo && now.getUTCDate() < d)) age--;
  return age;
}

export type Submission = { legalName: string; dob: string; idType: string; idCountry?: string };

export function requiredKinds(idType: string): FileKind[] {
  return idType === "passport" ? ["id_front", "selfie_with_id"] : ["id_front", "id_back", "selfie_with_id"];
}

/** Returns an error message, or null when the submission is complete. */
export function validateSubmission(s: Submission, filesPresent: ReadonlySet<string>, now = new Date()): string | null {
  const name = s.legalName.trim();
  if (name.length < 3 || name.length > 120 || name.split(/\s+/).length < 2) return "Enter your full legal name exactly as on your ID.";
  const age = ageOn(s.dob, now);
  if (age === null || age > 120) return "Enter a valid date of birth.";
  if (age < 18) return "You must be 18 or older to be a creator.";
  if (!(ID_TYPES as readonly string[]).includes(s.idType)) return "Choose your ID type.";
  for (const k of requiredKinds(s.idType)) if (!filesPresent.has(k)) return `Upload: ${FILE_KIND_LABEL[k]}.`;
  return null;
}

// ------------------------------------------------------------------ files

export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export type DocMime = "image/jpeg" | "image/png" | "image/webp" | "image/heic" | "application/pdf";

/** Detect the real type from magic bytes (never trust the browser's mime). */
export function sniffDocType(buf: Uint8Array): DocMime | null {
  const at = (i: number, s: string) => [...s].every((c, j) => buf[i + j] === c.charCodeAt(0));
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && at(1, "PNG")) return "image/png";
  if (at(0, "RIFF") && at(8, "WEBP")) return "image/webp";
  if (at(4, "ftyp") && ["heic", "heix", "heim", "heis", "mif1", "msf1", "hevc"].some((b) => at(8, b))) return "image/heic";
  if (at(0, "%PDF-")) return "application/pdf";
  return null;
}

export function validateFile(buf: Uint8Array): { ok: true; mime: DocMime } | { ok: false; error: string } {
  if (!buf.length) return { ok: false, error: "That file is empty." };
  if (buf.length > MAX_FILE_BYTES) return { ok: false, error: "That file is over 4 MB." };
  const mime = sniffDocType(buf);
  if (!mime) return { ok: false, error: "Use a JPEG, PNG, WebP, HEIC photo or a PDF." };
  return { ok: true, mime };
}

/** Remove JPEG APP1 (EXIF/XMP, incl. GPS) and comment segments. Returns the input if it can't parse. */
export function stripJpegMetadata(buf: Uint8Array): Uint8Array {
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return buf;
  const out: Uint8Array[] = [buf.subarray(0, 2)];
  let i = 2;
  while (i + 4 <= buf.length) {
    if (buf[i] !== 0xff) return buf;
    const marker = buf[i + 1];
    if (marker === 0xda) {
      out.push(buf.subarray(i)); // start of scan: rest is image data
      return concat(out);
    }
    const len = (buf[i + 2] << 8) | buf[i + 3];
    if (len < 2 || i + 2 + len > buf.length) return buf;
    const drop = marker === 0xe1 || marker === 0xfe; // APP1 (Exif/XMP), COM
    if (!drop) out.push(buf.subarray(i, i + 2 + len));
    i += 2 + len;
  }
  return buf;
}

/** Remove PNG metadata chunks (eXIf, tEXt, iTXt, zTXt, tIME). */
export function stripPngMetadata(buf: Uint8Array): Uint8Array {
  if (buf[0] !== 0x89) return buf;
  const out: Uint8Array[] = [buf.subarray(0, 8)];
  let i = 8;
  while (i + 12 <= buf.length) {
    const len = ((buf[i] << 24) | (buf[i + 1] << 16) | (buf[i + 2] << 8) | buf[i + 3]) >>> 0;
    const type = String.fromCharCode(buf[i + 4], buf[i + 5], buf[i + 6], buf[i + 7]);
    const end = i + 12 + len;
    if (end > buf.length) return buf;
    if (!["eXIf", "tEXt", "iTXt", "zTXt", "tIME"].includes(type)) out.push(buf.subarray(i, end));
    i = end;
    if (type === "IEND") return concat(out);
  }
  return buf;
}

export function stripMetadata(buf: Uint8Array, mime: DocMime): Uint8Array {
  if (mime === "image/jpeg") return stripJpegMetadata(buf);
  if (mime === "image/png") return stripPngMetadata(buf);
  return buf; // WebP/HEIC/PDF: not stripped server-side (the browser re-encodes photos to JPEG first)
}

function concat(parts: Uint8Array[]): Uint8Array {
  const n = parts.reduce((a, p) => a + p.length, 0);
  const o = new Uint8Array(n);
  let off = 0;
  for (const p of parts) {
    o.set(p, off);
    off += p.length;
  }
  return o;
}
