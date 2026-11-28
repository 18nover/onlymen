import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, MessageCircle } from "lucide-react";
import { Footer, Header, MobileNav } from "@/components/onlymen-ui";
import { useCity } from "@/lib/onlymen-hooks";
import { useAccount } from "@/lib/account/use-account";
import { inboxFn } from "@/lib/chat/api";
import type { InboxRow } from "@/lib/chat/repo.server";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — OnlyMen" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: InboxPage,
});

function InboxPage() {
  const { account, ready } = useAccount();
  const [city, setCity] = useCity();
  const nav = useNavigate();
  const [rows, setRows] = useState<InboxRow[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (ready && !account) nav({ to: "/login", replace: true });
  }, [ready, account, nav]);
  useEffect(() => {
    if (!account) return;
    let live = true;
    const load = () => inboxFn().then((r) => {
      if (!live) return;
      if (r.ok) setRows(r.value);
      else setErr(r.error);
    });
    void load();
    const t = setInterval(() => void load(), 4000);
    return () => { live = false; clearInterval(t); };
  }, [account]);
  if (!ready || !account) {
    return <div className="grid min-h-dvh place-items-center"><Loader2 className="size-8 animate-spin text-gold" aria-label="Loading" /></div>;
  }
  return (
    <div className="min-h-screen">
      <Header city={city} onCity={(c) => { setCity(c); void nav({ to: "/nearby" }); }} />
      <main className="om-container pt-6 pb-28">
        <p className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Inbox</p>
        <h1 className="mt-1 font-display text-5xl font-semibold text-ivory">Messages</h1>
        {err && <p className="mt-4 text-sm text-ruby">{err}</p>}
        {rows && rows.length === 0 && (
          <p className="mt-8 max-w-md text-sm text-muted">No messages yet. Open a profile and tap Message to start a conversation.</p>
        )}
        <ul className="mt-6 grid gap-2">
          {rows?.map((r) => (
            <li key={r.username}>
              <Link to="/messages/$username" params={{ username: r.username }} className="flex items-center gap-3 rounded-2xl border border-line bg-surface/70 px-4 py-3 hover:border-gold/50">
                <MessageCircle className="size-5 shrink-0 text-gold" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ivory">{r.displayName}</span>
                  <span className="block truncate text-sm text-muted">{r.last.fromMe ? "You: " : ""}{r.last.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
