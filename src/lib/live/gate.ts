import type { PublicAccount } from "../account/types.ts";

export type GoLiveCheck = { ok: boolean; missing: { key: "creator" | "verification" | "rules"; label: string; step?: "verify" | "live" }[] };

function latestGranted(a: Pick<PublicAccount, "consents">, key: string) {
  let v = false;
  for (const c of a.consents) if (c.key === key) v = c.granted;
  return v;
}

/** A creator may go live once ID verification is submitted and live rules + co-performer policy are accepted. */
export function canGoLive(a: Pick<PublicAccount, "type" | "creator" | "consents">): GoLiveCheck {
  const missing: GoLiveCheck["missing"] = [];
  if (a.type !== "creator") missing.push({ key: "creator", label: "Creator account" });
  const st = a.creator?.status;
  if (st !== "pending_review" && st !== "approved") missing.push({ key: "verification", label: "Submit ID verification", step: "verify" });
  if (!latestGranted(a, "liveRules") || !latestGranted(a, "liveCoPerformers")) missing.push({ key: "rules", label: "Accept the Live Stream Rules", step: "live" });
  return { ok: missing.length === 0, missing };
}
