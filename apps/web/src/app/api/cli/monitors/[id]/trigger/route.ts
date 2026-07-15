import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { verifyApiKey, unauthorized } from "../../../_lib/auth";

type Ctx = { params: Promise<{ id: string }> };

/**
 * POST /api/cli/monitors/:id/trigger
 *
 * Force an immediate health check on the monitor and return the result synchronously.
 * This is the backend for `pulse trigger <id>`.
 * Uses the same HTTP check logic as the probe app, running inline in the Next.js route.
 */
export async function POST(req: NextRequest, { params }: Ctx) {
  const user = await verifyApiKey(req);
  if (!user) return unauthorized();

  const { id } = await params;

  let bodyUrl: string | undefined;
  try {
    const body = (await req.json().catch(() => ({}))) as any;
    if (body && typeof body === "object" && typeof body.url === "string") {
      bodyUrl = body.url.trim();
    }
  } catch (_) {}

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

  const monitor = await prisma.monitor.findUnique({
    where: { id, userId: user.userId },
    select: {
      id: true,
      name: true,
      url: true,
      type: true,
      timeout: true,
      method: true,
      headers: true,
      body: true,
      expectation: true,
    },
  });

  if (!monitor) return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
  if (monitor.type !== "HTTP") {
    return NextResponse.json(
      {
        error: `Instant trigger only supports HTTP monitors (this is type: ${monitor.type})`,
      },
      { status: 422 },
    );
  }

  const targetUrl = bodyUrl || monitor.url;

  const start = performance.now();
  let status: "UP" | "DOWN" = "DOWN";
  let latency = 0;
  let errorReason: string | undefined;
  let httpStatus: number | undefined;

  try {
    const userHeaders: Record<string, string> = {};
    if (monitor.headers) {
      try {
        const parsed = JSON.parse(monitor.headers);
        if (Array.isArray(parsed))
          parsed.forEach((h: any) => {
            if (h.key) userHeaders[h.key] = h.value;
          });
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
      region: bodyUrl ? "cli-trigger-override" : "cli-trigger",
      timestamp: new Date(),
    },
  });

  return NextResponse.json({
    monitorId: monitor.id,
    name: monitor.name,
    url: targetUrl,
    status,
    latency,
    httpStatus,
    errorReason: errorReason ?? null,
    checkedAt: new Date().toISOString(),
  });
}
