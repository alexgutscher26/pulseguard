import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@pulseguard/db";
import { auth } from "@pulseguard/auth";

interface LatencyHeatmapParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/monitors/[id]/latency-heatmap
 * Fetches latency heatmap data for a specific monitor
 */
export async function GET(request: NextRequest, props: LatencyHeatmapParams) {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const params = await props.params;
    const { id: monitorId } = params;
    const { searchParams } = new URL(request.url);

    // Query parameters
    const timeRange = searchParams.get("timeRange") || "24h";
    const metricType = searchParams.get("metricType") || "both";

    // Determine granularity based on time range
    const granularityMap: Record<string, { granularity: string; hours: number }> = {
      "1h": { granularity: "ONE_MINUTE", hours: 1 },
      "6h": { granularity: "ONE_MINUTE", hours: 6 },
      "24h": { granularity: "FIVE_MINUTE", hours: 24 },
      "7d": { granularity: "ONE_HOUR", hours: 168 },
      "30d": { granularity: "ONE_HOUR", hours: 720 },
    };

    const config = granularityMap[timeRange] || granularityMap["24h"];
    const startTime = new Date(Date.now() - config.hours * 60 * 60 * 1000);

    // Get Prisma client
    const prisma = getPrisma(process.env.DATABASE_URL!);

    // Verify monitor ownership
    const monitor = await prisma.monitor.findFirst({
      where: {
        id: monitorId,
        userId: session.user.id,
      },
    });

    if (!monitor) {
      return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
    }

    // Fetch latency aggregates
    const aggregates = await prisma.latencyAggregate.findMany({
      where: {
        monitorId,
        granularity: config.granularity as any,
        timestamp: {
          gte: startTime,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Fetch regional baselines
    const baselines = await prisma.regionalBaseline.findMany({
      where: {
        monitorId,
      },
    });

    // Fetch active regional incidents
    const activeIncidents = await prisma.regionalIncident.findMany({
      where: {
        monitorId,
        status: {
          not: "RESOLVED" as any,
        },
      },
    });

    // Group by region
    const regionMap = new Map<string, any[]>();
    for (const agg of aggregates) {
      if (!regionMap.has(agg.region)) {
        regionMap.set(agg.region, []);
      }
      regionMap.get(agg.region)!.push(agg);
    }

    // Build response
    const regions = Array.from(regionMap.entries()).map(([region, data]) => {
      const baseline = baselines.find((b) => b.region === region);
      const incident = activeIncidents.find((i) => i.region === region);

      return {
        region,
        data: data.map((d) => ({
          timestamp: Math.floor(d.timestamp.getTime() / 1000),
          absolute: {
            avg: d.avgLatency,
            p50: d.p50Latency,
            p95: d.p95Latency,
            p99: d.p99Latency,
            min: d.minLatency,
            max: d.maxLatency,
          },
          relative: baseline
            ? {
                vsBaseline: d.avgLatency / baseline.baselineLatency,
              }
            : null,
          hasIncident: !!incident,
          sampleCount: d.sampleCount,
          successRate: d.successRate,
        })),
        baseline: baseline?.baselineLatency || null,
        currentIncident: incident
          ? {
              id: incident.id,
              status: incident.status,
              startedAt: incident.startedAt.toISOString(),
            }
          : null,
      };
    });

    // Calculate color scale ranges
    const allLatencies = aggregates.map((a) => a.avgLatency);
    const colorScale = {
      absolute: {
        min: Math.min(...allLatencies, 50),
        max: Math.max(...allLatencies, 500),
      },
      relative: {
        min: 0.5,
        max: 2.0,
      },
    };

    return NextResponse.json(
      {
        monitorId,
        timeRange,
        granularity: config.granularity,
        regions,
        colorScale,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    console.error("[LatencyHeatmap] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
