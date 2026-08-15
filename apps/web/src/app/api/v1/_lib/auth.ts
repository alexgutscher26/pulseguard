import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import prisma from "@pulseguard/db";

export interface AuthenticatedUser {
  userId: string;
  organizationId?: string | null;
  scopes: string[];
}

/**
 * Verifies Bearer API Key from Authorization header.
 * PulseGuard API Keys are formatted as "pg_live_..." and stored hashed (SHA-256).
 */
export async function authenticateApiKey(
  req: NextRequest,
  requiredScope: "read" | "write" = "read",
): Promise<{ user?: AuthenticatedUser; errorResponse?: NextResponse }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Missing or invalid Authorization Bearer header" },
        { status: 401 },
      ),
    };
  }

  const rawKey = authHeader.slice(7).trim();
  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: {
      id: true,
      userId: true,
      organizationId: true,
      scopes: true,
      expiresAt: true,
    },
  });

  if (!apiKey) {
    return {
      errorResponse: NextResponse.json({ error: "Unauthorized: Invalid API key" }, { status: 401 }),
    };
  }

  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return {
      errorResponse: NextResponse.json(
        { error: "Unauthorized: API key has expired" },
        { status: 401 },
      ),
    };
  }

  const scopes = apiKey.scopes.split(",").map((s) => s.trim());
  if (requiredScope === "write" && !scopes.includes("write")) {
    return {
      errorResponse: NextResponse.json(
        { error: "Forbidden: API key does not have write scope" },
        { status: 403 },
      ),
    };
  }

  // Update lastUsedAt asynchronously without blocking request
  prisma.apiKey
    .update({ where: { id: apiKey.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});

  return {
    user: {
      userId: apiKey.userId,
      organizationId: apiKey.organizationId,
      scopes,
    },
  };
}
