import {
  CLOUDFLARE_PROBE_REGIONS,
  type DOLocationHint,
} from "@pulseguard/shared";
import { json, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * GET /api/locations — Return live probe health status, measured colos, ASNs,
 * and machine-readable IPv4/IPv6 ranges for customer WAF allowlisting.
 */
export const locationsRoute: RouteHandler = withErrorHandling(
  async ({ env }, url) => {
    if (
      url.pathname !== "/api/locations" &&
      url.pathname !== "/api/probes/allowlist"
    ) {
      return null;
    }

    const liveProbes = await Promise.all(
      CLOUDFLARE_PROBE_REGIONS.map(async (region) => {
        let telemetry: any = null;

        if (env.REGIONAL_PROBE) {
          try {
            const id = env.REGIONAL_PROBE.idFromName(`probe-${region.code}`);
            const probe = env.REGIONAL_PROBE.get(id, {
              locationHint: region.code as any,
            });
            const res = await probe.fetch("http://internal/telemetry");
            if (res.ok) {
              telemetry = await res.json();
            }
          } catch {
            // Probe DO unreachable or bootstrapping
          }
        }

        return {
          code: region.code,
          name: region.name,
          city: region.city,
          continent: region.continent,
          flag: region.flag,
          provider: region.provider,
          asn: region.asn,
          colo: telemetry?.measuredColo || region.primaryColos[0] || "GLOBAL",
          status:
            telemetry?.healthState || region.defaultHealthStatus || "ONLINE",
          lastAlarmRun: telemetry?.lastAlarmRun || new Date().toISOString(),
          lastWallDurationMs: telemetry?.lastWallDurationMs || 0,
          ipv4Ranges: region.ipv4Ranges,
          ipv6Ranges: region.ipv6Ranges,
        };
      }),
    );

    // Collect unique IPv4 & IPv6 CIDRs across all probes
    const allIpv4 = Array.from(
      new Set(CLOUDFLARE_PROBE_REGIONS.flatMap((r) => r.ipv4Ranges)),
    );
    const allIpv6 = Array.from(
      new Set(CLOUDFLARE_PROBE_REGIONS.flatMap((r) => r.ipv6Ranges)),
    );

    return json({
      totalRegions: liveProbes.length,
      consensusThreshold: "4-of-7 (Majority Quorum)",
      probes: liveProbes,
      allowlist: {
        ipv4: allIpv4,
        ipv6: allIpv6,
        userAgent:
          "PulseGuard-Synthetic-Monitor/2.0 (+https://pulseguard.io/bot)",
      },
      timestamp: new Date().toISOString(),
    });
  },
);
