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
  let colorClass = "bg-emerald-500"; // Green
  if (status === 0) colorClass = "bg-red-500"; // Red
  if (status === -1) colorClass = "bg-muted"; // Grey (Theme aware)
  if (status === 2) colorClass = "bg-amber-500"; // Maintenance

  const opacityClass = status === 0.5 ? "opacity-50" : "";
  if (status === 0.5)
    return <div className="h-4.5 w-1 bg-emerald-500 rounded-full opacity-50"></div>;

  return <div className={`h-4.5 w-1 rounded-full ${colorClass} ${opacityClass}`}></div>;
}

/**
 * Converts events into a visual history array for the uptime bar
 */
function getHistory(events: { status: string; latency: number; timestamp: Date }[]): number[] {
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
function getLastResponse(events: { latency: number; status: string }[]): string {
  if (events.length === 0) return "N/A";
  const sorted = [...events].sort(
    (a, b) => new Date((b as any).timestamp).getTime() - new Date((a as any).timestamp).getTime(),
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
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  const sortedMonitors = useMemo(() => {
    let filtered = monitors;

    // Apply filters
    if (filterStatuses.length > 0) {
      filtered = monitors.filter((m) => filterStatuses.includes(m.status as FilterStatus));
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
        return parseFloat(getUptime(b.events)) - parseFloat(getUptime(a.events));
      }
      return 0;
    });
  }, [monitors, sort, filterStatuses]);

  return (
    <div>
      {/* SectionHeader */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Your Monitors
        </h2>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-card text-foreground text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2 border border-border outline-none cursor-pointer">
              <Filter className="size-3.5" />
              Filter {filterStatuses.length > 0 && `(${filterStatuses.length})`}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-popover border border-border text-foreground rounded-xl p-1 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Filter By Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("UP")}
                  onCheckedChange={() => toggleFilter("UP")}
                  className="focus:bg-accent focus:text-foreground cursor-pointer rounded-lg text-xs font-semibold px-2 py-1.5"
                >
                  Up
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("DOWN")}
                  onCheckedChange={() => toggleFilter("DOWN")}
                  className="focus:bg-accent focus:text-foreground cursor-pointer rounded-lg text-xs font-semibold px-2 py-1.5"
                >
                  Down
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("PAUSED")}
                  onCheckedChange={() => toggleFilter("PAUSED")}
                  className="focus:bg-accent focus:text-foreground cursor-pointer rounded-lg text-xs font-semibold px-2 py-1.5"
                >
                  Paused
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterStatuses.includes("MAINTENANCE")}
                  onCheckedChange={() => toggleFilter("MAINTENANCE")}
                  className="focus:bg-accent focus:text-foreground cursor-pointer rounded-lg text-xs font-semibold px-2 py-1.5"
                >
                  Maintenance
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="bg-card text-foreground text-xs font-bold px-3.5 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2 border border-border outline-none cursor-pointer">
              <ArrowUpDown className="size-3.5" />
              Sort: {sort}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-popover border border-border text-foreground rounded-xl p-1 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Sort Order
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60" />
                <DropdownMenuItem
                  onClick={() => setSort("name")}
                  className="focus:bg-accent focus:text-foreground cursor-pointer rounded-lg text-xs font-semibold px-2 py-1.5"
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSort("status")}
                  className="focus:bg-accent focus:text-foreground cursor-pointer rounded-lg text-xs font-semibold px-2 py-1.5"
                >
                  Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSort("uptime")}
                  className="focus:bg-accent focus:text-foreground cursor-pointer rounded-lg text-xs font-semibold px-2 py-1.5"
                >
                  Uptime (High-Low)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border bg-card rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-accent/40 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Site Name
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Recent Events
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Response
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedMonitors.map((site) => (
                <tr key={site.id} className="hover:bg-accent/30 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{site.name}</span>
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-muted-foreground hover:text-foreground hover:underline transition-colors mt-0.5"
                      >
                        {site.url}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {site.status === "UP" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/10">
                        <span className="size-1 bg-emerald-500 rounded-full animate-pulse"></span>
                        Up
                      </span>
                    )}
                    {site.status === "DOWN" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 rounded-full border border-red-500/10">
                        <span className="size-1 bg-red-500 rounded-full animate-pulse"></span>
                        Down
                      </span>
                    )}
                    {site.status === "PAUSED" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-400 rounded-full border border-gray-500/10">
                        <span className="size-1 bg-gray-400 rounded-full"></span>
                        Paused
                      </span>
                    )}
                    {site.status === "MAINTENANCE" && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/10">
                        <span className="size-1 bg-amber-500 rounded-full"></span>
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
                      <span className="text-xs font-bold text-foreground tracking-tight">
                        {getUptime(site.events)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`text-xs font-bold ${
                        site.status === "DOWN" ? "text-red-500" : "text-muted-foreground"
                      }`}
                    >
                      {getLastResponse(site.events)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 text-muted-foreground">
                      <Link
                        href={`/dashboard/monitors/${site.id}`}
                        className="hover:text-foreground transition-colors p-1"
                      >
                        <BarChart2 className="size-4" />
                      </Link>
                      <Link
                        href={`/dashboard/monitors/${site.id}/settings`}
                        className="hover:text-foreground transition-colors p-1"
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
                    className="px-6 py-10 text-center text-muted-foreground text-xs font-semibold"
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
