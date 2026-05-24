"use client";

import { useState, useEffect } from "react";
import { DashboardStats, type DashboardStatsData } from "@/components/dashboard/stats";
import { MonitorsTable } from "@/components/dashboard/monitors-table";
import { MonitorsGrid } from "@/components/dashboard/monitors-grid";
import { AIInsights, type MonitorInsight } from "@/components/dashboard/ai-insights";
import { useMonitors, useDashboardStats } from "@/hooks/use-monitors";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    const saved = localStorage.getItem("pulseguard_dashboard_view_mode");
    if (saved === "list" || saved === "grid") {
      setViewMode(saved);
    }
  }, []);

  const handleToggleView = (mode: "list" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("pulseguard_dashboard_view_mode", mode);
  };

  return (
    <div className="flex flex-col gap-6">
      <AIInsights insights={initialInsights} />
      <DashboardStats stats={stats} />

      {/* View Mode Selector bar */}
      <div className="flex justify-between items-center px-1 border-b border-zinc-900 pb-3">
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
          Nodes Dashboard Management
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleView("list")}
            className={`h-8 px-3 font-mono text-[10px] uppercase tracking-wider ${
              viewMode === "list"
                ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                : "border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <List className="size-3 mr-1.5" />
            Table
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleView("grid")}
            className={`h-8 px-3 font-mono text-[10px] uppercase tracking-wider ${
              viewMode === "grid"
                ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                : "border-zinc-800 bg-zinc-950/20 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <LayoutGrid className="size-3 mr-1.5" />
            Grid Matrix
          </Button>
        </div>
      </div>

      <div>
        {viewMode === "list" ? (
          <MonitorsTable monitors={monitors} />
        ) : (
          <MonitorsGrid monitors={monitors} />
        )}
      </div>
    </div>
  );
}
