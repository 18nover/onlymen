/**
 * Pluggable creator KYC provider (ONLYMEN_KYC_PROVIDER, default "manual").
 *
 * "manual": the creator uploads ID + selfie at /me/verify, an owner/admin
 * reviews them at /admin/verifications. Free.
 *
 * A paid vendor is a new object in REGISTRY (or its own module) plus config:
 * ONLYMEN_KYC_PROVIDER=<name> and its API key / webhook secret via
 * `wrangler secret put`. Its webhook URL is /api/kyc/webhook/<name>. The rest of
 * the flow (status machine, audit log, 2257 record, enforcement) is shared, so
 * nothing else changes. Vendors (prices read 2026-11-22; confirm adult-content
 * acceptance with each vendor before signing up):
 *   - Veriff Self-Serve — $0.80/verification with a $49/mo minimum (Essential),
 *     $1.39 / $99 (Plus), $1.89 / $209 (Premium); 15-day trial (veriff.com/pricing).
 *   - Persona — Startup Program: 500 free ID+selfie checks/mo for 12 months,
 *     then $1 each; Essential from $250/mo (withpersona.com/startups).
 *   - Yoti — doc scan + face match; quote.
 *   - VerifyMy — adult-industry focused (creator + co-performer KYC); quote.
 */
export type ProviderStart = { kind: "form"; url: string } | { kind: "redirect"; url: string };
export type ProviderEvent = { providerRef: string; outcome: "approved" | "rejected" | "pending"; reason?: string };

export interface VerificationProvider {
  readonly name: string;
  /** Begin a verification for this creator: our own form, or a vendor-hosted session. */
  startSession(ctx: { userId: string; verificationId: string; returnUrl: string }): Promise<ProviderStart>;
  /** Parse + authenticate a vendor webhook. Null = ignore / not ours / bad signature. */
  handleWebhook(req: Request): Promise<ProviderEvent | null>;
  /** Ask the provider for the current outcome of a session (polling fallback). */
  getStatus(providerRef: string): Promise<ProviderEvent["outcome"] | null>;
}

export const manualProvider: VerificationProvider = {
  name: "manual",
  async startSession() {
    return { kind: "form", url: "/me/verify" };
  },
  async handleWebhook() {
    return null; // manual review has no webhook
  },
  async getStatus() {
    return null; // status lives in om_verification only
  },
};

/**
 * TEMPLATE for a vendor (e.g. Veriff). Not registered, so it can't be selected
 * by accident. To add one: copy, implement with the vendor's API, register.
 *
 * startSession: POST the vendor's "create session" API with the secret key,
 *   store session id as provider_ref, return { kind: "redirect", url }.
 * handleWebhook: verify the HMAC signature header with the webhook secret
 *   (timing-safe), map the decision to approved / rejected, return it.
 * getStatus: GET the session decision.
 */
export const vendorTemplate: VerificationProvider = {
  name: "vendor-template",
  async startSession() {
    throw new Error("KYC vendor not configured");
  },
  async handleWebhook() {
    return null;
  },
  async getStatus() {
    return null;
  },
};

const REGISTRY: Record<string, VerificationProvider> = { manual: manualProvider };

export function providerByName(name: string | undefined | null): VerificationProvider | null {
  return REGISTRY[String(name ?? "manual").trim().toLowerCase() || "manual"] ?? null;
}
