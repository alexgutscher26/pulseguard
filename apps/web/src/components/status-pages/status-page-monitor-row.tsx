"use client";

import { CheckCircle, AlertTriangle, Clock, Zap, WifiOff } from "lucide-react";
import { useLiveMonitor } from "@/hooks/use-live-monitor";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface MonitorRowProps {
  item: any; // StatusPageMonitor include
  showUptime?: boolean;
  showResponseTime?: boolean;
}

export function StatusPageMonitorRow({
  item,
  showUptime = true,
  showResponseTime = true,
}: MonitorRowProps) {
  const tStatus = useTranslations("status");
  const tCommon = useTranslations("common");
  const { monitor } = item;
  const { lastEvent, isConnected } = useLiveMonitor(monitor.id);

  // Local state to handle real-time updates
  // We initialize from server-provided data, then update with WS data
  const [currentStatus, setCurrentStatus] = useState(monitor.status);
  const [history, setHistory] = useState(monitor.events || []);

  // When a new WS event arrives
  useEffect(() => {
    if (lastEvent) {
      console.log("Live update for", monitor.name, lastEvent);
      setCurrentStatus(lastEvent.status);
      // Add new event to history (prepend since we map 59-i)
      // actually our map logic was: index 0 = latest.
      // so we should UNSHIFT data onto the array.
      setHistory((prev: any[]) => [lastEvent, ...prev].slice(0, 60)); // Keep last 60
    }
  }, [lastEvent, monitor.name]);

  const latestEvent = history[0];
  // Calculate simple uptime based on history (mock calculation for now or just simple ratio)
  const upCount = history.filter((e: any) => e.status === "UP").length;
  const totalCount = history.length;
  const uptime = totalCount > 0 ? Math.round((upCount / totalCount) * 100) : 0;

  return (
    <div className="group border border-primary/10 bg-card/40 hover:bg-card/60 rounded-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/30 transition-all relative overflow-hidden">
      {/* Hover Decor */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary/0 group-hover:bg-primary transition-colors"></div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              {item.displayName || monitor.name}
              {isConnected && (
                <span
                  className="relative flex h-2 w-2 ml-1"
                  title="Live Socket Connected"
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </h3>
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                currentStatus === "UP"
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-red-500/10 text-red-500 border-red-500/20"
              }`}
            >
              {currentStatus === "UP"
                ? tStatus("monitor_operational")
                : tStatus("monitor_outage")}
            </div>
          </div>
          <div className="text-right flex items-center gap-4">
            {showResponseTime && latestEvent && latestEvent.latency && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                <Zap className="size-3" /> {latestEvent.latency}ms
              </div>
            )}
            {showUptime &&
              (currentStatus === "UP" ? (
                <span className="text-primary text-sm font-bold">
                  {uptime}%
                </span>
              ) : (
                <span className="text-red-500 text-sm font-bold">
                  {tCommon("down")}
                </span>
              ))}
          </div>
        </div>

        {/* Uptime History Bars */}
        <div className="flex items-center gap-1 h-8 w-full">
          {[...Array(60)].map((_, i) => {
            // Map history. events[0] is latest.
            // visual: left (oldest) -> right (newest)
            // So index 0 (left) should be event[59]
            const eventIndex = 59 - i;
            const evt = history[eventIndex];

            let bgClass = "bg-primary/20"; // No data default
            if (evt) {
              if (evt.status === "MAINTENANCE") bgClass = "bg-amber-500";
              else if (evt.status === "UP") bgClass = "bg-primary";
              else bgClass = "bg-red-500";
            }

            return (
              <div
                key={i}
                className={`flex-1 h-full rounded-full transition-all hover:opacity-80 ${bgClass}`}
                title={
                  evt
                    ? `${new Date(evt.timestamp).toLocaleString()} - ${evt.status}`
                    : "No Data"
                }
              />
            );
          })}
        </div>

        <div className="flex justify-between text-[10px] text-primary/40 uppercase tracking-widest font-mono">
          <span>{tCommon("checks_ago")}</span>
          <span>{tCommon("now")}</span>
        </div>
      </div>
    </div>
  );
}
