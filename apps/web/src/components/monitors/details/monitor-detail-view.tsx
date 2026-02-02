"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { getMonitor, checkMonitor } from "@/actions/monitors";
import { getMonitorLatencyHistory } from "@/actions/latency";
import { useLiveMonitor } from "@/hooks/use-live-monitor";
import { MonitorDetailHeader } from "@/components/monitors/details/header";
import { MonitorStatsGrid } from "@/components/monitors/details/stats-grid";
import { MonitorCharts } from "@/components/monitors/details/charts";
import { IncidentHistory } from "@/components/monitors/details/incident-history";
import { LatencyHeatmap } from "@/components/monitors/latency";
import { ResponseTimeChart } from "@/components/charts/response-time-chart";
import { ChevronLeft, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function MonitorDetailView({ initialMonitor }: { initialMonitor: any }) {
  const { data: monitor } = useQuery({
    queryKey: ["monitor", initialMonitor.id],
    queryFn: () => getMonitor(initialMonitor.id),
    initialData: initialMonitor,
    refetchInterval: 0, // Disable polling in favor of WebSockets
    refetchOnWindowFocus: true,
  });

  // Query for latency history
  const { data: latencyHistory, isLoading: isLoadingLatency } = useQuery({
    queryKey: ["monitor-latency", initialMonitor.id],
    queryFn: () => getMonitorLatencyHistory(initialMonitor.id),
  });

  const queryClient = useQueryClient();
  const { lastEvent, isConnected } = useLiveMonitor(initialMonitor.id);

  // Sync Live Events to Query Cache
  useEffect(() => {
    if (lastEvent) {
      console.log("Received Live Event:", lastEvent);
      queryClient.setQueryData(
        ["monitor", initialMonitor.id],
        (oldData: any) => {
          if (!oldData) return oldData;

          const newEvent = {
            id: `live-${Date.now()}`,
            status: lastEvent.status,
            latency: lastEvent.latency,
            timestamp: new Date(lastEvent.timestamp).toISOString(),
            errorReason: null,
            region: lastEvent.region,
          };

          return {
            ...oldData,
            status: lastEvent.status,
            events: [newEvent, ...(oldData.events || [])],
          };
        },
      );

      // Optional: Toast for major status changes
      if (monitor?.status !== lastEvent.status) {
        toast(
          lastEvent.status === "UP" ? "Monitor Recovered" : "Monitor Down",
          {
            description: `Latency: ${lastEvent.latency}ms`,
            action: { label: "Dismiss", onClick: () => {} },
          },
        );
      }
    }
  }, [lastEvent, initialMonitor.id, queryClient, monitor?.status]);

  const [isLoading, startTransition] = useTransition();

  const handleRunCheck = () => {
    startTransition(async () => {
      const result = await checkMonitor(initialMonitor.id);
      if (result.success) {
        toast.success("Check initiated successfully");
      } else {
        toast.error(result.error || "Failed to initiate check");
      }
    });
  };

  // Auto-trigger check if data is stale (simulates cron in dev)
  useEffect(() => {
    if (!monitor) return;

    const checkStale = async () => {
      const lastEvent = monitor.events?.[0];
      const lastCheckTime = lastEvent
        ? new Date(lastEvent.timestamp).getTime()
        : 0;
      const now = Date.now();
      const diffSeconds = (now - lastCheckTime) / 1000;

      // If stale (> 70s) and not already checking (optimistic), trigger check
      if (diffSeconds > 70) {
        console.log("Data stale (>70s), triggering auto-check...");
        await checkMonitor(monitor.id, {
          checkRegions: ["Dashboard Auto-Check"],
          reason: "Detail View Stale Check",
        });
        // Query will re-fetch automatically via refetchInterval
      }
    };

    const timer = setInterval(checkStale, 10000); // Check staleness every 10s
    checkStale(); // Also check on mount/update

    return () => clearInterval(timer);
  }, [monitor]);

  if (!monitor) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/monitors"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-muted-foreground hover:text-foreground font-mono text-[10px] uppercase tracking-widest p-0 h-auto hover:bg-transparent",
          )}
        >
          <ChevronLeft className="size-4 mr-1 text-primary" />
          Back to Monitors
        </Link>

        <div className="flex items-center gap-2">
          {isConnected && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">
                Live
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={handleRunCheck}
            className="h-8 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary font-mono text-[10px] uppercase tracking-wider"
          >
            {isLoading ? (
              <Loader2 className="size-3 mr-2 animate-spin" />
            ) : (
              <Play className="size-3 mr-2" />
            )}
            Run Check
          </Button>
        </div>
      </div>

      <MonitorDetailHeader monitor={monitor} />
      <MonitorStatsGrid monitor={monitor} />

      {/* 24h Response Time Chart */}
      <ResponseTimeChart
        data={latencyHistory || []}
        isLoading={isLoadingLatency}
      />

      <MonitorCharts monitor={monitor} />

      {/* Latency Heatmap - Only show if regional monitoring is enabled */}
      {monitor.checkRegions && (
        <div className="mt-6">
          <LatencyHeatmap monitorId={monitor.id} />
        </div>
      )}

      <IncidentHistory monitor={monitor} />
    </div>
  );
}
