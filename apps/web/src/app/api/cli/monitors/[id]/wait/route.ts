import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { verifyApiKey, unauthorized } from "../../../_lib/auth";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET /api/cli/monitors/:id/wait?timeout=300&interval=15
 *
 * CI/CD gate: polls until the monitor status is UP, then returns 200.
 * Returns 504 if the monitor doesn't recover within the timeout window.
 * This is the backend for `pulse wait <id>`.
 */
export async function GET(req: NextRequest, { params }: Ctx) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const monitor = await prisma.monitor.findUnique({
    where: { id, userId: user.userId },
    select: { id: true, name: true, status: true },
  });
  if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });

  const searchParams = req.nextUrl.searchParams;
  const timeoutSec = Math.min(Number(searchParams.get("timeout") || "300"), 600); // max 10 min
  const intervalSec = Math.max(Number(searchParams.get("interval") || "15"), 5);  // min 5s

  const deadline = Date.now() + timeoutSec * 1000;

  while (Date.now() < deadline) {
    const current = await prisma.monitor.findUnique({
      where: { id },
      select: { status: true, lastCheck: true },
    });

    if (current?.status === "UP") {
      return NextResponse.json({
        success: true,
        monitorId: id,
        name: monitor.name,
        status: "UP",
        lastCheck: current.lastCheck,
        message: `Monitor is UP`,
      });
    }

    // Still DOWN — wait for next interval
    await new Promise((resolve) => setTimeout(resolve, intervalSec * 1000));
  }

  // Timed out
  const final = await prisma.monitor.findUnique({ where: { id }, select: { status: true, lastCheck: true } });
  return NextResponse.json(
    {
      success: false,
      monitorId: id,
      name: monitor.name,
      status: final?.status ?? "UNKNOWN",
      lastCheck: final?.lastCheck,
      message: `Monitor did not recover within ${timeoutSec}s`,
    },
    { status: 504 },
  );
}
