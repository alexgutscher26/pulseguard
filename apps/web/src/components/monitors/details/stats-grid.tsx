"use client";
import { Activity, Clock, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function MonitorStatsGrid({ monitor }: { monitor: any }) {
  // Calculate stats
  const events = monitor.events || [];
  const total = events.length;
  const upCount = events.filter((e: any) => e.status === "UP").length;
  const downCount = total - upCount;

  const uptime = total > 0 ? ((upCount / total) * 100).toFixed(2) : "0.00";

  // Filter undefined latency if any (though schema says int)
  const latencies = events
    .map((e: any) => e.latency)
    .filter((l: any) => typeof l === "number" && l >= 0);
  const avgLatency =
    latencies.length > 0
      ? (latencies.reduce((a: any, b: any) => a + b, 0) / latencies.length).toFixed(0)
      : "0";

  // Downtime: assuming 1 minute interval for simplicity if we don't know duration.
  // Ideally we sum duration based on timestamps.
  const intervalMinutes = (monitor.interval || 60) / 60;
  const downtimeMinutes = (downCount * intervalMinutes).toFixed(0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="flex flex-col gap-2 rounded-sm p-4 md:p-6 border border-primary/20 bg-card/40 backdrop-blur-sm relative group overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <div className="flex justify-between items-center relative z-10">
          <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
            Uptime (24h)
          </p>
          <Activity className="size-4 text-primary" />
        </div>
        <p className="text-foreground text-3xl font-bold font-mono tracking-tighter relative z-10">
          {uptime}%
        </p>
        <p className="text-primary text-xs font-bold font-mono flex items-center gap-1 relative z-10">
          <ArrowUpRight className="size-3" /> +0.02% from yesterday
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-sm p-6 border border-primary/20 bg-card/40 backdrop-blur-sm relative group overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <div className="flex justify-between items-center relative z-10">
          <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
            Avg Latency
          </p>
          <Clock className="size-4 text-primary" />
        </div>
        <p className="text-foreground text-3xl font-bold font-mono tracking-tighter relative z-10">
          {avgLatency}ms
        </p>
        <p className="text-yellow-500 text-xs font-bold font-mono flex items-center gap-1 relative z-10">
          <ArrowUpRight className="size-3" /> +15ms increase
        </p>
      </div>

      <div className="flex flex-col gap-2 rounded-sm p-6 border border-primary/20 bg-card/40 backdrop-blur-sm relative group overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        <div className="flex justify-between items-center relative z-10">
          <p className="text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
            Total Downtime
          </p>
          <AlertTriangle className="size-4 text-primary" />
        </div>
        <p className="text-foreground text-3xl font-bold font-mono tracking-tighter relative z-10">
          {downtimeMinutes}m
        </p>
        <p className="text-primary text-xs font-bold font-mono flex items-center gap-1 relative z-10">
          <ArrowDownRight className="size-3" /> stable
        </p>
      </div>
    </div>
  );
}
