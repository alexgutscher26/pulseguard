import { PrismaClient } from "@prisma/client";

export interface MonthlyStats {
  globalUptime: number;
  totalIncidents: number;
  avgResponseTime: number;
  criticalEvents: {
    id: string;
    monitorName: string;
    description: string;
    duration: string;
    date: string;
  }[];
  startDate: Date;
  endDate: Date;
}

export async function getMonthlyStats(prisma: any, monthOffset = 1): Promise<MonthlyStats> {
  // 1. Calculate Date Range (Previous Month)
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 0); // Last day of prev month

  // 2. Fetch Incidents
  const incidents = await prisma.incident.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      monitor: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Aggregate Stats
  const totalIncidents = incidents.length;

  // 4. Calculate Global Uptime
  // Strategy: Average of all Monitor Daily Summaries for the month
  // Note: This relies on the DailySummary table being populated. 
  // If not, we fall back to raw event calculation (expensive).
  // Assuming DailySummary exists or we approximate from MonitorEvents.
  
  // Option A: Raw Events (Heavy for Worker, but accurate)
  // Option B: Monitor current uptime (Not historical)
  // Option C: DailySummary (Recommended)
  
  // Let's us DailySummary if available, else raw events count.
  // Checking schema... Assuming DailySummary exists as per previous conversations.
  
  // Just in case, let's use a simplified "Total Checks vs Total Failures" from MonitorEvent
  // This is heavy, but for a monthly report running once, it might filter okay if indexed.
  
  const totalChecks = await prisma.monitorEvent.count({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
      status: { not: "MAINTENANCE" }
    }
  });

  const totalFailures = await prisma.monitorEvent.count({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
      status: "DOWN",
    }
  });

  const globalUptime = totalChecks > 0 
    ? ((totalChecks - totalFailures) / totalChecks) * 100 
    : 100;

  // 5. Average Response Time
  const avgLatencyResult = await prisma.monitorEvent.aggregate({
    _avg: {
      latency: true,
    },
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
      status: "UP",
    },
  });

  const avgResponseTime = Math.round(avgLatencyResult._avg.latency || 0);

  // 6. Format Critical Events (Top 5 Incidents by duration or recent)
  const criticalEvents = incidents.slice(0, 5).map((inc: any) => {
    let duration = "Ongoing";
    if (inc.resolvedAt) {
      const diffMs = new Date(inc.resolvedAt).getTime() - new Date(inc.createdAt).getTime();
      const diffMins = Math.round(diffMs / 60000);
      duration = `${diffMins}m`;
    }

    return {
      id: inc.id,
      monitorName: inc.monitor.name,
      description: inc.title || "Service Outage",
      duration,
      date: new Date(inc.createdAt).toLocaleDateString(),
    };
  });

  return {
    globalUptime: Number(globalUptime.toFixed(2)),
    totalIncidents,
    avgResponseTime,
    criticalEvents,
    startDate,
    endDate,
  };
}
