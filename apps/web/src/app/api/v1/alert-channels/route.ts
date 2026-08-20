import { NextRequest, NextResponse } from "next/server";
import prisma from "@steadystack/db";
import { authenticateApiKey } from "../_lib/auth";
import { assertNotificationChannelLimits } from "@/lib/billing-server";

// GET /api/v1/alert-channels - List alert channels
export async function GET(req: NextRequest) {
  const auth = await authenticateApiKey(req, "read");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  const channels = await prisma.notificationChannel.findMany({
    where: { userId: auth.user.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    data: channels,
    count: channels.length,
  });
}

// POST /api/v1/alert-channels - Create alert channel
export async function POST(req: NextRequest) {
  const auth = await authenticateApiKey(req, "write");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { name, type, config } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!type || typeof type !== "string") {
    return NextResponse.json({ error: "type is required" }, { status: 400 });
  }
  if (!config || typeof config !== "object") {
    return NextResponse.json(
      { error: "config object is required" },
      { status: 400 },
    );
  }

  const validTypes = [
    "EMAIL",
    "DISCORD",
    "SLACK",
    "WEBHOOK",
    "TELEGRAM",
    "SMS",
    "PAGERDUTY",
    "OPSGENIE",
  ];
  const upperType = type.toUpperCase();
  if (!validTypes.includes(upperType)) {
    return NextResponse.json(
      { error: `Invalid type. Supported types: ${validTypes.join(", ")}` },
      { status: 400 },
    );
  }

  const limitCheck = await assertNotificationChannelLimits(auth.user.userId, {
    type: upperType,
    isNew: true,
  });

  if (!limitCheck.allowed) {
    return NextResponse.json(
      { error: limitCheck.error || "Plan limit exceeded" },
      { status: 403 },
    );
  }

  const channel = await prisma.notificationChannel.create({
    data: {
      userId: auth.user.userId,
      name: name.trim(),
      type: upperType as any,
      config,
    },
  });

  return NextResponse.json({ data: channel }, { status: 201 });
}
