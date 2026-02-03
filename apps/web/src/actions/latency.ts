"use server";

import prisma from "@pulseguard/db";



export type LatencyDataPoint = {
  timestamp: string; // ISO string for client serialization
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  p95Latency: number;
};

export async function getMonitorLatencyHistory(
  monitorId: string, 
  timeRange: '24h' = '24h'
): Promise<LatencyDataPoint[]> {
  const now = new Date();
  const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const aggregates = await prisma.latencyAggregate.findMany({
    where: {
      monitorId: monitorId,
      timestamp: {
        gte: past24h,
      },
      granularity: "ONE_MINUTE" // Assuming we want high-res data, fallback to HOURLY if volume is huge
    },
    orderBy: {
      timestamp: "asc",
    },
    select: {
      timestamp: true,
      avgLatency: true,
      minLatency: true,
      maxLatency: true,
      p95Latency: true,
    },
  });

  // Transform for client
  return aggregates.map((agg) => ({
    timestamp: agg.timestamp.toISOString(),
    avgLatency: agg.avgLatency,
    minLatency: agg.minLatency,
    maxLatency: agg.maxLatency,
    p95Latency: agg.p95Latency,
  }));
}
