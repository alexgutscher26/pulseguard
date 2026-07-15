import { DurableObject } from "cloudflare:workers";
import { getPrisma } from "@pulseguard/db";

interface Env {
  // Add other bindings here if needed
  DATABASE_URL: string;
}

export class MonitorChannel extends DurableObject {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    // With DO Hibernation, Cloudflare persists the WebSocket state automatically.
    // There is no need to manually recover or track subsets of active connections!
  }

  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle WebSocket Upgrade
    if (url.pathname === "/websocket") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      // Security Validation: Deep Authentication (Session + Ownership or Public Status Page)
      // is completely enforced at the Worker Gateway (`src/index.ts`) before forwarding to this DO.
      // Since DOs are not internet-routable directly, this is strictly secure.

      const monitorId = url.searchParams.get("monitorId");
      if (!monitorId) {
        return new Response("Missing Monitor ID", { status: 400 });
      }

      const cookieHeader = request.headers.get("Cookie");
      let rawToken = url.searchParams.get("token");

      if (!rawToken && cookieHeader) {
        const secureMatch = cookieHeader.match(/__Secure-better-auth\.session_token=([^;]+)/);
        const regularMatch = cookieHeader.match(/better-auth\.session_token=([^;]+)/);
        rawToken = secureMatch?.[1] || regularMatch?.[1] || null;
      }

      let isAuthenticated = false;

      // @ts-ignore - this.env is typed differently in different versions, but available
      const env = this.env as Env;

      if (env.DATABASE_URL) {
        let prisma = getPrisma(env.DATABASE_URL);

        const performHandshake = async (retry: boolean = true): Promise<Response | null> => {
          try {
            if (rawToken) {
              const token = decodeURIComponent(rawToken);
              const session = await prisma.session.findUnique({
                where: { token },
                select: { userId: true, expiresAt: true },
              });

              if (session && session.expiresAt > new Date()) {
                const monitor = await prisma.monitor.findUnique({
                  where: { id: monitorId },
                  select: { userId: true },
                });

                if (monitor && monitor.userId === session.userId) {
                  isAuthenticated = true;
                }
              }
            }

            if (!isAuthenticated) {
              // Fallback: Check if monitor is exposed on any public Status Page
              const publicMonitor = await prisma.statusPageMonitor.findFirst({
                where: {
                  monitorId: monitorId,
                  statusPage: { isPrivate: false },
                },
              });

              if (publicMonitor) {
                isAuthenticated = true; // Mark as authenticated via public access
              }
            }
            return null;
          } catch (err: any) {
            if (
              retry &&
              (err.message?.includes("Connection terminated unexpectedly") ||
                err.message?.includes("is closed") ||
                err.message?.includes("not found"))
            ) {
              console.warn(`[MonitorChannel WS] Stale DB connection detected. Resetting Prisma...`);
              const { resetPrisma } = await import("@pulseguard/db");
              await resetPrisma(env.DATABASE_URL);
              prisma = getPrisma(env.DATABASE_URL);
              return await performHandshake(false);
            }
            throw err;
          }
        };

        const authResponse = await performHandshake();
        if (authResponse) return authResponse;
      } else {
        // Fallback or warning if no DB URL is provided in the DO env
        console.warn("[MonitorChannel] No DATABASE_URL provided in Env, skipping deep DO auth.");
        // We'll trust the Worker Gateway if we can't check
        isAuthenticated = true;
      }

      if (!isAuthenticated) {
        return new Response("Unauthorized", { status: 401 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      // Handle the server side of the socket natively (Opts into Hibernation API)
      // @ts-ignore - Cloudflare types nuance
      this.ctx.acceptWebSocket(server);

      return new Response(null, {
        status: 101,
        // @ts-ignore - Cloudflare types nuance
        webSocket: client,
      });
    }

    // 2. Handle Broadcast (Internal API)
    if (request.method === "POST" && url.pathname === "/broadcast") {
      try {
        const payload = await request.json();
        const activeConnections = this.broadcast(payload);

        return new Response(JSON.stringify({ success: true, receivers: activeConnections }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response("Invalid JSON", { status: 400 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  // =========================================================================
  // DO HIBERNATION API METHODS
  // Defining these on the prototype instructs Cloudflare to automatically
  // hibernate this DO and wake it ONLY when events fire, drastically reducing CPU time.
  // =========================================================================

  override webSocketMessage() {
    // No incoming client messages are expected for the read-only dashboard feed.
  }

  override webSocketClose() {
    // Cloudflare natively drops `_ws` from `this.ctx.getWebSockets()` automatically!
    // No manual array `.delete(ws)` logic needed.
  }

  override webSocketError() {
    // Automatically handled by the underlying DO container.
  }

  private broadcast(data: any): number {
    const message = JSON.stringify(data);
    const sockets = this.ctx.getWebSockets();

    sockets.forEach((ws) => {
      try {
        ws.send(message);
      } catch (e) {
        // Just in case a socket is closing in transit, preventing the loop from crashing
      }
    });

    return sockets.length;
  }
}
