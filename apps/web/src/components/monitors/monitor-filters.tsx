"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonitorFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}

export function MonitorFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: MonitorFiltersProps) {
  const tabs = [
    { label: "All", value: "ALL" },
    { label: "Up", value: "UP" },
    { label: "Down", value: "DOWN" },
    { label: "Paused", value: "PAUSED" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 border border-primary/20 p-3">
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <div className="relative group flex-1 md:flex-none">
          <Search className="absolute left-3 top-2.5 text-primary/50 size-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_MONITORS..."
            className="bg-primary/5 border border-primary/20 pl-10 pr-4 py-2 w-full md:w-64 text-xs font-mono text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/60 transition-all rounded-sm"
          />
        </div>
        <div className="hidden md:block h-8 w-px bg-primary/20 mx-2"></div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap font-mono rounded-sm border",
                statusFilter === tab.value
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-primary/50 border-transparent hover:border-primary/20 hover:text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <button className="flex items-center gap-2 px-3 py-1.5 text-primary/60 hover:text-primary border border-primary/10 hover:border-primary/30 text-[10px] uppercase font-bold transition-all font-mono rounded-sm">
          <Filter className="size-3" /> Tags
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-primary/60 hover:text-primary border border-primary/10 hover:border-primary/30 text-[10px] uppercase font-bold transition-all font-mono rounded-sm">
          <ArrowUpDown className="size-3" /> Sort
        </button>
      </div>
    </div>
  );
}
