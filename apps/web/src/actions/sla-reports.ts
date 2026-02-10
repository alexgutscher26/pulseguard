"use server";

import prisma from "@pulseguard/db";

export type DailySlaData = {
  date: string;
  uptimePct: number;
  downDuration: number; // in minutes
  checksTotal: number;
  checksUp: number;
  checksDown: number;
};

export type SlaReport = {
  monitorId: string;
  period: string;
  aggregate: {
    uptimePct: number;
    totalDowntimeMinutes: number;
    totalChecks: number;
    totalUp: number;
    totalDown: number;
  };
  dailyBreakdown: DailySlaData[];
};

export async function getSlaReport(
  monitorId: string,
  range: "7d" | "30d" = "7d",
): Promise<SlaReport> {
  const now = new Date();

  // Determine start date (UTC)
  const days = range === "7d" ? 7 : 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  const startUtc = new Date(
    Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
  );

  // 1. Fetch completed days from DailyMonitorSummary
  const history = await prisma.dailyMonitorSummary.findMany({
    where: {
      monitorId,
      date: { gte: startUtc },
    },
    orderBy: { date: "asc" },
  });

  // 2. Calculate "Today" (or partial day since last summary)
  const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  // Check if we already have today in history
  const hasToday = history.some((h) => h.date.getTime() === todayUtc.getTime());

  let todayStats: DailySlaData | null = null;

  if (!hasToday) {
    // Calculate live stats for today
    const events = await prisma.monitorEvent.findMany({
      where: {
        monitorId,
        timestamp: { gte: todayUtc },
      },
      select: { status: true },
    });

    const total = events.length;
    if (total > 0) {
      const ups = events.filter((e) => e.status === "UP").length;
      const downs = events.filter((e) => e.status === "DOWN").length;
      const validTotal = ups + downs;

      const uptimePct = validTotal > 0 ? (ups / validTotal) * 100 : 0;

      // Estimate down duration: assumes ~1 minute per check for now
      // Ideally we'd fetch the monitor interval, but this is a decent approximation for events
      const downDuration = downs;

      todayStats = {
        date: todayUtc.toISOString(),
        uptimePct,
        downDuration,
        checksTotal: validTotal, // Only counting valid checks for stats
        checksUp: ups,
        checksDown: downs,
      };
    } else {
      // No data yet today
      todayStats = {
        date: todayUtc.toISOString(),
        uptimePct: 100, // Optimistic default or 0? Usually 100 if no downtime.
        downDuration: 0,
        checksTotal: 0,
        checksUp: 0,
        checksDown: 0,
      };
    }
  }

  // 3. Merge
  const allDays: DailySlaData[] = history.map((h) => ({
    date: h.date.toISOString(),
    uptimePct: h.uptimePct,
    downDuration: h.downDuration,
    checksTotal: h.checksTotal,
    checksUp: h.checksUp,
    checksDown: h.checksDown,
  }));

  if (todayStats) {
    allDays.push(todayStats);
  }

  // Sort again just in case
  allDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 4. Aggregate
  const totalUp = allDays.reduce((sum, d) => sum + d.checksUp, 0);
  const totalDown = allDays.reduce((sum, d) => sum + d.checksDown, 0);
  const totalDowntime = allDays.reduce((sum, d) => sum + d.downDuration, 0);
  const totalChecks = allDays.reduce((sum, d) => sum + d.checksTotal, 0);

  // Weighted Average Uptime
  // If we have 0 checks, we default to 100% (innocent until proven guilty) or 0%?
  // Usually "No Data" is handled by UI, but here we return 100 if no checksDown.
  const overallUptime = totalUp + totalDown > 0 ? (totalUp / (totalUp + totalDown)) * 100 : 100;

  return {
    monitorId,
    period: range,
    aggregate: {
      uptimePct: overallUptime,
      totalDowntimeMinutes: totalDowntime,
      totalChecks,
      totalUp,
      totalDown,
    },
    dailyBreakdown: allDays,
  };
}
