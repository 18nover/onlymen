import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Check, FileText, Loader2, ShieldCheck, X } from "lucide-react";
import { FormError, inputCls } from "@/components/account-ui";
import { adminDecideVerificationFn, adminVerificationFn, adminVerificationsFn } from "@/lib/verification/api";
import type { AdminDetail, QueueRow } from "@/lib/verification/repo.server";
import { FILE_KIND_LABEL, ID_TYPE_LABEL, type IdType, type VStatus } from "@/lib/verification/status";

export const Route = createFileRoute("/admin/verifications")({
  head: () => ({ meta: [{ title: "ID verifications — OnlyMen admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminVerifications,
});

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "—");
const STATUS_CLS: Record<VStatus, string> = { pending: "border-gold/60 text-gold-hi", approved: "border-online/60 text-online", rejected: "border-ruby/60 text-ruby", not_started: "border-line text-dim" };
type Filter = VStatus | "all";

function AdminVerifications() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [rows, setRows] = useState<QueueRow[] | null>(null);
  const [meta, setMeta] = useState<{ ageVerifier: { name: string; devOnly: boolean }; selfReview: boolean } | null>(null);
  const [denied, setDenied] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await adminVerificationsFn({ data: { status: filter } });
    if (!r.ok) return setDenied(true);
    setRows(r.value.rows);
    setMeta({ ageVerifier: r.value.ageVerifier, selfReview: r.value.selfReview });
  }, [filter]);
  useEffect(() => {
    void load().catch(() => setDenied(true));
  }, [load]);

  if (denied)
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div className="grid gap-4">
          <h1 className="font-display text-4xl">Not found</h1>
          <Link to="/me" className="text-gold-hi underline-offset-4 hover:underline">Back to my profile</Link>
        </div>
      </main>
    );

  return (
    <main className="mx-auto grid max-w-5xl gap-6 px-5 py-10 text-ivory">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Admin</p>
          <h1 className="mt-1 flex items-center gap-3 font-display text-4xl font-semibold"><ShieldCheck className="size-7 text-gold" /> ID verifications</h1>
          <p className="mt-2 text-sm text-muted">Creator ID + 2257 review. Every view and decision is logged. <Link to="/custodian" className="text-gold-hi underline">Custodian of records</Link></p>
        </div>
        <div className="flex gap-4 text-sm font-semibold">
          <Link to="/admin/invites" className="text-gold-hi underline-offset-4 hover:underline">Invites</Link>
          <Link to="/admin/feedback" className="text-gold-hi underline-offset-4 hover:underline">Feedback</Link>
          <Link to="/me" className="text-gold-hi underline-offset-4 hover:underline">My profile</Link>
        </div>
      </header>

      {meta?.ageVerifier.devOnly && (
        <div className="flex items-start gap-3 rounded-xl border border-ruby/60 bg-oxblood/40 p-4 text-sm" role="alert">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gold-hi" />
          <p>
            <b>Visitor age gate is in TEST MODE ({meta.ageVerifier.name}).</b> A click-through "I am 18" button is not age verification under Kentucky law (KRS 436.001) or the ~26 similar state laws. A real age-verification vendor (or the geoblock) is needed before OnlyMen opens to the public. See docs/AGE_GATE.md.
          </p>
        </div>
      )}
      {meta && !meta.selfReview && <p className="text-xs text-dim">You can't approve your own verification (ONLYMEN_KYC_SELF_REVIEW is off).</p>}

      <div className="flex flex-wrap gap-2" role="tablist">
        {(["pending", "approved", "rejected", "not_started", "all"] as const).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => { setRows(null); setFilter(f); }} className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wider uppercase ${filter === f ? "border-gold text-gold-hi" : "border-line text-dim hover:border-gold/40"}`}>
            {f === "not_started" ? "drafts" : f}
          </button>
        ))}
      </div>

      {rows === null ? (
        <p className="flex items-center gap-2 text-muted"><Loader2 className="size-4 animate-spin" /> Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-muted">Nothing here.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface/80 text-xs tracking-wider text-dim uppercase">
              <tr><th className="px-4 py-3">Creator</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">ID type</th><th className="px-4 py-3">Files</th><th className="px-4 py-3">Submitted</th><th className="px-4 py-3" /></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-line" data-verification-id={r.id}>
                  <td className="px-4 py-3">@{r.username}</td>
                  <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLS[r.status]}`}>{r.status.replace("_", " ")}</span></td>
                  <td className="px-4 py-3 text-muted">{r.idType ? ID_TYPE_LABEL[r.idType as IdType] ?? r.idType : "—"}</td>
                  <td className="px-4 py-3 text-muted">{r.files}</td>
                  <td className="px-4 py-3 text-dim">{fmt(r.submittedAt)}</td>
                  <td className="px-4 py-3 text-right"><button type="button" onClick={() => setOpen(r.id)} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:border-gold/50">Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && <Detail id={open} onClose={() => setOpen(null)} onChanged={() => void load()} />}
    </main>
  );
}

