#!/usr/bin/env node
/**
 * OnlyMen invite codes — CLI for Jerry/admins. See docs/OPERATIONS.md → "Invite codes".
 *
 *   node scripts/invite-codes.mjs generate --count 5 [--note "for Sam"] [--max-uses 1]
 *       Offline: prints new codes and the SQL to insert them (paste into the
 *       Neon SQL editor). Needs no database.
 *   DATABASE_URL=... node scripts/invite-codes.mjs create --count 5 [--note ...] [--max-uses N] [--out FILE]
 *       Inserts codes and prints them once (or writes them to FILE, chmod 600).
 *   DATABASE_URL=... node scripts/invite-codes.mjs list
 *   DATABASE_URL=... node scripts/invite-codes.mjs revoke <OM-XXXX-XXXX | id>
 *   DATABASE_URL=... node scripts/invite-codes.mjs restore <OM-XXXX-XXXX | id>
 *
 * Only the SHA-256 of a code is stored. Never commit or paste plain codes into
 * docs or logs. DATABASE_URL is read from the environment only.
 */
import { createHash, randomBytes } from "node:crypto";
import { writeFileSync, chmodSync } from "node:fs";

// Keep in sync with src/lib/invites/codes.ts (checked by invite-codes.test.mjs).
export const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateCode(random = (n) => randomBytes(n)) {
  const n = CODE_ALPHABET.length;
  const limit = 256 - (256 % n);
  let body = "";
  while (body.length < 8) {
    for (const b of random(16)) {
      if (b < limit) body += CODE_ALPHABET[b % n];
      if (body.length === 8) break;
    }
  }
  return `OM-${body.slice(0, 4)}-${body.slice(4)}`;
}

export function generateCodes(count) {
  const out = new Set();
  while (out.size < count) out.add(generateCode());
  return [...out];
}

export function normalizeCode(input) {
  let s = String(input ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (s.length === 10 && s.startsWith("OM")) s = s.slice(2);
  if (s.length !== 8 || [...s].some((c) => !CODE_ALPHABET.includes(c))) return null;
  return `OM-${s.slice(0, 4)}-${s.slice(4)}`;
}

export const hashCode = (code) => createHash("sha256").update(code, "utf8").digest("hex");
const sqlStr = (v) => (v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`);

export function insertSql(codes, { note = null, maxUses = 1 } = {}) {
  const rows = codes.map((c) => `  ('${hashCode(c)}', '${c.slice(-4)}', ${sqlStr(note)}, ${Number(maxUses)})`);
  return `insert into invite_codes (code_hash, code_hint, note, max_uses) values\n${rows.join(",\n")};`;
}

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  const opts = { _: [] };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a.startsWith("--")) opts[a.slice(2)] = rest[i + 1]?.startsWith("--") || rest[i + 1] == null ? true : rest[++i];
    else opts._.push(a);
  }
  return { cmd, opts };
}

async function withDb(fn) {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL is not set (export it in your shell; never commit it).");
    process.exit(2);
  }
  const { default: pg } = await import("pg");
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

/** Resolve "OM-XXXX-XXXX" or a numeric id to an invite_codes.id. */
async function resolveId(client, ref) {
  if (/^\d+$/.test(String(ref))) return Number(ref);
  const code = normalizeCode(ref);
  if (!code) throw new Error("Not a code or id.");
  const r = await client.query("select id from invite_codes where code_hash = $1", [hashCode(code)]);
  if (!r.rows[0]) throw new Error("No such code.");
  return Number(r.rows[0].id);
}

async function main() {
  const { cmd, opts } = parseArgs(process.argv.slice(2));
  const count = Math.max(1, Math.min(500, Number(opts.count) || 1));
  const maxUses = Math.max(1, Number(opts["max-uses"]) || 1);
  const note = typeof opts.note === "string" ? opts.note : null;
  switch (cmd) {
    case "generate": {
      const codes = generateCodes(count);
      console.log("# New invite codes (shown once — keep them private):");
      for (const c of codes) console.log(c);
      console.log("\n-- Paste into the Neon SQL editor (database onlymen):");
      console.log(insertSql(codes, { note, maxUses }));
      return;
    }
    case "create": {
      const codes = generateCodes(count);
      await withDb(async (client) => {
        await client.query("begin");
        for (const c of codes) await client.query("insert into invite_codes (code_hash, code_hint, note, max_uses) values ($1, $2, $3, $4)", [hashCode(c), c.slice(-4), note, maxUses]);
        await client.query("commit");
      });
      if (typeof opts.out === "string") {
        writeFileSync(opts.out, codes.join("\n") + "\n", { mode: 0o600 });
        chmodSync(opts.out, 0o600);
        console.log(`Created ${codes.length} code(s); written to ${opts.out} (chmod 600).`);
      } else {
        console.log(`Created ${codes.length} code(s) (shown once):`);
        for (const c of codes) console.log(c);
      }
      return;
    }
    case "list": {
      await withDb(async (client) => {
        const r = await client.query(`select c.id, c.code_hint, c.note, c.use_count, c.max_uses, c.revoked_at, c.created_at,
            (select string_agg(coalesce(a.username, '?'), ', ') from invite_redemptions x left join om_account a on a.user_id = x.user_id where x.code_id = c.id) as joined
          from invite_codes c order by c.id`);
        for (const x of r.rows) {
          const status = x.revoked_at ? "revoked" : x.use_count >= x.max_uses ? "used" : "active";
          console.log(`${String(x.id).padStart(4)}  OM-…-${x.code_hint}  ${status.padEnd(7)}  ${x.use_count}/${x.max_uses}  ${x.note ?? ""}${x.joined ? `  joined: ${x.joined}` : ""}`);
        }
      });
      return;
    }
    case "revoke":
    case "restore": {
      const ref = opts._[0];
      if (!ref) throw new Error(`Usage: ${cmd} <OM-XXXX-XXXX | id>`);
      await withDb(async (client) => {
        const id = await resolveId(client, ref);
        await client.query(cmd === "revoke" ? "update invite_codes set revoked_at = coalesce(revoked_at, now()) where id = $1" : "update invite_codes set revoked_at = null where id = $1", [id]);
        console.log(`${cmd === "revoke" ? "Revoked" : "Restored"} code #${id}.`);
      });
      return;
    }
    default:
      console.log("Usage: node scripts/invite-codes.mjs <generate|create|list|revoke|restore> [--count N] [--note TEXT] [--max-uses N] [--out FILE]");
      process.exit(cmd ? 1 : 0);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(String(e?.message ?? e));
    process.exit(1);
  });
}
