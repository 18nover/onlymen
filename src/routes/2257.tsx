import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONSENT_VERSIONS } from "@/lib/account/constants";

export const Route = createFileRoute("/2257")({
  head: () => ({ meta: [{ title: "18 U.S.C. § 2257 Statement (draft) — OnlyMen" }] }),
  component: () => (
    <LegalPage
      title="18 U.S.C. § 2257 Compliance Statement"
      version={CONSENT_VERSIONS.creator2257}
      intro={<p>All persons who appear in any visual depiction of actual or simulated sexually explicit conduct on OnlyMen were at least 18 years of age at the time the depiction was created.</p>}
      sections={[
        { h: "Creator obligations", body: <p>Creators who upload content are the producers of that content and must create and maintain the records required by 18 U.S.C. § 2257 and 28 C.F.R. Part 75 for every performer, including a legible copy of a valid government-issued photo ID and a signed release.</p> },
        { h: "Platform verification", body: <p>Before a creator can publish, OnlyMen verifies the creator's identity and age with government ID and a live selfie. Co-performers must be verified too. [Co-performer flow TBD.]</p> },
        { h: "Custodian of records", body: <p>[Name, title and business address of the custodian of records — TBD by counsel. Must be a physical address, not a P.O. box.]</p> },
        { h: "Exemptions", body: <p>[Any applicable exemption language — TBD by counsel.]</p> },
      ]}
    />
  ),
});
