/**
 * Creator verification data access (server-only). Never logs PII: log lines
 * carry ids and actions only. Legal name / DOB live in om_verification and the
 * 2257 snapshot; document bytes are encrypted in the private FileStore.
 */
import { createHash, randomBytes } from "node:crypto";
import { platformEnv } from "../platform/runtime.ts";
import type { Sql } from "../db";
import { encKey, encrypt, decrypt, ENC_SCHEME, fileStore } from "./storage.server.ts";
import { decisionNote, selfReviewCheck, FILE_KINDS, flagOn, stripMetadata, toAccountStatus, transition, validateFile, validateSubmission, type FileKind, type Submission, type VAction, type VStatus } from "./status.ts";

export function idVerificationEnabled(): boolean {
  return flagOn(platformEnv("ONLYMEN_ID_VERIFICATION"));
}

const newId = (p: string) => `${p}_${randomBytes(10).toString("hex")}`;

type VRow = {
  id: string; user_id: string; status: VStatus; provider: string; provider_ref: string | null;
  legal_name: string | null; dob: string | null; id_type: string | null; id_country: string | null;
  submitted_at: string | null; reviewed_at: string | null; reviewer_id: string | null; reject_reason: string | null; created_at: string;
};

export class VerificationError extends Error {}

export async function audit(db: Sql, actorId: string | null, action: string, verificationId: string | null, note: string | null = null) {
  await db`insert into om_verification_audit (actor_id, action, verification_id, note) values (${actorId}, ${action}, ${verificationId}, ${note ? note.slice(0, 200) : null})`;
}

async function syncAccount(db: Sql, userId: string, status: VStatus) {
  await db`update om_account set verification_status = ${toAccountStatus(status)}, updated_at = now() where user_id = ${userId}`;
}

export async function latestFor(db: Sql, userId: string): Promise<VRow | null> {
  const r = await db<VRow>`select * from om_verification where user_id = ${userId} order by created_at desc limit 1`;
  return r[0] ?? null;
}

export async function accountInfo(db: Sql, userId: string) {
  const r = await db<{ account_type: string; verification_status: string; role: string; username: string }>`select account_type, verification_status, role, username from om_account where user_id = ${userId}`;
  return r[0] ?? null;
}

export type MyVerification = { status: VStatus; idType: string | null; files: FileKind[]; rejectReason: string | null; submittedAt: string | null; accountType: string };

export async function myVerification(db: Sql, userId: string): Promise<MyVerification | null> {
  const acc = await accountInfo(db, userId);
  if (!acc) return null;
  const v = await latestFor(db, userId);
  const files = v ? (await db<{ kind: FileKind }>`select kind from om_verification_file where verification_id = ${v.id}`).map((f) => f.kind) : [];
  return { status: v?.status ?? "not_started", idType: v?.id_type ?? null, files, rejectReason: v?.status === "rejected" ? v.reject_reason : null, submittedAt: v?.submitted_at ?? null, accountType: acc.account_type };
}

/** The creator's open draft, creating one if the last attempt was rejected or none exists. */
async function ensureDraft(db: Sql, userId: string): Promise<VRow> {
  const v = await latestFor(db, userId);
  if (v?.status === "not_started") return v;
  if (v?.status === "pending") throw new VerificationError("Your ID is already in review.");
  if (v?.status === "approved") throw new VerificationError("You're already verified.");
  const id = newId("ver");
  await db`insert into om_verification (id, user_id, status, provider) values (${id}, ${userId}, 'not_started', 'manual')`;
  await audit(db, userId, "draft_created", id);
  return (await latestFor(db, userId))!;
}

