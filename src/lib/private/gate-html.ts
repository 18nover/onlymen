/**
 * The standalone "Private — coming soon" page served by the Nitro gate
 * (server/middleware/private-gate.ts) to logged-out visitors. No app bundle,
 * no member data: just markup, inline CSS and the crest.
 */
export const GATE_TITLE = "OnlyMen — Private. Coming soon.";

export function renderGateHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="theme-color" content="#070405">
<title>${GATE_TITLE}</title>
<meta name="description" content="OnlyMen is private for now. Coming soon.">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500;1,600&family=Manrope:wght@400;600;700&display=swap">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.25rem;padding:3rem 1.5rem;
background:radial-gradient(ellipse 85% 60% at 50% 0%,rgba(120,10,32,.62),transparent 70%),radial-gradient(ellipse 60% 40% at 50% 100%,rgba(196,22,63,.14),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 45%,transparent 55%,rgba(0,0,0,.6)),#070405;
color:#f4ead7;font-family:Manrope,ui-sans-serif,system-ui,sans-serif;text-align:center;-webkit-font-smoothing:antialiased}
.crest{width:96px;height:96px;border-radius:999px;box-shadow:0 0 0 1px rgba(212,175,106,.45),0 18px 60px -12px rgba(212,175,106,.45)}
.kicker{font-size:.72rem;letter-spacing:.42em;text-transform:uppercase;color:#d4af6a;font-weight:700}
h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:clamp(2.6rem,8vw,4.6rem);line-height:1.02;letter-spacing:-.01em}
h1 em{font-style:italic;background:linear-gradient(180deg,#f3dca0,#d4af6a 55%,#96702f);-webkit-background-clip:text;background-clip:text;color:transparent}
.rule{position:relative;width:180px;height:1px;background:linear-gradient(90deg,transparent,#d4af6a,transparent)}.rule::after{content:"";position:absolute;left:50%;top:50%;width:6px;height:6px;background:#d4af6a;transform:translate(-50%,-50%) rotate(45deg);box-shadow:0 0 12px rgba(212,175,106,.7)}
p{max-width:30rem;color:#b3a493;line-height:1.7;font-size:1rem}
.owner{display:inline-block;margin-top:.25rem;padding:.7rem 1.4rem;border-radius:999px;border:1px solid rgba(212,175,106,.5);color:#f3dca0;text-decoration:none;font-weight:600;font-size:.85rem;letter-spacing:.06em}
.owner:hover{background:rgba(92,13,27,.45)}
footer{font-size:.75rem;color:#7d6f63;display:flex;flex-wrap:wrap;gap:.4rem 1rem;justify-content:center}
footer a{color:#7d6f63;text-decoration:none}footer a:hover{color:#d4af6a}
</style>
</head>
<body>
<main style="display:flex;flex-direction:column;align-items:center;gap:1.5rem">
<img class="crest" src="/icon-512.png" alt="OnlyMen crest" width="96" height="96">
<div class="kicker">OnlyMen · 18+</div>
<h1>Private.<br><em>Coming soon.</em></h1>
<div class="rule" aria-hidden="true"></div>
<p>OnlyMen is closed while we finish building it. There are no public sign-ups yet. Check back soon.</p>
<a class="owner" href="/login" rel="nofollow">Owner log in</a>
</main>
<footer><span>© 18nover</span><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/guidelines">Guidelines</a><a href="/2257">2257</a></footer>
</body>
</html>`;
}
