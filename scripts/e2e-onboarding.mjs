// Manual QA: drives sign-up + onboarding and saves screenshots. Not part of `npm test`.
// Usage: BASE=http://127.0.0.1:8080 OUT=/workspace/deploy node scripts/e2e-onboarding.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:8080";
const OUT = process.env.OUT ?? "/workspace/deploy";
const IMG = process.env.IMG ?? "/tmp/shots";
const errors = [];

const browser = await chromium.launch({ args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] });

async function ctx(mobile) {
  const c = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    permissions: ["geolocation", "notifications", "camera", "microphone"],
    geolocation: { latitude: 40.744, longitude: -74.0 },
  });
  await c.addInitScript(() => localStorage.setItem("onlymen-age-ok-v1", "1"));
  const p = await c.newPage();
  p.on("pageerror", (e) => errors.push(`${mobile ? "m" : "d"} pageerror: ${e.message}`));
  p.on("console", (m) => m.type() === "error" && errors.push(`${mobile ? "m" : "d"} console: ${m.text()}`));
  return p;
}
const shot = async (p, name, full = false) => {
  await p.waitForTimeout(450); // let fade-up animations settle
  // full-page captures: un-stick fixed/sticky bars so they don't float mid-image
  const tag = full ? await p.addStyleTag({ content: "header.sticky,footer.fixed{position:static!important}" }) : null;
  await p.screenshot({ path: `${OUT}/onboarding-${name}.png`, fullPage: full });
  if (tag) await tag.evaluate((el) => el.remove());
};
const cont = async (p) => {
  await p.getByRole("button", { name: /^(Continue|Finish|Submit)$/ }).click();
  await p.waitForTimeout(500);
};
const step = (p, s) => p.waitForURL(new RegExp(`step=${s}`), { timeout: 15000 });

async function signUp(p, { type, user, mobile }) {
  await p.goto(`${BASE}/join${type === "creator" ? "?as=creator" : ""}`);
  await p.waitForLoadState("networkidle");
  if (mobile) {
    // validation demo: under-18 DOB
    await p.getByLabel("Email", { exact: true }).fill("not-an-email");
    await p.locator("#dob").fill("2010-05-05");
    await p.getByRole("button", { name: "Create account" }).click();
    await p.waitForTimeout(300);
    await shot(p, `${mobile ? "mobile" : "desktop"}-01b-join-validation`, true);
  }
  await shot(p, `${mobile ? "mobile" : "desktop"}-01-join`, !mobile);
  await p.getByLabel("Email", { exact: true }).fill(`${user}@example.com`);
  await p.getByLabel("Username").fill(user);
  await p.getByLabel("Password", { exact: true }).fill("Velvet2026!");
  await p.locator("#dob").fill("1994-03-14");
  await p.getByRole("button", { name: "Create account" }).click();
  await step(p, "consents");
}

