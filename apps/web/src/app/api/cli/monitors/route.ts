import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { verifyApiKey, unauthorized } from "../_lib/auth";

// GET /api/cli/monitors — list all monitors
export async function GET(req: NextRequest) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();

  const monitors = await prisma.monitor.findMany({
    where: { userId: user.userId },
    select: {
      id: true,
      name: true,
      url: true,
      type: true,
      status: true,
      interval: true,
      timeout: true,
      lastCheck: true,
      nextCheck: true,
      alertThreshold: true,
      checkRegions: true,
      method: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ monitors });
}

// POST /api/cli/monitors — create a monitor
export async function POST(req: NextRequest) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();
  if (!user.scopes.includes("write")) {
    return NextResponse.json({ error: "Write scope required" }, { status: 403 });
  }

  const body = (await req.json()) as any;
  const {
    name,
    url,
    type = "HTTP",
    interval = 60,
    timeout = 10,
    method = "GET",
    headers: customHeaders,
    body: requestBody,
    expectation,
    alertThreshold = 1,
    checkRegions,
    runbookUrl,
  } = body;

  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!url?.trim()) return NextResponse.json({ error: "url is required" }, { status: 400 });

  const monitor = await prisma.monitor.create({
    data: {
      name: name.trim(),
      url: url.trim(),
      type,
      interval,
      timeout,
      method,
      headers: customHeaders ? JSON.stringify(customHeaders) : null,
      body: requestBody || null,
      expectation: expectation ? JSON.stringify(expectation) : null,
      alertThreshold,
      checkRegions: checkRegions ? JSON.stringify(checkRegions) : null,
      runbookUrl: runbookUrl || null,
      userId: user.userId,
    },
    select: { id: true, name: true, url: true, type: true, status: true, createdAt: true },
  });

  return NextResponse.json({ monitor }, { status: 201 });
}
