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

  useEffect(() => {
    if (ready && account) nav({ to: account.onboarding.finishedAt ? "/me" : "/onboarding", replace: true });
  }, [ready, account, nav]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!id.trim() || !pw) return setErr("Enter your email or username and password.");
    setBusy(true);
    setErr(null);
    try {
      const acc = await accountStore.logIn(id, pw);
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
        <p className="text-center text-sm text-muted">OnlyMen is private for now. Sign-ups are closed.</p>
      </form>
    </AuthShell>
  );
}
