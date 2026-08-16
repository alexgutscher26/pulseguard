import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { authenticateApiKey } from "../../_lib/auth";

// GET /api/v1/alert-channels/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiKey(req, "read");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  const { id } = await params;
  const channel = await prisma.notificationChannel.findFirst({
    where: {
      id,
      userId: auth.user.userId,
    },
  });

  if (!channel) {
    return NextResponse.json({ error: "Alert channel not found" }, { status: 404 });
  }

  return NextResponse.json({ data: channel });
}

// PATCH /api/v1/alert-channels/:id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiKey(req, "write");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  const { id } = await params;
  const existing = await prisma.notificationChannel.findFirst({
    where: {
      id,
      userId: auth.user.userId,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Alert channel not found" }, { status: 404 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const updateData: any = {};
  if (body.name !== undefined) updateData.name = String(body.name).trim();
  if (body.config !== undefined && typeof body.config === "object") {
    updateData.config = body.config;
  }

  const updated = await prisma.notificationChannel.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ data: updated });
}

// DELETE /api/v1/alert-channels/:id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateApiKey(req, "write");
  if (auth.errorResponse || !auth.user) return auth.errorResponse!;

  const { id } = await params;
  const existing = await prisma.notificationChannel.findFirst({
    where: {
      id,
      userId: auth.user.userId,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Alert channel not found" }, { status: 404 });
  }

  await prisma.notificationChannel.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
