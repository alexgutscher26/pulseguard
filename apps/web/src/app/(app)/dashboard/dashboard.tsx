"use client";

import { DashboardStats, type DashboardStatsData } from "@/components/dashboard/stats";
import { MonitorsTable } from "@/components/dashboard/monitors-table";
import { useMonitors, useDashboardStats } from "@/hooks/use-monitors";

export default function Dashboard({
  monitors: initialMonitors,
  stats: initialStats,
}: {
  monitors: any[];
  stats: DashboardStatsData;
}) {
  const { data: monitors } = useMonitors(initialMonitors);
  const { data: stats } = useDashboardStats(initialStats);

/**
 * Renders the Dashboard component containing stats and monitors.
 */
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardStats stats={stats} />
      <MonitorsTable monitors={monitors} />
    </div>
  );
}
