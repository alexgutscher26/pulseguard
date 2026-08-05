import DashboardClient from "@/app/(app)/dashboard/dashboard-client";
import { DemoBanner } from "@/components/dashboard/demo-banner";
import { DEMO_MONITORS, DEMO_STATS, DEMO_INSIGHTS, DEMO_ONBOARDING_STATUS } from "@/lib/demo-data";

export const metadata = {
  title: "Live Product Demo & Sandbox | PulseGuard",
  description:
    "Explore PulseGuard's edge monitoring platform with live pre-seeded telemetry data. No signup required.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <DemoBanner />
        <DashboardClient
          monitors={DEMO_MONITORS}
          stats={DEMO_STATS}
          insights={DEMO_INSIGHTS}
          onboardingStatus={DEMO_ONBOARDING_STATUS}
        />
      </div>
    </div>
  );
}
