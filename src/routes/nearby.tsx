import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Ban, Bookmark, BookmarkCheck, Crown, Flag, Hand, Loader2, MapPin, MapPinOff, Radar, ShieldCheck, Trash2, X } from "lucide-react";
import { FormError, inputCls } from "@/components/account-ui";
import { MobileNav } from "@/components/onlymen-ui";
import {
  deleteLocationFn, heartbeatFn, nearbyActionFn, nearbyConfigFn, nearbyGridFn, nearbyMapFn, saveNearbySettingsFn, updateLocationFn,
} from "@/lib/nearby/api";
import type { Card, GridResult, MapResult, Settings } from "@/lib/nearby/repo.server";
import { REPORT_REASON_OPTIONS } from "@/lib/nearby/reasons";
import type { MapPin as MapPinT, MyPos } from "@/components/nearby-map";
import { bucketIndex, bucketLabel, PRESENCE } from "@/lib/nearby/geo";
import { models, type Model } from "@/lib/models";
import { useDirectory } from "@/lib/use-directory";

const NearbyMap = lazy(() => import("@/components/nearby-map").then((m) => ({ default: m.NearbyMap })));

export const Route = createFileRoute("/nearby")({
  head: () => ({ meta: [{ title: "Nearby — OnlyMen" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Nearby,
});

const REASONS = REPORT_REASON_OPTIONS;
const REFUSED: Record<string, string> = {
  too_soon: "Location updates are limited to one every 20 seconds.",
  too_many_moves: "Too many location changes in the last hour; we'll try again later.",
  implausible_speed: "That jump looked impossible, so we kept your last area.",
};
const PRES = { online: { dot: "bg-online", label: "Online" }, recent: { dot: "bg-gold", label: "Recently active" } };
type Patch = { sharePin?: boolean; hideDistance?: boolean; incognito?: boolean; appearOffline?: boolean; homeZone?: "here" | "clear" };

function Nearby() {
  const [cfg, setCfg] = useState<Awaited<ReturnType<typeof nearbyConfigFn>> | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [grid, setGrid] = useState<GridResult | null>(null);
  const [map, setMap] = useState<MapResult | null>(null);
  const [view, setView] = useState<"grid" | "map">("map");
  const [privOpen, setPrivOpen] = useState(false);
  // Own position for the "You" dot: browser geolocation, client-side only (never sent anywhere by this code).
  const [geo, setGeo] = useState<{ state: "pending" | "ok" | "denied" | "unsupported"; lat?: number; lng?: number }>({ state: "pending" });
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [sel, setSel] = useState<Card | null>(null);
  const { list: directory } = useDirectory();
  const sharing = Boolean(settings?.sharing);

  const loadGrid = useCallback(async () => {
    const r = await nearbyGridFn();
    if (r.ok) setGrid(r.value);
  }, []);
  const loadMap = useCallback(async () => {
    const r = await nearbyMapFn();
    if (r.ok) setMap(r.value);
  }, []);

  useEffect(() => {
    void nearbyConfigFn().then((c) => {
      setCfg(c);
      setSettings(c.settings);
    });
  }, []);

  // Presence heartbeat + refresh while the page is open (polling; no sockets).
  useEffect(() => {
    if (!cfg?.signedIn) return;
    void heartbeatFn();
    void loadGrid();
    const t = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void heartbeatFn();
      void loadGrid();
    }, PRESENCE.heartbeatSec * 1000);
    return () => clearInterval(t);
  }, [cfg?.signedIn, loadGrid]);

  // While sharing, re-read the location every 5 minutes (snapped server-side).
  const push = useCallback((quiet: boolean) => {
    if (!("geolocation" in navigator)) return setErr("This browser can't share a location.");
    if (!quiet) setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const r = await updateLocationFn({ data: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
        setBusy(false);
        if (!r.ok) return setErr(r.error);
        if (r.value.refused && !quiet) setNote(REFUSED[r.value.refused] ?? null);
        const c = await nearbyConfigFn();
        setSettings(c.settings);
        void loadGrid();
        void loadMap();
      },
      () => {
        setBusy(false);
        if (!quiet) setErr("Location permission was denied. You can still browse by your approximate city.");
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 15_000 },
    );
  }, [loadGrid, loadMap]);
  const pushed = useRef(false);
  useEffect(() => {
    if (!sharing) return;
    if (!pushed.current) {
      pushed.current = true;
      push(true);
    }
    const t = setInterval(() => document.visibilityState === "visible" && push(true), 300_000);
    return () => clearInterval(t);
  }, [sharing, push]);

  useEffect(() => {
    if (view === "map") void loadMap();
  }, [view, loadMap]);

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) return setGeo({ state: "unsupported" });
    setGeo((g) => (g.state === "ok" ? g : { state: "pending" }));
    navigator.geolocation.getCurrentPosition(
      (p) => setGeo({ state: "ok", lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setGeo({ state: "denied" }),
      { enableHighAccuracy: true, maximumAge: 60_000, timeout: 12_000 },
    );
  }, []);
  useEffect(() => {
    if (cfg?.signedIn && view === "map") locate();
  }, [cfg?.signedIn, view, locate]);

  const save = async (patch: Patch) => {
    setErr(null);
    const r = await saveNearbySettingsFn({ data: patch });
    if (!r.ok) return setErr(r.error);
    setSettings(r.value);
    void loadGrid();
    if (view === "map") void loadMap();
  };

  const act = async (c: Card, action: "tap" | "save" | "unsave" | "block") => {
    const r = await nearbyActionFn({ data: { action, username: c.username } });
    if (!r.ok) return setErr(r.error);
    setNote(action === "tap" ? `You tapped ${c.displayName}.` : action === "block" ? `${c.displayName} is blocked. Neither of you will see the other.` : null);
    if (action === "block") setSel(null);
    else setSel({ ...c, tapped: c.tapped || action === "tap", saved: action === "save" ? true : action === "unsave" ? false : c.saved });
    void loadGrid();
  };

  // Placeholders only fill the grid up to DEMO_TARGET: each real member replaces one; none once there are enough.
  const realCount = new Set([...(grid?.items ?? []).map((c) => c.username), ...directory.filter((m) => m.source === "real").map((m) => m.handle)]).size;
  const demo = useMemo(() => (cfg?.showDemo ? models.slice(0, demoSlots(realCount)) : []), [cfg?.showDemo, realCount]);

  // Map pins: opted-in members from the server (already jittered), plus labelled demo
  // profiles around the viewer's area when demo profiles are on. Online dots come from the grid.
  const pins = useMemo<MapPinT[]>(() => {
    if (!map?.center) return [];
    const online = new Set((grid?.items ?? []).filter((c) => c.presence === "online").map((c) => c.username));
    const real: MapPinT[] = map.pins.map((p) => ({ ...p, online: online.has(p.username) }));
    const c = map.center;
    const fake: MapPinT[] = demo.slice(0, 8).map((m, i) => {
      const a = (i * 137.5 * Math.PI) / 180;
      const km = 0.95 + (i % 4) * 0.45;
      return { username: m.handle, displayName: m.name, photoId: null, photoUrl: m.photo, online: m.online, live: m.live, demo: true,
        lat: c.lat + (km / 111.32) * Math.cos(a), lng: c.lng + (km / (111.32 * Math.cos((c.lat * Math.PI) / 180))) * Math.sin(a) };
    });
    return [...real, ...fake];
  }, [map, grid, demo]);

  if (!cfg) return <Shell><p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Loading…</p></Shell>;
  if (!cfg.enabled) return <Shell><h1 className="font-display text-4xl">Not found</h1></Shell>;
  if (!cfg.signedIn)
    return (
      <Shell>
        <h1 className="font-display text-4xl">Nearby is for members</h1>
        <Link to="/login" className="text-gold-hi underline">Sign in</Link>
      </Shell>
    );

  const privacy = (
    <PrivacyPanel settings={settings} busy={busy} onShare={() => push(false)} onSave={save}
        onDelete={async () => {
          if (!confirm("Stop sharing and delete your stored area and Nearby settings?")) return;
          await deleteLocationFn();
          pushed.current = false;
          const c = await nearbyConfigFn();
          setSettings(c.settings);
          void loadGrid();
          setNote("Your location is deleted. Nothing about where you were is kept.");
        }} />
  );
  const topbar = (
    <div className="om-topbar">
      <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="OnlyMen home">
        <span className="grid size-8 shrink-0 place-items-center rounded-full border-gold-grad"><Crown className="size-3.5 text-gold-hi" strokeWidth={1.6} /></span>
        <span className="truncate font-display text-[22px] font-semibold tracking-tight text-gold">Only<span className="italic">Men</span></span>
      </Link>
      <div className="flex items-center gap-2">
        {view === "map" && (
          <button onClick={() => setPrivOpen(true)} aria-label="Location and privacy" className="grid size-10 place-items-center rounded-full border border-gold/30 text-gold-hi">
            <ShieldCheck className="size-[18px]" />
          </button>
        )}
        <div className="om-seg" role="group" aria-label="View">
          {(["map", "grid"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} aria-pressed={view === v} className="capitalize">{v}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // Where to centre and where the "You" dot goes: the device first, else the saved (rounded) area.
  const me: MyPos | null = geo.state === "ok" && geo.lat != null && geo.lng != null ? { lat: geo.lat, lng: geo.lng, exact: true } : map?.center ? { ...map.center, exact: false } : null;
  const mapCenter = me ?? map?.center ?? null;

  if (view === "map")
    return (
      <>
        <main className="text-ivory">
          <h1 className="sr-only">Nearby map</h1>
          {mapCenter && (
            <Suspense fallback={null}>
              <NearbyMap center={mapCenter} me={me} pins={pins} onOpen={(u) => void navigate({ to: "/m/$handle", params: { handle: u } })} />
            </Suspense>
          )}
          {topbar}
          <div className="pointer-events-none fixed inset-x-3 top-[calc(76px+env(safe-area-inset-top,0px))] z-20 mx-auto grid max-w-md justify-items-center gap-2">
            {err && <p className="pointer-events-auto rounded-full border border-ruby/60 bg-ink/85 px-4 py-2 text-xs">{err}</p>}
            {note && <p className="pointer-events-auto rounded-full border border-gold/40 bg-ink/85 px-4 py-2 text-xs">{note}</p>}
            {mapCenter && geo.state !== "ok" && geo.state !== "pending" && (
              <p className="pointer-events-auto max-w-sm rounded-2xl border border-gold/40 bg-ink/85 px-4 py-2 text-center text-xs text-ivory/90">
                {geo.state === "denied" ? "Location is off, so this is your saved area. Turn on location for this site in your browser to see your exact spot. " : "This browser can't share a location. "}
                {geo.state === "denied" && <button type="button" onClick={locate} className="font-bold text-gold-hi underline">Try again</button>}
              </p>
            )}
            {mapCenter && !map?.center && (
              <button type="button" disabled={busy} onClick={() => push(false)} className="pointer-events-auto rounded-full border border-gold/40 bg-ink/85 px-4 py-2 text-xs font-bold text-gold-hi">Share my approximate area to see members nearby</button>
            )}
            {map?.center && demo.length > 0 && <p className="rounded-full bg-ink/70 px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-gold/85 uppercase backdrop-blur">Demo pins · not real people</p>}
          </div>
          {!map ? (
            <div className="fixed inset-0 grid place-items-center"><p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Loading map…</p></div>
          ) : !mapCenter && geo.state === "pending" ? (
            <div className="fixed inset-0 grid place-items-center"><p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Finding you…</p></div>
          ) : !mapCenter ? (
            <div className="fixed inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_30%,#2a0a12,#070405_70%)] px-6">
              <div className="grid max-w-sm justify-items-center gap-3 text-center">
                <Radar className="size-8 text-gold" />
                <h2 className="font-display text-3xl">See who's around</h2>
                <p className="text-sm text-muted">{geo.state === "denied" ? "Location is blocked for this site. Turn it on in your browser settings to see yourself on the map, or share an approximate area below. " : ""}Other members only ever see your spot rounded to an area about 1.2 km across. Your exact spot stays on your device.</p>
                <button disabled={busy} onClick={() => push(false)} className="om-shimmer flex h-11 items-center gap-2 rounded-full bg-gold px-6 text-sm font-bold text-ink disabled:opacity-60">{busy && <Loader2 className="size-4 animate-spin" />} Share my approximate area</button>
                <button onClick={() => setView("grid")} className="text-sm font-semibold text-gold-hi underline">Browse the grid instead</button>
              </div>
            </div>
          ) : null}
          {privOpen && (
            <div className="fixed inset-0 z-50 grid place-items-end bg-ink/70 sm:place-items-center" onClick={() => setPrivOpen(false)}>
              <div className="max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface p-2 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-end p-1"><button onClick={() => setPrivOpen(false)} aria-label="Close" className="text-muted"><X className="size-5" /></button></div>
                {privacy}
              </div>
            </div>
          )}
          {sel && <Sheet c={sel} onClose={() => setSel(null)} onAct={act} onReported={() => { setSel(null); setNote("Thanks. Our team will review this report."); void loadGrid(); }} />}
        </main>
        <MobileNav />
      </>
    );

  return (
    <>
    {topbar}
    <main className="mx-auto grid max-w-6xl gap-5 px-4 pt-[calc(88px+env(safe-area-inset-top,0px))] pb-[calc(var(--tabbar-h)+var(--tabbar-gap)+env(safe-area-inset-bottom,0px)+2rem)] text-ivory sm:px-6">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col items-center">
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Around you</p>
          <h1 className="mt-1 flex items-center gap-3 font-display text-5xl font-semibold"><Radar className="size-7 text-gold" /> Nearby</h1>
          <div className="om-ornament mt-2" aria-hidden="true"><i /></div>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {grid?.origin ? "Members who share an area appear first, nearest first. Everyone else is listed after." : "Everyone on OnlyMen. Share your area to see who's nearest first."}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 text-sm font-semibold">
          {cfg.isAdmin && <Link to="/admin/reports" className="grid h-10 place-items-center rounded-full border border-line px-4 text-gold-hi">Reports</Link>}
          <Link to="/" className="grid h-10 place-items-center rounded-full border border-line px-4 text-gold-hi">Home</Link>
        </div>
      </header>

      <FormError>{err}</FormError>
      {note && <p className="rounded-xl border border-gold/40 bg-surface px-4 py-3 text-sm">{note}</p>}

      {privacy}

      <DirectoryGrid items={grid?.items ?? []} directory={directory} hasOrigin={Boolean(grid?.origin)} onOpen={(c) => setSel(c)} />

      {sel && <Sheet c={sel} onClose={() => setSel(null)} onAct={act} onReported={() => { setSel(null); setNote("Thanks. Our team will review this report."); void loadGrid(); }} />}
    </main>
    <MobileNav />
    </>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center px-6 text-center text-ivory"><div className="grid gap-4">{children}</div></main>;
}

/** Target number of tiles (real + placeholder). Real members come first and each one removes a placeholder. */
const DEMO_TARGET = 12;
const demoSlots = (real: number) => Math.max(0, DEMO_TARGET - real);

function DirectoryGrid({ items, directory, hasOrigin, onOpen }: { items: Card[]; directory: Model[]; hasOrigin: boolean; onOpen: (c: Card) => void }) {
  const seen = new Set(items.map((c) => c.username));
  const realTotal = new Set([...seen, ...directory.filter((m) => m.source === "real").map((m) => m.handle)]).size;
  const slots = demoSlots(realTotal);
  let demoShown = 0;
  const rest = directory.filter((m) => {
    if (seen.has(m.handle)) return false;
    if (m.source === "real") return true;
    return demoShown++ < slots;
  });
  if (items.length === 0 && rest.length === 0) {
    return <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">No one nearby yet. Invite friends.</p>;
  }
  return (
    <section className="grid gap-4">
      {items.length > 0 && (
        <div className="om-stagger -mx-4 grid grid-cols-3 gap-[2px] px-[2px] sm:mx-0 sm:px-0 sm:grid-cols-4 sm:gap-1 sm:rounded-2xl lg:grid-cols-6">
          {items.map((c) => <Tile key={c.username} c={c} onClick={() => onOpen(c)} />)}
        </div>
      )}
      {rest.length > 0 && (
        <div className="grid gap-2">
          {hasOrigin && items.length > 0 && <p className="text-center text-[11px] font-bold tracking-[0.25em] text-gold/80 uppercase">Everyone else</p>}
          <div className="om-stagger -mx-4 grid grid-cols-3 gap-[2px] px-[2px] sm:mx-0 sm:px-0 sm:grid-cols-4 sm:gap-1 sm:rounded-2xl lg:grid-cols-6">
            {rest.map((m) => (
              <Link key={m.handle} to="/m/$handle" params={{ handle: m.handle }} className="om-tile">
                <img src={m.photo} alt="" loading="lazy" />
                {m.source !== "real" && <span className="absolute top-1.5 left-1.5 z-[3] rounded-sm bg-ink/75 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-gold uppercase backdrop-blur">Demo</span>}
                {m.online && <span className="om-online absolute top-2 right-2 z-[3] size-2.5 rounded-full bg-online" title="Online" />}
                <span className="om-tile-meta">
                  <span className="block truncate text-[13px] font-bold text-ivory">{m.name} {m.age != null && <span className="font-medium text-ivory/75">{m.age}</span>}</span>
                  <span className="block text-[10px] font-semibold tracking-wider text-gold-hi uppercase">{hasOrigin && m.km != null ? bucketLabel(bucketIndex(m.km)) : (m.city || "OnlyMen")}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function Tile({ c, onClick }: { c: Card; onClick: () => void }) {
  return (
    <button onClick={onClick} className="om-tile text-left">
      {c.photoId ? <img src={`/api/photo/${encodeURIComponent(c.photoId)}`} alt="" loading="lazy" /> : <span className="grid size-full place-items-center bg-[radial-gradient(circle_at_50%_35%,#4a0614,#0f0809)]"><img src="/icon-512.png" alt="" className="size-1/2 rounded-full opacity-90" /></span>}
      {c.presence && <span className={`absolute top-2 right-2 z-[3] size-2.5 rounded-full ${PRES[c.presence].dot} ${c.presence === "online" ? "om-online" : "ring-2 ring-ink"}`} title={PRES[c.presence].label} />}
      <span className="om-tile-meta">
        <span className="block truncate text-[13px] font-bold text-ivory">{c.displayName} {c.age != null && <span className="font-medium text-ivory/75">{c.age}</span>} {c.verified && <ShieldCheck className="inline size-3 text-gold" />}</span>
        <span className="block text-[10px] font-semibold tracking-wider text-gold-hi uppercase">{c.distance ?? "Distance hidden"}</span>
      </span>
    </button>
  );
}

function Sheet({ c, onClose, onAct, onReported }: { c: Card; onClose: () => void; onAct: (c: Card, a: "tap" | "save" | "unsave" | "block") => void; onReported: () => void }) {
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const btn = "flex h-11 items-center justify-center gap-2 rounded-full border border-line px-4 text-sm font-semibold";
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/70 sm:place-items-center" onClick={onClose}>
      <div className="grid w-full max-w-md gap-4 rounded-t-2xl border border-line bg-surface p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">{c.displayName}{c.age != null ? `, ${c.age}` : ""}</h2>
            <p className="text-sm text-muted">{c.distance ?? "Distance hidden"}{c.presence ? ` · ${PRES[c.presence].label}` : ""}{c.creator ? " · Creator" : ""}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-muted"><X className="size-5" /></button>
        </div>
        {!reporting ? (
          <div className="grid grid-cols-2 gap-2">
            <Link to="/m/$handle" params={{ handle: c.username }} className={`${btn} border-gold text-gold-hi`}>View profile</Link>
            <Link to="/messages/$username" params={{ username: c.username }} className={`${btn} border-gold text-gold-hi`}>Message</Link>
            <button className={btn} onClick={() => onAct(c, "tap")}><Hand className="size-4 text-gold" /> {c.tapped ? "Tapped" : "Tap"}</button>
            <button className={btn} onClick={() => onAct(c, c.saved ? "unsave" : "save")}>{c.saved ? <BookmarkCheck className="size-4 text-gold" /> : <Bookmark className="size-4 text-gold" />} {c.saved ? "Saved" : "Save"}</button>
            <button className={btn} onClick={() => confirm(`Block ${c.displayName}? Neither of you will see the other.`) && onAct(c, "block")}><Ban className="size-4 text-ruby" /> Block</button>
            <button className={btn} onClick={() => setReporting(true)}><Flag className="size-4 text-ruby" /> Report</button>
          </div>
        ) : (
          <form className="grid gap-3" onSubmit={async (e) => {
            e.preventDefault();
            if (!reason) return setErr("Pick a reason.");
            const r = await nearbyActionFn({ data: { action: "report", username: c.username, reason, details, alsoBlock } });
            if (!r.ok) return setErr(r.error);
            onReported();
          }}>
            <FormError>{err}</FormError>
            <div className="grid gap-1.5">
              {REASONS.map((r) => (
                <label key={r.id} className="flex items-center gap-2 text-sm"><input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} /> {r.label}</label>
              ))}
            </div>
            <textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={1000} placeholder="Anything else we should know (optional)" className={`${inputCls} min-h-20 py-2`} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={alsoBlock} onChange={(e) => setAlsoBlock(e.target.checked)} /> Also block {c.displayName}</label>
            <div className="flex gap-2">
              <button type="button" className={btn} onClick={() => setReporting(false)}>Back</button>
              <button className={`${btn} flex-1 border-ruby bg-oxblood/50`}>Send report</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input type="checkbox" className="mt-1" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span><b className="text-ivory">{label}</b><br /><span className="text-muted">{hint}</span></span>
    </label>
  );
}

function PrivacyPanel({ settings, busy, onShare, onSave, onDelete }: {
  settings: Settings | null; busy: boolean; onShare: () => void;
  onSave: (p: Patch) => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (!settings) return null;
  return (
    <section className="grid gap-3 rounded-2xl border-gold-grad p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {settings.sharing ? <><MapPin className="size-4 text-online" /> Sharing your approximate area</> : <><MapPinOff className="size-4 text-dim" /> Not sharing your location</>}
          {settings.incognito && <span className="rounded-full border border-gold/60 px-2 text-xs text-gold-hi">Incognito</span>}
        </p>
        <div className="flex gap-2">
          {!settings.sharing && <button disabled={busy} onClick={onShare} className="flex h-10 items-center gap-2 rounded-full bg-gold px-5 text-sm font-bold text-ink disabled:opacity-60">{busy && <Loader2 className="size-4 animate-spin" />} Share my location</button>}
          <button onClick={() => setOpen(!open)} aria-expanded={open} className="h-10 rounded-full border border-line px-4 text-sm font-semibold">Privacy {open ? "▲" : "▼"}</button>
        </div>
      </div>
      {!open && <p className="text-xs text-muted">Rounded to about 1.2 km on our server · your exact spot is never stored · others see a range, not a distance. <button onClick={() => setOpen(true)} className="font-semibold text-gold-hi underline">How it works</button></p>}
      {open && (
        <div className="grid gap-4">
          <p className="text-sm text-muted">
            How it works: your phone's position is rounded on our server to an area about 1.2 km across, and the exact position is thrown away immediately. We keep only that one area, replaced each time it changes — no history. Others see a distance range like "2–5 km", never an exact distance. Map pins are off unless you turn them on, and even then they're moved randomly within about a kilometre, to a new spot each day.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Toggle label="Show me on the map" hint="Off by default. Your pin is approximate." on={settings.sharePin} onChange={(v) => onSave({ sharePin: v })} />
            <Toggle label="Hide my distance" hint={'Others see "Distance hidden" and you get no map pin.'} on={settings.hideDistance} onChange={(v) => onSave({ hideDistance: v })} />
            <Toggle label="Incognito" hint="You don't appear in Nearby at all. You can still browse." on={settings.incognito} onChange={(v) => onSave({ incognito: v })} />
            <Toggle label="Appear offline" hint="No online dot and no map pin." on={settings.appearOffline} onChange={(v) => onSave({ appearOffline: v })} />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">Home zone (no map pin while you're in or next to it):</span>
            {settings.homeZone ? (
              <button onClick={() => onSave({ homeZone: "clear" })} className="h-9 rounded-full border border-line px-3 font-semibold">Clear home zone</button>
            ) : (
              <button disabled={!settings.sharing} onClick={() => onSave({ homeZone: "here" })} className="h-9 rounded-full border border-line px-3 font-semibold disabled:opacity-50">Set my current area as home</button>
            )}
            {settings.homeZone && <span className="text-online">Set</span>}
          </div>
          <button onClick={onDelete} className="flex h-10 w-fit items-center gap-2 rounded-full border border-ruby/60 px-4 text-sm font-semibold text-ruby"><Trash2 className="size-4" /> Stop sharing &amp; delete my location</button>
        </div>
      )}
    </section>
  );
}
