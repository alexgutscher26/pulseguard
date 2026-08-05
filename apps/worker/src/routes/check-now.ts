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

  const result = await performCheck(monitorData, env);
  return json(result);
});
