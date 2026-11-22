import { createFileRoute } from "@tanstack/react-router";

/**
 * KYC vendor webhook: /api/kyc/webhook/<provider>. Inert until a vendor is
 * registered in src/lib/verification/providers.ts and selected with
 * ONLYMEN_KYC_PROVIDER. The provider authenticates the request (signature);
 * the outcome goes through the same status machine + audit log as manual review.
 */
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export const Route = createFileRoute("/api/kyc/webhook/$provider")({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        const [{ providerByName }, repo, dbm, { platformEnv }] = await Promise.all([import("@/lib/verification/providers"), import("@/lib/verification/repo.server"), import("@/lib/db"), import("@/lib/platform/runtime.ts")]);
        const name = String(params.provider ?? "");
        const p = providerByName(name);
        if (!repo.idVerificationEnabled() || !p || p.name === "manual" || p.name !== (platformEnv("ONLYMEN_KYC_PROVIDER") ?? "manual")) return json({ error: "Not found" }, 404);
        const ev = await p.handleWebhook(request).catch(() => null);
        if (!ev) return json({ error: "Bad request" }, 400);
        const db = await dbm.getSql();
        const v = (await db<{ id: string }>`select id from om_verification where provider = ${p.name} and provider_ref = ${ev.providerRef}`)[0];
        if (!v) return json({ ok: true }); // unknown session: acknowledge, do nothing
        if (ev.outcome === "pending") return json({ ok: true });
        try {
          await repo.decide(db, `provider:${p.name}`, v.id, ev.outcome === "approved" ? "approve" : "reject", ev.reason ?? "Vendor declined");
        } catch {
          /* already decided or invalid transition: acknowledge so the vendor stops retrying */
        }
        return json({ ok: true });
      },
    },
  },
});
