import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Coins,
  Crown,
  Eye,
  Flame,
  Lock,
  MapPin,
  MessageCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { company } from "@/lib/company";
import { applyFilter, filters, models, type FilterId, type Model } from "@/lib/models";

const AGE_KEY = "onlymen-age-ok-v1";

function Brand({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`grid place-items-center rounded-full border-gold-grad ${size === "lg" ? "size-12" : "size-8"}`}
      >
        <Crown className={`text-gold-hi ${size === "lg" ? "size-5" : "size-3.5"}`} strokeWidth={1.6} />
      </span>
      <span
        className={`font-display font-semibold tracking-tight text-gold ${size === "lg" ? "text-5xl" : "text-2xl"}`}
      >
        Only<span className="italic">Men</span>
      </span>
    </span>
  );
}

function AgeGate({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-xl">
      <div className="absolute inset-0 vignette" />
      <div className="relative w-full max-w-md animate-fade-up rounded-2xl border-gold-grad p-8 text-center glow-gold sm:p-10">
        <div className="flex justify-center">
          <Brand size="lg" />
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">{company.domain}</p>
        <div className="mx-auto mt-8 grid size-16 place-items-center rounded-full border border-ruby/60 bg-oxblood/40 glow-ruby">
          <span className="font-display text-2xl font-bold text-ivory">18+</span>
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-ivory">Adults only, after dark.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This site contains mature content for adult men. By entering you confirm you are at least 18 years old
          (or the age of majority where you live) and agree to our Terms and Community Rules.
        </p>
        <div className="mt-8 grid gap-3">
          <button
            onClick={onEnter}
            className="h-12 rounded-full bg-gold text-sm font-bold uppercase tracking-[0.18em] transition hover:brightness-110 active:scale-[0.99]"
          >
            I'm 18 or older — Enter
          </button>
          <a
            href="https://www.google.com"
            className="grid h-12 place-items-center rounded-full border border-line text-sm font-semibold text-muted transition hover:border-gold/50 hover:text-ivory"
          >
            Leave
          </a>
        </div>
        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-dim">
          <ShieldCheck className="size-3.5" /> Every creator is ID- and age-verified.
        </p>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <a href="#" aria-label="OnlyMen home">
          <Brand />
        </a>
        <nav className="hidden items-center gap-1 text-sm font-medium text-muted md:flex">
          <a href="#browse" className="rounded-full px-3 py-2 transition hover:text-gold-hi">Browse</a>
          <a href="#live" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition hover:text-gold-hi">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-ruby" /> Live
          </a>
          <a href="#browse" className="rounded-full px-3 py-2 transition hover:text-gold-hi">Online now</a>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button className="hidden h-10 rounded-full px-4 text-sm font-semibold text-ivory transition hover:text-gold-hi sm:block">
            Sign in
          </button>
          <button className="h-10 rounded-full bg-gold px-5 text-sm font-bold transition hover:brightness-110">
            Join free
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({ online, live }: { online: number; live: number }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line/60">
      <img
        src="/models/hero.webp"
        alt=""
        className="absolute inset-0 -z-10 size-full object-cover object-right opacity-70"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-10 sm:px-6 sm:py-14 lg:py-16">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          <Sparkles className="size-3.5" /> Private club for gay men · 18+
        </p>
        <h1 className="mt-4 max-w-2xl text-5xl leading-[0.95] font-semibold text-ivory sm:text-7xl">
          Men worth staying <span className="text-gold italic">up for.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          A curated directory of verified creators and companions. Watch them live, start a conversation, and tip
          the ones who make your night.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#browse" className="grid h-12 place-items-center rounded-full bg-gold px-7 text-sm font-bold glow-gold transition hover:brightness-110">
            Browse men
          </a>
          <a
            href="#live"
            className="flex h-12 items-center gap-2 rounded-full border border-ruby/60 bg-oxblood/40 px-6 text-sm font-semibold text-ivory transition hover:bg-oxblood/70"
          >
            <Radio className="size-4 text-ruby" /> Watch live
          </a>
        </div>
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-online" />
            <dt className="sr-only">Online</dt>
            <dd><b className="text-ivory">{online * 97 + 13}</b> <span className="text-muted">online now</span></dd>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse-dot rounded-full bg-ruby" />
            <dd><b className="text-ivory">{live}</b> <span className="text-muted">live right now</span></dd>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Coins className="size-4 text-gold" /> Free to join · Tips only · No subscriptions
          </div>
        </dl>
      </div>
    </section>
  );
}

function LiveRow({ list, onOpen }: { list: Model[]; onOpen: (m: Model) => void }) {
  return (
    <section id="live" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-10 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-ruby">
            <span className="size-2 animate-pulse-dot rounded-full bg-ruby" /> On air
          </p>
          <h2 className="mt-1 text-3xl font-semibold text-ivory sm:text-4xl">Live now</h2>
        </div>
        <a href="#live" className="text-sm font-semibold text-gold transition hover:text-gold-hi">See all live →</a>
      </div>
      <div className="no-scrollbar -mx-4 mt-5 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        {list.map((m) => (
          <button
            key={m.id}
            onClick={() => onOpen(m)}
            className="group relative aspect-[4/5] w-44 shrink-0 snap-start overflow-hidden rounded-2xl text-left glow-ruby sm:w-56"
          >
            <img src={m.photo} alt={`${m.name}, live`} className="size-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 tile-shade" />
            <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-ruby px-2.5 py-1 text-xs font-bold tracking-wider text-ivory uppercase">
              <span className="size-1.5 rounded-full bg-ivory" /> Live
            </span>
            <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-xs font-semibold text-ivory backdrop-blur">
              <Eye className="size-3" /> {m.viewers}
            </span>
            <div className="absolute inset-x-3 bottom-3">
              <p className="font-display text-2xl leading-none font-semibold text-ivory">{m.name}</p>
              <p className="mt-1 truncate text-xs text-muted">{m.tagline}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Tile({ m, onOpen }: { m: Model; onOpen: (m: Model) => void }) {
  return (
    <article className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface ring-1 ring-line/70 transition duration-300 hover:-translate-y-0.5 hover:ring-gold/60 hover:shadow-[0_18px_40px_-18px_rgb(212_175_106_/_0.55)]">
      <button onClick={() => onOpen(m)} className="absolute inset-0 z-10" aria-label={`View ${m.name}`} />
      <img
        src={m.photo}
        alt={`${m.name}, ${m.age}`}
        loading="lazy"
        className="size-full object-cover transition duration-700 group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 tile-shade" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
        {m.live ? (
          <span className="flex items-center gap-1 rounded-full bg-ruby px-2 py-0.5 text-xs font-bold tracking-wider text-ivory uppercase">
            <span className="size-1.5 rounded-full bg-ivory" /> Live
          </span>
        ) : m.isNew ? (
          <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold tracking-wider uppercase">New</span>
        ) : (
          <span />
        )}
        {m.verified && <BadgeCheck className="size-5 fill-ink/60 text-gold-hi" aria-label="Verified" />}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`size-2 shrink-0 rounded-full ${m.live ? "bg-ruby" : m.online ? "bg-online" : "bg-dim"}`}
            aria-label={m.online || m.live ? "Online" : "Offline"}
          />
          <p className="truncate text-base font-bold text-ivory">
            {m.name}, <span className="font-medium text-ivory/80">{m.age}</span>
          </p>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
          <MapPin className="size-3" /> {m.km < 1 ? `${Math.round(m.km * 1000)} m` : `${m.km.toFixed(1)} km`} · {m.city}
        </p>
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <div className="overflow-hidden">
            <p className="mt-2 line-clamp-2 text-xs leading-snug text-ivory/85">{m.tagline}</p>
            <div className="relative z-20 mt-2.5 flex gap-1.5">
              <button
                onClick={() => onOpen(m)}
                className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full bg-gold text-xs font-bold"
              >
                <Coins className="size-3.5" /> Tip
              </button>
              <button
                onClick={() => onOpen(m)}
                className="grid size-8 place-items-center rounded-full border border-gold/50 bg-ink/60 text-gold-hi"
                aria-label="Message"
              >
                <MessageCircle className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function QuickView({ m, onClose }: { m: Model; onClose: () => void }) {
  const [tipped, setTipped] = useState<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/80 backdrop-blur-md sm:place-items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${m.name} profile`}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92vh] w-full max-w-3xl animate-fade-up overflow-y-auto rounded-t-3xl border-gold-grad glow-gold sm:grid-cols-2 sm:overflow-hidden sm:rounded-3xl"
      >
        <div className="relative aspect-[4/5] sm:aspect-auto">
          <img src={m.photo} alt={`${m.name}, ${m.age}`} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-night/40" />
          {m.live && (
            <span className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-ruby px-3 py-1 text-xs font-bold tracking-wider text-ivory uppercase">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-ivory" /> Live · {m.viewers} watching
            </span>
          )}
        </div>
        <div className="flex flex-col p-6 sm:p-8">
          <button onClick={onClose} className="absolute top-4 right-4 z-10 grid size-10 place-items-center rounded-full bg-ink/70 text-ivory backdrop-blur transition hover:text-gold-hi" aria-label="Close">
            <X className="size-5" />
          </button>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-gold">
            @{m.handle} {m.verified && <BadgeCheck className="size-4" />}
          </p>
          <h3 className="mt-1 text-5xl font-semibold text-ivory">
            {m.name}<span className="text-gold">,</span> <span className="font-normal text-ivory/80">{m.age}</span>
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <span className={`size-2 rounded-full ${m.online || m.live ? "bg-online" : "bg-dim"}`} />
            {m.online || m.live ? "Online now" : "Away"} · {m.km.toFixed(1)} km · {m.city}
          </p>
          <p className="mt-5 font-display text-2xl leading-snug text-ivory/90 italic">“{m.tagline}”</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {m.tags.map((t) => (
              <span key={t} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">{t}</span>
            ))}
          </div>
          <div className="mt-auto pt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-dim">Send a tip</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[5, 10, 25].map((v) => (
                <button
                  key={v}
                  onClick={() => setTipped(v)}
                  className={`h-12 rounded-xl border text-base font-bold transition ${tipped === v ? "bg-gold border-transparent" : "border-gold/40 text-gold-hi hover:border-gold"}`}
                >
                  ${v}
                </button>
              ))}
            </div>
            {tipped && (
              <p className="mt-3 text-sm text-gold-hi">Join free to send ${tipped} to {m.name}. Tips go straight to him.</p>
            )}
            <button className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 text-sm font-semibold text-ivory transition hover:border-gold/50">
              <Lock className="size-4 text-gold" /> Join free to message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const cols = [
    { title: "Explore", links: ["Browse", "Live now", "New faces", "Become a creator"] },
    { title: "Safety", links: ["18+ & age verification", "Consent policy", "Safety center", "Report a profile"] },
    { title: "Legal", links: ["Terms of service", "Privacy", "2257 statement", "DMCA"] },
  ];
  return (
    <footer className="mt-20 border-t border-line/60 bg-night/80 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Brand />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A private directory of verified adult creators and companions. {company.phase}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-ruby/50 bg-oxblood/30 px-3 py-1.5 text-xs font-semibold text-ivory">
            <span className="font-display text-sm font-bold">18+</span> Adults only. Consent always.
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{c.title}</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="transition hover:text-ivory">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs leading-relaxed text-dim sm:flex-row sm:justify-between sm:px-6">
          <p>All people on {company.domain} are 18 or older and ID-verified. Everything here is between consenting adults.</p>
          <p>© 2026 {company.company} · {company.companyDomain}</p>
        </div>
      </div>
    </footer>
  );
}

function MobileNav() {
  const items = [
    { href: "#browse", label: "Browse", icon: <Flame className="size-5" /> },
    { href: "#live", label: "Live", icon: <Radio className="size-5" /> },
    { href: "#browse", label: "Online", icon: <span className="grid size-5 place-items-center"><span className="size-2.5 rounded-full bg-online" /></span> },
    { href: "#", label: "Sign in", icon: <Lock className="size-5" /> },
  ];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border-gold-grad p-1 shadow-2xl md:hidden" aria-label="Primary">
      {items.map((i) => (
        <a key={i.label} href={i.href} className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold text-muted transition active:bg-surface-2 active:text-gold-hi">
          <span className="text-gold">{i.icon}</span>
          {i.label}
        </a>
      ))}
    </nav>
  );
}

export function OnlyMenHome() {
  const [gate, setGate] = useState<"unknown" | "show" | "ok">("unknown");
  const [filter, setFilter] = useState<FilterId>("all");
  const [open, setOpen] = useState<Model | null>(null);

  useEffect(() => {
    setGate(window.localStorage.getItem(AGE_KEY) === "1" ? "ok" : "show");
  }, []);

  const shown = useMemo(() => applyFilter(models, filter), [filter]);
  const live = useMemo(() => models.filter((m) => m.live), []);
  const onlineCount = models.filter((m) => m.online || m.live).length;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero online={onlineCount} live={live.length} />
        <LiveRow list={live} onOpen={setOpen} />

        <section id="browse" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">
                <Flame className="size-3.5" /> Near you tonight
              </p>
              <h2 className="mt-1 text-3xl font-semibold text-ivory sm:text-4xl">Browse men</h2>
            </div>
            <p className="text-sm text-muted">
              <b className="text-ivory">{shown.length}</b> {shown.length === 1 ? "man" : "men"} · sorted by distance
            </p>
          </div>
          <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition ${
                    active ? "bg-gold glow-gold" : "border border-line bg-surface/80 text-muted hover:border-gold/50 hover:text-ivory"
                  }`}
                >
                  {f.id === "online" && <span className="size-2 rounded-full bg-online" />}
                  {f.id === "live" && <span className="size-2 rounded-full bg-ruby" />}
                  {f.id === "verified" && <BadgeCheck className="size-4" />}
                  {f.id === "nearby" && <MapPin className="size-4" />}
                  {f.label}
                </button>
              );
            })}
          </div>
          {shown.length ? (
            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
              {[...shown].sort((a, b) => a.km - b.km).map((m) => (
                <Tile key={m.id} m={m} onOpen={setOpen} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-muted">Nobody matches that right now. Try another filter.</p>
          )}
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border-gold-grad p-8 sm:p-12">
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-oxblood/60 blur-3xl" />
            <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">For creators</p>
                <h2 className="mt-2 text-4xl font-semibold text-ivory sm:text-5xl">
                  Your stage. <span className="text-gold italic">Your tips.</span>
                </h2>
                <p className="mt-3 max-w-lg text-muted">
                  Go live from your own space, build your following, and keep it simple: fans tip what they want. No
                  paywalls, no subscriptions in Phase 1.
                </p>
              </div>
              <div className="flex md:justify-end">
                <button className="h-12 rounded-full bg-gold px-8 text-sm font-bold glow-gold transition hover:brightness-110">
                  Apply as a creator
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />

      {open && <QuickView m={open} onClose={() => setOpen(null)} />}
      {gate !== "ok" && (
        <AgeGate
          onEnter={() => {
            window.localStorage.setItem(AGE_KEY, "1");
            setGate("ok");
          }}
        />
      )}
    </div>
  );
}
