"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLicenseTelemetry } from "@/actions/user";
import {
  Activity,
  LayoutDashboard,
  Monitor,
  Bell,
  Settings,
  TriangleAlert,
  Globe,
  Blocks,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Monitors", href: "/dashboard/monitors", icon: Monitor },
  { name: "Templates", href: "/dashboard/templates", icon: Layers },
  { name: "Status Pages", href: "/dashboard/pages", icon: Globe },
  { name: "Integrations", href: "/dashboard/integrations", icon: Blocks },
  { name: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [telemetry, setTelemetry] = useState<{
    tier: string;
    probeCount: number;
    maxProbes: number;
    pingInterval: string;
    regions: string;
  } | null>(null);

  useEffect(() => {
    getLicenseTelemetry().then(setTelemetry).catch(console.error);
  }, []);

  const currentTier = telemetry?.tier || "INITIATE";
  const displayTier = currentTier === "INITIATE" ? "FREE_DEV" : currentTier;

  // Tier color styling
  const tierColorClass =
    currentTier === "INITIATE"
      ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
      : currentTier === "NETRUNNER"
        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
        : "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";

  return (
    <aside className="hidden md:flex w-64 shrink-0 border-r border-border bg-background/40 backdrop-blur-xl flex-col justify-between p-4 h-full relative overflow-hidden font-sans">
      <div className="flex flex-col gap-8 relative z-10 px-1 py-2">
        {/* Logo/Brand with dynamic pulse telemetry */}
        <div className="flex items-center gap-3 relative">
          <div className="relative flex items-center justify-center size-10 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <Activity className="size-5 text-emerald-400 animate-pulse duration-[2000ms]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-foreground text-xs font-black uppercase tracking-[0.15em] leading-none">
              PulseGuard
            </h1>
            <span className="text-[9px] font-mono text-emerald-400/70 tracking-wider mt-1.5 uppercase flex items-center gap-1">
              <span className="size-1 bg-emerald-400 rounded-full animate-ping shrink-0" />
              TELEMETRY ACTIVE
            </span>
          </div>
        </div>

        {/* Navigation Links with sharp geometry and hover glow */}
        <nav className="flex flex-col gap-1.5 mt-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-none border-l-2 transition-all duration-300 group text-xs font-bold tracking-wider uppercase relative overflow-hidden",
                  isActive
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-card/30 hover:border-border/60",
                )}
              >
                {isActive && (
                  <div className="absolute inset-y-0 left-0 w-[40px] bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                )}

                <item.icon
                  className={cn(
                    "size-4.5 transition-all duration-300",
                    isActive
                      ? "text-primary scale-110"
                      : "text-muted-foreground group-hover:text-foreground group-hover:scale-105",
                  )}
                />
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  {item.name}
                </span>

                {isActive && (
                  <span className="ml-auto font-mono text-[9px] text-primary/70 bg-primary/10 px-1.5 py-0.5 border border-primary/20">
                    ACTIVE
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Telemetry License Card */}
      <div className="relative z-10 p-4 border border-border/80 bg-card/10 backdrop-blur-md flex flex-col gap-3.5 shadow-md rounded-none">
        <div className="flex flex-col gap-2 font-mono">
          <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
            <span className="text-[9px] text-muted-foreground tracking-wider uppercase">
              LICENSE TIER
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${tierColorClass}`}>
              {displayTier}
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-muted-foreground tracking-wider uppercase">PROBE NODES</span>
            <span className="text-foreground font-semibold">
              {telemetry ? `${telemetry.probeCount} / ${telemetry.maxProbes}` : "0 / 0"} Enabled
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-muted-foreground tracking-wider uppercase">PING INTERVAL</span>
            <span className="text-foreground font-semibold">
              {telemetry ? telemetry.pingInterval : "60s Min"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-muted-foreground tracking-wider uppercase">REGIONS</span>
            <span className="text-foreground font-semibold">
              {telemetry ? telemetry.regions : "US-East Only"}
            </span>
          </div>
        </div>

        {currentTier === "INITIATE" && (
          <div className="text-[10px] text-muted-foreground leading-relaxed border-l border-amber-500/50 pl-2 py-0.5">
            Unlock global checks & latency maps.
          </div>
        )}

        {currentTier !== "CONSTRUCT" && (
          <Link
            href="/dashboard/settings?tab=billing"
            className="w-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer rounded-none border border-foreground/10"
          >
            <span>&gt; UPGRADE_LICENSE</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
