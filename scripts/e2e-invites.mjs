// Invite-code QA against a deployed Worker (not part of `npm test`).
// Usage: BASE=https://onlymen.18nover.workers.dev CODE_A=… CODE_B=… CODE_RACE=… node scripts/e2e-invites.mjs
//   CODE_A: fresh single-use code (gets used), CODE_B: fresh code the test revokes
//   from /admin/invites, CODE_RACE: fresh single-use code for the concurrency check.
//   Use temporary codes only, and delete the e2etest* accounts afterwards.
//   OPS: optional command that promotes a username to admin (`$OPS set-role <user>`); without it the admin steps are skipped.
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";

const BASE = process.env.BASE ?? "https://onlymen.18nover.workers.dev";
const { CODE_A, CODE_B, CODE_RACE } = process.env;
const PW = `E2e-${Date.now()}-pass9`;
const stamp = Date.now().toString(36);
const results = {};
const check = async (name, fn) => {
  try {
    results[name] = (await fn()) ?? "ok";
  } catch (e) {
    results[name] = `FAIL: ${String(e.message).split("\n")[0]}`;
  }
};
const GATE = /Private\.[\s\S]*Coming soon\./;

for (const path of ["/", "/me", "/onboarding", "/live", "/admin/invites", "/m/admin", "/forgot-password"]) {
  await check(`gate ${path}`, async () => {
    const html = await (await fetch(BASE + path)).text();
    if (!GATE.test(html)) throw new Error("no gate");
    if (!/I have an invite/.test(html)) throw new Error("no invite link on gate");
    return "gate";
  });
}
for (const path of ["/join", "/join?code=OM-2222-2222", "/login", "/terms", "/privacy", "/guidelines", "/2257"]) {
  await check(`open ${path}`, async () => {
    const r = await fetch(BASE + path);
    const html = await r.text();
    if (r.status !== 200 || GATE.test(html)) throw new Error(`HTTP ${r.status}`);
    return `${r.status}`;
  });
}
await check("POST better-auth sign-up stays closed", async () => {
  const r = await fetch(BASE + "/api/account/sign-up/email", { method: "POST", headers: { "content-type": "application/json", origin: BASE }, body: JSON.stringify({ email: `probe${stamp}@example.com`, password: "Probe-2026-pass", name: "probe" }) });
  if (r.ok) throw new Error(`accepted (${r.status})`);
  return `rejected ${r.status}`;
});

const browser = await chromium.launch();
async function ctx() {
  const c = await browser.newContext();
  await c.addInitScript(() => localStorage.setItem("onlymen-age-ok-v1", "1"));
  return c;
}
async function fillJoin(p, { code, user }) {
  await p.goto(`${BASE}/join`);
  await p.waitForLoadState("networkidle");
  if (code != null) await p.getByLabel("Invite code").fill(code);
  await p.getByLabel("Email").fill(`${user}@example.com`);
  await p.getByLabel("Username").fill(user);
  await p.getByLabel("Password", { exact: true }).fill(PW);
  await p.locator("#dob").fill("1990-01-01");
}
async function join(code, user, wait = 6000) {
  const c = await ctx();
  const p = await c.newPage();
  await fillJoin(p, { code, user });
  await p.getByRole("button", { name: "Create account" }).click();
  await p.waitForTimeout(wait);
  const text = await p.locator("body").innerText();
  return { c, p, url: new URL(p.url()).pathname, text };
}
const expectMsg = (r, re) => {
  if (!re.test(r.text)) throw new Error(`no message ${re} (at ${r.url})`);
  return `rejected: ${r.text.match(re)[0]}`;
};

