import { useEffect, useRef, useState } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouter, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { PrivateComingSoon } from "@/components/private-gate";
import { useAccount } from "@/lib/account/use-account";
import { privateAccessFn } from "@/lib/private/access";
import { isPublicPath } from "@/lib/private/policy";
import { AGE_GATE_PATH, hasAgeCookie, isAgeExempt } from "@/lib/age-gate/policy";
import appCss from "../styles.css?url";

const APP_NAME = "OnlyMen — Men worth staying up for";

export const Route = createRootRoute({
  // PRIVATE MODE: decided server-side on every SSR request and navigation.
  beforeLoad: async () => {
    try {
      return { access: await privateAccessFn() };
    } catch {
      return { access: { allowed: false, ownerSignup: false, invites: false } };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "OnlyMen: a private directory of verified adult creators and companions for gay men. 18+. Free to join, tips only." },
      { name: "theme-color", content: "#0a0809" },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { access } = Route.useRouteContext();
  useRecheckAccessOnAccountChange();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const gated = !access.allowed && !isPublicPath(pathname) && !(access.ownerSignup && pathname === "/join");
  // 18+ gate, client side: the server middleware covers full page loads; this
  // covers in-app navigation from an exempt page (e.g. /terms) to a gated one.
  const [ageOk, setAgeOk] = useState(true);
  useEffect(() => {
    setAgeOk(!access.ageGate || hasAgeCookie(document.cookie));
  }, [access.ageGate, pathname]);
  const ageGated = !ageOk && !isAgeExempt(pathname);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          {ageGated ? <AgeInterstitial next={pathname} /> : gated ? <PrivateComingSoon invites={access.invites} /> : <Outlet />}
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

/** Sign-in / sign-out changes the session cookie: re-run the root beforeLoad (server check). */
function useRecheckAccessOnAccountChange() {
  const router = useRouter();
  const { account, ready } = useAccount();
  const id = ready ? (account?.id ?? "") : null;
  const prev = useRef<string | null>(null);
  useEffect(() => {
    if (id === null) return;
    if (prev.current !== null && prev.current !== id) void router.invalidate();
    prev.current = id;
  }, [id, router]);
}

/** In-app navigation without a valid age token: hand over to the server's /age page (the active verifier). */
function AgeInterstitial({ next }: { next: string }) {
  useEffect(() => {
    window.location.replace(`${AGE_GATE_PATH}?next=${encodeURIComponent(next)}`);
  }, [next]);
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center" data-gate="age">
      <p className="text-sm text-muted">Adults only (18+). Checking your age…</p>
    </main>
  );
}
