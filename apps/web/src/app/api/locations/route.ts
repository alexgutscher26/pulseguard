import { NextResponse } from "next/server";
import { ALL_PROBE_REGIONS } from "@steadystack/shared";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * GET /api/locations — Public machine-readable JSON endpoint for customer WAF / Firewall allowlisting
 */
export async function GET() {
  const probeNodes = ALL_PROBE_REGIONS.map((region) => ({
    code: region.code,
    name: region.name,
    covers: region.covers,
    city: region.city,
    continent: region.continent,
    flag: region.flag,
    provider: region.provider,
    asn: region.asn,
    primaryColos: region.primaryColos,
    isCloudflareDO: region.isCloudflareDO,
    status: region.defaultHealthStatus || "ONLINE",
  }));

  return NextResponse.json(
    {
      platform: "SteadyStack Global Edge Mesh",
      consensusEngine: "4-of-7 Quorum + Multi-ASN Sentinel Verification",
      totalRegions: ALL_PROBE_REGIONS.length,
      lastUpdated: new Date().toISOString(),
      identificationMethod: "CF-Worker Header Verification",
      identificationHeaders: {
        "CF-Worker": "steadystack.dev",
        "User-Agent": "SteadyStack-Monitor/1.0 (+https://steadystack.dev/bot)",
      },
      wafRule: {
        expression: 'http.request.headers["cf-worker"][0] eq "steadystack.dev"',
        action: "Skip / Bypass WAF & Rate Limiting",
      },
      probes: probeNodes,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
