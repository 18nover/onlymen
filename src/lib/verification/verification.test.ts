import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import {
  ageOn, explicitPublishViolation, mayPublishExplicit, requiredKinds, sniffDocType, stripJpegMetadata, stripPngMetadata,
  toAccountStatus, transition, selfReviewCheck, decisionNote, validateFile, validateSubmission, VERIFY_REQUIRED_MSG, MAX_FILE_BYTES,
} from "./status.ts";
import { decrypt, encrypt } from "./storage.server.ts";
import { manualProvider, providerByName } from "./providers.ts";

test("status machine: creator submits, staff decides", () => {
  assert.deepEqual(transition("not_started", "submit", "creator"), { ok: true, to: "pending" });
  assert.deepEqual(transition("pending", "approve", "staff"), { ok: true, to: "approved" });
  assert.deepEqual(transition("pending", "reject", "staff", { reason: "Blurry" }), { ok: true, to: "rejected" });
  assert.deepEqual(transition("approved", "revoke", "staff", { reason: "Expired ID" }), { ok: true, to: "rejected" });
});

test("status machine: illegal moves are refused", () => {
  assert.equal(transition("pending", "approve", "creator").ok, false); // creators can't approve themselves
  assert.equal(transition("not_started", "submit", "staff").ok, false);
  assert.equal(transition("not_started", "approve", "staff").ok, false); // must be submitted first
  assert.equal(transition("approved", "approve", "staff").ok, false);
  assert.equal(transition("rejected", "approve", "staff").ok, false); // a new attempt is a new row
  assert.equal(transition("pending", "reject", "staff").ok, false); // reason required
  assert.equal(transition("pending", "reject", "staff", { reason: "  " }).ok, false);
});

test("account status mirror", () => {
  assert.equal(toAccountStatus("pending"), "pending_review");
  assert.equal(toAccountStatus("approved"), "approved");
  assert.equal(toAccountStatus("rejected"), "rejected");
  assert.equal(toAccountStatus("not_started"), "not_started");
  assert.equal(toAccountStatus(null), "not_started");
});

test("enforcement: only approved creators go live or add explicit photos (flag on)", () => {
  const base = { flag: true, accountType: "creator", startingLive: true, newlyExplicit: false };
  for (const st of ["not_started", "pending_review", "rejected"]) assert.equal(explicitPublishViolation({ ...base, accountStatus: st }), VERIFY_REQUIRED_MSG, st);
  assert.equal(explicitPublishViolation({ ...base, accountStatus: "approved" }), null);
  assert.equal(explicitPublishViolation({ ...base, startingLive: false, newlyExplicit: true, accountStatus: "pending_review" }), VERIFY_REQUIRED_MSG);
  assert.equal(explicitPublishViolation({ ...base, startingLive: false, newlyExplicit: true, accountType: "member", accountStatus: "approved" }), VERIFY_REQUIRED_MSG);
  // Ordinary profile edits, ending a live session, keeping old photos: allowed.
  assert.equal(explicitPublishViolation({ ...base, startingLive: false, accountStatus: "not_started" }), null);
  // Flag off (Vercel today): unchanged behaviour.
  assert.equal(explicitPublishViolation({ ...base, flag: false, accountStatus: "not_started" }), null);
  assert.equal(mayPublishExplicit({ flag: false, accountType: "member", accountStatus: "" }), true);
});

test("submission: 18+, full name, ID type, required files", () => {
  const now = new Date("2026-11-22T12:00:00Z");
  const all = new Set(["id_front", "id_back", "selfie_with_id"]);
  const ok = { legalName: "Test Person", dob: "1990-01-01", idType: "drivers_license" };
  assert.equal(validateSubmission(ok, all, now), null);
  assert.match(validateSubmission({ ...ok, dob: "2008-11-23" }, all, now)!, /18 or older/);
  assert.equal(validateSubmission({ ...ok, dob: "2008-11-22" }, all, now), null); // 18th birthday today
  assert.match(validateSubmission({ ...ok, dob: "1990-02-30" }, all, now)!, /valid date/);
  assert.match(validateSubmission({ ...ok, legalName: "Mononym" }, all, now)!, /legal name/);
  assert.match(validateSubmission({ ...ok, idType: "library_card" }, all, now)!, /ID type/);
  assert.match(validateSubmission(ok, new Set(["id_front", "selfie_with_id"]), now)!, /back/);
  assert.equal(validateSubmission({ ...ok, idType: "passport" }, new Set(["id_front", "selfie_with_id"]), now), null);
  assert.deepEqual(requiredKinds("passport"), ["id_front", "selfie_with_id"]);
  assert.equal(ageOn("2000-06-15", now), 26);
});

