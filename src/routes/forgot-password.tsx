import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { AuthShell, GoldButton, TextField } from "@/components/account-ui";
import { accountStore } from "@/lib/account/store";
import { validateEmail } from "@/lib/account/validation";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset your password — OnlyMen" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [demoToken, setDemoToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = validateEmail(email);
    setErr(v);
    if (v) return;
    setBusy(true);
    // Always show the same message so the form can't be used to probe for accounts.
    const token = await accountStore.requestPasswordReset(email);
    if (accountStore.kind === "local") setDemoToken(token);
    setSent(true);
    setBusy(false);
  }

  return (
    <AuthShell kicker="Forgot password" title={<>Let's get you <span className="text-gold italic">back in.</span></>} sub="Enter the email you joined with and we'll send a reset link.">
      {sent ? (
        <div className="grid gap-5" role="status">
          <div className="flex gap-4 rounded-2xl border-gold-grad p-5">
            <MailCheck className="size-6 shrink-0 text-gold" />
            <p className="text-sm leading-relaxed text-muted">If an account exists for <span className="font-semibold text-ivory">{email}</span>, a reset link is on its way. It expires in an hour.</p>
          </div>
          {accountStore.kind === "local" && (
            <div className="rounded-2xl border border-dashed border-gold/40 bg-gold/[0.04] p-5 text-sm text-muted">
              <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Preview mode</p>
              <p className="mt-2">Email delivery isn't connected yet, so the reset link is shown here instead.</p>
              {demoToken ? (
                <Link to="/reset-password" search={{ token: demoToken }} className="mt-3 inline-flex font-semibold text-gold-hi underline underline-offset-4">Open reset link</Link>
              ) : (
                <p className="mt-2 text-dim">No account on this device uses that email.</p>
              )}
            </div>
          )}
          <Link to="/login" className="text-center text-sm font-semibold text-gold-hi underline-offset-4 hover:underline">Back to log in</Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5">
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={err} placeholder="you@example.com" />
          <GoldButton type="submit" loading={busy} className="w-full">Send reset link</GoldButton>
          <Link to="/login" className="text-center text-sm font-semibold text-muted hover:text-ivory">Back to log in</Link>
        </form>
      )}
    </AuthShell>
  );
}
