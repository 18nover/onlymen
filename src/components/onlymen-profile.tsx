import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Coins,
  Eye,
  Flag,
  Heart,
  Languages,
  Lock,
  MapPin,
  MessageCircle,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { WatchLiveLink } from "@/components/live-ui";
import { AgeGate, DemoBadge, Footer, Header, MobileNav, StatusDot } from "@/components/onlymen-ui";
import { useAgeGate, useCity } from "@/lib/onlymen-hooks";
import { cityLabel, findModel, fmtActive, fmtHeight, models, type Model } from "@/lib/models";

const crops = [
  { pos: "50% 30%", scale: 1 },
  { pos: "50% 18%", scale: 1.45 },
  { pos: "50% 80%", scale: 1.25 },
  { pos: "25% 40%", scale: 1.6 },
];

function Gallery({ m }: { m: Model }) {
  const [i, setI] = useState(0);
  const n = crops.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  return (
    <div className="om-hero-in -mx-1 sm:mx-0">
      <div className={`group relative aspect-[4/5] overflow-hidden rounded-[22px] sm:rounded-3xl sm:aspect-[4/3] md:aspect-[4/5] lg:aspect-[5/6] ${m.live ? "shadow-[0_0_40px_-10px_rgb(194_42_69_/_0.9)]" : "border-gold-grad glow-gold"}`}>
        {m.live && <span className="live-ring-border !z-20 !p-1" aria-hidden="true" />}
        <div key={i} className="om-photo-in absolute inset-0 overflow-hidden rounded-[inherit]">
          <img
            src={m.photo}
            alt={`${m.name}, photo ${i + 1} of ${n}`}
            className="size-full object-cover transition-transform duration-700 ease-out"
            style={{ objectPosition: crops[i].pos, transform: `scale(${crops[i].scale})`, transformOrigin: crops[i].pos }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/30" />
        <div className="absolute inset-x-5 bottom-5 z-10 md:hidden" aria-hidden="true">
          <p className="font-display text-5xl leading-none font-semibold text-ivory drop-shadow-[0_2px_18px_rgb(0_0_0/0.8)]">{m.name}<span className="text-gold">,</span> <span className="font-normal text-ivory/85">{m.age}</span></p>
          <p className="mt-2 flex items-center gap-2 text-sm text-ivory/80"><StatusDot m={m} /> {fmtActive(m)}{m.city ? ` · ${m.city}` : ""}</p>
        </div>
        <div className="absolute top-4 right-16 left-4 flex flex-wrap gap-2">
          {m.live ? (
            <span className="flex items-center gap-1.5 rounded-full bg-ruby px-3 py-1 text-xs font-bold tracking-wider text-ivory uppercase">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-ivory" /> Live · {m.viewers} watching
            </span>
          ) : null}
        </div>
        <span className="absolute top-4 right-4 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-ivory backdrop-blur">
          {i + 1} / {n}
        </span>
        <button onClick={() => go(-1)} aria-label="Previous photo" className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-ivory backdrop-blur transition hover:text-gold-hi sm:opacity-0 sm:group-hover:opacity-100">
          <ChevronLeft className="size-5" />
        </button>
        <button onClick={() => go(1)} aria-label="Next photo" className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 text-ivory backdrop-blur transition hover:text-gold-hi sm:opacity-0 sm:group-hover:opacity-100">
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="no-scrollbar mt-3 flex justify-center gap-2 overflow-x-auto p-0.5 px-1 sm:justify-start sm:px-0.5">
        {crops.map((c, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Show photo ${k + 1}`}
            aria-current={i === k}
            className={`relative size-16 shrink-0 overflow-hidden rounded-xl ring-2 transition sm:size-20 ${i === k ? "ring-gold" : "ring-transparent opacity-60 hover:opacity-100"}`}
          >
            <img src={m.photo} alt="" className="size-full object-cover" style={{ objectPosition: c.pos, transform: `scale(${c.scale})`, transformOrigin: c.pos }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Card({ title, icon, children, id }: { title: string; icon: React.ReactNode; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="om-reveal min-w-0 scroll-mt-24 rounded-2xl bg-surface/70 p-5 ring-1 ring-line/70 sm:p-6">
      <h2 className="flex items-center gap-2 font-sans text-xs font-bold tracking-[0.22em] text-gold uppercase">
        {icon} {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ActionPanel({ m }: { m: Model }) {
  const [tip, setTip] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-3xl border-gold-grad p-5 sm:p-7">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-gold">
        @{m.handle} {m.verified && <BadgeCheck className="size-4" aria-label="Verified" />}
      </p>
      <h1 className="sr-only mt-1 text-5xl leading-none font-semibold text-ivory md:not-sr-only md:block lg:text-6xl">
        {m.name}
        <span className="text-gold">,</span> <span className="font-normal text-ivory/80">{m.age}</span>
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
        <StatusDot m={m} /> {fmtActive(m)}
        {m.isNew && <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-ink uppercase">New</span>}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="min-w-0 rounded-2xl bg-surface-2/70 p-3.5 ring-1 ring-line/60">
          <p className="text-[11px] tracking-wide text-dim uppercase">Based in</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ivory">
            <MapPin className="size-4 shrink-0 text-gold" /> {m.city}
          </p>
          <p className="mt-0.5 text-xs text-muted">{cityLabel(m.metro)}</p>
        </div>
        <div className="min-w-0 rounded-2xl bg-surface-2/70 p-3.5 ring-1 ring-line/60">
          <p className="text-[11px] tracking-wide text-dim uppercase">Member since</p>
          <p className="mt-1 text-sm font-semibold text-ivory">{m.memberSince}</p>
          <p className="mt-0.5 text-xs text-muted">Creator on OnlyMen</p>
        </div>
      </div>
      <p className="mt-5 font-display text-2xl leading-snug text-ivory/90 italic">“{m.tagline}”</p>
      {m.live && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-ruby/50 bg-oxblood/30 p-3">
          <span className="size-2.5 shrink-0 animate-pulse-dot rounded-full bg-ruby" />
          <p className="min-w-0 flex-1 text-sm text-ivory"><b>Live now</b> <span className="text-muted">· {m.viewers} watching</span></p>
          <WatchLiveLink handle={m.handle} className="h-11 shrink-0" />
        </div>
      )}

      <div className="mt-6">
        <p className="text-[11px] font-bold tracking-[0.2em] text-dim uppercase">Send a tip</p>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {[5, 10, 25, 50].map((v) => (
            <button
              key={v}
              onClick={() => setTip(v)}
              className={`h-11 rounded-xl border text-sm font-bold transition ${tip === v ? "bg-gold border-transparent" : "border-gold/40 text-gold-hi hover:border-gold"}`}
            >
              ${v}
            </button>
          ))}
        </div>
        {tip && <p className="mt-2 text-xs text-gold-hi">Join free to send ${tip}. Tips go straight to {m.name}.</p>}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="flex h-12 items-center justify-center gap-2 rounded-full bg-gold text-sm font-bold glow-gold transition hover:brightness-110">
          <Coins className="size-4" /> Tip {tip ? `$${tip}` : m.name}
        </button>
        <a href="#message" className="flex h-12 items-center justify-center gap-2 rounded-full border border-gold/50 text-sm font-bold text-gold-hi transition hover:bg-gold/10">
          <MessageCircle className="size-4" /> Message
        </a>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1 text-sm text-muted">
        <button onClick={() => setSaved((s) => !s)} aria-pressed={saved} className="flex h-10 items-center gap-1.5 rounded-full px-3 transition hover:text-ivory">
          <Heart className={`size-4 ${saved ? "fill-ruby text-ruby" : ""}`} /> {saved ? "Saved" : "Save"}
        </button>
        <button
          onClick={() => {
            void navigator.clipboard?.writeText(window.location.href).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
          className="flex h-10 items-center gap-1.5 rounded-full px-3 transition hover:text-ivory"
        >
          {copied ? <Check className="size-4 text-online" /> : <Share2 className="size-4" />} {copied ? "Link copied" : "Share"}
        </button>
        <button className="flex h-10 items-center gap-1.5 rounded-full px-3 transition hover:text-ivory">
          <Flag className="size-4" /> Report
        </button>
      </div>
    </div>
  );
}

function MessageBox({ m }: { m: Model }) {
  const [text, setText] = useState("");
  const starters = ["Hi! Loved your profile.", "What are you streaming next?", "Any custom video slots open?"];
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {starters.map((s) => (
          <button key={s} onClick={() => setText(s)} className="inline-flex min-h-10 items-center rounded-full border border-line bg-surface-2/60 px-3.5 text-xs text-muted transition hover:border-gold/50 hover:text-ivory">
            {s}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-end gap-2 rounded-2xl border border-line bg-ink/40 p-2 focus-within:border-gold/60">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder={`Say hi to ${m.name}…`}
          className="min-h-12 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-ivory outline-none placeholder:text-dim"
        />
        <button className="flex h-11 items-center gap-1.5 rounded-xl bg-gold px-4 text-sm font-bold" aria-label="Send message">
          <Send className="size-4" /> <span className="hidden sm:inline">Send</span>
        </button>
      </div>
      <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-dim">
        <Lock className="mt-0.5 size-3.5 shrink-0" /> Join free to send. Keep it respectful — conversations are private between adults.
      </p>
    </div>
  );
}

function Details({ m }: { m: Model }) {
  const rows: [string, string][] = [
    ["Age", `${m.age}`],
    ["Height", fmtHeight(m.heightCm)],
    ["Build", m.build],
    ["Style", m.style],
    ["Ethnicity", m.ethnicity],
    ["Hair", m.hair],
    ["Eyes", m.eyes],
    ["Tattoos", m.tattoos ? "Yes" : "No"],
    ["Zodiac", m.zodiac],
    ["Speaks", m.languages.join(", ")],
    ["Based in", cityLabel(m.metro)],
  ];
  return (
    <dl className="divide-y divide-line/50">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-2.5 text-sm">
          <dt className="shrink-0 text-muted">{k}</dt>
          <dd className="min-w-0 text-right font-semibold text-ivory">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function MiniTile({ m }: { m: Model }) {
  return (
    <Link to="/m/$handle" params={{ handle: m.handle }} className="group relative block aspect-[3/4] w-36 shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-line/70 transition hover:ring-gold/60 sm:w-44">
      <img src={m.photo} alt={`${m.name}, ${m.age}`} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 tile-shade" />
      <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
        {m.source !== "real" && <DemoBadge />}
      </div>
      <div className="absolute inset-x-2.5 bottom-2.5">
        <p className="flex min-w-0 items-center gap-1.5 text-sm font-bold text-ivory">
          <StatusDot m={m} /> <span className="truncate">{m.name}, <span className="font-medium text-ivory/80">{m.age}</span></span>
        </p>
        <p className="truncate text-xs text-muted">{m.city}</p>
      </div>
    </Link>
  );
}

export function OnlyMenProfile({ handle }: { handle: string }) {
  const m = findModel(handle)!;
  const { gate, enter } = useAgeGate();
  const [city, setCity] = useCity();
  const navigate = useNavigate();
  const similar = [...models.filter((x) => x.id !== m.id && x.metro === m.metro), ...models.filter((x) => x.metro !== m.metro)].slice(0, 8);

  return (
    <div className="min-h-screen pb-[150px] md:pb-0">
      <Header
        city={city}
        onCity={(c) => {
          setCity(c);
          void navigate({ to: "/", hash: "browse" });
        }}
      />
      <main className="om-container">
        <Link to="/" hash="browse" className="mt-4 inline-flex h-10 items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-gold-hi">
          <ArrowLeft className="size-4" /> Back to browse
        </Link>
        <p className="om-enter mx-auto mt-1 mb-3 flex w-fit max-w-full items-center gap-2 rounded-full border border-line/80 bg-surface/70 px-3 py-1.5 text-xs text-muted">
          <DemoBadge /> Demo profile · AI-generated portrait, not a real person
        </p>

        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
          <Gallery m={m} />
          <div className="om-enter-2 min-w-0 md:sticky md:top-24 md:self-start">
            <ActionPanel m={m} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
          <div className="grid min-w-0 grid-cols-1 gap-6 content-start">
            <Card title={`About ${m.name}`} icon={<Sparkles className="size-3.5" />}>
              <p className="leading-relaxed text-ivory/85">{m.about}</p>
              <p className="mt-5 text-[11px] font-bold tracking-[0.2em] text-dim uppercase">Interests</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {m.interests.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-medium text-muted">#{t.toLowerCase().replace(/[^a-z0-9]+/g, "")}</span>
                ))}
              </div>
            </Card>
            <Card id="message" title={`Message ${m.name}`} icon={<MessageCircle className="size-3.5" />}>
              <MessageBox m={m} />
            </Card>
          </div>
          <aside className="grid min-w-0 grid-cols-1 content-start gap-6 lg:sticky lg:top-24 lg:self-start">
            <Card title="Details" icon={<Languages className="size-3.5" />}>
              <Details m={m} />
            </Card>
            <Card title="Profile stats" icon={<Eye className="size-3.5" />}>
              <dl className="grid grid-cols-2 gap-2 text-center">
                {[
                  ["Last active", m.online || m.live ? "Now" : fmtActive(m).replace("Active ", "")],
                  ["Member since", m.memberSince],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-surface-2/60 px-2 py-3">
                    <dd className="text-sm font-bold text-ivory">{v}</dd>
                    <dt className="mt-0.5 text-[11px] text-dim">{k}</dt>
                  </div>
                ))}
              </dl>
            </Card>
            <div className="rounded-2xl border border-ruby/40 bg-oxblood/20 p-5 text-sm text-muted">
              <p className="flex items-center gap-2 font-semibold text-ivory">
                <ShieldCheck className="size-4 text-gold" /> {m.verified ? "ID & age verified" : "Verification pending"}
              </p>
              <p className="mt-2 leading-relaxed">
                Every creator is 18+. Never send money outside OnlyMen tips, and report anything that feels off. Demo profile — all details are invented.
              </p>
            </div>
          </aside>
        </div>

        <section className="om-section">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2 className="text-3xl font-semibold text-ivory">More in {cityLabel(m.metro).split(",")[0]}</h2>
            <Link to="/" hash="browse" className="inline-flex h-10 items-center text-sm font-semibold text-gold transition hover:text-gold-hi">See all →</Link>
          </div>
          <div className="no-scrollbar om-bleed mt-4 flex snap-x gap-3 overflow-x-auto pb-2 sm:gap-4">
            {similar.map((x) => (
              <MiniTile key={x.id} m={x} />
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* mobile sticky action bar */}
      <div className="om-above-tabbar om-glass om-slide-up fixed inset-x-3 z-40 mx-auto flex max-w-md items-center gap-2 rounded-full p-1.5 pl-2 md:hidden">
        <img src={m.photo} alt="" className="size-11 rounded-full object-cover ring-1 ring-gold/60" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ivory">{m.name}, {m.age}</p>
          <p className="flex items-center gap-1 truncate text-[11px] text-muted">
            <StatusDot m={m} className="size-1.5" /> {fmtActive(m)}
          </p>
        </div>
        <a href="#message" className="grid size-11 place-items-center rounded-full border border-gold/50 text-gold-hi" aria-label="Message">
          <MessageCircle className="size-5" />
        </a>
        <button className="om-shimmer flex h-11 items-center gap-1.5 rounded-full bg-gold px-5 text-sm font-bold">
          <Coins className="size-4" /> Tip
        </button>
      </div>

      <MobileNav />
      {gate !== "ok" && <AgeGate onEnter={enter} />}
    </div>
  );
}

export function ProfileNotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="font-display text-5xl text-ivory">He's not here tonight.</p>
        <p className="mt-3 text-muted">This profile doesn't exist or has gone private.</p>
        <Link to="/" className="mt-6 inline-grid h-12 place-items-center rounded-full bg-gold px-7 text-sm font-bold">
          Browse men
        </Link>
      </div>
    </div>
  );
}
