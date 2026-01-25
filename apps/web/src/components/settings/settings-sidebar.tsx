"use client";

import { User, Shield, Key } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { name: "General", icon: User, href: "#", active: true },
  { name: "Security", icon: Shield, href: "#", active: false },
  { name: "API Keys", icon: Key, href: "#", active: false },
];

export function SettingsSidebar() {
  return (
    <aside className="w-full md:w-48 flex-shrink-0">
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-sm transition-all font-mono text-sm uppercase tracking-wider",
              item.active
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-primary/60 hover:bg-primary/5 hover:text-primary hover:border-primary/10 border border-transparent"
            )}
          >
            <item.icon className="size-4" />
            <span className="font-bold">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
