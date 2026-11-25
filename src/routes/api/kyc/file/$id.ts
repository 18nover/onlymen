import { createFileRoute } from "@tanstack/react-router";

/**
 * Streams one ID document to an owner/admin (decrypted on the fly). The only
 * way to see a file: no public bucket, no public URL. Every view is audited.
 */
const NF = () => new Response("Not found", { status: 404, headers: { "cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow" } });

export const Route = createFileRoute("/api/kyc/file/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const id = String(params.id ?? "");
        if (!/^vf_[a-f0-9]{20}$/.test(id)) return NF();
        const [repo, priv, inv, dbm, audit] = await Promise.all([import("@/lib/verification/repo.server"), import("@/lib/private/allowlist.server"), import("@/lib/invites/invites.server"), import("@/lib/db"), import("@/lib/admin/audit.server")]);
        if (!repo.idVerificationEnabled()) return NF();
        const uid = await priv.allowedSessionUserId(request.headers);
        if (!uid) return NF();
        const db = await dbm.getSql();
        if (!(await inv.isAdminUser(db, uid))) return NF();
        const f = await dbm.withTransaction(async (tx) => {
          const file = await repo.readFile(tx, uid, id);
          if (file) await audit.writeAdminAudit(tx, uid, "verification.file.view", "verification_file", id);
          return file;
        });
        if (!f) return NF();
        return new Response(new Uint8Array(f.bytes), {
          headers: {
            "content-type": f.mime,
            "content-disposition": "inline",
            "cache-control": "private, no-store, max-age=0",
            "x-content-type-options": "nosniff",
            "x-robots-tag": "noindex, nofollow",
            "content-security-policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
            "referrer-policy": "no-referrer",
          },
        });
      },
    },
  },
});
