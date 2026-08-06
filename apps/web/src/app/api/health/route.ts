import { getPrisma } from "@pulseguard/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "connected", timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("[HealthCheck] Database ping failed:", error);
    return NextResponse.json(
      { status: "error", db: "disconnected", error: "Database unreachable" },
      { status: 503 },
    );
  }
}
