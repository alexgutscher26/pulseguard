"use client";

import Link from "next/link";
import {
  Activity,
  LayoutDashboard,
  Monitor,
  Bell,
  Settings,
  TriangleAlert,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Monitors", href: "/dashboard/monitors", icon: Monitor },
  { name: "Status Pages", href: "/dashboard/pages", icon: Globe },
  { name: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/30 backdrop-blur-md flex flex-col justify-between p-4 h-full relative overflow-hidden">
      <div className="flex flex-col gap-8 relative z-10 px-2 py-2">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-xl bg-primary/5 border border-primary/10 text-primary transition-colors group">
            <Activity className="size-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-foreground text-sm font-bold leading-none tracking-tight">
              PulseGuard
            </h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 mt-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href as any}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group text-xs font-semibold tracking-wide",
                  isActive
                    ? "bg-accent text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                )}
              >
                <item.icon
                  className={cn(
                    "size-4",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary transition-colors",
                  )}
                />
                <p>{item.name}</p>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-10 p-5 rounded-2xl border border-border bg-card/50 flex flex-col gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
        <p className="text-xs text-foreground font-bold uppercase tracking-wider">
          Upgrade your plan
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Unlock multi-region verification.
        </p>
        <Link
          href="/dashboard/settings?tab=billing"
          className="w-full mt-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all py-2 flex items-center justify-center cursor-pointer"
        >
          Upgrade Now
        </Link>
      </div>
    </aside>
  );
}
