"use client";

import { useQuery } from "@tanstack/react-query";
import { getMonitors, getDashboardStats, checkMonitor } from "@/actions/monitors";
import { useEffect, useRef } from "react";

export function useMonitors(initialMonitors: any[]) {
  const query = useQuery({
    queryKey: ["monitors"],
    queryFn: () => getMonitors(),
    initialData: initialMonitors,
    refetchInterval: 5000, 
    refetchOnWindowFocus: true,
  });

  const checkedRef = useRef<Set<string>>(new Set());

  // Auto-check stale monitors (helper for when cron is not running/slow)
  useEffect(() => {
    if (!query.data) return;

    query.data.forEach((monitor: any) => {
      const lastCheck = monitor.lastCheck ? new Date(monitor.lastCheck).getTime() : 0;
      const intervalMs = (monitor.interval || 60) * 1000;
      // Allow 15s grace period over interval
      const isStale = Date.now() - lastCheck > intervalMs + 15000;

      if (isStale && !checkedRef.current.has(monitor.id)) {
        console.log(`Monitor ${monitor.name} is stale. Triggering check...`);
        checkedRef.current.add(monitor.id);
        
        checkMonitor(monitor.id).then(() => {
           // Remove from checked set after a delay to allow re-check if it fails again later
           setTimeout(() => {
              if (checkedRef.current) checkedRef.current.delete(monitor.id);
           }, 30000); 
        });
      }
    });
  }, [query.data]);

  return query;
}

export function useDashboardStats(initialStats: any) {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => getDashboardStats(),
    initialData: initialStats,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
}
