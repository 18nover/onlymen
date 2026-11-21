import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";
import { CONSENT_VERSIONS } from "@/lib/account/constants";

export const Route = createFileRoute("/live-rules")({
  head: () => ({ meta: [{ title: "Live Stream Rules (draft) — OnlyMen" }] }),
  component: () => (
    <LegalPage
      title="Live Stream Rules"
      version={CONSENT_VERSIONS.liveRules}
      intro={
        <p>
          OnlyMen is a discovery hub. We don't host live video: when you go live, viewers are sent to your own room on the platform you stream from, or to OnlyMen Live, which is run by a licensed live-streaming partner. These rules apply on top of that platform's own terms.
        </p>
      }
      sections={[
        { h: "Adults only, on and off camera", body: <p>No one under 18 may appear, be heard, or be present in the room — ever. If a minor walks in, end the stream immediately.</p> },
        { h: "Every performer is verified", body: <><p>Anyone who appears on camera with you must be 18+, ID-verified on OnlyMen or on the platform you stream from, and have their own 18 U.S.C. § 2257 records (ID copy + signed release) on file <em>before</em> they appear.</p><p>The streaming platform is the producer of record for streams it hosts; you remain responsible for records for content you record and upload yourself.</p></> },
        { h: "Consent", body: <p>Everyone on camera must clearly consent, be sober enough to consent, and be able to stop at any time. No hidden cameras, no streaming people who don't know they're on air, no public places where bystanders could be filmed.</p> },
        { h: "Prohibited", body: <ul className="list-disc space-y-1 pl-5"><li>Minors, age-play implying minors, incest roleplay, bestiality, non-consent or sleep content, intoxication, weapons, blood, scat.</li><li>Pre-recorded video passed off as live.</li><li>Arranging in-person paid meetings where prohibited by law.</li><li>Asking for or accepting payment off-platform.</li></ul> },
        { h: "Tips and payments", body: <p>Tips and private shows are processed by the platform hosting the stream. OnlyMen does not hold or pay out live-stream earnings in Phase 1. [Shared wallet TBD — see roadmap.]</p> },
        { h: "Geo-blocking", body: <p>You can block regions from your listing. Platforms may also block regions to comply with local age-verification laws; we follow their decisions.</p> },
        { h: "Recordings and replays", body: <p>Only publish replays if everyone who appears agreed to be recorded and published, and records exist for each of them.</p> },
        { h: "Moderation and enforcement", body: <p>Use moderators and banned-word filters. Reports go to the platform hosting the stream and to OnlyMen. We may remove your live listing or account for breaking these rules. [Process and appeals TBD by counsel.]</p> },
      ]}
    />
  ),
});
