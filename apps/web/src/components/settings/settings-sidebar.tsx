"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Shield,
  Key,
  Download,
  Eye,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { name: "General", icon: User, tab: "general" },
  { name: "Billing", icon: CreditCard, tab: "billing" },
  // { name: "Affiliate & Referrals", icon: Users, tab: "referrals" },
  { name: "Security", icon: Shield, tab: "security" },
  { name: "API Keys", icon: Key, tab: "api-keys" },
  { name: "Migration & Export", icon: Download, tab: "migration" },
  { name: "Privacy", icon: Eye, tab: "privacy" },
];

/**
 * Renders the settings sidebar with collapsible navigation links based on the current tab.
 */
export function SettingsSidebar() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab") || "general";
  const currentTab = rawTab.split("?")[0].split("&")[0];
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Restore saved collapse preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pulseguard_settings_sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("pulseguard_settings_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "w-full shrink-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "md:w-16" : "md:w-52",
      )}
    >
      <div className="flex flex-col gap-2">
        {/* Toggle Collapse Header */}
        <div
          className={cn(
            "hidden md:flex items-center pb-2 border-b border-slate-800/80 mb-1",
            isCollapsed ? "justify-center" : "justify-between px-3",
          )}
        >
          {!isCollapsed && (
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Settings
            </span>
          )}
          <button
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {items.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <Link
                key={item.name}
                href={`/dashboard/settings?tab=${item.tab}`}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all font-mono text-sm uppercase tracking-wider shrink-0",
                  isCollapsed ? "md:justify-center md:px-2" : "",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border-slate-700/50 border border-transparent",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!isCollapsed && <span className="font-bold truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
