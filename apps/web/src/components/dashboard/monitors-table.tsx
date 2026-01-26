"use client";

import { Filter, ArrowUpDown, BarChart2, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface MonitorWithEvents {
  id: string;
  name: string;
  url: string;
  status: string;
  events: { status: string; latency: number; timestamp: Date }[];
  interval: number;
}

type SortOption = "name" | "status" | "uptime";
type FilterStatus = "UP" | "DOWN" | "PAUSED" | "MAINTENANCE";

function UptimeBar({ status }: { status: number }) {
  let colorClass = "bg-[#0bda5e]"; // Green
  if (status === 0) colorClass = "bg-[#fa6238]"; // Red
  if (status === -1) colorClass = "bg-[#3b4554]"; // Grey
  if (status === 2) colorClass = "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"; // Maintenance

  const opacityClass = status === 0.5 ? "opacity-50" : "";
  if (status === 0.5)
    return <div className="h-4 w-1 bg-[#0bda5e] rounded-full opacity-50 bg-green-500"></div>;

  return <div className={`h-4 w-1 rounded-full ${colorClass} ${opacityClass}`}></div>;
}

export function MonitorsTable({ monitors: initialMonitors }: { monitors: MonitorWithEvents[] }) {
  const [sort, setSort] = useState<SortOption>("name");
  const [filterStatuses, setFilterStatuses] = useState<FilterStatus[]>([]);

  // Calculate uptime (simple mock calculation for now or derived from events)
  const getUptime = (events: any[]) => {
    if (!events || events.length === 0) return 0;
    const up = events.filter((e) => e.status === "UP").length;
    return Math.round((up / events.length) * 100);
  };

  const getHistory = (events: any[]) => {
    // Events are typically DESC (newest first)
    if (!events) return Array(10).fill(-1);

    // We want the last 10 events, in chronological order (oldest -> newest) for the bar
    // So we take the first 10 (newest), and reverse them so the newest is on the right.
    const history: number[] = events
      .slice(0, 10)
      .map((e) => {
        if (e.status === "MAINTENANCE") return 2;
        return e.status === "UP" ? 1 : 0;
      })
      .reverse();

    // Pad with -1 (grey) on the LEFT if we don't have enough data
    while (history.length < 10) history.unshift(-1);
    return history;
  };

  const getLastResponse = (events: any[]) => {
    if (!events || !events.length) return "—";
    return events[0].latency + "ms";
  };

  // Filter & Sort Logic
  const filteredMonitors = initialMonitors.filter((m) => {
    if (filterStatuses.length === 0) return true;
    return filterStatuses.includes(m.status as FilterStatus);
  });

  const sortedMonitors = [...filteredMonitors].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "status") return a.status.localeCompare(b.status);
    if (sort === "uptime") return getUptime(b.events) - getUptime(a.events);
    return 0;
  });

  const toggleFilter = (status: FilterStatus) => {
    setFilterStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  return (
    <div>
      {/* SectionHeader */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
          Your Monitors
        </h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-primary/10 text-primary text-[10px] font-bold font-mono px-3 py-1.5 rounded-sm hover:bg-primary/20 transition-colors flex items-center gap-1 uppercase tracking-wider border border-primary/20">
                <Filter className="size-3" />
                Filter {filterStatuses.length > 0 && `(${filterStatuses.length})`}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-black/95 border-primary/20 text-primary font-mono text-xs backdrop-blur-md"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="uppercase tracking-widest text-primary/50 text-[10px]">
                  Filter By Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/10" />
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("UP")}
                  onCheckedChange={() => toggleFilter("UP")}
                  className="focus:bg-primary/10 data-[state=checked]:text-foreground"
                >
                  Up
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("DOWN")}
                  onCheckedChange={() => toggleFilter("DOWN")}
                  className="focus:bg-primary/10 data-[state=checked]:text-foreground"
                >
                  Down
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("PAUSED")}
                  onCheckedChange={() => toggleFilter("PAUSED")}
                  className="focus:bg-primary/10 data-[state=checked]:text-foreground"
                >
                  Paused
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("MAINTENANCE")}
                  onCheckedChange={() => toggleFilter("MAINTENANCE")}
                  className="focus:bg-primary/10 data-[state=checked]:text-foreground"
                >
                  Maintenance
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-primary/10 text-primary text-[10px] font-bold font-mono px-3 py-1.5 rounded-sm hover:bg-primary/20 transition-colors flex items-center gap-1 uppercase tracking-wider border border-primary/20">
                <ArrowUpDown className="size-3" />
                Sort: {sort}
              </button>
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

      {/* Table */}
      <div className="border border-primary/20 bg-black/40 backdrop-blur-sm overflow-hidden shadow-lg relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-primary/5 border-b border-primary/20">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Site Name
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Recent Events
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Response
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-primary/70 uppercase tracking-widest font-mono">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {sortedMonitors.map((site) => (
                <tr key={site.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground font-mono">
                        {site.name}
                      </span>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-muted-foreground font-mono hover:underline"
                      >
                        {site.url}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {site.status === "UP" && (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono tracking-wider uppercase">
                        <span className="size-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Up
                      </span>
                    )}
                    {site.status === "DOWN" && (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20 font-mono tracking-wider uppercase">
                        <span className="size-1.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
                        Down
                      </span>
                    )}
                    {site.status === "PAUSED" && (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20 font-mono tracking-wider uppercase">
                        <span className="size-1.5 bg-gray-500"></span>
                        Paused
                      </span>
                    )}
                    {site.status === "MAINTENANCE" && (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono tracking-wider uppercase">
                        <span className="size-1.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                        Maint.
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {getHistory(site.events).map((val, i) => (
                          <UptimeBar key={i} status={val} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-foreground font-mono tracking-tight">
                        {getUptime(site.events)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-sm font-mono font-bold ${
                        site.status === "DOWN" ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {getLastResponse(site.events)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 text-primary/50">
                      <Link
                        href={`/dashboard/monitors/${site.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        <BarChart2 className="size-4" />
                      </Link>
                      <Link
                        href={`/dashboard/monitors/${site.id}/settings`}
                        className="hover:text-primary transition-colors"
                      >
                        <Edit2 className="size-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {sortedMonitors.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-muted-foreground font-mono"
                  >
                    No monitors found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
