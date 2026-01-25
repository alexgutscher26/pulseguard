"use client";

import { Wifi, CheckCircle, Zap, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    name: "Active Monitors",
    value: "12",
    change: "+2 this week",
    trend: "up",
    icon: Wifi,
    iconColor: "text-primary",
    changeColor: "text-emerald-500",
  },
  {
    name: "Global Uptime",
    value: "99.98%",
    change: "+0.01%",
    trend: "up",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
    changeColor: "text-emerald-500",
  },
  {
    name: "Avg Response Time",
    value: "342ms",
    change: "-12ms (faster)",
    trend: "down", // actually good
    icon: Zap,
    iconColor: "text-amber-500",
    changeColor: "text-amber-500", 
  },
  {
    name: "Active Alerts",
    value: "1",
    change: "Currently being resolved",
    trend: "neutral",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    changeColor: "text-muted-foreground",
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-black/40 border border-primary/20 p-6 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
        >
            {/* Hover Corner accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/0 group-hover:border-primary/100 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/0 group-hover:border-primary/100 transition-colors"></div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">{stat.name}</p>
            <div className="p-2 bg-white/5 rounded-full">
                <stat.icon className={`size-4 ${stat.iconColor}`} />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground font-mono tracking-tighter">{stat.value}</p>
          <p className={`text-[10px] font-mono uppercase mt-2 flex items-center gap-1 ${stat.changeColor}`}>
            {stat.trend === "up" && <TrendingUp className="size-3" />}
            {stat.trend === "down" && <TrendingDown className="size-3" />}
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
