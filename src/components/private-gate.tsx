import { Link } from "@tanstack/react-router";

/** In-app "Private — coming soon" screen (the root guard renders this instead of any gated route). */
export function PrivateComingSoon() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-9 px-6 py-12 text-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(92,13,27,.55), transparent 70%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(194,42,69,.16), transparent 70%), #0a0809",
      }}
    >
      <main className="flex flex-col items-center gap-6">
        <img src="/icon-512.png" alt="OnlyMen crest" width={96} height={96} className="size-24 rounded-full glow-gold" />
        <div className="text-xs font-bold uppercase tracking-[0.42em] text-gold">OnlyMen · 18+</div>
        <h1 className="font-display text-5xl font-semibold leading-none sm:text-7xl">
          Private.
          <br />
          <span className="text-gold italic">Coming soon.</span>
        </h1>
        <div aria-hidden className="h-px w-36 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <p className="max-w-md leading-relaxed text-muted">OnlyMen is closed while we finish building it. There are no public sign-ups yet. Check back soon.</p>
        <Link to="/login" rel="nofollow" className="rounded-full border border-gold/50 px-6 py-3 text-sm font-semibold tracking-wide text-gold-hi hover:bg-oxblood/45">
          Owner log in
        </Link>
      </main>
      <footer className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-dim">
        <span>© 18nover</span>
        <Link to="/terms" className="hover:text-gold">Terms</Link>
        <Link to="/privacy" className="hover:text-gold">Privacy</Link>
        <Link to="/guidelines" className="hover:text-gold">Guidelines</Link>
        <Link to="/2257" className="hover:text-gold">2257</Link>
      </footer>
    </div>
  );
}
