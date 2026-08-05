import type { ExecutionContext } from "@cloudflare/workers-types";
import type { Env } from "../env";
import { CORS_HEADERS } from "./http";
import type { RouteHandler } from "./types";
import { websocketRoute } from "./websocket";
import { debugFetchRoute } from "./debug";
import { checkNowRoute } from "./check-now";
import { broadcastRoute } from "./broadcast";
import { dnsAuditRoute, payloadAuditRoute } from "./audits";
import {
  bgpCheckRoute,
  databaseCheckRoute,
  dnsWatchdogRoute,
  domainExpirationRoute,
  globalLatencyRoute,
  graphqlCheckRoute,
  mcpCheckRoute,
  portCheckRoute,
  securityHeadersRoute,
  sslCheckRoute,
  websocketCheckRoute,
} from "./checks";
import { heartbeatRoute } from "./heartbeat";
import {
  probeHeartbeatRoute,
  probePollRoute,
  probeRegisterRoute,
  probeResultRoute,
} from "./probes";

export type { RouteHandler } from "./types";

// Routes are evaluated in order; the first handler that returns a Response
// owns the request. Order matters where paths overlap.
export const ROUTES: RouteHandler[] = [
  websocketRoute,
  debugFetchRoute,
  checkNowRoute,
  broadcastRoute,
  dnsAuditRoute,
  payloadAuditRoute,
  securityHeadersRoute,
  sslCheckRoute,
  portCheckRoute,
  heartbeatRoute,
  dnsWatchdogRoute,
  domainExpirationRoute,
  mcpCheckRoute,
  graphqlCheckRoute,
  websocketCheckRoute,
  databaseCheckRoute,
  bgpCheckRoute,
  globalLatencyRoute,
  probeRegisterRoute,
  probePollRoute,
  probeResultRoute,
  probeHeartbeatRoute,
];

/**
 * Dispatch an incoming request to the registered route handlers. Returns the
 * CORS preflight response for OPTIONS requests and a plain health response
 * when no route matches.
 */
export async function handleFetch(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  url: URL,
): Promise<Response> {
  for (const handler of ROUTES) {
    const response = await handler({ request, env, ctx }, url);
    if (response) return response;
  }

  // CORS Preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  return new Response("PulseGuard Worker is Running", { status: 200 });
}
