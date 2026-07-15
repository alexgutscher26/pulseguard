import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { auth } from "@pulseguard/auth";
import prisma from "@pulseguard/db";
import { headers } from "next/headers";

// GET /api/cli/api-keys — list keys (web session auth)
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      prefix: true,
      scopes: true,
      expiresAt: true,
      lastUsedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ keys });
}

// POST /api/cli/api-keys — create new key (web session auth, returns raw key once)
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, expiresAt } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  // Format: pg_live_<48 hex chars> (72 chars total, ~192 bits of entropy)
  const rawKey = `pg_live_${randomBytes(24).toString("hex")}`;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");
  const prefix = rawKey.slice(0, 15); // "pg_live_xxxxxxx"

  const key = await prisma.apiKey.create({
    data: {
      name: name.trim(),
      keyHash,
      prefix,
      scopes: "read,write",
      userId: session.user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
    select: { id: true, name: true, prefix: true, scopes: true, expiresAt: true, createdAt: true },
  });

  // rawKey is returned ONCE and never retrievable again
  return NextResponse.json({ key: { ...key, rawKey } }, { status: 201 });
}
