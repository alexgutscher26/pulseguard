import type { MonitorStatus } from "@pulseguard/types";

/**
 * Universal port connection checker that automatically detects the runtime environment.
 * Supports:
 * - Node.js (via net.connect)
 * - Cloudflare Workers (via cloudflare:sockets)
 * - Standard fetch bypass for HTTP(S) ports 80 and 443
 */
/**
 * Formats a detailed, developer-friendly diagnostic trace when a network socket check or fetch fails.
 */
export function diagnoseError(err: any, target: string): string {
  const msg = err.message || "";
  const name = err.name || "";
  const code = err.code || "";

  // 1. Timeout
  if (name === "TimeoutError" || msg.includes("Timeout") || msg.includes("timeout")) {
    return `TIMEOUT: Request timed out.
• Target: ${target}
• Stage: Response Transmission
• Diagnostics: Connection was established, but the server failed to transmit a response within the timeout limit.
• Action: Inspect server capacity, slow database queries, or frozen process pools.`;
  }

  // 2. DNS Resolution Failure
  if (
    code === "ENOTFOUND" ||
    msg.includes("getaddrinfo") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("dns") ||
    msg.includes("DNS")
  ) {
    return `DNS_FAILURE: DNS Lookup failed.
• Target: ${target}
• Stage: Domain Resolution
• Diagnostics: The hostname could not be resolved to any active IP address.
• Action: Verify domain registration status and check that valid A/AAAA DNS records are configured.`;
  }

  // 3. Connection Refused
  if (code === "ECONNREFUSED" || msg.includes("ECONNREFUSED") || msg.includes("refused")) {
    return `CONNECTION_REFUSED: TCP Handshake failed.
• Target: ${target}
• Stage: TCP Handshake
• Diagnostics: The target host is active, but actively rejected the connection request on this port.
• Action: Verify that the web server process (e.g. Node, Nginx) is running, listening, and that firewall policies permit traffic.`;
  }

  // 4. SSL/TLS Handshake Failures
  if (
    code.includes("CERT") ||
    msg.includes("cert") ||
    msg.includes("ssl") ||
    msg.includes("SSL") ||
    msg.includes("tls") ||
    msg.includes("TLS") ||
    msg.includes("expired") ||
    msg.includes("depth") ||
    msg.includes("handshake")
  ) {
    return `SSL_ERROR: TLS Handshake failed.
• Target: ${target}
• Stage: SSL/TLS Negotiation
• Diagnostics: Could not establish a secure, verified cryptographic channel.
• Action: Check if the SSL certificate has expired, has a hostname mismatch, or uses an untrusted Certificate Authority.`;
  }

  // 5. Connection Reset/Aborted
  if (code === "ECONNRESET" || msg.includes("ECONNRESET") || msg.includes("reset")) {
    return `CONNECTION_RESET: Connection terminated abruptly.
• Target: ${target}
• Stage: TCP Connection
• Diagnostics: The connection was closed mid-transmission by the target server or an intermediate proxy/firewall.
• Action: Check server-side proxy limits, rate limiters, or firewall settings.`;
  }

  return `CONNECTION_FAILED: Request failed (${msg || code || "Unknown error"}).
• Target: ${target}
• Stage: Request Dispatch
• Diagnostics: An error occurred before receiving the HTTP response headers.
• Action: Verify network route availability to the target server.`;
}

/**
 * Formats a detailed diagnostic trace for unhealthy HTTP status codes.
 */
export function diagnoseStatus(status: number, target: string): string {
  if (status === 502) {
    return `HTTP_502: Bad Gateway.
• Target: ${target}
• Stage: Proxy Upstream
• Diagnostics: The proxy server (e.g. Cloudflare, Nginx, ALB) received an invalid response from the backend application process.
• Action: Check if the application server process (e.g. PM2, Docker container) crashed, failed to start, or returned malformed headers.`;
  }

  if (status === 504) {
    return `HTTP_504: Gateway Timeout.
• Target: ${target}
• Stage: Proxy Upstream
• Diagnostics: The gateway server timed out waiting for the upstream application server to respond.
• Action: Investigate slow application handlers, database latency spikes, or infinite process loops.`;
  }

  if (status === 500) {
    return `HTTP_500: Internal Server Error.
• Target: ${target}
• Stage: Application Execution
• Diagnostics: The server encountered an unhandled exception or critical runtime crash while rendering the request.
• Action: Inspect your application server runtime logs for unhandled exceptions or stack traces.`;
  }

  if (status === 503) {
    return `HTTP_503: Service Unavailable.
• Target: ${target}
• Stage: Server Availability
• Diagnostics: The server is temporarily overloaded or down for planned maintenance.
• Action: Monitor RAM/CPU utilization and verify if a server deploy is in progress.`;
  }

  if (status === 404) {
    return `HTTP_404: Not Found.
• Target: ${target}
• Stage: Resource Routing
• Diagnostics: The server is online, but the requested URI path does not map to any active routes.
• Action: Double check that the request path is configured correctly in the client and server route files.`;
  }

  return `HTTP_${status}: Unhealthy Status Code.
• Target: ${target}
• Stage: HTTP Handshake
• Diagnostics: The request completed, but the status code was classified as unhealthy.
• Action: Verify server endpoint routing logic.`;
}

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
  const targetStr = `${host}:${port}`;

  // 1. HTTP/S Port check using fetch bypass
  if (port === 80 || port === 443) {
    try {
      const protocol = port === 443 ? "https" : "http";
      const signal = AbortSignal.timeout(timeoutMs);
      await fetch(`${protocol}://${host}`, { method: "HEAD", signal });
      return { isOpen: true, latency: Date.now() - start, status: "OPEN" };
    } catch (e: any) {
      return { isOpen: false, latency: 0, status: "CLOSED", errorReason: diagnoseError(e, targetStr) };
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
          resolve({
            isOpen: false,
            latency: 0,
            status: "TIMEOUT",
            errorReason: `TIMEOUT: Connection timed out.\n• Target: ${targetStr}\n• Diagnostics: Handshake timed out after ${timeoutMs}ms.`,
          });
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
          resolve({ isOpen: false, latency: 0, status: "CLOSED", errorReason: diagnoseError(err, targetStr) });
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
    return { isOpen: false, latency: 0, status, errorReason: diagnoseError(err, targetStr) };
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
      errorReason: isHealthyStatus ? undefined : diagnoseStatus(response.status, urlStr),
      bodyText,
      statusCode: statusNum,
    };
  } catch (err: any) {
    const latency = Date.now() - start;
    return {
      status: "DOWN",
      latency,
      errorReason: diagnoseError(err, urlStr),
      bodyText: "",
    };
  }
}
