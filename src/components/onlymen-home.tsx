import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpDown,
  BadgeCheck,
  Coins,
  Crown,
  Eye,
  Flame,
  LayoutGrid,
  List,
  Lock,
  MapPin,
  MessageCircle,
  Radio,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { AgeGate, DemoBadge, Footer, Header, MobileNav, StatusDot, CityPicker } from "@/components/onlymen-ui";
import { useAgeGate, useCity } from "@/lib/onlymen-hooks";
import { useDirectory } from "@/lib/use-directory";
import { arrangeDirectory, inCity } from "@/lib/directory";
import { FilterDrawer } from "@/components/filter-drawer";
import {
  activeFilterCount,
  applyFilter,
  applySearch,
  applySort,
  cityLabel,
  defaultSearch,
  filters,
  fmtActive,
  fmtDistance,
  fmtHeight,
  sorts,
  type FilterId,
  type Model,
  type Search,
  type SortId,
} from "@/lib/models";

const PAGE = 12;

function Hero({ online, live }: { online: number; live: number }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line/60">
      <img src="/models/hero.webp" alt="" className="om-zoom-out absolute inset-0 -z-10 size-full object-cover object-[70%_center] opacity-75" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(43_7_14/0.35)_0%,rgb(7_4_5/0.82)_75%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/50" />
      <div className="om-enter om-container flex flex-col items-center py-[clamp(3rem,8vw,6rem)] text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
          <Sparkles className="size-3.5" /> Private club for gay men · 18+
        </p>
        <h1 className="mt-5 max-w-3xl text-[3.25rem] leading-[0.95] font-semibold text-ivory drop-shadow-[0_4px_30px_rgb(196_22_63/0.35)] sm:text-8xl">
          Men worth staying <span className="text-gold italic">up for.</span>
        </h1>
        <div className="om-ornament mt-6" aria-hidden="true"><i /></div>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
          A private club of verified creators. Watch them live, start a conversation, and tip the ones
          who make your night.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/nearby" className="om-shimmer grid h-12 place-items-center rounded-full bg-gold px-7 text-sm font-bold glow-gold hover:brightness-110">
            See who's nearby
          </Link>
          <Link
            to="/live"
            className="flex h-12 items-center gap-2 rounded-full border border-ruby/60 bg-oxblood/40 px-6 text-sm font-semibold text-ivory transition hover:bg-oxblood/70"
          >
            <Radio className="size-4 text-ruby" /> Watch live
          </Link>
        </div>
        <dl className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-online" />
            <dt className="sr-only">Online</dt>
            <dd>
              <b className="text-ivory">{online}</b> <span className="text-muted">online</span>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse-dot rounded-full bg-ruby" />
            <dd>
              <b className="text-ivory">{live}</b> <span className="text-muted">live right now</span>
            </dd>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Coins className="size-4 text-gold" /> Invite only · Tips optional · No subscriptions
          </div>
        </dl>
      </div>
    </section>
  );
}

