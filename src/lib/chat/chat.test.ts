import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "../db";
import { ChatError, cleanBody, inbox, isRateLimited, MESSAGE_RATE, send, thread } from "./repo.server.ts";

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

async function user(id: string, username: string) {
  await pg.query(`insert into "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") values ($1, $2, $3, false, now(), now())`, [id, username, `${username}@example.test`]);
  await pg.query(`insert into om_account (user_id, username, dob, account_type, profile) values ($1, $2, '1990-01-01', 'member', $3::jsonb)`, [id, username, JSON.stringify({ displayName: username })]);
}

before(async () => {
  pg = new PGlite();
  const migrations = new URL("../../../migrations/", import.meta.url);
  for (const file of readdirSync(migrations).filter((name) => /^\d{4}_.*\.sql$/.test(name)).sort()) {
    await pg.exec(readFileSync(new URL(file, migrations), "utf8"));
  }
  db = makeSql(pg);
  await user("u1", "alice");
  await user("u2", "bob");
  await user("u3", "cara");
});

after(async () => {
  await pg.close();
});

test("cleanBody trims and caps", () => {
  assert.equal(cleanBody("  hi  there  "), "hi there");
  assert.equal(cleanBody("x".repeat(3000)).length, 2000);
});

test("send and list a thread; only participants can see it", async () => {
  const m = await send(db, "u1", "u2", "Hello Bob");
  assert.equal(m.fromMe, true);
  assert.equal(m.body, "Hello Bob");
  const ab = await thread(db, "u1", "u2");
  const ba = await thread(db, "u2", "u1");
  assert.equal(ab.length, 1);
  assert.equal(ba.length, 1);
  assert.equal(ba[0]!.fromMe, false);
  assert.equal((await thread(db, "u3", "u1")).length, 0);
  const box = await inbox(db, "u1");
  assert.equal(box.length, 1);
  assert.equal(box[0]!.username, "bob");
  assert.equal(box[0]!.last.fromMe, true);
});

test("blocks hide the thread and refuse sends", async () => {
  await pg.query(`insert into om_block (blocker_id, blocked_id) values ('u1', 'u3')`);
  await assert.rejects(() => send(db, "u1", "u3", "hey"), (e: unknown) => e instanceof ChatError);
  await assert.rejects(() => send(db, "u3", "u1", "hey"), (e: unknown) => e instanceof ChatError);
  assert.deepEqual(await thread(db, "u1", "u3"), []);
  assert.equal((await inbox(db, "u1")).some((r) => r.username === "cara"), false);
});

test("rate-limit caps sends in the window", async () => {
  for (let i = 0; i < MESSAGE_RATE.max; i++) await send(db, "u2", "u1", `n${i}`);
  assert.equal(await isRateLimited(db, "u2"), true);
  await assert.rejects(() => send(db, "u2", "u1", "too many"), (e: unknown) => e instanceof ChatError);
});
