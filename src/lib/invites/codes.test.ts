import { test } from "node:test";
import assert from "node:assert/strict";
import { CODE_ALPHABET, codeHint, generateCode, generateCodes, inviteStatus, normalizeCode } from "./codes.ts";

test("generated codes are well-formed and unambiguous", () => {
  for (let i = 0; i < 500; i++) {
    const c = generateCode();
    assert.match(c, /^OM-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/);
    assert.equal(normalizeCode(c), c);
  }
  for (const ch of "01ILO") assert.equal(CODE_ALPHABET.includes(ch), false);
  assert.equal(CODE_ALPHABET.length, 31);
});

test("generateCodes returns distinct codes", () => {
  const codes = generateCodes(25);
  assert.equal(codes.length, 25);
  assert.equal(new Set(codes).size, 25);
});

test("rejection sampling skips biased bytes", () => {
  // 248 = 256 - 256 % 31 → bytes >= 248 must be skipped.
  let call = 0;
  const rnd = (buf: Uint8Array) => {
    call++;
    buf.fill(call === 1 ? 255 : 0);
    return buf;
  };
  assert.equal(generateCode(rnd), "OM-2222-2222");
  assert.equal(call, 2);
});

test("normalizeCode accepts sloppy input, rejects junk", () => {
  assert.equal(normalizeCode(" om-7k3q-hx9d "), "OM-7K3Q-HX9D");
  assert.equal(normalizeCode("OM 7K3Q HX9D"), "OM-7K3Q-HX9D");
  assert.equal(normalizeCode("7k3qhx9d"), "OM-7K3Q-HX9D");
  assert.equal(normalizeCode(""), null);
  assert.equal(normalizeCode(null), null);
  assert.equal(normalizeCode("OM-7K3Q-HX9"), null);
  assert.equal(normalizeCode("OM-7K3Q-HX9O"), null); // O is not in the alphabet
  assert.equal(normalizeCode("OM-7K3Q-HX9D-EXTRA"), null);
  assert.equal(normalizeCode("' or 1=1 --"), null);
});

test("hint and status", () => {
  assert.equal(codeHint("OM-7K3Q-HX9D"), "HX9D");
  assert.equal(inviteStatus({ use_count: 0, max_uses: 1 }), "active");
  assert.equal(inviteStatus({ use_count: 1, max_uses: 1 }), "used");
  assert.equal(inviteStatus({ use_count: 1, max_uses: 3 }), "active");
  assert.equal(inviteStatus({ use_count: 0, max_uses: 1, revoked_at: "2026-11-21" }), "revoked");
});
