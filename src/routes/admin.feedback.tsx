import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { adminFeedbackFn } from "@/lib/feedback/api";
import type { AdminFeedbackUser } from "@/lib/feedback/repo.server";

export const Route = createFileRoute("/admin/feedback")({
  head: () => ({ meta: [{ title: "Feedback — OnlyMen admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminFeedback,
});

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");

function AdminFeedback() {
  const [rows, setRows] = useState<AdminFeedbackUser[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [onlyMissing, setOnlyMissing] = useState(false);

  const load = useCallback(async () => {
    const r = await adminFeedbackFn();
    if (!r.ok) return setDenied(true);
    setRows(r.value);
  }, []);
  useEffect(() => {
    void load().catch(() => setDenied(true));
  }, [load]);

  if (denied)
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div className="grid gap-4">
          <h1 className="font-display text-4xl">Not found</h1>
          <Link to="/me" className="text-gold-hi underline">Back to my profile</Link>
        </div>
      </main>
    );

  if (!rows) return <main className="grid min-h-screen place-items-center text-muted">Loading…</main>;

  const missing = rows.filter((r) => r.items.length === 0).length;
  const shown = onlyMissing ? rows.filter((r) => r.items.length === 0) : rows;

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-5 py-10 text-ivory">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Admin</p>
          <h1 className="mt-1 flex items-center gap-3 font-display text-4xl font-semibold"><MessageSquare className="size-7 text-gold" /> Feedback</h1>
          <p className="mt-2 text-sm text-muted">{missing} of {rows.length} members haven't sent any yet.</p>
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-gold-hi">
          <Link to="/admin/invites" className="underline-offset-4 hover:underline">Invites</Link>
          <Link to="/admin/reports" className="underline-offset-4 hover:underline">Reports</Link>
          <Link to="/admin/verifications" className="underline-offset-4 hover:underline">Verifications</Link>
          <Link to="/me" className="underline-offset-4 hover:underline">Profile</Link>
        </nav>
      </header>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={onlyMissing} onChange={(e) => setOnlyMissing(e.target.checked)} />
        Show only people who haven't given feedback
      </label>
      <ul className="grid gap-4">
        {shown.map((u) => (
          <li key={u.userId} className="rounded-2xl border border-line bg-surface/60 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-ivory">@{u.username} <span className="font-normal text-muted">{u.displayName}</span></p>
              <p className={`text-sm ${u.items.length ? "text-gold-hi" : "text-ruby"}`}>{u.items.length ? `${u.items.length} note${u.items.length === 1 ? "" : "s"}` : "No feedback yet"}</p>
            </div>
            <p className="mt-1 text-xs text-dim">Joined {fmt(u.joinedAt)}</p>
            {u.items.length > 0 && (
              <ul className="mt-3 grid gap-2">
                {u.items.map((it) => (
                  <li key={it.id} className="rounded-xl border border-line/70 bg-ink/40 p-3 text-sm">
                    <p className="text-xs text-dim">{fmt(it.createdAt)}</p>
                    <p className="mt-1 whitespace-pre-wrap text-ivory/90">{it.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="text-sm text-muted">Nobody in this list.</p>}
    </main>
  );
}
