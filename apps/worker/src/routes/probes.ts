import { getPrisma } from "@steadystack/db";
import { AppError } from "../errors";
import { json, requireJsonBody, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

function bearerToken(request: Request): string {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new AppError(401, "Missing token");
  return token;
}

/**
 * POST /api/probes/register — register a new monitoring probe for the session
 * user.
 */
export const probeRegisterRoute: RouteHandler = withErrorHandling(
  async ({ request, env }, url) => {
    if (url.pathname !== "/api/probes/register" || request.method !== "POST")
      return null;

    const { verifySession } = await import("../lib/auth");
    const session = await verifySession(request, env);
    if (!session?.userId) throw new AppError(401, "Unauthorized");

    const { name, platform, region, heartbeatInterval } =
      await requireJsonBody(request);
    if (!name) throw new AppError(400, "Missing 'name'");

    const prisma = getPrisma(env.DATABASE_URL);
    const { registerProbe } = await import("../services/probe-registry");
    const probe = await registerProbe(
      prisma,
      session.userId,
      name,
      platform,
      region,
      heartbeatInterval,
    );

    return json(probe, 201);
  },
);

/**
 * POST /api/probes/poll — fetch pending jobs for an authenticated probe.
 */
export const probePollRoute: RouteHandler = withErrorHandling(
  async ({ request, env }, url) => {
    if (url.pathname !== "/api/probes/poll" || request.method !== "POST")
      return null;

    const token = bearerToken(request);

    const prisma = getPrisma(env.DATABASE_URL);
    const { authenticateProbe, pollJobs } =
      await import("../services/probe-registry");
    const probe = await authenticateProbe(prisma, token);
    if (!probe) throw new AppError(403, "Invalid or inactive probe");

    const body = await requireJsonBody(request).catch(() => ({}));
    const jobs = await pollJobs(prisma, probe.id, body.maxJobs || 10);

    return json({ probeId: probe.id, jobs });
  },
);

/**
 * POST /api/probes/result — report check results from an authenticated probe
 * (single result or batch).
 */
export const probeResultRoute: RouteHandler = withErrorHandling(
  async ({ request, env }, url) => {
    if (url.pathname !== "/api/probes/result" || request.method !== "POST")
      return null;

    const token = bearerToken(request);

    const prisma = getPrisma(env.DATABASE_URL);
    const { authenticateProbe, reportResult, reportResultsBatch } =
      await import("../services/probe-registry");
    const probe = await authenticateProbe(prisma, token);
    if (!probe) throw new AppError(403, "Invalid or inactive probe");

    const body = await requireJsonBody(request);
    if (Array.isArray(body)) {
      await reportResultsBatch(prisma, probe.id, body);
    } else {
      await reportResult(prisma, probe.id, body);
    }

    return json({ ok: true });
  },
);

/**
 * POST /api/probes/heartbeat — record a heartbeat from an authenticated probe.
 */
export const probeHeartbeatRoute: RouteHandler = withErrorHandling(
  async ({ request, env }, url) => {
    if (url.pathname !== "/api/probes/heartbeat" || request.method !== "POST")
      return null;

    const token = bearerToken(request);

    const prisma = getPrisma(env.DATABASE_URL);
    const { authenticateProbe, recordHeartbeat } =
      await import("../services/probe-registry");
    const probe = await authenticateProbe(prisma, token);
    if (!probe) throw new AppError(403, "Invalid or inactive probe");

    const sourceIp =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      undefined;
    await recordHeartbeat(prisma, probe.id, sourceIp);

    return json({ ok: true });
  },
);
