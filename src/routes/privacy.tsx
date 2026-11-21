import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONSENT_VERSIONS } from "@/lib/account/constants";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy (draft) — OnlyMen" }] }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      version={CONSENT_VERSIONS.privacy}
      intro={<p>We know discretion matters here. This policy explains what we collect, why, and the choices you have.</p>}
      sections={[
        { h: "What we collect", body: <ul className="list-disc space-y-1 pl-5"><li>Account: email, username, password (stored hashed), date of birth.</li><li>Profile: photos, bio, stats, tags and links you choose to add.</li><li>Creators: legal name, ID images, a selfie, payout and tax details — used only for verification, payments and legal record-keeping.</li><li>Device: approximate location, notification tokens, and camera/microphone access only when you allow them.</li><li>Usage and, if you opt in, analytics cookies.</li></ul> },
        { h: "Sensitive information", body: <p>Your use of OnlyMen can reveal your sexual orientation. We treat all account data as sensitive, never sell it, and never show your birthday, exact location, legal name or ID to other members.</p> },
        { h: "How we use it", body: <p>To run the service, verify ages, keep people safe, process tips and payouts, send messages you asked for (email/SMS only with your opt-in), and meet legal obligations.</p> },
        { h: "Sharing", body: <p>With service providers that help us operate (hosting, verification, payments, email/SMS), under contract, and when the law requires. [List of processors TBD.]</p> },
        { h: "Your choices and rights", body: <p>Change privacy settings and permissions any time, withdraw marketing consent, download or delete your data. Additional rights may apply under GDPR, UK GDPR, CCPA/CPRA and other laws. [TBD by counsel.]</p> },
        { h: "Retention", body: <p>We keep data while your account is open, and verification/2257 records for as long as the law requires. [Periods TBD.]</p> },
      ]}
    />
  ),
});
