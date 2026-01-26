"use client";

import { DashboardStats } from "@/components/dashboard/stats";
import { MonitorsTable } from "@/components/dashboard/monitors-table";

export default function Dashboard({ monitors }: { monitors: any[] }) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardStats />
      <MonitorsTable monitors={monitors} />
    </div>
  );
}
