import { test } from "node:test";
import assert from "node:assert/strict";
import { AGE_COOKIE, ageCookieHeader, decide, hasAgeCookie, isAgeExempt, isBlockedRegion, readGeo, safeNext } from "./policy.ts";
import { signAgeToken, verifyAgeToken } from "./token.ts";
import { clickthroughVerifier, verifierByName } from "./verifiers.ts";
import { AV_LAW_STATE_CODES, AV_LAW_STATES } from "./av-states.ts";
import { renderAgeGateHtml } from "./html.ts";

const geoNone = { country: null, region: null };
const ky = { country: "US", region: "KY" };
const KEY = "test-key-not-a-secret";
const T0 = 1_800_000_000;
const tok = signAgeToken(KEY, "clickthrough", T0);
const accept = new Set(["clickthrough"]);

test("flag off: everything passes", () => {
  assert.equal(decide({ path: "/", ageGate: false, geoblock: false, verified: false, geo: ky }), "pass");
});

test("no cookie: app pages get the interstitial; exempt pages pass", () => {
  for (const p of ["/", "/me", "/m/admin", "/watch/admin", "/admin/invites", "/api/photo/ph_12345678"])
    assert.equal(decide({ path: p, ageGate: true, geoblock: false, verified: false, geo: geoNone }), "interstitial", p);
  for (const p of ["/terms", "/privacy", "/guidelines", "/2257", "/custodian", "/age", "/robots.txt", "/assets/x.js", "/favicon.ico", "/icon-512.png", "/_serverFn/abc", "/join", "/login", "/forgot-password", "/join/OM-7K3Q-HX9D"])
    assert.equal(decide({ path: p, ageGate: true, geoblock: false, verified: false, geo: geoNone }), "pass", p);
});

test("signed token: valid lets you through; tampered, expired, wrong key or other verifier don't", () => {
  assert.equal(verifyAgeToken(KEY, tok, accept, T0 + 60).ok, true);
  assert.equal(decide({ path: "/", ageGate: true, geoblock: false, verified: true, geo: geoNone }), "pass");
  const [v, name, exp, sig] = tok.split(".");
  assert.deepEqual(verifyAgeToken(KEY, `${v}.${name}.${Number(exp) + 99}.${sig}`, accept, T0), { ok: false, reason: "signature" });
  assert.deepEqual(verifyAgeToken("other-key", tok, accept, T0), { ok: false, reason: "signature" });
  assert.deepEqual(verifyAgeToken(KEY, tok, accept, T0 + 31 * 86400), { ok: false, reason: "expired" });
  assert.deepEqual(verifyAgeToken(KEY, tok, new Set(["vendor"]), T0), { ok: false, reason: "verifier" });
  assert.deepEqual(verifyAgeToken(KEY, "v1", accept, T0), { ok: false, reason: "malformed" });
  assert.deepEqual(verifyAgeToken(KEY, null, accept, T0), { ok: false, reason: "missing" });
  // Token carries only version, verifier, expiry and MAC — no visitor data.
  assert.equal(tok.split(".").length, 4);
  assert.equal(hasAgeCookie(`a=b; ${AGE_COOKIE}=${tok}`, T0), true);
  assert.equal(hasAgeCookie(`${AGE_COOKIE}=1`, T0), false);
  assert.equal(hasAgeCookie(`x${AGE_COOKIE}=${tok}`, T0), false);
});

test("verifiers: clickthrough is dev-only and needs a same-origin POST; unknown names fall back to click-through", async () => {
  const url = new URL("https://onlymen.example/age/callback");
  const req = (method: string, origin?: string) => ({ url, method, headers: new Headers(origin ? { origin } : {}), next: "/" });
  assert.equal(clickthroughVerifier.devOnly, true);
  assert.equal((await clickthroughVerifier.handleCallback(req("POST"))).ok, true);
  assert.equal((await clickthroughVerifier.handleCallback(req("POST", "https://onlymen.example"))).ok, true);
  assert.equal((await clickthroughVerifier.handleCallback(req("POST", "https://evil.example"))).ok, false);
  assert.equal((await clickthroughVerifier.handleCallback(req("GET"))).ok, false);
  const start = await clickthroughVerifier.startVerification(req("GET"));
  assert.ok(start.kind === "html" && /TEST MODE/.test(start.html) && /DEV\/TEST ONLY/.test(start.html));
  assert.equal(verifierByName("stripe").name, "stripe");
  assert.equal(verifierByName("nope").name, "clickthrough");
  assert.equal(verifierByName(undefined).name, "clickthrough");
});

