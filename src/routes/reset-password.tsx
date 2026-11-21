import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell, FormError, GoldButton, PasswordField } from "@/components/account-ui";
import { accountStore, AccountError } from "@/lib/account/store";
import { validatePassword } from "@/lib/account/validation";

export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>): { token?: string } => ({ token: typeof s.token === "string" ? s.token : undefined }),
  head: () => ({ meta: [{ title: "Choose a new password — OnlyMen" }] }),
  component: Reset,
});

function Reset() {
  const { token } = Route.useSearch();
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = validatePassword(pw) ?? (pw !== pw2 ? "Passwords don't match." : null);
    setErr(v);
    if (v) return;
    setBusy(true);
    try {
      await accountStore.resetPassword(token ?? "", pw);
      nav({ to: "/me" });
    } catch (e) {
      if (e instanceof AccountError && e.message.startsWith("Password updated")) return nav({ to: "/login" });
      setErr(e instanceof AccountError ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell kicker="New password" title={<>Fresh <span className="text-gold italic">start.</span></>}>
      {!token ? (
        <p className="text-sm text-muted">
          This link is missing its token. <Link to="/forgot-password" className="font-semibold text-gold-hi underline">Request a new one</Link>.
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5">
          <FormError>{err}</FormError>
          <PasswordField label="New password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} hint="8+ characters with letters and a number." />
          <PasswordField label="Confirm new password" autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          <GoldButton type="submit" loading={busy} className="w-full">Save & log in</GoldButton>
        </form>
      )}
    </AuthShell>
  );
}
