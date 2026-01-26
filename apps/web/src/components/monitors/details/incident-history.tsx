"use client";

import { CheckCircle, AlertTriangle, Download } from "lucide-react";

export function IncidentHistory({ monitor }: { monitor: any }) {
  const events = monitor.events || [];
  const history = events;

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-primary/20 bg-black/40 p-6 backdrop-blur-sm shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h3 className="text-foreground text-lg font-bold font-mono uppercase tracking-tight">
            Event Log
          </h3>
          <p className="text-primary/60 text-xs font-mono">Recent heartbeat activity</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-primary/20 hover:border-primary/50 transition-colors font-mono">
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/20 bg-primary/5">
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Status
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Timestamp
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono">
                Latency
              </th>
              <th className="py-4 px-4 text-primary/60 text-[10px] font-bold uppercase tracking-widest font-mono text-right">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-8 text-center text-primary/40 font-mono text-xs uppercase tracking-widest"
                >
                  No events recorded. Output stream silent.
                </td>
              </tr>
            )}
            {history.map((event: any) => (
              <tr
                key={event.id}
                className="border-b border-primary/10 hover:bg-primary/5 transition-colors group font-mono"
              >
                <td className="py-4 px-4">
                  {event.status === "UP" ? (
                    <span className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <CheckCircle className="size-4" />
                      Resolved
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="size-4" />
                      Downtime
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-xs text-foreground/80">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td className="py-4 px-4 text-xs font-bold text-foreground">
                  {event.latency ? `${event.latency}ms` : "Timeout"}
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-primary hover:text-white text-xs font-bold underline decoration-primary/50 underline-offset-4">
                    Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
