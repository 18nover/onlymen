import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "../db";
import { isAdminUser } from "../invites/invites.server.ts";
import { writeAdminAudit } from "./audit.server.ts";

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

test("admin roles are verified against the database", async () => {
  for (const [id, role] of [["member", "user"], ["admin", "admin"], ["owner", "owner"]] as const) {
    await pg.query(`insert into "user" (id, name, email, "emailVerified") values ($1, $1, $2, true)`, [id, `${id}@example.test`]);
    await pg.query(
      `insert into om_account (user_id, username, account_type, dob, role) values ($1, $1, 'member', '1990-01-01', $2)`,
      [id, role],
    );
  }
  assert.equal(await isAdminUser(db, "member"), false);
  assert.equal(await isAdminUser(db, "admin"), true);
  assert.equal(await isAdminUser(db, "owner"), true);
  assert.equal(await isAdminUser(db, null), false);
});

test("admin audit entries capture actor and resource and cannot be changed", async () => {
  await writeAdminAudit(db, "admin", "reports.decide", "report", "rep_123");
  const rows = await db<{ actor_id: string; action: string; resource_type: string; resource_id: string }>`
    select actor_id, action, resource_type, resource_id from om_admin_audit`;
  assert.deepEqual(rows[0], {
    actor_id: "admin",
    action: "reports.decide",
    resource_type: "report",
    resource_id: "rep_123",
  });
  await assert.rejects(pg.query(`update om_admin_audit set action = 'changed'`));
  await assert.rejects(pg.query(`delete from om_admin_audit`));
  await assert.rejects(writeAdminAudit(db, "", "reports.decide", "report", "rep_123"));
});
