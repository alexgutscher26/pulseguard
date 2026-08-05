import { AppError } from "../errors";
import { json, requireJsonBody, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

function normalizeUrl(targetUrl: string): string {
  return targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
}

/**
 * POST /api/security-headers — audit security headers of a URL.
 */
export const securityHeadersRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/security-headers" || request.method !== "POST") return null;

  const { url: targetUrl } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const { checkSecurityHeaders } = await import("../services/security-headers");
  const results = await checkSecurityHeaders(normalizeUrl(targetUrl));

  return json(results);
});

/**
 * POST /api/ssl-check — check the SSL certificate of a URL.
 */
export const sslCheckRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/ssl-check" || request.method !== "POST") return null;

  const { url: targetUrl } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const { checkSSL } = await import("../services/ssl-check");
  const results = await checkSSL(targetUrl);

  return json(results);
});

/**
 * POST /api/port-check — check whether a TCP port is open on a host.
 */
export const portCheckRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/port-check" || request.method !== "POST") return null;

  const { host, port } = await requireJsonBody(request);
  if (!host || !port) throw new AppError(400, "Missing host or port");

  const { checkPort } = await import("../services/port-check");
  const result = await checkPort(host, parseInt(port));

  return json(result);
});

/**
 * POST /api/dns-watchdog — check DNS records of a domain against expected IPs.
 */
export const dnsWatchdogRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/dns-watchdog" || request.method !== "POST") return null;

  const { domain, expectedIPs } = await requireJsonBody(request);
  if (!domain) throw new AppError(400, "Missing 'domain' body param");

  const { checkDNSWatchdog } = await import("../services/dns-watchdog");
  const results = await checkDNSWatchdog(domain, expectedIPs || []);

  return json(results);
});

/**
 * POST /api/domain-expiration — check a domain's registration expiry status.
 */
export const domainExpirationRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/domain-expiration" || request.method !== "POST") return null;

  const { domain } = await requireJsonBody(request);
  if (!domain) throw new AppError(400, "Missing 'domain' body param");

  const { checkDomainExpiration } = await import("../services/domain-expiration");
  const results = await checkDomainExpiration(domain);

  return json(results);
});

/**
 * POST /api/mcp-check — run an MCP server check.
 */
export const mcpCheckRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/mcp-check" || request.method !== "POST") return null;

  const { url: targetUrl, method, params, assertions } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const { checkMCP } = await import("../services/mcp-sentinel");
  const results = await checkMCP(normalizeUrl(targetUrl), assertions || [], method, params);

  return json(results);
});

/**
 * POST /api/graphql-check — run a GraphQL endpoint check.
 */
export const graphqlCheckRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/graphql-check" || request.method !== "POST") return null;

  const {
    url: targetUrl,
    query,
    operationName,
    assertions,
    variables,
  } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const { checkGraphQL } = await import("../services/graphql-monitor");
  const results = await checkGraphQL(
    normalizeUrl(targetUrl),
    query,
    operationName,
    assertions,
    variables,
  );

  return json(results);
});

/**
 * POST /api/websocket-check — check a WebSocket endpoint.
 */
export const websocketCheckRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/websocket-check" || request.method !== "POST") return null;

  const { url: targetUrl, listenSeconds, assertion } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const { checkWebSocket } = await import("../services/websocket-monitor");
  const results = await checkWebSocket(targetUrl, listenSeconds || 5, assertion);

  return json(results);
});

/**
 * POST /api/database-check — run a database connectivity/query check.
 */
export const databaseCheckRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/database-check" || request.method !== "POST") return null;

  const { connectionUrl, query, expectation } = await requireJsonBody(request);
  if (!connectionUrl) throw new AppError(400, "Missing 'connectionUrl' body param");

  const { checkDatabase } = await import("../services/database-monitor");
  const results = await checkDatabase(connectionUrl, query, expectation);

  return json(results);
});

/**
 * POST /api/bgp-check — check a BGP route/ASN for a prefix.
 */
export const bgpCheckRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/bgp-check" || request.method !== "POST") return null;

  const { url: targetUrl, expectedAsn, expectedPrefix } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const { checkBGPTRoute } = await import("../services/bgp-monitor");
  const expectation = expectedAsn || expectedPrefix ? { expectedAsn, expectedPrefix } : undefined;
  const results = await checkBGPTRoute(targetUrl, expectation);

  return json(results);
});

/**
 * POST /api/global-latency — measure latency from multiple global regions.
 */
export const globalLatencyRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/global-latency" || request.method !== "POST") return null;

  const { url: targetUrl } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const { checkGlobalLatency } = await import("../services/global-latency");
  const results = await checkGlobalLatency(normalizeUrl(targetUrl));

  return json(results);
});
