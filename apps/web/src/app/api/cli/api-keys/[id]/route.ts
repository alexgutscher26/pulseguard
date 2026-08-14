import { NextRequest, NextResponse } from "next/server";
import { auth } from "@pulseguard/auth";
import prisma from "@pulseguard/db";
import { headers } from "next/headers";

type Ctx = { params: Promise<{ id: string }> };

// DELETE /api/cli/api-keys/:id — revoke a key
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.apiKey.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return NextResponse.json({ error: "Key not found" }, { status: 404 });

  await prisma.apiKey.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
