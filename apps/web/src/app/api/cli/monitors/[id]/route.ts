import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { verifyApiKey, unauthorized } from "../../_lib/auth";

type Ctx = { params: Promise<{ id: string }> };

// GET /api/cli/monitors/:id
export async function GET(req: NextRequest, { params }: Ctx) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();

  const { id } = await params;
  const monitor = await prisma.monitor.findUnique({
    where: { id, userId: user.userId },
    select: {
      id: true,
      name: true,
      url: true,
      type: true,
      status: true,
      interval: true,
      timeout: true,
      method: true,
      headers: true,
      body: true,
      expectation: true,
      alertThreshold: true,
      checkRegions: true,
      runbookUrl: true,
      lastCheck: true,
      nextCheck: true,
      createdAt: true,
      events: {
        take: 10,
        orderBy: { timestamp: "desc" },
        select: { status: true, latency: true, errorReason: true, timestamp: true, region: true },
      },
    },
  });

  if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });

  return NextResponse.json({ monitor });
}

// PUT /api/cli/monitors/:id — update monitor
export async function PUT(req: NextRequest, { params }: Ctx) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();
  if (!user.scopes.includes("write")) {
    return NextResponse.json({ error: "Write scope required" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.monitor.findUnique({ where: { id, userId: user.userId }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });

  const body = await req.json();
  const updateData: Record<string, any> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.url !== undefined) updateData.url = body.url;
  if (body.interval !== undefined) updateData.interval = Number(body.interval);
  if (body.timeout !== undefined) updateData.timeout = Number(body.timeout);
  if (body.method !== undefined) updateData.method = body.method;
  if (body.alertThreshold !== undefined) updateData.alertThreshold = Number(body.alertThreshold);
  if (body.runbookUrl !== undefined) updateData.runbookUrl = body.runbookUrl;
  if (body.headers !== undefined) updateData.headers = JSON.stringify(body.headers);
  if (body.expectation !== undefined) updateData.expectation = JSON.stringify(body.expectation);
  if (body.checkRegions !== undefined) updateData.checkRegions = JSON.stringify(body.checkRegions);

  const monitor = await prisma.monitor.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, url: true, type: true, status: true, updatedAt: true },
  });

  return NextResponse.json({ monitor });
}

// DELETE /api/cli/monitors/:id
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();
  if (!user.scopes.includes("write")) {
    return NextResponse.json({ error: "Write scope required" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.monitor.findUnique({ where: { id, userId: user.userId }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });

  await prisma.monitor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
