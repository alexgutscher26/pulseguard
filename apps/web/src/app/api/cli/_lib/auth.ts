import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import prisma from "@pulseguard/db";

/** Verify API key from Authorization: Bearer <key> header */
export async function verifyApiKey(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const rawKey = authHeader.slice(7);
  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: { id: true, userId: true, scopes: true, expiresAt: true },
  });

  if (!apiKey) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  // Touch lastUsedAt async — never block the request
  prisma.apiKey
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});

  return { userId: apiKey.userId, scopes: apiKey.scopes.split(",") };
}

export function unauthorized(msg = "Invalid or missing API key") {
  return NextResponse.json({ error: msg }, { status: 401 });
}
