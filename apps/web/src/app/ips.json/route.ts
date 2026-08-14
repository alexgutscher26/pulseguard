import { NextResponse } from "next/server";
import { CLOUDFLARE_PROBE_REGIONS } from "@pulseguard/shared";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function GET() {
  const allIpv4 = Array.from(
    new Set(CLOUDFLARE_PROBE_REGIONS.flatMap((r) => r.ipv4Ranges)),
  );
  const allIpv6 = Array.from(
    new Set(CLOUDFLARE_PROBE_REGIONS.flatMap((r) => r.ipv6Ranges)),
  );

  return NextResponse.json(
    {
      updated_at: new Date().toISOString(),
      user_agent: "PulseGuard-Monitor/1.0 (+https://pulseguard.io/locations)",
      ipv4: allIpv4,
      ipv6: allIpv6,
      regions: CLOUDFLARE_PROBE_REGIONS.map((r) => ({
        code: r.code,
        covers: r.covers,
        city: r.city,
        ipv4: r.ipv4Ranges,
        ipv6: r.ipv6Ranges,
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
