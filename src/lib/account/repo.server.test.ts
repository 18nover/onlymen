import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "../db";
import { defaultPermissions, defaultPrivacy, emptyProfile } from "./constants.ts";
import type { PublicAccount } from "./types.ts";

let pg: PGlite;
let saveAccountInTransaction: typeof import("./repo.server.ts").saveAccountInTransaction;

function makeSql(runQuery: (text: string, values: unknown[]) => Promise<unknown[]>): Sql {
  const run = async <T>(text: string, values: unknown[]) => (await runQuery(text, values)) as T[];
  return ((strings: TemplateStringsArray, ...values: unknown[]) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i++) text += `$${i + 1}${strings[i + 1]}`;
    return run(text, values);
  }) as unknown as Sql;
}

before(async () => {
  const previousDatabaseUrl = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgres://test-only";
  ({ saveAccountInTransaction } = await import("./repo.server.ts"));
  if (previousDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = previousDatabaseUrl;

  pg = new PGlite();
  const migrations = new URL("../../../migrations/", import.meta.url);
  for (const file of readdirSync(migrations).filter((name) => /^\d{4}_.*\.sql$/.test(name)).sort()) {
    await pg.exec(readFileSync(new URL(file, migrations), "utf8"));
  }
});

after(async () => {
  await pg.close();
});

test("a failure during reminders rolls back the full account/profile save", async () => {
  const userId = "save-rollback-user";
  await pg.query(`insert into "user" (id, name, email, "emailVerified") values ($1, $2, $3, true)`, [userId, "Before", "before@example.test"]);
  await pg.query(
    `insert into om_account (user_id, username, account_type, dob, profile) values ($1, 'before', 'member', '1990-01-01', $2::jsonb)`,
    [userId, JSON.stringify({ displayName: "Before" })],
  );
  await pg.query(
    `insert into om_photo (id, user_id, attached) values ('ph_old', $1, true)`,
    [userId],
  );
  await pg.query(
    `insert into om_show (id, user_id, title, starts_at) values ('show_old', $1, 'Old show', now() + interval '1 day')`,
    [userId],
  );
  await pg.query(
    `insert into om_reminder (user_id, show_id, creator, title, starts_at) values ($1, 'old', 'before', 'Old reminder', now() + interval '1 day')`,
    [userId],
  );
  await pg.exec(`
    create function fail_account_save_reminder() returns trigger language plpgsql as $$
    begin
      raise exception 'test failure after profile, photo and show writes';
    end $$;
    create trigger fail_account_save_reminder before insert on om_reminder
      for each row execute function fail_account_save_reminder();
  `);

  const account: PublicAccount = {
    id: userId,
    email: "before@example.test",
    username: "before",
    dob: "1990-01-01",
    type: "member",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    emailVerified: true,
    consents: [{ key: "terms", granted: true, version: "v2", at: "2026-11-25T00:00:00.000Z", source: "test" }],
    permissions: defaultPermissions(),
    profile: {
      ...emptyProfile(),
      displayName: "After",
      photos: [{ id: "ph_new", primary: true, addedAt: "2026-11-25T00:00:00.000Z" }],
    },
    privacy: defaultPrivacy(),
    onboarding: { current: "finish", completed: ["basics"], skipped: [] },
    live: {
      streams: false,
      rooms: [],
      useOnlyMenLive: true,
      categories: [],
      scheduleDays: [],
      scheduleTime: "21:00",
      timeZone: "UTC",
      tipMenu: [],
      recordingsAllowed: false,
      blockedRegions: [],
      moderators: [],
      bannedWords: [],
      shows: [{ id: "show_new", title: "New show", startsAt: "2026-12-01T00:00:00.000Z", durationMin: 60, tags: [] }],
    },
    reminders: [{ showId: "new", creator: "after", title: "New reminder", startsAt: "2026-12-01T00:00:00.000Z", createdAt: "2026-11-25T00:00:00.000Z" }],
  };
  const runQuery = async (text: string, values: unknown[]) => (await pg.query(text, values)).rows;
  const db = makeSql(runQuery);
  await assert.rejects(
    pg.transaction(async (tx) => {
      const txRun = async (text: string, values: unknown[]) => (await tx.query(text, values)).rows;
      await saveAccountInTransaction(makeSql(txRun), userId, account);
    }),
    /test failure after profile/,
  );

  const profile = (await pg.query<{ profile: { displayName: string } }>(`select profile from om_account where user_id = $1`, [userId])).rows[0].profile;
  assert.equal(profile.displayName, "Before");
  assert.deepEqual((await db<{ id: string }>`select id from om_photo where user_id = ${userId} and attached`).map((row) => row.id), ["ph_old"]);
  assert.deepEqual((await db<{ id: string }>`select id from om_show where user_id = ${userId}`).map((row) => row.id), ["show_old"]);
  assert.deepEqual((await db<{ show_id: string }>`select show_id from om_reminder where user_id = ${userId}`).map((row) => row.show_id), ["old"]);
  assert.equal((await db`select 1 from om_consent where user_id = ${userId} and key = 'terms'`).length, 0);
});
