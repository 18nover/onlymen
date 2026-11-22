import { createFileRoute } from "@tanstack/react-router";

/** Serves profile photos stored by the server account adapter. */
export const Route = createFileRoute("/api/photo/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const id = String(params.id ?? "");
        if (!/^ph_[a-f0-9]{8,32}$/.test(id)) return new Response("Not found", { status: 404 });
        const [{ serverAccountsEnabled }, repo] = await Promise.all([import("@/lib/account/auth.server"), import("@/lib/account/repo.server")]);
        if (!serverAccountsEnabled) return new Response("Not found", { status: 404 });
        // PRIVATE MODE: every photo is members-only (allowlisted session), so
        // nothing is cacheable by shared caches any more.
        const { allowedSessionUserId } = await import("@/lib/private/allowlist.server");
        const uid = await allowedSessionUserId(request.headers);
        if (!uid) return new Response("Not found", { status: 404, headers: { "cache-control": "private, no-store" } });
        const photo = await repo.readPhoto(id);
        if (!photo) return new Response("Not found", { status: 404 });
        // Not on a profile yet: only its owner may see it (upload preview).
        if (!photo.attached && uid !== photo.userId) return new Response("Not found", { status: 404 });
        return new Response(new Uint8Array(photo.data), {
          headers: { "content-type": photo.mime, "cache-control": "private, no-store", "x-content-type-options": "nosniff", "x-robots-tag": "noindex, nofollow" },
        });
      },
    },
  },
});
