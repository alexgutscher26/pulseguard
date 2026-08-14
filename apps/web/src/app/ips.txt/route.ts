import { NextResponse } from "next/server";
import { CLOUDFLARE_PROBE_REGIONS } from "@pulseguard/shared";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const allIpv4 = Array.from(
    new Set(CLOUDFLARE_PROBE_REGIONS.flatMap((r) => r.ipv4Ranges)),
  );

  return new NextResponse(allIpv4.join("\n") + "\n", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
