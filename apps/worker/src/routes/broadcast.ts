import { AppError } from "../errors";
import { json, requireJsonBody, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * POST /api/broadcast — forward a live event to a monitor's MonitorChannel
 * durable object.
 */
export const broadcastRoute: RouteHandler = withErrorHandling(
  async ({ env, request }, url) => {
    if (url.pathname !== "/api/broadcast" || request.method !== "POST")
      return null;

    const { monitorId, event } = await requireJsonBody(request);
    if (!monitorId || !event)
      throw new AppError(400, "Missing monitorId or event");

    // Forward to Durable Object
    const id = env.MONITOR_CHANNEL.idFromName(monitorId);
    const stub = env.MONITOR_CHANNEL.get(id);

    await stub.fetch("https://monitor-channel/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    return json({ success: true });
  },
);
