"use client";

import { AlertTriangle, CheckCircle, Clock, Timer, Filter, Calendar } from "lucide-react";

const history = [
  {
    monitor: "Main Dashboard",
    type: "Down (502 Bad Gateway)",
    typeIcon: AlertTriangle,
    typeColor: "text-red-500",
    status: "Sent",
    channel: "Slack (#ops-alerts)",
    time: "2 Mins Ago",
  },
  {
    monitor: "API Gateway",
    type: "High Latency (3200ms)",
    typeIcon: Timer,
    typeColor: "text-yellow-500",
    status: "Sent",
    channel: "Email (admin@)",
    time: "1 Hour Ago",
  },
  {
    monitor: "Auth Service",
    type: "Down",
    typeIcon: AlertTriangle,
    typeColor: "text-red-500",
    status: "Failed",
    statusColor: "text-red-500 bg-red-500/10 border-red-500/20",
    channel: "Discord",
    time: "3 Hours Ago",
  },
  {
    monitor: "Staging Site",
    type: "Resolved",
    typeIcon: CheckCircle,
    typeColor: "text-primary",
    status: "Sent",
    channel: "Slack (#ops-alerts)",
    time: "5 Hours Ago",
  },
];

export function AlertHistory() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">Alert Log</h3>
          <p className="text-xs text-primary/60 font-mono">Recent incident reports</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 hover:border-primary/50 text-primary/70 hover:text-primary text-[10px] font-bold uppercase tracking-wider transition-all font-mono">
                <Calendar className="size-3" /> Last 24 Hours
            </button>
        </div>
      </div>

      <div className="border border-primary/20 bg-black/40 relative overflow-hidden shadow-lg backdrop-blur-sm">
        {/* Decor */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50 pointer-events-none"></div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">Target System</th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">Incident Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">Dispatch Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">Channel</th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/60 uppercase tracking-widest font-mono">Time Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {history.map((item, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-foreground font-mono group-hover:text-primary transition-colors">{item.monitor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <item.typeIcon className={`size-4 ${item.typeColor}`} />
                      <span className="text-xs font-bold text-foreground font-mono">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-wider ${item.statusColor || "bg-primary/10 text-primary border-primary/20"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-primary/70 font-mono">{item.channel}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-primary/50">
                        <Clock className="size-3" />
                        <span className="text-xs font-mono">{item.time}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-primary/5 px-6 py-3 flex items-center justify-between border-t border-primary/20 font-mono">
            <p className="text-[10px] text-primary/60 uppercase tracking-widest">Syslog: Showing last 25 incidents</p>
            <div className="flex gap-2">
                <button className="px-3 py-1 border border-primary/20 text-primary/60 hover:text-primary text-[10px] uppercase font-bold disabled:opacity-30 disabled:hover:text-primary/60 transition-all" disabled>Prev</button>
                <button className="px-3 py-1 border border-primary/20 text-primary/60 hover:text-primary text-[10px] uppercase font-bold transition-all">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}
