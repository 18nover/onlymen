import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, MessageSquare } from "lucide-react";
import { Footer, Header, MobileNav } from "@/components/onlymen-ui";
import { FormError, GoldButton, inputCls } from "@/components/account-ui";
import { useCity } from "@/lib/onlymen-hooks";
import { useAccount } from "@/lib/account/use-account";
import { BETA_TERMS } from "@/lib/beta";
import { myFeedbackFn, sendFeedbackFn, type FResult } from "@/lib/feedback/api";
import type { FeedbackItem } from "@/lib/feedback/repo.server";

export const Route = createFileRoute("/me_/feedback")({
  head: () => ({ meta: [{ title: "Feedback — OnlyMen" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const { account, ready } = useAccount();
  const [city, setCity] = useCity();
  const nav = useNavigate();
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [body, setBody] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && !account) nav({ to: "/login", replace: true });
  }, [ready, account, nav]);

  useEffect(() => {
    if (!account) return;
    void myFeedbackFn().then((r: FResult<FeedbackItem[]>) => r.ok && setItems(r.value));
  }, [account]);

  if (!ready || !account) {
    return <div className="grid min-h-dvh place-items-center"><Loader2 className="size-8 animate-spin text-gold" aria-label="Loading" /></div>;
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setNote(null);
    try {
      const r = await sendFeedbackFn({ data: { body } });
      if (!r.ok) return setErr(r.error);
      setItems((cur) => [r.value, ...cur]);
      setBody("");
      setNote("Thanks — that helps us grow the app.");
    } catch {
      setErr("Couldn't save that. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header city={city} onCity={(c) => { setCity(c); void nav({ to: "/nearby" }); }} />
      <main className="om-container grid max-w-2xl gap-6 pt-6 pb-28">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Beta</p>
          <h1 className="mt-1 flex items-center gap-3 font-display text-5xl font-semibold text-ivory"><MessageSquare className="size-8 text-gold" /> Feedback</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{BETA_TERMS}</p>
        </div>
        <form onSubmit={send} className="grid gap-3 rounded-2xl border border-line/80 bg-night/70 p-5">
          <FormError>{err}</FormError>
          {note && <p className="text-sm text-gold-hi">{note}</p>}
          <label className="grid gap-1 text-sm">
            What's working, what's broken, or what you want next
            <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} rows={5} required className={`${inputCls} min-h-32 py-3`} placeholder="A few honest sentences are enough." />
          </label>
          <GoldButton type="submit" loading={busy} className="w-fit">Send feedback</GoldButton>
        </form>
        {items.length > 0 && (
          <section className="grid gap-3">
            <h2 className="font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase">You've sent</h2>
            <ul className="grid gap-3">
              {items.map((it) => (
                <li key={it.id} className="rounded-xl border border-line bg-surface/60 p-4 text-sm">
                  <p className="text-xs text-dim">{new Date(it.createdAt).toLocaleString()}</p>
                  <p className="mt-1 whitespace-pre-wrap text-ivory/90">{it.body}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex flex-wrap gap-2">
          <Link to="/me/settings" className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-ivory">Settings</Link>
          <Link to="/me" className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-ivory">Back to profile</Link>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
