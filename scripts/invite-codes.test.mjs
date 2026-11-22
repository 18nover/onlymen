import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { CODE_ALPHABET, generateCodes, hashCode, insertSql, normalizeCode } from "./invite-codes.mjs";

test("CLI alphabet matches src/lib/invites/codes.ts", () => {
  const ts = readFileSync(new URL("../src/lib/invites/codes.ts", import.meta.url), "utf8");
  assert.match(ts, new RegExp(`CODE_ALPHABET = "${CODE_ALPHABET}"`));
});

test("CLI codes are distinct and canonical", () => {
  const codes = generateCodes(50);
  assert.equal(new Set(codes).size, 50);
  for (const c of codes) assert.equal(normalizeCode(c.toLowerCase()), c);
});

test("hash is plain SHA-256 hex of the canonical code (matches the SQL snippet)", () => {
  assert.equal(hashCode("OM-ABCD-EFGH"), createHash("sha256").update("OM-ABCD-EFGH").digest("hex"));
  assert.match(hashCode("OM-ABCD-EFGH"), /^[0-9a-f]{64}$/);
});

test("insertSql escapes the note and never contains the plain code", () => {
  const sql = insertSql(["OM-ABCD-EFGH"], { note: "Sam's crew", maxUses: 3 });
  assert.match(sql, /'Sam''s crew', 3\)/);
  assert.doesNotMatch(sql, /OM-ABCD-EFGH/);
  assert.match(sql, /'EFGH'/);
});
