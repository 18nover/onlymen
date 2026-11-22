import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Crown, Flame, Gem, Lock, MapPin, Radar, Radio, Search, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import { company } from "@/lib/company";
import { useAccount } from "@/lib/account/use-account";
import { useImageUrl } from "@/lib/account/media";
import { useNearbyEnabled } from "@/lib/nearby/use-nearby";

const footerRoutes: Record<string, string> = {
  "Become a creator": "/join?as=creator",
  "Terms of service": "/terms",
  Privacy: "/privacy",
  "2257 statement": "/2257",
  "Community guidelines": "/guidelines",
  "18+ & age verification": "/2257",
};

function Avatar({ id, name, className = "size-8" }: { id?: string; name: string; className?: string }) {
  const url = useImageUrl(id);
  return url ? (
    <img src={url} alt="" className={`${className} rounded-full object-cover ring-1 ring-gold/60`} />
  ) : (
    <span className={`${className} grid place-items-center rounded-full bg-oxblood font-display text-sm font-bold text-gold-hi ring-1 ring-gold/60`}>{name.slice(0, 1).toUpperCase()}</span>
  );
}

function AccountButtons() {
  const { account, ready } = useAccount();
  if (ready && account) {
    const primary = account.profile.photos.find((p) => p.primary)?.id;
    return (
      <Link to={account.onboarding.finishedAt ? "/me" : "/onboarding"} className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface/80 pr-4 pl-1 text-sm font-semibold text-ivory transition hover:border-gold/60">
        <Avatar id={primary} name={account.profile.displayName || account.username} />
        <span className="hidden max-w-[8rem] truncate sm:inline">{account.onboarding.finishedAt ? account.profile.displayName || "My profile" : "Finish setup"}</span>
      </Link>
    );
  }
  return (
    <>
      <Link to="/login" className="hidden h-10 items-center rounded-full px-3 text-sm font-semibold whitespace-nowrap text-ivory transition hover:text-gold-hi sm:flex">
        Sign in
      </Link>
      <Link to="/join" className="flex h-10 items-center rounded-full bg-gold px-5 text-sm font-bold whitespace-nowrap transition hover:brightness-110">Join free</Link>
    </>
  );
}

function MobileAccountLink({ cls }: { cls: string }) {
  const { account, ready } = useAccount();
  if (ready && account) {
    return (
      <Link to="/me" className={cls}>
        <Avatar id={account.profile.photos.find((p) => p.primary)?.id} name={account.profile.displayName || account.username} className="size-5" /> Me
      </Link>
    );
  }
  return (
    <Link to="/login" className={cls}>
      <Lock className="size-5 text-gold" /> Sign in
    </Link>
  );
}
import { cities, cityLabel, models, type CityId, type Model, type Tier } from "@/lib/models";
import { useDirectory } from "@/lib/use-directory";


export function Brand({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`grid place-items-center rounded-full border-gold-grad ${size === "lg" ? "size-12" : "size-8"}`}>
        <Crown className={`text-gold-hi ${size === "lg" ? "size-5" : "size-3.5"}`} strokeWidth={1.6} />
      </span>
      <span className={`font-display font-semibold tracking-tight text-gold ${size === "lg" ? "text-5xl" : "text-2xl"}`}>
        Only<span className="italic">Men</span>
      </span>
    </span>
  );
}

export function TierBadge({ tier, className = "" }: { tier: Tier; className?: string }) {
  if (!tier) return null;
  return tier === "elite" ? (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold tracking-[0.14em] uppercase ${className}`}>
      <Crown className="size-3" strokeWidth={2.4} /> Elite
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 rounded-full border border-gold/60 bg-ink/70 px-2 py-0.5 text-[10px] font-extrabold tracking-[0.14em] text-gold-hi uppercase backdrop-blur ${className}`}>
      <Gem className="size-3" strokeWidth={2.4} /> Premium
    </span>
  );
}

