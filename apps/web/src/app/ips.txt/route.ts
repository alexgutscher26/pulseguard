import { NextResponse } from "next/server";
import { STEADYSTACK_CANONICAL_USER_AGENT } from "@steadystack/shared";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const content = [
    "# SteadyStack Synthetic Probe Allowlist Spec",
    "# Durable Objects egress from Cloudflare's shared global network.",
    "# Static IP allowlisting cannot uniquely identify probe traffic.",
    "# Configure WAF / Reverse Proxy matching with edge headers:",
    "CF-Worker: steadystack.dev",
    `User-Agent: ${STEADYSTACK_CANONICAL_USER_AGENT}`,
    "",
    "# Cloudflare WAF Custom Rule:",
    '# http.request.headers["cf-worker"][0] eq "steadystack.dev"',
  ].join("\n");

  return new NextResponse(content + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
