import { test } from "node:test";
import assert from "node:assert/strict";
import { allowlistEmpty, isAllowedIdentity, isPublicPath, parseList, readAllowlist, signUpAllowedFor } from "./policy.ts";

test("unset allowlist denies everyone", () => {
  const a = readAllowlist({});
  assert.equal(allowlistEmpty(a), true);
  assert.equal(isAllowedIdentity(a, { id: "u1", username: "jerry", email: "j@example.com" }), false);
  assert.equal(signUpAllowedFor(a, "j@example.com"), false);
});

test("allowlist by id, username or owner email", () => {
  const a = readAllowlist({ ONLYMEN_ALLOWED_USER_IDS: " u1, u2 ", ONLYMEN_ALLOWED_USERNAMES: "@Owner", ONLYMEN_OWNER_SIGNUP_EMAIL: "Boss@Example.com" });
  assert.equal(isAllowedIdentity(a, { id: "u2" }), true);
  assert.equal(isAllowedIdentity(a, { id: "u3", username: "owner" }), true);
  assert.equal(isAllowedIdentity(a, { id: "u3", email: "boss@example.com" }), true);
  assert.equal(isAllowedIdentity(a, { id: "u3", username: "omtest.abc", email: "x@example.com" }), false);
  assert.equal(signUpAllowedFor(a, "boss@example.com "), true);
  assert.equal(signUpAllowedFor(a, "someone@example.com"), false);
});

test("parseList", () => {
  assert.deepEqual([...parseList("a,b\nc  d")], ["a", "b", "c", "d"]);
  assert.equal(parseList("").size, 0);
});

test("public paths", () => {
  for (const p of ["/login", "/terms", "/privacy/", "/guidelines", "/2257", "/favicon.ico", "/assets/main-abc.js", "/models/m03.webp", "/robots.txt"]) assert.equal(isPublicPath(p), true, p);
  for (const p of ["/", "/me", "/onboarding", "/live", "/watch/marco.noir", "/join", "/m/someone", "/forgot-password", "/api/photo/ph_abcdef12"]) assert.equal(isPublicPath(p), false, p);
});
