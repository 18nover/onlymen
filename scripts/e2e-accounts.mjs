// Manual QA for server-backed accounts. Not part of `npm test`.
// NOTE: OnlyMen is in private mode, so this only works against a local build with ONLYMEN_PRIVATE_MODE=off (sign-up is closed in production). See scripts/e2e-private.mjs.
// Usage: BASE=https://onlymen.vercel.app TOKEN_CMD="node /path/token.mjs" node scripts/e2e-accounts.mjs
// TOKEN_CMD (optional) is run with the test email appended and must print the reset token.
import { chromium } from "playwright";
import { execSync } from "node:child_process";

const BASE = process.env.BASE ?? "http://127.0.0.1:8090";
const IMG = process.env.IMG ?? "/tmp/shots";
const OUT = process.env.OUT ?? "/workspace/deploy";
const tag = Date.now().toString(36).slice(-6);
const user = process.env.TEST_USER ?? `omtest.${tag}`;
const email = `${user.replace(".", "-")}@example.com`;
const pw1 = "Velvet2026!x";
const pw2 = "Crimson2026!y";
const results = {};
const errors = [];
const browser = await chromium.launch();

async function ctx(name) {
  const c = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await c.addInitScript(() => localStorage.setItem("onlymen-age-ok-v1", "1"));
  const p = await c.newPage();
  p.on("pageerror", (e) => errors.push(`${name} pageerror: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && !/favicon|Failed to load resource.*(401|404)/.test(m.text()) && errors.push(`${name} console: ${m.text()}`));
  return { c, p };
}
const cont = async (p) => {
  await p.getByRole("button", { name: /^(Continue|Finish|Submit)$/ }).click();
  await p.waitForTimeout(600);
};
const check = async (name, fn) => {
  try {
    results[name] = (await fn()) ?? "ok";
  } catch (e) {
    results[name] = `FAIL: ${e.message.split("\n")[0]}`;
  }
};
async function login(p, id, pw) {
  await p.goto(`${BASE}/login`);
  await p.waitForLoadState("networkidle");
  await p.getByLabel("Email or username").fill(id);
  await p.getByLabel("Password", { exact: true }).fill(pw);
  await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForURL(/\/(onboarding|me)/, { timeout: 15000 });
}

const A = await ctx("A");
await check("signup", async () => {
  const { p } = A;
  await p.goto(`${BASE}/join?as=creator`);
  await p.waitForLoadState("networkidle");
  await p.getByLabel("Email", { exact: true }).fill(email);
  await p.getByLabel("Username").fill(user);
  await p.getByLabel("Password", { exact: true }).fill(pw1);
  await p.locator("#dob").fill("1994-03-14");
  await p.getByRole("button", { name: "Create account" }).click();
  await p.waitForURL(/step=consents/, { timeout: 20000 });
  await p.getByRole("button", { name: "Agree to all required" }).click();
  await cont(p);
  await p.waitForURL(/step=basics/, { timeout: 15000 });
  await p.getByLabel("Display name").fill("Test Creator");
  await p.getByLabel("Headline").fill("QA account, deleted after testing.");
  await p.getByLabel("About you").fill("Automated end-to-end test of server accounts.");
  await p.getByLabel("City").fill("New York, NY");
  await cont(p);
  await p.waitForURL(/step=photos/, { timeout: 15000 });
  await p.getByTestId("photo-input").setInputFiles([`${IMG}/m06.jpg`, `${IMG}/m02.jpg`]);
  await p.waitForFunction(() => document.querySelectorAll('img[src*="/api/photo/"]').length >= 2, null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  await cont(p);
  await p.waitForTimeout(1500);
  return `created @${user}`;
});

const B = await ctx("B");
await check("login_fresh_context_same_profile", async () => {
  const { p } = B;
  await login(p, user, pw1);
  await p.goto(`${BASE}/onboarding?step=basics`);
  await p.waitForLoadState("networkidle");
  const v = await p.getByLabel("Display name").inputValue();
  if (v !== "Test Creator") throw new Error(`display name was "${v}"`);
  return "display name + profile loaded from server";
});

await check("public_profile_other_visitor", async () => {
  const { p } = await ctx("C");
  const r = await p.goto(`${BASE}/m/${user}`);
  if (!r?.ok()) throw new Error(`HTTP ${r?.status()}`);
  await p.getByRole("heading", { name: /Test Creator/ }).waitFor({ timeout: 10000 });
  const body = await p.content();
  if (body.includes(email)) throw new Error("email leaked on public page");
  const img = p.locator('img[src*="/api/photo/"]').first();
  await img.waitFor({ timeout: 10000 });
  const ok = await img.evaluate((el) => el.complete && el.naturalWidth > 0);
  if (!ok) throw new Error("photo did not load");
  await p.screenshot({ path: `${OUT}/accounts-public-profile.png` });
  return "name + photo visible, no email in HTML";
});

await check("logout_then_login", async () => {
  const { p } = B;
  await p.goto(`${BASE}/logout`);
  await p.getByText("Until").first().waitFor();
  await p.waitForTimeout(1500);
  const st = await p.evaluate(async () => (await fetch("/api/account/get-session", { credentials: "include" })).text());
  if (st && st !== "null" && st.includes('"user"')) throw new Error("session still active after logout");
  await login(p, email, pw1);
  return "logged out (session cleared), logged back in by email";
});

await check("bad_password_rejected", async () => {
  const { p } = await ctx("D");
  await p.goto(`${BASE}/login`);
  await p.waitForLoadState("networkidle");
  await p.getByLabel("Email or username").fill(user);
  await p.getByLabel("Password", { exact: true }).fill("wrong-password-1");
  await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForTimeout(2500);
  if (/\/(onboarding|me)/.test(p.url())) throw new Error("logged in with wrong password");
  return "rejected";
});

if (process.env.TOKEN_CMD) {
  await check("password_reset", async () => {
    const { p } = await ctx("E");
    await p.goto(`${BASE}/forgot-password`);
    await p.waitForLoadState("networkidle");
    await p.getByLabel("Email").fill(email);
    await p.getByRole("button", { name: "Send reset link" }).click();
    await p.getByRole("status").waitFor({ timeout: 10000 });
    await p.waitForTimeout(1500);
    const token = execSync(`${process.env.TOKEN_CMD} ${JSON.stringify(email)}`).toString().trim();
    if (!token) throw new Error("no token stored");
    await p.goto(`${BASE}/reset-password?token=${encodeURIComponent(token)}`);
    await p.waitForLoadState("networkidle");
    await p.getByLabel("New password", { exact: true }).fill(pw2);
    await p.getByLabel("Confirm new password").fill(pw2);
    await p.getByRole("button", { name: /reset|update|save|set/i }).click();
    await p.waitForURL(/\/(me|onboarding|login)/, { timeout: 15000 });
    const landed = new URL(p.url()).pathname;
    const { p: q } = await ctx("F");
    await login(q, user, pw2);
    const { p: r } = await ctx("G");
    await r.goto(`${BASE}/login`);
    await r.waitForLoadState("networkidle");
    await r.getByLabel("Email or username").fill(user);
    await r.getByLabel("Password", { exact: true }).fill(pw1);
    await r.getByRole("button", { name: "Log in" }).click();
    await r.waitForTimeout(2500);
    if (/\/(onboarding|me)/.test(r.url())) throw new Error("old password still works");
    return `reset ok (landed ${landed}); new password works, old rejected`;
  });
}

console.log(JSON.stringify({ user, email, results, errors }, null, 2));
await browser.close();
