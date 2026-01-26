"use client";

import { Fullscreen } from "lucide-react";

export function MonitorCharts({ monitor }: { monitor: any }) {
  // 50 events for history
  const history = monitor.events || [];
  const displayEvents = [...history].slice(0, 50).reverse();

  // Uptime Bar Config
  const bars = Array.from({ length: 50 }).map((_, i) => {
    const offset = 50 - displayEvents.length;
    if (i < offset) return { status: "unknown" };
    const event = displayEvents[i - offset];
    return { status: event.status };
  });

  // Dynamic Response Time Chart Config
  // We Map 50 points. X=0 to 500 (width). Y=0 to 150 (height).
  // Normalize latency: Find max latency in set.
  const latencies = displayEvents.map((e) => e.latency || 0);
  const maxLatency = Math.max(...latencies, 100); // Min max is 100ms to avoid flat line at 0
  const points = latencies.map((l, i) => {
    const x = (i / (latencies.length - 1 || 1)) * 478; // 478 is approx width of viewBox
    const y = 150 - (l / maxLatency) * 120; // 150 height, reserve 30px padding top
    return { x, y };
  });

  // SVG Path Generation
  let pathD = "";
  if (points.length > 1) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    // Simple line for now, or bezier if we want smooth
    for (let i = 1; i < points.length; i++) {
      // Basic smoothing (catmull-rom or similar would be better but this is raw TSX)
      // Let's just do straight lines or simple quadratic
      const p = points[i];
      const prev = points[i - 1];
      const midX = (prev.x + p.x) / 2;
      pathD += ` Q ${midX} ${prev.y}, ${midX} ${p.y} T ${p.x} ${p.y}`;
    }
  } else if (points.length === 1) {
    pathD = `M 0 ${points[0].y} H 478`;
  }

  const avgLatency =
    latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;

  const areaPath = pathD ? `${pathD} V 150 H 0 Z` : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Uptime Bar Chart */}
      <div className="flex flex-col gap-4 rounded-sm border border-primary/20 bg-black/40 p-6 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="text-foreground text-lg font-bold font-mono uppercase tracking-tight">
            Uptime History
          </h3>
          <select className="bg-primary/5 border border-primary/20 rounded-sm text-xs font-bold text-primary py-1 pl-3 pr-8 focus:outline-none focus:border-primary/50 appearance-none font-mono">
            <option>Last 24 Hours</option>
          </select>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-foreground text-3xl font-bold font-mono tracking-tighter">
            {displayEvents.length > 0
              ? (
                  (displayEvents.filter((e) => e.status === "UP").length / displayEvents.length) *
                  100
                ).toFixed(0)
              : "100"}
            %
          </p>
          <p className="text-primary/60 text-xs font-mono">Current Average</p>
        </div>

        <div className="grid min-h-[160px] grid-flow-col gap-1 items-end pt-4">
          {bars.map((bar, i) => (
            <div
              key={i}
              className={`w-full rounded-t-sm border-t-2 transition-all hover:opacity-80 ${
                bar.status === "UP"
                  ? "bg-primary/20 border-primary h-full"
                  : bar.status === "DOWN"
                    ? "bg-red-500/20 border-red-500 h-2/5"
                    : "bg-primary/5 border-primary/10 h-full opacity-20" // Unknown/Empty
              }`}
            ></div>
          ))}
        </div>

        <div className="flex justify-between mt-2">
          <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest font-mono">
            Oldest
          </p>
          <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest font-mono">
            Now
          </p>
        </div>
      </div>

      {/* Response Time - Dynamic SVG */}
      <div className="flex flex-col gap-4 rounded-sm border border-primary/20 bg-black/40 p-6 backdrop-blur-sm shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center">
          <h3 className="text-foreground text-lg font-bold font-mono uppercase tracking-tight">
            Response Time (ms)
          </h3>
          <button className="p-1 hover:bg-primary/10 rounded-sm text-primary/60 hover:text-primary transition-colors">
            <Fullscreen className="size-4" />
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-foreground text-3xl font-bold font-mono tracking-tighter">
            {avgLatency}ms
          </p>
          <p className="text-primary/60 text-xs font-mono">Last 50 Events Average</p>
        </div>
        <div className="flex flex-1 flex-col pt-4 min-h-[160px]">
          {latencies.length > 0 ? (
            <svg
              fill="none"
              height="100%"
              preserveAspectRatio="none"
              viewBox="0 0 478 150"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={pathD}
                stroke="currentColor"
                className="text-primary"
                strokeLinecap="round"
                strokeWidth="2"
              ></path>
              <path d={areaPath} fill="url(#latency_grad)"></path>
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="latency_grad"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="150"
                >
                  <stop stopColor="currentColor" className="text-primary" stopOpacity="0.2"></stop>
                  <stop
                    offset="1"
                    stopColor="currentColor"
                    className="text-primary"
                    stopOpacity="0"
                  ></stop>
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <div className="flex h-full items-center justify-center border border-dashed border-primary/20 bg-primary/5 rounded-sm">
              <p className="text-primary/40 font-mono text-xs uppercase tracking-widest">
                No data available
              </p>
            </div>
          )}
          <div className="flex justify-between mt-2">
            <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest font-mono">
              Oldest
            </p>
            <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest font-mono">
              Now
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
