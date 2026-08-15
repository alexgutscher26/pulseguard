import { NextResponse } from "next/server";
import { CLOUDFLARE_PROBE_REGIONS } from "@pulseguard/shared";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const content = [
    "# PulseGuard Synthetic Probe Allowlist Spec (IPv6)",
    "# Durable Objects egress from Cloudflare's shared global network.",
    "# Static IPv6 allowlisting cannot uniquely identify probe traffic.",
    "# Configure WAF / Reverse Proxy matching with edge headers:",
    "CF-Worker: pulseguard.io",
    "User-Agent: PulseGuard-Monitor/1.0 (+https://pulseguard.io/bot)",
    "",
    "# Cloudflare WAF Custom Rule:",
    '# http.request.headers["cf-worker"][0] eq "pulseguard.io"',
  ].join("\n");

  return new NextResponse(content + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
