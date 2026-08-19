import { getPrisma } from "@steadystack/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const prisma = getPrisma();

    // 1. DB Ping
    await prisma.$queryRaw`SELECT 1`;

    // 2. Check recent worker cron heartbeat / check execution (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentCheck = await prisma.monitorEvent.findFirst({
      where: { timestamp: { gte: fiveMinutesAgo } },
      select: { timestamp: true },
    });

    // 3. Redis Health Ping (if configured)
    let redisStatus = "not_configured";
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const pingUrl = `${process.env.UPSTASH_REDIS_REST_URL}/ping`;
        const res = await fetch(pingUrl, {
          headers: {
            Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
          },
          signal: AbortSignal.timeout(3000),
        });
        if (res.ok) {
          redisStatus = "connected";
        } else {
          redisStatus = "error";
        }
      } catch (redisErr) {
        console.error("[HealthCheck] Redis ping failed:", redisErr);
        redisStatus = "error";
      }
    }

    const isWorkerStale = !recentCheck && (await prisma.monitor.count()) > 0;
    const isDegraded = redisStatus === "error" || isWorkerStale;

    return NextResponse.json(
      {
        status: isDegraded ? "degraded" : "ok",
        db: "connected",
        redis: redisStatus,
        scheduler: isWorkerStale ? "stale" : "active",
        lastCheckTimestamp: recentCheck?.timestamp?.toISOString() || null,
        timestamp: new Date().toISOString(),
      },
      { status: isDegraded ? 503 : 200 },
    );
  } catch (error) {
    console.error("[HealthCheck] Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        db: "disconnected",
        error: "Database or service unreachable",
      },
      { status: 503 },
    );
  }
}
