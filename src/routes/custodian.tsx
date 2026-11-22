import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONSENT_VERSIONS } from "@/lib/account/constants";

/**
 * 18 U.S.C. § 2257 custodian-of-records notice. PLACEHOLDER: every bracketed
 * field must be filled in by Jerry with counsel. Do not invent an address.
 */
export const Route = createFileRoute("/custodian")({
  head: () => ({ meta: [{ title: "Custodian of Records (draft) — OnlyMen" }] }),
  component: () => (
    <LegalPage
      title="Custodian of Records"
      version={CONSENT_VERSIONS.creator2257}
      intro={<p>Records required by 18 U.S.C. § 2257 and 28 C.F.R. Part 75 for content on OnlyMen are kept by the custodian of records named below.</p>}
      sections={[
        { h: "Custodian", body: <p><b>TODO (Jerry + counsel):</b> [Custodian's full name and title]</p> },
        { h: "Business address", body: <p><b>TODO (Jerry + counsel):</b> [Street address where records are kept and available for inspection. Must be a physical address, not a P.O. box.]</p> },
        { h: "Producer", body: <p><b>TODO:</b> [Legal name of the producer / operating company, e.g. the 18nover LLC once formed]</p> },
        { h: "Hours", body: <p><b>TODO:</b> [Hours the records are available for inspection (at least 20 hours per week under 28 C.F.R. § 75.5)]</p> },
        { h: "Records kept", body: <p>For each creator: legal name, date of birth, any other names used, a copy of the government photo ID, and the date the record was made. Kept privately and encrypted; never shown publicly.</p> },
      ]}
    />
  ),
});
