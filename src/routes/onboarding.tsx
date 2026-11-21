import { useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { OnboardingWizard } from "@/components/onboarding/wizard";
import type { OnboardingStepId } from "@/lib/account/types";

const IDS: OnboardingStepId[] = ["consents", "basics", "photos", "details", "socials", "permissions", "verify", "privacy", "finish"];

export const Route = createFileRoute("/onboarding")({
  validateSearch: (s: Record<string, unknown>): { step?: OnboardingStepId } => ({
    step: IDS.includes(s.step as OnboardingStepId) ? (s.step as OnboardingStepId) : undefined,
  }),
  head: () => ({ meta: [{ title: "Set up your profile — OnlyMen" }] }),
  component: Onboarding,
});

function Onboarding() {
  const { step } = Route.useSearch();
  const nav = useNavigate({ from: "/onboarding" });
  const onStep = useCallback((s: OnboardingStepId, replace?: boolean) => nav({ search: { step: s }, replace }), [nav]);
  return <OnboardingWizard step={step} onStep={onStep} />;
}
