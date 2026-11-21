import { createFileRoute } from "@tanstack/react-router";

/** Serves profile photos stored by the server account adapter. */
export const Route = createFileRoute("/api/photo/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const id = String(params.id ?? "");
        if (!/^ph_[a-f0-9]{8,32}$/.test(id)) return new Response("Not found", { status: 404 });
        const [{ serverAccountsEnabled, getAuth }, repo] = await Promise.all([import("@/lib/account/auth.server"), import("@/lib/account/repo.server")]);
        if (!serverAccountsEnabled) return new Response("Not found", { status: 404 });
        const photo = await repo.readPhoto(id);
        if (!photo) return new Response("Not found", { status: 404 });
        if (!photo.attached) {
          // Not on a profile yet: only its owner may see it (upload preview).
          const s = await getAuth().api.getSession({ headers: request.headers });
          if (s?.user?.id !== photo.userId) return new Response("Not found", { status: 404 });
          return new Response(new Uint8Array(photo.data), { headers: { "content-type": photo.mime, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } });
        }
        return new Response(new Uint8Array(photo.data), {
          headers: { "content-type": photo.mime, "cache-control": "public, max-age=86400", "x-content-type-options": "nosniff" },
        });
      },
    },
  },
});
