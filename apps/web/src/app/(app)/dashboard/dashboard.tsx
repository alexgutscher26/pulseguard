"use client";

import { DashboardStats, type DashboardStatsData } from "@/components/dashboard/stats";
import { MonitorsTable } from "@/components/dashboard/monitors-table";

export default function Dashboard({
  monitors,
  stats,
}: {
  monitors: any[];
  stats: DashboardStatsData;
}) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardStats stats={stats} />
      <MonitorsTable monitors={monitors} />
    </div>
  );
}
