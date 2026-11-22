import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Ban, Bookmark, BookmarkCheck, Flag, Hand, Loader2, MapPin, MapPinOff, Radar, ShieldCheck, Trash2, X } from "lucide-react";
import { FormError, inputCls } from "@/components/account-ui";
import {
  deleteLocationFn, heartbeatFn, nearbyActionFn, nearbyConfigFn, nearbyGridFn, nearbyMapFn, saveNearbySettingsFn, updateLocationFn,
} from "@/lib/nearby/api";
import type { Card, GridResult, MapResult, Settings } from "@/lib/nearby/repo.server";
import { bucketIndex, bucketLabel, PRESENCE } from "@/lib/nearby/geo";
import { models } from "@/lib/models";

const NearbyMap = lazy(() => import("@/components/nearby-map").then((m) => ({ default: m.NearbyMap })));

export const Route = createFileRoute("/nearby")({
  head: () => ({ meta: [{ title: "Nearby — OnlyMen" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Nearby,
});

const REASONS: { id: string; label: string }[] = [
  { id: "underage", label: "May be under 18" },
  { id: "selling_sex", label: "Selling sex / escorting" },
  { id: "non_consensual", label: "Non-consensual content" },
  { id: "scam", label: "Scam or spam links" },
  { id: "harassment", label: "Harassment" },
  { id: "impersonation", label: "Fake or impersonation" },
  { id: "other", label: "Something else" },
];
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
  const [view, setView] = useState<"grid" | "map">("grid");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [sel, setSel] = useState<Card | null>(null);
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
      },
      () => {
        setBusy(false);
        if (!quiet) setErr("Location permission was denied. You can still browse by your approximate city.");
      },
      { enableHighAccuracy: false, maximumAge: 300_000, timeout: 15_000 },
    );
  }, [loadGrid]);
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

  const demo = useMemo(() => (cfg?.showDemo ? models.slice(0, 12) : []), [cfg?.showDemo]);

  if (!cfg) return <Shell><p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Loading…</p></Shell>;
  if (!cfg.enabled) return <Shell><h1 className="font-display text-4xl">Not found</h1></Shell>;
  if (!cfg.signedIn)
    return (
      <Shell>
        <h1 className="font-display text-4xl">Nearby is for members</h1>
        <Link to="/login" className="text-gold-hi underline">Sign in</Link>
      </Shell>
    );

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-8 pb-28 text-ivory">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">OnlyMen</p>
          <h1 className="mt-1 flex items-center gap-3 font-display text-4xl font-semibold"><Radar className="size-7 text-gold" /> Nearby</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            {grid?.origin === "mine" ? "Sorted by distance from your area." : grid?.origin === "approx" ? "Showing your approximate city. Share your location for closer results." : "Share your location to see who's around."}{" "}
            {grid && <>Plan: <b className="text-ivory">{grid.plan === "plus" ? "Plus" : "Free"}</b> · up to {grid.radiusKm} km.</>}
          </p>
        </div>
        <div className="flex gap-2 text-sm font-semibold">
          {(["grid", "map"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`h-10 rounded-full border px-4 capitalize ${view === v ? "border-gold bg-gold text-ink" : "border-line text-ivory"}`}>{v}</button>
          ))}
          {cfg.isAdmin && <Link to="/admin/reports" className="grid h-10 place-items-center rounded-full border border-line px-4 text-gold-hi">Reports</Link>}
          <Link to="/" className="grid h-10 place-items-center rounded-full border border-line px-4 text-gold-hi">Home</Link>
        </div>
      </header>

      <FormError>{err}</FormError>
      {note && <p className="rounded-xl border border-gold/40 bg-surface px-4 py-3 text-sm">{note}</p>}

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

      {view === "grid" ? (
        <section className="grid gap-4">
          {grid && grid.items.length === 0 && (
            <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">No members around you yet{grid.origin ? ` within ${grid.radiusKm} km` : ""}. Only members who share their location show up here.</p>
          )}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {grid?.items.map((c) => <Tile key={c.username} c={c} onClick={() => setSel(c)} />)}
          </div>
          {demo.length > 0 && (
            <div className="grid gap-2">
              <p className="text-xs font-bold tracking-[0.2em] text-dim uppercase">Demo profiles · not real people, not near you</p>
              <div className="grid grid-cols-3 gap-2 opacity-70 sm:grid-cols-4 lg:grid-cols-6">
                {demo.map((m) => (
                  <Link key={m.handle} to="/m/$handle" params={{ handle: m.handle }} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line">
                    <img src={m.photo} alt="" className="size-full object-cover" loading="lazy" />
                    <span className="absolute top-1.5 left-1.5 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-bold text-gold uppercase">Demo</span>
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 to-transparent p-2 text-xs font-semibold">{m.name}, {m.age}<br /><span className="text-muted">{bucketLabel(bucketIndex(m.km))}</span></span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section>
          {!map ? (
            <p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Loading map…</p>
          ) : !map.center ? (
            <p className="rounded-xl border border-line bg-surface p-4 text-sm text-muted">Share your location to open the map.</p>
          ) : (
            <Suspense fallback={<p className="text-muted">Loading map…</p>}>
              <NearbyMap center={map.center} pins={map.pins} onPick={(u) => { const c = grid?.items.find((x) => x.username === u); if (c) setSel(c); }} />
              {map.pins.length === 0 && <p className="mt-2 text-sm text-muted">No one nearby has turned on a map pin yet.</p>}
            </Suspense>
          )}
        </section>
      )}

      {sel && <Sheet c={sel} onClose={() => setSel(null)} onAct={act} onReported={() => { setSel(null); setNote("Thanks. Our team will review this report."); void loadGrid(); }} />}
    </main>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center px-6 text-center text-ivory"><div className="grid gap-4">{children}</div></main>;
}

function Tile({ c, onClick }: { c: Card; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-surface text-left">
      {c.photoId ? <img src={`/api/photo/${encodeURIComponent(c.photoId)}`} alt="" className="size-full object-cover" loading="lazy" /> : <span className="grid size-full place-items-center font-display text-4xl text-gold">{c.displayName.slice(0, 1).toUpperCase()}</span>}
      {c.presence && <span className={`absolute top-2 right-2 size-2.5 rounded-full ${PRES[c.presence].dot} ring-2 ring-ink`} title={PRES[c.presence].label} />}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 to-transparent p-2 text-xs font-semibold">
        {c.displayName}{c.age != null ? `, ${c.age}` : ""} {c.verified && <ShieldCheck className="inline size-3 text-gold" />}
        <br /><span className="text-muted">{c.distance ?? "Distance hidden"}</span>
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
            <Link to="/m/$handle" params={{ handle: c.username }} className={`${btn} col-span-2 border-gold text-gold-hi`}>View profile</Link>
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
  const [open, setOpen] = useState(!settings?.sharing);
  if (!settings) return null;
  return (
    <section className="grid gap-4 rounded-2xl border border-line bg-surface/60 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          {settings.sharing ? <><MapPin className="size-4 text-online" /> Sharing your approximate area</> : <><MapPinOff className="size-4 text-dim" /> Not sharing your location</>}
          {settings.incognito && <span className="rounded-full border border-gold/60 px-2 text-xs text-gold-hi">Incognito</span>}
        </p>
        <div className="flex gap-2">
          {!settings.sharing && <button disabled={busy} onClick={onShare} className="flex h-10 items-center gap-2 rounded-full bg-gold px-5 text-sm font-bold text-ink disabled:opacity-60">{busy && <Loader2 className="size-4 animate-spin" />} Share my location</button>}
          <button onClick={() => setOpen(!open)} className="h-10 rounded-full border border-line px-4 text-sm font-semibold">Privacy {open ? "▲" : "▼"}</button>
        </div>
      </div>
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
