"use client";

import { useState, useEffect } from "react";
import type { OnboardingStatus } from "@/actions/onboarding";
import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard";

interface OnboardingChecklistProps {
  status: OnboardingStatus;
  userEmail?: string;
}

export function OnboardingChecklist({
  status,
  userEmail = "",
}: OnboardingChecklistProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasPrefill =
      typeof window !== "undefined" &&
      localStorage.getItem("pulseguard_prefill_monitor");
    if (
      (!status.hasCreatedMonitor &&
        !status.isComplete &&
        !status.onboardingCompleted) ||
      hasPrefill
    ) {
      setWizardOpen(true);
    }
  }, [status.hasCreatedMonitor, status.isComplete, status.onboardingCompleted]);

  if (!mounted) {
    return null;
  }

  return (
    <OnboardingWizard
      open={wizardOpen}
      onOpenChange={setWizardOpen}
      userEmail={userEmail}
      onboardingStatus={status}
    />
  );
}
