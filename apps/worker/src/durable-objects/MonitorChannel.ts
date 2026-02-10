import { DurableObject } from "cloudflare:workers";
import { getPrisma } from "@pulseguard/db";

interface Env {
  DATABASE_URL: string;
}

export class MonitorChannel extends DurableObject {
  private sessions: Set<WebSocket> = new Set();
  private env: Env;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.env = env;
    // Recover existing websockets if the DO was Hibernated (Serverless mode)
    // and we want to persist connections. 
    // For now, we'll just track active ones in memory.
    this.ctx.getWebSockets().forEach((ws) => {
      this.sessions.add(ws);
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle WebSocket Upgrade
    if (url.pathname === "/websocket") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      const monitorId = url.searchParams.get("monitorId");
      if (!monitorId) {
        return new Response("Missing Monitor ID", { status: 400 });
      }

      // Authenticate
      const userId = await this.authenticate(request);
      if (!userId) {
        return new Response("Unauthorized", { status: 401 });
      }

      // Authorize
      const authorized = await this.authorize(userId, monitorId);
      if (!authorized) {
        return new Response("Forbidden", { status: 403 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      // Handle the server side of the socket
      // @ts-ignore - Cloudflare types nuance
      this.handleSession(server);

      return new Response(null, {
        status: 101,
        // @ts-ignore - Cloudflare types nuance
        webSocket: client,
      });
    }

    // 2. Handle Broadcast (Internal API)
    // Called by the Monitor Runner Worker to push updates
    if (request.method === "POST" && url.pathname === "/broadcast") {
      try {
        const payload = await request.json();
        this.broadcast(payload);
        return new Response(JSON.stringify({ success: true, receivers: this.sessions.size }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        return new Response("Invalid JSON", { status: 400 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const list: Record<string, string> = {};
    cookieHeader.split(';').forEach(function(cookie) {
      const parts = cookie.split('=');
      const name = parts.shift()?.trim();
      const value = decodeURI(parts.join('='));
      if (name) list[name] = value;
    });
    return list;
  }

  private async authenticate(request: Request): Promise<string | null> {
    const cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader) return null;

    const cookies = this.parseCookies(cookieHeader);
    const sessionToken = cookies["better-auth.session_token"];

    if (!sessionToken) return null;

    try {
      const prisma = getPrisma(this.env.DATABASE_URL);
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        select: { userId: true, expiresAt: true }
      });

      if (!session) return null;
      if (session.expiresAt < new Date()) return null;

      return session.userId;
    } catch (e) {
      console.error("Authentication error:", e);
      return null;
    }
  }

  private async authorize(userId: string, monitorId: string): Promise<boolean> {
    try {
      const prisma = getPrisma(this.env.DATABASE_URL);
      const monitor = await prisma.monitor.findUnique({
        where: { id: monitorId },
        select: { userId: true }
      });

      if (!monitor) return false;
      return monitor.userId === userId;
    } catch (e) {
      console.error("Authorization error:", e);
      return false;
    }
  }

  private handleSession(ws: WebSocket) {
    // Accept the websocket
    this.ctx.acceptWebSocket(ws);
    this.sessions.add(ws);

    // Set up event listeners
    // Note: In Cloudflare DOs, we use this.ctx.acceptWebSocket(ws) which handles the "open" state.
    // We mainly care about close/error here to remove from the set.
    // However, the standard way with `ctx.acceptWebSocket` is to rely on `webSocketMessage` / `webSocketClose` handlers
    // on the class itself if we want to use the hibernation API, OR standard event listeners if not hibernating.
    // For simplicity in this Phase 1, we will use standard event listeners on the socket instance.
    
    ws.addEventListener("close", () => {
      this.sessions.delete(ws);
    });

    ws.addEventListener("error", () => {
      this.sessions.delete(ws);
    });
  }

  private broadcast(data: any) {
    const message = JSON.stringify(data);
    this.sessions.forEach((ws) => {
      try {
        ws.send(message);
      } catch (e) {
        // Remove dead connections
        this.sessions.delete(ws);
      }
    });
  }
}
