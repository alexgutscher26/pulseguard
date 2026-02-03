"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MonitorFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  sort: string;
  setSort: (s: string) => void;
}

export function MonitorFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sort,
  setSort,
}: MonitorFiltersProps) {
  const tabs = [
    { label: "All", value: "ALL" },
    { label: "Up", value: "UP" },
    { label: "Down", value: "DOWN" },
    { label: "Paused", value: "PAUSED" },
    { label: "Maint.", value: "MAINTENANCE" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 border border-primary/20 p-3">
      {/* LEFT: Search */}
      <div className="relative group w-full md:w-auto">
        <Search className="absolute left-3 top-2.5 text-primary/50 size-4 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH_MONITORS..."
          className="bg-primary/5 border border-primary/20 pl-10 pr-4 py-2 w-full md:w-64 text-xs font-mono text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/60 transition-all rounded-sm"
        />
      </div>

      {/* RIGHT: Tabs + Divider + Actions */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider transition-all whitespace-nowrap font-mono rounded-sm border cursor-pointer",
                statusFilter === tab.value
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-primary/50 border-transparent hover:border-primary/20 hover:text-primary",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block h-8 w-px bg-primary/20"></div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-primary/60 hover:text-primary border border-primary/10 hover:border-primary/30 text-[10px] uppercase font-bold transition-all font-mono rounded-sm cursor-pointer">
            <Filter className="size-3" /> Tags
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 text-primary/60 hover:text-primary border border-primary/10 hover:border-primary/30 text-[10px] uppercase font-bold transition-all font-mono rounded-sm outline-none cursor-pointer">
              <ArrowUpDown className="size-3" />
              Sort: {sort}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-black/95 border-primary/20 text-primary font-mono text-xs backdrop-blur-md"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="uppercase tracking-widest text-primary/50 text-[10px]">
                  Sort Order
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuItem
                  onClick={() => setSort("name")}
                  className="focus:bg-primary/10 cursor-pointer"
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSort("status")}
                  className="focus:bg-primary/10 cursor-pointer"
                >
                  Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSort("uptime")}
                  className="focus:bg-primary/10 cursor-pointer"
                >
                  Uptime (High-Low)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