// ---------------- desktop: creator, every step
{
  const p = await ctx(false);
  const D = "desktop";
  await signUp(p, { type: "creator", user: "marco.velvet" });
  await p.waitForTimeout(400);
  await cont(p); // try without consents -> error
  await shot(p, `${D}-02-consents`, true);
  await p.getByRole("button", { name: "Agree to all required" }).click();
  await p.getByText("Email me new faces").click();
  await cont(p);
  await step(p, "basics");
  await p.getByLabel("Display name").fill("Marco");
  await p.getByLabel("Headline").fill("Late-night conversation, good wine, better company.");
  await p.getByLabel("About you").fill("Italian by blood, New Yorker by choice. Velvet jackets, dim bars, and late-night streams.");
  await p.getByLabel("City").fill("New York, NY");
  await shot(p, `${D}-03-basics`, true);
  await cont(p);
  await step(p, "photos");
  await shot(p, `${D}-04a-photos-empty`);
  await p.getByTestId("photo-input").setInputFiles([`${IMG}/m06.jpg`, `${IMG}/m02.jpg`, `${IMG}/m09.jpg`, `${IMG}/m11.jpg`]);
  await p.waitForFunction(() => document.querySelectorAll('img[alt^="Gallery photo"], img[alt="Your profile photo"]').length >= 4, null, { timeout: 15000 });
  await p.getByRole("button", { name: "Make photo 3 your profile photo" }).click();
  await p.waitForTimeout(500);
  await shot(p, `${D}-04-photos`, true);
  await cont(p);
  await step(p, "details");
  await p.getByLabel("Height").selectOption("183");
  await p.getByLabel("Body type").selectOption("Athletic");
  for (const t of ["Jock", "Clean-cut", "Friends", "Content collabs", "Fine dining", "Nightlife", "Travel", "Italian"]) await p.getByRole("button", { name: t, exact: true }).click();
  await shot(p, `${D}-05-details`, true);
  await cont(p);
  await step(p, "socials");
  await p.locator("input[placeholder=handle]").first().fill("marco_velvet");
  await shot(p, `${D}-06-links`, true);
  await cont(p);
  await step(p, "permissions");
  await p.getByRole("button", { name: "Allow" }).first().click();
  await shot(p, `${D}-07a-permission-explainer`);
  await p.getByRole("dialog").getByRole("button", { name: "Continue" }).click();
  await p.waitForTimeout(1500);
  await p.getByRole("button", { name: "Allow" }).first().click();
  await p.getByRole("dialog").getByRole("button", { name: "Continue" }).click();
  await p.waitForTimeout(800);
  await p.getByRole("button", { name: "Not now" }).last().click();
  await p.waitForTimeout(300);
  await shot(p, `${D}-07-permissions`, true);
  await cont(p);
  await step(p, "verify");
  await p.getByLabel("Full legal name").fill("Marco Sample Rossi");
  await p.getByLabel("ID type").selectOption("drivers_license");
  await p.getByLabel("ID — front").setInputFiles(`${IMG}/id.jpg`);
  await p.getByLabel("ID — back").setInputFiles(`${IMG}/id.jpg`);
  await p.getByLabel("Selfie with ID").setInputFiles(`${IMG}/m06.jpg`);
  await p.waitForTimeout(1200);
  for (const t of await p.locator('label[aria-hidden="true"]').all()) await t.click();
  await p.getByLabel("Payout method").selectOption("bank");
  await p.getByLabel("Tax form").selectOption("W-9");
  await shot(p, `${D}-08-creator-verify`, true);
  await cont(p);
  await step(p, "privacy");
  await shot(p, `${D}-09-privacy`, true);
  await cont(p);
  await step(p, "finish");
  await p.waitForTimeout(800);
  await shot(p, `${D}-10-welcome`);
  await p.getByRole("link", { name: "See my profile" }).click();
  await p.waitForURL(/\/me/);
  await p.waitForTimeout(1000);
  await shot(p, `${D}-11-my-profile`, true);
  // persistence: reload keeps session + data
  await p.reload();
  await p.waitForTimeout(1000);
  const name = await p.locator("h1").first().textContent();
  if (!name?.includes("Marco")) errors.push("d: profile not persisted after reload");
  // log out / log in
  await p.goto(`${BASE}/logout`);
  await p.waitForTimeout(500);
  await p.goto(`${BASE}/login`);
  await shot(p, `${D}-12-login`);
  await p.getByLabel("Email or username").fill("marco.velvet");
  await p.getByLabel("Password", { exact: true }).fill("wrongpass1");
  await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForTimeout(800);
  if (!(await p.getByRole("alert").count())) errors.push("d: wrong password not rejected");
  await p.getByLabel("Password", { exact: true }).fill("Velvet2026!");
  await p.getByRole("button", { name: "Log in" }).click();
  await p.waitForURL(/\/me/, { timeout: 10000 });
  await p.goto(`${BASE}/terms`);
  await shot(p, `${D}-13-terms-draft`);
  await p.goto(`${BASE}/`);
  await p.waitForTimeout(800);
  await shot(p, `${D}-14-home-signed-in`);
  const consents = await p.evaluate(() => {
    const db = JSON.parse(localStorage.getItem("onlymen-accounts-v1"));
    const a = Object.values(db)[0];
    return { n: a.consents.length, sample: a.consents.slice(-3), status: a.creator.status, pw: a.password.algo, perms: a.permissions };
  });
  console.log("consent log:", JSON.stringify(consents, null, 1));
}

// ---------------- mobile: member
{
  const p = await ctx(true);
  const M = "mobile";
  await signUp(p, { type: "member", user: "nightowl.nyc", mobile: true });
  await p.getByRole("button", { name: "Agree to all required" }).click();
  await shot(p, `${M}-02-consents`);
  await cont(p);
  await step(p, "basics");
  await p.getByLabel("Display name").fill("Sam");
  await p.getByLabel("Headline").fill("Gallery nights and slow mornings.");
  await shot(p, `${M}-03-basics`);
  await cont(p);
  await step(p, "photos");
  await p.getByTestId("photo-input").setInputFiles([`${IMG}/m02.jpg`, `${IMG}/m09.jpg`]);
  await p.waitForTimeout(2000);
  await shot(p, `${M}-04-photos`);
  await cont(p);
  await step(p, "details");
  await p.getByRole("button", { name: "Skip for now" }).click();
  await step(p, "socials");
  await p.getByRole("button", { name: "Skip for now" }).click();
  await step(p, "permissions");
  await shot(p, `${M}-05-permissions`);
  await p.getByRole("button", { name: "Allow" }).nth(1).click();
  await shot(p, `${M}-05b-permission-explainer`);
  await p.getByRole("dialog").getByRole("button", { name: "Continue" }).click();
  await p.waitForTimeout(800);
  await cont(p);
  await step(p, "privacy");
  await shot(p, `${M}-06-privacy`);
  await cont(p);
  await step(p, "finish");
  await p.waitForTimeout(800);
  await shot(p, `${M}-07-welcome`, true);
  await p.getByRole("link", { name: "See my profile" }).click();
  await p.waitForURL(/\/me/);
  await p.waitForTimeout(1000);
  await shot(p, `${M}-08-my-profile`);
  await p.goto(`${BASE}/forgot-password`);
  await p.getByLabel("Email").fill("nightowl.nyc@example.com");
  await p.getByRole("button", { name: "Send reset link" }).click();
  await p.waitForTimeout(500);
  await shot(p, `${M}-09-forgot-password`);
}

await browser.close();
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no page errors");
