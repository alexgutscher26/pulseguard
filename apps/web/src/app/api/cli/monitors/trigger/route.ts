import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { verifyApiKey, unauthorized } from "../../_lib/auth";

/**
 * POST /api/cli/monitors/trigger
 *
 * Bulk trigger health checks on multiple monitors immediately.
 * Accepts list of IDs and optional URL override.
 */
export async function POST(req: NextRequest) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as any;
  const { ids, url: bodyUrl } = body;

  if (bodyUrl && !user.scopes.includes("write")) {
    return NextResponse.json({ error: "Write scope required for URL override" }, { status: 403 });
  }

  if (bodyUrl) {
    try {
      new URL(bodyUrl);
    } catch (_) {
      return NextResponse.json({ error: "Invalid override URL" }, { status: 400 });
    }
  }

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array is required" }, { status: 400 });
  }

  const monitors = await prisma.monitor.findMany({
    where: { id: { in: ids }, userId: user.userId },
    select: {
      id: true,
      name: true,
      url: true,
      type: true,
      timeout: true,
      method: true,
      headers: true,
      body: true,
    },
  });

  const runHttpCheck = async (monitor: any, targetUrl: string, isOverride: boolean) => {
    const start = performance.now();
    let status: "UP" | "DOWN" = "DOWN";
    let latency = 0;
    let errorReason: string | null = null;
    let httpStatus: number | null = null;

    try {
      const userHeaders: Record<string, string> = {};
      if (monitor.headers) {
        try {
          const parsed = JSON.parse(monitor.headers);
          if (Array.isArray(parsed)) {
            parsed.forEach((h: any) => {
              if (h.key) userHeaders[h.key] = h.value;
            });
          }
        } catch (_) {}
      }

      const response = await fetch(targetUrl, {
        method: monitor.method || "GET",
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PulseGuard/1.0; +https://pulseguard.io/bot)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          ...userHeaders,
        },
        body: ["POST", "PUT", "PATCH"].includes(monitor.method || "GET")
          ? (monitor.body ?? undefined)
          : undefined,
        signal: AbortSignal.timeout((monitor.timeout || 10) * 1000),
      });

      await response.text();
      latency = Math.round(performance.now() - start);
      httpStatus = response.status;

      const statusNum = response.status;
      const isHealthy =
        response.ok ||
        (statusNum >= 300 && statusNum < 400) ||
        statusNum === 429 ||
        statusNum === 403;

      status = isHealthy ? "UP" : "DOWN";
      if (!isHealthy) errorReason = `HTTP_${statusNum}`;
    } catch (err: any) {
      latency = Math.round(performance.now() - start);
      if (err.name === "TimeoutError") errorReason = "TIMEOUT";
      else if (err.message?.includes("getaddrinfo") || err.code === "ENOTFOUND")
        errorReason = "DNS_ERROR";
      else if (err.code === "ECONNREFUSED") errorReason = "CONNECTION_REFUSED";
      else errorReason = "UNKNOWN_ERROR";
    }

    // Persist the triggered event
    await prisma.monitorEvent.create({
      data: {
        monitorId: monitor.id,
        status,
        latency,
        errorReason,
        region: isOverride ? "cli-trigger-override" : "cli-trigger",
        timestamp: new Date(),
      },
    });

    return {
      monitorId: monitor.id,
      name: monitor.name,
      url: targetUrl,
      status,
      latency,
      httpStatus,
      errorReason,
      checkedAt: new Date().toISOString(),
    };
  };

  const results = await Promise.all(
    ids.map(async (id) => {
      const monitor = monitors.find((m) => m.id === id);
      if (!monitor) {
        return {
          monitorId: id,
          name: "Unknown Monitor",
          url: "",
          status: "DOWN" as const,
          latency: 0,
          httpStatus: null,
          errorReason: "NOT_FOUND",
          checkedAt: new Date().toISOString(),
        };
      }
      if (monitor.type !== "HTTP") {
        return {
          monitorId: monitor.id,
          name: monitor.name,
          url: monitor.url,
          status: "DOWN" as const,
          latency: 0,
          httpStatus: null,
          errorReason: `UNSUPPORTED_TYPE: ${monitor.type}`,
          checkedAt: new Date().toISOString(),
        };
      }
      return runHttpCheck(monitor, bodyUrl || monitor.url, !!bodyUrl);
    }),
  );

  return NextResponse.json({ results });
}
