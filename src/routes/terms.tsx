import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONSENT_VERSIONS } from "@/lib/account/constants";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Service (draft) — OnlyMen" }] }),
  component: () => (
    <LegalPage
      title="Terms of Service"
      version={CONSENT_VERSIONS.terms}
      intro={<p>These terms are an agreement between you and 18nover, the company that runs OnlyMen. By creating an account you agree to them. If you don't agree, don't use the service.</p>}
      sections={[
        { h: "Who can use OnlyMen", body: <p>You must be at least 18 years old and the age of majority where you live, and legally allowed to view adult content. We may ask you to prove your age at any time and close accounts that can't.</p> },
        { h: "Your account", body: <p>Keep your login private and your information accurate. One person per account. You're responsible for activity on your account.</p> },
        { h: "Creators", body: <><p>Creators must pass identity and age verification before publishing or receiving money, and must keep records for everyone who appears in their content (see our 2257 statement).</p><p>You keep ownership of your content. You grant OnlyMen a non-exclusive, worldwide license to host, display and promote it on the service while it's posted.</p></> },
        { h: "Tips and payments", body: <p>Tips are voluntary and non-refundable except where the law requires. Payout timing, fees and eligibility will be described in a separate creator payments policy. [TBD]</p> },
        { h: "Prohibited content and conduct", body: <p>No minors, no non-consensual content, no impersonation, no harassment, no illegal services, no solicitation of prostitution where it is unlawful, and nothing that breaks our Community Guidelines.</p> },
        { h: "Termination", body: <p>You can delete your account any time. We may suspend or remove accounts that break these terms.</p> },
        { h: "Disclaimers and liability", body: <p>[TBD by counsel — warranty disclaimer, limitation of liability, indemnity, governing law, dispute resolution / arbitration, DMCA agent.]</p> },
      ]}
    />
  ),
});
