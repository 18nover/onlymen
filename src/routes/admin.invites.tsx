import { useCallback, useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, Loader2, Ticket } from "lucide-react";
import { FormError, GoldButton, inputCls } from "@/components/account-ui";
import { createInvitesFn, listInvitesFn, setInviteRevokedFn } from "@/lib/invites/admin";
import type { InviteRow } from "@/lib/invites/invites.server";

export const Route = createFileRoute("/admin/invites")({
  head: () => ({ meta: [{ title: "Invite codes — OnlyMen admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminInvites,
});

const STATUS_CLS: Record<InviteRow["status"], string> = {
  active: "border-gold/60 text-gold-hi",
  used: "border-line text-dim",
  revoked: "border-ruby/60 text-ruby",
};

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");

function AdminInvites() {
  const [rows, setRows] = useState<InviteRow[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [count, setCount] = useState(1);
  const [maxUses, setMaxUses] = useState(1);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [fresh, setFresh] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | InviteRow["status"]>("all");

  const load = useCallback(async () => {
    const r = await listInvitesFn();
    if (!r.ok) return setDenied(true);
    setRows(r.value);
  }, []);
  useEffect(() => {
    void load().catch(() => setDenied(true));
  }, [load]);

  async function create(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await createInvitesFn({ data: { count, maxUses, note } });
      if (!r.ok) return setErr(r.error);
      setFresh(r.value);
      setNote("");
      await load();
    } catch {
      setErr("Couldn't create codes. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(row: InviteRow) {
    const revoked = row.status !== "revoked";
    if (revoked && !window.confirm(`Revoke code …${row.hint}? Nobody new can join with it. People who already joined keep their access.`)) return;
    const r = await setInviteRevokedFn({ data: { id: row.id, revoked } });
    if (!r.ok) return setErr(r.error);
    await load();
  }

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied((c) => (c === text ? null : c)), 1500);
    } catch {
      /* clipboard blocked: the code is still on screen */
    }
  };

  if (denied)
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div className="grid gap-4">
          <h1 className="font-display text-4xl">Not found</h1>
          <Link to="/me" className="text-gold-hi underline-offset-4 hover:underline">Back to my profile</Link>
        </div>
      </main>
    );

  const counts = { active: 0, used: 0, revoked: 0 };
  for (const r of rows ?? []) counts[r.status]++;
  const shown = (rows ?? []).filter((r) => filter === "all" || r.status === filter);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 text-ivory">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Admin</p>
          <h1 className="mt-1 flex items-center gap-3 font-display text-4xl font-semibold"><Ticket className="size-7 text-gold" /> Invite codes</h1>
          <p className="mt-2 text-sm text-muted">{counts.active} active · {counts.used} used · {counts.revoked} revoked</p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-gold-hi">
          <Link to="/admin/feedback" className="underline-offset-4 hover:underline">Feedback</Link>
          <Link to="/admin/reports" className="underline-offset-4 hover:underline">Reports</Link>
          <Link to="/me" className="underline-offset-4 hover:underline">Profile</Link>
        </nav>
      </header>

      <section className="rounded-2xl border border-line bg-surface/60 p-5">
        <h2 className="font-display text-2xl">New codes</h2>
        <form onSubmit={create} className="mt-4 grid gap-4 sm:grid-cols-[110px_110px_1fr_auto] sm:items-end">
          <label className="grid gap-1 text-sm">How many<input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))} className={`${inputCls} h-12`} /></label>
          <label className="grid gap-1 text-sm">Uses each<input type="number" min={1} max={1000} value={maxUses} onChange={(e) => setMaxUses(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))} className={`${inputCls} h-12`} /></label>
          <label className="grid gap-1 text-sm">Note (who it's for)<input value={note} maxLength={120} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Marco + friends" className={`${inputCls} h-12`} /></label>
          <GoldButton type="submit" loading={busy}>Create</GoldButton>
        </form>
        <FormError>{err}</FormError>
        {fresh.length > 0 && (
          <div className="mt-5 rounded-xl border border-gold/50 bg-oxblood/30 p-4">
            <p className="text-sm font-semibold text-gold-hi">Copy these now — they are shown only once and are not stored in readable form.</p>
            <ul className="mt-3 grid gap-2">
              {fresh.map((c) => (
                <li key={c} className="flex flex-wrap items-center gap-3 font-mono text-lg">
                  <span>{c}</span>
                  <button type="button" onClick={() => copy(c)} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 font-sans text-xs text-muted hover:border-gold/50">
                    {copied === c ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Code
                  </button>
                  <button type="button" onClick={() => copy(`${origin}/join?code=${c}`)} className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 font-sans text-xs text-muted hover:border-gold/50">
                    {copied === `${origin}/join?code=${c}` ? <Check className="size-3.5" /> : <Copy className="size-3.5" />} Invite link
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="grid gap-3">
        <div className="flex flex-wrap gap-2" role="tablist">
          {(["all", "active", "used", "revoked"] as const).map((f) => (
            <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${filter === f ? "border-gold text-gold-hi" : "border-line text-dim hover:border-gold/40"}`}>
              {f}
            </button>
          ))}
        </div>
        {rows === null ? (
          <p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Loading…</p>
        ) : shown.length === 0 ? (
          <p className="text-muted">No codes here.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-surface/80 text-xs uppercase tracking-wider text-dim">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Note</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Uses</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id} className="border-t border-line" data-invite-id={r.id}>
                    <td className="px-4 py-3 font-mono">OM-…-{r.hint}</td>
                    <td className="px-4 py-3 text-muted">{r.note ?? "—"}</td>
                    <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLS[r.status]}`}>{r.status}</span></td>
                    <td className="px-4 py-3">{r.useCount} / {r.maxUses}</td>
                    <td className="px-4 py-3 text-muted">{r.redeemedBy.length ? r.redeemedBy.map((u) => `@${u}`).join(", ") : "—"}</td>
                    <td className="px-4 py-3 text-dim">{fmt(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => toggle(r)} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:border-gold/50">
                        {r.status === "revoked" ? "Restore" : "Revoke"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
