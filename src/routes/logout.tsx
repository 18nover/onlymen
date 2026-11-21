import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthShell } from "@/components/account-ui";
import { accountStore } from "@/lib/account/store";

export const Route = createFileRoute("/logout")({
  head: () => ({ meta: [{ title: "Logged out — OnlyMen" }] }),
  component: Logout,
});

function Logout() {
  useEffect(() => {
    accountStore.logOut();
  }, []);
  return (
    <AuthShell kicker="Signed out" title={<>Until <span className="text-gold italic">tonight.</span></>} sub="You've been logged out on this device.">
      <div className="grid gap-3">
        <Link to="/login" className="grid h-12 place-items-center rounded-full bg-gold text-sm font-bold tracking-[0.14em] uppercase">Log back in</Link>
        <Link to="/" className="grid h-12 place-items-center rounded-full border border-line text-sm font-semibold text-muted hover:text-ivory">Back to browsing</Link>
      </div>
    </AuthShell>
  );
}
