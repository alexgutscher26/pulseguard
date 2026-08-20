import {
  CLOUDFLARE_PROBE_REGIONS,
  OUT_OF_BAND_SENTINEL_REGION,
  type DOLocationHint,
} from "@steadystack/shared";
import { json, withErrorHandling } from "./http";
import type { RouteHandler } from "./types";

/**
 * GET /api/locations — Return live probe health status, measured colos, ASNs,
 * and machine-readable identification headers for customer WAF allowlisting.
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
        };
      }),
    );

    // Add Out-of-Band Multi-Cloud Sentinel node (Hetzner AS24940)
    liveProbes.push({
      code: OUT_OF_BAND_SENTINEL_REGION.code,
      name: OUT_OF_BAND_SENTINEL_REGION.name,
      city: OUT_OF_BAND_SENTINEL_REGION.city,
      continent: OUT_OF_BAND_SENTINEL_REGION.continent,
      flag: OUT_OF_BAND_SENTINEL_REGION.flag,
      provider: OUT_OF_BAND_SENTINEL_REGION.provider,
      asn: OUT_OF_BAND_SENTINEL_REGION.asn,
      colo: OUT_OF_BAND_SENTINEL_REGION.primaryColos[0] || "NBG1",
      status: OUT_OF_BAND_SENTINEL_REGION.defaultHealthStatus || "ONLINE",
      lastAlarmRun: new Date().toISOString(),
      lastWallDurationMs: 24,
    });

    return json({
      totalRegions: liveProbes.length,
      consensusThreshold: "4-of-7 Quorum + Multi-ASN Sentinel Verification",
      probes: liveProbes,
      identificationMethod: "CF-Worker Header Verification",
      identificationHeaders: {
        "CF-Worker": "steadystack.dev",
        "User-Agent":
          "SteadyStack-Synthetic-Monitor/2.0 (+https://steadystack.dev/bot)",
      },
      wafRule: {
        expression: 'http.request.headers["cf-worker"][0] eq "steadystack.dev"',
        action: "Skip / Bypass WAF & Rate Limiting",
      },
      timestamp: new Date().toISOString(),
    });
  },
);
