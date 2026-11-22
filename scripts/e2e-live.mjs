// Manual QA for live surfaces. BASE=http://127.0.0.1:8080 OUT=/workspace/deploy node scripts/e2e-live.mjs
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:8080";
const OUT = process.env.OUT ?? "/workspace/deploy";
const IMG = process.env.IMG ?? "/tmp/shots";
const errors = [];
const browser = await chromium.launch();

async function ctx(mobile) {
  const c = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  await c.addInitScript(() => localStorage.setItem("onlymen-age-ok-v1", "1"));
  // never actually leave for third-party sites during QA
  await c.route(/^https:\/\/(stripchat\.com|onlymen\.live)\//, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "<h1>external room (stubbed)</h1>" }));
  const p = await c.newPage();
  p.on("pageerror", (e) => errors.push(`${mobile ? "m" : "d"} pageerror: ${e.message}`));
  p.on("console", async (m) => {
    if (m.type() !== "error" || /hydrat/i.test(m.text())) return;
    const args = await Promise.all(m.args().map((x) => x.jsonValue().catch(() => "?")));
    errors.push(`${mobile ? "m" : "d"} console @ ${p.url()}: ${JSON.stringify(args.slice(1)).slice(0, 1500)}`);
  });
  return p;
}
const shot = async (p, name, full = false) => {
  await p.waitForTimeout(500);
  const tag = full ? await p.addStyleTag({ content: "header.sticky,footer.fixed,nav.fixed{position:static!important}" }) : null;
  await p.screenshot({ path: `${OUT}/live-${name}.png`, fullPage: full });
  if (tag) await tag.evaluate((el) => el.remove());
};
const step = (p, s) => p.waitForURL(new RegExp(`step=${s}`), { timeout: 15000 });
const cont = (p) => p.getByRole("button", { name: /^(Continue|Finish|Submit)$/ }).click();
const skip = (p) => p.getByRole("button", { name: "Skip for now" }).click();

async function join(p, user, type) {
  await p.goto(`${BASE}/join?as=${type}`);
  await p.waitForLoadState("networkidle");
  await p.getByLabel("Email", { exact: true }).fill(`${user}@example.com`);
  await p.getByLabel("Username").fill(user);
  await p.getByLabel("Password", { exact: true }).fill("Velvet2026!");
  await p.locator("#dob").fill("1993-06-01");
  await p.getByRole("button", { name: "Create account" }).click();
  await step(p, "consents");
  await p.getByRole("button", { name: "Agree to all required" }).click();
  await cont(p);
  await step(p, "basics");
  await p.getByLabel("Display name").fill(user.split(".")[0].replace(/^\w/, (c) => c.toUpperCase()));
  await p.getByLabel("Headline").fill("Velvet jackets and red-lit rooms.");
  await cont(p);
  await step(p, "photos");
}

// ---------------- desktop
{
  const p = await ctx(false);
  const D = "desktop";
  await p.goto(`${BASE}/live`);
  await p.waitForLoadState("networkidle");
  await shot(p, `${D}-01-live-page`, true);
  await p.goto(`${BASE}/#browse`);
  await p.waitForTimeout(800);
  await p.locator("#browse").scrollIntoViewIfNeeded();
  await shot(p, `${D}-02-grid-live-rings`);
  await p.goto(`${BASE}/m/marco.noir`);
  await shot(p, `${D}-03-profile-watch-live`);
  await p.goto(`${BASE}/watch/marco.noir`);
  await shot(p, `${D}-04-interstitial-opening-soon`);

  await join(p, "leo.ember", "creator");
  await p.getByTestId("photo-input").setInputFiles([`${IMG}/m02.jpg`]);
  await p.waitForTimeout(1500);
  await cont(p);
  await step(p, "details");
  await shot(p, `${D}-05-details-viewer-live-prefs`, true);
  await skip(p);
  await step(p, "socials");
  await skip(p);
  await step(p, "permissions");
  await skip(p);
  await step(p, "verify");
  await p.getByLabel("Full legal name").fill("Leo Sample Ember");
  await p.getByLabel("ID type").selectOption("passport");
  await p.getByLabel("ID — front").setInputFiles(`${IMG}/id.jpg`);
  await p.getByLabel("Selfie with ID").setInputFiles(`${IMG}/m02.jpg`);
  await p.waitForTimeout(1200);
  for (const t of await p.locator('label[aria-hidden="true"]').all()) await t.click();
  await cont(p);
  await step(p, "live");
  await cont(p); // blocked: no consents
  await p.waitForTimeout(300);
  await p.getByLabel("Platform", { exact: true }).selectOption("stripchat");
  await p.getByLabel("Your room link").fill("https://stripchat.com/leo_ember");
  await p.getByRole("button", { name: "Add", exact: true }).first().click();
  for (const c of ["Chill & chat", "Dance", "Q&A"]) await p.getByRole("button", { name: c, exact: true }).click();
  for (const d of ["Fri", "Sat"]) await p.getByRole("button", { name: d, exact: true }).click();
  await p.getByRole("button", { name: "Add item" }).click();
  await p.getByLabel("Tip menu item").fill("Song request");
  await p.getByLabel("Tip price in USD").fill("10");
  await p.getByRole("button", { name: "Texas", exact: true }).click();
  await p.getByLabel("Chat moderators").fill("nightowl.nyc");
  await p.getByLabel("Chat moderators").press("Enter");
  await p.getByLabel("Banned words").fill("venmo, cashapp");
  await p.getByLabel("Banned words").press("Enter");
  for (const t of await p.locator('label[aria-hidden="true"]').all()) await t.click();
  await shot(p, `${D}-06-onboarding-live-step`, true);
  await cont(p);
  await step(p, "privacy");
  await cont(p);
  await step(p, "finish");
  await p.goto(`${BASE}/me`);
  await p.waitForTimeout(1000);
  await shot(p, `${D}-07-me-go-live-ready`);
  await p.getByRole("button", { name: "Go live", exact: true }).click();
  await p.getByLabel("Stream title").fill("Velvet room Q&A — ask me anything");
  await p.getByLabel(/Tip goal/).fill("250");
  await shot(p, `${D}-08-preflight-sheet`);
  await p.getByRole("button", { name: "Go live now" }).click();
  await p.waitForURL(/\/watch\/leo\.ember/, { waitUntil: "commit" });
  await p.waitForTimeout(300);
  await p.getByRole("button", { name: "Stay here" }).click();
  await shot(p, `${D}-09-interstitial-handoff`);
  await p.goto(`${BASE}/live`);
  await p.waitForTimeout(1000);
  const first = await p.locator("article").first().textContent();
  if (!first?.includes("You")) errors.push("d: own session not first on /live");
  await shot(p, `${D}-10-live-page-you-are-live`);
  // remind me on two demo shows
  const remind = p.getByRole("button", { name: /Remind me/ });
  await remind.first().click();
  await p.waitForTimeout(200);
  await remind.first().click();
  await p.locator("#upcoming").scrollIntoViewIfNeeded();
  await shot(p, `${D}-11-schedule-remind-me`);
  await p.goto(`${BASE}/me`);
  await p.waitForTimeout(800);
  await p.locator("#go-live").scrollIntoViewIfNeeded();
  await shot(p, `${D}-12-me-on-air`);
  await p.getByRole("button", { name: "End stream" }).click();
  await p.waitForTimeout(500);
  await p.getByRole("button", { name: "+ Schedule" }).click();
  await p.getByLabel("Show title").fill("Sunday pump");
  const t = new Date(Date.now() + 2 * 86400000);
  t.setHours(20, 0, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  await p.getByLabel("Starts").fill(`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}T20:00`);
  await p.getByRole("button", { name: "Add to schedule" }).click();
  await p.waitForTimeout(400);
  await p.locator("#go-live").scrollIntoViewIfNeeded();
  await shot(p, `${D}-13-me-recap-and-schedule`);
  const state = await p.evaluate(() => {
    const a = Object.values(JSON.parse(localStorage.getItem("onlymen-accounts-v1")))[0];
    return { rooms: a.live.rooms, recap: !!a.live.lastRecap, session: !!a.live.session, shows: a.live.shows.length, reminders: a.reminders?.length, consents: a.consents.filter((c) => c.key.startsWith("live")).map((c) => `${c.key}@${c.version}`) };
  });
  console.log("state:", JSON.stringify(state));
  if (state.session || !state.recap || state.shows !== 1 || state.reminders !== 2) errors.push("d: state mismatch " + JSON.stringify(state));
  await p.goto(`${BASE}/live-rules`);
  await shot(p, `${D}-14-live-rules-draft`);
}

// ---------------- mobile
{
  const p = await ctx(true);
  const M = "mobile";
  await p.goto(`${BASE}/live`);
  await p.waitForLoadState("networkidle");
  await shot(p, `${M}-01-live-page`);
  await p.locator("#upcoming").scrollIntoViewIfNeeded();
  await shot(p, `${M}-02-schedule`);
  await p.goto(`${BASE}/`);
  await p.waitForTimeout(600);
  await p.locator("#live").scrollIntoViewIfNeeded();
  await shot(p, `${M}-03-home-live-row`);
  await p.goto(`${BASE}/watch/julian.spot`);
  await shot(p, `${M}-04-interstitial`);
  await join(p, "dev.night", "creator");
  await skip(p);
  await step(p, "details");
  await skip(p);
  await step(p, "socials");
  await skip(p);
  await step(p, "permissions");
  await skip(p);
  await step(p, "verify");
  await skip(p);
  await step(p, "live");
  await shot(p, `${M}-05-onboarding-live-step`);
  await skip(p);
  await step(p, "privacy");
  await cont(p);
  await step(p, "finish");
  await p.goto(`${BASE}/me`);
  await p.waitForTimeout(800);
  await p.locator("#go-live").scrollIntoViewIfNeeded();
  await shot(p, `${M}-06-me-go-live-locked`);
  if (!(await p.getByText("Before you can go live").count())) errors.push("m: gate not shown");
}

await browser.close();
console.log(errors.length ? `ERRORS:\n${errors.join("\n")}` : "no page errors");
process.exit(errors.length ? 1 : 0);
