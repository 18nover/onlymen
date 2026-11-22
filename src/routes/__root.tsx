import { useEffect, useRef } from "react";
import { createRootRoute, HeadContent, Outlet, Scripts, useRouter, useRouterState } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { PrivateComingSoon } from "@/components/private-gate";
import { useAccount } from "@/lib/account/use-account";
import { privateAccessFn } from "@/lib/private/access";
import { isPublicPath } from "@/lib/private/policy";
import appCss from "../styles.css?url";

const APP_NAME = "OnlyMen — Men worth staying up for";

export const Route = createRootRoute({
  // PRIVATE MODE: decided server-side on every SSR request and navigation.
  beforeLoad: async () => {
    try {
      return { access: await privateAccessFn() };
    } catch {
      return { access: { allowed: false, ownerSignup: false } };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "description", content: "OnlyMen: a private community of verified adult creators for gay men. 18+. Private for now. Tips optional." },
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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          {gated ? <PrivateComingSoon /> : <Outlet />}
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