function SectionHead({ kicker, title, icon, tone = "gold", right }: { kicker: string; title: string; icon: React.ReactNode; tone?: "gold" | "ruby"; right?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] ${tone === "ruby" ? "text-ruby" : "text-gold"}`}>
        {icon} {kicker}
      </p>
      <h2 className="text-4xl font-semibold text-ivory sm:text-5xl">{title}</h2>
      <div className="om-ornament" aria-hidden="true"><i /></div>
      {right}
    </div>
  );
}

function LiveRow({ list }: { list: Model[] }) {
  if (!list.length) return null;
  return (
    <section id="live" className="om-reveal om-container om-section scroll-mt-20">
      <SectionHead
        kicker="On air"
        title="Live now"
        tone="ruby"
        icon={<span className="size-2 animate-pulse-dot rounded-full bg-ruby" />}
        right={<Link to="/live" className="inline-flex h-10 items-center text-sm font-semibold text-gold transition hover:text-gold-hi">Schedule & all live →</Link>}
      />
      <div className="om-stagger no-scrollbar om-bleed mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:gap-4">
        {list.map((m) => (
          <Link
            key={m.id}
            to="/watch/$handle"
            params={{ handle: m.handle }}
            className="group relative aspect-[4/5] w-44 shrink-0 snap-start overflow-hidden rounded-2xl text-left glow-ruby sm:w-56"
          >
            <span className="live-ring-border" aria-hidden="true" />
            <img src={m.photo} alt={`${m.name}, live`} className="size-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 tile-shade" />
            <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-ruby px-2.5 py-1 text-xs font-bold tracking-wider text-ivory uppercase">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-ivory" /> Live
            </span>
            {m.source !== "real" && <span className="absolute top-3 left-[4.75rem]"><DemoBadge /></span>}
            <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-ink/70 px-2 py-1 text-xs font-semibold text-ivory backdrop-blur">
              <Eye className="size-3" /> {m.viewers}
            </span>
            <div className="absolute inset-x-3 bottom-3">
              <p className="truncate font-display text-2xl leading-none font-semibold text-ivory">{m.name}</p>
              <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-muted">{m.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Featured({ list, onTip }: { list: Model[]; onTip: (m: Model) => void }) {
  if (!list.length) return null;
  const [spot, ...rest] = list;
  return (
    <section id="featured" className="om-reveal om-container om-section scroll-mt-20">
      <SectionHead
        kicker="Editor’s picks"
        title="Featured"
        icon={<Crown className="size-3.5" />}
        right={<span className="hidden pb-1 text-xs text-dim sm:block">{list.some((m) => m.source === "real") ? "Tonight’s lineup" : "Editor’s picks this week"}</span>}
      />
      <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
        <Link
          to="/m/$handle"
          params={{ handle: spot.handle }}
          className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border-gold-grad glow-gold sm:aspect-[16/10] lg:aspect-auto lg:min-h-[420px]"
        >
          <img src={spot.banner || spot.photo} alt={`${spot.name}${spot.age ? `, ${spot.age}` : ""}`} className="absolute inset-0 size-full object-cover object-[50%_25%] transition duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <span className="absolute top-4 left-4 rounded-full bg-oxblood/90 px-3 py-1 text-[11px] font-extrabold tracking-[0.18em] text-gold-hi uppercase ring-1 ring-gold/40">
            Featured
          </span>
          {spot.source !== "real" && <span className="absolute top-4 right-4"><DemoBadge /></span>}
          <div className="absolute inset-x-5 bottom-5">
            <p className="mt-2 font-display text-4xl leading-none font-semibold text-ivory sm:text-5xl">
              {spot.name}
              {spot.age ? <><span className="text-gold">,</span> <span className="font-normal text-ivory/80">{spot.age}</span></> : null}
            </p>
            {(spot.city || (spot.source !== "real" && spot.metro)) && (
            <p className="mt-2 flex items-center gap-2 text-sm text-muted">
              <MapPin className="size-3.5" /> {spot.source === "real" ? spot.city : `${spot.city} · ${cityLabel(spot.metro)}`}
            </p>
            )}
            {spot.tagline && <p className="mt-3 max-w-sm font-display text-xl text-ivory/90 italic">“{spot.tagline}”</p>}
          </div>
        </Link>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {rest.slice(0, 6).map((m) => (
            <Tile key={m.id} m={m} onTip={onTip} featured />
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ m, onTip, featured = false }: { m: Model; onTip: (m: Model) => void; featured?: boolean }) {
  return (
    <article
      className={`group relative aspect-[3/4] overflow-hidden rounded-md bg-surface transition sm:rounded-xl duration-300 ${m.live ? "ring-0 shadow-[0_0_28px_-8px_rgb(194_42_69_/_0.8)]" : "ring-1"} hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgb(212_175_106_/_0.55)] ${
        m.featured || featured ? "ring-gold/45 hover:ring-gold" : "ring-line/70 hover:ring-gold/60"
      }`}
    >
      <Link to="/m/$handle" params={{ handle: m.handle }} className="absolute inset-0 z-10" aria-label={`View ${m.name}'s profile`} />
      {m.live && <span className="live-ring-border" aria-hidden="true" />}
      <img src={m.photo} alt={`${m.name}, ${m.age}`} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-[1.06]" />
      <div className="absolute inset-0 tile-shade" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5">
        <div className="flex min-w-0 flex-col items-start gap-1">
          {m.live ? (
            <span className="flex items-center gap-1 rounded-full bg-ruby px-2 py-0.5 text-[10px] font-bold tracking-wider text-ivory uppercase">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-ivory" /> Live
            </span>
          ) : m.isNew ? (
            <span className="rounded-full bg-ivory px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-ink uppercase">New</span>
          ) : null}
          {m.source !== "real" && <DemoBadge />}
        </div>
        {m.verified && (
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink/60 backdrop-blur">
            <BadgeCheck className="size-4 text-gold-hi" aria-label="Verified" />
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <StatusDot m={m} />
          <p className="truncate text-base font-bold text-ivory">
            {m.name}{m.age ? <>, <span className="font-medium text-ivory/80">{m.age}</span></> : null}
          </p>
        </div>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted">
          <MapPin className="size-3 shrink-0" /> {m.source === "real" ? (m.city || "OnlyMen") : `${fmtDistance(m.km)} · ${m.city}`}
        </p>
        <p className="mt-1 hidden h-4 items-center gap-1.5 text-[11px] text-muted sm:flex">
          <span className="text-dim">{m.isNew ? "New this week" : m.live ? "Streaming now" : "Creator"}</span>
        </p>
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <div className="overflow-hidden">
            <p className="mt-2 line-clamp-2 text-xs leading-snug text-ivory/85">{m.tagline}</p>
            <div className="relative z-20 mt-2.5 flex gap-1.5">
              <button onClick={() => onTip(m)} className="flex h-8 flex-1 items-center justify-center gap-1 rounded-full bg-gold text-xs font-bold">
                <Coins className="size-3.5" /> Tip
              </button>
              <Link
                to="/messages/$username"
                params={{ username: m.handle }}
                className="grid size-8 place-items-center rounded-full border border-gold/50 bg-ink/60 text-gold-hi"
                aria-label={`Message ${m.name}`}
              >
                <MessageCircle className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Row({ m, onTip }: { m: Model; onTip: (m: Model) => void }) {
  return (
    <article className="group relative grid grid-cols-[104px_minmax(0,1fr)] overflow-hidden rounded-2xl bg-surface/80 ring-1 ring-line/70 transition hover:ring-gold/50 sm:grid-cols-[180px_minmax(0,1fr)]">
      <Link to="/m/$handle" params={{ handle: m.handle }} className="relative block min-h-[150px]" aria-label={`View ${m.name}'s profile`}>
        <img src={m.photo} alt={`${m.name}, ${m.age}`} loading="lazy" className="absolute inset-0 size-full object-cover" />
        {m.live && <span className="live-ring-border rounded-l-2xl" aria-hidden="true" />}
        <span className="absolute top-2 left-2">
          <StatusDot m={m} className="block size-2.5 ring-2 ring-ink" />
        </span>
        {m.source !== "real" && <span className="absolute top-2 right-2"><DemoBadge /></span>}
        {m.live && (
          <span className="absolute bottom-2 left-2 rounded-full bg-ruby px-2 py-0.5 text-[10px] font-bold tracking-wider text-ivory uppercase">Live</span>
        )}
      </Link>
      <div className="flex min-w-0 flex-col gap-3 px-4 pt-2 pb-4 sm:px-5 sm:pt-3 sm:pb-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <Link to="/m/$handle" params={{ handle: m.handle }} className="inline-flex min-h-10 items-center gap-1 text-lg leading-tight font-bold text-ivory hover:text-gold-hi">
              {m.name}{m.age ? <span className="font-medium text-ivory/70"> · {m.age}</span> : null}
            </Link>
            {m.source !== "real" && <DemoBadge />}
            {m.verified && <BadgeCheck className="size-4 shrink-0 text-gold-hi" aria-label="Verified" />}
          </div>
          {m.city && (
          <p className="flex items-center gap-1 text-sm text-muted">
            <MapPin className="size-3.5 shrink-0 text-gold" /> {m.source === "real" ? m.city : `${m.city}, ${cityLabel(m.metro).split(",")[0]}`}
          </p>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-[11px] tracking-wide text-dim uppercase">Height</dt>
            <dd className="text-ivory">{fmtHeight(m.heightCm).split(" · ")[0]}</dd>
          </div>
          <div>
            <dt className="text-[11px] tracking-wide text-dim uppercase">Build</dt>
            <dd className="text-ivory">{m.build}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-[11px] tracking-wide text-dim uppercase">Speaks</dt>
            <dd className="text-ivory">{m.languages.join(", ")}</dd>
          </div>
        </dl>
        <p className="font-display text-lg leading-snug text-ivory/85 italic">“{m.tagline}”</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-dim">{m.source === "real" && !m.live && !m.online ? "OnlyMen creator" : fmtActive(m)}</p>
          <div className="flex gap-2">
            <button onClick={() => onTip(m)} className="flex h-10 items-center gap-1.5 rounded-full bg-gold px-4 text-xs font-bold">
              <Coins className="size-4" /> Tip
            </button>
            <Link
              to="/messages/$username"
              params={{ username: m.handle }}
              className="flex h-10 items-center gap-1.5 rounded-full border border-gold/50 px-4 text-xs font-bold text-gold-hi transition hover:bg-gold/10"
            >
              <MessageCircle className="size-4" /> Message
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TipSheet({ m, onClose }: { m: Model; onClose: () => void }) {
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
        aria-label={`Tip ${m.name}`}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[calc(100dvh-1rem)] w-full max-w-md animate-fade-up overflow-y-auto rounded-t-3xl border-gold-grad p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] glow-gold sm:rounded-3xl sm:p-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-surface-2 text-ivory transition hover:text-gold-hi" aria-label="Close">
          <X className="size-5" />
        </button>
        <div className="flex items-center gap-4">
          <img src={m.photo} alt="" className="size-16 rounded-full object-cover ring-2 ring-gold/60" />
          <div className="min-w-0 pr-10">
            <p className="text-xs font-semibold text-gold">@{m.handle}</p>
            <h3 className="text-3xl font-semibold text-ivory">Tip {m.name}</h3>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[5, 10, 25, 50].map((v) => (
            <button
              key={v}
              onClick={() => setTipped(v)}
              className={`h-12 rounded-xl border text-base font-bold transition ${tipped === v ? "bg-gold border-transparent" : "border-gold/40 text-gold-hi hover:border-gold"}`}
            >
              ${v}
            </button>
          ))}
        </div>
        <p className="mt-3 min-h-5 text-sm text-gold-hi">{tipped ? `Join free to send $${tipped} to ${m.name}. Tips go straight to him.` : "Tips are optional and go straight to the creator."}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/m/$handle" params={{ handle: m.handle }} className="grid h-12 place-items-center rounded-xl border border-line bg-surface-2 text-sm font-semibold text-ivory transition hover:border-gold/50">
            View profile
          </Link>
          <button className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gold text-sm font-bold">
            <Lock className="size-4" /> Join free
          </button>
        </div>
      </div>
    </div>
  );
}

export function OnlyMenHome() {
  const { gate, enter } = useAgeGate();
  const [city, setCity] = useCity();
  const [filter, setFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState<Search>(defaultSearch);
  const [sort, setSort] = useState<SortId>("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawer, setDrawer] = useState(false);
  const [page, setPage] = useState(1);
  const [tip, setTip] = useState<Model | null>(null);
  const { list: catalog } = useDirectory();

  const cityList = useMemo(() => inCity(catalog, city), [catalog, city]);
  const shown = useMemo(
    () => arrangeDirectory(cityList, (demos) => applySort(applySearch(applyFilter(demos, filter), search), sort)),
    [cityList, filter, search, sort],
  );
  // Real profiles lead Featured so the first real creator is visible; then editorial demo picks.
  const featured = useMemo(() => {
    const real = cityList.filter((m) => m.source === "real");
    const demos = applySort(cityList.filter((m) => m.source !== "real" && m.featured), "recommended");
    return [...real, ...demos];
  }, [cityList]);
  const live = useMemo(() => cityList.filter((m) => m.live), [cityList]);
  const onlineCount = catalog.filter((m) => m.online || m.live).length;
  const nFilters = activeFilterCount(search);

  useEffect(() => setPage(1), [city, filter, search, sort]);

  const visible = shown.slice(0, page * PAGE);

  return (
    <div className="min-h-screen">
      <Header city={city} onCity={setCity} q={search.q} onQ={(q) => setSearch({ ...search, q })} onOpenFilters={() => setDrawer(true)} filterCount={nFilters} />
      <main>
        <Hero online={onlineCount} live={catalog.filter((m) => m.live).length} />
        <LiveRow list={live} />
        <Featured list={featured} onTip={setTip} />

        <section id="browse" className="om-container om-section scroll-mt-20">
          <SectionHead
            kicker={city === "all" ? "Everywhere tonight" : `In ${cityLabel(city)}`}
            title="Browse men"
            icon={<Flame className="size-3.5" />}
          />

          {/* toolbar */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <div className="md:hidden">
              <CityPicker city={city} onCity={setCity} compact />
            </div>
            <button
              onClick={() => setDrawer(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface/80 px-4 text-sm font-semibold text-ivory transition hover:border-gold/60"
            >
              <SlidersHorizontal className="size-4 text-gold" /> Filters
              {nFilters > 0 && <span className="grid size-5 place-items-center rounded-full bg-gold text-[11px] font-extrabold">{nFilters}</span>}
            </button>
            <label className="relative flex h-10 items-center gap-2 rounded-full border border-line bg-surface/80 pr-3 pl-4 text-sm font-semibold text-ivory transition focus-within:border-gold/60 hover:border-gold/60">
              <ArrowUpDown className="size-4 text-gold" />
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortId)} className="cursor-pointer appearance-none bg-transparent pr-1 outline-none">
                {sorts.map((s) => (
                  <option key={s.id} value={s.id} className="bg-night">
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-3 sm:ml-auto">
              <p className="hidden text-sm text-muted sm:block">
                <b className="text-ivory">{shown.length}</b> {shown.length === 1 ? "man" : "men"}
              </p>
              <div className="flex rounded-full bg-surface/80 ring-1 ring-line" role="group" aria-label="Layout">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    aria-pressed={view === v}
                    aria-label={v === "grid" ? "Grid view" : "List view"}
                    className={`grid size-10 place-items-center rounded-full transition ${view === v ? "bg-gold" : "text-muted hover:text-ivory"}`}
                  >
                    {v === "grid" ? <LayoutGrid className="size-4" /> : <List className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="no-scrollbar om-bleed mt-3 flex gap-2 overflow-x-auto py-0.5 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition ${
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
            {nFilters > 0 && (
              <button onClick={() => setSearch(defaultSearch)} className="flex h-10 shrink-0 items-center gap-1 rounded-full px-3 text-sm font-semibold whitespace-nowrap text-gold hover:text-gold-hi">
                <X className="size-4" /> Clear {nFilters} filter{nFilters > 1 ? "s" : ""}
              </button>
            )}
          </div>

          {visible.length ? (
            view === "grid" ? (
              <div className="om-stagger -mx-[var(--gutter)] mt-5 grid grid-cols-2 gap-[3px] px-[3px] sm:mx-0 sm:px-0 sm:mt-6 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {visible.map((m) => (
                  <Tile key={m.id} m={m} onTip={setTip} />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-2">
                {visible.map((m) => (
                  <Row key={m.id} m={m} onTip={setTip} />
                ))}
              </div>
            )
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="font-display text-2xl text-ivory">Nobody matches that right now.</p>
              <p className="mt-2 text-sm text-muted">Try another city, loosen a filter, or check back later tonight.</p>
              <button
                onClick={() => {
                  setSearch(defaultSearch);
                  setFilter("all");
                  setCity("all");
                }}
                className="mt-5 h-11 rounded-full bg-gold px-6 text-sm font-bold"
              >
                Reset everything
              </button>
            </div>
          )}

          {shown.length > visible.length && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <button onClick={() => setPage((p) => p + 1)} className="h-12 rounded-full border border-gold/50 px-8 text-sm font-bold text-gold-hi transition hover:bg-gold/10">
                Show more
              </button>
              <p className="text-xs text-dim">
                Showing {visible.length} of {shown.length}
              </p>
            </div>
          )}
        </section>

        <section className="om-reveal om-container om-section">
          <div className="relative overflow-hidden rounded-3xl border-gold-grad p-[clamp(1.5rem,5vw,3rem)] text-center md:text-left">
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-oxblood/60 blur-3xl" />
            <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold">For creators</p>
                <h2 className="mt-2 text-4xl font-semibold text-ivory sm:text-5xl">
                  Your stage. <span className="text-gold italic">Your tips.</span>
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-muted md:mx-0">
                  Go live from your own space, build your following, and keep it simple: fans tip what they want. No paywalls,
                  no subscriptions in Phase 1.
                </p>
              </div>
              <div className="flex justify-center md:justify-end">
                <Link to="/join" search={{ as: "creator" }} className="grid h-12 place-items-center rounded-full bg-gold px-8 text-sm font-bold glow-gold transition hover:brightness-110">Apply as a creator</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav onOpenFilters={() => setDrawer(true)} />

      <FilterDrawer open={drawer} value={search} onChange={setSearch} onClose={() => setDrawer(false)} resultCount={shown.length} />
      {tip && <TipSheet m={tip} onClose={() => setTip(null)} />}
      {gate !== "ok" && <AgeGate onEnter={enter} />}
    </div>
  );
}
