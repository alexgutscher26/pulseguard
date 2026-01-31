"use client";

import { useState, useMemo } from "react";
import { MonitorStats } from "@/components/monitors/monitor-stats";
import { MonitorFilters } from "@/components/monitors/monitor-filters";
import { MonitorList } from "@/components/monitors/monitor-list";
import { useMonitors } from "@/hooks/use-monitors";

interface MonitorManagerProps {
  initialMonitors: any[];
}

export function MonitorManager({ initialMonitors }: MonitorManagerProps) {
  const { data: monitors } = useMonitors(initialMonitors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sort, setSort] = useState("name");

  const getUptime = (events: any[]) => {
    if (!events || events.length === 0) return 0;
    const up = events.filter((e) => e.status === "UP").length;
    return Math.round((up / events.length) * 100);
  };

  const filteredMonitors = useMemo(() => {
    const filtered = monitors.filter((monitor) => {
      const matchesSearch =
        monitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monitor.url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || monitor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "status") return a.status.localeCompare(b.status);
      if (sort === "uptime") return getUptime(b.events) - getUptime(a.events);
      return 0;
    });
  }, [monitors, searchQuery, statusFilter, sort]);

  return (
    <div className="flex flex-col gap-6">
      <MonitorStats monitors={monitors} />
      <MonitorFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sort={sort}
        setSort={setSort}
      />
      <MonitorList monitors={filteredMonitors} />
    </div>
  );
}
