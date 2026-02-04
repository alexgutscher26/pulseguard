import { getPrisma, MonitorStatus } from "@pulseguard/db";

interface Env {
  DATABASE_URL: string;
}

/**
 * Downsample 1-minute aggregates to 5-minute aggregates
 */
async function downsample1mTo5m(prisma: any): Promise<void> {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  // Get all 1-minute aggregates from the last 5 minutes
  const oneMinAggregates = await prisma.latencyAggregate.findMany({
    where: {
      granularity: "ONE_MINUTE",
      timestamp: {
        gte: tenMinutesAgo,
        lt: fiveMinutesAgo,
      },
    },
  });

  // Group by monitor + region
  const grouped = new Map<string, any[]>();
  for (const agg of oneMinAggregates) {
    const key = `${agg.monitorId}:${agg.region}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(agg);
  }

  // Create 5-minute aggregates
  const fiveMinAggregates = [];
  for (const [key, aggregates] of grouped.entries()) {
    const [monitorId, region] = key.split(":");
    
    // Calculate weighted averages
    const totalSamples = aggregates.reduce((sum, a) => sum + a.sampleCount, 0);
    if (totalSamples === 0) continue;

    const avgLatency = aggregates.reduce((sum, a) => sum + a.avgLatency * a.sampleCount, 0) / totalSamples;
    const minLatency = Math.min(...aggregates.map(a => a.minLatency));
    const maxLatency = Math.max(...aggregates.map(a => a.maxLatency));
    const p50Latency = aggregates.reduce((sum, a) => sum + a.p50Latency * a.sampleCount, 0) / totalSamples;
    const p95Latency = aggregates.reduce((sum, a) => sum + a.p95Latency * a.sampleCount, 0) / totalSamples;
    const p99Latency = aggregates.reduce((sum, a) => sum + a.p99Latency * a.sampleCount, 0) / totalSamples;
    const successRate = aggregates.reduce((sum, a) => sum + a.successRate * a.sampleCount, 0) / totalSamples;

    // Round timestamp to 5-minute boundary
    const timestamp = new Date(Math.floor(fiveMinutesAgo.getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000));

    fiveMinAggregates.push({
      monitorId,
      region,
      timestamp,
      granularity: "FIVE_MINUTE",
      avgLatency,
      minLatency,
      maxLatency,
      p50Latency,
      p95Latency,
      p99Latency,
      sampleCount: totalSamples,
      successRate,
    });
  }

  if (fiveMinAggregates.length > 0) {
    await prisma.latencyAggregate.createMany({
      data: fiveMinAggregates,
    });
    console.log(`[Downsampling] Created ${fiveMinAggregates.length} 5-minute aggregates`);
  }
}

/**
 * Downsample 5-minute aggregates to hourly aggregates
 */
async function downsample5mTo1h(prisma: any): Promise<void> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

  // Get all 5-minute aggregates from the last hour
  const fiveMinAggregates = await prisma.latencyAggregate.findMany({
    where: {
      granularity: "FIVE_MINUTE",
      timestamp: {
        gte: twoHoursAgo,
        lt: oneHourAgo,
      },
    },
  });

  // Group by monitor + region
  const grouped = new Map<string, any[]>();
  for (const agg of fiveMinAggregates) {
    const key = `${agg.monitorId}:${agg.region}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(agg);
  }

  // Create hourly aggregates
  const hourlyAggregates = [];
  for (const [key, aggregates] of grouped.entries()) {
    const [monitorId, region] = key.split(":");
    
    const totalSamples = aggregates.reduce((sum, a) => sum + a.sampleCount, 0);
    if (totalSamples === 0) continue;

    const avgLatency = aggregates.reduce((sum, a) => sum + a.avgLatency * a.sampleCount, 0) / totalSamples;
    const minLatency = Math.min(...aggregates.map(a => a.minLatency));
    const maxLatency = Math.max(...aggregates.map(a => a.maxLatency));
    const p50Latency = aggregates.reduce((sum, a) => sum + a.p50Latency * a.sampleCount, 0) / totalSamples;
    const p95Latency = aggregates.reduce((sum, a) => sum + a.p95Latency * a.sampleCount, 0) / totalSamples;
    const p99Latency = aggregates.reduce((sum, a) => sum + a.p99Latency * a.sampleCount, 0) / totalSamples;
    const successRate = aggregates.reduce((sum, a) => sum + a.successRate * a.sampleCount, 0) / totalSamples;

    // Round timestamp to hour boundary
    const timestamp = new Date(Math.floor(oneHourAgo.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000));

    hourlyAggregates.push({
      monitorId,
      region,
      timestamp,
      granularity: "ONE_HOUR",
      avgLatency,
      minLatency,
      maxLatency,
      p50Latency,
      p95Latency,
      p99Latency,
      sampleCount: totalSamples,
      successRate,
    });
  }

  if (hourlyAggregates.length > 0) {
    await prisma.latencyAggregate.createMany({
      data: hourlyAggregates,
    });
    console.log(`[Downsampling] Created ${hourlyAggregates.length} hourly aggregates`);
  }
}

/**
 * Cleanup old 1-minute data (older than 7 days) and 5-minute data (older than 30 days)
 * NOTE: This is for LatencyAggregate, not MonitorEvent.
 */
