import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, FormError, GoldButton, PasswordField, SocialButtons, TextField } from "@/components/account-ui";
import { accountStore, AccountError } from "@/lib/account/store";
import { useAccount } from "@/lib/account/use-account";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — OnlyMen" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { account, ready } = useAccount();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [invite, setInvite] = useState<string | null>(null);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("om-invite") ?? decodeURIComponent(/(?:^|; )om_invite=([^;]*)/.exec(document.cookie)?.[1] ?? "");
      setInvite(stored || null);
    } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    if (ready && account) nav({ to: account.onboarding.finishedAt ? "/me" : "/onboarding", replace: true });
  }, [ready, account, nav]);

  // Installed app opened before signing up: go straight back to the saved invite (the install itself drops the link).
  useEffect(() => {
    if (!invite || !ready || account) return;
    const pwa = window.matchMedia("(display-mode: standalone)").matches || new URLSearchParams(location.search).get("source") === "pwa";
    if (pwa) nav({ to: "/join/$code", params: { code: invite }, replace: true });
  }, [invite, ready, account, nav]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!id.trim() || !pw) return setErr("Enter your email or username and password.");
    setBusy(true);
    setErr(null);
    try {
      const acc = await accountStore.logIn(id, pw);
      try { window.localStorage.removeItem("om-invite"); } catch { /* ignore */ }
      // Full navigation so the server re-checks private-mode access with the
      // new session cookie (the root guard's state is decided server-side).
      window.location.assign(acc.onboarding.finishedAt ? "/me" : "/onboarding");
      return;
    } catch (e) {
      setErr(e instanceof AccountError ? e.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell kicker="Welcome back" title={<>The night's <span className="text-gold italic">still young.</span></>} photos={["/models/m03.webp", "/models/m09.webp", "/models/m12.webp"]}>
      <SocialButtons />
      <form onSubmit={submit} noValidate className="grid gap-5">
        <FormError>{err}</FormError>
        <TextField label="Email or username" autoComplete="username" autoCapitalize="none" spellCheck={false} value={id} onChange={(e) => setId(e.target.value)} placeholder="you@example.com" />
        <div className="grid gap-2">
          <PasswordField label="Password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <Link to="/forgot-password" className="justify-self-end text-xs font-semibold text-gold-hi underline-offset-4 hover:underline">Forgot password?</Link>
        </div>
        <GoldButton type="submit" loading={busy} className="w-full">Log in</GoldButton>
        {invite ? (
          <a href={`/join/${encodeURIComponent(invite)}`} className="text-center text-sm font-semibold text-gold-hi underline underline-offset-4">New here? Continue with your invite</a>
        ) : (
          <p className="text-center text-sm text-muted">OnlyMen is invite-only. New? Open the personal link you were sent.</p>
        )}
      </form>
    </AuthShell>
  );
}
