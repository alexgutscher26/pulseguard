import { auth } from "@pulseguard/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getDashboardStats, getMonitors, getMonitorInsights } from "@/actions/monitors";
import { getOnboardingStatus } from "@/actions/onboarding";
import { getUserUsageSummary } from "@/lib/billing-server";
import DashboardClient from "./dashboard-client";

/**
 * Renders the Dashboard page after validating the user session.
 */
export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const [monitors, stats, insights, onboardingStatus, usageSummary] = await Promise.all([
    getMonitors(),
    getDashboardStats(),
    getMonitorInsights(),
    getOnboardingStatus(),
    getUserUsageSummary(session.user.id),
  ]);

  return (
    <DashboardClient
      monitors={monitors}
      stats={stats}
      insights={insights}
      onboardingStatus={onboardingStatus}
      usageSummary={usageSummary}
    />
  );
}
