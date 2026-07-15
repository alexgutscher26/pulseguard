"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { User, Shield, Key, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { name: "General", icon: User, tab: "general" },
  { name: "Security", icon: Shield, tab: "security" },
  { name: "API Keys", icon: Key, tab: "api-keys" },
  { name: "Migration & Export", icon: Download, tab: "migration" },
];

/**
 * Renders the settings sidebar with navigation links based on the current tab.
 */
export function SettingsSidebar() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "general";

  return (
    <aside className="w-full md:w-48 shrink-0">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.name}
            href={`/dashboard/settings?tab=${item.tab}`}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-sm transition-all font-mono text-sm uppercase tracking-wider",
              currentTab === item.tab
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-primary/60 hover:bg-primary/5 hover:text-primary hover:border-primary/10 border border-transparent",
            )}
          >
            <item.icon className="size-4" />
            <span className="font-bold">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
