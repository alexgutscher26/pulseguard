import { NextRequest, NextResponse } from "next/server";
import prisma from "@pulseguard/db";
import { getOverallStatus, getStatusMessage, type BadgeTextConfig } from "@/lib/uptime-calculator";

/**
 * Validate if the origin is allowed based on the configured domains.
 *
 * The function checks if the origin is null (indicating a same-origin request) or if the allowedDomains is set to "*", allowing all origins.
 * If allowedDomains is not configured, it blocks cross-origin requests. It then splits the allowed domains, checks the origin against each domain,
 * and supports wildcard matching for subdomains. If the origin cannot be parsed as a URL, it returns false.
 *
 * @param origin - The origin of the request, which can be a string or null.
 * @param allowedDomains - A comma-separated string of allowed domains or null.
 * @returns True if the origin is allowed, false otherwise.
 */
function validateOrigin(origin: string | null, allowedDomains: string | null): boolean {
  // If no origin header (same-origin request), allow
  if (!origin) return true;
  
  // If widget is configured as open to all
  if (allowedDomains === "*") return true;
  
  // If no domains configured, block cross-origin
  if (!allowedDomains) return false;
  
  const allowed = allowedDomains.split(",").map((d) => d.trim().toLowerCase());
  
  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.hostname.toLowerCase();
    
    return allowed.some((domain) => {
      if (domain.startsWith("*.")) {
        // Wildcard domain match (*.example.com matches sub.example.com)
        const baseDomain = domain.slice(2);
        return originHost.endsWith(baseDomain) && originHost !== baseDomain;
      }
      // Exact domain match
      return originHost === domain;
    });
  } catch {
    return false;
  }
}

/**
 * Handles the GET request for the status of a status page.
 *
 * This function retrieves the status page based on the provided slug, checks if the widget is enabled, validates the origin for CORS, and constructs a response containing the overall status and individual monitor statuses. It also sets appropriate CORS headers based on the request origin.
 *
 * @param request - The NextRequest object representing the incoming request.
 * @param params - An object containing a Promise that resolves to an object with the slug of the status page.
 * @returns A JSON response containing the status information of the status page and monitors.
 * @throws Error If the status page is not found, the widget is not enabled, or the origin is not allowed.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const origin = request.headers.get("origin");

  // Find the status page
  const statusPage = await prisma.statusPage.findUnique({
    where: { slug },
    include: {
      monitors: {
        include: {
          monitor: {
            select: {
              id: true,
              name: true,
              status: true,
            },
          },
        },
      },
    },
  });

  // Page not found or widget not enabled
  if (!statusPage) {
    return NextResponse.json(
      { error: "Status page not found" },
      { status: 404 }
    );
  }

  if (!statusPage.widgetEnabled) {
    return NextResponse.json(
      { error: "Widget is not enabled for this status page" },
      { status: 403 }
    );
  }

  // Validate origin for CORS
  const isAllowed = validateOrigin(origin, statusPage.widgetAllowedDomains);
  
  if (!isAllowed) {
    return NextResponse.json(
      { error: "Origin not allowed" },
      { status: 403 }
    );
  }

  // Build monitor status list
  const monitors = statusPage.monitors.map((spm) => ({
    name: spm.displayName || spm.monitor.name,
    status: spm.monitor.status,
    group: spm.displayGroup || null,
  }));

  // Determine overall status
  const overallStatus = getOverallStatus(
    monitors.map((m) => ({ status: m.status }))
  );

  // Get status message from config or defaults
  const badgeText = statusPage.widgetBadgeText as BadgeTextConfig | null;
  const message = getStatusMessage(overallStatus, badgeText);

  // Build response
  const responseData = {
    status: overallStatus,
    message,
    monitors: monitors.map((m) => ({
      name: m.name,
      status: m.status === "UP" ? "operational" : m.status === "DOWN" ? "down" : m.status.toLowerCase(),
      group: m.group,
    })),
    lastUpdated: new Date().toISOString(),
    page: {
      title: statusPage.title,
      slug: statusPage.slug,
    },
  };

  // Build CORS headers
  const corsHeaders: HeadersInit = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "public, max-age=60, s-maxage=60",
  };

  // Only set Allow-Origin if there's an origin
  if (origin && isAllowed) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  return NextResponse.json(responseData, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * OPTIONS handler for CORS preflight.
 *
 * This function processes CORS preflight requests by checking the status page associated with the provided slug.
 * It retrieves the allowed domains and validates the origin of the request. If the status page is not found or
 * the widget is disabled, a 404 response is returned. If the origin is not allowed, a 403 response is sent.
 * Otherwise, it sets the appropriate CORS headers and returns a 204 response.
 *
 * @param request - The incoming NextRequest object.
 * @param params - An object containing a Promise that resolves to an object with a slug property.
 */
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const origin = request.headers.get("origin");

  // Find the status page to check allowed domains
  const statusPage = await prisma.statusPage.findUnique({
    where: { slug },
    select: {
      widgetEnabled: true,
      widgetAllowedDomains: true,
    },
  });

  if (!statusPage || !statusPage.widgetEnabled) {
    return new NextResponse(null, { status: 404 });
  }

  const isAllowed = validateOrigin(origin, statusPage.widgetAllowedDomains);

  if (!isAllowed) {
    return new NextResponse(null, { status: 403 });
  }

  const corsHeaders: HeadersInit = {
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };

  if (origin) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
