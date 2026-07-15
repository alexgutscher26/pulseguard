import type { MonitorStatus } from "@pulseguard/types";

/**
 * Universal port connection checker that automatically detects the runtime environment.
 * Supports:
 * - Node.js (via net.connect)
 * - Cloudflare Workers (via cloudflare:sockets)
 * - Standard fetch bypass for HTTP(S) ports 80 and 443
 */
export async function checkPortUniversal(
  host: string,
  port: number,
  timeoutMs = 3000
): Promise<{ isOpen: boolean; latency: number; status: string; errorReason?: string }> {
  const start = Date.now();

  // 1. HTTP/S Port check using fetch bypass
  if (port === 80 || port === 443) {
    try {
      const protocol = port === 443 ? "https" : "http";
      const signal = AbortSignal.timeout(timeoutMs);
      await fetch(`${protocol}://${host}`, { method: "HEAD", signal });
      return { isOpen: true, latency: Date.now() - start, status: "OPEN" };
    } catch (e: any) {
      return { isOpen: false, latency: 0, status: "CLOSED", errorReason: e.message };
    }
  }

  // 2. Node.js Environment Check (via dynamic import of 'net')
  try {
    // @ts-ignore
    const net = await import("net");
    if (net && typeof net.connect === "function") {
      return await new Promise((resolve) => {
        const socket = net.connect({ host, port });
        const timer = setTimeout(() => {
          socket.destroy();
          resolve({ isOpen: false, latency: 0, status: "TIMEOUT" });
        }, timeoutMs);

        socket.on("connect", () => {
          clearTimeout(timer);
          const latency = Date.now() - start;
          socket.end();
          resolve({ isOpen: true, latency, status: "OPEN" });
        });

        socket.on("error", (err: any) => {
          clearTimeout(timer);
          socket.destroy();
          resolve({ isOpen: false, latency: 0, status: "CLOSED", errorReason: err.message });
        });
      });
    }
  } catch (err) {
    // Fallthrough to Cloudflare Workers check if not in Node.js
  }

  // 3. Cloudflare Workers Environment Check (via dynamic import of 'cloudflare:sockets')
  try {
    // @ts-ignore
    const { connect } = await import("cloudflare:sockets");
    if (typeof connect === "function") {
      const socket = connect({ hostname: host, port });
      
      const timeoutPromise = new Promise<void>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeoutMs)
      );

      await Promise.race([socket.opened, timeoutPromise]);
      const latency = Date.now() - start;
      await socket.close();
      return { isOpen: true, latency, status: "OPEN" };
    }
  } catch (err: any) {
    let status = "CLOSED";
    if (err.message === "Timeout") {
      status = "TIMEOUT";
    } else if (err.message && err.message.includes("not permitted")) {
      status = "BLOCKED";
    }
    return { isOpen: false, latency: 0, status, errorReason: err.message };
  }

  return { isOpen: false, latency: 0, status: "CLOSED", errorReason: "NO_COMPATIBLE_RUNTIME" };
}

/**
 * Universal HTTP/HTTPS request checker that handles redirect following, custom headers, and timeouts.
 */
export async function checkHttpUniversal(
  urlStr: string,
  config: {
    method?: string;
    headers?: string | Record<string, string>;
    body?: string;
    timeoutSeconds?: number;
  }
): Promise<{ status: MonitorStatus; latency: number; errorReason?: string; bodyText: string; statusCode?: number }> {
  const start = Date.now();
  const method = config.method || "GET";
  const timeoutMs = (config.timeoutSeconds || 10) * 1000;
  const userHeaders: Record<string, string> = {};

  if (config.headers) {
    if (typeof config.headers === "string") {
      try {
        const parsed = JSON.parse(config.headers);
        if (Array.isArray(parsed)) {
          parsed.forEach((h: { key: string; value: string }) => {
            if (h.key) userHeaders[h.key] = h.value;
          });
        } else if (typeof parsed === "object") {
          Object.assign(userHeaders, parsed);
        }
      } catch {}
    } else if (typeof config.headers === "object") {
      Object.assign(userHeaders, config.headers);
    }
  }

  try {
    const response = await fetch(urlStr, {
      method,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PulseGuard/1.0; +https://pulseguard.io/bot)",
        Accept: "*/*",
        ...userHeaders,
      },
      body: ["POST", "PUT", "PATCH"].includes(method) ? config.body : undefined,
      signal: AbortSignal.timeout(timeoutMs),
    });

    const bodyText = await response.text();
    const latency = Date.now() - start;

    const statusNum = Number(response.status);
    const isRateLimited = statusNum === 429;
    const isIPBlocked = statusNum === 403;
    const isHealthyStatus =
      response.ok || (statusNum >= 300 && statusNum < 400) || isRateLimited || isIPBlocked;

    return {
      status: isHealthyStatus ? "UP" : "DOWN",
      latency,
      errorReason: isHealthyStatus ? undefined : `HTTP_${response.status}`,
      bodyText,
      statusCode: statusNum,
    };
  } catch (err: any) {
    const latency = Date.now() - start;
    return {
      status: "DOWN",
      latency,
      errorReason: err.name === "TimeoutError" || err.message?.includes("Timeout") ? "TIMEOUT" : err.message || "UNKNOWN_ERROR",
      bodyText: "",
    };
  }
}
