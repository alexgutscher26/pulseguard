"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";

export function MonitorFilters() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/40 border border-primary/20 p-3">
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <div className="relative group flex-1 md:flex-none">
          <Search className="absolute left-3 top-2.5 text-primary/50 size-4 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="SEARCH_MONITOR_ID..."
            className="bg-primary/5 border border-primary/20 pl-10 pr-4 py-2 w-full md:w-64 text-xs font-mono text-primary placeholder:text-primary/30 focus:outline-none focus:border-primary/60 transition-all rounded-sm"
          />
        </div>
        <div className="hidden md:block h-8 w-[1px] bg-primary/20 mx-2"></div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-bold tracking-wider hover:bg-primary/20 transition-all whitespace-nowrap font-mono rounded-sm">
            All
            </button>
            <button className="px-3 py-1.5 text-primary/50 border border-transparent hover:border-primary/20 text-[10px] uppercase font-bold tracking-wider hover:text-primary transition-all whitespace-nowrap font-mono rounded-sm">
            Up
            </button>
            <button className="px-3 py-1.5 text-primary/50 border border-transparent hover:border-primary/20 text-[10px] uppercase font-bold tracking-wider hover:text-primary transition-all whitespace-nowrap font-mono rounded-sm">
            Down
            </button>
            <button className="px-3 py-1.5 text-primary/50 border border-transparent hover:border-primary/20 text-[10px] uppercase font-bold tracking-wider hover:text-primary transition-all whitespace-nowrap font-mono rounded-sm">
            Paused
            </button>
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
