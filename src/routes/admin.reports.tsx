import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Crown, Flag, X } from "lucide-react";
import { FormError, inputCls } from "@/components/account-ui";
import { adminDecideReportFn, adminReportLogFn, adminReportsFn, adminSetPlusFn } from "@/lib/nearby/api";
import type { ReportRow } from "@/lib/nearby/repo.server";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — OnlyMen admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminReports,
});

type Filter = "open" | "resolved" | "dismissed" | "all";
const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");
const URGENT = new Set(["underage", "non_consensual", "selling_sex"]);
const LABEL: Record<string, string> = { underage: "May be under 18", selling_sex: "Selling sex / escorting", non_consensual: "Non-consensual", scam: "Scam", harassment: "Harassment", impersonation: "Impersonation", spam: "Spam", other: "Other" };

function AdminReports() {
  const [filter, setFilter] = useState<Filter>("open");
  const [rows, setRows] = useState<ReportRow[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [log, setLog] = useState<{ id: string; items: { at: string; actor: string; action: string; note: string | null }[] } | null>(null);
  const [plusUser, setPlusUser] = useState("");
  const [plusMsg, setPlusMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await adminReportsFn({ data: { status: filter } });
    if (!r.ok) return setDenied(true);
    setRows(r.value);
  }, [filter]);
  useEffect(() => {
    void load().catch(() => setDenied(true));
  }, [load]);

  if (denied)
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center text-ivory">
        <div className="grid gap-4">
          <h1 className="font-display text-4xl">Not found</h1>
          <Link to="/me" className="text-gold-hi underline-offset-4 hover:underline">Back to my profile</Link>
        </div>
      </main>
    );

  const decide = async (id: string, decision: "resolved" | "dismissed") => {
    setErr(null);
    const r = await adminDecideReportFn({ data: { id, decision, note: notes[id] ?? "" } });
    if (!r.ok) return setErr(r.error);
    void load();
  };

  const plus = async (on: boolean) => {
    setPlusMsg(null);
    const r = await adminSetPlusFn({ data: { username: plusUser.trim(), on } });
    setPlusMsg(r.ok ? `${on ? "Granted" : "Removed"} Plus for @${plusUser.trim().replace(/^@/, "")}.` : r.error);
  };

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-5 py-10 text-ivory">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Admin</p>
          <h1 className="mt-1 flex items-center gap-3 font-display text-4xl font-semibold"><Flag className="size-7 text-gold" /> Reports</h1>
          <p className="mt-2 text-sm text-muted">Member reports from Nearby. Under-18, non-consensual and selling-sex reports sort first. Every view and decision is logged.</p>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          <Link to="/admin/verifications" className="text-gold-hi underline-offset-4 hover:underline">Verifications</Link>
          <Link to="/admin/invites" className="text-gold-hi underline-offset-4 hover:underline">Invites</Link>
          <Link to="/nearby" className="text-gold-hi underline-offset-4 hover:underline">Nearby</Link>
        </div>
      </header>

      <section className="grid gap-3 rounded-2xl border border-line bg-surface/60 p-5">
        <h2 className="flex items-center gap-2 font-semibold"><Crown className="size-4 text-gold" /> Plus (admin-set, no billing)</h2>
        <p className="text-sm text-muted">Plus widens Nearby (bigger radius and grid). There is no payment; only admins can grant it.</p>
        <div className="flex flex-wrap gap-2">
          <input value={plusUser} onChange={(e) => setPlusUser(e.target.value)} placeholder="username" className={`${inputCls} h-10 max-w-xs`} />
          <button onClick={() => plus(true)} className="h-10 rounded-full bg-gold px-4 text-sm font-bold text-ink">Grant Plus</button>
          <button onClick={() => plus(false)} className="h-10 rounded-full border border-line px-4 text-sm font-semibold">Remove Plus</button>
        </div>
        {plusMsg && <p className="text-sm">{plusMsg}</p>}
      </section>

      <div className="flex flex-wrap gap-2">
        {(["open", "resolved", "dismissed", "all"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`h-9 rounded-full border px-4 text-sm font-semibold capitalize ${filter === f ? "border-gold bg-gold text-ink" : "border-line"}`}>{f}</button>
        ))}
      </div>
      <FormError>{err}</FormError>

      {!rows ? <p className="text-muted">Loading…</p> : rows.length === 0 ? <p className="text-muted">No {filter === "all" ? "" : filter} reports.</p> : (
        <ul className="grid gap-3">
          {rows.map((r) => (
            <li key={r.id} className={`grid gap-3 rounded-2xl border p-4 ${URGENT.has(r.reason) && r.status === "open" ? "border-ruby/70 bg-oxblood/20" : "border-line bg-surface/60"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="grid gap-1 text-sm">
                  <p className="font-semibold"><span className={URGENT.has(r.reason) ? "text-ruby" : "text-gold-hi"}>{LABEL[r.reason] ?? r.reason}</span> · <Link to="/m/$handle" params={{ handle: r.target }} className="underline">@{r.target}</Link>{r.targetOpenReports > 1 && <span className="text-ruby"> · {r.targetOpenReports} open reports</span>}</p>
                  <p className="text-muted">Reported by @{r.reporter} · {fmt(r.createdAt)} · <span className="capitalize">{r.status}</span>{r.decidedAt ? ` ${fmt(r.decidedAt)}` : ""}</p>
                  {r.details && <p className="whitespace-pre-wrap text-ivory">{r.details}</p>}
                  {r.resolution && <p className="text-muted">Note: {r.resolution}</p>}
                </div>
                <button onClick={async () => { const l = await adminReportLogFn({ data: { id: r.id } }); if (l.ok) setLog({ id: r.id, items: l.value }); }} className="text-xs font-semibold text-gold-hi underline">Audit log</button>
              </div>
              {log?.id === r.id && (
                <ul className="grid gap-1 rounded-xl border border-line p-3 text-xs text-muted">
                  {log.items.map((i, n) => <li key={n}>{fmt(i.at)} · {i.actor} · {i.action}{i.note ? ` · ${i.note}` : ""}</li>)}
                </ul>
              )}
              {r.status === "open" && (
                <div className="flex flex-wrap gap-2">
                  <input value={notes[r.id] ?? ""} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} placeholder="Note (what you did)" className={`${inputCls} h-10 min-w-56 flex-1`} />
                  <button onClick={() => decide(r.id, "resolved")} className="flex h-10 items-center gap-1 rounded-full bg-gold px-4 text-sm font-bold text-ink"><Check className="size-4" /> Resolve</button>
                  <button onClick={() => decide(r.id, "dismissed")} className="flex h-10 items-center gap-1 rounded-full border border-line px-4 text-sm font-semibold"><X className="size-4" /> Dismiss</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
