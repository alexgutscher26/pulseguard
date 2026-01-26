"use client";

import { Server, CheckCircle, AlertTriangle, PauseCircle } from "lucide-react";

export function MonitorStats({ monitors = [] }: { monitors: any[] }) {
  const total = monitors.length;
  const operational = monitors.filter(m => m.status === "UP").length;
  const down = monitors.filter(m => m.status === "DOWN").length;
  const maintenance = monitors.filter(m => m.status === "PAUSED").length;

  const stats = [
    {
      label: "Total Targets",
      value: total,
      icon: Server,
      color: "text-white",
      iconColor: "text-primary",
    },
    {
      label: "Operational",
      value: operational,
      icon: CheckCircle,
      color: "text-primary",
      iconColor: "text-primary",
    },
    {
      label: "Down / Crit",
      value: down,
      icon: AlertTriangle,
      color: "text-red-500",
      iconColor: "text-red-500",
    },
    {
      label: "Maintenance",
      value: maintenance,
      icon: PauseCircle,
      color: "text-yellow-500",
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-black/40 border border-primary/20 p-4 relative group hover:border-primary/40 transition-colors"
        >
          <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-1 font-mono">
            {stat.label}
          </p>
          <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
          <div className="absolute top-0 right-0 p-2 opacity-50">
            <stat.icon className={`size-4 ${stat.iconColor}`} />
          </div>
          
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 group-hover:border-primary/100 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 group-hover:border-primary/100 transition-colors"></div>
        </div>
      ))}
    </div>
  );
}