test("files: magic-byte types and size limit", () => {
  const pad = (h: number[]) => new Uint8Array([...h, ...new Array(16).fill(0)]);
  const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
  assert.equal(sniffDocType(pad([0xff, 0xd8, 0xff, 0xe0])), "image/jpeg");
  assert.equal(sniffDocType(pad([0x89, ...ascii("PNG")])), "image/png");
  assert.equal(sniffDocType(pad([...ascii("RIFF"), 0, 0, 0, 0, ...ascii("WEBP")])), "image/webp");
  assert.equal(sniffDocType(pad([0, 0, 0, 0x18, ...ascii("ftypheic")])), "image/heic");
  assert.equal(sniffDocType(pad(ascii("%PDF-1.7"))), "application/pdf");
  assert.equal(sniffDocType(pad(ascii("<html><script>"))), null);
  assert.equal(validateFile(new Uint8Array(MAX_FILE_BYTES + 1).fill(0xff)).ok, false);
  assert.equal(validateFile(new Uint8Array(0)).ok, false);
});

test("EXIF/GPS stripped from JPEG; PNG text chunks removed", () => {
  const seg = (m: number, body: number[]) => [0xff, m, ((body.length + 2) >> 8) & 0xff, (body.length + 2) & 0xff, ...body];
  const exif = seg(0xe1, [...[..."Exif"].map((c) => c.charCodeAt(0)), 0, 0, 1, 2, 3, 4]);
  const app0 = seg(0xe0, [1, 2, 3]);
  const jpeg = new Uint8Array([0xff, 0xd8, ...app0, ...exif, 0xff, 0xda, 0, 2, 9, 9, 0xff, 0xd9]);
  const out = stripJpegMetadata(jpeg);
  assert.equal(out.length, jpeg.length - exif.length);
  assert.ok(!Buffer.from(out).includes(Buffer.from("Exif")));
  assert.deepEqual([...out.subarray(-6)], [0xff, 0xda, 0, 2, 9, 9].concat([0xff, 0xd9]).slice(-6));

  const chunk = (type: string, data: number[]) => [0, 0, 0, data.length, ...[...type].map((c) => c.charCodeAt(0)), ...data, 0, 0, 0, 0];
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const png = new Uint8Array([...sig, ...chunk("IHDR", [1, 2]), ...chunk("tEXt", [7, 7, 7]), ...chunk("IDAT", [5]), ...chunk("IEND", [])]);
  const p2 = stripPngMetadata(png);
  assert.equal(p2.length, png.length - 15);
  assert.ok(!Buffer.from(p2).includes(Buffer.from("tEXt")));
});

test("storage encryption: AES-256-GCM round trip, bound to its key", () => {
  const key = randomBytes(32);
  const plain = new Uint8Array(randomBytes(1000));
  const blob = encrypt(key, plain, "kyc/ver_1/id_front-a");
  assert.notDeepEqual(blob.subarray(28, 60), plain.subarray(0, 32));
  assert.deepEqual(decrypt(key, blob, "kyc/ver_1/id_front-a"), plain);
  assert.throws(() => decrypt(key, blob, "kyc/ver_2/id_front-a"));
  assert.throws(() => decrypt(randomBytes(32), blob, "kyc/ver_1/id_front-a"));
});

test("KYC provider is pluggable; manual is the default, unknown names don't silently fall back", async () => {
  assert.equal(providerByName(undefined), manualProvider);
  assert.equal(providerByName("manual"), manualProvider);
  assert.equal(providerByName("veriff"), null);
  assert.deepEqual(await manualProvider.startSession({ userId: "u", verificationId: "v", returnUrl: "/" }), { kind: "form", url: "/me/verify" });
});

test("self-review: refused when off, allowed + tagged in the audit note when on", () => {
  const own = { actorId: "u1", subjectUserId: "u1" };
  assert.equal(selfReviewCheck({ ...own, action: "approve", selfReviewOn: false }).ok, false);
  assert.equal(selfReviewCheck({ ...own, action: "reject", selfReviewOn: false }).ok, false);
  assert.deepEqual(selfReviewCheck({ ...own, action: "approve", selfReviewOn: true }), { ok: true, self: true });
  assert.deepEqual(selfReviewCheck({ ...own, action: "revoke", selfReviewOn: false }), { ok: true, self: true });
  assert.deepEqual(selfReviewCheck({ actorId: "admin", subjectUserId: "u1", action: "approve", selfReviewOn: false }), { ok: true, self: false });
  assert.equal(decisionNote(undefined, true), "self-review");
  assert.equal(decisionNote("Blurry", true), "self-review: Blurry");
  assert.equal(decisionNote(undefined, false), null);
  assert.equal(decisionNote(" Blurry ", false), "Blurry");
  // Self-review never lets a creator act as staff: approval stays staff-only.
  assert.equal(transition("pending", "approve", "creator").ok, false);
});