function Detail({ id, onClose, onChanged }: { id: string; onClose: () => void; onChanged: () => void }) {
  const [d, setD] = useState<AdminDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const r = await adminVerificationFn({ data: { id } });
    if (!r.ok) return setErr(r.error);
    setD(r.value);
  }, [id]);
  useEffect(() => {
    void load();
  }, [load]);

  async function act(action: "approve" | "reject" | "revoke") {
    if (action !== "approve" && !reason.trim()) return setErr("Give a reason (the creator sees it).");
    if (action === "approve" && !window.confirm("Approve? Check that the name and date of birth match the ID and the selfie shows the same person holding it.")) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await adminDecideVerificationFn({ data: { id, action, reason } });
      if (!r.ok) return setErr(r.error);
      setReason("");
      await load();
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink/85 p-3 backdrop-blur-md" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="mx-auto my-6 grid max-w-4xl gap-5 rounded-2xl border border-gold/40 bg-night p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-3xl">{d ? `@${d.username}` : "Loading…"}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full border border-line"><X className="size-4" /></button>
        </div>
        {d && (
          <>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <div><dt className="text-dim">Status</dt><dd><span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLS[d.status]}`}>{d.status.replace("_", " ")}</span></dd></div>
              <div><dt className="text-dim">Legal name</dt><dd>{d.legalName ?? "—"}</dd></div>
              <div><dt className="text-dim">Date of birth</dt><dd>{d.dob ?? "—"}</dd></div>
              <div><dt className="text-dim">ID type</dt><dd>{d.idType ? ID_TYPE_LABEL[d.idType as IdType] ?? d.idType : "—"}</dd></div>
              <div><dt className="text-dim">Country</dt><dd>{d.idCountry ?? "—"}</dd></div>
              <div><dt className="text-dim">Provider</dt><dd>{d.provider}</dd></div>
              <div><dt className="text-dim">Submitted</dt><dd>{fmt(d.submittedAt)}</dd></div>
              <div><dt className="text-dim">Reviewed</dt><dd>{fmt(d.reviewedAt)}</dd></div>
              {d.rejectReason && <div className="col-span-full"><dt className="text-dim">Reason</dt><dd>{d.rejectReason}</dd></div>}
            </dl>
            <div className="grid gap-3 sm:grid-cols-3">
              {d.files.map((f) => (
                <figure key={f.id} className="grid gap-2 rounded-xl border border-line p-2">
                  <figcaption className="text-xs font-semibold text-muted">{FILE_KIND_LABEL[f.kind]} · {Math.round(f.size / 1024)} KB</figcaption>
                  {f.contentType.startsWith("image/") && f.contentType !== "image/heic" ? (
                    <a href={`/api/kyc/file/${f.id}`} target="_blank" rel="noreferrer"><img src={`/api/kyc/file/${f.id}`} alt={FILE_KIND_LABEL[f.kind]} className="max-h-72 w-full rounded-lg object-contain" referrerPolicy="no-referrer" /></a>
                  ) : (
                    <a href={`/api/kyc/file/${f.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gold-hi underline"><FileText className="size-4" /> Open {f.contentType === "application/pdf" ? "PDF" : "HEIC"}</a>
                  )}
                  <span className="truncate font-mono text-[10px] text-dim" title={f.sha256}>sha256 {f.sha256.slice(0, 16)}…</span>
                </figure>
              ))}
              {d.files.length === 0 && <p className="text-sm text-muted">No files uploaded.</p>}
            </div>
            {(d.status === "pending" || d.status === "approved") && (
              <div className="grid gap-3 rounded-xl border border-line p-4">
                <label className="grid gap-1 text-sm">Reason (required to reject or revoke; shown to the creator, no personal data)
                  <input value={reason} maxLength={200} onChange={(e) => setReason(e.target.value)} className={`${inputCls} h-11`} placeholder="e.g. Photo is blurry, ID expired" />
                </label>
                <div className="flex flex-wrap gap-2">
                  {d.status === "pending" && (
                    <>
                      <button type="button" disabled={busy} onClick={() => act("approve")} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-gold px-5 text-sm font-bold uppercase"><Check className="size-4" /> Approve</button>
                      <button type="button" disabled={busy} onClick={() => act("reject")} className="inline-flex h-11 items-center gap-1.5 rounded-full border border-ruby/60 px-5 text-sm font-bold text-ruby uppercase"><X className="size-4" /> Reject</button>
                    </>
                  )}
                  {d.status === "approved" && <button type="button" disabled={busy} onClick={() => act("revoke")} className="inline-flex h-11 items-center rounded-full border border-ruby/60 px-5 text-sm font-bold text-ruby uppercase">Revoke</button>}
                </div>
              </div>
            )}
            <FormError>{err}</FormError>
            <details className="text-sm">
              <summary className="cursor-pointer text-muted">Audit log ({d.audit.length})</summary>
              <ul className="mt-2 grid gap-1 text-xs text-dim">
                {d.audit.map((a, i) => <li key={i}>{fmt(a.at)} · {a.actor} · {a.action}{a.note ? ` · ${a.note}` : ""}</li>)}
              </ul>
            </details>
          </>
        )}
        {!d && err && <FormError>{err}</FormError>}
      </div>
    </div>
  );
}