async function cleanupOldData(prisma: any): Promise<void> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const result = await prisma.latencyAggregate.deleteMany({
    where: {
      granularity: "ONE_MINUTE",
      timestamp: {
        lt: sevenDaysAgo,
      },
    },
  });

  if (result.count > 0) {
    console.log(`[Cleanup] Deleted ${result.count} old 1-minute aggregates`);
  }

  // Cleanup old 5-minute data (older than 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const fiveMinResult = await prisma.latencyAggregate.deleteMany({
    where: {
      granularity: "FIVE_MINUTE",
      timestamp: {
        lt: thirtyDaysAgo,
      },
    },
  });

  if (fiveMinResult.count > 0) {
    console.log(`[Cleanup] Deleted ${fiveMinResult.count} old 5-minute aggregates`);
  }
}

/**
 * Summarize raw MonitorEvents into DailyMonitorSummary for data older than 7 days.
 */
async function summarizeDailyEvents(prisma: any): Promise<void> {
  const now = new Date();
  const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  
  // Target: The specific calendar day that ended 7 days ago.
  // Example: Today is Day 8. 7 days ago (end of retention) was Day 1.
  // We summarize Day 0 (8 days ago) to be safe and ensuring it's fully complete.
  const startOfDay = new Date(utcNow.getTime() - 8 * 24 * 60 * 60 * 1000);
  const endOfDay = new Date(utcNow.getTime() - 7 * 24 * 60 * 60 * 1000);

  console.log(`[Summarize] Processing day: ${startOfDay.toISOString().split('T')[0]}`);

  // Fetch all monitors
  const monitors = await prisma.monitor.findMany({ select: { id: true } });

  for (const monitor of monitors) {
    // Check if summary already exists
    const existing = await prisma.dailyMonitorSummary.findUnique({
        where: {
            monitorId_date: {
                monitorId: monitor.id,
                date: startOfDay
            }
        }
    });

    if (existing) continue;

    // 1. Get total checks
    const totalChecks = await prisma.monitorEvent.count({
        where: {
            monitorId: monitor.id,
            timestamp: { gte: startOfDay, lt: endOfDay }
        }
    });

    if (totalChecks === 0) continue;

    // 2. Get status counts
    const statusCounts = await prisma.monitorEvent.groupBy({
        by: ['status'],
        where: {
            monitorId: monitor.id,
            timestamp: { gte: startOfDay, lt: endOfDay }
        },
        _count: true
    });

    let checksUp = 0;
    let checksDown = 0;
    
    for (const s of statusCounts) {
        if (s.status === 'UP') checksUp += s._count;
        if (s.status === 'DOWN') checksDown += s._count; 
    }

    // 3. Avg Latency
    const latencyAgg = await prisma.monitorEvent.aggregate({
        where: {
            monitorId: monitor.id,
            timestamp: { gte: startOfDay, lt: endOfDay }
        },
        _avg: { latency: true }
    });

    const avgLatency = Math.round(latencyAgg._avg.latency || 0);

    const totalValid = checksUp + checksDown;
    const uptimePct = totalValid > 0 ? (checksUp / totalValid) * 100 : 0;
    
    const minutesInDay = 24 * 60;
    const downDuration = Math.round((checksDown / totalChecks) * minutesInDay);

    await prisma.dailyMonitorSummary.create({
        data: {
            monitorId: monitor.id,
            date: startOfDay,
            uptimePct,
            avgLatency,
            checksTotal: totalChecks,
            checksUp,
            checksDown,
            downDuration
        }
    });
  }
  console.log(`[Summarize] Completed summary for ${monitors.length} monitors.`);
}

/**
 * Cleanup raw MonitorEvent rows older than 7 days.
 */
async function cleanupRawMonitorEvents(prisma: any): Promise<void> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // We assume summarization ran for '8 days ago'.
    // So '7 days ago' and older is safe to delete.
    const result = await prisma.monitorEvent.deleteMany({
        where: {
            timestamp: { lt: sevenDaysAgo }
        }
    });

    if (result.count > 0) {
        console.log(`[Cleanup] Deleted ${result.count} raw monitor events > 7 days old`);
    }
}

/**
 * Scheduled handler
 */
export default {
  async scheduled(event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    const prisma = getPrisma(env.DATABASE_URL);
    const cron = event.cron;

    try {
      // Every 5 minutes: 1m → 5m downsampling
      if (cron === "*/5 * * * *") {
        console.log("[Downsampling] Running 1m → 5m downsampling");
        await downsample1mTo5m(prisma);
      }

      // Every hour: 5m → 1h downsampling + cleanup
      if (cron === "0 * * * *") {
        console.log("[Downsampling] Running 5m → 1h downsampling");
        await downsample5mTo1h(prisma);
        
        console.log("[Downsampling] Running aggregate cleanup");
        await cleanupOldData(prisma);
      }

      // Daily: Summary + Raw Event Cleanup
      if (cron === "0 0 * * *") {
        console.log("[Aggregator] Running Daily Summary");
        await summarizeDailyEvents(prisma);

        console.log("[Aggregator] Running Raw Event Cleanup");
        await cleanupRawMonitorEvents(prisma);
      }

    } catch (error) {
      console.error("[Downsampling] Error:", error);
    }
  },
};