export function Stars({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) {
  const s = size === "lg" ? "size-5" : "size-3.5";
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${s} ${i <= Math.round(value) ? "fill-gold text-gold" : "text-line"}`} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export function StatusDot({ m, className = "size-2" }: { m: Pick<Model, "live" | "online" | "availableNow">; className?: string }) {
  return (
    <span
      className={`shrink-0 rounded-full ${className} ${m.live ? "bg-ruby" : m.online || m.availableNow ? "bg-online" : "bg-dim"}`}
      aria-label={m.live ? "Live" : m.online ? "Online" : "Offline"}
    />
  );
}

export function AgeGate({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-ink/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
      <div className="absolute inset-0 vignette" />
      <div className="relative w-full max-w-md animate-fade-up rounded-2xl border-gold-grad p-[clamp(1.5rem,6vw,2.5rem)] text-center glow-gold">
        <div className="flex justify-center">
          <Brand size="lg" />
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">{company.domain}</p>
        <div className="mx-auto mt-8 grid size-16 place-items-center rounded-full border border-ruby/60 bg-oxblood/40 glow-ruby">
          <span className="font-display text-2xl font-bold text-ivory">18+</span>
        </div>
        <h2 className="mt-6 text-3xl font-semibold text-ivory">Adults only, after dark.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This site contains mature content for adult men. By entering you confirm you are at least 18 years old (or the
          age of majority where you live) and agree to our Terms and Community Rules.
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

function useOutside<T extends HTMLElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && close();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`rounded-full bg-ink/75 px-2 py-0.5 text-[10px] font-bold tracking-wider text-ivory/90 uppercase ring-1 ring-ivory/25 backdrop-blur ${className}`}>
      Demo
    </span>
  );
}

export function CityPicker({ city, onCity, compact = false }: { city: CityId | "all"; onCity: (c: CityId | "all") => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useOutside<HTMLDivElement>(open, () => setOpen(false));
  const { list } = useDirectory();
  const catalog = list.length ? list : models;
  const counts = Object.fromEntries(cities.map((c) => [c.id, catalog.filter((m) => m.source === "real" ? m.metroKnown !== false && m.metro === c.id : m.metro === c.id).length]));
  const options: { id: CityId | "all"; label: string; n: number }[] = [
    { id: "all", label: "All cities", n: catalog.length },
    ...cities.map((c) => ({ id: c.id, label: `${c.label}, ${c.region}`, n: counts[c.id] })),
  ];
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-10 items-center gap-2 rounded-full border border-line bg-surface/80 text-sm font-semibold text-ivory transition hover:border-gold/60 ${compact ? "px-3" : "px-4"}`}
      >
        <MapPin className="size-4 text-gold" />
        <span className={`truncate ${compact ? "max-w-[7.5rem]" : "max-w-[10rem]"}`}>{cityLabel(city)}</span>
        <ChevronDown className={`size-4 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="fixed inset-0 z-[55] bg-ink/70 backdrop-blur-sm md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}
      {open && (
        <div
          role="listbox"
          className="om-fixed-bottom fixed inset-x-3 z-[56] max-h-[calc(100dvh-6rem)] animate-fade-up overflow-y-auto rounded-2xl border-gold-grad p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:z-50 md:mt-2 md:w-72 md:pb-2"
        >
          <p className="px-3 pt-2 pb-1 text-[11px] font-bold tracking-[0.2em] text-dim uppercase">Browse by city</p>
          {options.map((o) => (
            <button
              key={o.id}
              role="option"
              aria-selected={city === o.id}
              onClick={() => {
                onCity(o.id);
                setOpen(false);
              }}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm transition hover:bg-surface-2 ${city === o.id ? "text-gold-hi" : "text-ivory"}`}
            >
              <MapPin className="size-4 text-dim" />
              <span className="flex-1">{o.label}</span>
              <span className="text-xs text-dim">{o.n}</span>
              {city === o.id && <Check className="size-4 text-gold" />}
            </button>
          ))}
          <p className="border-t border-line/60 px-3 pt-2 pb-1 text-[11px] text-dim">More cities open as creators join.</p>
        </div>
      )}
    </div>
  );
}

type HeaderProps = {
  city: CityId | "all";
  onCity: (c: CityId | "all") => void;
  q?: string;
  onQ?: (q: string) => void;
  onOpenFilters?: () => void;
  filterCount?: number;
};

