import { AppError } from "../errors";
import { json, requireJsonBody, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * POST /api/dns-audit — run a DNS configuration audit for a domain.
 */
export const dnsAuditRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/dns-audit" || request.method !== "POST") return null;

  const { domain: targetDomain } = await requireJsonBody(request);
  if (!targetDomain) throw new AppError(400, "Missing 'domain' body param");

  const { auditDNS } = await import("../services/dns-audit");
  const results = await auditDNS(targetDomain);

  return json(results);
});

/**
 * POST /api/payload-audit — run a payload/pattern audit against a URL.
 */
export const payloadAuditRoute: RouteHandler = withErrorHandling(async ({ request }, url) => {
  if (url.pathname !== "/api/payload-audit" || request.method !== "POST") return null;

  const { url: targetUrl, pattern } = await requireJsonBody(request);
  if (!targetUrl) throw new AppError(400, "Missing 'url' body param");

  const finalUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;

  const { auditPayload } = await import("../services/payload-audit");
  const results = await auditPayload(finalUrl, pattern);

  return json(results);
});
