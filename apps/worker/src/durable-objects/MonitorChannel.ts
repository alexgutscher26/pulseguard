import { DurableObject } from "cloudflare:workers";

interface Env {
  // Add other bindings here if needed
}

export class MonitorChannel extends DurableObject {
  private sessions: Set<WebSocket> = new Set();

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    // Recover existing websockets if the DO was Hibernated (Serverless mode)
    // and we want to persist connections. 
    // For now, we'll just track active ones in memory.
    this.ctx.getWebSockets().forEach((ws) => {
      this.sessions.add(ws);
    });
  }

  /**
   * Fetch and handle incoming requests for WebSocket connections and broadcast updates.
   *
   * The function first checks if the request is for a WebSocket upgrade and validates the upgrade header.
   * If valid, it establishes a WebSocket connection. If the request is a POST to "/broadcast", it attempts
   * to parse the JSON payload and broadcasts it to connected sessions. If the request does not match any
   * expected routes, it returns a 404 response.
   *
   * @param request - The incoming Request object containing the request details.
   * @returns A Promise that resolves to a Response object indicating the result of the request handling.
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle WebSocket Upgrade
    if (url.pathname === "/websocket") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
      }

      // TODO: Authenticate the user here using the cookie or token from request headers.
      // For Phase 1 validation, we might skip deep auth check inside DO 
      // if it's already done by the Worker wrapper, but ideally DO checks too.
      
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
