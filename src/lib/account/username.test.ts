/** Username changes against in-memory Postgres (PGLite) with the real migrations applied. */
import { test, before } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "../db";
import { changeUsername, usernameStatus } from "./username.server.ts";

let pg: PGlite;
let db: Sql;
const mk = (p: PGlite): Sql => ((s: TemplateStringsArray, ...v: unknown[]) => {
  let t = s[0];
  for (let i = 0; i < v.length; i++) t += `$${i + 1}${s[i + 1]}`;
  return p.query(t, v).then((r) => r.rows);
}) as unknown as Sql;
const tx = (fn: (t: Sql) => Promise<void>) => fn(db);
async function user(id: string, name: string, role = "user") {
  await pg.query(`insert into "user" (id, name, email, "emailVerified") values ($1,$2,$3,true)`, [id, name, `${name}@example.test`]);
  await pg.query(`insert into om_account (user_id, username, account_type, dob, role) values ($1,$2,'member','1990-01-01',$3)`, [id, name, role]);
}

before(async () => {
  pg = new PGlite();
  const dir = new URL("../../../migrations/", import.meta.url);
  for (const f of readdirSync(dir).filter((x) => /^\d{4}_.*\.sql$/.test(x)).sort()) await pg.exec(readFileSync(new URL(f, dir), "utf8"));
  db = mk(pg);
  await user("u1", "alpha");
  await user("u2", "bravo");
  await user("uadmin", "boss", "owner");
});

test("username: validates, rejects taken, changes, reserves the old name for others", async () => {
  assert.equal((await changeUsername(db, "u1", "ab", tx)).ok, false);
  assert.equal((await changeUsername(db, "u1", "bravo", tx)).ok, false);
  assert.deepEqual(await changeUsername(db, "u1", "@Alpha_One", tx), { ok: true, username: "alpha_one" });
  assert.equal(((await pg.query<{ username: string }>(`select username from om_account where user_id='u1'`)).rows[0]!).username, "alpha_one");
  assert.equal(((await pg.query<{ name: string }>(`select name from "user" where id='u1'`)).rows[0]!).name, "alpha_one");
  const taken = await changeUsername(db, "u2", "alpha", tx); // released but reserved 30 days
  assert.equal(taken.ok, false);
  assert.equal((await changeUsername(db, "u1", "alpha", tx)).ok, true); // its previous owner may take it back
});

test("username: 2 changes per rolling 12 months, then blocked with a next date; old ones roll off", async () => {
  const st = await usernameStatus(db, "u1");
  assert.equal(st.left, 0);
  assert.ok(st.nextAt && new Date(st.nextAt) > new Date());
  const blocked = await changeUsername(db, "u1", "alpha_three", tx);
  assert.equal(blocked.ok, false);
  await pg.query(`update om_username_log set changed_at = now() - interval '13 months' where id = (select min(id) from om_username_log where user_id='u1')`);
  assert.equal((await usernameStatus(db, "u1")).left, 1);
  assert.equal((await changeUsername(db, "u1", "alpha_three", tx)).ok, true);
});

test("username: admins and owners are exempt", async () => {
  for (const n of ["boss_a", "boss_b", "boss_c"]) assert.equal((await changeUsername(db, "uadmin", n, tx)).ok, true);
  const st = await usernameStatus(db, "uadmin");
  assert.equal(st.exempt, true);
  assert.equal(st.left, 2);
});
