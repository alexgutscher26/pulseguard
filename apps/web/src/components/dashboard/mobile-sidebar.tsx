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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/drawer";
import { Overlay } from "@/components/ui/overlay";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Monitors", href: "/dashboard/monitors", icon: Monitor },
  { name: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Renders a mobile sidebar drawer component.
 *
 * The MobileSidebar component displays a full-height drawer with navigation links, a close button, and a cyberpunk aesthetic. It utilizes the `usePathname` hook to determine the current path and highlight the active navigation link. The sidebar includes a header with a logo and a call-to-action button at the bottom for upgrading the plan.
 *
 * @param {MobileSidebarProps} props - The properties for the MobileSidebar component.
 * @param {boolean} props.isOpen - Indicates whether the sidebar is open.
 * @param {function} props.onClose - Function to call when the sidebar should be closed.
 */
export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <Overlay isOpen={isOpen} onClose={onClose} />
      <Drawer isOpen={isOpen} onClose={onClose} side="left">
        <div className="h-full flex flex-col justify-between p-4 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-size-[2rem_2rem] opacity-20 pointer-events-none"></div>

          <div className="flex flex-col gap-8 relative z-10">
            {/* Header with Logo and Close Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center size-10 border border-primary bg-primary/10 transition-colors group">
                  <Activity className="size-6 text-primary" />
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-1 h-1 bg-primary"></div>
                  <div className="absolute top-0 right-0 w-1 h-1 bg-primary"></div>
                  <div className="absolute bottom-0 left-0 w-1 h-1 bg-primary"></div>
                  <div className="absolute bottom-0 right-0 w-1 h-1 bg-primary"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-foreground text-lg font-bold leading-none font-mono tracking-tighter">
                    Pulse<span className="text-primary">Guard</span>
                  </h1>
                  <p className="text-primary/60 text-[10px] font-mono uppercase tracking-widest mt-1">
                    Pro Protocol
                  </p>
                </div>
              </div>

              {/* Close Button - Touch Friendly */}
              <button
                onClick={onClose}
                className="flex items-center justify-center size-11 border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
                aria-label="Close navigation"
              >
                <X className="size-5 text-primary" />
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
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 transition-all duration-200 font-mono group border border-transparent",
                      isActive
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/10",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-primary",
                      )}
                    />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {item.name}
                    </p>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom CTA */}
          <div className="relative z-10 p-4 rounded-sm border border-primary/20 bg-primary/5 flex flex-col gap-3">
            <p className="text-[10px] text-primary/80 font-mono uppercase">
              System Capacity Low
            </p>
            <button className="w-full bg-primary text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-primary/90 transition-all border border-primary relative overflow-hidden group py-2">
              <span className="relative z-10">Upgrade Plan</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
