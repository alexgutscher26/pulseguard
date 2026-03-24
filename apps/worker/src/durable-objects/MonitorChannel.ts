import { DurableObject } from "cloudflare:workers";

interface Env {
  // Add other bindings here if needed
}

export class MonitorChannel extends DurableObject {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    // With DO Hibernation, Cloudflare persists the WebSocket state automatically.
    // There is no need to manually recover or track subsets of active connections!
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle WebSocket Upgrade
    if (url.pathname === "/websocket") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      // Security Validation: Deep Authentication (Session + Ownership or Public Status Page)
      // is completely enforced at the Worker Gateway (`src/index.ts`) before forwarding to this DO.
      // Since DOs are not internet-routable directly, this is strictly secure.

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

  webSocketMessage() {
    // No incoming client messages are expected for the read-only dashboard feed.
  }

  webSocketClose() {
    // Cloudflare natively drops `_ws` from `this.ctx.getWebSockets()` automatically!
    // No manual array `.delete(ws)` logic needed.
  }

  webSocketError() {
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
