"use client";

import dynamic from "next/dynamic";
import DashboardLoading from "./loading";
import type { DashboardStatsData } from "@/components/dashboard/stats";
import type { MonitorInsight } from "@/components/dashboard/ai-insights";
import type { OnboardingStatus } from "@/actions/onboarding";

const Dashboard = dynamic(() => import("./dashboard"), {
  ssr: false,
  loading: () => <DashboardLoading />,
});

export default function DashboardClient({
  monitors,
  stats,
  insights,
  onboardingStatus,
}: {
  monitors: any[];
  stats: DashboardStatsData;
  insights: MonitorInsight[];
  onboardingStatus: OnboardingStatus;
}) {
  return (
    <Dashboard
      monitors={monitors}
      stats={stats}
      insights={insights}
      onboardingStatus={onboardingStatus}
    />
  );
}
