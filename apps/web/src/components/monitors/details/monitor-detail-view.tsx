"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getMonitor, checkMonitor } from "@/actions/monitors";
import { MonitorDetailHeader } from "@/components/monitors/details/header";
import { MonitorStatsGrid } from "@/components/monitors/details/stats-grid";
import { MonitorCharts } from "@/components/monitors/details/charts";
import { IncidentHistory } from "@/components/monitors/details/incident-history";

export function MonitorDetailView({ initialMonitor }: { initialMonitor: any }) {
  const { data: monitor } = useQuery({
    queryKey: ["monitor", initialMonitor.id],
    queryFn: () => getMonitor(initialMonitor.id),
    initialData: initialMonitor,
    refetchInterval: 5000, // Poll every 5 seconds
    refetchOnWindowFocus: true,
  });

  // Auto-trigger check if data is stale (simulates cron in dev)
  useEffect(() => {
    if (!monitor) return;

    const checkStale = async () => {
      const lastEvent = monitor.events?.[0];
      const lastCheckTime = lastEvent ? new Date(lastEvent.timestamp).getTime() : 0;
      const now = Date.now();
      const diffSeconds = (now - lastCheckTime) / 1000;

      // If stale (> 70s) and not already checking (optimistic), trigger check
      if (diffSeconds > 70) {
        console.log("Data stale (>70s), triggering auto-check...");
        await checkMonitor(monitor.id);
        // Query will re-fetch automatically via refetchInterval
      }
    };

    const timer = setInterval(checkStale, 10000); // Check staleness every 10s
    checkStale(); // Also check on mount/update

    return () => clearInterval(timer);
  }, [monitor]);

  if (!monitor) return null;

  return (
    <>
      <MonitorDetailHeader monitor={monitor} />
      <MonitorStatsGrid monitor={monitor} />
      <MonitorCharts monitor={monitor} />
      <IncidentHistory monitor={monitor} />
    </>
  );
}
