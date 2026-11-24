import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Ban, Flag, Loader2, X } from "lucide-react";
import { FormError, inputCls } from "@/components/account-ui";
import { nearbyActionFn, profileModerationStateFn } from "@/lib/nearby/api";
import { REPORT_REASON_OPTIONS } from "@/lib/nearby/reasons";

const btn = "flex h-10 items-center justify-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ivory transition hover:border-gold/60";

export function ProfileModeration({ username, displayName }: { username: string; displayName: string }) {
  const [state, setState] = useState<Awaited<ReturnType<typeof profileModerationStateFn>> | null>(null);
  const [reporting, setReporting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void profileModerationStateFn({ data: { username } }).then(setState);
  }, [username]);

  if (!state || state.isSelf) return null;

  const act = async (action: "block" | "unblock") => {
    setError(null);
    setNotice(null);
    setBusy(true);
    const r = await nearbyActionFn({ data: { action, username } });
    setBusy(false);
    if (!r.ok) return setError(r.error);
    setState({ ...state, blocked: action === "block" });
    setNotice(action === "block" ? `${displayName} is blocked. Neither of you will see the other.` : `${displayName} is no longer blocked.`);
  };

  if (!state.signedIn)
    return <p className="px-1 text-xs text-dim"><Link to="/login" className="font-semibold text-gold-hi underline">Sign in</Link> to report or block this profile.</p>;

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => {
          if (state.blocked || window.confirm(`Block ${displayName}? Neither of you will see the other.`)) void act(state.blocked ? "unblock" : "block");
        }} className={btn}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Ban className="size-4 text-ruby" />} {state.blocked ? "Unblock" : "Block"}
        </button>
        <button type="button" onClick={() => { setError(null); setNotice(null); setReporting(true); }} className={btn}>
          <Flag className="size-4 text-ruby" /> Report
        </button>
      </div>
      {error && <FormError>{error}</FormError>}
      {notice && <p role="status" className="px-1 text-xs text-online">{notice}</p>}
      {reporting && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-ink/70 sm:place-items-center" onClick={() => setReporting(false)}>
          <div className="grid max-h-[85dvh] w-full max-w-md gap-3 overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl">Report {displayName}</h2>
                <p className="text-sm text-muted">Reports go to the OnlyMen moderation queue.</p>
              </div>
              <button type="button" onClick={() => setReporting(false)} aria-label="Close" className="text-muted"><X className="size-5" /></button>
            </div>
            <form className="grid gap-3" onSubmit={async (e) => {
              e.preventDefault();
              if (!reason) return setError("Pick a reason.");
              setBusy(true);
              setError(null);
              const r = await nearbyActionFn({ data: { action: "report", username, reason, details, alsoBlock } });
              setBusy(false);
              if (!r.ok) return setError(r.error);
              setState({ ...state, blocked: state.blocked || alsoBlock });
              setReporting(false);
              setReason("");
              setDetails("");
              setNotice("Thanks. Our team will review this report.");
            }}>
              <FormError>{error}</FormError>
              <div className="grid gap-1.5">
                {REPORT_REASON_OPTIONS.map((r) => (
                  <label key={r.id} className="flex items-center gap-2 text-sm"><input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} /> {r.label}</label>
                ))}
              </div>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={1000} placeholder="Anything else we should know (optional)" className={`${inputCls} min-h-20 py-2`} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={alsoBlock} onChange={(e) => setAlsoBlock(e.target.checked)} /> Also block {displayName}</label>
              <div className="flex gap-2">
                <button type="button" disabled={busy} onClick={() => setReporting(false)} className={btn}>Back</button>
                <button disabled={busy} className={`${btn} flex-1 border-ruby bg-oxblood/50`}>{busy && <Loader2 className="size-4 animate-spin" />} Send report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
