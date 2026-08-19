import { AppError } from "../errors";
import { json, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * GET /api/debug-fetch?url=... — temporarily exposes raw fetch results for
 * diagnosing false DOWN reports.
 */
export const debugFetchRoute: RouteHandler = withErrorHandling(async (_ctx, url) => {
  if (url.pathname !== "/api/debug-fetch") return null;

  const targetUrl = url.searchParams.get("url");
  if (!targetUrl) throw new AppError(400, "Missing ?url= param");

  try {
    const { checkHttpUniversal } = await import("@pulseguard/core");
    const checkRes = await checkHttpUniversal(targetUrl);
    return json({
      url: targetUrl,
      checkUniversal: checkRes,
      bodyPreview: checkRes.bodyText.substring(0, 300),
    });
  } catch (err: any) {
    return json({ url: targetUrl, error: err.message, stack: err.stack, verdict: "DOWN" });
  }
});
