"use client";

import { DashboardStats } from "@/components/dashboard/stats";
import { MonitorsTable } from "@/components/dashboard/monitors-table";

/**
 * Renders the Dashboard component containing stats and monitors.
 */
export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardStats />
      <MonitorsTable />
    </div>
  );
}