await check("join without code", async () => {
  const r = await join("", `e2etest${stamp}n`, 1500);
  await r.c.close();
  return expectMsg(r, /Enter your invite code/);
});
await check("join with bad code", async () => {
  const r = await join("OM-2222-2222", `e2etest${stamp}x`);
  await r.c.close();
  return expectMsg(r, /invite code isn't valid/);
});
let first;
await check("join with valid code", async () => {
  first = await join(CODE_A, `e2etest${stamp}a`);
  if (first.url !== "/onboarding") throw new Error(`landed on ${first.url}`);
  if (GATE.test(first.text)) throw new Error("gated after sign-up");
  return `landed ${first.url}`;
});
await check("same code again → used", async () => {
  const r = await join(CODE_A, `e2etest${stamp}b`);
  await r.c.close();
  return expectMsg(r, /already been used/);
});
await check("concurrent sign-ups with one single-use code", async () => {
  const cs = await Promise.all([ctx(), ctx(), ctx()]);
  const ps = await Promise.all(cs.map((c) => c.newPage()));
  await Promise.all(ps.map((p, i) => fillJoin(p, { code: CODE_RACE, user: `e2etest${stamp}r${i}` })));
  await Promise.all(ps.map((p) => p.getByRole("button", { name: "Create account" }).click()));
  await ps[0].waitForTimeout(8000);
  const outs = await Promise.all(ps.map(async (p) => ({ url: new URL(p.url()).pathname, used: /already been used/.test(await p.locator("body").innerText()) })));
  await Promise.all(cs.map((c) => c.close()));
  const wins = outs.filter((o) => o.url === "/onboarding").length;
  const losses = outs.filter((o) => o.used).length;
  if (wins !== 1 || losses !== 2) throw new Error(JSON.stringify(outs));
  return "1 created, 2 told 'already used'";
});

if (process.env.OPS && first) {
  await check("admin page: revoke a code", async () => {
    execFileSync(process.env.OPS, ["set-role", `e2etest${stamp}a`, "admin"]);
    const p = first.p;
    await p.goto(`${BASE}/admin/invites`);
    await p.waitForLoadState("networkidle");
    await p.waitForSelector("table");
    const hint = CODE_B.slice(-4);
    const row = p.locator("tr", { hasText: `OM-…-${hint}` });
    p.once("dialog", (d) => d.accept());
    await row.getByRole("button", { name: "Revoke" }).click();
    await p.waitForTimeout(2000);
    if (!/revoked/.test(await row.innerText())) throw new Error("row not revoked");
    return "revoked via UI";
  });
  await check("admin page: create a code", async () => {
    const p = first.p;
    await p.getByLabel("Note (who it's for)").fill("e2e-temp");
    await p.getByRole("button", { name: "Create" }).click();
    await p.waitForTimeout(2500);
    const t = await p.locator("body").innerText();
    if (!/OM-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}/.test(t)) throw new Error("no new code shown");
    return "created + shown once";
  });
  await check("revoked code → friendly error", async () => {
    const r = await join(CODE_B, `e2etest${stamp}c`);
    await r.c.close();
    return expectMsg(r, /no longer active/);
  });
}
await check("non-admin cannot open /admin/invites", async () => {
  const c = await ctx();
  const p = await c.newPage();
  await p.goto(`${BASE}/login`);
  await p.waitForLoadState("networkidle");
  // Signed-out: gate. (Signed-in non-admins see "Not found"; covered by the server check.)
  await p.goto(`${BASE}/admin/invites`);
  const t = await p.locator("body").innerText();
  await c.close();
  if (/Invite codes/.test(t) && !/Coming soon/.test(t)) throw new Error("admin page visible");
  return "blocked";
});
await check("invited user can log in again", async () => {
  if (!first) throw new Error("no account");
  await first.c.close();
  const c = await ctx();
  const p = await c.newPage();
  await p.goto(`${BASE}/login`);
  await p.waitForLoadState("networkidle");
  await p.getByLabel("Email or username").fill(`e2etest${stamp}a`);
  await p.getByLabel("Password", { exact: true }).fill(PW);
  await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForTimeout(5000);
  const url = new URL(p.url()).pathname;
  const gated = GATE.test(await p.locator("body").innerText());
  await c.close();
  if (gated || !["/me", "/onboarding"].includes(url)) throw new Error(`at ${url}, gated=${gated}`);
  return `landed ${url}`;
});
// Per-client limits key on the IP (IPv6: its /64). From an egress that rotates
// addresses (e.g. a VPN pool) only the global cap trips: set
// ONLYMEN_INVITE_RATE_GLOBAL low on the Worker for the test, then remove it.
await check("rate limit after repeated bad codes", async () => {
  for (let i = 0; i < 12; i++) {
    const r = await join(`OM-2222-${"23456789ABCD".slice(i, i + 4).padEnd(4, "2")}`, `e2etest${stamp}z${i}`, 3500);
    await r.c.close();
    if (/Too many attempts/.test(r.text)) return `limited after ${i} more bad tries`;
  }
  throw new Error("never limited");
});

await browser.close();
console.log(JSON.stringify(results, null, 2));
process.exit(Object.values(results).some((v) => String(v).startsWith("FAIL")) ? 1 : 0);
