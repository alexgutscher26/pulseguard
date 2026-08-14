import { AppError } from "../errors";
import { json, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * GET /api/debug-fetch?url=... — temporarily exposes raw fetch results for
 * diagnosing false DOWN reports.
 */
export const debugFetchRoute: RouteHandler = withErrorHandling(
  async (_ctx, url) => {
    if (url.pathname !== "/api/debug-fetch") return null;

    const targetUrl = url.searchParams.get("url");
    if (!targetUrl) throw new AppError(400, "Missing ?url= param");

    try {
      const start = Date.now();
      const res = await fetch(targetUrl, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "PulseGuard-Debug/1.0", Accept: "*/*" },
        signal: AbortSignal.timeout(10000),
      });
      await res.text(); // consume body
      const latency = Date.now() - start;
      const isHealthy = res.ok || (res.status >= 300 && res.status < 400);
      return json({
        url: targetUrl,
        finalUrl: res.url,
        status: res.status,
        ok: res.ok,
        isHealthy,
        verdict: isHealthy ? "UP" : "DOWN",
        latency,
      });
    } catch (err: any) {
      // Debug endpoint reports failures as a healthy 200 with a DOWN verdict
      return json({ url: targetUrl, error: err.message, verdict: "DOWN" });
    }
  },
);
