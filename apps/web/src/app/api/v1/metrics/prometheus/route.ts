import { NextRequest, NextResponse } from "next/server";
import prisma from "@steadystack/db";
import { authenticateApiKey } from "../../_lib/auth";

function escapeLabel(val: string): string {
  return val.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// GET /api/v1/metrics/prometheus - Export metrics in Prometheus exposition format
export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req, "read");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  const monitors = await prisma.monitor.findMany({
    where: { userId: auth.user.userId },
    include: {
      latencyAggregates: {
        where: { granularity: "FIVE_MINUTE" },
        orderBy: { timestamp: "desc" },
        take: 10,
      },
    },
  });

  const lines: string[] = [
    "# HELP steadystack_monitor_status Monitor operational status (1 = UP, 0 = DOWN, 2 = PAUSED/MAINTENANCE)",
    "# TYPE steadystack_monitor_status gauge",
  ];

  for (const m of monitors) {
    const statusVal = m.status === "UP" ? 1 : m.status === "DOWN" ? 0 : 2;
    lines.push(
      `steadystack_monitor_status{id="${escapeLabel(m.id)}",name="${escapeLabel(m.name)}",url="${escapeLabel(m.url)}",type="${escapeLabel(m.type)}",method="${escapeLabel(m.method)}"} ${statusVal}`,
    );
  }

  lines.push(
    "",
    "# HELP steadystack_monitor_latency_ms Average round-trip response time in milliseconds",
    "# TYPE steadystack_monitor_latency_ms gauge",
  );

  for (const m of monitors) {
    const latestByRegion = new Map<string, number>();
    for (const agg of m.latencyAggregates) {
      if (!latestByRegion.has(agg.region)) {
        latestByRegion.set(agg.region, agg.avgLatency);
      }
    }

    if (latestByRegion.size === 0) {
      // Fallback zero gauge
      lines.push(
        `steadystack_monitor_latency_ms{id="${escapeLabel(m.id)}",name="${escapeLabel(m.name)}",region="global"} 0`,
      );
    } else {
      for (const [region, latency] of latestByRegion.entries()) {
        lines.push(
          `steadystack_monitor_latency_ms{id="${escapeLabel(m.id)}",name="${escapeLabel(m.name)}",region="${escapeLabel(region)}"} ${latency.toFixed(2)}`,
        );
      }
    }
  }

  lines.push(
    "",
    "# HELP steadystack_monitor_interval_seconds Configured check frequency",
    "# TYPE steadystack_monitor_interval_seconds gauge",
  );

  for (const m of monitors) {
    lines.push(
      `steadystack_monitor_interval_seconds{id="${escapeLabel(m.id)}",name="${escapeLabel(m.name)}"} ${m.interval}`,
    );
  }

  lines.push(""); // Trailing newline

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
