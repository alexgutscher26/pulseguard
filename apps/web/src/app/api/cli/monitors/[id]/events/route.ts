import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { verifyApiKey, unauthorized } from "../../../_lib/auth";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/cli/monitors/:id/events?limit=50&since=<ISO>
 *
 * Returns recent monitor events for `pulse logs tail <id>`.
 * Supports `since` param for incremental polling.
 */
export async function GET(req: NextRequest, { params }: Ctx) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const monitor = await prisma.monitor.findUnique({
    where: { id, userId: user.userId },
    select: { id: true, name: true },
  });
  if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });

  const searchParams = req.nextUrl.searchParams;
  const limit = Math.min(Number(searchParams.get("limit") || "50"), 500);
  const since = searchParams.get("since");

  const events = await prisma.monitorEvent.findMany({
    where: {
      monitorId: id,
      ...(since ? { timestamp: { gt: new Date(since) } } : {}),
    },
    orderBy: { timestamp: "desc" },
    take: limit,
    select: {
      id: true,
      status: true,
      latency: true,
      errorReason: true,
      timestamp: true,
      region: true,
    },
  });

  return NextResponse.json({
    monitorId: id,
    name: monitor.name,
    events: events.reverse(), // Chronological order for tailing
  });
}
