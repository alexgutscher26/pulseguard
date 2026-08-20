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
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const getUptime = (events: any[]) => {
    if (!events || events.length === 0) return 0;
    const up = events.filter((e) => e.status === "UP").length;
    return Math.round((up / events.length) * 100);
  };

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    monitors.forEach((monitor) => {
      if (monitor.tags) {
        monitor.tags.forEach((t: string) => tags.add(t));
      }
    });
    return Array.from(tags).sort();
  }, [monitors]);

  const filteredMonitors = useMemo(() => {
    const filtered = monitors.filter((monitor) => {
      const matchesSearch =
        monitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        monitor.url.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || monitor.status === statusFilter;

      const matchesTag = !selectedTag || (monitor.tags && monitor.tags.includes(selectedTag));

      return matchesSearch && matchesStatus && matchesTag;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "status") return a.status.localeCompare(b.status);
      if (sort === "uptime") return getUptime(b.events) - getUptime(a.events);
      return 0;
    });
  }, [monitors, searchQuery, statusFilter, sort, selectedTag]);

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
        availableTags={availableTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      <MonitorList monitors={filteredMonitors} />
    </div>
  );
}
