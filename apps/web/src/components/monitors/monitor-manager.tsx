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

  const filteredMonitors = useMemo(() => {
    return monitors.filter((monitor) => {
      const matchesSearch =
        monitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monitor.url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || monitor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [monitors, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      <MonitorStats monitors={monitors} />
      <MonitorFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <MonitorList monitors={filteredMonitors} />
    </div>
  );
}