export function Header({ city, onCity, q, onQ, onOpenFilters, filterCount = 0 }: HeaderProps) {
  const nearby = useNearbyEnabled();
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/80 backdrop-blur-xl">
      <div className="om-container flex h-16 items-center gap-3 lg:gap-4">
        <Link to="/" aria-label="OnlyMen home" className="flex h-10 shrink-0 items-center">
          <Brand />
        </Link>
        <div className="hidden md:block">
          <CityPicker city={city} onCity={onCity} />
        </div>
        {onQ && (
          <label className="hidden h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface/80 px-4 text-sm transition focus-within:border-gold/60 lg:flex lg:max-w-xs xl:max-w-sm">
            <Search className="size-4 shrink-0 text-dim" />
            <input
              value={q}
              onChange={(e) => onQ(e.target.value)}
              placeholder="Search name, #interest or area"
              className="min-w-0 flex-1 bg-transparent text-ivory outline-none placeholder:text-dim"
            />
          </label>
        )}
        <nav className="hidden shrink-0 items-center gap-1 text-sm font-medium text-muted xl:flex">
          <Link to="/" hash="browse" className="rounded-full px-3 py-2 transition hover:text-gold-hi">Browse</Link>
          <Link to="/live" className="flex items-center gap-1.5 rounded-full px-3 py-2 transition hover:text-gold-hi" activeProps={{ className: "text-gold-hi" }}>
            <span className="size-1.5 animate-pulse-dot rounded-full bg-ruby" /> Live
          </Link>
          <Link to="/" hash="featured" className="rounded-full px-3 py-2 transition hover:text-gold-hi">Featured</Link>
          {nearby && <Link to="/nearby" className="rounded-full px-3 py-2 transition hover:text-gold-hi" activeProps={{ className: "text-gold-hi" }}>Nearby</Link>}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {onOpenFilters && (
            <button
              onClick={onOpenFilters}
              className="relative hidden h-10 items-center gap-2 rounded-full border border-line bg-surface/80 px-4 text-sm font-semibold whitespace-nowrap text-ivory transition hover:border-gold/60 md:flex"
            >
              <SlidersHorizontal className="size-4 text-gold" /> Filters
              {filterCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-gold text-[11px] font-extrabold">{filterCount}</span>
              )}
            </button>
          )}
          <AccountButtons />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const cols = [
    { title: "Explore", links: ["Browse", "Live now", "New faces", "Become a creator"] },
    { title: "Safety", links: ["18+ & age verification", "Community guidelines", "Safety center", "Report a profile"] },
    { title: "Legal", links: ["Terms of service", "Privacy", "Cookies", "2257 statement", "DMCA"] },
  ];
  return (
    <footer className="om-bottom-safe mt-[calc(var(--section-gap)*1.25)] border-t border-line/60 bg-night/80">
      <div className="om-container grid grid-cols-2 gap-x-6 gap-y-10 py-[clamp(2.5rem,5vw,3.5rem)] sm:grid-cols-3 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="col-span-2 sm:col-span-3 md:col-span-1">
          <Brand />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            A private community of verified adult creators. {company.phase}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-ruby/50 bg-oxblood/30 px-3 py-1.5 text-xs font-semibold text-ivory">
            <span className="font-display text-sm font-bold">18+</span> Adults only. Consent always.
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{c.title}</p>
            <ul className="mt-3 grid text-sm text-muted md:mt-4 md:gap-1">
              {c.links.map((l) => (
                <li key={l}>
                  {footerRoutes[l] ? (
                    <a href={footerRoutes[l]} className="inline-flex min-h-10 items-center transition hover:text-ivory md:min-h-8">{l}</a>
                  ) : (
                    <a href="#" className="inline-flex min-h-10 items-center transition hover:text-ivory md:min-h-8">{l}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line/60">
        <div className="om-container py-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Creators by city</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 text-sm text-muted">
            {cities.map((c) => (
              <li key={c.id}>
                <a href="#browse" className="inline-flex min-h-10 items-center transition hover:text-ivory">{c.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="om-container flex flex-col gap-2 py-6 text-xs leading-relaxed text-dim sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>Everyone with a real account on {company.domain} is 18 or older. Profiles labeled Demo are invented placeholders (including AI-generated portraits) and are not real people.</p>
          <p>© 2026 {company.company} · {company.companyDomain}</p>
        </div>
      </div>
    </footer>
  );
}

export function MobileNav({ onOpenFilters }: { onOpenFilters?: () => void }) {
  const nearby = useNearbyEnabled();
  const cls =
    "flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold text-muted transition active:bg-surface-2 active:text-gold-hi";
  return (
    <nav className="om-fixed-bottom fixed inset-x-3 z-40 mx-auto grid max-w-md grid-cols-4 rounded-2xl border-gold-grad p-1 shadow-2xl md:hidden" aria-label="Primary">
      <Link to="/" hash="browse" className={cls}>
        <Flame className="size-5 text-gold" /> Browse
      </Link>
      <Link to="/live" className={cls}>
        <Radio className="size-5 text-gold" /> Live
      </Link>
      {onOpenFilters ? (
        <button onClick={onOpenFilters} className={cls}>
          <SlidersHorizontal className="size-5 text-gold" /> Filters
        </button>
      ) : nearby ? (
        <Link to="/nearby" className={cls}>
          <Radar className="size-5 text-gold" /> Nearby
        </Link>
      ) : (
        <Link to="/" hash="featured" className={cls}>
          <Crown className="size-5 text-gold" /> Featured
        </Link>
      )}
      <MobileAccountLink cls={cls} />
    </nav>
  );
}
