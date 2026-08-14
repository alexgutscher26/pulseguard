"use client";

import { getRegionByCode } from "@pulseguard/shared/regions";
import { Activity } from "lucide-react";

interface RegionalUptimeProps {
  events: Array<{
    id: string;
    status: string;
    latency: number;
    region: string | null;
    timestamp: Date;
  }>;
}

export function RegionalUptime({ events }: RegionalUptimeProps) {
  // Group events by region
  const eventsByRegion = events.reduce(
    (acc, event) => {
      const region = event.region || "default";
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(event);
      return acc;
    },
    {} as Record<string, typeof events>,
  );

  // Calculate stats for each region
  const regionalStats = Object.entries(eventsByRegion).map(
    ([regionCode, regionEvents]) => {
      const upEvents = regionEvents.filter((e) => e.status === "UP").length;
      const uptime =
        regionEvents.length > 0 ? (upEvents / regionEvents.length) * 100 : 0;
      const avgLatency =
        regionEvents.length > 0
          ? regionEvents
              .filter((e) => e.status === "UP" && e.latency > 0)
              .reduce((sum, e) => sum + e.latency, 0) /
            regionEvents.filter((e) => e.status === "UP").length
          : 0;

      const region = getRegionByCode(regionCode);

      return {
        code: regionCode,
        name: region?.name || regionCode,
        flag: region?.flag || "🌍",
        uptime: uptime.toFixed(2),
        avgLatency: Math.round(avgLatency),
        totalChecks: regionEvents.length,
      };
    },
  );

  // If no regional data, show message
  if (
    regionalStats.length === 0 ||
    (regionalStats.length === 1 && regionalStats[0].code === "default")
  ) {
    return (
      <div className="border border-cyan-500/20 bg-black/20 backdrop-blur-sm p-6 text-center">
        <Activity className="w-8 h-8 text-cyan-500/40 mx-auto mb-2" />
        <p className="text-sm text-gray-400">
          No regional monitoring configured. Enable multi-region monitoring to
          see uptime by location.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider font-mono">
        Regional Performance
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionalStats
          .filter((stat) => stat.code !== "default")
          .map((stat) => (
            <div
              key={stat.code}
              className="border border-cyan-500/20 bg-black/20 backdrop-blur-sm p-4 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{stat.flag}</span>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                    {stat.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {stat.totalChecks} checks
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                      Uptime
                    </span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        parseFloat(stat.uptime) >= 99
                          ? "text-green-400"
                          : parseFloat(stat.uptime) >= 95
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {stat.uptime}%
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        parseFloat(stat.uptime) >= 99
                          ? "bg-green-500"
                          : parseFloat(stat.uptime) >= 95
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${stat.uptime}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                    Avg Latency
                  </span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {stat.avgLatency}ms
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
