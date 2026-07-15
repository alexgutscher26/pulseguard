import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { verifyApiKey, unauthorized } from "../../../_lib/auth";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/cli/monitors/:id/summary?since=<date>
 *
 * Retrieve uptime and latency statistics for a monitor over a given timeframe.
 */
export async function GET(req: NextRequest, { params }: Ctx) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const searchParams = req.nextUrl.searchParams;
  const sinceStr = searchParams.get("since");

  let since = new Date(Date.now() - 24 * 60 * 60 * 1000); // default to last 24h
  if (sinceStr) {
    const parsed = new Date(sinceStr);
    if (!isNaN(parsed.getTime())) {
      since = parsed;
    }
  }

  const monitor = await prisma.monitor.findUnique({
    where: { id, userId: user.userId },
    select: { id: true, name: true, url: true },
  });

  if (!monitor) {
    return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  }

  const events = await prisma.monitorEvent.findMany({
    where: { monitorId: id, timestamp: { gte: since } },
    select: { status: true, latency: true },
    orderBy: { timestamp: "asc" },
  });

  const total = events.length;
  const up = events.filter((e) => e.status === "UP").length;
  const down = total - up;
  const uptimePct = total > 0 ? Number(((up / total) * 100).toFixed(2)) : 100.0;

  const latencies = events.map((e) => e.latency).sort((a, b) => a - b);
  const avgLatency =
    total > 0 ? Math.round(latencies.reduce((sum, val) => sum + val, 0) / total) : 0;

  const getPercentile = (arr: number[], pct: number) => {
    if (arr.length === 0) return 0;
    const idx = Math.min(Math.floor(pct * arr.length), arr.length - 1);
    return arr[idx];
  };

  const p50 = getPercentile(latencies, 0.5);
  const p95 = getPercentile(latencies, 0.95);
  const p99 = getPercentile(latencies, 0.99);

  return NextResponse.json({
    monitorId: id,
    name: monitor.name,
    url: monitor.url,
    since: since.toISOString(),
    stats: {
      uptimePct,
      avgLatency,
      p50Latency: p50,
      p95Latency: p95,
      p99Latency: p99,
      checksTotal: total,
      checksUp: up,
      checksDown: down,
    },
  });
}
