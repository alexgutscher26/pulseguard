import { verifyMonitorAccess, verifySession } from "../lib/auth";
import { AppError } from "../errors";
import { withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * GET /ws/monitors/:id?token=... — WebSocket upgrade proxied to the
 * MonitorChannel durable object.
 */
export const websocketRoute: RouteHandler = withErrorHandling(
  async ({ request, env }, url) => {
    if (!url.pathname.startsWith("/ws/monitors/")) return null;

    const monitorId = url.pathname.split("/")[3];
    if (!monitorId) throw new AppError(400, "Missing Monitor ID");

    const rawToken = url.searchParams.get("token");

    // Auth Check
    const session = await verifySession(request, env);

    const hasAccess = await verifyMonitorAccess(
      session?.userId || null,
      monitorId,
      env,
    );
    if (!hasAccess) throw new AppError(403, "Forbidden");

    // Forward to Durable Object
    const id = env.MONITOR_CHANNEL.idFromName(monitorId);
    const stub = env.MONITOR_CHANNEL.get(id);

    // We rewrite the URL to /websocket so the DO knows it's a client connection
    const doUrl = new URL("https://monitor-channel/websocket");
    doUrl.searchParams.set("monitorId", monitorId);
    if (rawToken) doUrl.searchParams.set("token", rawToken);

    // Pass the original request (headers, upgrade, etc) but with new URL
    return stub.fetch(doUrl.toString(), request);
  },
);