test("cookie attributes: 30 days, Lax, Secure, whole site", () => {
  const h = ageCookieHeader(tok);
  assert.match(h, /Max-Age=2592000/);
  assert.match(h, /SameSite=Lax/);
  assert.match(h, /Secure/);
  assert.match(h, /Path=\//);
});

test("geoblock is a separate flag, default off", () => {
  assert.equal(decide({ path: "/", ageGate: true, geoblock: false, verified: true, geo: ky }), "pass");
  assert.equal(decide({ path: "/", ageGate: true, geoblock: true, verified: true, geo: ky }), "blocked");
  assert.equal(decide({ path: "/", ageGate: true, geoblock: true, verified: true, geo: { country: "US", region: "NY" } }), "pass");
  assert.equal(decide({ path: "/", ageGate: true, geoblock: true, verified: true, geo: { country: "CA", region: "KY" } }), "pass");
  // Owner/admin bypass, and login/legal stay reachable so staff can sign in.
  assert.equal(decide({ path: "/", ageGate: true, geoblock: true, verified: true, geo: ky, isStaff: true }), "pass");
  for (const p of ["/login", "/terms", "/_serverFn/x", "/region-blocked"]) assert.notEqual(decide({ path: p, ageGate: true, geoblock: true, verified: true, geo: ky }), "blocked", p);
});

test("geo: request.cf first, then CF headers, then Vercel headers", () => {
  const h = new Headers({ "cf-ipcountry": "us", "cf-region-code": "oh" });
  assert.deepEqual(readGeo(h), { country: "US", region: "OH" });
  assert.deepEqual(readGeo(h, { country: "US", regionCode: "KY" }), ky);
  assert.deepEqual(readGeo(new Headers({ "x-vercel-ip-country": "US", "x-vercel-ip-country-region": "TX" })), { country: "US", region: "TX" });
  assert.equal(isBlockedRegion(geoNone), false);
});

test("AV-law list includes Kentucky (HB 278, 15 Jul 2024) and has unique codes", () => {
  assert.ok(AV_LAW_STATE_CODES.has("KY"));
  assert.equal(AV_LAW_STATES.find((s) => s.code === "KY")?.effective, "2024-07-15");
  assert.equal(AV_LAW_STATE_CODES.size, AV_LAW_STATES.length);
});

test("next= is same-origin only", () => {
  assert.equal(safeNext("/m/admin?x=1"), "/m/admin?x=1");
  for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "evil", "", "/age"]) assert.equal(safeNext(bad), "/", bad);
});

test("interstitial has both choices and escapes next", () => {
  const h = renderAgeGateHtml('/x"><script>');
  assert.match(h, /I am 18 or older, enter/);
  assert.match(h, /Exit/);
  assert.doesNotMatch(h, /<script>/);
  assert.ok(isAgeExempt("/legal/anything"));
  assert.ok(isAgeExempt("/join"));
  assert.ok(isAgeExempt("/join/OM-7K3Q-HX9D"));
});

import { hmacHex, isAdult, verifyStripeSignature } from "./stripe-identity.ts";

test("stripe: isAdult computes 18+ from a DOB without storing it", () => {
  const now = new Date("2026-11-27T12:00:00Z");
  assert.equal(isAdult({ year: 2008, month: 11, day: 27 }, now), true);
  assert.equal(isAdult({ year: 2008, month: 11, day: 28 }, now), false);
  assert.equal(isAdult({ year: 1990, month: 1, day: 1 }, now), true);
  assert.equal(isAdult(null, now), false);
  assert.equal(isAdult({ year: null, month: 1, day: 1 }, now), false);
});

test("stripe: webhook signature verifies, rejects tampering and stale timestamps", async () => {
  const secret = "whsec_test_fixture";
  const body = '{"type":"identity.verification_session.verified"}';
  const t = 1_800_000_000;
  const v1 = await hmacHex(secret, `${t}.${body}`);
  assert.equal(await verifyStripeSignature(body, `t=${t},v1=${v1}`, secret, 300, t + 10), true);
  assert.equal(await verifyStripeSignature(body + " ", `t=${t},v1=${v1}`, secret, 300, t + 10), false);
  assert.equal(await verifyStripeSignature(body, `t=${t},v1=${v1}`, secret, 300, t + 1000), false);
  assert.equal(await verifyStripeSignature(body, null, secret), false);
});
