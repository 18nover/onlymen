import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, Radio, ShieldCheck, Sparkles } from "lucide-react";
import { Footer, Header, MobileNav, AgeGate } from "@/components/onlymen-ui";
import { LiveCard, UpcomingRow } from "@/components/live-ui";
import { useReminders } from "@/lib/live/use-reminders";
import { useAgeGate, useCity } from "@/lib/onlymen-hooks";
import { useLiveNow, useUpcoming } from "@/lib/live/use-live";
import { useAccount } from "@/lib/account/use-account";
import { LIVE_CATEGORIES } from "@/lib/live/config";
import { useState } from "react";

export const Route = createFileRoute("/live")({
  head: () => ({ meta: [{ title: "Live now — OnlyMen" }, { name: "description", content: "Who's live right now and upcoming shows from verified OnlyMen creators. 18+." }] }),
  component: LivePage,
});

function LivePage() {
  const { gate, enter } = useAgeGate();
  const [city, setCity] = useCity();
  const live = useLiveNow();
  const upcoming = useUpcoming();
  const rem = useReminders();
  const { account } = useAccount();
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? live.filter((s) => s.tags.includes(cat)) : live;
  const viewers = live.reduce((n, s) => n + s.viewers, 0);

  return (
    <div className="min-h-screen pb-[calc(var(--tabbar-h)+var(--tabbar-gap)+env(safe-area-inset-bottom,0px)+1rem)] md:pb-0">
      <Header city={city} onCity={setCity} />
      <main className="om-container">
        <section className="relative mt-6 overflow-hidden rounded-3xl border-gold-grad p-[clamp(1.25rem,4vw,2.5rem)]">
          <div className="absolute -top-28 -right-20 size-80 rounded-full bg-ruby/30 blur-3xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-ruby uppercase">
                <span className="size-2 animate-pulse-dot rounded-full bg-ruby" /> On air
              </p>
              <h1 className="mt-2 text-5xl leading-none font-semibold text-ivory sm:text-6xl">
                OnlyMen <span className="text-gold italic">Live</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                {live.length} men live now · {viewers.toLocaleString("en-US")} watching. Tap <b className="text-ivory">Watch live</b> and we'll take you to their room — on their own platform or OnlyMen Live.
              </p>
            </div>
            {account?.type === "creator" ? (
              <Link to="/me" hash="go-live" className="flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 text-sm font-bold tracking-[0.12em] uppercase glow-gold">
                <Radio className="size-4" /> Go live
              </Link>
            ) : (
              <Link to="/join" search={{ as: "creator" }} className="flex h-12 items-center justify-center gap-2 rounded-full border border-gold/50 px-6 text-sm font-semibold text-gold-hi hover:bg-gold/10">
                <Sparkles className="size-4" /> Stream on OnlyMen
              </Link>
            )}
          </div>
        </section>

        <div className="no-scrollbar om-bleed mt-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by category">
          {[null, ...LIVE_CATEGORIES.slice(0, 10)].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition ${cat === c ? "border-gold bg-gold/15 text-gold-hi" : "border-line bg-surface/60 text-muted hover:text-ivory"}`}
            >
              {c ?? "All"}
            </button>
          ))}
        </div>

        <section aria-labelledby="live-now" className="mt-6">
          <h2 id="live-now" className="sr-only">Live now</h2>
          {shown.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {shown.map((s) => <LiveCard key={s.handle} s={s} />)}
            </div>
          ) : (
            <p className="rounded-2xl border border-line p-8 text-center text-muted">Nobody live in this category right now. Check the schedule below.</p>
          )}
        </section>

        <section className="om-section" aria-labelledby="upcoming">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-gold uppercase"><CalendarClock className="size-4" /> Schedule</p>
              <h2 id="upcoming" className="mt-1 text-4xl font-semibold text-ivory">Coming up</h2>
            </div>
            {rem.list.length > 0 && <p className="text-xs text-dim">{rem.list.length} reminder{rem.list.length > 1 ? "s" : ""} set</p>}
          </div>
          {!rem.signedIn && <p className="mt-2 text-sm text-muted"><Link to="/join" className="font-semibold text-gold-hi underline underline-offset-4">Join free</Link> to get reminders before shows start.</p>}
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {upcoming === null
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-surface/60" />)
              : upcoming.map((u) => <UpcomingRow key={u.id} show={u} reminded={rem.has(u.id)} onRemind={() => rem.toggle(u)} />)}
          </div>
        </section>

        <section className="om-section">
          <div className="flex flex-col gap-3 rounded-2xl border border-ruby/40 bg-oxblood/20 p-5 text-sm text-muted sm:flex-row sm:items-center">
            <ShieldCheck className="size-6 shrink-0 text-gold" />
            <p>
              OnlyMen doesn't host live video. Streams run on each creator's own platform or on OnlyMen Live, which handle age checks and payments for their rooms. Every creator listed here has submitted ID. <Link to="/live-rules" className="font-semibold text-gold-hi underline underline-offset-2">Live stream rules</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
      {gate !== "ok" && <AgeGate onEnter={enter} />}
    </div>
  );
}
