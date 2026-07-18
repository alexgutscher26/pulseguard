import { getPrisma } from "@pulseguard/db";
import type { Env } from "../index";

export async function verifySession(
  request: Request,
  env: Env,
  retry: boolean = true,
): Promise<{ userId: string } | null> {
  const cookieHeader = request.headers.get("Cookie");
  const url = new URL(request.url);
  let rawToken: string | null | undefined = url.searchParams.get("token");

  if (!rawToken && cookieHeader) {
    const secureMatch = cookieHeader.match(/__Secure-better-auth\.session_token=([^;]+)/);
    const regularMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
    rawToken = secureMatch?.[1] || regularMatch?.[1] || null;
  }

  if (!rawToken) return null;

  try {
    const prisma = getPrisma(env.DATABASE_URL);
    const token = decodeURIComponent(rawToken);

    const session = await prisma.session.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true },
    });

    if (session && session.expiresAt > new Date()) {
      return { userId: session.userId };
    }
    return null;
  } catch (err: any) {
    if (
      retry &&
      (err.message?.includes("Connection terminated") ||
        err.message?.includes("is closed") ||
        err.message?.includes("not found") ||
        err.message?.includes("timeout"))
    ) {
      console.warn(`[Auth] DB connection error or timeout detected. Resetting Prisma and retrying...`);
      const { resetPrisma } = await import("@pulseguard/db");
      await resetPrisma(env.DATABASE_URL);
      return verifySession(request, env, false);
    }
    throw err;
  }
}

export async function verifyMonitorAccess(
  userId: string | null,
  monitorId: string,
  env: Env,
  retry: boolean = true,
): Promise<boolean> {
  try {
    const prisma = getPrisma(env.DATABASE_URL);

    if (userId) {
      const monitor = await prisma.monitor.findUnique({
        where: { id: monitorId },
        select: { userId: true },
      });

      if (monitor && monitor.userId === userId) {
        return true;
      }
    }

    // Fallback: If no valid user session, check if monitor is exposed on any public Status Page
    const publicMonitor = await prisma.statusPageMonitor.findFirst({
      where: {
        monitorId: monitorId,
        statusPage: { isPrivate: false },
      },
    });

    return !!publicMonitor;
  } catch (err: any) {
    if (
      retry &&
      (err.message?.includes("Connection terminated") ||
        err.message?.includes("is closed") ||
        err.message?.includes("not found") ||
        err.message?.includes("timeout"))
    ) {
      console.warn(`[Auth Access] DB connection error or timeout detected. Resetting Prisma and retrying...`);
      const { resetPrisma } = await import("@pulseguard/db");
      await resetPrisma(env.DATABASE_URL);
      return verifyMonitorAccess(userId, monitorId, env, false);
    }
    throw err;
  }
}
