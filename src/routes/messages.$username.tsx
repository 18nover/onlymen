import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Footer, MobileNav } from "@/components/onlymen-ui";
import { GoldButton, inputCls } from "@/components/account-ui";
import { useAccount } from "@/lib/account/use-account";
import { sendMessageFn, threadFn } from "@/lib/chat/api";
import type { ChatMessage } from "@/lib/chat/repo.server";

export const Route = createFileRoute("/messages/$username")({
  head: ({ params }) => ({ meta: [{ title: `Message @${params.username} — OnlyMen` }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ThreadPage,
});

function ThreadPage() {
  const { username } = Route.useParams();
  const { account, ready } = useAccount();
  const nav = useNavigate();
  const [peer, setPeer] = useState<{ username: string; displayName: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !account) nav({ to: "/login", replace: true });
  }, [ready, account, nav]);

  useEffect(() => {
    if (!account) return;
    let live = true;
    const load = (afterId: string | null = null) => threadFn({ data: { username, afterId } }).then((r) => {
      if (!live) return;
      if (!r.ok) { setErr(r.error); return; }
      setPeer({ username: r.value.username, displayName: r.value.displayName });
      setMessages((prev) => afterId ? [...prev, ...r.value.messages] : r.value.messages);
    });
    void load();
    const t = setInterval(() => {
      setMessages((prev) => {
        void load(prev.at(-1)?.id ?? null);
        return prev;
      });
    }, 4000);
    return () => { live = false; clearInterval(t); };
  }, [account, username]);

  useEffect(() => { bottom.current?.scrollIntoView({ block: "end" }); }, [messages.length]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setErr(null);
    const r = await sendMessageFn({ data: { username, body: text } });
    setBusy(false);
    if (!r.ok) { setErr(r.error); return; }
    setText("");
    setMessages((prev) => [...prev, r.value]);
  }

  if (!ready || !account) {
    return <div className="grid min-h-dvh place-items-center"><Loader2 className="size-8 animate-spin text-gold" aria-label="Loading" /></div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="om-topbar">
        <Link to="/messages" className="grid size-10 place-items-center text-gold-hi" aria-label="Back to inbox"><ArrowLeft className="size-5" /></Link>
        <h1 className="min-w-0 truncate font-display text-2xl font-semibold text-ivory">{peer?.displayName ?? `@${username}`}</h1>
        {peer && <Link to="/m/$handle" params={{ handle: peer.username }} className="text-sm font-semibold text-gold-hi">Profile</Link>}
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-2 px-4 pt-[calc(76px+env(safe-area-inset-top,0px))] pb-28">
        {err && <p className="text-sm text-ruby">{err}</p>}
        <div className="flex flex-1 flex-col gap-2">
          {messages.map((m) => (
            <p key={m.id} className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.fromMe ? "ml-auto bg-gold text-ink" : "bg-surface text-ivory ring-1 ring-line"}`}>{m.body}</p>
          ))}
          <div ref={bottom} />
        </div>
        <form onSubmit={submit} className="sticky bottom-20 mt-auto flex gap-2 rounded-2xl border border-line bg-ink/80 p-2">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="Write a message…" className={`${inputCls} h-11 flex-1`} />
          <GoldButton type="submit" loading={busy} className="h-11 shrink-0 px-4" aria-label="Send"><Send className="size-4" /></GoldButton>
        </form>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
