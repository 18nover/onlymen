import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { clientIp, hashCode, ipHash, ipv6Prefix64, overLimit, rateKey, RATE } from "./invites.server.ts";

test("hashCode is SHA-256 hex of the canonical code", () => {
  assert.equal(hashCode("OM-ABCD-EFGH"), createHash("sha256").update("OM-ABCD-EFGH").digest("hex"));
});

test("IPv6 is rate-limited per /64, IPv4 per address", () => {
  assert.equal(ipv6Prefix64("2a09:bac5:a9da:dcd::160:125"), "2a09:bac5:a9da:dcd::/64");
  assert.equal(ipv6Prefix64("2001:db8::1"), "2001:db8:0:0::/64");
  assert.equal(ipv6Prefix64("2001:0db8:0000:0042:0000:8a2e:0370:7334"), "2001:db8:0:42::/64");
  assert.equal(rateKey("2001:db8:0:42:aaaa::1"), rateKey("2001:db8:0:42:bbbb::2"));
  assert.notEqual(rateKey("2001:db8:0:42::1"), rateKey("2001:db8:0:43::1"));
  assert.equal(rateKey("203.0.113.9"), "203.0.113.9");
});

test("client IP header precedence and keyed hash", () => {
  const h = new Headers({ "cf-connecting-ip": "203.0.113.9", "x-forwarded-for": "198.51.100.1, 10.0.0.1" });
  assert.equal(clientIp(h), "203.0.113.9");
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" })), "198.51.100.1");
  assert.equal(clientIp(new Headers()), "unknown");
  const a = ipHash(new Headers({ "cf-connecting-ip": "2001:db8:0:42::1" }));
  assert.equal(a, ipHash(new Headers({ "cf-connecting-ip": "2001:db8:0:42::99" })));
  assert.match(a, /^[0-9a-f]{32}$/);
  assert.doesNotMatch(a, /2001/);
});

test("overLimit", () => {
  assert.equal(overLimit({ mine: RATE.perIp - 1, total: 0 }), false);
  assert.equal(overLimit({ mine: RATE.perIp, total: 0 }), true);
  assert.equal(overLimit({ mine: 0, total: RATE.global }), true);
  assert.equal(overLimit({ mine: 2, total: 2 }, { perIp: 3, global: 3 }), false);
});
