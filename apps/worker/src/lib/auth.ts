import { getPrisma } from "@steadystack/db";
import type { Env } from "../env";

/**
 * Verify a session token from an incoming request against the database.
 *
 * ## Session invalidation guarantee
 *
 * `better-auth` handles logout by **deleting** the session row from the
 * database (`DELETE FROM "session" WHERE token = ?`). This function performs a
 * live `findUnique` on every call — there is no local cache — so a deleted
 * session returns `null` on the very next request. Revocation is therefore
 * immediate and does not require a separate token-blacklist mechanism.
 *
 * Expiry is enforced by `expiresAt > now()`; an expired (but not yet deleted)
 * session is treated as invalid by the same check.
 */
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
  if (!env.DATABASE_URL) {
    console.warn("[Auth] DATABASE_URL is not configured in worker environment.");
    return null;
  }

  try {
    const prisma = getPrisma(env.DATABASE_URL);
    const token = decodeURIComponent(rawToken);

    const session = await prisma.session.findUnique({
      where: { token },
      // Select `token` explicitly so we can confirm the DB row matches the
      // decoded value — defence-in-depth against URL-encoding edge cases.
      select: { userId: true, expiresAt: true, token: true },
    });

    if (session && session.token === token && session.expiresAt > new Date()) {
      return { userId: session.userId };
    }
    return null;
  } catch (err: any) {
    if (
      retry &&
      (err.message?.includes("Connection terminated") ||
        err.message?.includes("is closed") ||
        err.message?.includes("not found") ||
        err.message?.includes("timeout") ||
        err.message?.includes("performIO"))
    ) {
      console.warn(`[Auth] DB connection error or timeout detected. Retrying query...`);
      await new Promise((r) => setTimeout(r, 150));
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
  if (!env.DATABASE_URL) {
    console.warn("[Auth Access] DATABASE_URL not set, allowing WebSocket proxy to DO.");
    return true;
  }

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
        err.message?.includes("timeout") ||
        err.message?.includes("performIO"))
    ) {
      console.warn(
        `[Auth Access] DB connection error or timeout detected. Retrying access check...`,
      );
      await new Promise((r) => setTimeout(r, 150));
      return verifyMonitorAccess(userId, monitorId, env, false);
    }
    throw err;
  }
}
