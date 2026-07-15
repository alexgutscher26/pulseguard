"use client";

import Link from "next/link";
import {
  Activity,
  LayoutDashboard,
  Monitor,
  Bell,
  Settings,
  TriangleAlert,
  X,
  Globe,
  Blocks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { useHaptic } from "@/hooks/use-haptic";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Monitors", href: "/dashboard/monitors", icon: Monitor },
  { name: "Status Pages", href: "/dashboard/pages", icon: Globe },
  { name: "Integrations", href: "/dashboard/integrations", icon: Blocks },
  { name: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Mobile sidebar drawer component
 * - Full-height drawer with navigation
 * - Close button (X) in top-right
 * - Maintains cyberpunk aesthetic
 */
export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { trigger } = useHaptic();

  const handleClose = () => {
    trigger("light");
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} side="left">
      <div className="h-full flex flex-col justify-between p-4 bg-background border-r border-border relative overflow-hidden">
        <div className="flex flex-col gap-8 relative z-10">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/5 border border-primary/10 text-primary transition-colors">
                <Activity className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-foreground text-sm font-bold leading-none tracking-tight">
                  PulseGuard
                </h1>
              </div>
            </div>

            {/* Close Button - Touch Friendly */}
            <button
              onClick={handleClose}
              className="flex items-center justify-center size-10 rounded-xl border border-border bg-card hover:bg-accent transition-colors active:scale-95 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="size-4.5 text-foreground" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href as any}
                  onClick={() => {
                    trigger("medium");
                    onClose();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 font-sans group border border-transparent active:scale-[0.98] text-xs font-semibold tracking-wide",
                    isActive
                      ? "bg-accent text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-4",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                    )}
                  />
                  <p>{item.name}</p>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                  )}
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
          <button
            onClick={() => {
              trigger("success");
              onClose();
            }}
            className="w-full bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all py-2 flex items-center justify-center cursor-pointer"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </Drawer>
  );
}
