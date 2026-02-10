import { getPrisma } from "@pulseguard/db";

interface Env {
  DATABASE_URL: string;
}

/**
 * Extracts session token from cookies and verifies it against the database.
 * checks for `better-auth.session_token` and `__Secure-better-auth.session_token`.
 */
export async function verifySession(request: Request, env: Env): Promise<{ userId: string } | null> {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = parseCookies(cookieHeader);
  // Check both standard and secure cookie names used by better-auth
  const token = cookies["better-auth.session_token"] || cookies["__Secure-better-auth.session_token"];

  if (!token) return null;

  const prisma = getPrisma(env.DATABASE_URL);

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      select: { userId: true, expiresAt: true }
    });

    if (!session) return null;

    // Check expiration
    if (session.expiresAt < new Date()) return null;

    return { userId: session.userId };
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

/**
 * Verifies if the user has access to the specified monitor.
 */
export async function verifyMonitorAccess(userId: string, monitorId: string, env: Env): Promise<boolean> {
  const prisma = getPrisma(env.DATABASE_URL);

  try {
    const monitor = await prisma.monitor.findUnique({
      where: { id: monitorId },
      select: { userId: true }
    });

    if (!monitor) return false;
    return monitor.userId === userId;
  } catch (error) {
    console.error("Monitor access verification failed:", error);
    return false;
  }
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (name && rest) {
      cookies[name] = rest.join("=");
    }
  });
  return cookies;
}
