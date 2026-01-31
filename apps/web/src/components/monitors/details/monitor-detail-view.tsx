"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useTransition } from "react";
import { getMonitor, checkMonitor } from "@/actions/monitors";
import { MonitorDetailHeader } from "@/components/monitors/details/header";
import { MonitorStatsGrid } from "@/components/monitors/details/stats-grid";
import { MonitorCharts } from "@/components/monitors/details/charts";
import { IncidentHistory } from "@/components/monitors/details/incident-history";
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
    refetchInterval: 5000, // Poll every 5 seconds
    refetchOnWindowFocus: true,
  });

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
      const lastCheckTime = lastEvent ? new Date(lastEvent.timestamp).getTime() : 0;
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

      <MonitorDetailHeader monitor={monitor} />
      <MonitorStatsGrid monitor={monitor} />
      <MonitorCharts monitor={monitor} />
      <IncidentHistory monitor={monitor} />
    </div>
  );
}
