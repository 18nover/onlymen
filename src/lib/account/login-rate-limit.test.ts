import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "../db";
import { isLoginRateLimited, loginRateKeys, LOGIN_RATE_LIMIT, normalizeLoginIdentifier, recordFailedLogin } from "./login-rate-limit.server.ts";

let pg: PGlite;
let db: Sql;

function makeSql(p: PGlite): Sql {
  const run = async (text: string, values: unknown[]) => (await p.query(text, values)).rows;
  return ((strings: TemplateStringsArray, ...values: unknown[]) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i++) text += `$${i + 1}${strings[i + 1]}`;
    return run(text, values);
  }) as unknown as Sql;
}

before(async () => {
  pg = new PGlite();
  const migrations = new URL("../../../migrations/", import.meta.url);
  for (const file of readdirSync(migrations).filter((name) => /^\d{4}_.*\.sql$/.test(name)).sort()) {
    await pg.exec(readFileSync(new URL(file, migrations), "utf8"));
  }
  db = makeSql(pg);
});

after(async () => {
  await pg.close();
});

test("login identifiers are normalized before they are keyed", () => {
  assert.equal(normalizeLoginIdentifier("  @Alice.Example  "), "alice.example");
  assert.deepEqual(
    loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.8" }), "Alice@Example.test"),
    loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.8" }), " alice@example.TEST "),
  );
  assert.notEqual(
    loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.8" }), "alice@example.test").account,
    loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.8" }), "bob@example.test").account,
  );
});

test("five failures block by IP or account independently for the rolling window", async () => {
  const ipKey = loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.8" }), "one@example.test");
  assert.equal(await isLoginRateLimited(db, ipKey), false);
  for (let i = 0; i < LOGIN_RATE_LIMIT.failures - 1; i++) await recordFailedLogin(db, ipKey);
  assert.equal(await isLoginRateLimited(db, ipKey), false);
  await recordFailedLogin(db, ipKey);
  assert.equal(await isLoginRateLimited(db, ipKey), true);

  const sameIpDifferentAccount = loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.8" }), "two@example.test");
  assert.equal(await isLoginRateLimited(db, sameIpDifferentAccount), true, "IP limit applies across accounts");

  const accountKeyDifferentIp = loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.9" }), "one@example.test");
  assert.equal(await isLoginRateLimited(db, accountKeyDifferentIp), true, "account limit applies across IPs");

  const fresh = loginRateKeys(new Headers({ "cf-connecting-ip": "203.0.113.10" }), "three@example.test");
  assert.equal(await isLoginRateLimited(db, fresh), false);
  const stored = await db<{ key_hash: string }>`select key_hash from om_login_attempts`;
  assert.ok(stored.every((row) => /^[0-9a-f]{32,64}$/.test(row.key_hash)), "only hashed keys are stored");
  assert.ok(stored.every((row) => row.key_hash !== "203.0.113.8" && !row.key_hash.includes("example.test")));

  await pg.query(`update om_login_attempts set at = now() - interval '16 minutes'`);
  assert.equal(await isLoginRateLimited(db, ipKey), false, "expired failures no longer block sign-in");
});
