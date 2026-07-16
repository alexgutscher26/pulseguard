/**
 * Simple Baseline Anomaly Logic (No ML needed yet)
 * Phase 1 deployment: Runs as a periodic CRON job (every 5-10 minutes).
 *
 * For each monitor with sufficient history:
 * 1. Computes per-weekday-hour baseline (mean + stddev) from the last 4 weeks
 * 2. Checks recent events against the baseline
 * 3. Creates MonitorInsight records for anomalies (latency > mean + 3*stddev)
 */

import type { PrismaClient } from "@pulseguard/db";

const BASELINE_LOOKBACK_DAYS = 28;
const RECENT_WINDOW_MINUTES = 10;
const MIN_EVENTS_FOR_BASELINE = 10;
const Z_SCORE_THRESHOLD = 3;

interface WeekdayBaseline {
  mean: number;
  stdDev: number;
  count: number;
}

export async function runAnomalyScan(prisma: PrismaClient) {
  const now = new Date();

  console.log("[AnomalyScan] Starting baseline anomaly scan...");

  // 1. Find monitors with enough recent UP events
  const monitorIds = await getMonitorsWithRecentData(prisma, now);
  console.log(`[AnomalyScan] Found ${monitorIds.length} monitors with sufficient data.`);

  let anomaliesFound = 0;

  for (const monitorId of monitorIds) {
    try {
      const found = await scanMonitor(prisma, monitorId, now);
      anomaliesFound += found;
    } catch (err) {
      console.error(`[AnomalyScan] Error scanning monitor ${monitorId}:`, err);
    }
  }

  console.log(`[AnomalyScan] Complete. Found ${anomaliesFound} anomalies across ${monitorIds.length} monitors.`);
  return { monitorsScanned: monitorIds.length, anomaliesFound };
}

async function getMonitorsWithRecentData(prisma: PrismaClient, now: Date): Promise<string[]> {
  const cutoff = new Date(now.getTime() - RECENT_WINDOW_MINUTES * 60 * 1000);

  const result = await prisma.$queryRaw<
    { monitorId: string }[]
  >`
    SELECT me."monitorId"
    FROM "MonitorEvent" me
    JOIN "Monitor" m ON m."id" = me."monitorId"
    WHERE me."timestamp" >= ${cutoff}
      AND me."status" = 'UP'
      AND me."latency" > 0
      AND m."status" IN ('UP', 'DOWN')
    GROUP BY me."monitorId"
    HAVING COUNT(*) >= 3
  `;

  return result.map((r) => r.monitorId);
}

async function scanMonitor(prisma: PrismaClient, monitorId: string, now: Date): Promise<number> {
  // Build weekday-hour baselines from the last 4 weeks
  const baselines = await buildBaselines(prisma, monitorId, now);
  if (Object.keys(baselines).length === 0) return 0;

  // Get recent UP events
  const recentEvents = await getRecentEvents(prisma, monitorId, now);
  if (recentEvents.length === 0) return 0;

  let anomalies = 0;

  for (const event of recentEvents) {
    const eventDate = new Date(event.timestamp);
    const key = weekdayHourKey(eventDate);

    const baseline = baselines[key];
    if (!baseline || baseline.count < MIN_EVENTS_FOR_BASELINE) continue;

    const threshold = baseline.mean + Z_SCORE_THRESHOLD * baseline.stdDev;
    if (event.latency <= threshold) continue;

    const zScore = baseline.stdDev > 0
      ? (event.latency - baseline.mean) / baseline.stdDev
      : event.latency > baseline.mean * 2 ? 99 : 0;

    // Check if we already have a recent anomaly insight for this monitor
    const existingInsight = await prisma.monitorInsight.findFirst({
      where: {
        monitorId,
        type: "ANOMALY" as any,
        dismissed: false,
        createdAt: { gt: new Date(now.getTime() - 5 * 60 * 1000) },
      },
    });

    if (existingInsight) continue;

    const severity = zScore > 5 ? "CRITICAL" as any : "WARNING" as any;
    const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][eventDate.getDay()];
    const hour = eventDate.getHours();

    await prisma.monitorInsight.create({
      data: {
        monitorId,
        type: "ANOMALY" as any,
        severity,
        message: `Baseline Anomaly: Latency ${event.latency}ms on ${dayName} at ${hour}:00 exceeds weekday-hour baseline (mean ${Math.round(baseline.mean)}ms, z-score: ${zScore.toFixed(1)}).`,
        metadata: {
          zScore: Number(zScore.toFixed(2)),
          latency: event.latency,
          baselineMean: Math.round(baseline.mean),
          baselineStdDev: Math.round(baseline.stdDev),
          threshold: Math.round(threshold),
          weekday: eventDate.getDay(),
          hour,
          region: event.region,
          eventId: event.id,
        },
      },
    });

    anomalies++;
    console.log(
      `[AnomalyScan] ANOMALY monitor=${monitorId} latency=${event.latency}ms ` +
      `baseline=${Math.round(baseline.mean)}ms threshold=${Math.round(threshold)}ms z=${zScore.toFixed(1)}`
    );
  }

  return anomalies;
}

async function buildBaselines(
  prisma: PrismaClient,
  monitorId: string,
  now: Date,
): Promise<Record<string, WeekdayBaseline>> {
  const cutoff = new Date(now.getTime() - BASELINE_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  const events = await prisma.monitorEvent.findMany({
    where: {
      monitorId,
      status: "UP",
      latency: { gt: 0 },
      timestamp: { gte: cutoff },
    },
    select: { latency: true, timestamp: true },
    orderBy: { timestamp: "desc" },
  });

  if (events.length < MIN_EVENTS_FOR_BASELINE) return {};

  // Group by weekday + hour
  const buckets: Record<string, number[]> = {};
  for (const event of events) {
    const key = weekdayHourKey(event.timestamp);
    if (!buckets[key]) buckets[key] = [];
    buckets[key].push(event.latency);
  }

  const baselines: Record<string, WeekdayBaseline> = {};
  for (const [key, latencies] of Object.entries(buckets)) {
    if (latencies.length < MIN_EVENTS_FOR_BASELINE) continue;

    const n = latencies.length;
    const mean = latencies.reduce((a, b) => a + b, 0) / n;
    const variance = latencies.map((x) => (x - mean) ** 2).reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(variance);

    baselines[key] = { mean, stdDev, count: n };
  }

  return baselines;
}

async function getRecentEvents(
  prisma: PrismaClient,
  monitorId: string,
  now: Date,
): Promise<{ id: string; latency: number; timestamp: Date; region: string | null }[]> {
  const cutoff = new Date(now.getTime() - RECENT_WINDOW_MINUTES * 60 * 1000);

  return prisma.monitorEvent.findMany({
    where: {
      monitorId,
      status: "UP",
      latency: { gt: 0 },
      timestamp: { gte: cutoff },
    },
    select: { id: true, latency: true, timestamp: true, region: true },
    orderBy: { timestamp: "desc" },
  });
}

function weekdayHourKey(date: Date): string {
  return `${date.getUTCDay()}-${date.getUTCHours()}`;
}
