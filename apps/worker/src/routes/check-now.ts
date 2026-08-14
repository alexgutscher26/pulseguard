import { getPrisma } from "@pulseguard/db";
import { verifyMonitorAccess, verifySession } from "../lib/auth";
import { performCheck } from "../check-runner";
import { AppError } from "../errors";
import { json, requireJsonBody, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * POST /api/check-now — run a single ad-hoc check against a monitor
 * definition without any database side effects.
 */
export const checkNowRoute: RouteHandler = withErrorHandling(async ({ request, env }, url) => {
  if (url.pathname !== "/api/check-now" || request.method !== "POST") return null;

  const session = await verifySession(request, env);
  if (!session?.userId) throw new AppError(401, "Unauthorized");

  const { monitor: monitorData } = await requireJsonBody(request);
  if (!monitorData) throw new AppError(400, "Missing 'monitor' body param");

  const hasAccess = await verifyMonitorAccess(session.userId, monitorData.id, env);
  if (!hasAccess) throw new AppError(403, "Forbidden");

  // Check for active maintenance window
  const prisma = getPrisma(env.DATABASE_URL);
  const activeWindow = await prisma.maintenanceWindow.findFirst({
    where: {
      monitorId: monitorData.id,
      startAt: { lte: new Date() },
      endAt: { gte: new Date() },
    },
  });

  if (activeWindow) {
    console.log(
      `[Maintenance] Skipping ad-hoc check for ${monitorData.name || monitorData.id} (active maintenance window)`,
    );
    return json({
      status: "MAINTENANCE",
      latency: 0,
      errorReason: undefined,
      skipped: true,
      reason: "Active maintenance window",
    });
  }

  const result = await performCheck(monitorData, env, prisma);
  return json(result);
});