export async function putFile(db: Sql, userId: string, kind: FileKind, raw: Uint8Array): Promise<void> {
  if (!FILE_KINDS.includes(kind)) throw new VerificationError("Unknown document.");
  const acc = await accountInfo(db, userId);
  if (acc?.account_type !== "creator") throw new VerificationError("Only creator accounts verify ID.");
  const key = encKey();
  if (!key) throw new VerificationError("Secure storage isn't set up yet. Try again later.");
  const chk = validateFile(raw);
  if (!chk.ok) throw new VerificationError(chk.error);
  const clean = stripMetadata(raw, chk.mime);
  const sha256 = createHash("sha256").update(clean).digest("hex");
  const draft = await ensureDraft(db, userId);
  const store = fileStore(db);
  const objKey = `kyc/${draft.id}/${kind}-${randomBytes(6).toString("hex")}`;
  await store.put(objKey, encrypt(key, clean, objKey));
  const prev = await db<{ id: string; r2_key: string }>`select id, r2_key from om_verification_file where verification_id = ${draft.id} and kind = ${kind}`;
  if (prev[0]) {
    await db`update om_verification_file set storage = ${store.kind}, r2_key = ${objKey}, content_type = ${chk.mime}, size = ${clean.length}, sha256 = ${sha256}, enc = ${ENC_SCHEME}, created_at = now() where id = ${prev[0].id}`;
    await store.delete(prev[0].r2_key).catch(() => {});
  } else {
    await db`insert into om_verification_file (id, verification_id, kind, storage, r2_key, content_type, size, sha256, enc)
      values (${newId("vf")}, ${draft.id}, ${kind}, ${store.kind}, ${objKey}, ${chk.mime}, ${clean.length}, ${sha256}, ${ENC_SCHEME})`;
  }
  await db`update om_verification set updated_at = now() where id = ${draft.id}`;
  await audit(db, userId, prev[0] ? "file_replaced" : "file_uploaded", draft.id, kind);
}

export async function submit(db: Sql, userId: string, sub: Submission): Promise<void> {
  const acc = await accountInfo(db, userId);
  if (acc?.account_type !== "creator") throw new VerificationError("Only creator accounts verify ID.");
  const v = await latestFor(db, userId);
  if (!v || v.status !== "not_started") {
    if (v?.status === "pending") throw new VerificationError("Your ID is already in review.");
    if (v?.status === "approved") throw new VerificationError("You're already verified.");
    throw new VerificationError("Upload your documents first.");
  }
  const files = new Set((await db<{ kind: string }>`select kind from om_verification_file where verification_id = ${v.id}`).map((f) => f.kind));
  const bad = validateSubmission(sub, files);
  if (bad) throw new VerificationError(bad);
  const t = transition(v.status, "submit", "creator");
  if (!t.ok) throw new VerificationError(t.error);
  await db`update om_verification set status = ${t.to}, legal_name = ${sub.legalName.trim().replace(/\s+/g, " ")}, dob = ${sub.dob}, id_type = ${sub.idType},
    id_country = ${(sub.idCountry ?? "").trim().slice(0, 60) || null}, submitted_at = now(), updated_at = now() where id = ${v.id} and status = 'not_started'`;
  await syncAccount(db, userId, t.to);
  await audit(db, userId, "submitted", v.id);
}

// ------------------------------------------------------------------ admin

export type QueueRow = { id: string; username: string; status: VStatus; idType: string | null; submittedAt: string | null; reviewedAt: string | null; files: number };

export async function adminQueue(db: Sql, status: VStatus | "all"): Promise<QueueRow[]> {
  const rows = await db<{ id: string; username: string | null; status: VStatus; id_type: string | null; submitted_at: string | null; reviewed_at: string | null; files: number }>`
    select v.id, a.username, v.status, v.id_type, v.submitted_at, v.reviewed_at,
      (select count(*)::int from om_verification_file f where f.verification_id = v.id) as files
    from om_verification v left join om_account a on a.user_id = v.user_id
    where (${status} = 'all' or v.status = ${status})
    order by (v.status = 'pending') desc, coalesce(v.submitted_at, v.created_at) asc
    limit 200`;
  return rows.map((r) => ({ id: r.id, username: r.username ?? "(deleted)", status: r.status, idType: r.id_type, submittedAt: iso(r.submitted_at), reviewedAt: iso(r.reviewed_at), files: Number(r.files) }));
}

const iso = (v: unknown) => (v ? new Date(v as string).toISOString() : null);

export type AdminDetail = {
  id: string; username: string; accountType: string; status: VStatus; provider: string;
  legalName: string | null; dob: string | null; idType: string | null; idCountry: string | null;
  submittedAt: string | null; reviewedAt: string | null; rejectReason: string | null;
  files: { id: string; kind: FileKind; contentType: string; size: number; sha256: string }[];
  audit: { at: string; actor: string; action: string; note: string | null }[];
};

