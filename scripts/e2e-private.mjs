// Private-mode QA (not part of `npm test`). Checks the coming-soon gate,
// closed sign-up, and optionally owner login.
// Usage: BASE=https://onlymen.gay node scripts/e2e-private.mjs
//   Optional owner login: OWNER_ID=<email or username> OWNER_PW (env only — never pass on argv or commit it).
//   Optional rejection check: DENY_ID / DENY_PW for a non-allowlisted account.
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:8081";
const results = {};
const check = async (name, fn) => {
  try {
    results[name] = (await fn()) ?? "ok";
  } catch (e) {
    results[name] = `FAIL: ${String(e.message).split("\n")[0]}`;
  }
};
const GATE = /Private\.[\s\S]*Coming soon\./;

for (const path of ["/", "/me", "/onboarding", "/live", "/watch/marco.noir", "/join?as=creator", "/m/marco.noir", "/forgot-password"]) {
  await check(`gate ${path}`, async () => {
    const r = await fetch(BASE + path, { redirect: "manual" });
    const html = await r.text();
    if (!GATE.test(html)) throw new Error(`HTTP ${r.status}, no gate`);
    if (/Create account|marco|Go live/i.test(html.replace(/<title>[^<]*<\/title>/, ""))) throw new Error("member content leaked");
    return `${r.status} gate, ${r.headers.get("x-robots-tag") ?? "no x-robots-tag"}`;
  });
}
for (const path of ["/login", "/terms", "/privacy", "/guidelines", "/2257"]) {
  await check(`open ${path}`, async () => {
    const r = await fetch(BASE + path);
    const html = await r.text();
    if (r.status !== 200 || GATE.test(html)) throw new Error(`HTTP ${r.status}`);
    return `${r.status} ${html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""}`;
  });
}
await check("POST better-auth sign-up", async () => {
  const r = await fetch(BASE + "/api/account/sign-up/email", { method: "POST", headers: { "content-type": "application/json", origin: BASE }, body: JSON.stringify({ email: `probe${Date.now()}@example.com`, password: "Probe-2026-pass", name: "probe" }) });
  if (r.ok) throw new Error(`accepted (${r.status})`);
  return `rejected ${r.status}`;
});
await check("photo without session", async () => {
  const r = await fetch(BASE + "/api/photo/ph_0123456789abcdef");
  if (r.ok) throw new Error(`served ${r.status}`);
  return `${r.status}`;
});

const browser = await chromium.launch();
async function tryLogin(id, pw) {
  const c = await browser.newContext();
  await c.addInitScript(() => localStorage.setItem("onlymen-age-ok-v1", "1"));
  const p = await c.newPage();
  await p.goto(`${BASE}/login`);
  await p.waitForLoadState("networkidle");
  await p.getByLabel("Email or username").fill(id);
  await p.getByLabel("Password", { exact: true }).fill(pw);
  await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForTimeout(5000);
  return { c, p };
}
await check("sign-up server fn via /join form", async () => {
  // /join is gated, so there is no form to submit at all.
  const c = await browser.newContext();
  const p = await c.newPage();
  await p.goto(`${BASE}/join?as=creator`);
  const n = await p.getByRole("button", { name: "Create account" }).count();
  await c.close();
  if (n) throw new Error("sign-up form is reachable");
  return "no sign-up form";
});
if (process.env.DENY_ID && process.env.DENY_PW) {
  await check("non-allowlisted login rejected", async () => {
    const { c, p } = await tryLogin(process.env.DENY_ID, process.env.DENY_PW);
    const url = new URL(p.url()).pathname;
    const err = await p.getByText(/don't match/).count();
    await c.close();
    if (/\/(me|onboarding)/.test(url)) throw new Error(`got in (${url})`);
    return `stayed on ${url}${err ? ", generic error shown" : ""}`;
  });
}
if (process.env.OWNER_ID && process.env.OWNER_PW) {
  await check("owner login", async () => {
    const { c, p } = await tryLogin(process.env.OWNER_ID, process.env.OWNER_PW);
    await p.waitForURL(/\/(me|onboarding)/, { timeout: 15000 });
    const landed = new URL(p.url()).pathname;
    await p.goto(`${BASE}/me`);
    await p.waitForLoadState("networkidle");
    const html = await p.content();
    await c.close();
    if (GATE.test(html)) throw new Error("owner sees the gate on /me");
    return `landed ${landed}; /me renders the app (${html.includes("@admin") ? "@admin shown" : "loaded"})`;
  });
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
