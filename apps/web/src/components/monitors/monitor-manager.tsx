"use client";

import { useState, useMemo } from "react";
import { MonitorStats } from "@/components/monitors/monitor-stats";
import { MonitorFilters } from "@/components/monitors/monitor-filters";
import { MonitorList } from "@/components/monitors/monitor-list";

interface MonitorManagerProps {
  initialMonitors: any[];
}

export function MonitorManager({ initialMonitors }: MonitorManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredMonitors = useMemo(() => {
    return initialMonitors.filter((monitor) => {
      const matchesSearch =
        monitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monitor.url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || monitor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [initialMonitors, searchQuery, statusFilter]);

  return (
    <div className="flex flex-col gap-6">
      <MonitorStats monitors={initialMonitors} />
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
