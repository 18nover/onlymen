/**
 * Standalone 18+ interstitial and "not available in your region" pages, served
 * by server/middleware/age-gate.ts before the app (no app bundle, no member
 * data, no explicit content). Works without JavaScript: the confirm button is a
 * plain form POST to /age that sets the cookie and redirects back.
 */
import { AGE_CALLBACK_PATH, EXIT_URL } from "./policy.ts";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const HEAD = (title: string) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="rating" content="adult">
<meta name="RATING" content="RTA-5042-1996-1400-1577-RTA">
<meta name="theme-color" content="#070405">
<title>${title}</title>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500;1,600&family=Manrope:wght@400;600;700&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.25rem;padding:3rem 1.5rem;
background:radial-gradient(ellipse 85% 60% at 50% 0%,rgba(120,10,32,.62),transparent 70%),radial-gradient(ellipse 60% 40% at 50% 100%,rgba(196,22,63,.14),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 45%,transparent 55%,rgba(0,0,0,.6)),#070405;
color:#f4ead7;font-family:Manrope,ui-sans-serif,system-ui,sans-serif;text-align:center;-webkit-font-smoothing:antialiased}
main{display:flex;flex-direction:column;align-items:center;gap:1.5rem;max-width:34rem}
.crest{width:96px;height:96px;border-radius:999px;box-shadow:0 0 0 1px rgba(212,175,106,.45),0 18px 60px -12px rgba(212,175,106,.45)}
.kicker{font-size:.72rem;letter-spacing:.42em;text-transform:uppercase;color:#d4af6a;font-weight:700}
h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:clamp(2.4rem,7vw,4rem);line-height:1.04}
h1 em{font-style:italic;background:linear-gradient(180deg,#f3dca0,#d4af6a 55%,#96702f);-webkit-background-clip:text;background-clip:text;color:transparent}
.rule{position:relative;width:180px;height:1px;background:linear-gradient(90deg,transparent,#d4af6a,transparent)}.rule::after{content:"";position:absolute;left:50%;top:50%;width:6px;height:6px;background:#d4af6a;transform:translate(-50%,-50%) rotate(45deg);box-shadow:0 0 12px rgba(212,175,106,.7)}
p{color:#b3a493;line-height:1.7;font-size:1rem}
.small{font-size:.8rem;color:#7d6f63}
.row{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center}
form{margin:0}
.btn{display:inline-block;cursor:pointer;padding:.85rem 1.6rem;border-radius:999px;font:700 .85rem Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;text-decoration:none}
.enter{border:0;background:linear-gradient(180deg,#f3dca0,#d4af6a 55%,#96702f);color:#1a1208}
.exit{border:1px solid rgba(212,175,106,.5);background:transparent;color:#f3dca0}
.btn:hover{filter:brightness(1.08)}
footer{font-size:.75rem;color:#7d6f63;display:flex;flex-wrap:wrap;gap:.4rem 1rem;justify-content:center}
footer a{color:#7d6f63;text-decoration:none}footer a:hover{color:#d4af6a}
</style>
</head>
<body>`;

const FOOT = `<footer><span>© 18nover</span><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/guidelines">Guidelines</a><a href="/2257">2257</a></footer>
</body>
</html>`;

export const AGE_GATE_TITLE = "OnlyMen — Adults only (18+)";

export function renderAgeGateHtml(next: string, opts: { testMode?: boolean } = {}): string {
  return `${HEAD(AGE_GATE_TITLE)}
${opts.testMode ? `<!-- AGE VERIFIER: clickthrough — DEV/TEST ONLY. Self-declaration is NOT age verification under KRS 436.001(1). Set ONLYMEN_AGE_VERIFIER to a real vendor before going public. -->
<div data-testmode style="position:fixed;top:0;left:0;right:0;padding:.45rem 1rem;background:#5c0d1b;color:#f3dca0;font-size:.72rem;letter-spacing:.08em">TEST MODE · click-through only · not legal age verification</div>` : ""}
<main data-gate="age">
<img class="crest" src="/icon-512.png" alt="OnlyMen crest" width="96" height="96">
<div class="kicker">OnlyMen · Adults only</div>
<h1>You must be <em>18 or older.</em></h1>
<div class="rule" aria-hidden="true"></div>
<p>This site contains sexually explicit material intended for adults. By entering you confirm that you are at least 18 years old (or the age of majority where you live), that viewing adult material is legal where you are, and that you agree to the <a href="/terms" style="color:#d4af6a">Terms</a>.</p>
<div class="row">
<form method="post" action="${AGE_CALLBACK_PATH}?next=${esc(encodeURIComponent(next))}"><button class="btn enter" type="submit" name="confirm" value="yes">I am 18 or older, enter</button></form>
<a class="btn exit" href="${EXIT_URL}" rel="nofollow noreferrer">Exit</a>
</div>
<p class="small">We remember your choice on this device for 30 days with a cookie. Parents: use parental controls (for example the RTA label this site carries) to block adult sites.</p>
</main>
${FOOT}`;
}

export function renderRegionBlockedHtml(): string {
  return `${HEAD("OnlyMen — Not available in your region")}
<main data-gate="region">
<img class="crest" src="/icon-512.png" alt="OnlyMen crest" width="96" height="96">
<div class="kicker">OnlyMen · 18+</div>
<h1>Not available <em>in your region.</em></h1>
<div class="rule" aria-hidden="true"></div>
<p>OnlyMen isn't available where you are right now because of local age-verification law. We're working on a verified-age option.</p>
<div class="row"><a class="btn exit" href="/login" rel="nofollow">Staff log in</a></div>
</main>
${FOOT}`;
}

export function renderVerifierUnavailableHtml(): string {
  return `${HEAD("OnlyMen — Age verification unavailable")}
<main data-gate="age-unavailable">
<img class="crest" src="/icon-512.png" alt="OnlyMen crest" width="96" height="96">
<div class="kicker">OnlyMen · Adults only</div>
<h1>Age check <em>unavailable.</em></h1>
<div class="rule" aria-hidden="true"></div>
<p>Our age-verification partner isn't connected yet. Please try again later.</p>
<div class="row"><a class="btn exit" href="${EXIT_URL}" rel="nofollow noreferrer">Exit</a></div>
</main>
${FOOT}`;
}

export function renderStripeGateHtml(next: string, opts: { testMode?: boolean; note?: string; processing?: boolean } = {}): string {
  const action = `${AGE_CALLBACK_PATH}?next=${encodeURIComponent(next)}`;
  return `${HEAD(AGE_GATE_TITLE)}
${opts.testMode ? `<div data-testmode style="position:fixed;top:0;left:0;right:0;padding:.45rem 1rem;background:#5c0d1b;color:#f3dca0;font-size:.72rem;letter-spacing:.08em">TEST MODE · Stripe test ID check</div>` : ""}
${opts.processing ? `<meta http-equiv="refresh" content="4">` : ""}
<main data-gate="age-stripe">
<img class="crest" src="/icon-512.png" alt="OnlyMen crest" width="96" height="96">
<div class="kicker">OnlyMen · Adults only</div>
<h1>Verify you're <em>18 or older.</em></h1>
<div class="rule" aria-hidden="true"></div>
${opts.note ? `<p role="alert">${esc(opts.note)}</p>` : ""}
${opts.processing ? `<p>Checking your ID… this page refreshes on its own.</p>` : `<p>A quick ID check with Stripe: a photo of your government ID and a selfie. We only keep a yes or no. Stripe deletes your ID images after the check.</p>
<div class="row">
<form method="post" action="${esc(action)}"><button class="btn enter" type="submit">Verify with ID</button></form>
<a class="btn exit" href="${EXIT_URL}" rel="nofollow noreferrer">Exit</a>
</div>`}
</main>
${FOOT}`;
}