export async function adminDetail(db: Sql, id: string): Promise<AdminDetail | null> {
  const v = (await db<VRow>`select * from om_verification where id = ${id}`)[0];
  if (!v) return null;
  const acc = await accountInfo(db, v.user_id);
  const files = await db<{ id: string; kind: FileKind; content_type: string; size: number; sha256: string }>`select id, kind, content_type, size, sha256 from om_verification_file where verification_id = ${id} order by kind`;
  const log = await db<{ at: string; actor: string | null; action: string; note: string | null }>`
    select l.at, coalesce(a.username, l.actor_id) as actor, l.action, l.note from om_verification_audit l
    left join om_account a on a.user_id = l.actor_id where l.verification_id = ${id} order by l.at desc limit 200`;
  return {
    id: v.id, username: acc?.username ?? "(deleted)", accountType: acc?.account_type ?? "?", status: v.status, provider: v.provider,
    legalName: v.legal_name, dob: v.dob, idType: v.id_type, idCountry: v.id_country,
    submittedAt: iso(v.submitted_at), reviewedAt: iso(v.reviewed_at), rejectReason: v.reject_reason,
    files: files.map((f) => ({ id: f.id, kind: f.kind, contentType: f.content_type, size: Number(f.size), sha256: f.sha256 })),
    audit: log.map((l) => ({ at: iso(l.at)!, actor: l.actor ?? "system", action: l.action, note: l.note })),
  };
}

/** Staff decision (or a vendor webhook, actor "provider:<name>"). Writes the 2257 snapshot on approval. */
export async function decide(db: Sql, actorId: string, id: string, action: Exclude<VAction, "submit">, reason?: string): Promise<VStatus> {
  const v = (await db<VRow>`select * from om_verification where id = ${id}`)[0];
  if (!v) throw new VerificationError("Unknown verification.");
  const sr = selfReviewCheck({ actorId, subjectUserId: v.user_id, action, selfReviewOn: flagOn(platformEnv("ONLYMEN_KYC_SELF_REVIEW")) });
  if (!sr.ok) throw new VerificationError(sr.error);
  const t = transition(v.status, action, "staff", { reason });
  if (!t.ok) throw new VerificationError(t.error);
  const reasonText = reason ? reason.trim().slice(0, 200) : null;
  const note = decisionNote(reason, sr.self);
  const done = await db<{ id: string }>`update om_verification set status = ${t.to}, reviewed_at = now(), reviewer_id = ${actorId},
    reject_reason = ${t.to === "rejected" ? reasonText : null}, updated_at = now() where id = ${id} and status = ${v.status} returning id`;
  if (!done.length) throw new VerificationError("Someone else just changed this. Reload.");
  if (t.to === "approved") {
    const acc = await db<{ username: string; profile: { displayName?: string } | null }>`select username, profile from om_account where user_id = ${v.user_id}`;
    const stage = [...new Set([acc[0]?.username, acc[0]?.profile?.displayName].filter((x): x is string => Boolean(x)))];
    await db`insert into om_2257_record (id, verification_id, user_id, legal_name, dob, stage_names, id_type, id_country, approved_at, approved_by)
      values (${newId("r2257")}, ${id}, ${v.user_id}, ${v.legal_name}, ${v.dob}, ${JSON.stringify(stage)}::jsonb, ${v.id_type}, ${v.id_country}, now(), ${actorId})
      on conflict (verification_id) do nothing`;
  }
  await syncAccount(db, v.user_id, t.to);
  await audit(db, actorId, action === "approve" ? "approved" : action === "reject" ? "rejected" : "revoked", id, note);
  return t.to;
}

export async function readFile(db: Sql, actorId: string, fileId: string): Promise<{ mime: string; bytes: Uint8Array } | null> {
  const f = (await db<{ verification_id: string; r2_key: string; content_type: string; kind: string }>`select verification_id, r2_key, content_type, kind from om_verification_file where id = ${fileId}`)[0];
  if (!f) return null;
  const key = encKey();
  if (!key) return null;
  const blob = await fileStore(db).get(f.r2_key);
  if (!blob) return null;
  await audit(db, actorId, "file_viewed", f.verification_id, f.kind);
  return { mime: f.content_type, bytes: decrypt(key, blob, f.r2_key) };
}
