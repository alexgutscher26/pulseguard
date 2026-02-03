"use client";

import { Filter, ArrowUpDown, BarChart2, Edit2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
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

/**
 * Renders a visual representation of uptime status as a bar.
 */
function UptimeBar({ status }: { status: number }) {
  let colorClass = "bg-[#0bda5e]"; // Green
  if (status === 0) colorClass = "bg-[#fa6238]"; // Red
  if (status === -1) colorClass = "bg-[#3b4554]"; // Grey
  if (status === 2)
    colorClass = "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"; // Maintenance

  const opacityClass = status === 0.5 ? "opacity-50" : "";
  if (status === 0.5)
    return (
      <div className="h-4 w-1 bg-[#0bda5e] rounded-full opacity-50 bg-green-500"></div>
    );

  return (
    <div className={`h-4 w-1 rounded-full ${colorClass} ${opacityClass}`}></div>
  );
}

/**
 * Converts events into a visual history array for the uptime bar
 */
function getHistory(
  events: { status: string; latency: number; timestamp: Date }[],
): number[] {
  const history: number[] = [];
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  for (let i = 0; i < Math.min(20, sorted.length); i++) {
    const event = sorted[i];
    if (event.status === "UP") {
      history.push(1);
    } else if (event.status === "DOWN") {
      history.push(0);
    } else if (event.status === "MAINTENANCE") {
      history.push(2);
    } else {
      history.push(-1);
    }
  }

  // Pad with grey if not enough events
  while (history.length < 20) {
    history.push(-1);
  }

  return history.reverse();
}

/**
 * Calculate uptime percentage from events
 */
function getUptime(events: { status: string }[]): string {
  if (events.length === 0) return "100.0";
  const upCount = events.filter((e) => e.status === "UP").length;
  return ((upCount / events.length) * 100).toFixed(1);
}

/**
 * Get last response time from events
 */
function getLastResponse(
  events: { latency: number; status: string }[],
): string {
  if (events.length === 0) return "N/A";
  const sorted = [...events].sort(
    (a, b) =>
      new Date((b as any).timestamp).getTime() -
      new Date((a as any).timestamp).getTime(),
  );
  const latest = sorted[0];
  if (latest.status === "DOWN") return "Error";
  return `${latest.latency}ms`;
}

interface MonitorsTableProps {
  monitors: MonitorWithEvents[];
}

/**
 * Renders a table displaying the status of monitors.
 */
export function MonitorsTable({ monitors }: MonitorsTableProps) {
  const [sort, setSort] = useState<SortOption>("name");
  const [filterStatuses, setFilterStatuses] = useState<FilterStatus[]>([]);

  const toggleFilter = (status: FilterStatus) => {
    setFilterStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const sortedMonitors = useMemo(() => {
    let filtered = monitors;

    // Apply filters
    if (filterStatuses.length > 0) {
      filtered = monitors.filter((m) =>
        filterStatuses.includes(m.status as FilterStatus),
      );
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sort === "status") {
        const statusOrder = { DOWN: 0, MAINTENANCE: 1, PAUSED: 2, UP: 3 };
        return (
          (statusOrder[a.status as keyof typeof statusOrder] || 0) -
          (statusOrder[b.status as keyof typeof statusOrder] || 0)
        );
      }
      if (sort === "uptime") {
        return (
          parseFloat(getUptime(b.events)) - parseFloat(getUptime(a.events))
        );
      }
      return 0;
    });
  }, [monitors, sort, filterStatuses]);

  return (
    <div>
      {/* SectionHeader */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-lg font-bold text-foreground font-mono uppercase tracking-tight">
          Your Monitors
        </h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-primary/10 text-primary text-[10px] font-bold font-mono px-3 py-1.5 rounded-sm hover:bg-primary/20 transition-colors flex items-center gap-1 uppercase tracking-wider border border-primary/20">
              <Filter className="size-3" />
              Filter {filterStatuses.length > 0 && `(${filterStatuses.length})`}
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
            <DropdownMenuTrigger className="bg-primary/10 text-primary text-[10px] font-bold font-mono px-3 py-1.5 rounded-sm hover:bg-primary/20 transition-colors flex items-center gap-1 uppercase tracking-wider border border-primary/20">
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
                <tr
                  key={site.id}
                  className="hover:bg-primary/5 transition-colors group"
                >
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
                        site.status === "DOWN"
                          ? "text-red-500"
                          : "text-muted-foreground"
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
