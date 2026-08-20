"use client";

import { useQuery } from "@tanstack/react-query";
import { getMonitors, getDashboardStats } from "@/actions/monitors";

/**
 * Manages monitor checks and updates using a query.
 *
 * This function utilizes the useQuery hook to fetch monitor data and sets up an effect to check for stale monitors.
 * It checks each monitor's last check time against its interval, and if a monitor is deemed stale, it triggers a check
 * using the checkMonitor function. The function also manages a reference to track which monitors have been checked
 * recently to avoid redundant checks.
 *
 * @param {any[]} initialMonitors - The initial list of monitors to be used before the query fetches data.
 */
export function useMonitors(initialMonitors: any[], isDemo = false) {
  const query = useQuery({
    queryKey: isDemo ? ["demo-monitors"] : ["monitors"],
    queryFn: async () => await getMonitors(),
    initialData: initialMonitors,
    enabled: !isDemo,
    refetchInterval: isDemo ? false : 5000,
    refetchOnWindowFocus: !isDemo,
  });

  return query;
}

export function useDashboardStats(initialStats: any, isDemo = false) {
  return useQuery({
    queryKey: isDemo ? ["demo-dashboard-stats"] : ["dashboard-stats"],
    queryFn: async () => await getDashboardStats(),
    initialData: initialStats,
    enabled: !isDemo,
    refetchInterval: isDemo ? false : 5000,
    refetchOnWindowFocus: !isDemo,
  });
}
