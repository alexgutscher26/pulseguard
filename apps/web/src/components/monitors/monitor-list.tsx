"use client";

import { MoreHorizontal, Zap, WifiOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function UptimeBar({ status }: { status: number }) {
  const bgClass = status === 1 ? "bg-primary/80" : "bg-red-500/80";
  return <div className={`w-1 h-3 md:h-4 ${bgClass}`}></div>;
}

export function MonitorList({ monitors }: { monitors: any[] }) {
  const router = useRouter();

  return (
    <div className="border border-primary/20 bg-black/40 relative overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Decor corners */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 pointer-events-none"></div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-primary/5 border-b border-primary/20">
            <tr>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                Status
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                Monitor Info
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                History (Latest)
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono">
                Response
              </th>
              <th className="p-4 text-[10px] text-primary/60 uppercase tracking-widest font-normal font-mono text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10 text-sm">
            {monitors.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-primary/40 font-mono text-xs uppercase tracking-widest"
                >
                  No monitors active. Dispatch new targets.
                </td>
              </tr>
            )}
            {monitors.map((monitor) => {
              // Calculate history for bars (last 10 events reversed for display left-to-right?)
              // Assuming events are desc, so [0] is latest. We want old -> new.
              const history = monitor.events
                ? [...monitor.events].reverse().map((e: any) => (e.status === "UP" ? 1 : 0))
                : [];
              const latestLatency = monitor.events?.[0]?.latency;

              return (
                <tr
                  key={monitor.id}
                  onClick={() => router.push(`/dashboard/monitors/${monitor.id}`)}
                  className="group hover:bg-primary/5 transition-colors cursor-pointer font-mono border-l-2 border-transparent hover:border-primary/50"
                >
                  <td className="p-4 w-32">
                    {monitor.status === "UP" && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-primary/10 border border-primary/20 w-fit rounded-sm">
                        <div className="size-1.5 bg-primary rounded-full shadow-[0_0_5px_currentColor] animate-pulse"></div>
                        <span className="text-[10px] uppercase text-primary font-bold tracking-wider">
                          UP
                        </span>
                      </div>
                    )}
                    {monitor.status === "DOWN" && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 border border-red-500/20 w-fit rounded-sm">
                        <div className="size-1.5 bg-red-500 rounded-full shadow-[0_0_5px_currentColor] animate-ping"></div>
                        <span className="text-[10px] uppercase text-red-500 font-bold tracking-wider">
                          DOWN
                        </span>
                      </div>
                    )}
                    {monitor.status === "PAUSED" && (
                      <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 w-fit rounded-sm">
                        <div className="size-1.5 bg-yellow-500 rounded-full"></div>
                        <span className="text-[10px] uppercase text-yellow-500 font-bold tracking-wider">
                          PAUSED
                        </span>
                      </div>
                    )}
                  </td>
                  <td className={`p-4 ${monitor.status === "PAUSED" ? "opacity-75" : ""}`}>
                    <div className="flex flex-col">
                      <span
                        className={`font-bold text-foreground group-hover:text-primary transition-colors ${monitor.status === "DOWN" ? "group-hover:text-red-500" : monitor.status === "PAUSED" ? "group-hover:text-yellow-500" : ""}`}
                      >
                        {monitor.name}
                      </span>
                      <span className="text-[10px] text-primary/50 mt-0.5 font-sans break-all">
                        {monitor.url}
                      </span>
                    </div>
                  </td>
                  <td className={`p-4 ${monitor.status === "PAUSED" ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-3">
                      {history.length > 0 ? (
                        <div className="flex gap-[1px] h-4 items-end">
                          {history.map((h: number, i: number) => (
                            <UptimeBar key={i} status={h} />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground font-bold">--</span>
                      )}
                      {/* Mock percentage or calculate */}
                      <span
                        className={`text-xs font-bold ${monitor.status === "DOWN" ? "text-red-500" : monitor.status === "PAUSED" ? "text-muted-foreground" : "text-primary"}`}
                      >
                        100%
                      </span>
                    </div>
                  </td>
                  <td className={`p-4 ${monitor.status === "PAUSED" ? "opacity-50" : ""}`}>
                    {monitor.status !== "PAUSED" ? (
                      <div className="flex items-center gap-2 text-xs">
                        {monitor.status === "DOWN" ? (
                          <WifiOff className="size-3 text-red-500" />
                        ) : (
                          <Zap className="size-3 text-primary" />
                        )}
                        <span
                          className={monitor.status === "DOWN" ? "text-red-500" : "text-foreground"}
                        >
                          {latestLatency ? latestLatency + "ms" : "--"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">--</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 hover:bg-primary/20 text-primary/50 hover:text-primary transition-colors rounded-sm">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination mocked */}
      <div className="p-4 border-t border-primary/20 flex items-center justify-between bg-primary/5">
        <span className="text-[10px] text-primary/60 uppercase tracking-widest font-mono">
          Showing {monitors.length} targets
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-[10px] uppercase font-bold tracking-wider disabled:opacity-30 disabled:hover:text-primary/60 flex items-center gap-1 font-mono transition-all rounded-sm"
            disabled
          >
            <ChevronLeft className="size-3" /> Prev
          </button>
          <button className="px-3 py-1 border border-primary/20 text-primary/60 hover:text-primary hover:border-primary/50 text-[10px] uppercase font-bold tracking-wider hover:text-primary flex items-center gap-1 font-mono transition-all rounded-sm">
            Next <ChevronRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
