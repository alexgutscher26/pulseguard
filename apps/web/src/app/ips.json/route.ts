import { NextResponse } from "next/server";
import { CLOUDFLARE_PROBE_REGIONS } from "@pulseguard/shared";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  return NextResponse.json(
    {
      updated_at: new Date().toISOString(),
      identification_method: "CF-Worker Header Verification",
      notice:
        "PulseGuard synthetic probes execute via Cloudflare Durable Objects, which egress from Cloudflare's shared global edge IP pool. Static IP allowlisting cannot uniquely identify probe traffic without permitting shared edge egress. Configure your WAF or reverse proxy to match on the authentic CF-Worker header and User-Agent.",
      identification_headers: {
        "CF-Worker": "pulseguard.io",
        "User-Agent": "PulseGuard-Monitor/1.0 (+https://pulseguard.io/bot)",
      },
      waf_rules: {
        cloudflare: 'http.request.headers["cf-worker"][0] eq "pulseguard.io"',
        cloudflare_action: "Skip / Bypass WAF & Rate Limiting",
      },
      regions: CLOUDFLARE_PROBE_REGIONS.map((r) => ({
        code: r.code,
        covers: r.covers,
        city: r.city,
        continent: r.continent,
        provider: r.provider,
        asn: r.asn,
      })),
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
