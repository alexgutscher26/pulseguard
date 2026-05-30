"use client";

import dynamic from "next/dynamic";
import DashboardLoading from "./loading";
import type { DashboardStatsData } from "@/components/dashboard/stats";
import type { MonitorInsight } from "@/components/dashboard/ai-insights";

const Dashboard = dynamic(() => import("./dashboard"), {
  ssr: false,
  loading: () => <DashboardLoading />,
});

export default function DashboardClient({
  monitors,
  stats,
  insights,
}: {
  monitors: any[];
  stats: DashboardStatsData;
  insights: MonitorInsight[];
}) {
  return <Dashboard monitors={monitors} stats={stats} insights={insights} />;
}
