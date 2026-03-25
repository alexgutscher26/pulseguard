"use client";

import { DashboardStats, type DashboardStatsData } from "@/components/dashboard/stats";
import { MonitorsTable } from "@/components/dashboard/monitors-table";
import { AIInsights, type MonitorInsight } from "@/components/dashboard/ai-insights";
import { useMonitors, useDashboardStats } from "@/hooks/use-monitors";

export default function Dashboard({
  monitors: initialMonitors,
  stats: initialStats,
  insights: initialInsights,
}: {
  monitors: any[];
  stats: DashboardStatsData;
  insights: MonitorInsight[];
}) {
  const { data: monitors } = useMonitors(initialMonitors);
  const { data: stats } = useDashboardStats(initialStats);

  return (
    <div className="flex flex-col gap-2">
      <AIInsights insights={initialInsights} />
      <DashboardStats stats={stats} />
      <MonitorsTable monitors={monitors} />
    </div>
  );
}
