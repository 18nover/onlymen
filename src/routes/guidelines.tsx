import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONSENT_VERSIONS } from "@/lib/account/constants";

export const Route = createFileRoute("/guidelines")({
  head: () => ({ meta: [{ title: "Community Guidelines (draft) — OnlyMen" }] }),
  component: () => (
    <LegalPage
      title="Community Guidelines"
      version={CONSENT_VERSIONS.guidelines}
      intro={<p>OnlyMen is a space for adult men to connect and for creators to be celebrated and paid. A few rules keep it hot and safe.</p>}
      sections={[
        { h: "Adults only, always", body: <p>Everyone on OnlyMen — and everyone in any photo or video — must be 18+. Content suggesting minors, even role-play, means an immediate ban and a report to authorities.</p> },
        { h: "Consent is everything", body: <p>Only post content of people who agreed to be recorded and shared. No hidden cameras, no revenge content, no deepfakes of real people.</p> },
        { h: "Respect", body: <p>No harassment, hate, racism, body-shaming, outing anyone, or pressuring people who said no. Block and report freely.</p> },
        { h: "Be real", body: <p>Your photos must be of you. No impersonation, catfishing or fake verification.</p> },
        { h: "Keep money on OnlyMen", body: <p>Never ask for or send money outside OnlyMen tips — it's how scams start and it voids our protection.</p> },
        { h: "Explicit content", body: <p>Your main profile photo must be non-explicit. Mark explicit images 18+ so members who prefer can blur them.</p> },
        { h: "Reporting", body: <p>Use Report on any profile or message. Our safety team reviews reports. [Response-time commitments TBD.]</p> },
      ]}
    />
  ),
});
